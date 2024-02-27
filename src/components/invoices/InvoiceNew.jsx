import React from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContractDetails } from "../../utils/api/contracts";
import { addInvoice } from "../../utils/api/invoices";
import { getInvoiceTypes } from "../../utils/api/utils";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";
import DateInput from "../../utils/form/DateInput";
import TextareaInput from "../../utils/form/Textarea";
import FileInput from "../../utils/form/FileInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

function InvoiceNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id: contractId } = useParams();

  // Fetch contract details if contract is available
  const { data: contract } = useQuery(["contract", contractId], () =>
    getContractDetails(contractId)
  );

  const { data: types, isLoading: typesIsLoading } = useQuery(
    ["invoicesTypes"],
    () => getInvoiceTypes()
  );

  // const invoiceTypes = [];
  const invoiceTypes = types?.data || [];

  const addInvoiceMutation = useMutation((invoice) => addInvoice(invoice), {
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      toast.success("Invoice added successfully");
      navigate(-1);
    },
    onError: (error) => {
      console.log(error.response.data.name[0]);
      toast.error("Error adding invoice");
    },
  });

  const formik = useFormik({
    initialValues: {
      contract: contractId || "",
      invoice_title: "",
      invoice_type: "",
      invoice_amount: 0,
      discount_value: 0,
      invoice_date: "",
      from_date: "",
      to_date: "",
      due_date: "",
      description: null,
    },
    validationSchema: Yup.object({
      invoice_title: Yup.string().required("Required"),
      invoice_type: Yup.string().required("Required"),
      invoice_amount: Yup.number().required("Required"),
      discount_value: Yup.number(),
      invoice_date: Yup.date().required("Required"),
      from_date: Yup.date().required("Required"),
      to_date: Yup.date().required("Required"),
      due_date: Yup.date().required("Required"),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      const invoiceData = {
        contract: values.contract,
        invoice_title: values.invoice_title,
        invoice_type: values.invoice_type,
        invoice_amount: values.invoice_amount,
        discount_value: values.discount_value || null,
        invoice_date: values.invoice_date
          ? dayjs(values.invoice_date).format("YYYY-MM-DD")
          : null,
        from_date: values.from_date
          ? dayjs(values.from_date).format("YYYY-MM-DD")
          : null,
        to_date: values.to_date
          ? dayjs(values.to_date).format("YYYY-MM-DD")
          : null,
        due_date: values.due_date
          ? dayjs(values.due_date).format("YYYY-MM-DD")
          : null,
        description: values.discount_value || null,
      };
      console.log("Submitted Data:", invoiceData);
      addInvoiceMutation.mutate(invoiceData);
    },
  });

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Contracts", url: "/contracts" }}
            sub={[
              {
                title: `Contract No. ${contract?.data.id}`,
                url: `/contracts/${contract?.data.id}`,
              },
              { title: "Add New Invoice", url: "" },
            ]}
          />
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 p-7 bg-white">
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={formik.handleSubmit}
            >
              <div className="border-gray-900/10 pb-12 ">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Property Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  The invoice will be added to the property details below.
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <Input
                    label="Property"
                    required={true}
                    disabled={true}
                    value={contract?.data.unit.property_fk.name}
                  />
                  <Input
                    label="Unit"
                    required={true}
                    disabled={true}
                    value={contract?.data.unit.number}
                  />
                  <Input
                    label="Floor"
                    required={true}
                    disabled={true}
                    value={contract?.data.unit.floor}
                  />
                </div>
              </div>
              <div className="border-gray-900/10 pb-12 ">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Contract Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  The invoice will be added to the contract below.
                </p>
                {/* Second Row */}
                <div className="flex p-3">
                  <Input
                    label="Contract ID"
                    required={true}
                    disabled={true}
                    value={contract?.data.id}
                  />
                  <Input
                    label="Tenanat"
                    required={true}
                    disabled={true}
                    value={contract?.data.tenant.user.english_name}
                  />
                  {contract?.data.get_notification_method_display ===
                  "Email" ? (
                    <Input
                      label="Email"
                      required={true}
                      disabled={true}
                      value={contract?.data.notification_email}
                    />
                  ) : (
                    <Input
                      label="Mobile"
                      required={true}
                      disabled={true}
                      value={contract?.data.notification_mobile}
                    />
                  )}
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    label="Rent"
                    required={true}
                    disabled={true}
                    value={`KD ${changeAmountFormat(contract?.data.rent)}`}
                  />
                  <Input
                    label="Status"
                    required={true}
                    disabled={true}
                    value={
                      contract?.data.status.charAt(0).toUpperCase() +
                      contract?.data.status.slice(1).toLowerCase()
                    }
                  />
                  <Input
                    label="Flexible"
                    required={true}
                    disabled={true}
                    value={contract?.data.flexible === true ? "Yes" : "No"}
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    label="Contract Start Date"
                    required={true}
                    disabled={true}
                    value={changeDatesFormat(contract?.data.start_date)}
                  />
                  <Input
                    label="Contract End Date"
                    required={true}
                    disabled={true}
                    value={changeDatesFormat(contract?.data.end_date)}
                  />
                  <Input
                    label="Contract Ends In"
                    required={true}
                    disabled={true}
                    value={`${dayjs(contract?.data.end_date).diff(
                      dayjs(),
                      "day"
                    )} Days`}
                  />
                </div>
              </div>
              <div className="border-gray-900/10 pb-12 ">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Invoice Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Kindly enter the invoice details below.
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <Input
                    label="Invoice Title"
                    name="invoice_title"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.invoice_title}
                    required={true}
                    disabled={false}
                    errorMessage={
                      formik.touched.invoice_title &&
                      formik.errors.invoice_title
                    }
                  />
                </div>
                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    label="Invoice Type"
                    name="invoice_type"
                    isClearable={true}
                    isSearchable={true}
                    options={invoiceTypes}
                    isLoading={typesIsLoading}
                    placeholder="Select invoice type ..."
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "invoice_type",
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    required={true}
                    value={
                      invoiceTypes?.find(
                        (option) => option.value === formik.values.invoice_type
                      ) || null
                    }
                    isMulti={false}
                    errorMessage={
                      formik.touched.invoice_type && formik.errors.invoice_type
                    }
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    label="Invoice Amount"
                    name="invoice_amount"
                    prefix="KD"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={true}
                    value={formik.values.invoice_amount}
                    disabled={false}
                    errorMessage={
                      formik.touched.invoice_amount &&
                      formik.errors.invoice_amount
                    }
                  />
                  <Input
                    label="Discount Value"
                    name="discount_value"
                    prefix="KD"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={true}
                    value={formik.values.discount_value ?? ""}
                    disabled={false}
                    errorMessage={
                      formik.touched.discount_value &&
                      formik.errors.discount_value
                    }
                  />
                </div>
                {/* Fourth Row */}
                <div className="flex p-3">
                  <DateInput
                    label="Invoice Date"
                    name="invoice_date"
                    value={formik.values.invoice_date}
                    onChange={(date) =>
                      formik.setFieldValue("invoice_date", date)
                    }
                    errorMessage={
                      formik.touched.invoice_date && formik.errors.invoice_date
                    }
                  />
                  <DateInput
                    label="From Date"
                    name="from_date"
                    value={formik.values.from_date}
                    onChange={(date) => formik.setFieldValue("from_date", date)}
                    errorMessage={
                      formik.touched.from_date && formik.errors.from_date
                    }
                  />
                  <DateInput
                    label="To Date"
                    name="to_date"
                    value={formik.values.to_date}
                    onChange={(date) => formik.setFieldValue("to_date", date)}
                    errorMessage={
                      formik.touched.to_date && formik.errors.to_date
                    }
                  />
                </div>
                {/* Fifth Row */}
                <div className="flex p-3">
                  <DateInput
                    label="Due Date"
                    name="due_date"
                    value={formik.values.due_date}
                    onChange={(date) => formik.setFieldValue("due_date", date)}
                    errorMessage={
                      formik.touched.due_date && formik.errors.due_date
                    }
                  />
                </div>
                {/* Sixth Row */}
                <div className="flex-col p-3">
                  <TextareaInput
                    name="description"
                    label="Description"
                    placeholder="Enter invoice description here ..."
                    rows={4}
                    optional={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description ?? ""}
                    errorMessage={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </div>
              </div>
              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-[#BD9A5F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#BD9A5F] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BD9A5F]"
                  disabled={addInvoiceMutation.isLoading}
                >
                  {addInvoiceMutation.isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InvoiceNew;
