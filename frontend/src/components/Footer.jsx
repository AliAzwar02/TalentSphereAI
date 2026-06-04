import React from "react";
import { Link } from "react-router-dom";
import { BsEnvelope, BsTelephone, BsInfoCircle, BsFillPersonFill, BsShieldLockFill } from "react-icons/bs";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TalentSphere</h3>
            <p className="text-gray-300">
              Connecting talented professionals with great opportunities.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center gap-2">
                  <BsInfoCircle />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white flex items-center gap-2">
                  <BsFillPersonFill />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white flex items-center gap-2">
                  <BsShieldLockFill />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-300 flex items-center gap-2">
              <BsEnvelope />
              Email: support@talentsphere.com
            </p>
            <p className="text-gray-300 flex items-center gap-2">
              <BsTelephone />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">© 2025 TalentSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;