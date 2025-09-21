
import { X, Star, Send, Clock } from "lucide-react"
import { useState } from "react"



export const VideoModal = ({ video, onClose }) => {
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [comments] = useState([
    {
      id: "1",
      author: "Sarah Johnson",
      content:
        "This explanation of cooperation principles is really clear! The examples helped me understand the practical applications much better.",
      timestamp: "2 hours ago",
      avatar: "SJ",
    },
    {
      id: "2",
      author: "Mike Chen",
      content: "Great video! The concepts are well explained.",
      timestamp: "4 hours ago",
      avatar: "MC",
    },
    {
      id: "3",
      author: "Emma Davis",
      content: "Very helpful for my studies. Thank you!",
      timestamp: "1 day ago",
      avatar: "ED",
    },
    {
      id: "4",
      author: "John Smith",
      content: "Excellent presentation and clear examples.",
      timestamp: "2 days ago",
      avatar: "JS",
    },
  ])

  const handleRatingClick = (starIndex) => {
    setRating(starIndex + 1)
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComment("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 line-clamp-1">{video.title}</h2>
            <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{video.duration}</span>
              <span className="bg-gray-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded">Video</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 p-2 md:p-4 lg:p-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
          </div>

          <div className="w-full md:w-80 border-t md:border-l bg-gray-50 flex flex-col overflow-y-auto">
            <div className="p-4 md:p-6 border-b bg-white">
              <h3 className="text-md md:text-lg font-semibold mb-3 md:mb-4">Rate this lesson</h3>
              <div className="flex gap-1 justify-center md:justify-start">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleRatingClick(index)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`Rate ${index + 1} star`}
                  >
                    <Star className={`w-6 h-6 md:w-8 md:h-8 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6 border-b bg-white">
              <h3 className="text-md md:text-lg font-semibold mb-3 md:mb-4">Add a comment</h3>
              <div className="space-y-2 md:space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this lesson"
                  className="w-full p-2 md:p-3 border border-gray-200 rounded-lg resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                  className="w-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                  Post Comment
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6">
                <h3 className="text-md md:text-lg font-semibold mb-3 md:mb-4">Comments ({comments.length})</h3>
                <div className="space-y-3 md:space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
                          <span className="font-medium text-gray-900 text-sm md:text-base">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}