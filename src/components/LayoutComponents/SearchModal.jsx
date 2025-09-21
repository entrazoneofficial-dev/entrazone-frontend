import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { History, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

function SearchModal({ isOpen, setIsOpen }) {
  const recentSearches = [
    "Introduction to Mathematics",
    "Chemistry basics",
    "Biology fundamentals",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px] p-6 top-[10%] translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Search</DialogTitle>
        </DialogHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for courses,videos.."
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus-visible:ring-offset-0 focus-visible:ring-transparent"
          />
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <History className="h-4 w-4" />
            <span className="text-sm font-medium">Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <Badge
                key={index}
                variant="default"
                className="bg-[#9333EA]/40 border-1 border-[#9333EA] text-[#9333EA] px-3 py-1 rounded-full text-sm cursor-pointer"
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchModal;
