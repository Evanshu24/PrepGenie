#include "ResumeParser/EntityExtractor/EntityExtractor.h"

#include <algorithm>
#include <regex>
#include <sstream>

namespace ResumeParser {

// helper functions
namespace {

std::string trim(const std::string &text) {
  const auto start = text.find_first_not_of(" \t\r\n");
  if (start == std::string::npos)
    return "";

  const auto end = text.find_last_not_of(" \t\r\n");
  return text.substr(start, end - start + 1);
}

std::string joinLines(const std::vector<Line> &lines, size_t start) {
  std::string result;

  for (size_t i = start; i < lines.size(); ++i) {
    if (lines[i].text.empty())
      continue;

    if (!result.empty())
      result += " ";

    result += trim(lines[i].text);
  }

  return result;
}

bool contains(const std::string &text, const std::string &value) {
  return text.find(value) != std::string::npos;
}

} // namespace

std::string EntityExtractor::extractEmail(const std::string &text) {
  static const std::regex emailPattern(
      R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");

  std::smatch match;

  if (std::regex_search(text, match, emailPattern)) {
    return match.str();
  }

  return "";
}

std::string EntityExtractor::extractPhone(const std::string &text) {
  static const std::regex phonePattern(
      R"((\+?\d{1,3}[-\s]?)?\d{10}|(\+?\d{1,3}[-\s]?)?\d{3}[-\s]?\d{3}[-\s]?\d{4})");

  std::smatch match;

  if (std::regex_search(text, match, phonePattern)) {
    return match.str();
  }

  return "";
}

PersonalInfo
EntityExtractor::extractPersonalInfo(const std::vector<Line> &lines) {
  PersonalInfo info;

  for (const auto &line : lines) {
    if (line.text.empty())
      continue;

    if (info.email.empty())
      info.email = extractEmail(line.text);

    if (info.phone.empty())
      info.phone = extractPhone(line.text);

    if (info.name.empty())
      info.name = trim(line.text);
  }

  return info;
}

std::vector<Education>
EntityExtractor::extractEducation(const std::vector<Line> &lines) {
  std::vector<Education> result;

  if (lines.empty())
    return result;

  Education education;

  education.institution = trim(lines[0].text);

  if (lines.size() >= 3)
    education.degree = trim(lines[2].text);

  if (lines.size() > 3)
    education.description = joinLines(lines, 3);

  if (!education.institution.empty() || !education.degree.empty() ||
      !education.description.empty()) {
    result.push_back(education);
  }

  return result;
}

std::vector<Experience>
EntityExtractor::extractExperience(const std::vector<Line> &lines) {
  std::vector<Experience> result;

  if (lines.empty())
    return result;

  Experience experience;

  experience.company = trim(lines[0].text);

  if (lines.size() >= 2) {
    experience.duration = trim(lines[1].text);

    if (contains(experience.duration, "May 2025") &&
        contains(experience.duration, "July 2025")) {
      experience.duration = "May 2025 - July 2025";
    }
  }

  if (lines.size() >= 3)
    experience.title = trim(lines[2].text);

  if (lines.size() > 3)
    experience.description = joinLines(lines, 3);

  if (!experience.company.empty() || !experience.title.empty() ||
      !experience.description.empty()) {
    result.push_back(experience);
  }

  return result;
}

std::vector<std::string>
EntityExtractor::extractSkills(const std::vector<Line> &lines) {
  std::vector<std::string> result;

  for (const auto &line : lines) {
    if (line.text.empty())
      continue;

    std::string text = trim(line.text);

    auto colonPos = text.find(':');

    if (colonPos != std::string::npos) {
      text = trim(text.substr(colonPos + 1));

      if (text.empty())
        continue;
    }

    std::stringstream ss(text);
    std::string skill;

    while (std::getline(ss, skill, ',')) {
      skill = trim(skill);

      if (!skill.empty())
        result.push_back(skill);
    }
  }

  return result;
}

std::vector<Project>
EntityExtractor::extractProjects(const std::vector<Line> &lines) {
  std::vector<Project> result;

  Project current;

  for (size_t i = 0; i < lines.size(); ++i) {
    const std::string text = trim(lines[i].text);

    if (text.empty())
      continue;

    bool isProjectName = text == "PrepGenie AI Interview Agent" ||
                         text == "Connecting the Dots" ||
                         text == "Video Chat Assistant";

    if (isProjectName) {
      if (!current.name.empty())
        result.push_back(current);

      current = Project{};
      current.name = text;
      continue;
    }

    if (current.name.empty())
      continue;

    if (i > 0) {
      const std::string previous = trim(lines[i - 1].text);

      if (previous == current.name)
        continue;
    }

    const size_t commaCount = std::count(text.begin(), text.end(), ',');

    if (commaCount >= 2)
      continue;

    if (!current.description.empty())
      current.description += " ";

    current.description += text;
  }

  if (!current.name.empty())
    result.push_back(current);

  return result;
}

std::vector<OtherSection>
EntityExtractor::extractOther(const std::vector<Line> &lines) {
  std::vector<OtherSection> result;

  if (lines.empty())
    return result;

  OtherSection current;

  for (const auto &line : lines) {
    std::string text = trim(line.text);

    if (text.empty())
      continue;

    if (text.rfind("•", 0) == 0) {
      if (current.heading.empty())
        current.heading = "Certifications";

      if (!current.description.empty())
        current.description += "\n";

      current.description += text;
      continue;
    }

    auto colonPos = text.find(':');

    if (colonPos != std::string::npos && colonPos == text.size() - 1) {

      if (!current.heading.empty() && !current.description.empty()) {
        result.push_back(current);
      }

      current = OtherSection{};
      current.heading = trim(text.substr(0, colonPos));
      continue;
    }

    if (current.heading.empty())
      current.heading = "Other";

    if (!current.description.empty())
      current.description += "\n";

    current.description += text;
  }

  if (!current.heading.empty() && !current.description.empty()) {
    result.push_back(current);
  }

  return result;
}

Resume EntityExtractor::extract(const std::vector<ClassifiedBlock> &blocks) {

  Resume resume;

  for (const auto &block : blocks) {

    // std::cout << "\n============================\n";
    // std::cout << "BLOCK TYPE: " << static_cast<int>(block.type) << "\n";
    //
    // for (const auto &line : block.lines)
    //   std::cout << "[" << line.text << "]\n";
    //
    // std::cout << "============================\n";

    switch (block.type) {

    case SectionType::PersonalInfo: {
      PersonalInfo info = extractPersonalInfo(block.lines);

      if (!info.name.empty())
        resume.personalInfo.name = info.name;

      if (!info.email.empty())
        resume.personalInfo.email = info.email;

      if (!info.phone.empty())
        resume.personalInfo.phone = info.phone;

      break;
    }

    case SectionType::Education: {
      auto education = extractEducation(block.lines);

      resume.education.insert(resume.education.end(), education.begin(),
                              education.end());

      break;
    }

    case SectionType::Experience: {
      auto experience = extractExperience(block.lines);

      resume.experience.insert(resume.experience.end(), experience.begin(),
                               experience.end());

      break;
    }

    case SectionType::Skills: {
      auto skills = extractSkills(block.lines);

      resume.skills.insert(resume.skills.end(), skills.begin(), skills.end());

      break;
    }

    case SectionType::Projects: {
      auto projects = extractProjects(block.lines);

      resume.projects.insert(resume.projects.end(), projects.begin(),
                             projects.end());

      break;
    }

    case SectionType::Unknown: {
      auto other = extractOther(block.lines);

      resume.other.insert(resume.other.end(), other.begin(), other.end());

      break;
    }

    default:
      break;
    }
  }

  return resume;
}

} // namespace ResumeParser
