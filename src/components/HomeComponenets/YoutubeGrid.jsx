import { VideoCard } from "./VideoCard";

export const YoutubeGrid = () => {

  const videos = [
    {
      id: "1",
      title: "Introduction to Principles",
      instructor: "Dr. Sarah Johnson",
      subject: "Mathematics",
      duration: "45 min",
      rating: 4.8,
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "2",
      title: "Introduction to Principles",
      instructor: "Dr. Sarah Johnson",
      subject: "Social Science",
      duration: "45 min",
      rating: 4.8,
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "3",
      title: "Introduction to Principles",
      instructor: "Dr. Sarah Johnson",
      subject: "Biology",
      duration: "45 min",
      rating: 4.8,
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "4",
      title: "Introduction to Principles",
      instructor: "Dr. Sarah Johnson",
      subject: "Chemistry",
      duration: "45 min",
      rating: 4.8,
      youtubeId: "dQw4w9WgXcQ",
    },
  ];
  

  return (
    <div className="">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
          <VideoCard key={video.id} video={video} />

          ))}

        </div>
      </div>
    </div>
  );
};
