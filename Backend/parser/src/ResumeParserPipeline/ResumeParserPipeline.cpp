#include <ResumeParser/DocumentParser/DocumentParserFactory.h>
#include <ResumeParser/Preprocessor/Preprocessor.h>
#include <ResumeParser/ResumeParserPipeline/ResumeParserPipeline.h>
#include <ResumeParser/SectionClassifer/SectionClassifer.h>

namespace ResumeParser {

Resume ResumeParserPipeline::parseFile(const std::string &filepath) {

  auto Parser = ResumeParser::DocumentParserFactory::create(filepath);

  auto text_blocks = Parser->parse(filepath);

  auto normalized_text_blocks =
      ResumeParser::Preprocessor::normalize(text_blocks);
  auto filtered_text_blocks =
      ResumeParser::Preprocessor::filterNoise(normalized_text_blocks);
  auto processed_content =
      ResumeParser::Preprocessor::mergeLine(filtered_text_blocks);
  auto processed_lines =
      ResumeParser::Preprocessor::buildBlocks(processed_content);
  auto classified_block =
      ResumeParser::SectionClassifier::classifyAll(processed_lines);
  auto resume = ResumeParser::EntityExtractor::extract(classified_block);
  return resume;
}
} // namespace ResumeParser
