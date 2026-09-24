#pragma once

#include "ResumeParser/DocumentParser/DocumentParser.h"

namespace ResumeParser {
class DocxParser : public DocumentParser {
public:
  std::vector<TextBlock> parse(const std::string &filepath) override;
};
} // namespace ResumeParser
