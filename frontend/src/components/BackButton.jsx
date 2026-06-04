import React from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-black text-2xl py-2 rounded"
    >
      <IoArrowBackSharp />
    </button>
  );
}

export default BackButton;