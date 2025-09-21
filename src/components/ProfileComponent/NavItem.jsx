import React from 'react'

function NavItem({ icon: Icon, label, description, isActive, onClick }) {
  return (
 <button
    className={`flex items-center gap-3 p-3 rounded-lg text-left w-full transition-colors ${
      isActive ? "bg-purple-50 text-purple-700 border-[#6B21A88A]/54 border-r-3" : "text-gray-700 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <Icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-500"}`} />
    <div className="overflow-hidden">
      <div className={`font-medium ${isActive ? "text-purple-700" : "text-gray-900"} truncate`}>{label}</div>
      <div className="text-sm text-gray-500 truncate">{description}</div>
    </div>
  </button>
  )
}

export default NavItem