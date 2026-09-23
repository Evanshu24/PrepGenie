#pragma once

#include "ResumeParser/DocumentParser/DocumentParser.h"

namespace ResumeParser {
class TxtParser : public DocumentParser {
public:
  std::vector<TextBlock> parse(const std::string &filepath) override;
};
} // namespace ResumeParser
