import { LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"


export function SubjectPerformanceCard({ subjects }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <LineChart className="h-5 w-5 text-gray-500" />
        <CardTitle className="text-lg font-semibold">Subject Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>{subject.name}</span>
              <span className="font-medium">{subject.score}%</span>
            </div>
            <Progress
              value={subject.score}
              className="h-2 bg-gray-200 [&::-webkit-progress-bar]:bg-gray-700"
              aria-label={`${subject.name} performance: ${subject.score}%`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
