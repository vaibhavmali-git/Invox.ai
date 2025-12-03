import React from "react";

const SelectField = ({ label, name, options, ...props }) => {
  return (
    <div className="relative">
  <label
    htmlFor={name}
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    {label}
  </label>

  <div className="relative">
    <select
      id={name}
      name={name}
      {...props}
      className="
        appearance-none
        w-full h-10
        px-3 pr-10
        border border-slate-200
        rounded-lg
        bg-white
        text-gray-900 text-sm
        focus:outline-none
        focus:ring-2
        focus:ring-red-100
        focus:border-transparent
      "
    >
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>

    {/* Custom dropdown arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="h-4 w-4 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.086l3.71-3.855a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0l-4.24-4.41a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>

  );
};

export default SelectField;
