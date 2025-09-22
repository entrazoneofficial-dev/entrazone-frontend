import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { setHasSelectedCourse } from "../Redux/slices/authSlice";
import LoadingPage from "../components/LoaderComponent/LoadingPage";

const PrivateRoute = ({ children, subscribedCourses = [] }) => {
  const dispatch = useDispatch();
  const {
    accessToken,
    isAuthenticated,
    isProfileComplete,
    isRegisterPageVisible,
    hasSelectedCourse,
    startLoading,
  } = useSelector((state) => state.auth);

  if (startLoading) {
    return <LoadingPage />;
  }

  

  useEffect(() => {
    if (
      subscribedCourses &&
      subscribedCourses.length > 0 &&
      !hasSelectedCourse
    ) {
      dispatch(setHasSelectedCourse(true));
    }
  }, [subscribedCourses, hasSelectedCourse, dispatch]);

  const isLoggedIn = accessToken && isAuthenticated;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfileComplete) {
    if (!isRegisterPageVisible) {
      return <Navigate to="/register" replace />;
    }    
    
    return <Navigate to="/register" replace />;
  }

  if (
    (!subscribedCourses || subscribedCourses.length === 0) &&
    !hasSelectedCourse
  ) {
    return <Navigate to="/courses" replace />;
  }

  return children;
};

export default PrivateRoute;
