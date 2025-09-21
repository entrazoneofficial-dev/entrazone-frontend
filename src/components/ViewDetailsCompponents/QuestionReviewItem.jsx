import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export default function QuestionReviewItem({
  question,
  questionNumber,
  selectedAnswerId,
  correctAnswerId,
}) {
  const isCorrect = selectedAnswerId === correctAnswerId;
  const isWrong = selectedAnswerId && selectedAnswerId !== correctAnswerId;
  const isUnanswered = !selectedAnswerId;

  return (
    <Card
      className={cn(
        "p-4 sm:p-6 border-2 overflow-hidden", // Added overflow-hidden
        isCorrect && "border-green-500 bg-green-50",
        isWrong && "border-[#FF0000] bg-[#FF0000]/5",
        isUnanswered && "border-gray-300 bg-gray-50",
      )}
    >
      {/* Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          {isCorrect && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
          {isWrong && <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />}
          {isUnanswered && <span className="text-gray-500 text-lg sm:text-xl font-bold">?</span>}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Question {questionNumber}
          </h3>
        </div>
        
        {isCorrect && (
          <Badge className="bg-green-500 text-white px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium w-fit">
            Correct
          </Badge>
        )}
        {isWrong && (
          <Badge className="bg-red-500 text-white px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium w-fit">
            Wrong
          </Badge>
        )}
      </div>

      {/* Question Text - Fixed overflow */}
      <p className="text-black mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-semibold break-words whitespace-normal overflow-hidden">
        {question.question}
      </p>

      {/* Options Grid */}
      <div className="grid gap-2 sm:gap-3">
        {question.options.map((option) => {
          const isUserAnswer = selectedAnswerId === option.id;
          const isCorrectAnswer = correctAnswerId === option.id;

          return (
            <div
              key={option.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between",
                "rounded-md p-2 sm:p-3 text-gray-700",
                isCorrectAnswer && "bg-white text-black border-2 border-[#23FA39]",
                isUserAnswer && !isCorrectAnswer && "bg-white text-black border-2 border-[#FF0000]",
                "hover:bg-gray-100 transition-colors"
              )}
            >
              <span className="font-medium text-sm sm:text-base mb-1 sm:mb-0 break-words">
                {option.id.replace("option", "").toUpperCase()}. {option.text}
              </span>
              
              <div className="flex gap-2">
                {isUserAnswer && !isCorrectAnswer && (
                  <Badge className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    Your Answer
                  </Badge>
                )}
                {isCorrectAnswer && (
                  <Badge className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    Correct Answer
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}