#include "ResumeParser/DocumentParser/DocxParser.h"
#include <pugixml.hpp>
#include <zip.h>
namespace ResumeParser {
std::vector<TextBlock> DocxParser::parse(const std::string &filepath) {
  zip_error_t error_code{};
  int error_c = 0;
  zip_t *archive = zip_open(filepath.c_str(), ZIP_RDONLY, &error_c);
  if (!archive) {
    zip_error_t ziperr;
    zip_error_init_with_code(&ziperr, error_c);
    std::string msg = zip_error_strerror(&ziperr);
    zip_error_fini(&ziperr);
    throw ParseException("Unable to open zip file: " + filepath + " (" + msg +
                         ")");
  }
  zip_stat_t st;
  if (zip_stat(archive, "word/document.xml", 0, &st) != 0) {
    throw ParseException("Could not stat document.xml");
  }
  zip_file_t *doc = zip_fopen(archive, "word/document.xml", 0);

  if (!doc) {
    throw ParseException("Could not open document.xml");
  }

  std::string content(st.size, '\0');

  zip_fread(doc, content.data(), st.size);

  zip_fclose(doc);

  zip_close(archive);

  pugi::xml_document xmlDoc;
  pugi::xml_parse_result result =
      xmlDoc.load_buffer(content.data(), content.size());
  if (!result) {
    throw ParseException("Failed to parse document.xml: " +
                         std::string(result.description()));
  }

  std::vector<TextBlock> blocks;

  pugi::xml_node document = xmlDoc.child("w:document");
  if (!document)
    throw ParseException("document.xml is missing <w:document>");

  pugi::xml_node body = document.child("w:body");
  if (!body)
    throw ParseException("document.xml is missing <w:body>");

  int lineId = 0;

  for (pugi::xml_node para : body.children("w:p")) {
    for (pugi::xml_node run : para.children("w:r")) {
      pugi::xml_node textNode = run.child("w:t");
      std::string text = textNode.text().get();

      if (text.empty()) {
        continue;
      }

      TextBlock block;
      block.text = text;

      pugi::xml_node rPr = run.child("w:rPr");

      pugi::xml_node fontNode = rPr.child("w:rFonts");

      if (fontNode) {
        std::string fontName = fontNode.attribute("w:ascii").as_string();

        if (fontName.empty())
          fontName = fontNode.attribute("w:hAnsi").as_string();

        if (fontName.empty())
          fontName = fontNode.attribute("w:cs").as_string();

        block.fontName = fontName;
      }
      pugi::xml_node boldNode = rPr.child("w:b");
      if (boldNode) {
        std::string val = boldNode.attribute("w:val").as_string("1");
        block.bold = (val != "0" && val != "false");
      }

      pugi::xml_node italicNode = rPr.child("w:i");
      if (italicNode) {
        std::string val = italicNode.attribute("w:val").as_string("1");
        block.italic = (val != "0" && val != "false");
      }

      pugi::xml_node szNode = rPr.child("w:sz");
      if (szNode) {
        int halfPoints = szNode.attribute("w:val").as_int();
        block.fontSize = halfPoints / 2.0f;
      }
      block.lineId = lineId;
      blocks.push_back(block);
      lineId++;
    }
  }

  return blocks;
}
} // namespace ResumeParser
//
//  here memory leaks can happen when throwing the error while still the zip is
//  open deal with them later
