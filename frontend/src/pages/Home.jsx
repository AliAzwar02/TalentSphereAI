import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl mb-8">
          Connect with top employers and opportunities worldwide
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Get Started
          </Link>
          <Link to="/jobs" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
            Browse Jobs
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Create Profile</h3>
            <p className="text-gray-600">Build your professional profile and upload your resume</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Search Jobs</h3>
            <p className="text-gray-600">Browse through thousands of job opportunities</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Apply & Get Hired</h3>
            <p className="text-gray-600">Apply to jobs and connect with employers directly</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;