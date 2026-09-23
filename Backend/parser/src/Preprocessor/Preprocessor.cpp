#include "ResumeParser/Preprocessor/Preprocessor.h"
#include "ResumeParser/SectionClassifer/SectionClassifer.h"
#include <algorithm>
#include <unordered_set>

namespace ResumeParser {
std::string Preprocessor::remove_whitespace(const std::string &text) {
  auto start = text.find_first_not_of(" \t\r\n");
  auto end = text.find_last_not_of(" \t\r\n");

  if (start == std::string::npos) {
    return "";
  }
  return text.substr(start, end - start + 1);
}
std::string Preprocessor::collapse_space(const std::string &text) {
  bool lastwasSpace{false};

  std::string result{};

  for (const auto &c : text) {
    if (c == ' ') {
      if (!lastwasSpace) {
        result += c;
      }
      lastwasSpace = true;
    } else {
      result += c;
      lastwasSpace = false;
    }
  }
  return result;
}
std::vector<TextBlock>
Preprocessor::normalize(const std::vector<TextBlock> &blocks) {
  auto result = blocks;

  for (auto &block : result) {
    block.text = collapse_space(remove_whitespace(block.text));
  }
  return result;
}

std::vector<Line>
Preprocessor::mergeByLineId(const std::vector<TextBlock> &blocks) {
  std::vector<Line> result{};

  for (const auto &block : blocks) {
    if (!result.empty() && result.back().lineId == block.lineId) {
      Line &curr = result.back();
      if (!curr.text.empty()) {
        curr.text += " ";
      }
      curr.text += block.text;
      curr.bold = curr.bold && block.bold;
      curr.italic = curr.italic && block.italic;
      curr.fontSize = std::max(curr.fontSize, block.fontSize);
    } else {
      result.push_back(Line{.text = block.text,
                            .bold = block.bold,
                            .italic = block.italic,
                            .fontSize = block.fontSize,
                            .pageNumber = block.pageNumber,
                            .lineId = block.lineId});
    }
  }
  return result;
}

std::vector<Line>
Preprocessor::mergeByPosition(const std::vector<TextBlock> &blocks) {
  std::vector<TextBlock> copy = blocks;

  std::sort(copy.begin(), copy.end(),
            [](const TextBlock &a, const TextBlock &b) {
              if (a.pageNumber == b.pageNumber) {
                if (a.y != b.y)
                  return a.y < b.y;
                return a.x < b.x;
              }
              return a.pageNumber < b.pageNumber;
            });

  std::vector<Line> result;
  const float tolerance = 0.01;
  float currLineY = 0.0f;
  bool started = false;

  for (const auto &block : copy) {
    bool newline = !started || block.pageNumber != result.back().pageNumber ||
                   std::abs(currLineY - block.y) > tolerance;

    if (newline) {
      result.push_back(Line{.text = block.text,
                            .bold = block.bold,
                            .italic = block.italic,
                            .fontSize = block.fontSize,
                            .pageNumber = block.pageNumber,
                            .lineId = block.lineId});
      currLineY = block.y;
      started = true;
    } else {
      Line &curr = result.back();
      if (!curr.text.empty()) {
        curr.text += " ";
      }
      curr.text += block.text;
      curr.bold = curr.bold && block.bold;
      curr.italic = curr.italic && block.italic;
      curr.fontSize = std::max(curr.fontSize, block.fontSize);
    }
  }

  return result;
}

std::vector<Line>
Preprocessor::mergeLine(const std::vector<TextBlock> &blocks) {
  if (blocks.empty()) {
    return {};
  }

  bool hasLineId = blocks[0].lineId != -1;

  return hasLineId ? mergeByLineId(blocks) : mergeByPosition(blocks);
}

std::vector<TextBlock>
Preprocessor::filterNoise(const std::vector<TextBlock> &blocks) {
  static const std::unordered_set<std::string> noiseTokens = {"Link", "|", "–",
                                                              "-"};

  std::vector<TextBlock> result;
  result.reserve(blocks.size());

  for (const auto &block : blocks) {
    const std::string text = remove_whitespace(block.text);

    if (noiseTokens.find(text) != noiseTokens.end()) {
      continue;
    }

    result.push_back(block);
  }

  return result;
}

std::vector<std::vector<Line>>
Preprocessor::buildBlocks(const std::vector<Line> &lines) {
  std::vector<std::vector<Line>> result;
  std::vector<Line> current;
  bool isFirst = true;

  for (const auto &line : lines) {
    if (line.text.empty()) {
      if (!current.empty()) {
        result.push_back(current);
        current.clear();
      }
    } else if (!isFirst && SectionClassifier::detectHeading(line)) {
      if (!current.empty()) {
        result.push_back(current);
        current.clear();
      }
      current.push_back(line);
    } else {
      current.push_back(line);
    }
    isFirst = false;
  }

  if (!current.empty()) {
    result.push_back(current);
  }
  return result;
}
} // namespace ResumeParser
