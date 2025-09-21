import React, { useEffect, useState } from "react";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { authApi } from "../../lib/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../Redux/slices/authSlice";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import LoginForm from "../../components/Authentication-ui/AuthenticationForms/LoginForm";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, isProfileComplete } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (isProfileComplete) {
          navigate("/");
        } else {
          navigate("/register");
        }
      }
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isProfileComplete, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError("");

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      setFormSubmitting(false);
      return;
    }

    try {
      const request_id = Math.floor(100000 + Math.random() * 900000).toString();

      const payload = {
        phone: phoneNumber,
        request_id: request_id,
      };

      const response = await authApi.login(payload);

      dispatch(
        loginSuccess({
          phone: phoneNumber,
          request_id: request_id,
          route: response.route,
        })
      );
      navigate("/otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (pageLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9D5FF] via-[#FCE7F3] to-[#E9D5FF]">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-2 lg:gap-56">
        <AuthLayout />
        <div className="w-full lg:w-1/2 max-w-sm flex justify-center">
          <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Enter Your mobile Number
                </h2>
                <HiOutlineDevicePhoneMobile className="text-6xl mx-auto mb-9 " />
              </div>

              <LoginForm
                setPhoneNumber={setPhoneNumber}
                phoneNumber={phoneNumber}
                formSubmitting={formSubmitting}
                error={error}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
