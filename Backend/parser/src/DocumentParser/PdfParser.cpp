#include "ResumeParser/DocumentParser/PdfParser.h"
#include <poppler/cpp/poppler-document.h>
#include <poppler/cpp/poppler-global.h>
#include <poppler/cpp/poppler-page.h>

namespace ResumeParser {
std::vector<TextBlock> PdfParser::parse(const std::string &filepath) {
  auto document = poppler::document::load_from_file(filepath);

  if (!document) {
    throw ParseException("Unable to open pdf file: " + filepath);
  }
  if (document->is_locked()) {
    throw ParseException("PDF is password protected: " + filepath);
  }
  std::vector<TextBlock> store;
  for (int i = 0; i < document->pages(); i++) {
    std::unique_ptr<poppler::page> page(document->create_page(i));

    for (const auto &content :
         page->text_list(poppler::page::text_list_include_font)) {
      auto byte_array = content.text().to_utf8();
      std::string text{byte_array.begin(), byte_array.end()};
      auto rect = content.bbox();
      float x = rect.x(), y = rect.y();
      std::string fontName = content.get_font_name();
      float fontSize = content.get_font_size();
      auto fontname_lower = fontName;
      for (auto &c : fontname_lower) {
        c = std::tolower(c);
      }
      bool bold = (fontname_lower.find("bold") != std::string::npos);
      bool italic = (fontname_lower.find("italic") != std::string::npos) ||
                    (fontname_lower.find("oblique") != std::string::npos);
      store.push_back(TextBlock{.text = text,
                                .fontName = fontName,
                                .x = x,
                                .y = y,
                                .fontSize = fontSize,
                                .bold = bold,
                                .italic = italic,
                                .pageNumber = i});
    }
  }
  return store;
}
} // namespace ResumeParser
