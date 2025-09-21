import { useEffect, useState } from "react";
import { DailyCalendar } from "../../components/DailyTaskComponents/DailyCalendar";
import { DailyTasks } from "../../components/DailyTaskComponents/DailyTasks";
import { homeApi } from "../../lib/api/home";
import LoadingPage from "../../components/LoaderComponent/LoadingPage";

export default function DailyTasksPage() {
  const [loading, setLoading] = useState(true);
  const [batchDates, setBatchDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState(null);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await homeApi.dailyTaskData();
        console.log(response, "this is daily");
        
        if (response) {
          setBatchDates({
            batch_created: response.batch_created,
            batch_end: response.batch_end
          });
          
          if (response.courses?.length > 0) {
            setCourseId(response.courses[0].course_id);
          }
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const batchEnd = new Date(response.batch_end);
          
          const initialDate = today <= batchEnd ? today : batchEnd;
          setSelectedDate(initialDate);
          
          await fetchDailyTasks(initialDate, response.courses[0]?.course_id);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchDailyTasks = async (date, courseId) => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const response = await homeApi.dailyTaskData({
        course_id: courseId,
        date: formattedDate
      });
      
      setDailyData(response);
    } catch (error) {
      console.error("Error fetching daily tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    await fetchDailyTasks(date, courseId);
  };

  if (loading || !batchDates || !dailyData) {
    return (
      <LoadingPage/>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DailyCalendar 
        batchDates={batchDates}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
      <DailyTasks 
        date={selectedDate} 
        dailyData={dailyData} 
      />
    </div>
  );
}