 import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft, User } from "lucide-react";
import pdficon from "../../assets/pdficon.png";
import playbutton from "../../assets/playbutton.png";
import Lessontick from "../../assets/lessontick.png";
import questionicon from "../../assets/questionicon.png";
import Reply from "../../assets/reply.png";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import YouTube from "react-youtube";
import Hls from "hls.js";
import useAxios from "../../axios";
import { showSpinner, hideSpinner } from "../../Redux/loadingSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { setTpStreamData } from "../../Redux/tpStreamSlice";
import TP from '../TP';

export default function Note({ datas }) {
  // console.log(datas);
  
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); 
  const [isAddingComment, setIsAddingComment] = useState(false);  
  const [isFetchingComments, setIsFetchingComments] = useState(false);  
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyComment, setReplyComment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [tpVideoData, setTpVideoData] = useState(null);
  const [showTPPlayer, setShowTPPlayer] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [nextVideo, setNextVideo] = useState(null);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingVideo, setPendingVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const videoDurationRef = useRef(null); // Added videoDurationRef
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  // Get tp_stream data from Redux store
  const tpStreamData = useSelector((state) => state.tpStream.tpStreamData);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);

  // Add this useEffect to check for selected video in localStorage
  useEffect(() => {
    const checkForSelectedVideo = async () => {
      const selectedVideoJson = localStorage.getItem("selected_video");
      
      if (selectedVideoJson) {
        try {
          const selectedVideo = JSON.parse(selectedVideoJson);
          // console.log("Found selected video in localStorage:", selectedVideo);
          
          // Clear localStorage to prevent auto-playing on future visits
          localStorage.removeItem("selected_video");
          
          if (selectedVideo) {
            dispatch(showSpinner());
            setIsVideoProcessing(true);
            
            // Create a proper lesson object with videos array
            const dummyLesson = {
              id: selectedVideo.lesson_id || 0,
              lesson_name: "Recent Video",
              videos: [selectedVideo] // Add the video to the videos array
            };
            
            // Process the video directly
            await processVideoChange(dummyLesson, selectedVideo);
          }
        } catch (error) {
          console.error("Error processing selected video from localStorage:", error);
          dispatch(hideSpinner());
          setIsVideoProcessing(false);
        }
      }
    };
    
    // Run this effect once when component mounts
    checkForSelectedVideo();
  }, []);

  const handleExamClick = (examId, total_questions, examType) => {
    if (total_questions === 0) {
      // alert("This exam has no questions available.");
      return;
    }
    // console.log("Exam Type:", examType);
    // console.log("Exam ID:", examId);
    // console.log("Total Questions:", total_questions);
    
    localStorage.setItem("examId", examId);
    if (examType === "Review Question") { // Mock Exam
      navigate("/exam");
    } else {
      navigate("/mockexam");
    }
  };

  const chapterName = datas?.data?.chapter_name || "";
  const subjectName = datas?.data?.subject_name || "";
  const ogchapterName = datas?.data?.ogchapter_name || "";
  const lessons = datas?.data?.lessons || [];
  const direct_content = datas?.data?.direct_content || {};

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleVideoClick = async (lesson, video) => {
    // Log when user switches videos
    if (videoVisible || showTPPlayer) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      // console.log(`[${dateString} ${timeString}] Note Component: User switched to new video: ${video.title || 'Untitled'}`);
      
      // If we have a current video playing and switching to a new one, log the current watch time
      if (currentTimeRef.current > 0) {
        const watchedMinutes = Math.floor(currentTimeRef.current / 60);
        const watchedSeconds = Math.floor(currentTimeRef.current % 60);
        const formattedWatchTime = `${watchedMinutes}:${watchedSeconds.toString().padStart(2, '0')}`;
        
        // Determine which type of video is currently playing
        let currentVideoType = "Regular";
        let currentVideoId = null;
        let totalDuration = videoDuration || 0;
        
        if (showTPPlayer) {
          currentVideoType = "TP Stream";
          const video = currentLesson?.videos?.find(v => v.tp_stream === videoUrl);
          currentVideoId = video?.id;
        } else if (youtubePlayerRef.current) {
          currentVideoType = "YouTube";
          const video = currentLesson?.videos?.find(v => v.url === videoUrl);
          currentVideoId = video?.id;
          totalDuration = youtubePlayerRef.current.getDuration();
          
          // console.log("=== YouTube Video Switch Information ===");
          // console.log(`Video Total Duration: ${totalDuration} seconds (${formatTimeHHMMSS(totalDuration)})`);
          // console.log(`User Watched: ${currentTimeRef.current} seconds (${formatTimeHHMMSS(currentTimeRef.current)})`);
          // console.log(`Watch Percentage: ${Math.round((currentTimeRef.current / totalDuration) * 100)}%`);
          if (youtubeWatchStartTime.current) {
            // console.log(`Watch Start: ${youtubeWatchStartTime.current.toLocaleTimeString()}`);
          }
          // console.log(`Watch End: ${timeString}`);
          // console.log("========================================");
        } else {
          const video = currentLesson?.videos?.find(v => v.url === videoUrl);
          currentVideoId = video?.id;
        }
        
        // console.log(`[${dateString} ${timeString}] Note Component: Previous ${currentVideoType} video watched for ${formattedWatchTime} before switching`);
        // console.log(`Previous video ID: ${currentVideoId}, Total duration: ${formatTimeHHMMSS(totalDuration)}`);
        
        // Send data to API for the previous video
        if (currentVideoId) {
          await sendWatchDataToAPI(currentVideoId, currentTimeRef.current, totalDuration);
          // console.log(`[${dateString} ${timeString}] Note Component: Sent watch data to API for previous ${currentVideoType} video before switching`);
        }
        
        // Clear YouTube player interval if exists
        if (youtubePlayerRef.current && youtubePlayerRef.current.timeTrackerId) {
          clearInterval(youtubePlayerRef.current.timeTrackerId);
          // console.log("Cleared YouTube player tracking interval");
        }
      }
    }
    
    setIsVideoProcessing(true);
    dispatch(showSpinner()); // Show default loader
    
    // Process the new video
    processVideoChange(lesson, video);
  };

  // Add this state for duration


