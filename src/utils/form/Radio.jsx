import React from "react";

function Radio({ options, name, defaultChoice, onChange }) {
  const list = options.map((option) => {
    return (
      <div className="flex items-center gap-x-3">
        <input
          id={option}
          name={name}
          value={option}
          type="radio"
          defaultChecked={defaultChoice === option ? true : false}
          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          onChange={onChange}
        />
        <label
          htmlFor={option}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {option}
        </label>
      </div>
    );
  });
  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        Notifications Method
      </legend>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Choose your preferred way of notification from the list below.
      </p>
      <div className="flex mt-6 space-x-6">{list}</div>
    </fieldset>
  );
}

export default Radio;
