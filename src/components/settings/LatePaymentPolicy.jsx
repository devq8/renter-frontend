import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getLatePaymentPolicy,
  updateLatePaymentPolicy,
  resetLatePaymentPolicy,
} from "../../utils/api/latePayment";

// Manager settings: when should overdue contracts be blocked automatically.
function LatePaymentPolicy() {
  const queryClient = useQueryClient();

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery(["latePaymentPolicy"], getLatePaymentPolicy, { retry: false });

  const showError = (err) =>
    toast.error(err?.response?.data?.error || "Please try again later.");

  const onSaved = (data, message) => {
    queryClient.setQueryData(["latePaymentPolicy"], data);
    toast.success(message);
  };

  const saveMutation = useMutation(updateLatePaymentPolicy, {
    onSuccess: (data) => onSaved(data, "Late payment policy saved"),
    onError: showError,
  });

  const resetMutation = useMutation(resetLatePaymentPolicy, {
    onSuccess: (data) => onSaved(data, "Company default is now used"),
    onError: showError,
  });

  const formik = useFormik({
    initialValues: {
      auto_block_enabled: policy?.auto_block_enabled ?? true,
      auto_block_day: policy?.auto_block_day ?? 6,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      auto_block_day: Yup.number()
        .typeError("Enter a number")
        .integer("Enter a whole number")
        .min(1, "From 1 to 28")
        .max(28, "From 1 to 28")
        .required("Required"),
    }),
    onSubmit: (values) =>
      saveMutation.mutate({
        auto_block_enabled: values.auto_block_enabled,
        auto_block_day: Number(values.auto_block_day),
      }),
  });

  const day = Number(formik.values.auto_block_day);
  const lastPayDay = day > 1 ? day - 1 : null;
  const busy = saveMutation.isLoading || resetMutation.isLoading;

  return (
    <div className="min-h-[80vh] bg-[#F7F6F2]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
          Late Payment Policy
        </h1>
        <p className="text-gray-600 mb-5">
          Choose when your tenants' contracts are blocked if last month's rent
          is still unpaid. A blocked tenant cannot pay online and must contact
          the property owner.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">
            {error?.response?.status === 403
              ? "Only managers can change this."
              : "Could not load the late payment policy. Please try again later."}
          </Alert>
        ) : (
          <Card>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-5 p-2">
                <Alert severity={policy?.uses_default ? "info" : "success"}>
                  {policy?.uses_default
                    ? `You are using the company default: ${
                        policy?.default?.auto_block_enabled
                          ? `block on day ${policy?.default?.auto_block_day}`
                          : "auto-block off"
                      }.`
                    : "You are using your own settings."}
                </Alert>

                <FormControlLabel
                  control={
                    <Switch
                      name="auto_block_enabled"
                      checked={!!formik.values.auto_block_enabled}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "auto_block_enabled",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Auto-block overdue contracts"
                />

                <TextField
                  name="auto_block_day"
                  label="Block day (day of the month)"
                  type="number"
                  inputProps={{ min: 1, max: 28 }}
                  fullWidth
                  disabled={!formik.values.auto_block_enabled}
                  value={formik.values.auto_block_day}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.auto_block_day &&
                    !!formik.errors.auto_block_day
                  }
                  helperText={
                    formik.touched.auto_block_day &&
                    formik.errors.auto_block_day
                      ? formik.errors.auto_block_day
                      : !formik.values.auto_block_enabled
                      ? "Auto-block is off: contracts are never blocked automatically."
                      : lastPayDay
                      ? `Tenants must pay last month's rent by day ${lastPayDay}. Contracts still unpaid are blocked on day ${day}.`
                      : "From 1 to 28. Rent is due on the 5th, so day 6 is recommended."
                  }
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-md px-6 py-2.5 bg-primary text-white font-semibold hover:opacity-80 disabled:opacity-50"
                  >
                    {saveMutation.isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    disabled={busy || policy?.uses_default}
                    onClick={() => resetMutation.mutate()}
                    className="rounded-md px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50"
                  >
                    Use company default
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LatePaymentPolicy;
