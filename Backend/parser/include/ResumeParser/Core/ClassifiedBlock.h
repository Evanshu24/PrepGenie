#pragma once

#include "ResumeParser/Core/Line.h"
#include "ResumeParser/Core/SectionType.h"
#include <vector>

namespace ResumeParser {
struct ClassifiedBlock {
  SectionType type = SectionType::Unknown;
  std::vector<Line> lines;
};
} // namespace ResumeParser
