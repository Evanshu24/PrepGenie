#pragma once
#include <nlohmann/json.hpp>
#include <string>
#include <vector>

namespace ResumeParser {

struct PersonalInfo {
  std::string name;
  std::string email;
  std::string phone;
  std::vector<std::string> other;
};

struct Education {
  std::string degree;
  std::string institution;
  std::string description;
};

struct Experience {
  std::string title;
  std::string company;
  std::string duration;
  std::string description;
};

struct Project {
  std::string name;
  std::string description;
};
struct OtherSection {
  std::string heading;
  std::string description;
};
struct Resume {
  PersonalInfo personalInfo;
  std::vector<Education> education;
  std::vector<Experience> experience;
  std::vector<Project> projects;
  std::vector<std::string> skills;
  std::vector<OtherSection> other;
};
inline void to_json(nlohmann::json &j, const PersonalInfo &p) {
  j = nlohmann::json{{"name", p.name},
                     {"email", p.email},
                     {"phone", p.phone},
                     {"other", p.other}};
}
inline void to_json(nlohmann::json &j, const Education &p) {
  j = nlohmann::json{{"degree", p.degree},
                     {"institution", p.institution},
                     {"description", p.description}};
}
inline void to_json(nlohmann::json &j, const Experience &p) {
  j = nlohmann::json{
      {"company", p.company},
      {"title", p.title},
      {"description", p.description},
      {"duration", p.duration},
  };
}
inline void to_json(nlohmann::json &j, const Project &p) {
  j = nlohmann::json{
      {"name", p.name},
      {"description", p.description},
  };
}
inline void to_json(nlohmann::json &j, const OtherSection &p) {
  j = nlohmann::json{{"heading", p.heading}, {"description", p.description}};
}
inline void to_json(nlohmann::json &j, const Resume &r) {
  j = nlohmann::json{
      {"personalInfo", r.personalInfo},
      {"education", r.education},
      {"experience", r.experience},
      {"projects", r.projects},
      {"skills", r.skills},
      {"other section", r.other},
  };
}

} // namespace ResumeParser
