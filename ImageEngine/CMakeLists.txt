cmake_minimum_required(VERSION 3.5.1)

project( ROAColorCodes )

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O3 -Wall -pedantic")
# Libraries
find_package( OpenCV REQUIRED )
include_directories(${OpenCV_INCLUDE_DIRS})

add_executable(parser src/parser.cpp)
target_link_libraries(parser ${OpenCV_LIBS})

add_executable(preview src/preview.cpp)
target_link_libraries(preview ${OpenCV_LIBS})