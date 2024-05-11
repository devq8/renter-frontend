import React from "react";
import "./Input.css";

function Input(props) {
  //   const [focused, setFocused] = useState(false);

  const {
    name,
    type,
    value,
    label,
    placeholder,
    required,
    onChange,
    onBlur,
    errorMessage,
    pattern,
    disabled,
    prefix,
    direction,
    ...inputProps
  } = props;

  return (
    <div className="flex flex-col w-[50%] px-2">
      <label
        htmlFor={name}
        className="flex items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
        {!required && (
          <span className=" text-xs font-medium text-gray-400 dark:text-white ms-1">
            {`(optional)`}
          </span>
        )}
      </label>
      {prefix ? (
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm font-bold text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            {prefix}
          </span>
          <input
            {...inputProps}
            type={type}
            id={name}
            name={name}
            value={value}
            className="border border-gray-300 text-gray-900 text-sm rounded-none rounded-r-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            dir={direction || "ltr"}
          />
        </div>
      ) : (
        <input
          {...inputProps}
          type={type}
          id={name}
          name={name}
          value={value}
          className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          dir={direction || "ltr"}
        />
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{errorMessage}</span>
        </p>
      )}
    </div>
  );
}

export default Input;
