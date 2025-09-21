import { Link, useNavigate, useParams } from "react-router-dom";
import { VideoModal } from "../../components/Commen/VideoModal";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  PlayCircle,
  Folder,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { lessonApi } from "../../lib/api/lesson";
import { PdfModal } from "../../components/Commen/PdfModal";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import { backendUrl } from "../../constant/BaseUrl";

function LessonPage() {
  const { id } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async (id, isFolder = false) => {
    try {
      setLoading(true);
      let response;

      if (isFolder) {
        response = await lessonApi.getFolder({ folder_id: id });
      } else {
        response = await lessonApi.getLesson({ chapter_id: id });
      }

      if (response && response.data) {
        const data = response.data;
        if (data) {
          setContentData(data);
          if (isFolder) {
            const folderData = data.folder || data;
            setCurrentFolder({
              ...folderData,
              sub_folders: data.subfolders || [],
            });
          } else {
            setCurrentFolder(null);
          }
        } else {
          throw new Error("No data found in response");
        }
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    } else {
      setError("No ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleVideoClick = (lesson) => {
    if (lesson.videos && lesson.videos.length > 0) {
      const video = lesson.videos[0];
      setSelectedVideo({
        id: lesson.id.toString(),
        title: lesson.lesson_name,
        instructor: "Course Instructor",
        subject:
          contentData?.chapter_name ||
          currentFolder?.title ||
          currentFolder?.folder_name ||
          "Lesson",
        duration: "N/A",
        rating: 0,
        youtubeId: video.url,
      });
    }
  };

  const handlePdfClick = (lesson) => {
    if (lesson.pdf_notes && lesson.pdf_notes.length > 0) {
      const pdf = lesson.pdf_notes[0];

      if (pdf?.file) {
        
        const baseUrl = backendUrl || "";
        const pdfUrl = `${baseUrl}${pdf.file}`;
        setSelectedPdf(pdfUrl);
      }
    }
  };

  const handleExamClick = (id) => {
    navigate(`/exam/${id}`);
  };

  const handleFolderClick = (folder) => {
    fetchData(folder.id, true);
    setBreadcrumbs((prev) => [
      ...prev,
      {
        id: folder.id,
        title: folder.title || folder.folder_name || "Untitled Folder",
        type: "folder",
      },
    ]);
  };

  const navigateToBreadcrumb = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);

    if (index === -1) {
      fetchData(id);
      setCurrentFolder(null);
    } else {
      const crumb = newBreadcrumbs[index];
      fetchData(crumb.id, true);
    }
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const getTitle = () => {
    if (currentFolder)
      return (
        currentFolder.title || currentFolder.folder_name || "Untitled Folder"
      );
    if (contentData?.chapter_name) return contentData.chapter_name;
    return "Untitled";
  };

  const getLessons = () => {
    if (currentFolder?.lessons) return currentFolder.lessons;
    if (currentFolder?.direct_lessons) return currentFolder.direct_lessons;
    if (contentData?.direct_lessons) return contentData.direct_lessons;
    return [];
  };

  const getSubfolders = () => {
    if (currentFolder) {
      return (
        currentFolder.sub_folders ||
        currentFolder.subfolders ||
        currentFolder.subfolders ||
        currentFolder.folders ||
        []
      );
    }
    if (contentData?.folders) {
      return contentData.folders;
    }
    return [];
  };

  const getExams = () => {
    if (currentFolder?.exams) return currentFolder.exams;
    if (contentData?.exams) return contentData.exams;
    return [];
  };

  const getLessonCount = () => {
    const lessons = getLessons();
    if (currentFolder?.lesson_count !== undefined)
      return currentFolder.lesson_count;
    return lessons.length || 0;
  };

  const getFolderCount = () => {
    const subfolders = getSubfolders();
    if (currentFolder?.subfolder_count !== undefined)
      return currentFolder.subfolder_count;
    return subfolders.length || 0;
  };

  const getExamCount = () => {
    const exams = getExams();
    if (currentFolder?.exam_count !== undefined)
      return currentFolder.exam_count;
    return exams.length || 0;
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg font-medium mb-3">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-lg font-medium mb-2">No data found</p>
          <p className="text-gray-500 mb-4">
            The content you're looking for isn't available right now.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white rounded-lg hover:opacity-90 transition-opacity inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={closeModal} />
      )}
      {selectedPdf && <PdfModal pdfUrl={selectedPdf} onClose={closePdfModal} />}

      <div className="relative bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] pb-12 pt-6 md:pb-20 md:pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white cursor-pointer rounded-full transition-colors shrink-0 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              {getTitle()}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 md:mb-6">
              {getLessonCount()} Lesson{getLessonCount() !== 1 ? "s" : ""}
              {getFolderCount()
                ? ` • ${getFolderCount()} Folder${
                    getFolderCount() !== 1 ? "s" : ""
                  }`
                : ""}
              {getExamCount()
                ? ` • ${getExamCount()} Exam${getExamCount() !== 1 ? "s" : ""}`
                : ""}
            </p>
            <Button className="px-6 py-2 md:px-8 md:py-3 font-semibold shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white hover:opacity-90 text-sm md:text-base">
              Start Learning
            </Button>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 pb-12 md:pb-16">
        {(breadcrumbs.length > 0 || currentFolder) && (
          <div className="max-w-4xl mx-auto mb-6 md:mb-8">
            <nav className="flex overflow-x-auto pb-2" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 whitespace-nowrap">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => navigateToBreadcrumb(-1)}
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-500 hover:text-[#9333EA]"
                  >
                    <svg
                      className="w-3 h-3 mr-1.5 md:mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    {contentData.chapter_name || "Chapter"}
                  </button>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.id}>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 text-gray-400 mx-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <button
                        onClick={() => navigateToBreadcrumb(index)}
                        className={`text-xs sm:text-sm font-medium ${
                          index === breadcrumbs.length - 1
                            ? "text-[#9333EA]"
                            : "text-gray-500 hover:text-[#9333EA]"
                        }`}
                      >
                        {crumb.title}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {getSubfolders().length > 0 && (
          <div className="max-w-4xl mx-auto mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Folders
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {getSubfolders().map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center"
                >
                  <div className="flex-shrink-0 mr-3 sm:mr-4">
                    <div className="bg-blue-50 text-blue-500 p-2 rounded-lg">
                      <Folder className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {folder.title || folder.folder_name || "Untitled Folder"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {folder.lesson_count || 0} Lesson
                      {folder.lesson_count !== 1 ? "s" : ""}
                      {folder.subfolder_count
                        ? ` • ${folder.subfolder_count} Subfolder${
                            folder.subfolder_count !== 1 ? "s" : ""
                          }`
                        : ""}
                      {folder.exam_count
                        ? ` • ${folder.exam_count} Exam${
                            folder.exam_count !== 1 ? "s" : ""
                          }`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {getLessons().length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {getLessons().map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-xs sm:text-sm font-medium w-fit">
                      Lesson {lesson.id}
                    </span>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {lesson.lesson_name || "Untitled Lesson"}
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {lesson.videos && lesson.videos.length > 0 && (
                    <div
                      className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleVideoClick(lesson)}
                    >
                      <div className="flex-shrink-0 mr-3 sm:mr-4">
                        <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                          <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        {lesson.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 truncate">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>N/A</span>
                          <span className="mx-1">•</span>
                          <span>Video</span>
                        </div>
                      </div>
                      {lesson.attempted_count > 0 && (
                        <div className="flex-shrink-0 ml-3 sm:ml-4 text-green-500">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      )}
                    </div>
                  )}

                  {lesson.pdf_notes && lesson.pdf_notes.length > 0 && (
                    <div
                      className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handlePdfClick(lesson)}
                    >
                      <div className="flex-shrink-0 mr-3 sm:mr-4">
                        <div className="bg-yellow-50 text-yellow-500 p-2 rounded-lg">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        {lesson.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 truncate">
                            {lesson.description}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          PDF Document
                        </p>
                      </div>
                      {lesson.attempted_count > 0 && (
                        <div className="flex-shrink-0 ml-3 sm:ml-4 text-green-500">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !getSubfolders().length &&
          !getExams().length && (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-4xl mx-auto">
              <p className="text-gray-500">No content available</p>
            </div>
          )
        )}

        {getExams().length > 0 && (
          <div className="max-w-4xl mx-auto mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Exams</h2>
            <div className="space-y-3 sm:space-y-4">
              {getExams().map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {exam.title || "Untitled Exam"}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{exam.duration || "N/A"}</span>
                        <span className="mx-1">•</span>
                        <span>{exam.exam_type || "Exam"}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full cursor-pointer sm:w-auto bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white hover:opacity-90 text-xs sm:text-sm px-4 py-2"
                      onClick={() => handleExamClick(exam.id)}
                    >
                      Start Exam
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default LessonPage;
