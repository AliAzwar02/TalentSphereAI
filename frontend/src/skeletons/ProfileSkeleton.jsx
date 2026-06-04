import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {['name', 'email', 'phone', 'location', 'bio', 'company', 'position'].map((field, index) => (
        <div key={index}>
          <label className="block text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

export default ProfileSkeleton;