import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsPerson, BsBoxArrowInRight, BsBoxArrowRight, BsPersonPlus, BsGrid } from "react-icons/bs";
import { toast } from 'react-hot-toast';
import { logout } from '../redux/slices/authSlice';

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className='flex gap-2 items-center cursor-pointer' onClick={handleLogoClick}>
            <img src="/logoo.png" alt="TalentSphere Logo" className="h-9 w-auto object-contain" />
            <span className="text-2xl font-bold text-blue-600 hidden sm:block">
              TalentSphere
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                  <BsBoxArrowInRight />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                  <BsPersonPlus />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/${user.role}/dashboard`} className="text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2">
                  <BsGrid />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/profile" className="text-white bg-purple-500 px-4 py-2 rounded-md hover:bg-purple-600 flex items-center gap-2">
                  <BsPerson />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <BsBoxArrowRight />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;