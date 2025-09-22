import { useEffect, useState } from "react"
import { LogOut, User, Award, BookOpen, Bell, Shield, HelpCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import UserProfileHeader from "../../components/ProfileComponent/UserProfileHeader"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../Redux/slices/authSlice"
import { commenApi } from "../../lib/api/commen"
import NavItem from "../../components/ProfileComponent/NavItem"
import SectionContent from "../../components/ProfileComponent/SectionContent"



export default function ProfileDashboard({courses}) {
  console.log(courses);
  
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState("overview")
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);


  useEffect(() => {
    console.log("Auth State in Profile:", authState);
    console.log("Is Profile Complete:", authState.isProfileComplete);
    console.log("User Data:", authState.user);
  }, [authState]);


  const handleSignOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    useEffect(() => {
    if (activeSection === "notifications") {
      fetchNotifications();
    }
  }, [activeSection]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await commenApi.getNotification();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] border-b border-gray-200 px-4 py-6 md:py-14 relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            className="border-red-400 text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 bg-white"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="sr-only sm:not-sr-only">Sign Out</span>
          </Button>
        </div>
        
        <UserProfileHeader />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <NavItem
              icon={User}
              label="Overview"
              description="Personal info"
              isActive={activeSection === "overview"}
              onClick={() => setActiveSection("overview")}
            />
            <NavItem
              icon={Award}
              label="Exam Results"
              description="Test scores"
              isActive={activeSection === "examresults"}
              onClick={() => setActiveSection("examresults")}
            />
            <NavItem
              icon={BookOpen}
              label="My Courses"
              description="Enrolled courses"
              isActive={activeSection === "my-courses"}
              onClick={() => setActiveSection("my-courses")}
            />
            <NavItem
              icon={Bell}
              label="Notifications"
              description="Preferences"
              isActive={activeSection === "notifications"}
              onClick={() => setActiveSection("notifications")}
            />
            <NavItem
              icon={Shield}
              label="Security"
              description="Account security"
              isActive={activeSection === "security-privacy"}
              onClick={() => setActiveSection("security-privacy")}
            />
            <NavItem
              icon={HelpCircle}
              label="Help"
              description="Get support"
              isActive={activeSection === "help-support"}
              onClick={() => setActiveSection("help-support")}
            />
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <SectionContent activeSection={activeSection} courses={courses} notifications={notifications} loadingNotifications={loadingNotifications}/>
        </div>
      </div>
    </div>
  )
}