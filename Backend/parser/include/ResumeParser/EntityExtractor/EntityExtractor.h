#pragma once

#include "ResumeParser/Core/ClassifiedBlock.h"
#include "ResumeParser/Core/Line.h"
#include "ResumeParser/Core/Resume.h"
#include <vector>

namespace ResumeParser {

class EntityExtractor {
public:
  static Resume extract(const std::vector<ClassifiedBlock> &blocks);

private:
  static PersonalInfo extractPersonalInfo(const std::vector<Line> &lines);
  static std::vector<Education>
  extractEducation(const std::vector<Line> &lines);
  static std::vector<Experience>
  extractExperience(const std::vector<Line> &lines);
  static std::vector<std::string> extractSkills(const std::vector<Line> &lines);
  static std::vector<Project> extractProjects(const std::vector<Line> &lines);
  static std::vector<OtherSection> extractOther(const std::vector<Line> &lines);

  static std::string extractEmail(const std::string &text);
  static std::string extractPhone(const std::string &text);
};

} // namespace ResumeParser
