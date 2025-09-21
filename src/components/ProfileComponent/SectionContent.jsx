import React from 'react';
import LearningProgressItem from './LearningProgressItem';
import {  User, Award, BookOpen, Bell, Shield, HelpCircle } from "lucide-react"

function SectionContent({ activeSection, courses, notifications, loadingNotifications }) {
  const learningProgressData = [
    { subject: "Mathematics", progress: 85 },
    { subject: "Chemistry", progress: 65 },
    { subject: "Social Science", progress: 72 },
    { subject: "Physics", progress: 79 },
    { subject: "Biology", progress: 91 },
    { subject: "English", progress: 88 },
  ];

  const sections = {
    overview: {
      icon: User,
      title: "Overview",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {learningProgressData.map((item, index) => (
              <LearningProgressItem key={index} subject={item.subject} progress={item.progress} />
            ))}
          </div>
        </div>
      )
    },
    examresults: {
      icon: Award,
      title: "Exam Results",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-600" />
            Your Exam Results
          </h2>
          <div className="text-gray-600">
            <p>Your exam results will be displayed here.</p>
          </div>
        </div>
      )
    },
    "my-courses": {
      icon: BookOpen,
      title: "My Courses",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-600" />
            Enrolled Courses
          </h2>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course, index) => {
                const colorClasses = [
                  "bg-gray-900 hover:bg-gray-800 border border-gray-800",
                  "bg-violet-900 hover:bg-violet-800 border border-violet-800",
                  "bg-blue-900 hover:bg-blue-800 border border-blue-800",
                  "bg-purple-900 hover:bg-purple-800 border border-purple-800",
                  "bg-indigo-900 hover:bg-indigo-800 border border-indigo-800",
                  "bg-gray-800 hover:bg-gray-700 border border-gray-700",
                ];
                const colorIndex = index % colorClasses.length;
                const colorClass = colorClasses[colorIndex];
                
                return (
                  <div 
                    key={course.course_id} 
                    className={`${colorClass} rounded-lg p-4 text-white transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{course.course_name}</h3>
                        {course.is_default && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-white/20 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        {course.is_completed ? (
                          <span className="bg-green-900/50 px-2 py-1 rounded-full">Completed</span>
                        ) : (
                          <span className="bg-green-600/50 px-2 py-1 rounded-full">In Progress</span>
                        )}
                      </div>
                    </div>
                    {course.subscription_count > 0 && (
                      <div className="mt-3 text-sm text-white/80">
                        <span className="font-medium">{course.subscription_count}</span> subscribers
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-600">
              <p>You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      )
    },
    notifications: {
      icon: Bell,
      title: "Notifications",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            Notifications
            {notifications?.unread > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.unread}
              </span>
            )}
          </h2>
          {loadingNotifications ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : notifications?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {notifications.data.map((notification) => {
                // Generate random pastel color based on notification ID
                const colors = [
                  "bg-gray-900 hover:bg-gray-800 border border-gray-800",
                  "bg-violet-900 hover:bg-violet-800 border border-violet-800",
                ];
                const randomColor = colors[notification.id % colors.length];
                
                // Format date and time
                const notificationDate = new Date(notification.created);
                const formattedDate = notificationDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                const formattedTime = notificationDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg transition-all shadow-sm hover:shadow-md ${randomColor} ${
                      notification.is_read ? 'opacity-90' : 'ring-2 ring-purple-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      {notification.image ? (
                        <img 
                          src={notification.image} 
                          alt="Notification" 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${randomColor.replace('100', '200')}`}>
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-white">
                            {notification.title}
                          </h3>
                          <div className="flex flex-col items-end">
                            <span className="text-xs px-2 py-1 bg-white/70 rounded-full text-white font-medium">
                              {formattedDate}
                            </span>
                            <span className="text-xs mt-1 px-2 py-1 bg-white/70 rounded-full text-white">
                              {formattedTime}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-white">
                          {notification.message}
                        </p>
                        {!notification.is_read && (
                          <div className="mt-2 flex justify-between items-center">
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-600 text-white rounded-full">
                              New
                            </span>
                            <span className="text-xs text-gray-500">
                              {timeAgo(notification.created)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-white font-medium">No notifications yet</p>
              <p className="text-sm text-gray-500 mt-1">
                We'll notify you when something arrives
              </p>
            </div>
          )}
        </div>
      )
    },
    "security-privacy": {
      icon: Shield,
      title: "Security & Privacy",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            Account Security
          </h2>
          <div className="text-gray-600">
            <p>Manage your account security settings here.</p>
          </div>
        </div>
      )
    },
    "help-support": {
      icon: HelpCircle,
      title: "Help & Support",
      content: (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            Get Help
          </h2>
          <div className="text-gray-600">
            <p>Contact our support team for assistance.</p>
          </div>
        </div>
      )
    }
  };

  return sections[activeSection]?.content || sections.overview.content;
}

export default SectionContent;