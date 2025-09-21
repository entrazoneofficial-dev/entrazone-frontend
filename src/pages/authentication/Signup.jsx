import React, { useEffect, useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  register,
  setIsRegisterPageVisible,
} from "../../Redux/slices/authSlice";
import { authApi } from "../../lib/api/auth";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import SignupForm from "../../components/Authentication-ui/AuthenticationForms/SignupForm";

const DISTRICT = [
  { id: "0", label: "Andhra Pradesh" },
  { id: "1", label: "Arunachal Pradesh" },
  { id: "2", label: "Assam" },
  { id: "3", label: "Bihar" },
  { id: "4", label: "Chhattisgarh" },
  { id: "5", label: "Goa" },
  { id: "6", label: "Gujarat" },
  { id: "7", label: "Haryana" },
  { id: "8", label: "Himachal Pradesh" },
  { id: "9", label: "Jharkhand" },
  { id: "10", label: "Karnataka" },
  { id: "11", label: "Kerala" },
  { id: "12", label: "Madhya Pradesh" },
  { id: "13", label: "Maharashtra" },
  { id: "14", label: "Manipur" },
  { id: "15", label: "Meghalaya" },
  { id: "16", label: "Mizoram" },
  { id: "17", label: "Nagaland" },
  { id: "18", label: "Odisha" },
  { id: "19", label: "Punjab" },
  { id: "20", label: "Rajasthan" },
  { id: "21", label: "Sikkim" },
  { id: "22", label: "Tamil Nadu" },
  { id: "23", label: "Telangana" },
];

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    district: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    isAuthenticated,
    isProfileComplete,
    isRegisterPageVisible,
    phone,
    requestId,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      if (isProfileComplete) {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
    setPageLoading(false);
  }, [isAuthenticated, isProfileComplete, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setIsRegisterPageVisible(true));
    }
  }, [isRegisterPageVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        phone: phone || "",
        request_id: requestId || "",
      };

      const response = await authApi.register(payload);

      dispatch(
        register({
          user: response.user,
        })
      );
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistrictChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      district: value,
    }));
  };

  if (pageLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9D5FF] via-[#FCE7F3] to-[#E9D5FF]">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-2 lg:gap-56">
        <AuthLayout />
        <div className="w-full lg:w-1/2 max-w-md flex justify-center">
          <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <SignupForm
              handleSubmit={handleSubmit}
              error={error}
              formData={formData}
              handleChange={handleChange}
              phone={phone}
              handleDistrictChange={handleDistrictChange}
              isSubmitting={isSubmitting}
              DISTRICT={DISTRICT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
