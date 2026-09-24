#pragma once
#include <ResumeParser/EntityExtractor/EntityExtractor.h>

namespace ResumeParser {

class ResumeParserPipeline {
public:
  static Resume parseFile(const std::string &filepath);
};
} // namespace ResumeParser
