cmake_minimum_required(VERSION 3.16)
project(ResumeParser LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS src/*.cpp)
find_package(libzip REQUIRED)
find_package(pugixml REQUIRED)
find_package(PkgConfig REQUIRED)
find_package(nlohmann_json REQUIRED)
pkg_check_modules(POPPLER_CPP REQUIRED IMPORTED_TARGET poppler-cpp)

add_executable(resume_parser ${SOURCES})

target_link_libraries(resume_parser PRIVATE libzip::zip pugixml::pugixml)
target_link_libraries(resume_parser PRIVATE PkgConfig::POPPLER_CPP)
target_link_libraries(resume_parser PRIVATE nlohmann_json::nlohmann_json)
target_include_directories(resume_parser PRIVATE ${CMAKE_SOURCE_DIR}/include)
