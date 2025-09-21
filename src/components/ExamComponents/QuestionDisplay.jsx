import { CheckCircle, Flag, XCircle, Circle, Check } from "lucide-react"
import { cn } from "../../lib/utils"
import { IoIosArrowForward } from "react-icons/io"
import { IoIosArrowBack } from "react-icons/io"
import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

export default function QuestionDisplay({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswers,
  showResults,
  handleSelectAnswer,
  handlePrevious,
  handleNext,
}) {
  const [isReportPopoverOpen, setIsReportPopoverOpen] = useState(false)
  const [reportText, setReportText] = useState("")

  const handleSubmitReport = () => {
    console.log("Report submitted for question:", currentQuestion.id)
    console.log("Report content:", reportText)
    setIsReportPopoverOpen(false)
    setReportText("")
  }

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <Card className="p-4 sm:p-6">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <span className="bg-gradient-to-r from-[#9333EA]/10 to-[#DB2777]/10 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>

          <span className="text-[#5A5353] text-sm">
            Algebra Assessment
          </span>
        </div>

        <div 
          className="text-lg sm:text-xl font-semibold mb-6"
          dangerouslySetInnerHTML={createMarkup(currentQuestion.question)}
        />

        <RadioGroup
          value={selectedAnswers[currentQuestion.id] || ""}
          onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
          className="grid gap-3 sm:gap-4"
        >
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option.id
            const isCorrectOption = option.id === currentQuestion.correctAnswerId
            const isUserAnswerCorrect = isSelected && isCorrectOption
            const isUserAnswerIncorrect = isSelected && !isCorrectOption

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center rounded-lg border-1 p-3 sm:p-4 transition-colors duration-200 relative overflow-hidden",
                  showResults && isCorrectOption && "border-[#41D53E] bg-[#41D53E]/10",
                  showResults && isUserAnswerIncorrect && "border-[#FF6868] bg-[#FF6868]/10",
                  !showResults && isSelected && "border-purple-500 bg-purple-50",
                  !showResults && !isSelected && "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => !showResults && handleSelectAnswer(currentQuestion.id, option.id)}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-1 mr-3 sm:mr-4 flex-shrink-0",
                  isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300",
                  showResults && isCorrectOption && "border-[#41D53E] bg-[#41D53E]",
                  showResults && isUserAnswerIncorrect && "border-[#FF6868] bg-[#FF6868]"
                )}>
                  {isSelected && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                <Label
                  htmlFor={`option-${option.id}`}
                  className="w-full cursor-pointer text-base sm:text-lg font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0"
                >
                  <span>{option.text}</span>
                  {showResults && isCorrectOption && (
                    <span className="bg-[#41D53E] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Correct Answer
                    </span>
                  )}
                  {showResults && isUserAnswerIncorrect && (
                    <span className="bg-[#ED4545] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Your answer
                    </span>
                  )}
                </Label>
              </div>
            )
          })}
        </RadioGroup>

        {showResults && currentQuestion.explanation && (
          <div className="mt-4 sm:mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
            <div 
              className="text-blue-700"
              dangerouslySetInnerHTML={createMarkup(currentQuestion.explanation)}
            />
          </div>
        )}

        {showResults && selectedAnswers[currentQuestion.id] !== currentQuestion.correctAnswerId && (
          <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg flex items-center gap-2 text-sm sm:text-base">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Note quite right, but good try!</span>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-between mt-6 sm:mt-8 gap-4 sm:gap-0">
          <div className="flex justify-start">
            <Popover open={isReportPopoverOpen} onOpenChange={setIsReportPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="bg-gradient-to-r cursor-pointer from-[#9333EA] to-[#DB2777] text-white p-2 sm:p-0"
                  size="sm"
                >
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={10}
                className="w-[300px] p-4 rounded-lg shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-gray-900">Report Question</h3>
                  <Textarea
                    placeholder="Describe the issue"
                    className="min-h-[100px]"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsReportPopoverOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r cursor-pointer from-[#9333EA] to-[#DB2777] text-white"
                      onClick={handleSubmitReport}
                      disabled={!reportText.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between sm:justify-end gap-2 sm:gap-3">
            <Button
              onClick={handlePrevious} 
              disabled={currentQuestionIndex === 0} 
              className="text-black rounded-none cursor-pointer text-sm sm:text-base" 
              variant='outline' 
              size="lg"
            >
              <IoIosArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button 
              onClick={handleNext} 
              className="bg-gradient-to-r cursor-pointer from-[#9333EA] to-[#DB2777] text-white rounded-none text-sm sm:text-base" 
              size="lg"
            >
              <span className="hidden sm:inline">Next</span>
              <IoIosArrowForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}