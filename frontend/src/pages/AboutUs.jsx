import React from "react";
import BackButton from "../components/BackButton";

function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-4">
				<BackButton />
				<h1 className="text-3xl font-bold ml-2">About Us</h1>
      </div>
      <p className="text-gray-700">
        Welcome to TalentSphere! We connect talented professionals with great opportunities. Our mission is to help you find the perfect job or the perfect candidate for your team.
      </p>
    </div>
  );
}

export default AboutUs;