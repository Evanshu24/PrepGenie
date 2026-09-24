#include "ResumeParser/SectionClassifer/SectionClassifer.h"
#include <cctype>

namespace ResumeParser {

std::string SectionClassifier::toLowerTrim(const std::string &text) {
  auto start = text.find_first_not_of(" \t\r\n");
  auto end = text.find_last_not_of(" \t\r\n");
  if (start == std::string::npos) {
    return "";
  }
  std::string trimmed = text.substr(start, end - start + 1);
  for (auto &c : trimmed) {
    c = std::tolower(static_cast<unsigned char>(c));
  }
  return trimmed;
}

bool SectionClassifier::detectHeading(const Line &line) {
  std::string text = toLowerTrim(line.text);

  if (text.empty() || text.length() > 40) {
    return false;
  }

  static const std::vector<std::string> keywords = {
      "education",     "experience",  "employment", "work history",
      "skill",         "project",     "summary",    "objective",
      "certification", "achievement", "publication"};

  for (const auto &kw : keywords) {
    if (text.find(kw) != std::string::npos) {
      return true;
    }
  }

  // fallback style-based signal: short + bold + noticeably large font
  if (line.bold && line.fontSize >= 13.0f) {
    return true;
  }

  return false;
}

SectionType SectionClassifier::classify(const Line &headingLine) {
  std::string text = toLowerTrim(headingLine.text);

  if (text.find("education") != std::string::npos) {
    return SectionType::Education;
  }
  if (text.find("experience") != std::string::npos ||
      text.find("employment") != std::string::npos ||
      text.find("work history") != std::string::npos) {
    return SectionType::Experience;
  }
  if (text.find("skill") != std::string::npos) {
    return SectionType::Skills;
  }
  if (text.find("project") != std::string::npos) {
    return SectionType::Projects;
  }

  return SectionType::Unknown;
}

std::vector<ClassifiedBlock>
SectionClassifier::classifyAll(const std::vector<std::vector<Line>> &blocks) {
  std::vector<ClassifiedBlock> result;
  SectionType currentType = SectionType::PersonalInfo;

  bool isFirst{true};

  for (const auto &block : blocks) {
    if (block.empty()) {
      continue;
    }

    std::vector<Line> content = block;

    if (!isFirst && detectHeading(block[0])) {
      currentType = classify(block[0]);
      content.erase(content.begin());
    }

    if (!isFirst)
      result.push_back(ClassifiedBlock{currentType, content});
    else {
      result.push_back(ClassifiedBlock{SectionType::PersonalInfo, content});
    }

    isFirst = false;
  }

  return result;
}

} // namespace ResumeParser
