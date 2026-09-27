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

struct Section {
  std::string heading;
  std::string content;
};

struct Project {
  std::string name;
  std::string content;
};

struct Resume {
  PersonalInfo personalInfo;
  std::vector<Section> education;
  std::vector<Section> experience;
  std::vector<Project> projects;
  std::vector<std::string> skills;
  std::vector<Section> other;
};

inline void to_json(nlohmann::json &j, const PersonalInfo &p) {
  j = nlohmann::json{{"name", p.name},
                     {"email", p.email},
                     {"phone", p.phone},
                     {"other", p.other}};
}

inline void to_json(nlohmann::json &j, const Section &s) {
  j = nlohmann::json{{"heading", s.heading}, {"content", s.content}};
}

inline void to_json(nlohmann::json &j, const Project &p) {
  j = nlohmann::json{{"name", p.name}, {"content", p.content}};
}

inline void to_json(nlohmann::json &j, const Resume &r) {
  j = nlohmann::json{
      {"personalInfo", r.personalInfo},
      {"education", r.education},
      {"experience", r.experience},
      {"projects", r.projects},
      {"skills", r.skills},
      {"other", r.other},
  };
}

} // namespace ResumeParser
