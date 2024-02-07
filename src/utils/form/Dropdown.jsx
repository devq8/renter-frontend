import React from "react";
import Select from "react-select";

function Dropdown(props) {
  return (
    <div className="w-[50%] px-2">
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {props.label}
      </label>

      <Select
        name={props.name}
        isClearable={props.isClearable}
        isSearchable={props.isSearchable}
        options={props.options}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value || null}
        isMulti={props.isMulti ? true : false}
        isLoading={props.isLoading ? true : false}
        styles={{
          control: (provided, state) => ({
            ...provided,
            height: "42px",
            borderColor: state.isFocused ? "#BD9A5F" : "white",
            boxShadow: "0 0 0 1px #D1D5DB",
          }),
        }}
      />

      {props.errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{props.errorMessage}</span>
        </p>
      )}
    </div>
  );
}

export default Dropdown;
