#pragma once

#include <string>

namespace ResumeParser {
struct TextBlock {
  std::string text;
  std::string fontName;

  int lineId = -1;

  float x = -1.0f;
  float y = -1.0f;

  float fontSize = 0.0f;
  bool bold = false;
  bool italic = false;

  int pageNumber = 0;
};
} // namespace ResumeParser
