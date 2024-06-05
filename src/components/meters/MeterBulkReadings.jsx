import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../utils/form/Input";
import { addBulkReadings } from "../../utils/api/meters";
import Dropdown from "../../utils/form/Dropdown";
import { getMeters } from "../../utils/api/meters";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Button from "../../utils/Button";
import { changeDatesFormat } from "../../utils/format";

// import { PhotoIcon } from "@heroicons/react/24/solid";

function MeterBulkReadings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  function handleCancel() {
    navigate(-1);
  }

  const {
    data: meters,
    isLoading: metersLoading,
    error: metersError,
  } = useQuery(["meters"], () => getMeters({ contract: "not_null" }));

  console.log("List of meters:", meters?.data);

  const metersList = meters?.data
    ? meters?.data.map((meter) => ({
        value: meter.id,
        label: meter.meter_number,
      }))
    : [];

  const addReadingsMutation = useMutation(
    (readings) => addBulkReadings(readings),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["meters"]);
        toast.success("Readings added successfully");
        const newErrors = {};
        const newSuccess = {};
        if (response.errors) {
          response.errors.forEach((error) => {
            newErrors[error.meter_id] = error.error;
          });
        }
        if (response.success) {
          response.success.forEach((success) => {
            newSuccess[success.meter_id] = true;
          });
        }
        setErrors(newErrors);
        setSuccess(newSuccess);
        // navigate("/meters");
      },
      onError: (error) => {
        console.log("Error adding reading: ", error.response.data);
        const newErrors = {};
        if (error.response.data.errors) {
          error.response.data.errors.forEach((error) => {
            newErrors[error.meter_id] = error.error;
          });
        }
        setErrors(newErrors);
        toast.error("Error adding reading");
      },
    }
  );

  const validationSchema = Yup.object().shape({
    readings: Yup.array()
      .of(
        Yup.object().shape({
          meter: Yup.string().required("Meter is required"),
          reading: Yup.string().required("Reading is required"),
        })
      )
      .required("You must provide readings")
      .min(1, "At least one reading is required"),
  });

  const formik = useFormik({
    initialValues: {
      readings: [{ meter: "", reading: "" }],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      const hasEmptyReadings = values.readings.some(
        (reading) => reading.reading === ""
      );

      if (hasEmptyReadings) {
        toast.error("Some reading is missing and it's required.");
        return;
      }

      if (values.readings.length > metersList.length) {
        toast.error("You have added more readings than available meters.");
        return;
      }

      // Check for any errors before submission
      const anyErrors = Object.values(errors).some((error) => error);

      if (anyErrors) {
        toast.error(
          "There are errors in the form. Please fix them before submitting."
        );
        return;
      }

      const uniqueReadings = values.readings.filter(
        (reading, index, self) =>
          index === self.findIndex((r) => r.meter === reading.meter) &&
          reading.meter !== "" &&
          reading.reading !== ""
      );

      const readingsData = uniqueReadings.map((reading) => ({
        meter_id: reading.meter,
        reading: reading.reading,
      }));

      console.log("Submit data: ", readingsData);
      addReadingsMutation.mutate(readingsData);
    },
  });

  const getAvailableMeters = (index) => {
    const selectedMeters = formik.values.readings
      .map((reading) => reading.meter)
      .filter((meter) => meter !== "");
    return metersList.filter(
      (meter) =>
        !selectedMeters.includes(meter.value) ||
        meter.value === formik.values.readings[index].meter
    );
  };

  const handleAddRow = () => {
    if (formik.values.readings.length < metersList.length) {
      formik.setFieldValue("readings", [
        ...formik.values.readings,
        { meter: "", reading: "" },
      ]);
    } else {
      toast.warn(
        "You cannot add more fields than the number of meters available."
      );
    }
  };

  const handleMeterChange = (index, selectedOption) => {
    const selectedMeter = selectedOption
      ? meters?.data.find((meter) => meter.id === selectedOption.value)
      : null;
    const newReadings = formik.values.readings.map((reading, i) =>
      i === index
        ? { ...reading, meter: selectedOption ? selectedOption.value : "" }
        : reading
    );

    formik.setFieldValue("readings", newReadings);

    if (selectedMeter) {
      const today = new Date().toISOString().split("T")[0];
      if (selectedMeter.last_reading_date >= today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: `There's a new reading for this meter already.`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: "",
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [formik.values.readings[index].meter]: "",
      }));
    }
  };

  const handleReadingBlur = (index, event) => {
    const selectedMeter = meters?.data.find(
      (meter) => meter.id === formik.values.readings[index].meter
    );

    if (selectedMeter) {
      const newReading = parseInt(event.target.value);

      if (newReading <= selectedMeter.last_reading) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: `The new reading must be greater than the last reading of ${selectedMeter.last_reading}.`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: "",
        }));
      }
    }
  };

  const handleReadingChange = (index, event) => {
    const newReadings = formik.values.readings.map((reading, i) =>
      i === index ? { ...reading, reading: event.target.value } : reading
    );

    formik.setFieldValue("readings", newReadings);
  };

  const handleRemoveRow = (index) => {
    const newReadings = formik.values.readings.filter((_, i) => i !== index);
    formik.setFieldValue("readings", newReadings);
  };

  useEffect(() => {
    console.log("In useEffect");
    console.log("errors updated: ", errors);
    console.log("success updated: ", success);
    const hasErrors = Object.values(errors).some((error) => error);
    setIsSubmitDisabled(hasErrors || !formik.isValid);
  }, [errors, success, formik.isValid]);

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          {
            <Breadcrumb
              main={{ title: "Meters", url: "/meters" }}
              sub={[
                {
                  title: "Add Bulk Readings",
                  url: "",
                },
              ]}
            />
          }
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {"Add Bulk Readings"}
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 p-7 bg-white">
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={formik.handleSubmit}
            >
              <div className="border-gray-900/10 pb-10">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Add Meter Readings
                </h2>
                <div className="flex justify-between">
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Choose meter from the list, then enter reading
                  </p>
                  <div onClick={handleAddRow}>
                    <Button color="#BD9A5F" text="Add New Reading" type="add" />
                  </div>
                </div>
                {/* Row */}
                {formik.values.readings.map((reading, index) => (
                  <div key={index}>
                    <div className="flex p-3">
                      <Dropdown
                        name={`readings[${index}].meter`}
                        label="Meter"
                        isClearable={true}
                        isSearchable={true}
                        options={getAvailableMeters(index)}
                        placeholder="Select meter ..."
                        onChange={(selectedOption) =>
                          handleMeterChange(index, selectedOption)
                        }
                        value={metersList.find(
                          (option) => option.value === reading.meter
                        )}
                        onBlur={formik.handleBlur}
                        isMulti={false}
                        // errorMessage={
                        //   formik.errors.readings?.[index]?.meter ||
                        //   errors[reading.meter]
                        // }
                        isLoading={metersLoading}
                      />
                      <Input
                        name={`readings[${index}].reading`}
                        type="number"
                        label="Reading"
                        index={index}
                        required={true}
                        onChange={(e) => handleReadingChange(index, e)}
                        onBlur={(e) => handleReadingBlur(index, e)}
                        value={reading.reading}
                        placeholder="Enter reading"
                        errorMessage={formik.errors.readings?.[index]?.reading}
                        onRemoveRow={
                          index > 0 && (() => handleRemoveRow(index))
                        }
                      />
                      {success[reading.meter] && (
                        <AiOutlineCheckCircle size={20} color="green" />
                      )}
                    </div>
                    {errors[reading.meter] && (
                      <div className="text-red-500 text-sm mt-1 px-5">
                        {errors[reading.meter]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={handleCancel}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#BD9A5F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#BD9A5F] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BD9A5F]"
                  disabled={addReadingsMutation.isLoading || isSubmitDisabled}
                >
                  {addReadingsMutation.isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MeterBulkReadings;
