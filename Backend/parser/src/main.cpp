#include <ResumeParser/DocumentParser/DocumentParser.h>
#include <ResumeParser/ResumeParserPipeline/ResumeParserPipeline.h>
#include <iostream>
#include <nlohmann/json.hpp>
int main(int argc, char *argv[]) {

  if (argc < 2) {
    nlohmann::json errJson;
    errJson["error"] = "Not enough arguments. Usage resume_parser <filepath>";
    std::cout << errJson.dump(4) << std::endl;
    // throw ResumeParser::ParseException("Not enough arguments");
    return 1;
  } else {
    try {

      auto resume = ResumeParser::ResumeParserPipeline::parseFile(argv[1]);

      auto json = nlohmann::json(resume);
      std::cout << json.dump(4) << std::endl;

    } catch (const ResumeParser::ParseException &e) {

      nlohmann::json errJson;
      errJson["error"] = e.what();
      std::cout << errJson.dump(4) << std::endl;
      return 1;
    } catch (const std::exception &e) {

      nlohmann::json errJson;
      errJson["error"] = e.what();
      std::cout << errJson.dump(4) << std::endl;
      return 1;
    }
    // std::cout << "Name: " << resume.personalInfo.name << "\n";
    // std::cout << "Email: " << resume.personalInfo.email << "\n";
    // std::cout << "Phone: " << resume.personalInfo.phone << "\n";
    //
    // std::cout << "\nSkills:\n";
    // for (const auto &s : resume.skills) {
    //   std::cout << "  - " << s << "\n";
    // }
    //
    // std::cout << "\nEducation:\n";
    // for (const auto &e : resume.education) {
    //   std::cout << "  " << e.degree << " | " << e.institution << " | " <<
    //   e.year
    //             << "\n";
    // }
    //
    // std::cout << "\nExperience:\n";
    // for (const auto &e : resume.experience) {
    //   std::cout << "  " << e.title << " | " << e.company << " | "
    //             << e.description << "\n";
    // }
    //
    // std::cout << "\nProjects:\n";
    // for (const auto &p : resume.projects) {
    //   std::cout << "  " << p.name << " | " << p.description << "\n";
    // }
  }
}
