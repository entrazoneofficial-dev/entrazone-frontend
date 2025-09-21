import {
  ArrowLeft,
  Home,
  FileText,
  BookAIcon,
} from "lucide-react";
import { chapterApi } from "../../lib/api/chapter";
import ChapterCard from "../../components/ChpaterCompoents/ChapterCard";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AssessmentCard } from "../../components/ChpaterCompoents/AssessmentCard";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";

export default function Chapters() {
  const { id } = useParams();
  const subjectId = id;

  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await chapterApi.GetChapters({
          subject_id: subjectId,
        });

        if ((response && response.chapters) || (response && response.exams)) {
          const formattedChapters = response.chapters.map((chapter) => ({
            id: chapter.chapter_id,
            title: chapter.chapter_name,
            description: chapter.description || "No description available",
            isUnlocked: chapter.is_free || false,
            hasVideo: chapter.isVideo,
            duration: "N/A", 
            videoId: undefined, 
            rating: undefined, 
          }));

          const formattedExams = response.exams.map((exam) => {
            const hasScore = exam.score !== undefined && exam.score !== null;
            const isUnlocked = exam.is_free || false;
            
            let color, buttonColor;
            
            if (!isUnlocked) {
              color = "bg-gradient-to-r from-[#CBD5E1] to-[#94A3B8]";
              buttonColor = "bg-gray-400";
            } else if (hasScore) {
              color = "bg-gradient-to-r from-[#10B981] to-[#059669]";
              buttonColor = "bg-gradient-to-r from-[#10B981] to-[#059669]";
            } else {
              color = "bg-gradient-to-r from-[#F59E0B] to-[#D97706]";
              buttonColor = "bg-gradient-to-r from-[#F59E0B] to-[#D97706]";
            }

            return {
              id: exam.exam_id,
              title: exam.title,
              description: exam.exam_type || "Exam",
              isUnlocked,
              duration: exam.duration || "N/A",
              questions: exam.question_count || 0,
              attempts: exam.attempted_count || 0,
              score: exam.score,
              color,
              buttonColor,
              buttonText: !isUnlocked ? "Locked" : (hasScore ? "Retake Exam" : "Start Exam")
            };
          });

          setChapters(formattedChapters);
          setExams(formattedExams);
          setSubjectData({
            name: response.subject_name || "Subject",
            description: "Complete chapters in sequence",
            chapterCount: response.chapter_count || 0,
            examCount: response.exam_count || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
        setError(err.message || "Failed to load chapters");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [subjectId]);

  if (loading) {
    return <LoadingPage/>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] border-b border-gray-200 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/"
                className="p-2 bg-white rounded-full transition-colors shrink-0 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-xl flex items-center justify-center shrink-0">
                  <BookAIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {subjectData?.name || "Subject"}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {subjectData?.description || "Subject description"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto ">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#9333EA]" />
                <span className="font-medium">
                  {subjectData?.chapterCount || 0} Chapters
                </span>
              </div>
              <Link
                to="/"
                className="bg-white p-2 rounded-full shrink-0 hover:bg-gray-100"
              >
                <Home className="w-4 h-4 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Course Chapters
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete chapters in sequence to unlock the next level
            </p>
          </div>

          {chapters.length > 0 ? (
            <ChapterCard chapters={chapters} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                No chapters available for this subject
              </p>
            </div>
          )}
        </div>

        {exams.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Assessments & Exams
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {subjectData?.examCount || 0} exams available for this subject
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {exams.map((exam) => (
                <AssessmentCard key={exam.id} assessment={exam} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}