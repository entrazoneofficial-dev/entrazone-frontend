import { SubjectPerformanceCard } from "../../components/ExamReportComponets/SubjectPerformanceCard"
import { PerformanceOverviewCard } from "../../components/ExamReportComponets/PerformanceOverviewCard"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { ExamAssessmentCard } from "../../components/ExamReportComponets/ExamAssessmentCard"
import { useEffect, useState } from "react"
import { commenApi } from "../../lib/api/commen"
import { toast } from "react-hot-toast"
import LoadingPage from "../../components/LoaderComponent/LoadingPage"

export default function ExamResultsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [examData, setExamData] = useState({
    consolidated: [],
    daily: [],
    live: [],
    model: [],
    monthly: [],
    weekly: [],
    performanceMetrics: {
      totalExams: 0,
      averageScore: 0,
      examsPassed: 0,
      passRate: 0,
      performanceTrend: 'stable'
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchExamReport = async () => {
      try {
        setLoading(true)
        const response = await commenApi.ExamReport()
        console.log(response,"this is response daaaaa");
        
        if (response.status === 'success') {
          setExamData({
            consolidated: response.data.Consolidated || [],
            daily: response.data.Daily || [],
            live: response.data.Live || [],
            model: response.data.Model || [],
            monthly: response.data.Monthly || [],
            weekly: response.data.Weekly || [],
            performanceMetrics: {
              totalExams: response.data.performance_metrics?.total_exams || 0,
              averageScore: response.data.performance_metrics?.average_score || 0,
              examsPassed: response.data.performance_metrics?.exams_passed || 0,
              passRate: response.data.performance_metrics?.pass_rate || 0,
              performanceTrend: response.data.performance_metrics?.performance_trend || 'stable'
            }
          })
        } else {
          throw new Error(response.message || "Failed to load exam report")
        }
      } catch (err) {
        setError(err.message || "Failed to load exam report")
        toast.error(err.message || "Failed to load exam results")
        console.error("Error fetching exam report:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExamReport()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  console.log(examData,"check dataa");
  

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error loading exam results</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const allExams = [
    ...examData.consolidated,
    ...examData.daily,
    ...examData.live,
    ...examData.model,
    ...examData.monthly,
    ...examData.weekly
  ]

  // Transform performance metrics for the overview card
  const performanceOverview = {
    overallPerformance: examData.performanceMetrics.averageScore,
    attemptExamCount: allExams.length,
    totalExamCount: examData.performanceMetrics.totalExams,
    passRate: examData.performanceMetrics.passRate,
    performanceTrend: examData.performanceMetrics.performanceTrend
  }

  // Transform data for subject performance
  const subjectPerformance = allExams.reduce((acc, exam) => {
    const existingSubject = acc.find(item => item.name === exam.exam_name)
    if (existingSubject) {
      existingSubject.score = Math.max(existingSubject.score, exam.percentage)
    } else {
      acc.push({
        name: exam.exam_name,
        score: exam.percentage
      })
    }
    return acc
  }, [])

  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 bg-white rounded-full transition-colors shrink-0 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
            <span className="sr-only">Go back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
            <p className="text-gray-600">Track your academic performance and progress</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PerformanceOverviewCard 
            overallPerformance={performanceOverview.overallPerformance} 
            attemptExamCount={performanceOverview.attemptExamCount} 
            totalExamCount={performanceOverview.totalExamCount}
            passRate={performanceOverview.passRate}
            performanceTrend={performanceOverview.performanceTrend}
          />
          <SubjectPerformanceCard subjects={subjectPerformance} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {examData.daily.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Daily Exams</h2>
              <div className="space-y-4">
                {examData.daily.map((exam, index) => (
                  <ExamAssessmentCard 
                    key={`daily-${index}`} 
                    assessment={{
                      id: exam.exam_id,
                      title: exam.exam_name,
                      date: exam.date,
                      subject: exam.exam_type,
                      score: exam.marks_obtained,
                      total: exam.total_marks,
                      correct: exam.question_stats?.correct_answers || 0,
                      wrong: exam.question_stats?.wrong_answers || 0,
                      unanswered: exam.question_stats?.unanswered || 0,
                      percentage: exam.percentage,
                      passed: exam.passed
                    }} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}