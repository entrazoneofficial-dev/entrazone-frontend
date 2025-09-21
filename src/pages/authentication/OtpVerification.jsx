import React, { useState, useRef, useEffect } from "react";
import { BiCreditCard } from "react-icons/bi";
import AuthLayout from "../../layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../lib/api/auth";
import { verifyOtpSuccess } from "../../Redux/slices/authSlice";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";
import OtpForm from "../../components/Authentication-ui/AuthenticationForms/OtpForm";

function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    isAuthenticated,
    isProfileComplete,
    isRegisterPageVisible,
    phone,
    requestId,
    route,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      if (isProfileComplete) {
        navigate("/");
      } else if (!isRegisterPageVisible && route == "signup") {
        navigate("/register");
      } else if (isRegisterPageVisible || route == "login") {
        console.log("this is login page");
        navigate("/profile");
      }
    } else if (!phone && !requestId) {
      navigate("/login");
    }
    setPageLoading(false);
  }, [isAuthenticated, isProfileComplete, navigate, isRegisterPageVisible]);

  useEffect(() => {
    if (!pageLoading && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [pageLoading]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const setInputRef = (index) => (el) => {
    inputRefs.current[index] = el;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      setLocalError("Please enter the complete OTP");
      return;
    }

    const code = otp.join("");

    if (!phone || !requestId) {
      setError("Missing phone number or request ID");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setLocalError("");

    const payload = {
      phone: phone,
      code: code,
      request_id: requestId,
    };

    try {
      let response;
      if (route == "signup") {
        response = await authApi.verifyOtp(payload);
      } else {
        response = await authApi.LoginverifyOtp(payload);
      }

      setError("");

      dispatch(
        verifyOtpSuccess({
          user: response.user,
          access: response.access,
          refresh: response.refresh,
        })
      );

      if (route == "signup") {
        navigate("/register");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid OTP. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading || !phone || !requestId) {
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
                  Enter OTP Verification Code
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a 4-digit code to +91 {phone}
                </p>
                <BiCreditCard className="text-6xl mx-auto mb-9" />
              </div>

              <div className="space-y-12">
                <OtpForm
                  handleSubmit={handleSubmit}
                  setInputRef={setInputRef}
                  otp={otp}
                  handleChange={handleChange}
                  handleKeyDown={handleKeyDown}
                  isSubmitting={isSubmitting}
                  error={error}
                  localError={localError}
                />

                <p className="text-xs text-gray-500 leading-relaxed">
                  By creating or logging into an account you're agreeing with
                  our{" "}
                  <span className="text-purple-600 underline">
                    Terms and conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-600 underline">
                    Privacy policy
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
