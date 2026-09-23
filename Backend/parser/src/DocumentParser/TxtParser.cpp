#include "ResumeParser/DocumentParser/TxtParser.h"
#include <fstream>

namespace ResumeParser {
std::vector<TextBlock> TxtParser::parse(const std::string &filepath) {
  std::fstream file(filepath);

  if (!file.is_open()) {
    ParseException("Unable to open the file: " + filepath);
  }
  std::vector<TextBlock> store;
  std::string line{};

  int lineId{};

  while (std::getline(file, line)) {
    if (!line.empty() && line.back() == '\r')
      line.pop_back();
    store.push_back(
        TextBlock{.text = line, .lineId = lineId++, .pageNumber = 0});
  }

  return store;
}
} // namespace ResumeParser
