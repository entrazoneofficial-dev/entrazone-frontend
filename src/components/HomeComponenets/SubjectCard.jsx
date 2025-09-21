import { FiFileText } from "react-icons/fi";
import { PiExam, PiCrownSimpleFill } from "react-icons/pi";
import React from 'react';
import { GiNotebook } from "react-icons/gi";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

function SubjectCard({ subject }) {
  const navigate = useNavigate();

  const handleExploreClick = (id) => {
    navigate(`/chapters/${id}`);
  }

  return (
    <div className="h-full transform transition-all duration-300 hover:scale-[1.02]">
      <div className="bg-gradient-to-br from-[#9333EA]/10 to-[#DB2777]/10 rounded-2xl border border-gray-200/60 p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
        
        {/* Modern background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 bg-white rounded-full"></div>
        </div>
        
        {/* Premium badge */}
        {!subject.isFree && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold py-1.5 px-3 rounded-full shadow-sm">
              <PiCrownSimpleFill className="w-3.5 h-3.5" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}
        
        {/* Free badge */}
        {subject.isFree && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3 rounded-full shadow-sm">
              FREE ACCESS
            </div>
          </div>
        )}

        <div className="relative z-10">
          <div className="bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-2xl w-16 h-16 flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <GiNotebook className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
            {subject.subjectname}
          </h2>
          
          {subject.description && (
            <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
              {subject.description}
            </p>
          )}

          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/80 py-2 px-3 rounded-lg shadow-xs border border-gray-100">
              <FiFileText className="w-4 h-4 text-[#9333EA]" />
              <span>{subject.chapter_count} Chapter{subject.chapter_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/80 py-2 px-3 rounded-lg shadow-xs border border-gray-100">
              <PiExam className="w-4 h-4 text-[#DB2777]" />
              <span>{subject.examcount} Exam{subject.examcount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="mt-auto">
            <Button
              onClick={() => handleExploreClick(subject.id)} 
              className="w-full cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50 hover:from-[#812bd6] hover:to-[#c42168]"
            >
              EXPLORE NOW
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;