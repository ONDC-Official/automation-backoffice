import React from "react";

const Button = ({
  label,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 
        bg-blue-500 
        text-white 
        rounded-lg 
        shadow-md 
        hover:bg-blue-600 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400 
        focus:ring-opacity-75 
        disabled:bg-gray-400 
        disabled:cursor-not-allowed 
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
