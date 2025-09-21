import { Button } from "../../components/ui/button";
import Timer from "../../components/ExamComponents/Timer";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionNavigation from "../../components/ExamComponents/QuestionNavigation";
import QuestionDisplay from "../../components/ExamComponents/QuestionDisplay";
import { chapterApi } from "../../lib/api/chapter";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import Swal from 'sweetalert2';

function ExamQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState("00:40:00");
  const [timeTaken, setTimeTaken] = useState("00:00");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const payload = { exam_id: id };
        const response = await chapterApi.GetExamQuestions(payload);

        if (response.status === "success") {
          const transformedQuestions = response.questions.map((question) => ({
            id: question.question_id,
            question: question.question_description,
            options: question.options.map((option) => ({
              id: option.id.toString(),
              text: option.text,
            })),
            correctAnswerId: question.right_answers[0]?.id.toString() || null,
            explanation: question.explanation_description,
            mark: question.mark,
            negativeMark: question.negative_mark,
          }));

          setQuestions(transformedQuestions);
          setDuration(response.duration);
        } else {
          setError(response.message || "Failed to fetch questions");
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || "Failed to fetch questions",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to fetch questions");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || "Failed to fetch questions",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleSelectAnswer = (questionId, optionId) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { value: confirm } = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      });

      if (!confirm) return;

      setShowResults(true);
      const payload = {
        exam_id: id,
        questions: Object.keys(selectedAnswers).map((questionId) => ({
          question_id: parseInt(questionId),
          selected_answer: parseInt(selectedAnswers[questionId]),
        })),
        total_time_taken: timeTaken,
      };
      
      const result = await chapterApi.submitExamAnswers(payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Your answers have been submitted successfully.',
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleTimerUpdate = (time) => {
    setTimeTaken(time);
  };

  const handleTimerComplete = () => {
    Swal.fire({
      title: 'Time Up!',
      text: 'Your time has ended. Submitting your answers...',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
      handleSubmit();
    });
  };

  if (loading) {
    return <LoadingPage/>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        No questions available
      </div>
    );
  }

  const attendedQuestions = showResults
    ? questions.filter((q) => selectedAnswers[q.id] !== undefined)
    : questions;

  const currentQuestion =
    attendedQuestions[currentQuestionIndex] || questions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] border-b border-gray-200 px-4 sm:px-6 py-8 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white cursor-pointer rounded-full transition-colors shrink-0 hover:bg-gray-100"
              >
                {" "}
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Review Questions
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  {questions.length} questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-normal">
              <Timer
                duration={duration}
                showResults={showResults}
                onTimeout={handleTimerComplete}
                onUpdate={handleTimerUpdate}
              />
              <Button
                className="bg-gradient-to-r cursor-pointer from-[#9333EA] to-[#DB2777] text-white px-4 sm:px-7 py-2 sm:py-3 rounded-full text-sm sm:text-base"
                onClick={handleSubmit}
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[minmax(200px,250px)_1fr] gap-4 sm:gap-6">
        <QuestionNavigation
          questions={showResults ? attendedQuestions : questions}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswers={selectedAnswers}
          showResults={showResults}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />

        <QuestionDisplay
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={attendedQuestions.length}
          selectedAnswers={selectedAnswers}
          showResults={showResults}
          handleSelectAnswer={handleSelectAnswer}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
      </div>
    </div>
  );
}

export default ExamQuestion;