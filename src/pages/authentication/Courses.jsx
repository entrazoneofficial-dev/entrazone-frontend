import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import { setHasSelectedCourse } from "../../Redux/slices/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { authApi } from "../../lib/api/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isProfileComplete, hasSelectedCourse } = useSelector(
    (state) => state.auth
  );

  const colorClasses = [
    "bg-gray-900 hover:bg-gray-800 border border-gray-800",
    "bg-violet-900 hover:bg-violet-800 border border-violet-800",
    "bg-blue-900 hover:bg-blue-800 border border-blue-800",
    "bg-purple-900 hover:bg-purple-800 border border-purple-800",
    "bg-indigo-900 hover:bg-indigo-800 border border-indigo-800",
    "bg-gray-800 hover:bg-gray-700 border border-gray-700",
  ];

  const getRandomColorClass = (index) => {
    return colorClasses[index % colorClasses.length];
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isProfileComplete) {
      navigate("/register");
      return;
    }

    if (hasSelectedCourse) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, isProfileComplete, hasSelectedCourse, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !isProfileComplete || hasSelectedCourse) {
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await authApi.getCourses();
        const courseList = Array.isArray(response.courses)
          ? response.courses
          : [];

        setCourses(courseList);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, isProfileComplete, hasSelectedCourse]);

  const handleCourseSelect = async (courseId) => {
    try {
      const response = await authApi.selectedCourse({ course_id: courseId });
      dispatch(setHasSelectedCourse(true));
      navigate("/");
    } catch (err) {
      console.error("Course selection failed:", err);
      setError("Failed to select course. Please try again.");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="w-full lg:w-1/2 max-w-md flex justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9D5FF] via-[#FCE7F3] to-[#E9D5FF]">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 lg:gap-56">
        <AuthLayout />
        <div className="w-full lg:w-1/2 max-w-md flex justify-center">
          <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Select your Course to Continue
                </h2>
                <div className="w-12 h-1 bg-purple-600 mx-auto"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {courses.map((course, index) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    className={`w-full cursor-pointer p-3 sm:p-4 text-white rounded-xl transition-colors text-left ${getRandomColorClass(index)}`}
                  >
                    <div className="text-lg sm:text-xl font-bold">
                      {course.course_name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-200">
                      {course.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;