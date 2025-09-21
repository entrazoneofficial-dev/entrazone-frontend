import { useEffect, useState } from 'react';
import { GoClockFill } from "react-icons/go";

function Timer({ duration, showResults, onTimeout, onUpdate }) {
  const parseDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const [timeLeft, setTimeLeft] = useState(parseDuration(duration));
  const [timeElapsed, setTimeElapsed] = useState("00:00");

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onTimeout) onTimeout();
            return 0;
          }
          return prev - 1;
        });

        // Update elapsed time
        const elapsedSeconds = parseDuration(duration) - timeLeft + 1;
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const elapsedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setTimeElapsed(elapsedTime);
        if (onUpdate) onUpdate(elapsedTime);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showResults, timeLeft, duration, onTimeout, onUpdate]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isTimeLow = timeLeft < 300; // 5 minutes = 300 seconds

  return (
    <div className={`flex items-center gap-2 p-2 rounded-full text-sm sm:text-base ${
      isTimeLow && !showResults 
        ? 'bg-red-100 text-red-700' 
        : 'bg-white text-gray-700'
    }`}>
      <GoClockFill className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="font-medium">
        {timeLeft <= 0 ? "00:00" : formatTime(timeLeft)}
      </span>
    </div>  
  );
}

export default Timer;