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
        className="rounded-lg border-2 border-gray-200 px-5 py-2 bg-white text-gray-800 font-semibold"
        onClick={() => setShowMenu(!showMenu)}
      >
        {name}
      </button>

      {showMenu && (
        <div className="absolute top-12 flex flex-col bg-white border border-gray-200 p-2 rounded-xl shadow-lg w-56">
          {data.map((el, index) => (
            <p
              className="w-full cursor-pointer hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg"
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
