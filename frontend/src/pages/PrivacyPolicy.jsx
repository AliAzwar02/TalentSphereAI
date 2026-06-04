import React from "react";
import BackButton from "../components/BackButton";

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-4">
				<BackButton />
				<h1 className="text-3xl font-bold ml-2">Privacy Policy</h1>
      </div>
      <p className="text-gray-700">
        Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.
      </p>
    </div>
  );
}

export default PrivacyPolicy;