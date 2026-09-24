#pragma once

#include "ResumeParser/Core/Line.h"
#include "ResumeParser/Core/TextBlock.h"
#include <vector>

namespace ResumeParser {

class Preprocessor {

public:
  static std::vector<TextBlock> normalize(const std::vector<TextBlock> &blocks);
  static std::vector<TextBlock>
  filterNoise(const std::vector<TextBlock> &blocks);
  static std::vector<Line> mergeLine(const std::vector<TextBlock> &blocks);
  static std::vector<std::vector<Line>>
  buildBlocks(const std::vector<Line> &Lines);

private:
  static std::string remove_whitespace(const std::string &text);
  static std::string collapse_space(const std::string &text);
  static std::vector<Line> mergeByLineId(const std::vector<TextBlock> &blocks);
  static std::vector<Line>
  mergeByPosition(const std::vector<TextBlock> &blocks);
};

} // namespace ResumeParser
