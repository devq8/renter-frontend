import React, { useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { changeAmountFormat, changeDatesFormat } from "../../../utils/format";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMeterDetails } from "../../../utils/api/meters";
import Button from "@mui/joy/Button";
import { addBulkReadings } from "../../../utils/api/meters";
import CircularProgress from "@mui/joy/CircularProgress";

function MaterReadings({ contract }) {
  const queryClient = useQueryClient();
  const contractId = contract.id;

  const [consumptionAmount, setConsumptionAmount] = useState(0);

  const {
    data: meter,
    isLoading: meterLoading,
    error: meterError,
  } = useQuery(["meter", contractId], () => getMeterDetails(contractId));

  const meterDetails = meter?.data;

  const addReadingMutation = useMutation(
    (reading) => addBulkReadings([reading]),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["meter", contractId]);
        toast.success("Reading added successfully");
      },
      onError: (error) => {
        console.log("Error adding reading: ", error.response.data);
        toast.error("Error adding reading");
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      reading_date: dayjs().format("YYYY-MM-DD"),
      meter_reading: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      reading_date: Yup.date()
        .required("Reading Date is required")
        .min(
          meterDetails ? new Date(meterDetails.last_reading_date) : new Date(),
          `Reading date must be after the last reading date (${changeDatesFormat(
            meterDetails?.last_reading_date
          )})`
        ),
      meter_reading: Yup.number()
        .required("Meter Reading is required")
        .moreThan(
          meterDetails?.last_reading,
          "Meter reading must be greater than the last reading"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      const readingData = {
        meter_id: meterDetails.id,
        reading: values.meter_reading,
        reading_date: changeDatesFormat(values.reading_date),
      };
      console.log("Submit data: ", readingData);
      addReadingMutation.mutate(readingData);
    },
  });

  const handleMeterReadingChange = (e) => {
    const newReading = e.target.value;
    formik.setFieldValue("meter_reading", newReading);
    let amount = 0;
    if (newReading > meterDetails?.last_reading) {
      if (meterDetails?.get_meter_type_display === "Water") {
        if (meterDetails?.get_water_unit_display === "Imperial Gallon") {
          amount = (newReading - meterDetails.last_reading) * 0.002;
        } else if (meterDetails?.get_water_unit_display === "Cubic Meter") {
          // Convert from cubic meter to Imperial Gallon
          amount = (newReading - meterDetails.last_reading) * 219.969 * 0.002;
        } else {
          amount = 0;
        }
      }
      setConsumptionAmount(amount);
    } else {
      setConsumptionAmount(0);
    }
  };
  if (meterLoading) {
    return (
      <div className="flex justify-center mt-40 h-full">
        <CircularProgress />
      </div>
    );
  }
  if (meterError && meterError.response?.data?.detail === "Not found.") {
    return (
      <Typography level="h1">No meter assigned to this contract!</Typography>
    );
  }

  if (meterError) {
    return <Typography level="h1">Error fetching meter details!</Typography>;
  }

  return (
    <>
      <Typography level="h1" marginBottom={3}>
        Water Meter Readings
      </Typography>
      <Stack spacing={2}>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Meter Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Water Meter Number</FormLabel>
                  <Input disabled value={meterDetails?.meter_number} />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Unit</FormLabel>
                  <Input
                    disabled
                    value={meterDetails?.get_water_unit_display}
                  />
                </FormControl>
              </Stack>
            </Box>
          </Box>
        </Card>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Last Water Meter Reading
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Last Reading Date</FormLabel>
                  <Input
                    disabled
                    value={changeDatesFormat(meterDetails?.last_reading_date)}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Last Reading</FormLabel>
                  <Input
                    disabled
                    value={changeAmountFormat(meterDetails?.last_reading, 0)}
                  />
                </FormControl>
              </Stack>
            </Box>
          </Box>
        </Card>
        {changeDatesFormat(meterDetails?.last_reading_date) !==
          changeDatesFormat(dayjs()) && (
          <Card variant="outlined">
            <Typography level="h2" fontSize="xl">
              Enter New Water Meter Reading
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Box display="flex">
                <Box width="50%" marginX={3} marginY={3}>
                  <Stack spacing={2}>
                    <FormControl size="md">
                      <FormLabel>Reading Date</FormLabel>
                      <DatePicker
                        name="reading_date"
                        value={dayjs(formik.values.reading_date)}
                        onChange={(date) =>
                          formik.setFieldValue("reading_date", date.toDate())
                        }
                        views={["year", "month", "day"]}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "37px", // Adjust this value as needed
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "1.25rem", // Adjust this value as needed
                          },
                        }}
                      />{" "}
                      {formik.touched.reading_date &&
                        formik.errors.reading_date && (
                          <Typography color="danger" variant="caption">
                            {formik.errors.reading_date}
                          </Typography>
                        )}
                    </FormControl>
                    <FormControl size="md">
                      <FormLabel>Amount</FormLabel>
                      <Input
                        startDecorator={"KD"}
                        value={changeAmountFormat(consumptionAmount, 3)}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                </Box>
                <Box width="50%" marginX={3} marginY={3}>
                  <Stack spacing={2}>
                    <FormControl
                      size="md"
                      error={
                        formik.errors.meter_reading &&
                        formik.touched.meter_reading
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Meter Reading</FormLabel>
                      <Input
                        name="meter_reading"
                        type="number"
                        onChange={(e) => {
                          const newValue =
                            e.target.value === "" ? "" : Number(e.target.value);
                          formik.setFieldValue("meter_reading", newValue);
                          handleMeterReadingChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.meter_reading}
                      />
                      {formik.touched.meter_reading &&
                        formik.errors.meter_reading && (
                          <Typography color="danger" variant="caption">
                            {formik.errors.meter_reading}
                          </Typography>
                        )}
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                paddingX={3}
                paddingY={2}
              >
                <Button color="neutral" type="submit" disabled={meterLoading}>
                  Submit
                </Button>
              </Box>
            </form>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default MaterReadings;
