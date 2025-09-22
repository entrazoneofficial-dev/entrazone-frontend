import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Clock, Calendar, Timer } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { FiBookOpen } from "react-icons/fi";
import { LuMessageSquare } from "react-icons/lu";
import { chapterApi } from "../../lib/api/chapter";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { commenApi } from "../../lib/api/commen";
import LoadingPage from "../LoaderComponent/LoadingPage";
import Swal from 'sweetalert2';

function BookMentorModal({ isOpen, setIsOpen, subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(
    subjects?.[0]?.subject_id || ""
  );
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [duration, setDuration] = useState("50min");
  const [date, setDate] = useState("today");
  const [agenda, setAgenda] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubject) return;

      setLoadingChapters(true);
      setError(null);

      try {
        const subjectObj = subjects.find(
          (sub) => sub.subject_id === selectedSubject
        );
        if (!subjectObj) return;

        const response = await chapterApi.GetChapters({
          subject_id: subjectObj.subject_id,
        });

        setChapters(response.chapters || []);
        if (response.chapters?.length > 0) {
          setSelectedChapter(response.chapters[0].chapter_id);
        }
      } catch (err) {
        setError(err.message || "Failed to load chapters");
        console.error("Error fetching chapters:", err);
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [selectedSubject, subjects]);

  const handleSubjectClick = (subjectID) => {
    setSelectedSubject(subjectID);
    setChapters([]);
    setSelectedChapter("");
  };

  const handleChapterClick = (chapterID) => {
    setSelectedChapter(chapterID);
  };

 const handleSubmit = async () => {
    if (!selectedSubject || !selectedChapter) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a subject and chapter',
        confirmButtonColor: '#9333EA',
      });
      setIsOpen(false);
      return;
    }

    if (!agenda) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter an agenda for the session',
        confirmButtonColor: '#9333EA',
      });
      setIsOpen(false);
      return;
    }

    const payload = {
      subject_id: selectedSubject,
      chapter_id: selectedChapter,
      lesson_id: "", 
      duration: duration,
      date: date,
      time_slot: `${startTime}-${endTime}`,
      agenda: agenda,
    };

    try {
      setIsSubmitting(true);
      const response = await commenApi.BookaMentor(payload);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Session booked successfully!',
        confirmButtonColor: '#9333EA',
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || "Failed to book session",
        confirmButtonColor: '#9333EA',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedSubject(subjects?.[0]?.subject_id || "");
    setSelectedChapter("");
    setStartTime("10:00");
    setEndTime("11:00");
    setDuration("50min");
    setDate("today");
    setAgenda("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md mx-auto p-0 gap-0 max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)]">
          <DialogHeader className="p-4 sm:p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                Book a Mentor
              </DialogTitle>
            </div>
            <Badge
              variant="secondary"
              className="bg-[#9333EA]/40 text-[#9333EA] w-fit mt-2"
            >
              10/40 slots booked this week
            </Badge>
          </DialogHeader>

          <div className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                <label className="text-sm font-medium">Select Part</label>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {subjects?.map((subject) => (
                  <Button
                    key={subject.subject_id}
                    variant={
                      selectedSubject === subject.subject_id
                        ? "default"
                        : "outline"
                    }
                    className={`flex-1 py-4 sm:py-7 text-sm sm:text-md min-w-[100px] ${
                      selectedSubject === subject.subject_id
                        ? "bg-gradient-to-r from-[#9333EA] to-[#DB2777]"
                        : ""
                    }`}
                    onClick={() => handleSubjectClick(subject.subject_id)}
                  >
                    {subject.subject_name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm font-medium">Select Topic</label>
              {loadingChapters ? (
                <div className="flex justify-center py-4">
                  <LoadingPage />
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm py-2">{error}</div>
              ) : chapters.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {chapters.map((chapter) => (
                    <Button
                      key={chapter.chapter_id}
                      variant={
                        selectedChapter === chapter.chapter_id
                          ? "default"
                          : "outline"
                      }
                      className={`py-2 sm:py-1 text-xs whitespace-normal break-words h-auto ${
                        selectedChapter === chapter.chapter_id
                          ? "bg-gradient-to-r from-[#9333EA] to-[#DB2777]"
                          : ""
                      }`}
                      onClick={() => handleChapterClick(chapter.chapter_id)}
                    >
                      {chapter.chapter_name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-2">
                  No chapters available for this subject
                </div>
              )}
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium">
                  Select Slot Duration
                </label>
              </div>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50min">50 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium">Select Date</label>
              </div>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="day-after">Day After Tomorrow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium">Select Time Slot</label>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Start Time
                  </label>
                  <div className="custom-time-picker">
                    <TimePicker
                      onChange={setStartTime}
                      value={startTime}
                      disableClock={true}
                    />
                  </div>
                </div>
                <span>to</span>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    End Time
                  </label>
                  <div className="custom-time-picker">
                    <TimePicker
                      onChange={setEndTime}
                      value={endTime}
                      disableClock={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <LuMessageSquare className="w-4 h-4" />
                <label className="text-sm font-medium">
                  Enter Agenda of Session
                </label>
              </div>
              <Textarea
                placeholder="Describe what you'd like to discuss in this mentoring session..."
                className="min-h-[80px] resize-none"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            <Button
              className="w-full cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white py-4 sm:py-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingPage /> : "Book Mentor Session"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BookMentorModal;
