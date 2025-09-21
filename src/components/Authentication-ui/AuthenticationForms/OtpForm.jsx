import { Button } from "../../../components/ui/button";
import React from "react";
import { FaSpinner } from "react-icons/fa";

function OtpForm({
  handleSubmit,
  setInputRef,
  otp,
  handleChange,
  handleKeyDown,
  isSubmitting,
  error,
  localError,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      <div className="flex justify-center gap-2 sm:gap-3">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={setInputRef(index)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-1 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            disabled={isSubmitting}
          />
        ))}
      </div>

      {(error || localError) && (
        <p className="text-red-500 text-sm text-center">
          {error || localError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white py-6 rounded-lg font-semibold text-sm sm:text-base flex justify-center items-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </form>
  );
}

export default OtpForm;
