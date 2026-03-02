import React, { useEffect, useRef, useState } from "react";

const DropDown = ({ data, name, setter }) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleClick = (role) => {
    setter(role);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowMenu(false);
    };

    if (showMenu) document.addEventListener("mousedown", handleOutsideClick);
    else document.removeEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMenu]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="rounded-full border border-gray-200 px-5 py-2 bg-white text-gray-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between w-full"
        onClick={() => setShowMenu(!showMenu)}
      >
        {name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute left-0 top-full mt-2 flex flex-col bg-white border border-gray-200 p-2 rounded-2xl shadow-xl w-56 z-50 animate-in scale-in origin-top duration-150">
          {data.map((el, index) => (
            <p
              className="w-full cursor-pointer hover:bg-blue-50 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-150"
              key={index}
              onClick={() => handleClick(el)}
            >
              {el}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
