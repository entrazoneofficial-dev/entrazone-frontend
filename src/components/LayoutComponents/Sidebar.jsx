import { X, Home, Video, FileText, CreditCard, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { backendUrl } from "../../constant/BaseUrl";

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const courses = [
    {
      id: "1",
      name: "SSLC Mathematics",
      progress: 75,
      color: "cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777]",
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      progress: 45,
      color: "cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777]",
    },
    {
      id: "3",
      name: "Chemistry Basics",
      progress: 90,
      color: "cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777]",
    },
  ];

  const menuItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Video, label: "Live Class", to: "/live-class" },
    { icon: FileText, label: "Reports", to: "/exam-report" },
    { icon: CreditCard, label: "Payment Details", to: "/payment" },
    { icon: User, label: "My Profile", to: "/profile" },
  ];

  const getInitials = (name) => {
    if (!name) return "U"
    const names = name.split(' ')
    return names.map(n => n[0]).join('').toUpperCase()
  }
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
            <Link 
              to="/profile" 
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                navigate('/profile');
              }}
            >
              <div className="w-12 h-12 cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-full flex items-center justify-center text-white font-bold text-lg">
                 {user?.image ? (
                    <img
                      src={user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_API_BASE_URL || backendUrl}${user.image}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                      <h1>{getInitials(user?.name || user?.email)}</h1>
                  )}{" "}
              </div>
            </Link>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name || "Guest"}</h3>
                <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index} className="space-x-3">
                  <Link to={item.to} onClick={onClose}>
                    <button
                      className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive(item.to)
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              MY COURSES
            </h4>
            <div className="space-y-4 pb-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-purple-100 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    {course.name}
                  </h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {course.progress}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${course.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};