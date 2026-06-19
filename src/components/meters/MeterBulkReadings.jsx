import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    data: metersPages,
    isLoading: metersLoading,
    error: metersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["meters", { contract: "not_null" }],
    ({ pageParam = 1 }) => getMeters({ contract: "not_null", page: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage?.next) return undefined;
        try {
          const url = new URL(lastPage.next);
          const page = url.searchParams.get("page");
          return page ? Number(page) : undefined;
        } catch {
          return undefined;
        }
      },
    }
  );

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    // Keep fetching until we've got them all
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const meterItems = metersPages
    ? metersPages.pages.flatMap((p) => p?.results ?? [])
    : [];

  const metersList = meterItems.map((meter) => ({
    value: meter.id,
    label: meter.meter_number,
  }));

  const addReadingsMutation = useMutation(
    (readings) => addBulkReadings(readings),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["meters"]);
        toast.success("Readings added successfully");
        setErrors({});
        setSuccess({});
        navigate(-1);
      },
      onError: (error) => {
        const data = error?.response?.data ?? {};
        console.log("Error adding reading: ", data);

        const succeededIds = new Set(
          (data.success ?? []).map((s) => s.meter_id)
        );
        const failedByMeter = {};
        (data.errors ?? []).forEach((e) => {
          failedByMeter[e.meter_id] = e.error;
        });

        if (succeededIds.size > 0) {
          queryClient.invalidateQueries(["meters"]);
          const remaining = formik.values.readings.filter(
            (r) => !succeededIds.has(r.meter)
          );
          formik.setFieldValue(
            "readings",
            remaining.length
              ? remaining
              : [{ meter: "", reading: "", municipality_fee: null }]
          );
          toast.warn(
            `${succeededIds.size} reading(s) saved. Please fix the remaining ${
              Object.keys(failedByMeter).length
            } and resubmit.`
          );
        } else if (Object.keys(failedByMeter).length > 0) {
          toast.error("Error adding reading");
        } else {
          toast.error(data.detail || "Error adding reading");
        }

        setErrors(failedByMeter);
        setSuccess({});
      },
    }
  );

  const validationSchema = Yup.object().shape({
    readings: Yup.array()
      .of(
        Yup.object().shape({
          meter: Yup.string().required("Meter is required"),
          reading: Yup.string().required("Reading is required"),
          municipality_fee: Yup.number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .min(0, "Municipality fee cannot be negative")
            .notRequired(),
        })
      )
      .required("You must provide readings")
      .min(1, "At least one reading is required"),
    municipality_fee: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : Number(originalValue);
      })
      .min(0, "Municipality fee cannot be negative")
      .notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      readings: [{ meter: "", reading: "", municipality_fee: null }],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
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
        municipality_fee: reading.municipality_fee ?? "0.000", // Default to "0.000" if not provided
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
        { meter: "", reading: "", municipality_fee: null },
      ]);
    } else {
      toast.warn(
        "You cannot add more fields than the number of meters available."
      );
    }
  };

  const handleMeterChange = (index, selectedOption) => {
    const selectedMeter = selectedOption
      ? meterItems.find((meter) => meter.id === selectedOption.value)
      : null;
    const newReadings = formik.values.readings.map((reading, i) =>
      i === index
        ? { ...reading, meter: selectedOption ? selectedOption.value : "" }
        : reading
    );

    formik.setFieldValue("readings", newReadings);

    if (selectedMeter) {
      const today = new Date().toISOString().split("T")[0];
      if (new Date(selectedMeter.last_reading_date) >= new Date(today)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: `There's a new reading for this meter already.`,
        }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[selectedMeter.id];
          return newErrors;
        });
      }
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[formik.values.readings[index].meter];
        return newErrors;
      });
    }
  };

  const handleReadingBlur = (index, event) => {
    const selectedMeter = meterItems.find(
      (meter) => meter.id === formik.values.readings[index].meter
    );

    if (selectedMeter) {
      const newReading = Number(event.target.value);

      if (newReading <= Number(selectedMeter.last_reading)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [selectedMeter.id]: `The new reading must be greater than the last reading of ${selectedMeter.last_reading}.`,
        }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[selectedMeter.id];
          return next;
        });
      }
    }
  };

  const handleReadingChange = (index, event) => {
    const newReadings = formik.values.readings.map((reading, i) =>
      i === index ? { ...reading, reading: event.target.value } : reading
    );

    formik.setFieldValue("readings", newReadings);

    const meterId = formik.values.readings[index]?.meter;
    if (meterId && errors[meterId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[meterId];
        return next;
      });
    }
  };

  const handleRemoveRow = (index) => {
    const removedMeter = formik.values.readings[index]?.meter;
    const newReadings = formik.values.readings.filter((_, i) => i !== index);
    formik.setFieldValue("readings", newReadings);
    if (removedMeter) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[removedMeter];
        return next;
      });
      setSuccess((prev) => {
        const next = { ...prev };
        delete next[removedMeter];
        return next;
      });
    }
  };

  const handleMunicipalityFeeChange = (index, event) => {
    const newReadings = formik.values.readings.map((reading, i) =>
      i === index
        ? { ...reading, municipality_fee: event.target.value }
        : reading
    );
    formik.setFieldValue("readings", newReadings);
  };

  const handleMunicipalityFeeBlur = (index, event) => {
    // const value = event.target.value;
    // if (value && parseFloat(value) < 0) {
    //   formik.setFieldError(
    //     `readings[${index}].municipality_fee`,
    //     "Municipality fee cannot be negative"
    //   );
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     [`municipality_fee_${index}`]: "Municipality fee cannot be negative",
    //   }));
    // } else {
    //   formik.setFieldError(`readings[${index}].municipality_fee`, "");
    //   setErrors((prevErrors) => {
    //     const newErrors = { ...prevErrors };
    //     delete newErrors[`municipality_fee_${index}`];
    //     return newErrors;
    //   });
    // }
  };

  useEffect(() => {
    console.log("In useEffect");
    console.log("errors state: ", errors);
    console.log("Formik errors: ", formik.errors);
    console.log("Formik isValid: ", formik.isValid);
    const hasErrors = Object.keys(errors).length > 0;
    console.log("Custom hasErrors: ", hasErrors);
    console.log("Setting isSubmitDisabled to: ", hasErrors || !formik.isValid);
    setIsSubmitDisabled(hasErrors || !formik.isValid);
  }, [errors, formik.isValid]);

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
                        errorMessage={
                          formik.touched.readings?.[index]?.meter
                            ? formik.errors.readings?.[index]?.meter
                            : undefined
                        }
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
                      />
                      <Input
                        name={`readings[${index}].municipality_fee`}
                        type="number"
                        label="Municipality Fee"
                        index={index}
                        onChange={(e) => handleMunicipalityFeeChange(index, e)}
                        onBlur={(e) => handleMunicipalityFeeBlur(index, e)}
                        value={reading.municipality_fee}
                        placeholder="Enter municipality fee"
                        errorMessage={
                          formik.errors.readings?.[index]?.municipality_fee
                        }
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
