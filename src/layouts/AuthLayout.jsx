import { BookOpen, Video, BarChart3 } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="w-full lg:w-1/2 max-w-2xl flex flex-col justify-center">
      <h1 className="text-4xl sm:text-4xl lg:text-7xl font-extrabold text-gray-900 mb-4 lg:mb-6">
        Greatness Awaits!
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 lg:mb-12">
        The drive to excel never stops. Unlock your potential with our
        comprehensive learning platform.
      </p>

      <div className="space-y-6 lg:space-y-8 md:block hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
              Expert-Led Courses
            </h3>
            <p className="text-sm sm:text-base lg:text-base text-gray-700">
              Learn from industry professionals and academic experts
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
              Live Interactive Classes
            </h3>
            <p className="text-sm sm:text-base lg:text-base text-gray-700">
              Join live sessions and interact with instructors in real-time
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
              Progress Tracking
            </h3>
            <p className="text-sm sm:text-base lg:text-base text-gray-700">
              Monitor your learning progress with detailed analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
