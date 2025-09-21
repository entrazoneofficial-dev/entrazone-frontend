import { Button } from "../../ui/button";
import React from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

function LoginForm({
  setPhoneNumber,
  phoneNumber,
  formSubmitting,
  error,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex items-center px-3 py-3 border rounded-lg">
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            +91
          </span>
        </div>
        <input
          type="tel"
          placeholder="Enter Mobile Number"
          className="flex-1 rounded-lg border focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base px-4 py-3"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-xs sm:text-sm text-gray-500 ">
        <Link href="/register">Don't have an account?</Link>
      </p>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white py-6 rounded-lg font-semibold text-sm sm:text-base flex justify-center items-center gap-2"
        disabled={formSubmitting}
      >
        {formSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing...
          </>
        ) : (
          "Get OTP"
        )}
      </Button>
      <p className="text-xs text-gray-500 leading-relaxed mt-6">
        By creating or logging into an account you're agreeing with our{" "}
        <span className="text-purple-600 underline">Terms and conditions</span>{" "}
        and <span className="text-purple-600 underline">Privacy policy</span>
      </p>
    </form>
  );
}

export default LoginForm;
