#pragma once

#include "ResumeParser/Core/TextBlock.h"
#include <stdexcept>
#include <string>
#include <vector>

namespace ResumeParser {
class ParseException : public std::runtime_error {
public:
  explicit ParseException(const std::string &message)
      : std::runtime_error(message) {}
};

class DocumentParser {
public:
  virtual ~DocumentParser() = default;

  virtual std::vector<TextBlock> parse(const std::string &filepath) = 0;
};
} // namespace ResumeParser
