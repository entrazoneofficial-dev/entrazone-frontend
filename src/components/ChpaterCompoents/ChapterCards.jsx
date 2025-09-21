
import { Lock, Clock, Star, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { VideoModal } from "../Commen/VideoModal";
import { useNavigate } from "react-router-dom";



export const ChapterCards = ({ chapter, onUnlockClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleExploreClick = (id) => {
    navigate(`/lessons/${id}`)
  }

  return (
    <>
      <div
        className={`rounded-2xl border-1 transition-all duration-200 relative ${
          chapter.isUnlocked
            ? "bg-white shadow-sm hover:shadow-md border border-gray-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {chapter.hasVideo ? (
          <div className="mb-4 rounded-t-lg overflow-hidden bg-gray-100 aspect-video relative">
            {chapter.isUnlocked ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${chapter.videoId}/mqdefault.jpg`}
                  alt={chapter.title}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={`https://img.youtube.com/vi/${chapter.videoId}/mqdefault.jpg`}
                  alt={chapter.title}
                  className="object-cover opacity-70 "
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="m-4 flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              chapter.isUnlocked ? "bg-gradient-to-r from-[#9333EA] to-[#DB2777]" : "bg-gradient-to-r from-[#CBD5E1] to-[#94A3B8]"
            }`}>
              {chapter.isUnlocked ? (
                <span className="text-white font-bold text-lg">{chapter.id}</span>
              ) : (
                <Lock className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        )}
        
        <div className="p-3">
          <div className={`${chapter.hasVideo ? "text-start" : "text-center" } mb-4`}>
            <h3 className={`font-bold text-lg mb-2 ${chapter.isUnlocked ? "text-gray-900" : "text-gray-500"}`}>
              {chapter.title}
            </h3>
            <p className={`text-sm ${chapter.isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
              {chapter.description}
            </p>
            {chapter.rating && (
              <div className="gap-2 text-xs font-semibold flex items-center mt-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{chapter.rating}</span>
              </div>
            )}
          </div>
        <Button
          className={`w-full cursor-pointer ${
            chapter.isUnlocked
              ? "bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white "
              : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
          }`}
          onClick={
            !chapter.isUnlocked 
              ? onUnlockClick 
              : chapter.hasVideo 
                ? () => setIsModalOpen(true)
                : () => handleExploreClick(chapter.id)
          }
        >
          {chapter.isUnlocked ? (chapter.hasVideo ? "Watch Video" : "Start Chapter") : "Locked"}
        </Button>
        </div>

        {chapter.hasVideo && chapter.duration && (
        <div className="absolute top-32 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {chapter.duration}
        </div>
        )}
      </div>

      {isModalOpen && chapter.hasVideo && chapter.videoId && (
        <VideoModal
          video={{
            id: chapter.id.toString(),
            title: chapter.title,
            instructor: "Course Instructor",
            subject: "Course Subject", 
            duration: chapter.duration || "10:00",
            rating: chapter.rating || 0,
            youtubeId: chapter.videoId
          }}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};