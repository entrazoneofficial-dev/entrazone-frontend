import { Lock, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const AssessmentCard = ({ assessment }) => {
  
  const navigate = useNavigate();
    
  const handleExamClick = (id) => {
    navigate(`/exam/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${assessment.color}`}>
          {assessment.isUnlocked ? (
            <FileText className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className={`font-bold text-lg mb-2 ${assessment.isUnlocked ? "text-gray-900" : "text-gray-500"}`}>
          {assessment.title}
        </h3>
        <p className={`text-sm mb-4 ${assessment.isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
          {assessment.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{assessment.duration}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{assessment.questions} question{assessment.questions !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {assessment.score !== undefined && (
          <div className="mb-4">
            <div className="text-center rounded-full justify-center text-[#10B981] font-semibold bg-[#10B98120] py-1">
              <span className="text-sm">Your Score: {assessment.score}</span>
            </div>
          </div>
        )}
      </div>

      <Button 
        className={`w-full cursor-pointer ${assessment.buttonColor} text-white hover:opacity-90 transition-opacity`} 
        disabled={!assessment.isUnlocked}  
        onClick={() => handleExamClick(assessment.id)}
      >
        {assessment.buttonText}
      </Button>
      
      {assessment.attempts !== undefined && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          Attempts: {assessment.attempts}
        </p>
      )}
    </div>
  );
};