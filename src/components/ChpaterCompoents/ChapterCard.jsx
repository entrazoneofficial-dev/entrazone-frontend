import React, { useState } from "react";
import { ChapterCards } from "./ChapterCards";
import { UnlockPremiumModal } from "./UnlockPremiumModal";

function ChapterCard({ chapters }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUnlockClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {chapters.map((chapter) => (
        <ChapterCards
          key={chapter.id}
          chapter={chapter}
          onUnlockClick={handleUnlockClick}
        />
      ))}

      <UnlockPremiumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default ChapterCard;
