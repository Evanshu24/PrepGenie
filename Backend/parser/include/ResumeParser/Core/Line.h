#pragma once

#include <string>

namespace ResumeParser {

struct Line {
  std::string text;
  bool bold = false;
  bool italic = false;
  float fontSize = 0.0f;
  int pageNumber = 0;
  int lineId = -1;
};
} // namespace ResumeParser
