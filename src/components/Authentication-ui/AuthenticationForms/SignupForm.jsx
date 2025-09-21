import React from "react";
import { TbListDetails } from "react-icons/tb";
import { SearchableSelect } from "../Searchable-select";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../../ui/button";

function SignupForm({
  handleSubmit,
  error,
  formData,
  handleChange,
  phone,
  handleDistrictChange,
  isSubmitting,
  DISTRICT,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Enter Your Details
          </h2>
          <TbListDetails className="text-5xl border border-gray-400 rounded-xl p-2 mx-auto mb-9" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 py-3 border rounded-lg">
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  +91
                </span>
              </div>
              <input
                type="tel"
                name="phone"
                value={phone || ""}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="flex-1 rounded-lg border text-sm sm:text-base px-4 py-3"
                required
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <SearchableSelect
              label="State"
              options={DISTRICT}
              value={formData.district}
              onChange={handleDistrictChange}
              placeholder="Select Your State"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none outline-none text-sm sm:text-base"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white py-6 rounded-lg font-semibold text-sm sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Registering...
              </>
            ) : (
              "Register Now"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
