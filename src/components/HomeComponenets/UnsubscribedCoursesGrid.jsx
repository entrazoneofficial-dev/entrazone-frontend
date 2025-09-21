import { FiBookOpen } from "react-icons/fi";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { authApi } from "../../lib/api/auth";
import Swal from 'sweetalert2'; // Import SweetAlert

export function UnsubscribedCoursesGrid({ courses }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!courses || courses.length === 0) return null;

  const handleExploreClick = async (course, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await authApi.selectedCourse({ course_id: course.course_id });
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Success!',
        text: `You've successfully selected ${course.course_name}`,
        icon: 'success',
        confirmButtonText: 'Continue'
      }).then(() => {
        // Refresh the page after user clicks the button
        window.location.reload();
      });
      
    } catch (err) {
      console.error("Course selection failed:", err);
      
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to select course. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Array of light background colors
  const bgColors = [
    'bg-blue-100', 'bg-purple-100', 'bg-indigo-100',
    'bg-teal-100', 'bg-emerald-100', 'bg-rose-100',
    'bg-amber-100', 'bg-pink-100', 'bg-fuchsia-100',
    'bg-sky-100', 'bg-cyan-100', 'bg-lime-100'
  ];

  // Array of slightly darker hover colors
  const hoverColors = [
    'hover:bg-blue-100', 'hover:bg-purple-100', 'hover:bg-indigo-100',
    'hover:bg-teal-100', 'hover:bg-emerald-100', 'hover:bg-rose-100',
    'hover:bg-amber-100', 'hover:bg-pink-100', 'hover:bg-fuchsia-100',
    'hover:bg-sky-100', 'hover:bg-cyan-100', 'hover:bg-lime-100'
  ];

  // Assign random colors to each course
  const coursesWithColors = useMemo(() => {
    return courses.map(course => {
      const randomIndex = Math.floor(Math.random() * bgColors.length);
      return {
        ...course,
        bgColor: bgColors[randomIndex],
        hoverColor: hoverColors[randomIndex]
      };
    });
  }, [courses]);

  return (
    <div className="space-y-8">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {coursesWithColors.map((course) => (
          <motion.div
            key={course.course_id}
            variants={item}
            className={`group relative overflow-hidden border border-gray-200 rounded-xl ${course.bgColor} ${course.hoverColor} text-gray-800 shadow-sm hover:shadow-md transition-all duration-300`}
            whileHover={{ y: -5 }}
          >
            <div className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg transition-colors shadow-sm">
                    <FiBookOpen className="text-primary text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {course.course_name}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
                
                <div className="w-full mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-1/2 cursor-pointer text-primary flex justify-between bg-white hover:bg-primary/10 transition-colors"
                    onClick={(e) => handleExploreClick(course, e)}
                  >
                    Explore
                    <HiArrowTopRightOnSquare className="text-xl font-medium"/>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}