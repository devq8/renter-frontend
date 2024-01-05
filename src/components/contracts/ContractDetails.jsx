import Button from "../../utils/Button";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import Spinner from "../../utils/Spinner";
import api from "../../utils/api/contracts";
import apiUtils from "../../utils/api/utils";
import invoiceApi from "../../utils/api/invoices";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BsFillBuildingFill, BsFillPersonFill } from "react-icons/bs";
import { IoCalendarSharp } from "react-icons/io5";
import InvoiceRow from "./InvoiceRow";
import format from "../../utils/format";
import { toast } from "react-toastify";

function ContractDetails() {
  const { id: contractId } = useParams();
  const navigate = useNavigate();

  const [isSending, setIsSending] = useState(false);

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery(["contract", contractId], () =>
    api.getContractDetails(contractId)
  );

  const total_pending_amount = contract?.data?.total_pending_amount;

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useQuery(["invoices", contractId], () =>
    invoiceApi.getInvoices(contractId)
  );

  const contractDetails = contract?.data;

  const invoicesList = invoices?.data
    ?.sort((a, b) => {
      return new Date(b.invoice_date) - new Date(a.invoice_date);
    })
    .map((invoice) => {
      console.log("invoice", invoice);
      return (
        <InvoiceRow
          key={invoice.id}
          id={invoice.id}
          date={invoice.invoice_date}
          title={invoice.invoice_title}
          start={invoice.from_date}
          end={invoice.to_date}
          amount={invoice.invoice_amount}
          status={invoice.invoice_status}
          paymentDate={invoice.payment?.payment_date}
        />
      );
    });

  function handleAddNewInvoice() {
    navigate(`/contracts/${contractDetails.id}/new_invoice`);
  }

  function handlePayment() {
    console.log("redirecting to payment page");
    navigate(`/contracts/${contractDetails?.id}/checkout`);
  }

  const sendInvoiceReminderMutation = useMutation(
    (contractId) => apiUtils.sendInvoiceReminder(contractId),
    {
      onMutate: () => {
        setIsSending(true);
      },
      onSuccess: () => {
        toast.success("Reminder sent successfully");
        setIsSending(false);
      },
      onError: (error) => {
        toast.error(error.message);
        setIsSending(false);
      },
    }
  );

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Contracts", url: "/contracts" }}
            sub={[{ title: `Contract No. ${contractDetails?.id}`, url: "" }]}
          />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Contract No. {contractDetails?.id} Details
            </h1>
            <div className="flex">
              <Button
                text={isSending ? "Sending..." : "Send Reminder"}
                type="reminder"
                className_="bg-[#52555C]"
                disabled={isSending}
                onClick={() => sendInvoiceReminderMutation.mutate(contractId)}
              />
              <Button
                color="#BD9A5F"
                text="Add New Invoice"
                type="add"
                onClick={handleAddNewInvoice}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <div className="flex justify-center items-center space-x-3">
              <div className="flex-row justify-between h-[190px] w-[55%] bg-white items-center rounded-md mt-4">
                <div className="flex flex-row justify-between items-start  h-[43%] pt-5">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row items-start justify-center  ms-2 pl-3">
                      {/* Building Icon */}
                      <div className="flex bg-[#F7F7F7] w-[48px] h-[48px] rounded-md items-center justify-center">
                        <BsFillBuildingFill
                          className="text-[#52555C]"
                          style={{ fontSize: "28px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center me-1 ps-3 mt-[3px]">
                      <h1 className="text-[#52555C] text-base font-bold line-clamp-1">
                        {contractDetails.unit.property_fk.name}
                      </h1>
                      <h1 className="text-[#52555C] font-bold text-xs line-clamp-1">
                        {contractDetails.unit.get_unit_type_display}
                      </h1>
                    </div>
                    <div className="flex flex-row items-center justify-center bg-[#F2F2F2] mt-[4px] mx-2 py-[2px] px-3 rounded-sm max-h-[26px]">
                      <IoCalendarSharp className="text-[#52555C]" />
                      <h1 className="text-[#52555C] text-sm font-bold ms-2 line-clamp-1">
                        Monthly
                      </h1>
                    </div>
                  </div>
                  <div className="me-3">
                    {total_pending_amount > 0 ? (
                      <Button
                        color="#52555C"
                        text="Payment Link"
                        type="link"
                        onClick={handlePayment}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between bg-[#F7F7F7] h-[50%] mx-5 rounded-md">
                  <div className="flex flex-col items-start justify-center my-5 mx-2 pl-4">
                    <h1 className="text-[#AEB3C2] text-sm font-bold">
                      Unit Number
                    </h1>
                    <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                      {contractDetails?.unit.number}
                    </h1>
                  </div>
                  <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 border-l">
                    <h1 className="text-[#AEB3C2] text-sm font-bold">Floor</h1>
                    <h1 className="text-[#52555C] font-bold text-xl line-clamp-1">
                      {contractDetails?.unit.floor}
                    </h1>
                  </div>
                  <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 pr-10 border-l">
                    <h1 className="text-[#AEB3C2] text-sm font-bold">Status</h1>
                    <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                      {contractDetails?.status.charAt(0).toUpperCase() +
                        contractDetails?.status.slice(1).toLowerCase()}
                    </h1>
                  </div>
                  <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 pr-10 border-l">
                    <h1 className="text-[#AEB3C2] text-sm font-bold">Rent</h1>
                    <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                      KD {contractDetails?.rent}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex-row justify-between h-[190px] w-[21%] bg-white items-center rounded-md mt-4 p-5 space-y-4">
                <h1 className="text-[#52555C] text-base font-bold line-clamp-1">
                  Contract Dates
                </h1>
                <div className="flex justify-between">
                  <h1 className="text-[#AEB3C2] text-sm font-bold">
                    Start Date
                  </h1>
                  <h1 className="text-[#52555C] text-sm font-bold">
                    {format.changeDatesFormat(contractDetails?.start_date)}
                  </h1>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-[#AEB3C2] text-sm font-bold">End Date</h1>
                  <h1 className="text-[#52555C] text-sm font-bold">
                    {format.changeDatesFormat(contractDetails?.end_date)}
                  </h1>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-[#AEB3C2] text-sm font-bold">
                    First Invoice
                  </h1>
                  <h1 className="text-[#52555C] text-sm font-bold">
                    {format.changeDatesFormat(
                      contractDetails?.first_payment_date
                    )}
                  </h1>
                </div>
              </div>
              <div className="flex-row justify-between h-[190px] w-[21%] bg-white items-center rounded-md mt-4 p-5">
                <h1 className="text-[#52555C] text-base font-bold line-clamp-1 mb-3">
                  Tenant Details
                </h1>
                <div className="flex items-center">
                  <div className="flex bg-[#F7F7F7] w-[48px] h-[48px] rounded-md items-center justify-center">
                    <BsFillPersonFill
                      className="text-[#52555C]"
                      style={{ fontSize: "28px" }}
                    />
                  </div>
                  <div className="flex flex-col ps-3 pe-1">
                    <h1 className="text-[#52555C] text-sm font-bold line-clamp-1">
                      {contractDetails?.tenant.user.first_name}{" "}
                      {contractDetails?.tenant.user.last_name}
                    </h1>
                    <h1 className="text-[#52555C] text-sm font-bold line-clamp-1">
                      {contractDetails?.notification_mobile}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          {invoicesLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Invoice No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Invoice Period
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 text-center"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {invoicesList.length < 1 ? (
                    <tr
                      className="hover:bg-gray-50"
                      //   onClick={handlePropertyDetails}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <th className="px-4 py-4 text-gray-700 font-medium">
                        No invoices to show
                      </th>
                    </tr>
                  ) : (
                    invoicesList
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ContractDetails;
