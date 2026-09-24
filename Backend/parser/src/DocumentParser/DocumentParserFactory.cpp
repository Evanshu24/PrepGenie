#include "ResumeParser/DocumentParser/DocumentParserFactory.h"
#include "ResumeParser/DocumentParser/DocxParser.h"
#include "ResumeParser/DocumentParser/PdfParser.h"
#include "ResumeParser/DocumentParser/TxtParser.h"

namespace ResumeParser {
std::unique_ptr<DocumentParser>
DocumentParserFactory::create(const std::string &filepath) {

  std::string extension{filepath.substr(filepath.find_last_of('.'))};

  for (auto &c : extension) {
    c = std::tolower(c);
  }

  if (extension == ".pdf") {
    return std::make_unique<PdfParser>();
  }
  if (extension == ".txt") {
    return std::make_unique<TxtParser>();
  }
  if (extension == ".docx") {
    return std::make_unique<DocxParser>();
  }
  throw ParseException(
      "Invalid extension type: " + extension +
      ". File must be of the following type: .pdf, .txt, .docx");
}
} // namespace ResumeParser
