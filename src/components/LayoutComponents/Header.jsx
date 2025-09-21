import {
  User,
  ChevronDown,
  Info,
  Shield,
  FileText,
  Star,
  Search,
  Bell,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt2 } from "react-icons/hi";
import { Sidebar } from "./Sidebar";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";
import { useEffect, useState } from "react";
import { Popover } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Link } from "react-router-dom";
import BookMentorModal from "./BookMentorModal";
import { useSelector } from "react-redux";
import { commenApi } from "../../lib/api/commen";
import { backendUrl } from "../../constant/BaseUrl";

function Header({ subjects }) {
  const { user } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [Menteropen, setMenterOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const response = await commenApi.getNotification();
        if (response?.status === "success") {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];

          setNotifications(data);
        } else {
          setNotifications([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <header className="bg-[#F4F4F4] border-b border-gray-200 px-2 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-2 md:mx-9">
        <div>
          <HiMenuAlt2
            onClick={toggleSidebar}
            className="text-black text-2xl cursor-pointer"
          />

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 shadow-md rounded-full">
            <Search
              className="text-black text-xl w-5 h-5 cursor-pointer"
              onClick={(e) => {
                setOpen(true);
              }}
            />
            <SearchModal isOpen={open} setIsOpen={setOpen} />
          </div>
          <div className="bg-white p-2 shadow-md rounded-full">
            <Popover>
              <PopoverTrigger asChild>
                <Bell className="text-black text-xl w-5 h-5 cursor-pointer" />
              </PopoverTrigger>
              <NotificationModal
                notifications={notifications}
                loading={loading}
                error={error}
              />
            </Popover>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white shadow-md rounded-full flex items-center gap-2 md:gap-3 cursor-pointer hover:shadow-lg transition-shadow md:px-0">
                <div className="bg-white shadow-md rounded-full border border-gray-100">
                  {user?.image ? (
                    <img
                      src={user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_API_BASE_URL || backendUrl}${user.image}`}
                      alt="Profile"
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-black w-4 h-4 md:w-5 md:h-5" />
                  )}{" "}
                </div>
                <div className="hidden sm:flex flex-col items-start text-xs">
                  <h1 className="font-semibold text-black">
                    {user?.name || "Guest"}
                  </h1>
                  <span className="text-gray-500">
                    {user?.email || "No email"}
                  </span>
                </div>
                <ChevronDown className="text-black hidden sm:block mr-2 w-3 h-3" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2">
              <Link to="/profile">
                <DropdownMenuItem className="flex items-center justify-between py-3 px-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CgProfile className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="flex items-center justify-between py-3 px-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">About us</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center justify-between py-3 px-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Privacy policy</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center justify-between py-3 px-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Terms & Conditions</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center justify-between py-3 px-4 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setMenterOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Book a Mentor</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
              </DropdownMenuItem>

              <BookMentorModal
                isOpen={Menteropen}
                setIsOpen={setMenterOpen}
                subjects={subjects}
              />
              <DropdownMenuItem className="flex items-center justify-between py-3 px-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Rate this app</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
