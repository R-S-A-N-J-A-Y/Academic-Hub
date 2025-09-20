import { useState } from "react";

const FloatingInput = ({ id, type, label, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className="w-full h-12 px-3 border-gray-300 border-b-2 rounded-md 
                   focus:outline-none focus:border-blue-500"
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300
          ${
            focused || value
              ? "-top-1 text-xs text-blue-500"
              : "top-1/2 -translate-y-1/2 text-base text-gray-400"
          }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
