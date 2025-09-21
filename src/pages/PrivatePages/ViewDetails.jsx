import { ArrowLeft, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { LiaTrophySolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import QuestionReviewItem from "../../components/ViewDetailsCompponents/QuestionReviewItem";
import { commenApi } from "../../lib/api/commen";
import toast from "react-hot-toast";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";

export default function AssessmentReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState({
    questions: [],
    correctAnswersCount: 0,
    wrongAnswersCount: 0,
    unansweredCount: 0,
    finalScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        setLoading(true);
        const response = await commenApi.ViewDetails({
          exam_id: id 
        });
        
        const transformedData = transformApiData(response.data);
        setAssessmentData(transformedData);
      } catch (error) {
        toast.error("Failed to load assessment details");
        console.error("Error fetching assessment details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessmentDetails();
    }
  }, [id, navigate]);
  
  function transformApiData(apiData) {
    const removeHtmlTags = (text) => {
      if (!text) return text;
      return text.replace(/<[^>]*>/g, '');
    };

    const allQuestions = [
      ...(apiData.questions.correct || []),
      ...(apiData.questions.wrong || []),
      ...(apiData.questions.missed || [])
    ];

    const transformedQuestions = allQuestions.map(question => ({
      id: question.id,
      question: removeHtmlTags(question.question_description),
      options: question.options.map(option => ({
        id: `option${option.id}`,
        text: option.option
      })),
      userAnswerId: question.answered ? `option${question.selected_option}` : null,
      correctAnswerId: question.right_answers && question.right_answers.length > 0 
        ? `option${question.right_answers[0].id}` 
        : null,
      explanation: question.explanation
    }));

    return {
      questions: transformedQuestions,
      correctAnswersCount: apiData.questions.correct?.length || 0,
      wrongAnswersCount: apiData.questions.wrong?.length || 0,
      unansweredCount: apiData.questions.missed?.length || 0,
      finalScore: apiData.summary.percentage
    };
  }

  const filteredQuestions = assessmentData.questions.filter((q) => {
    const status = 
      !q.userAnswerId ? "unanswered" : 
      q.userAnswerId === q.correctAnswerId ? "correct" : "wrong";
    
    if (activeTab === "all") return true;
    if (activeTab === "correct") return status === "correct";
    if (activeTab === "wrong") return status === "wrong";
    if (activeTab === "unanswered") return status === "unanswered";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center  w-full md:w-auto justify-between md:justify-start">
              <Link
                to="/"
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div className="flex flex-col items-start w-full">
                <h1 className="text-3xl font-semibold text-gray-900">Assessment Review</h1> 
                <span>Exam Result</span>
              </div>
              <div className="md:hidden"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full md:hidden">
              <Card className="bg-gradient-to-br from-[#9E78F5] to-[#662FC5] text-white p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-medium text-[#BDBBBB]">Score</h3>
                    <p className="text-xl font-bold my-1">{assessmentData.finalScore}%</p>
                  </div>
                  <LiaTrophySolid className="text-3xl" />
                </div>
                <Badge className="bg-[#41D53E] text-white px-2 text-xs font-medium mt-1">
                  {assessmentData.finalScore >= 70 ? "Passed" : "Failed"}
                </Badge>
              </Card>
              
              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-medium text-gray-700">Correct</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {assessmentData.correctAnswersCount}
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-medium text-gray-700">Wrong</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {assessmentData.wrongAnswersCount}
                    </p>
                  </div>
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-medium text-gray-700">Unanswered</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {assessmentData.unansweredCount}
                    </p>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">?</span>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Stats Cards - Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
              <Card className="bg-gradient-to-br from-[#9E78F5] to-[#662FC5] text-white p-4 min-w-[200px]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-[#BDBBBB]">Final Score</h3>
                    <p className="text-2xl sm:text-3xl font-bold my-1">{assessmentData.finalScore}%</p>
                  </div>
                  <LiaTrophySolid className="text-4xl sm:text-5xl" />
                </div>
                <Badge className="bg-[#41D53E] text-white px-2 text-xs font-medium mt-2">
                  {assessmentData.finalScore >= 70 ? "Passed" : "Failed"}
                </Badge>
              </Card>
              
              <Card className="p-4 min-w-[180px]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Correct</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {assessmentData.correctAnswersCount}
                    </p>
                  </div>
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4 min-w-[180px]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Wrong</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {assessmentData.wrongAnswersCount}
                    </p>
                  </div>
                  <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                </div>
              </Card>
              
              <Card className="p-4 min-w-[180px]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Unanswered</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {assessmentData.unansweredCount}
                    </p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">?</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Card className="p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Question Review
            </h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-6 overflow-scroll">
              <TabsTrigger value="all" className="text-[10px] sm:text-sm">
                All ({assessmentData.questions.length})
              </TabsTrigger>
              <TabsTrigger value="correct" className="text-[10px] sm:text-sm">
                Correct ({assessmentData.correctAnswersCount})
              </TabsTrigger>
              <TabsTrigger value="wrong" className="text-[10px] sm:text-sm">
                Wrong ({assessmentData.wrongAnswersCount})
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="text-[10px] sm:text-sm">
                Unanswered ({assessmentData.unansweredCount})
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 sm:space-y-6">
              {filteredQuestions.map((q, index) => (
                <QuestionReviewItem
                  key={q.id}
                  question={q}
                  questionNumber={index + 1}
                  selectedAnswerId={q.userAnswerId}
                  correctAnswerId={q.correctAnswerId}
                />
              ))}
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}