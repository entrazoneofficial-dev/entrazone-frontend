import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function DailyCalendar({ batchDates, onDateSelect, selectedDate }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datesInRange, setDatesInRange] = useState([]);

  useEffect(() => {
    if (!batchDates) return;

    const startDate = new Date(batchDates.batch_created);
    const endDate = new Date(batchDates.batch_end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      const disabled = date > today;

      dates.push({
        date,
        day: date.getDate(),
        disabled,
        month: date.getMonth(),
        year: date.getFullYear()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDatesInRange(dates);
    
    const todayMonth = new Date();
    if (today >= startDate && today <= endDate) {
      setCurrentMonth(todayMonth);
    } else if (today < startDate) {
      setCurrentMonth(new Date(startDate));
    } else {
      setCurrentMonth(new Date(endDate));
    }
  }, [batchDates]);
  
  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handleDateClick = (date, disabled) => {
    if (!disabled) {
      onDateSelect(date);
    }
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    
    const hasDates = datesInRange.some(date => 
      date.date.getMonth() === newMonth.getMonth() && 
      date.date.getFullYear() === newMonth.getFullYear()
    );
    
    if (hasDates) {
      setCurrentMonth(newMonth);
    }
  };

  const visibleDates = datesInRange.filter(d => 
    d.date.getMonth() === currentMonth.getMonth() && 
    d.date.getFullYear() === currentMonth.getFullYear()
  );

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth(), 
    1
  ).getDay();

  const hasPreviousMonth = datesInRange.some(d => 
    d.year < currentMonth.getFullYear() || 
    (d.year === currentMonth.getFullYear() && d.month < currentMonth.getMonth())
  );

  const hasNextMonth = datesInRange.some(d => 
    d.year > currentMonth.getFullYear() || 
    (d.year === currentMonth.getFullYear() && d.month > currentMonth.getMonth())
  );

  return (
    <div className="rounded-lg bg-white border shadow-xl border-gray-100 max-h-[600px] overflow-hidden">
      <div className="flex items-center bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] py-6 px-4 lg:px-14 lg:py-20 justify-between border-b flex-wrap gap-2">
        <Link to="/" className="p-2 bg-white rounded-full transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">{monthName}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white h-9 w-9"
            onClick={() => changeMonth('prev')}
            disabled={!hasPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white h-9 w-9"
            onClick={() => changeMonth('next')}
            disabled={!hasNextMonth}
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(600px - 80px)' }}>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          
          {visibleDates.map(({ date, day, disabled }) => {
            const isSelected = selectedDate.toDateString() === date.toDateString();
            return (
              <button
                key={date.toString()}
                onClick={() => handleDateClick(date, disabled)}
                disabled={disabled}
                className={`flex items-center justify-center p-2 rounded-lg font-semibold text-lg transition-colors ${
                  isSelected
                    ? "bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white shadow-md"
                    : disabled 
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}