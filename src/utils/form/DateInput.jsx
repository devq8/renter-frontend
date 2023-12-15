import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

function DateInput(props) {
  const { name, label, value, onChange, errorMessage } = props;

  return (
    <div className="w-[50%] px-2">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <DatePicker
        value={value}
        slotProps={{ textField: { size: "small" } }}
        formatDensity="spacious"
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={!!errorMessage}
            helperText={errorMessage}
          />
        )}
      />
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{errorMessage}</span>
        </p>
      )}
    </div>
  );
}

export default DateInput;
