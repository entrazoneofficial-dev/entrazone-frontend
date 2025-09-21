import React from "react";
import { PopoverContent } from "../ui/popover";
import logo from "../../assets/WhatsApp Image 2025-07-14 at 20.07.11.jpeg";
import { backendUrl } from "../../constant/BaseUrl";

function NotificationModal({ notifications, loading, error }) {
  if (loading) {
    return (
      <PopoverContent className="w-full sm:w-80 p-4" align="end">
        <div className="text-center py-4">Loading notifications...</div>
      </PopoverContent>
    );
  }

  return (
    <PopoverContent
      className="w-full mt-2 sm:w-80 p-0 max-h-[80vh] overflow-y-auto"
      align="end"
    >
      <div className="py-2">
        {error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4">No new notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 border-gray-100"
            >
              {/* Logo Image */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {notification.image ? (
                  <img
                    src={`${backendUrl}/${notification.image}`}
                    alt={`${notification.title} logo`}
                    className="object-cover"
                  />
                ) : (
                  <img src={logo} alt="Default logo" className="object-cover" />
                )}
              </div>

              <div className="flex-grow min-w-0">
                <p className="font-medium text-sm text-gray-800 break-words">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 break-words">
                  {notification.message}
                </p>
              </div>

              <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">
                {new Date(notification.created).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </PopoverContent>
  );
}

export default NotificationModal;
