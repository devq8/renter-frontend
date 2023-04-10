import React, { useState } from "react";

import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "42px",
    borderColor: state.isFocused ? "#BD9A5F" : "white",
    boxShadow: "0 0 0 1px #D1D5DB",
  }),
};

function SelectSearch({
  name,
  label,
  clearable,
  searchable,
  disabled,
  loading,
  rtl,
  options,
  placeholder,
  onInputChange,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      <label
        for={name}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <Select
        name={name}
        defaultValue={options}
        isDisabled={disabled}
        isLoading={loading}
        isClearable={clearable}
        isRtl={rtl}
        isSearchable={searchable}
        options={options}
        placeholder={placeholder}
        onInputChange={setSelectedOption}
        value={selectedOption}
        styles={customStyles}
      />
    </div>
  );
}

export default SelectSearch;
