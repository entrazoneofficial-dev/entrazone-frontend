import { BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"



export function PerformanceOverviewCard({
  overallPerformance,
  attemptExamCount,
  totalExamCount,
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <BarChart className="h-5 w-5 text-gray-500" />
        <CardTitle className="text-lg font-semibold">Performance overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Overall performance</span>
            <span className="font-medium">{overallPerformance}%</span>
          </div>
          <Progress
            value={overallPerformance}
            className="h-2 bg-gray-200 [&::-webkit-progress-bar]:bg-gradient-to-r [&::-webkit-progress-bar]:from-[#9333EA] [&::-webkit-progress-bar]:to-[#DB2777]"
            aria-label={`Overall performance: ${overallPerformance}%`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-center">
            <h2 className="text-3xl font-bold text-green-600">{attemptExamCount}</h2>
            <p className="text-sm text-gray-600">Attempt exam count</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">{totalExamCount}</h2>
            <p className="text-sm text-gray-600">Total Exam Count</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
