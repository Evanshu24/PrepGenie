#pragma once
#include "./DocumentParser.h"
#include <memory>

namespace ResumeParser {

class DocumentParserFactory {
public:
  static std::unique_ptr<DocumentParser> create(const std::string &filepath);
};
} // namespace ResumeParser
