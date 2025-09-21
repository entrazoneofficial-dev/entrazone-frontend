import React from 'react'
import { Progress } from '../ui/progress'

function LearningProgressItem({ subject, progress }) {
  return (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-900 truncate">{subject}</span>
      <span className="text-sm text-gray-600 whitespace-nowrap">{progress}%</span>
    </div>
    <Progress value={progress} className="h-2 bg-gray-200 [&>*]:bg-black" />
  </div>
)  
}

export default LearningProgressItem