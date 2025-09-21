
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ClassCard } from "../../components/LiveClassComponents/ClassCard"
import { liveClassApi } from "../../lib/api/live"
import LoadingPage from "../../components/LoaderComponent/LoadingPage"




export default function LiveClassesDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [upcomingClasses, setUpcomingClassess] = useState(null);
  const [completedClasses, setCompletedClassess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await liveClassApi.getLiveClass();
        console.log(response,"this is response");
        
        
        if (response ) {
          setUpcomingClassess(response.upcoming_classes);
          setCompletedClassess(response.completed_classes)
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError(err.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

    if (loading) {
    return (
     <LoadingPage/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const handleOpenModal = (video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] px-4 py-6 md:py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white rounded-full">
              <ArrowLeft className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">Live Classes</h1>
              <p className="text-sm md:text-base text-black">
                Join interactive sessions with expert instructors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 bg-gray-50 z-10 pb-4">
            <TabsList className="w-auto inline-flex gap-1 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="upcoming" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Upcoming ({upcomingClasses.length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Completed ({completedClasses.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingClasses.map((video) => (
                <ClassCard key={video.id} video={video} onOpenModal={handleOpenModal} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedClasses.map((video) => (
                <ClassCard key={video.id} video={video} onOpenModal={handleOpenModal} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* {isModalOpen && selectedVideo && <VideoModal video={selectedVideo} onClose={handleCloseModal} />} */}
    </div>
  )
}