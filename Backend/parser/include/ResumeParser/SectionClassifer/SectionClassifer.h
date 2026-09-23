#pragma once
#include "ResumeParser/Core/ClassifiedBlock.h"
#include "ResumeParser/Core/Line.h"
#include "ResumeParser/Core/SectionType.h"
#include <string>
#include <vector>

namespace ResumeParser {

class SectionClassifier {
public:
  static bool detectHeading(const Line &line);
  static SectionType classify(const Line &headingLine);
  static std::vector<ClassifiedBlock>
  classifyAll(const std::vector<std::vector<Line>> &blocks);

private:
  static std::string toLowerTrim(const std::string &text);
};

} // namespace ResumeParser
