import { Calendar, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"



export function ExamAssessmentCard({ assessment }) {
   

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
    
  const scoreColorClass =
    assessment.score >= 80 ? "text-green-600" : assessment.score >= 70 ? "text-orange-500" : "text-red-600"

  const percentageColorClass =
    assessment.score >= 80 ? "text-blue-600" : assessment.score >= 70 ? "text-orange-500" : "text-red-600"

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">{assessment.title}</CardTitle>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(assessment.date)}</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{assessment.duration}</span>
          </div> */}
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {assessment.subject}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-3 text-center">
            <h3 className="text-2xl font-bold text-green-600">{assessment.correct}</h3>
            <p className="text-xs text-gray-600">Correct</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-3 text-center">
            <h3 className="text-2xl font-bold text-red-600">{assessment.wrong}</h3>
            <p className="text-xs text-gray-600">Wrong</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-3 text-center">
            <h3 className="text-2xl font-bold text-gray-800">{assessment.unanswered}</h3>
            <p className="text-xs text-gray-600">Unanswered</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${scoreColorClass}`}>
            {assessment.score}/{assessment.total}
          </h2>
          <div className="flex flex-col items-end">
            <span className={`text-lg font-semibold ${percentageColorClass}`}>
              {Math.round((assessment.score / assessment.total) * 100)}%
            </span>
            <span className="text-xs text-gray-500">Unanswered</span>
          </div>
        </div>
        <Progress
          value={(assessment.score / assessment.total) * 100}
          className="h-2 bg-gray-200 [&::-webkit-progress-bar]:bg-gray-700"
          aria-label={`Exam score: ${assessment.score}%`}
        />
        <div className="flex justify-end">
        <Link to={`/view-details/${assessment.id}`}>
            <Button variant="ghost" className="text-gray-600 cursor-pointer hover:bg-gray-100">
                <Eye className="h-4 w-4 mr-2" />
                View Details
            </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  )
}