// Enhanced processVideoChange function to reliably extract duration from TP Stream
const processVideoChange = async (lesson, video) => {
  // Reset playback time tracking when switching videos
  currentTimeRef.current = 0;
  setCurrentPlaybackTime(0);
  try {
    let newVideoData = null;
    setVideoDuration(null); // Reset duration
    
    // For TP stream videos, fetch token first
    if (video.tp_stream) {
      // console.log("Processing TP stream video with ID:", video.tp_stream);
      const response = await axiosInstance.get('v1/tpstream-token/', {
        params: { asset_id: video.tp_stream }
      });
      
      // console.log("TP Stream response:", response.data);
      
      if (response.data?.status === "success") {
        // Try to extract duration from various possible locations in the response
        let extractedDuration = null;
        
        // Method 1: Check response.data.data.duration
        if (response.data.data?.duration) {
          extractedDuration = parseFloat(response.data.data.duration);
          // console.log("Found duration in response.data.data.duration:", extractedDuration);
        }
        // Method 2: Check response.data.asset.duration
        else if (response.data.asset?.duration) {
          extractedDuration = parseFloat(response.data.asset.duration);
          // console.log("Found duration in response.data.asset.duration:", extractedDuration);
        }
        // Method 3: Check response.data.data.asset.duration
        else if (response.data.data?.asset?.duration) {
          extractedDuration = parseFloat(response.data.data.asset.duration);
          // console.log("Found duration in response.data.data.asset.duration:", extractedDuration);
        }
        // Method 4: Check response.data.data.metadata.duration
        else if (response.data.data?.metadata?.duration) {
          extractedDuration = parseFloat(response.data.data.metadata.duration);
          // console.log("Found duration in response.data.data.metadata.duration:", extractedDuration);
        }
        
        // If we found a valid duration, set it
        if (extractedDuration && !isNaN(extractedDuration) && extractedDuration > 0) {
          // console.log("Setting video duration from TP Stream response:", extractedDuration);
          setVideoDuration(extractedDuration);
        } else {
          // console.log("Could not find valid duration in TP Stream response, will try to extract from video element later");
        }
        
        // Get the playback URL
        const playbackUrl = response.data.data?.playback_url || 
                          response.data.asset?.playback_url || 
                          response.data.playback_url;
        
        if (playbackUrl) {
          // console.log("Got HLS URL from TP Stream:", playbackUrl);
          
          // If we still don't have duration, try to extract it from the HLS manifest
          if (!extractedDuration || isNaN(extractedDuration) || extractedDuration <= 0) {
            // We'll set up a promise to try to get duration from HLS.js
            const durationPromise = new Promise((resolve) => {
              try {
                // Only try this if HLS.js is supported
                if (Hls.isSupported()) {
                  const tempVideo = document.createElement('video');
                  const hls = new Hls();
                  
                  // Set a timeout to avoid hanging
                  const timeoutId = setTimeout(() => {
                    // console.log("Timeout getting duration from HLS manifest");
                    hls.destroy();
                    tempVideo.remove();
                    resolve(null);
                  }, 5000);
                  
                  // Load the m3u8 stream
                  hls.loadSource(playbackUrl);
                  hls.attachMedia(tempVideo);
                  
                  // Listen for manifest parsing and level loading
                  hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // console.log("HLS manifest parsed");
                    
                    // Listen for level loaded event to get duration
                    hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
                      if (data.details && data.details.totalduration) {
                        const duration = data.details.totalduration;
                        // console.log("TP Stream video duration from HLS manifest:", duration);
                        clearTimeout(timeoutId);
                        hls.destroy();
                        tempVideo.remove();
                        resolve(duration);
                      }
                    });
                  });
                  
                  // Alternative: use video element metadata to get duration
                  tempVideo.addEventListener('loadedmetadata', () => {
                    if (tempVideo.duration && tempVideo.duration !== Infinity) {
                      // console.log("TP Stream video duration from video element:", tempVideo.duration);
                      clearTimeout(timeoutId);
                      hls.destroy();
                      tempVideo.remove();
                      resolve(tempVideo.duration);
                    }
                  });
                  
                  // Handle errors
                  hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS error while trying to get duration:", data);
                    if (data.fatal) {
                      clearTimeout(timeoutId);
                      hls.destroy();
                      tempVideo.remove();
                      resolve(null);
                    }
                  });
                } else {
                  // HLS.js not supported, resolve with null
                  resolve(null);
                }
              } catch (error) {
                console.error("Error setting up HLS for duration extraction:", error);
                resolve(null);
              }
            });
            
            // Try to get duration with a timeout
            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 5000));
            const hlsDuration = await Promise.race([durationPromise, timeoutPromise]);
            
            if (hlsDuration && !isNaN(hlsDuration) && hlsDuration > 0) {
              // console.log("Setting video duration from HLS extraction:", hlsDuration);
              setVideoDurationFromHLS(hlsDuration); // Modified to use setVideoDurationFromHLS
            }
          }
          
          newVideoData = {
            tpData: response.data,
            url: video.tp_stream,
            isTP: true
          };
        } else {
          console.error("No playback URL found in TP Stream response");
        }
      } else {
        console.error("TP Stream response was not successful:", response.data);
      }
    } else {
      // For non-TP videos, prepare URL
      newVideoData = {
        url: getVideoUrl(video),
        isTP: false
      };
    }
    
    // Update video states
    if (newVideoData) {
      // Clear previous video state
      setTpVideoData(null);
      setVideoUrl("");
      
      // Small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update all states at once
      if (newVideoData.isTP) {
        setTpVideoData(newVideoData.tpData);
        dispatch(setTpStreamData(newVideoData.tpData));
        setShowTPPlayer(true);
      } else {
        setShowTPPlayer(false);
      }
      
      setVideoUrl(newVideoData.url);
      setCurrentLesson(lesson);
      setVideoVisible(true);
      setNextVideo({ lesson, video });
      
      // Fetch comments in background
      fetchComments(video.id);
    }
  } catch (error) {
    console.error("Error processing video:", error);
  } finally {
    setIsVideoProcessing(false);
    dispatch(hideSpinner()); // Hide default loader
  }
};

// Optional: Add a function to format the duration for display
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// You can now display the duration wherever needed
// For example:
// {videoDuration && <span>Duration: {formatDuration(videoDuration)}</span>}


  useEffect(() => {
    if (nextVideo) {
      const { lesson } = nextVideo;
      setExpandedLesson(lesson.id);
      
      // Close PDF if open
      if (pdfVisible) {
        setPdfVisible(false);
        setCurrentPdf(null);
        setPdfLoading(false);
      }
      
      // Clear next video state
      setNextVideo(null);
    }
  }, [nextVideo]);

  // Helper function to check if browser can use native HLS
const canUseNativeHls = () => {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};

