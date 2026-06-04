import React from "react";
import BackButton from "../components/BackButton";

function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-3xl font-bold ml-2">Contact</h1>
      </div>
      <p className="text-gray-700">
        Email: support@talentsphere.com
      </p>
      <p className="text-gray-700">
        Phone: (555) 123-4567
      </p>
    </div>
  );
}

export default Contact;