import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaAngleDown } from "react-icons/fa";
import { Button } from "../ui/button";

export function DropdownMenuCheckboxes({ subscribedCourses }) {
  const [selectedCourse, setSelectedCourse] = React.useState(
    subscribedCourses?.[0]?.course_name || "Select course"
  );

  if (!subscribedCourses || subscribedCourses.length === 0) {
    return (
      <Button variant="outline" size='lg' className="flex gap-9" disabled>
        No courses available
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size='lg' className="flex gap-2 items-center">
          <span>My course :</span>
          <span className="font-medium truncate max-w-[120px]">
            {selectedCourse}
          </span>
          <FaAngleDown className="text-black text-xs" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Course</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {subscribedCourses.map((course) => (
          <DropdownMenuCheckboxItem
            key={course.course_id || course.id}  
            checked={selectedCourse === course.course_name}
            onCheckedChange={(checked) => 
              checked && setSelectedCourse(course.course_name)
            }
          >
            {course.course_name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}