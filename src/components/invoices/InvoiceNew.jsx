import React, { useState } from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiContracts from "../../utils/api/contracts";
import apiInvoices from "../../utils/api/invoices";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import format from "../../utils/format";
import Validation from "./Validation";
import DateInput from "../../utils/form/DateInput";
import TextareaInput from "../../utils/form/Textarea";
import FileInput from "../../utils/form/FileInput";

function InvoiceNew() {
  const { id: contractId } = useParams();
  const navigate = useNavigate();

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery(["contract", contractId], () =>
    apiContracts.getContractDetails(contractId)
  );
  const contractDetails = contract?.data;

  const invoiceTypes = [
    { value: "RENT", label: "Rent" },
    { value: "WATER", label: "Water" },
    { value: "ELECT", label: "Electricity" },
    { value: "INTERNET", label: "Internet" },
    { value: "ADMIN", label: "Admin Fees" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "LEGAL", label: "Legal Fees" },
  ];

  const [invoice, setInvoice] = useState({
    contract: contractId,
    invoice_date: "",
    from_date: "",
    to_date: "",
    invoice_status: "NEW",
    invoice_amount: "",
    invoice_title: "",
    type: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const [errors, setErrors] = useState({});

  function handleDateChange(date, name) {
    setInvoice({ ...invoice, [name]: dayjs(date).format("YYYY-MM-DD") });
    console.log(invoice);
  }

  function handleChange(event) {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
    console.log(invoice);
  }

  function handleDropdown(event) {
    setInvoice({ ...invoice, ["type"]: event.value });
    console.log(invoice);
  }
  const addInvoiceMutation = useMutation(
    (invoice) => apiInvoices.addInvoice(invoice),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invoices"]);
        navigate(`/contracts/${contractId}`);
      },
      onError: (error) => console.log(error.response.data.name[0]),
    }
  );
  function handleSubmit(event) {
    event.preventDefault();
    console.log(invoice);
    setErrors(Validation(invoice));
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      console.log("No errors");
      addInvoiceMutation.mutate(invoice);
      // toast.success("Unit Added Successfully"); //Not working!!
    }
  }
  function handleCancel() {}
  return (
    <div>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Contracts", url: "/contracts" }}
            sub={[
              {
                title: `Contract No. ${contractId}`,
                url: `/contracts/${contractId}`,
              },
              { title: "Add New Invoice", url: "" },
            ]}
          />
          {/* <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Add New Invoice
            </h1>
          </div> */}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 p-7 bg-white">
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={handleSubmit}
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
                    value={contractDetails?.unit?.property_fk.name}
                  />
                  <Input
                    label="Unit"
                    required={true}
                    disabled={true}
                    value={contractDetails?.unit?.number}
                  />
                  <Input
                    label="Floor"
                    required={true}
                    disabled={true}
                    value={contractDetails?.unit?.floor}
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
                    value={contractDetails?.id}
                  />
                  <Input
                    label="Tenanat"
                    required={true}
                    disabled={true}
                    value={`${contractDetails.tenant?.user.first_name} ${contractDetails?.tenant?.user.last_name}`}
                  />
                  {contractDetails?.notification_mobile === "" ? (
                    <Input
                      label="Email"
                      required={true}
                      disabled={true}
                      value={contractDetails?.notification_email}
                    />
                  ) : (
                    <Input
                      label="Mobile"
                      required={true}
                      disabled={true}
                      value={contractDetails?.notification_mobile}
                    />
                  )}
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    label="Rent"
                    required={true}
                    disabled={true}
                    value={`KD ${format.changeAmountFormat(
                      contractDetails?.rent
                    )}`}
                  />
                  <Input
                    label="Status"
                    required={true}
                    disabled={true}
                    value={
                      contractDetails?.status.charAt(0).toUpperCase() +
                      contractDetails?.status.slice(1).toLowerCase()
                    }
                  />
                  <Input
                    label="Flexible"
                    required={true}
                    disabled={true}
                    value={contractDetails?.flexible === true ? "Yes" : "No"}
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    label="Contract Start Date"
                    required={true}
                    disabled={true}
                    value={format.changeDatesFormat(
                      contractDetails?.start_date
                    )}
                  />
                  <Input
                    label="Contract End Date"
                    required={true}
                    disabled={true}
                    value={format.changeDatesFormat(contractDetails?.end_date)}
                  />
                  <Input
                    label="Contract Ends In"
                    required={true}
                    disabled={true}
                    value={`${dayjs(contractDetails?.end_date).diff(
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
                    onChange={handleChange}
                    required={true}
                    disabled={false}
                    errorMessage={errors.invoice_title}
                  />
                </div>
                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    label="Invoice Type"
                    name="type"
                    isClearable={true}
                    isSearchable={true}
                    options={invoiceTypes}
                    placeholder="Select invoice type ..."
                    onChange={handleDropdown}
                    // value={selectedArea}
                    isMulti={false}
                    errorMessage={errors.type}
                  />
                  <Input
                    label="Invoice Amount"
                    name="invoice_amount"
                    prefix="KD"
                    type="number"
                    onChange={handleChange}
                    required={true}
                    disabled={false}
                    errorMessage={errors.invoice_amount}
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <DateInput
                    label="Invoice Date"
                    name="invoice_date"
                    onChange={(date) => handleDateChange(date, "invoice_date")}
                    errorMessage={errors.invoice_date}
                  />
                  <DateInput
                    label="From Date"
                    name="from_date"
                    onChange={(date) => handleDateChange(date, "from_date")}
                    errorMessage={errors.from_date}
                  />
                  <DateInput
                    label="To Date"
                    name="to_date"
                    onChange={(date) => handleDateChange(date, "to_date")}
                    errorMessage={errors.to_date}
                  />
                </div>
                {/* Third Row */}
                <div className="flex-col p-3">
                  <TextareaInput
                    name="description"
                    label="Description"
                    placeholder="Enter invoice description here ..."
                    rows={4}
                    optional={true}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="flex-col p-3">
                  <FileInput />
                </div> */}
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
                >
                  Save
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
