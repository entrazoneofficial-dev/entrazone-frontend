
import { Play, Star, Clock } from "lucide-react";
import { useState } from "react";
import { VideoModal } from "../Commen/VideoModal";



export function VideoCard({ video }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-video group">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&controls=0&modestbranding=1&rel=0`}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          ></iframe>

          <div className="absolute top-3 left-3">
            <span className="bg-[#D9D9D9] text-black text-xs font-medium px-3 py-1 rounded-full">
              {video.subject}
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Play className="w-6 h-6 text-gray-800 fill-current ml-1" />
            </div>
          </div>

          <div className="absolute bottom-3 right-3">
            <div className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-lg">
            {video.title}
          </h3>
          <p className="text-gray-600 text-sm">{video.instructor}</p>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {video.rating}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VideoModal video={video} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}