// Handle video playback setup
useEffect(() => {
  if (videoRef.current && videoUrl) {
    // Set up error handling for the video element
    const handleVideoError = (e) => {
      console.error("Video error:", e);
      setIsVideoProcessing(false);
    };
    
    videoRef.current.addEventListener('error', handleVideoError);
    
    // For HLS videos
    if (videoUrl.endsWith(".m3u8")) {
      // Use native HLS for Safari and iOS
      if (canUseNativeHls()) {
        // console.log("Using native HLS playback for Safari/iOS");
        videoRef.current.src = videoUrl;
        
        videoRef.current.addEventListener('loadedmetadata', () => {
          // If we don't have duration yet, get it from the video element
          if ((!videoDuration || videoDuration <= 0) && videoRef.current.duration && videoRef.current.duration !== Infinity) {
            // console.log("Setting video duration from video element:", videoRef.current.duration);
            setVideoDuration(videoRef.current.duration);
          }
          
          setIsVideoProcessing(false);
          videoRef.current.dataset.loaded = "true";
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
          });
        });
      } 
      // Use HLS.js for other browsers
      else if (Hls.isSupported()) {
        // console.log("Using HLS.js for video playback");
        const hls = new Hls({
          // Enable auto recovery on network and media errors
          autoRecoverError: true,
          // Increase number of levels in quality selection
          maxBufferLength: 30,
          // More aggressive buffering for smoother playback
          maxMaxBufferLength: 60
        });
        
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // console.log("HLS manifest parsed, starting playback");
          videoRef.current.play().catch(err => {
            console.error("Error playing video after manifest parsed:", err);
          });
        });

        hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          // Extract duration from HLS manifest if available
          if ((!videoDuration || videoDuration <= 0) && data.details && data.details.totalduration) {
            // console.log("Setting video duration from HLS manifest:", data.details.totalduration);
            setVideoDurationFromHLS(data.details.totalduration); // Modified to use setVideoDurationFromHLS
          }
          
          setIsVideoProcessing(false);
          videoRef.current.dataset.loaded = "true";
        });
        
        // Handle HLS.js errors
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // console.log("Fatal network error, trying to recover");
                hls.startLoad(); // Try to recover network error
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                // console.log("Fatal media error, trying to recover");
                hls.recoverMediaError(); // Try to recover media error
                break;
              default:
                console.error("Fatal HLS error, cannot recover");
                setIsVideoProcessing(false);
                break;
            }
          }
        });

        return () => {
          hls.destroy();
          if (videoRef.current) {
            videoRef.current.removeEventListener('error', handleVideoError);
            videoRef.current.dataset.loaded = "false";
          }
        };
      } else {
        console.error("HLS is not supported in this browser and no native support");
        setIsVideoProcessing(false);
      }
    } else {
      // For non-HLS videos
      videoRef.current.src = videoUrl;
      
      videoRef.current.addEventListener('loadedmetadata', () => {
        // If we don't have duration yet, get it from the video element
        if ((!videoDuration || videoDuration <= 0) && videoRef.current.duration && videoRef.current.duration !== Infinity) {
          // console.log("Setting video duration from video element (non-HLS):", videoRef.current.duration);
          setVideoDuration(videoRef.current.duration);
        }
        
        setIsVideoProcessing(false);
        videoRef.current.dataset.loaded = "true";
      });

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('error', handleVideoError);
          videoRef.current.removeEventListener('loadedmetadata', () => {});
          videoRef.current.dataset.loaded = "false";
        }
      };
    }
  }
}, [videoUrl, videoDuration]);

  // Clear video processing state when component unmounts
  useEffect(() => {
    return () => {
      setIsVideoProcessing(false);
    };
  }, []);

  const handlePdfClick = (lesson, pdf) => {
    // console.log("Base URL:", "https://admin.ledgergate.com");
    // console.log("PDF file path:", pdf?.file);
  
    if (!pdf?.file) {
      console.error('No PDF file available');
      return;
    }

    // Start loading immediately
    dispatch(showSpinner());
    setExpandedLesson(lesson.id);
    setPdfVisible(true);
    setCurrentPdf(pdf);
    setPdfLoading(true);
    setPageNumber(1); // Reset to page 1 for new PDFs
  
    // Close video player if it's open
    if (videoVisible) {
      setVideoVisible(false);
      setVideoUrl("");
      setCurrentLesson(null);
      setComments([]);
      setShowTPPlayer(false);
      setTpVideoData(null);
    }
  
    window.history.pushState({ pdf: true }, '');
  };

  const closePdf = () => {
    setPdfVisible(false);
    setCurrentPdf(null);
    setPdfLoading(false);
    if (window.history.state?.pdf) {
      window.history.back();
    }
  };

  const fetchTpStreamData = async (tpStreamId) => {
    // console.log(tpStreamId);
  
    try {
      dispatch(showSpinner());
      const response = await axiosInstance.get('v1/tpstream-token/', {
        params: {
          asset_id: tpStreamId
        }
      });
    
      if (response.data && response.data.status === "success") {
        dispatch(setTpStreamData(response.data));

        // console.log("TP stream token received, setting video data for TP component");
        // console.log(response.data);
        setTpVideoData(response.data);
        setShowTPPlayer(true);
      }
    } catch (error) {
      console.error("Error fetching tp stream:", error);
    } finally {
      dispatch(hideSpinner());
    }
  };

  const getVideoUrl = (video) => {
    if (video.tp_stream && video.tp_stream !== "") {
      console.log(video.tp_stream,"tp stream ");
      return video.tp_stream;
    }
    if (video.m3u8 && video.m3u8 !== "") {
      return video.m3u8;
    }
    if (video.url) {
      return video.url;
    }
    return "";
  };

  const getPdfUrl = (pdf) => {
    if (pdf && pdf.file) {
      return `https://admin.ledgergate.com${pdf.file}`;
    }
    return '';
  };

  const fetchComments = async (videoId) => {
    setIsFetchingComments(true);  
    dispatch(showSpinner());
    try {
      const response = await axiosInstance.post('/v1/comment-list/', {
        video_id: videoId 
      });

      if (response.data) {
        setComments(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsFetchingComments(false);  
      dispatch(hideSpinner());
    }
  };

  const handleAddComment = async () => {
    const video = currentLesson?.videos?.find((v) => 
      v.tp_stream === videoUrl || 
      v.m3u8 === videoUrl || 
      v.url === videoUrl
    );
    const videoId = video?.id;
    const commentContent = newComment.trim();

    if (!videoId || !commentContent) {
      alert("Please select a video and enter a comment.");
      return;
    }

    setIsAddingComment(true);
    dispatch(showSpinner()); 

    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const params = new URLSearchParams();
      params.append('video_id', videoId);  
      params.append('content', commentContent);  

      const response = await axiosInstance.get(
        "/v1/comment-add/",  
        {
          params,  
          headers: {
            "Content-Type": "application/json",  
            "X-CSRFToken": csrfToken,  
          },
        }
      );

      if (response.data?.status === "success") {
        const addedComment = response.data.response_data;
        setComments((prevComments) => [addedComment, ...prevComments]);  
        setNewComment("");  
      } else {
        // console.error("Failed to add comment:", response.data.message || "Unknown error");
      }
    } catch (error) {
      if (error.response) {
        // console.error("Error response:", error.response?.data);
      } else if (error.request) {
        // console.error("No response received:", error.request);
      } else {
        // console.error("Error message:", error.message);
      }
    } finally {
      setIsAddingComment(false);  
      dispatch(hideSpinner()); // Hide spinner after processing
    }
  };

  const handleAddReply = async (commentId) => {
    const video = currentLesson?.videos?.find((v) => 
      v.tp_stream === videoUrl || 
      v.m3u8 === videoUrl || 
      v.url === videoUrl
    );
    const videoId = video?.id;
    const replyContent = replyComment.trim();
  
    if (!replyContent) {
      return;
    }

    setIsAddingComment(true);
  
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
  
      const params = new URLSearchParams();
      params.append('content', replyContent);
      params.append('parent_comment_id', commentId);
  
      const response = await axiosInstance.get(
        "/v1/comment-react/",
        {
          params,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );
  
      if (response.data?.status === "success") {
        const addedComment = response.data.response_data;
        
        // Update the replies count in the parent comment
        setComments((prevComments) => {
          return prevComments.map(comment => {
            if (comment.comment_id === commentId) {
              return {
                ...comment,
                reply_count: (comment.reply_count || 0) + 1
              };
            }
            return comment;
          });
        });

        // Fetch all replies to ensure we have the complete list
        try {
          const repliesResponse = await axiosInstance.get('/v1/comment-replies/', {
            params: { comment_id: commentId },
          });
          if (repliesResponse.data?.data?.replies) {
            setExpandedReplies(prev => ({
              ...prev,
              [commentId]: repliesResponse.data.data.replies
            }));
          }
        } catch (error) {
          console.error('Error fetching replies:', error);
          // If fetching all replies fails, at least show the new reply
          setExpandedReplies(prev => ({
            ...prev,
            [commentId]: [...(prev[commentId] || []), addedComment]
          }));
        }

        setReplyComment("");
        setReplyCommentId(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const toggleReplyInput = (commentId) => {
    setReplyCommentId(prevId => (prevId === commentId ? null : commentId));
    setReplyComment(""); // Clear reply input when toggling
  };

  useEffect(() => {
    // Handle browser back button for both video and pdf
    const handlePopState = (event) => {
      if (videoVisible) {
        event.preventDefault();
        closeVideo();
      } else if (pdfVisible) {
        event.preventDefault();
        closePdf();
      }
    };

    if (videoVisible || pdfVisible) {
      window.history.pushState({ video: videoVisible, pdf: pdfVisible }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [videoVisible, pdfVisible]);

  // closeVideo function is implemented below with enhanced tracking for TP stream videos

  // PDF.js document load success is now handled directly in the Document component

  // PDF viewer functionality
  
// Add this state variable at the top with your other state declarations

// For TP Stream videos - add this useEffect
// Add this ref to track current time more reliably
const currentTimeRef = useRef(0);

// Modify your existing useEffect for TP Stream videos
useEffect(() => {
  if (showTPPlayer && tpVideoData) {
    // Set up interval to track TP player time
    const timeTracker = setInterval(() => {
      // Try to get the video element inside TP player
      const videoElement = document.querySelector('.tp-player video');
      if (videoElement) {
        // Update both state and ref for reliability
        setCurrentPlaybackTime(videoElement.currentTime);
        currentTimeRef.current = videoElement.currentTime;
      }
    }, 1000);
    
    return () => clearInterval(timeTracker);
  }
}, [showTPPlayer, tpVideoData]);

// Function to format time in HH:MM:SS format
const formatTimeHHMMSS = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Function to format time in the format required by the API (HH:MM:SS or MM:SS)
const formatTimeForAPI = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    return "00:00:00";
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  // Format as HH:MM:SS
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } 
  // Format as MM:SS when no hours
  else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// Function to send watch data to API
const sendWatchDataToAPI = async (videoId, watchedSeconds, totalDuration) => {
  try {
    if (!videoId) {
      // console.log("No video ID provided, skipping API call");
      return;
    }
    
    // Use the stored HLS duration if available
    const finalDuration = totalDuration || videoDurationRef.current || videoDuration || 0;
    
    // Format times in required format for API
    const minutesWatched = formatTimeHHMMSS(watchedSeconds);
    const totalDurationFormatted = formatTimeHHMMSS(finalDuration);
    
    // console.log(`Sending watch data to API: Video ID: ${videoId}, Watched: ${minutesWatched}, Total: ${totalDurationFormatted}, Raw Duration: ${finalDuration}`);
    
    // Create payload according to required format
    const payload = {
      video_id: videoId,
      minutes_watched: minutesWatched,
      total_duration: totalDurationFormatted
    };
    
    // console.log("API Payload:", payload);
    
    const response = await axiosInstance.post('v1/video-pause-resume/', payload);
    
    // console.log("Watch data sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending watch data to API:", error);
    
    // Add more detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    
    // Try to send a simplified payload as a fallback
    try {
      // console.log("Attempting to send simplified payload as fallback...");
      const simplifiedPayload = {
        video_id: parseInt(videoId, 10), // Ensure it's a number
        minutes_watched: minutesWatched,
        total_duration: totalDurationFormatted
      };
      
      // console.log("Simplified API Payload:", simplifiedPayload);
      const fallbackResponse = await axiosInstance.post('v1/video-pause-resume/', simplifiedPayload);
      // console.log("Fallback request successful:", fallbackResponse.data);
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("Fallback request also failed:", fallbackError.message);
    }
  }
};

// Function to set video duration from HLS manifest
const setVideoDurationFromHLS = (duration) => {
  // console.log("Setting video duration from HLS extraction:", duration);
  setVideoDuration(duration);
  // Also store in ref for reliability
  videoDurationRef.current = duration;
};

// Enhanced closeVideo function with watch time tracking using ref for reliability
const closeVideo = async () => {
  // Get current time
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();
  
  // Only process if it was a TP Stream video
  if (showTPPlayer && currentTimeRef.current > 0) {
    // Format the watched time
    const watchedMinutes = Math.floor(currentTimeRef.current / 60);
    const watchedSeconds = Math.floor(currentTimeRef.current % 60);
    const formattedWatchTime = `${watchedMinutes}:${watchedSeconds.toString().padStart(2, '0')}`;
    
    // console.log(`[${dateString} ${timeString}] Note Component: Video closed - User watched ${formattedWatchTime} of the TP Stream video before exiting`);
    
    // Save watch information to localStorage
    const video = currentLesson?.videos?.find(v => v.tp_stream === videoUrl);
    if (video?.id) {
      // Send data to API
      await sendWatchDataToAPI(video.id, currentTimeRef.current, videoDuration);
      
      // Save to localStorage
      const watchHistory = JSON.parse(localStorage.getItem('tpStreamWatchHistory') || '{}');
      watchHistory[video.id] = {
        title: video.title || 'Unknown video',
        watchedTime: currentTimeRef.current,
        formattedWatchTime: formattedWatchTime,
        closedAt: `${dateString} ${timeString}`,
        watchedAt: new Date().toISOString()
      };
      localStorage.setItem('tpStreamWatchHistory', JSON.stringify(watchHistory));
    }
  } else if (videoVisible && !showTPPlayer && youtubePlayerRef.current && currentTimeRef.current > 0) {
    // For YouTube videos
    // console.log(`[${dateString} ${timeString}] Note Component: YouTube video closed`);
    
    // Get current time from YouTube player
    const currentTime = youtubePlayerRef.current.getCurrentTime();
    const duration = youtubePlayerRef.current.getDuration();
    
    // Format the watched time
    const watchedMinutes = Math.floor(currentTime / 60);
    const watchedSeconds = Math.floor(currentTime % 60);
    const formattedWatchTime = `${watchedMinutes}:${watchedSeconds.toString().padStart(2, '0')}`;
    
    // console.log("=== YouTube Video Exit Information ===");
    // console.log(`Video Total Duration: ${duration} seconds (${formatTimeHHMMSS(duration)})`);
    // console.log(`User Watched: ${currentTime} seconds (${formatTimeHHMMSS(currentTime)})`);
    // console.log(`Watch Percentage: ${Math.round((currentTime / duration) * 100)}%`);
    // console.log(`Watch Start: ${youtubeWatchStartTime.current.toLocaleTimeString()}`);
    // console.log(`Watch End: ${timeString}`);
    // console.log("=======================================");
    
    // console.log(`[${dateString} ${timeString}] Note Component: User watched ${formattedWatchTime} of the YouTube video before exiting`);
    
    // Find the current video
    const video = currentLesson?.videos?.find(v => v.url === videoUrl);
    if (video?.id) {
      // Send data to API
      await sendWatchDataToAPI(video.id, currentTime, duration);
      // console.log(`[${dateString} ${timeString}] Note Component: YouTube video closed - Data sent to API for video ID: ${video.id}`);
      
      // Save to localStorage
      const watchHistory = JSON.parse(localStorage.getItem('youtubeWatchHistory') || '{}');
      watchHistory[video.id] = {
        title: video.title || 'Unknown video',
        watchedTime: currentTime,
        totalDuration: duration,
        formattedWatchTime: formattedWatchTime,
        closedAt: `${dateString} ${timeString}`,
        watchedAt: new Date().toISOString()
      };
      localStorage.setItem('youtubeWatchHistory', JSON.stringify(watchHistory));
    }
    
    // Clear the interval that was tracking YouTube playback time
    if (youtubePlayerRef.current.timeTrackerId) {
      clearInterval(youtubePlayerRef.current.timeTrackerId);
    }
  } else if (videoVisible && currentTimeRef.current > 0) {
    // For regular videos, try to get the video ID and send data
    const video = currentLesson?.videos?.find(v => v.url === videoUrl);
    if (video?.id) {
      await sendWatchDataToAPI(video.id, currentTimeRef.current, videoDuration);
      // console.log(`[${dateString} ${timeString}] Note Component: Regular video closed - Data sent to API`);
    } else {
      // console.log(`[${dateString} ${timeString}] Note Component: Regular video closed - No video ID found`);
    }
  }
  
  // Reset all states
  setVideoVisible(false);
  setVideoUrl("");
  setCurrentLesson(null);
  setComments([]);
  setShowTPPlayer(false);
  setTpVideoData(null);
  setCurrentPlaybackTime(0);
  
  // Make sure to reset the refs
  currentTimeRef.current = 0;
  youtubePlayerRef.current = null;
  youtubeWatchStartTime.current = null;
  
  // Remove the history state we added
  if (window.history.state?.video) {
    window.history.back();
  }
};

  const youtubePlayerRef = useRef(null);
  const youtubeWatchStartTime = useRef(null);
return (
    <div className="flex flex-col md:flex-row md:mt-16 md:ml-10 mt-[60px] md:mr-5 min-h-screen max-h-screen overflow-hidden">
      {/* Lesson List - Hide on mobile when video is playing */}
      <div
        className={`${
          videoVisible || pdfVisible ? 'hidden md:block' : 'block'
        } transition-all ${
          videoVisible || pdfVisible ? "w-[500px]" : "w-full md:w-[1200px]"
        } h-[calc(100vh-100px)]`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4">
            <nav className="flex flex-wrap items-center text-gray-600 text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base py-2 ml-1">
              <span 
                className="text-gray-500 hover:text-black transition-all cursor-pointer"
                onClick={() => {
                  navigate('/'); 
                }}
              >
                Home
              </span>
              <span className="mx-1 md:mx-2 text-gray-400">/</span>
              <span 
                className="text-gray-500 hover:text-black transition-all cursor-pointer"
                onClick={() => {
                  navigate('/contentlist');
                }}
              >
                {subjectName}
              </span>
              <span className="mx-1 md:mx-2 text-gray-400">/</span>
              <span 
                className="text-gray-500 hover:text-black transition-all cursor-pointer"
                onClick={() => {
                  navigate('/topic');
                }}
              >
                {ogchapterName}
              </span>
              <span className="mx-1 md:mx-2 text-gray-400">/</span>
              <span className="text-orange-500 font-medium">
                {chapterName}
              </span>
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4" 
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #F1F1F1',
              WebkitOverflowScrolling: 'touch'
            }}>
            <div className="space-y-4 pb-16">
              {/* Lesson Cards */}
              {lessons.map((lesson, index) => (
                <div key={index}>
                  {/* Lesson Card */}
                  <div className="rounded-xl bg-white mb-4">
                    {/* Lesson Header */}
                    <div
                      onClick={() => toggleLesson(lesson.id)}
                      className={`flex items-center justify-between md:h-[4rem] p-4 text-left ${lesson.show ? 'cursor-pointer hover:bg-gray-50' : ''} hover:rounded-xl`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${!lesson.show ? '' : ''}`}>
                          {lesson.lesson_name}
                        </span>
                      </div>
                      {lesson.show ? (
                        expandedLesson === lesson.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      
                    </div>

                    {/* Expandable Section */}
                    {expandedLesson === lesson.id && lesson.show && (
                      <div className="pl-5 pr-5">
                        {/* Combined and Sorted Videos and PDFs Section */}
                        {(() => {
                          // Create combined array of videos and PDFs with type indicator
                          const combinedContent = [];
                          
                          // Add videos to combined array
                          if (lesson.videos?.length > 0) {
                            lesson.videos.forEach(video => {
                              combinedContent.push({
                                ...video,
                                type: 'video',
                                order: video.order || 999, // Default high order if not specified
                                title: video.title || "Untitled Video"
                              });
                            });
                          }
                          
                          // Add PDFs to combined array
                          if (lesson.pdf_notes?.length > 0) {
                            lesson.pdf_notes.forEach(pdf => {
                              combinedContent.push({
                                ...pdf,
                                type: 'pdf',
                                order: pdf.order || 999, // Default high order if not specified
                                title: pdf.title || "Untitled PDF Note"
                              });
                            });
                          }
                          
                          // Sort combined content by order field
                          combinedContent.sort((a, b) => a.order - b.order);
                          
                          // If no content, return empty div
                          if (combinedContent.length === 0) {
                            return <div className="text-sm text-gray-500"></div>;
                          }
                          
                          // Map and render content based on type
                          return combinedContent.map((item, index) => {
                            if (item.type === 'video') {
                              // Render video item
                              return (
                                <div
                                  key={`video-${item.id || index}`}
                                  className="flex justify-between items-center py-4 mt-1 mb-1 border-t cursor-pointer hover:bg-gray-50 hover:rounded-lg"
                                  onClick={() => item.show && handleVideoClick(lesson, item)}
                                >
                                  <div className="flex items-center gap-2 text-sm">
                                    {!item.show ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    ) : (
                                      <img
                                        src={playbutton}
                                        alt="Play"
                                        className="w-5 h-5 cursor-pointer"
                                      />
                                    )}
                                    <span>{item.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <img
                                      src={Lessontick}
                                      className="w-5 h-5 text-green-500"
                                      alt="Video Icon"
                                    />
                                  </div>
                                </div>
                              );
                            } else if (item.type === 'pdf') {
                              // Render PDF item
                              return (
                                <div
                                  key={`pdf-${item.id || index}`}
                                  className="flex justify-between items-center py-4 mt-1 mb-1 border-t cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                                  onClick={() => item.show && handlePdfClick(lesson, item)}
                                >
                                  <div className="flex items-center gap-2 text-sm">
                                    {!item.show ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    ) : (
                                      <img
                                        src={pdficon}
                                        alt="PDF Icon"
                                        className="w-5 h-5"
                                      />
                                    )}
                                    <span>{item.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <img
                                      src={Lessontick}
                                      className="w-5 h-5 text-green-500"
                                      alt="PDF Icon"
                                    />
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          });
                        })()}

                        
                        {/* Non-Mock Exams Section (inside expansion) */}
                        {lesson.exams?.filter(exam => exam.exam_type !== "Mock Exams")?.length > 0 && (
                          <div>
                            {lesson.exams.filter(exam => exam.exam_type !== "Mock Exams").map((exam, idx) => (
                              <div key={idx} className={`flex justify-between items-center py-4 mt-1 mb-1 border-t ${exam.show ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed'} hover:rounded-lg`}
                                onClick={() => exam.show && handleExamClick(exam.id, exam.total_questions, exam.exam_type)}>
                                <div className="flex items-center gap-2 text-sm">
                                  {exam.attended_questions === 0 ? (
                                    <PieChart
                                      data={[
                                        {
                                          title: "No Progress",
                                          value: 1,
                                          color: "#E0E0E0"
                                        }
                                      ]}
                                      style={{
                                        height: "24px",
                                        width: "24px",
                                        backgroundColor: "transparent",
                                      }}
                                      lineWidth={35}
                                      rounded
                                      animate
                                      startAngle={270}
                                    />
                                  ) : (
                                    <PieChart
                                      data={[
                                        {
                                          title: "Remaining",
                                          value: exam.total_questions - exam.attended_questions,
                                          color: "#E0E0E0",
                                        },
                                        {
                                          title: "Completed",
                                          value: exam.attended_questions,
                                          color: "#4CAF50",
                                        }
                                      ]}
                                      style={{
                                        height: "24px",
                                        width: "24px",
                                        backgroundColor: "transparent",
                                      }}
                                      lineWidth={35}
                                      rounded
                                      animate
                                      startAngle={270}
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {exam.title}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {exam.attended_questions} / {exam.total_questions} questions completed
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  {!exam.show ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  ) : (
                                    <img
                                      src={questionicon}
                                      alt="Question Icon"
                                      className="w-5 h-5"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mock Exams Section (Outside the Lesson Card) */}
                  {lesson.exams?.filter(exam => exam.exam_type === "Mock Exams")?.length > 0 && (
                    <div>
                      {lesson.exams.filter(exam => exam.exam_type === "Mock Exams").map((exam, idx) => {
                        return (
                          <div key={idx} className="rounded-xl bg-white mb-4">
                            <div
                              onClick={() => exam.show && handleExamClick(exam.id, exam.total_questions, exam.exam_type)}
                              className={`flex items-center justify-between p-4 text-left ${exam.show ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'} hover:rounded-xl`}
                            >
                              <div className="flex items-center gap-2">
                                {exam.attended_questions === 0 ? (
                                  <PieChart
                                    data={[
                                      {
                                        title: "No Progress",
                                        value: 1,
                                        color: "#E0E0E0"
                                      }
                                    ]}
                                    style={{
                                      height: "24px",
                                      width: "24px",
                                      backgroundColor: "transparent",
                                    }}
                                    lineWidth={35}
                                    rounded
                                    animate
                                    startAngle={270}
                                  />
                                ) : (
                                  <PieChart
                                    data={[
                                      {
                                        title: "Remaining",
                                        value: exam.total_questions - exam.attended_questions,
                                        color: "#E0E0E0",
                                      },
                                      {
                                        title: "Completed",
                                        value: exam.attended_questions,
                                        color: "#4CAF50",
                                      }
                                    ]}
                                    style={{
                                      height: "24px",
                                      width: "24px",
                                      backgroundColor: "transparent",
                                    }}
                                    lineWidth={35}
                                    rounded
                                    animate
                                    startAngle={270}
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {exam.title}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {exam.attended_questions} / {exam.total_questions} questions completed
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {!exam.show ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                ) : (
                                  <img
                                    src={questionicon}
                                    alt="Question Icon"
                                    className="w-5 h-5"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              
              {/* Direct Videos and PDFs Section */}
              {(direct_content?.videos?.length > 0 || direct_content?.pdf_notes?.length > 0) && (
                <div className="mt-6">
                  <div className="rounded-xl bg-white mb-4">
                    <div className="pl-5 pr-5">
                      {(() => {
                        // Create combined array of videos and PDFs with type indicator
                        const combinedContent = [];
                        
                        // Add videos to combined array
                        if (direct_content.videos?.length > 0) {
                          direct_content.videos.forEach(video => {
                            combinedContent.push({
                              ...video,
                              type: 'video',
                              order: video.order || 999, // Default high order if not specified
                              title: video.title || "Untitled Video"
                            });
                          });
                        }
                        
                        // Add PDFs to combined array
                        if (direct_content.pdf_notes?.length > 0) {
                          direct_content.pdf_notes.forEach(pdf => {
                            combinedContent.push({
                              ...pdf,
                              type: 'pdf',
                              order: pdf.order || 999, // Default high order if not specified
                              title: pdf.title || "Untitled PDF Note"
                            });
                          });
                        }
                        
                        // Sort combined content by order field
                        combinedContent.sort((a, b) => a.order - b.order);
                        
                        // If no content, return empty div
                        if (combinedContent.length === 0) {
                          return <div className="text-sm text-gray-500"></div>;
                        }
                        
                        // Map and render content based on type
                        return combinedContent.map((item, index) => {
                          if (item.type === 'video') {
                            // Create a dummy lesson object for the video handler
                            const dummyLesson = {
                              id: `direct-${index}`,
                              lesson_name: "Additional Resources",
                              videos: [item]
                            };
                            
                            // Render video item
                            return (
                              <div
                                key={`direct-video-${item.id || index}`}
                                className={`flex justify-between items-center py-4 mt-1 mb-1 ${index > 0 ? 'border-t' : ''} cursor-pointer hover:bg-gray-50 hover:rounded-lg`}
                                onClick={() => handleVideoClick(dummyLesson, item)}
                              >
                                <div className="flex items-center gap-2 text-sm">
                                  <img
                                    src={Lessontick}
                                    className="w-5 h-5 text-green-500"
                                    alt="Video Icon"
                                  />
                                  <span>{item.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <img
                                    src={playbutton}
                                    alt="Play"
                                    className="w-5 h-5 cursor-pointer"
                                  />
                                </div>
                              </div>
                            );
                          } else if (item.type === 'pdf') {
                            // Create a dummy lesson object for the PDF handler
                            const dummyLesson = {
                              id: `direct-${index}`,
                              lesson_name: "Additional Resources"
                            };
                            
                            // Render PDF item
                            return (
                              <div
                                key={`direct-pdf-${item.id || index}`}
                                className={`flex justify-between items-center py-4 mt-1 mb-1 ${index > 0 ? 'border-t' : ''} cursor-pointer hover:bg-gray-100 hover:rounded-lg`}
                                onClick={() => handlePdfClick(dummyLesson, item)}
                              >
                                <div className="flex items-center gap-2 text-sm">
                                  <img
                                    src={Lessontick}
                                    className="w-5 h-5 text-green-500"
                                    alt="PDF Icon"
                                  />
                                  <span>{item.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <img
                                    src={pdficon}
                                    alt="PDF Icon"
                                    className="w-5 h-5"
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Direct Exams Section */}
              {direct_content?.exams?.length > 0 && (
                <div className="mt-6">
                  {/* <h3 className="text-lg font-medium text-gray-800 mb-3">Exams</h3> */}
                  <div className="space-y-4">
                    {direct_content.exams.map((exam, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-xl bg-white mb-4 shadow-sm ${!exam.show ? 'cursor-not-allowed' : ''}`}
                        onClick={() => exam.show && handleExamClick(exam.id, exam.total_questions || 0, exam.exam_type)}
                      >
                        <div className={`flex items-center justify-between p-4 text-left ${exam.show ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'} hover:rounded-xl`}>
                          <div className="flex items-center gap-2">
                            {exam.attended_questions === 0 ? (
                              <PieChart
                                data={[
                                  {
                                    title: "No Progress",
                                    value: 1,
                                    color: "#E0E0E0"
                                  }
                                ]}
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  backgroundColor: "transparent",
                                }}
                                lineWidth={35}
                                rounded
                                animate
                                startAngle={270}
                              />
                            ) : (
                              <PieChart
                                data={[
                                  {
                                    title: "Remaining",
                                    value: exam.total_questions - exam.attended_questions,
                                    color: "#E0E0E0",
                                  },
                                  {
                                    title: "Completed",
                                    value: exam.attended_questions,
                                    color: "#4CAF50",
                                  }
                                ]}
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  backgroundColor: "transparent",
                                }}
                                lineWidth={35}
                                rounded
                                animate
                                startAngle={270}
                              />
                            )}
                            <div className="flex flex-col">
                              <span className={`text-sm font-medium ${!exam.show ? '' : ''}`}>
                                {exam.title}
                              </span>
                              <div className="text-xs text-gray-500">
                                {exam.attended_questions || 0} / {exam.total_questions || 0} questions completed
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {!exam.show ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              <img
                                src={questionicon}
                                alt="Question Icon"
                                className="w-5 h-5"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>



      {/* Video Player Section */}
      {videoVisible && (
        <div className={`w-full md:w-[600px] relative h-screen md:mr-0 ${videoVisible ? 'relative left-0 top-0 z-10 bg-white md:bg-transparent' : ''}`}>
          <div className="absolute inset-0 pt-[10px] md:pt-[35px] pb-[70px] overflow-y-auto custom-scrollbar">
            {/* Back Button - Only show on mobile */}
            <div className="md:hidden px-4 mb-2">
              <button 
                onClick={closeVideo}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="ml-2 font-semibold text-[12px]">Back to Topics</span>
              </button>
            </div>

            {/* Video Player */}
            <div className="px-4 w-full bg-white">
              <span className="text-[6px] md:text-[12px] text-gray-500">
                {chapterName} / {currentLesson?.lesson_name || "Untitled Lesson"} /{" "}
                {currentLesson?.videos?.find((v) => v.url === videoUrl)?.title || 
                 currentLesson?.videos?.find((v) => v.tp_stream === videoUrl)?.title || 
                 "Untitled Video"}
              </span>
             <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-black">
               {/* Black background overlay while video is loading */}
               {(isVideoProcessing || !videoUrl) && (
                 <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                   <div className="flex flex-col items-center">
                     <div className="loading-spinner"></div>
                     <p className="text-white text-sm mt-2">Loading video...</p>
                   </div>
                 </div>
               )}
               
               {/* Video Element */}
               {videoUrl && (
                 <div className={`transition-opacity duration-300 ${isVideoProcessing ? 'opacity-0' : 'opacity-100'}`}>
                   {showTPPlayer ? (
                     <div className="w-full aspect-video max-h-[300px]">
                       <TP 
                         data={tpVideoData} 
                         className="w-full h-full min-h-[200px] max-h-[300px]"
                         videoId={currentLesson?.videos?.find(v => v.tp_stream === videoUrl)?.id}
                       />
                       {videoDuration > 0 && (
                         <div className="text-xs text-gray-500 mt-1 text-right pr-2">
                           Duration: {formatDuration(videoDuration)}
                         </div>
                       )}
                     </div>
                   ) : videoUrl.endsWith(".m3u8") ? (
                     <div>
                       <video 
                         ref={videoRef} 
                         controls 
                         className="w-full aspect-video min-h-[200px] max-h-[300px] bg-black"
                         onLoadedData={() => setIsVideoProcessing(false)}
                         onError={(e) => {
                           console.error("Video error:", e);
                           setIsVideoProcessing(false);
                         }}
                         playsInline
                         webkit-playsinline="true"
                         x-webkit-airplay="allow"
                         crossOrigin="anonymous"
                         preload="auto"
                       />
                       {videoDuration > 0 && (
                         <div className="text-xs text-gray-500 mt-1 text-right pr-2">
                           Duration: {formatDuration(videoDuration)}
                         </div>
                       )}
                     </div>
                   ) : (
                     <div>
                       <YouTube
                         videoId={videoUrl}
                         opts={{
                           width: "100%",
                           height: "300",
                           playerVars: {
                             autoplay: 1,
                             origin: window.location.origin,
                             controls: 1,
                             playsinline: 1,
                           },
                         }}
                         className="w-full aspect-video min-h-[200px] max-h-[300px]"
                         onReady={(event) => {
                           // Store reference to the player
                           youtubePlayerRef.current = event.target;
                           
                           // Get video duration
                           const duration = event.target.getDuration();
                          //  console.log("=== YouTube Video Information ===");
                          //  console.log(`Video ID: ${videoUrl}`);
                          //  console.log(`Total Duration: ${duration} seconds (${formatTimeHHMMSS(duration)})`);
                          //  console.log("===============================");
                           
                           // Set video duration
                           if (duration && !isNaN(duration) && duration > 0) {
                             setVideoDuration(duration);
                             videoDurationRef.current = duration;
                            //  console.log("Set YouTube video duration:", duration);
                           }
                           
                           // Mark video as ready
                           setIsVideoProcessing(false);
                           
                           // Set watch start time
                           youtubeWatchStartTime.current = new Date();
                          //  console.log(`YouTube video playback started at: ${youtubeWatchStartTime.current.toLocaleTimeString()}`);
                           
                           // Set up interval to track current time
                           const timeTracker = setInterval(() => {
                             if (youtubePlayerRef.current) {
                               const currentTime = youtubePlayerRef.current.getCurrentTime();
                               if (!isNaN(currentTime)) {
                                 setCurrentPlaybackTime(currentTime);
                                 currentTimeRef.current = currentTime;
                               }
                             }
                           }, 1000);
                           
                           // Store interval ID in ref for cleanup
                           event.target.timeTrackerId = timeTracker;
                         }}
                         onStateChange={(event) => {
                           // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                          //  console.log("YouTube player state changed:", event.data);
                           
                           // When video ends, send watch data
                           if (event.data === 0) { // 0 = ended
                            //  console.log("YouTube video ended, sending watch data");
                             
                             // Find the current video
                             const video = currentLesson?.videos?.find(v => v.url === videoUrl);
                             if (video?.id) {
                               // Get the full duration
                               const duration = youtubePlayerRef.current.getDuration();
                               
                               // Send watch data with full duration
                               sendWatchDataToAPI(video.id, duration, duration);
                              //  console.log(`YouTube video ended - Sent full watch data to API for video ID: ${video.id}`);
                             }
                           }
                           
                           // When video is paused, send current watch data
                           if (event.data === 2) { // 2 = paused
                            //  console.log("YouTube video paused, sending current watch data");
                             
                             // Find the current video
                             const video = currentLesson?.videos?.find(v => v.url === videoUrl);
                             if (video?.id && currentTimeRef.current > 0) {
                               // Send current watch data
                               sendWatchDataToAPI(video.id, currentTimeRef.current, youtubePlayerRef.current.getDuration());
                              //  console.log(`YouTube video paused at ${currentTimeRef.current}s - Sent watch data to API for video ID: ${video.id}`);
                             }
                           }
                         }}
                         onEnd={() => {
                           // Additional handler for video end event
                          //  console.log("YouTube video playback ended");
                           
                           // Find the current video
                           const video = currentLesson?.videos?.find(v => v.url === videoUrl);
                           if (video?.id && youtubePlayerRef.current) {
                             // Get the full duration
                             const duration = youtubePlayerRef.current.getDuration();
                             
                             // Send watch data with full duration
                             sendWatchDataToAPI(video.id, duration, duration);
                            //  console.log(`YouTube video ended - Sent full watch data to API for video ID: ${video.id}`);
                           }
                         }}
                         onError={(error) => {
                           console.error("YouTube player error:", error);
                           setIsVideoProcessing(false);
                         }}
                       />
                       {videoDuration > 0 && (
                         <div className="text-xs text-gray-500 mt-1 text-right pr-2">
                           Duration: {formatDuration(videoDuration)}
                         </div>
                       )}
                     </div>
                   )}
                 </div>
               )}
             </div>
              <span className="text-md text-black block font-semibold">
                {currentLesson?.videos?.find((v) => v.url === videoUrl)?.title || 
                 currentLesson?.videos?.find((v) => v.tp_stream === videoUrl)?.title || 
                 "Untitled Video"}
              </span>
              <span className="text-md text-black block font-semibold">Discussions</span>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl mx-2 flex flex-col mt-4">
              <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar" style={{ height: 'calc(100vh - 500px)' }}>
                {isFetchingComments ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-500">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.filter(comment => !comment.parent_comment_id).map((parentComment, index) => {
                    const userImageUrl = parentComment.user_image
                      ? `https://admin.ledgergate.com/${parentComment.user_image}`
                      : null;

                    return (
                      <div key={index} className="flex flex-col gap-2 py-3 border-b last:border-b-0">
                        <div className="flex gap-4">
                          {userImageUrl ? (
                            <img
                              src={userImageUrl}
                              alt="User"
                              className="md:w-8 md:h-8 h-6 w-6 rounded-full"
                            />
                          ) : (
                            <User
                              className="md:w-8 md:h-8 h-6 w-6 p-1 rounded-full bg-gray-200 text-gray-600"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="md:font-medium md:text-sm text-xs">
                                {parentComment.firstname}
                              </span>
                              <span className="md:text-xs text-gray-500 text-[8px]">
                                {parentComment.created}
                              </span>
                            </div>
                            <p className="md:text-sm text-xs text-gray-600 mb-2">
                              {parentComment.content}
                            </p>

                            {/* Replies Section */}
                            {expandedReplies[parentComment.comment_id] && (
                              <div className="ml-2 mt-2 space-y-2">
                                {expandedReplies[parentComment.comment_id].map((reply, replyIndex) => (
                                  <div key={`reply-${replyIndex}`} className="flex gap-2">
                                    {reply.user_image ? (
                                      <img
                                        src={`https://admin.ledgergate.com/${reply.user_image}`}
                                        alt="User"
                                        className="md:w-6 md:h-6 h-5 w-5 rounded-full"
                                      />
                                    ) : (
                                      <User
                                        className="md:w-6 md:h-6 h-5 w-5 p-1 rounded-full bg-gray-200 text-gray-600"
                                      />
                                    )}
                                    <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                      <div className="flex items-center justify-between">
                                        <span className="md:font-medium md:text-sm text-xs">
                                          {reply.firstname}
                                        </span>
                                        <span className="md:text-xs text-gray-500 text-[8px]">
                                          {reply.created}
                                        </span>
                                      </div>
                                      <p className="md:text-sm text-xs text-gray-600">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                              <button
                                className="flex items-center gap-1 text-[19px] text-gray-500 hover:text-gray-700 rounded-full border border-gray-300 px-2 py-1"
                                onClick={() => toggleReplyInput(parentComment.comment_id)}
                              >
                                <img src={Reply} alt="Reply Icon" className="w-2 h-3 object-contain" />
                                <span className="text-[9px]">Reply</span>
                              </button>

                              {parentComment.reply_count > 0 && (
                                <button
                                  className="text-xs text-orange-500 flex items-center"
                                  onClick={async () => {
                                    if (expandedReplies[parentComment.comment_id]) {
                                      setExpandedReplies((prev) => {
                                        const newState = { ...prev };
                                        delete newState[parentComment.comment_id];
                                        return newState;
                                      });
                                    } else {
                                      try {
                                        const response = await axiosInstance.get('/v1/comment-replies/', {
                                          params: { comment_id: parentComment.comment_id },
                                        });
                                        setExpandedReplies((prev) => ({
                                          ...prev,
                                          [parentComment.comment_id]: response.data.data.replies,
                                        }));
                                      } catch (error) {
                                        console.error('Error fetching replies:', error);
                                      }
                                    }
                                  }}
                                >
                                  {parentComment.reply_count} replies
                                  {expandedReplies[parentComment.comment_id] ? (
                                    <ChevronUp className="w-4 h-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Reply input field */}
                            {replyCommentId === parentComment.comment_id && (
                              <div className="flex gap-2 mt-2">
                                <input
                                  type="text"
                                  value={replyComment}
                                  onChange={(e) => setReplyComment(e.target.value)}
                                  placeholder="Add a reply..."
                                  className="flex-1 px-2 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs h-7 w-[85%]"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddReply(parentComment.comment_id)}
                                  className="bg-black text-white px-2 rounded-lg text-xs whitespace-nowrap min-h-0 h-7"
                                >
                                  Reply
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-screen">
                    {/* <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p> */}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Input Section */}
            <div className="sticky bottom-0 w-[calc(100%-2px)] md:w-[calc(100%-8px)] mx-1 mt-2 mb-4 border-t bg-white p-3 rounded-xl shadow-lg z-20">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Ask a question"
                  className="flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-9"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddComment()}
                  className="bg-black text-white px-4 rounded-lg text-sm whitespace-nowrap min-h-0 h-9"
                >
                  {isAddingComment ? "Ask" : "Ask"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PDF Viewer Section */}
      {pdfVisible && (
        <div className={`w-full md:w-[700px] relative h-screen md:mr-0 ${pdfVisible ? 'fixed md:relative left-0 top-0 z-10 bg-white' : ''}`}>
          <div className="absolute inset-0 pt-[10px] md:pt-[40px] pb-[20px] bg-white">
            {/* Back Button - Only show on mobile */}
            <div className="md:hidden px-4 mb-2">
              <button 
                onClick={closePdf}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="ml-2 font-semibold text-[12px]">Back to Topics</span>
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="px-4">
              <span className="text-[6px] md:text-[12px] text-gray-500">
                {chapterName} / {currentLesson?.lesson_name || "Untitled Lesson"} / {currentPdf?.title || "Untitled PDF"}
              </span>
              <div className="relative w-full h-auto min-h-[500px] rounded-xl overflow-hidden border border-gray-200">
                {currentPdf?.file ? (
                  <>
                    <div className="pdf-container relative">
                      {pdfLoading && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                            <p className="text-gray-600 mt-2">Loading PDF...</p>
                          </div>
                        </div>
                      )}
                      <div className="relative w-full h-[600px] md:h-[700px]">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(getPdfUrl(currentPdf))}&embedded=true&chrome=false&toolbar=0&navpanes=0`}
                          className="w-full h-full bg-white"
                          onLoad={() => {
                            console.log('PDF iframe loaded');
                            setPdfLoading(false);
                            dispatch(hideSpinner());
                          }}
                          frameBorder="0"
                          scrolling="auto"
                        />
                      </div>
                    </div>
                    
                    {/* PDF Navigation Controls */}
                    <div className="flex items-center justify-between mt-4 px-4">
                      <button 
                        onClick={() => {
                          if (pageNumber > 1) {
                            setPageNumber(pageNumber - 1);
                            setPdfLoading(true);
                            dispatch(showSpinner());
                          }
                        }}
                        className={`px-4 py-2 rounded-md ${pageNumber <= 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                        disabled={pageNumber <= 1}
                      >
                        Previous
                      </button>
                      
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700">Page {pageNumber}</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setPageNumber(pageNumber + 1);
                          setPdfLoading(true);
                          dispatch(showSpinner());
                        }}
                        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[400px] bg-white"> 
                    <p className="text-gray-500">No PDF file available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}                                 
