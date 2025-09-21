import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import { Toaster } from "react-hot-toast";
import OtpVerification from "./pages/authentication/OtpVerification";
import Signup from "./pages/authentication/Signup";
import PrivateLayout from "./layouts/PrivateLayout";
import Home from "./pages/PrivatePages/Home";
import Profile from "./pages/PrivatePages/Profile";
import PrivateRoute from "./lib/PrivateRoute";
import { useEffect, useState } from "react";
import { homeApi } from "./lib/api/home";
import Courses from "./pages/authentication/Courses";
import Chapters from "./pages/PrivatePages/Chapters";
import LessonPage from "./pages/PrivatePages/Lesson";
import ExamQuestion from "./pages/PrivatePages/ExamQuestion";
import LiveClassesDashboard from "./pages/PrivatePages/LiveClasses";
import DailyTasksPage from "./pages/PrivatePages/DailyTasksPage";
import ExamResultsPage from "./pages/PrivatePages/ExamReport";
import AssessmentReviewPage from "./pages/PrivatePages/ViewDetails";
import LoadingPage from "./components/LoaderComponent/LoadingPage";
import { useSelector } from "react-redux";

function App() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const data = await homeApi.fetchHomeData();                
      setHomeData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHomeData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingPage/> 
      </div>
    );
  }



  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />                  
      <Router>
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/courses" element={<Courses />} />
              <Route 
                path="/" 
                element={
                  <PrivateLayout 
                    subjects={homeData?.subscribed_courses?.[0]?.subjects || []} 
                  />
                }
              >            
            <Route
              path="/"
              element={
                <PrivateRoute subscribedCourses={homeData?.subscribed_courses} loading={loading}>
                  <Home homeData={homeData} />
                </PrivateRoute>
              }
            />
            <Route
              path="/live-class"
              element={
                <PrivateRoute>
                  <LiveClassesDashboard/>
                </PrivateRoute>
              }
            />
            <Route
            path="/chapters/:id"
            element={
              <PrivateRoute>
                <Chapters />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <PrivateRoute>
                <LessonPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exam/:id"
            element={
              <PrivateRoute>
                <ExamQuestion />
              </PrivateRoute>
            }
          />
            <Route
              path="/profile"
              element={
                <PrivateRoute subscribedCourses={homeData?.subscribed_courses}>
                  <Profile courses={homeData?.subscribed_courses || []} />
                </PrivateRoute>
              }
            />
            <Route
              path="/daily-task"
              element={
                <PrivateRoute >
                  <DailyTasksPage/>
                </PrivateRoute>
              }
            />
            <Route
              path="/exam-report"
              element={
                <PrivateRoute >
                  <ExamResultsPage/>
                </PrivateRoute>
              }
            />
            <Route
              path="/view-details/:id"
              element={
                <PrivateRoute >
                  <AssessmentReviewPage/>
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;