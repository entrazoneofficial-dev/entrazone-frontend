import { CalendarDays, Video, FileText, Clock } from "lucide-react";
import { FiBookOpen } from "react-icons/fi";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function DailyTasks({ date, dailyData }) {
  const assessments = dailyData?.data?.schedules?.filter(item => item.type === 'exam') || [];
  const studyMaterials = dailyData?.data?.schedules?.filter(item => item.type !== 'exam') || [];

  return (
    <div className="rounded-lg bg-white border shadow-xl border-gray-100 max-h-[80vh] md:max-h-[600px] overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] py-6 px-6 lg:px-14 lg:py-16 border-b">
        <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-lg bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white">
          <CalendarDays className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-sm text-gray-600">{date.getFullYear()}</p>
        </div>
      </div>

      <div className="p-4 md:p-6 overflow-auto flex-1">
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-base md:text-lg font-semibold">
            <Video className="h-5 w-5 text-gray-700" />
            Assessments & Exams
          </h4>

          <div className="space-y-3">
            {assessments.map(assessment => (
              <Card key={assessment.id} className="rounded-lg bg-gradient-to-r from-[#F3E8FF]/40 to-[#FDF2F8]/20 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-lg md:text-xl font-bold">{assessment.title || "Algebra Fundamentals"}</h5>
                    <p className="text-sm text-gray-600">{assessment.description || "Accounting Introduction 1"}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{assessment.duration || "2"} hr</span>
                      <span>•</span>
                      <span>{assessment.questions || "10"} questions</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-3 md:items-end">
                    <span className="rounded-full bg-[#9333EA38]/22 px-2 py-1 text-xs font-medium text-purple-700">
                      {assessment.status || "available"}
                    </span>
                    <Button className="rounded-none bg-gradient-to-r from-[#9333EA] to-[#DB2777] px-4 md:px-6 py-1.5 md:py-2 text-white shadow-md transition-opacity hover:opacity-90 text-sm md:text-base">
                      Start Exam
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {studyMaterials.length > 0 && (
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-base md:text-lg font-semibold">
              <FiBookOpen className="h-5 w-5 text-gray-700" />
              Study Materials
            </h4>

            <div className="grid gap-3">
              {studyMaterials.map(material => (
                <Card key={material.id} className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-3 md:gap-4">
                      <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
                        <FileText className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h5 className="text-base font-bold">{material.title || "Accounting Fundamentals Guide"}</h5>
                        <p className="text-xs text-gray-500">{material.subject || "Accounting"}</p>
                      </div>
                    </div>
                    <Button className="rounded-none bg-gradient-to-r from-[#9333EA] to-[#DB2777] px-4 md:px-6 py-1.5 md:py-2 text-white shadow-md transition-opacity hover:opacity-90 text-sm md:text-base">
                      {material.type === 'video' ? 'Watch' : 'Open Pdf'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}