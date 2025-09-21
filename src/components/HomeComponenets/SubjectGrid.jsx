import React from "react";
import SubjectCard from "./SubjectCard";

const gradientBackgrounds = [
    "bg-gray-900 hover:bg-gray-800 border border-gray-800",
    "bg-violet-900 hover:bg-violet-800 border border-violet-800",
    "bg-blue-900 hover:bg-blue-800 border border-blue-800",
    "bg-purple-900 hover:bg-purple-800 border border-purple-800",
    "bg-indigo-900 hover:bg-indigo-800 border border-indigo-800",
    "bg-gray-800 hover:bg-gray-700 border border-gray-700",
];

const getRandomGradient = () => {
  return gradientBackgrounds[Math.floor(Math.random() * gradientBackgrounds.length)];
};

export const SubjectGrid = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No subjects available. Please enroll in a course to access subjects.
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.subject_id} 
              subject={{
                subjectname: subject.subject_name,
                iconBg: getRandomGradient(),
                chapter_count: subject.chapter_count,
                videocount: subject.video_count || 0, 
                examcount: subject.exam_count,
                id: subject.subject_id,
                description: subject.description,
                isFree: subject.is_free
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};