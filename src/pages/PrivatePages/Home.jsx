import { MdOutlineArrowOutward } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { useState, useEffect } from "react";
import { DropdownMenuCheckboxes } from "../../components/HomeComponenets/DropdownMenuCheckboxes";
import Carousel from "../../components/HomeComponenets/Carousel";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { SubjectGrid } from "../../components/HomeComponenets/SubjectGrid";
import { YoutubeGrid } from "../../components/HomeComponenets/YoutubeGrid";
import { UnsubscribedCoursesGrid } from "../../components/HomeComponenets/UnsubscribedCoursesGrid";

function Home({ homeData }) {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [hasReloaded, setHasReloaded] = useState(false);
   
  // Reload when subscribed_courses array is empty
  useEffect(() => {
    if (homeData && (!homeData.subscribed_courses || homeData.subscribed_courses.length === 0) && !hasReloaded) {
      console.log("Subscribed courses array is empty, reloading page...");
      setHasReloaded(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [homeData, hasReloaded]);

  // Show loading message while waiting for reload
  if (!homeData || (!homeData.subscribed_courses || homeData.subscribed_courses.length === 0)) {
    return (
      <div className="w-full h-full container mx-auto flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const displayedSubjects = showAllSubjects 
    ? homeData.subscribed_courses[0]?.subjects || []
    : (homeData.subscribed_courses[0]?.subjects || []).slice(0, 8);

  return (
    <div className="w-full h-full container mx-auto">
      <section className="md:p-5 p-2">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="mx-auto text-center">
              <h1 className="md:text-3xl text-2xl font-semibold">
                Greatness Awaits!
              </h1>
              <p className="md:text-sm text-xs">
                The drive to excel never stops. Unlock your potential{" "}
                <br className="md:block hidden" /> with our comprehensive
                learning platform.
              </p>
            </div>

            <div className="absolute md:right-6 lg:right-24 hidden md:block">
              <DropdownMenuCheckboxes
                subscribedCourses={homeData.subscribed_courses}
              />
            </div>
          </div>
        </div>

        <Carousel banners={homeData.banners} />
      </section>

      <section className="p-5">
        <div className="flex flex-col">
          <div className="md:flex-row flex-col flex items-center justify-center gap-5 md:justify-between mb-4 ">
            <div className="md:text-start text-center">
              <h1 className="md:text-3xl text-2xl font-semibold">
                Featured Courses
              </h1>
              <p className="md:text-sm text-xs">
                Discover our most popular courses to boost{" "}
                <br className="md:block hidden" /> your skills and advance your
                career.
              </p>
            </div>

            <div className="flex gap-4 ">
              <Link to="/daily-task">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center cursor-pointer"
                >
                  Daily Task
                  <FiFileText />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center cursor-pointer"
                onClick={() => setShowAllSubjects(!showAllSubjects)}
              >
                {showAllSubjects ? "Show Less" : "View All"}
                <MdOutlineArrowOutward />
              </Button>
            </div>
          </div>
          <SubjectGrid
            subjects={displayedSubjects}
          />
        </div>
      </section>

      <section className="p-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 ">
            <div className="text-start">
              <h1 className="text-3xl font-semibold">Top Videos</h1>
              <p className="md:text-sm text-xs">
                Most popular content from our expert instructors
              </p>
            </div>
          </div>

          <YoutubeGrid />
        </div>
      </section>
      {homeData.unsubscribed_courses &&
        homeData.unsubscribed_courses.length > 0 && (
          <section className="p-5">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="text-start">
                  <h1 className="text-3xl font-bold">
                    More Courses to Explore
                  </h1>
                  <p className="md:text-sm text-xs">
                    Expand your knowledge with these additional courses
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center cursor-pointer"
                >
                  View All Courses
                  <MdOutlineArrowOutward />
                </Button>
              </div>
              <UnsubscribedCoursesGrid
                courses={homeData.unsubscribed_courses}
              />
            </div>
          </section>
        )}
    </div>
  );
}

export default Home;