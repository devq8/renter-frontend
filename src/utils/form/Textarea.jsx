import React from "react";

function TextareaInput(props) {
  const { name, label, placeholder, rows, optional, onChange } = props;
  return (
    <div className="px-2">
      <label
        htmlFor={name}
        className="flex items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
        {optional && (
          <span className=" text-xs font-medium text-gray-400 dark:text-white ms-1">
            {`(optional)`}
          </span>
        )}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
        placeholder={placeholder}
        onChange={onChange}
      ></textarea>
    </div>
  );
}

export default TextareaInput;
