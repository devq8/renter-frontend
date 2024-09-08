import React from "react";
import { useParams, useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { getPaymentDetails } from "../../utils/api/payment";
import {
  changeDateTimeFormat,
  changeAmountFormat,
  changeDatesFormat,
} from "../../utils/format";
import { Box } from "@mui/joy";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/joy/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function PaymentDetails() {
  const { id: paymentId } = useParams();
  const navigate = useNavigate();

  const { data: paymentData } = useQuery(["payment", paymentId], () =>
    getPaymentDetails(paymentId)
  );
  const paymentDetails = paymentData?.data;

  const columns = [
    {
      field: "id",
      headerName: "No.",
      disableColumnMenu: true,
      maxWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoice_date",
      headerName: "Date",
      minWidth: 60,
      editable: false,
      cellClassName: "font-bold",
    },
    {
      field: "invoice_type",
      headerName: "Type",
      //   flex: 0.1,
      width: 110,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "invoice_title",
      headerName: "Title",
      // type: 'number',
      flex: 0.1,
      minWidth: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "from_date",
      headerName: "From",
      // type: 'number',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "to_date",
      headerName: "To",
      // type: 'number',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "due_date",
      headerName: "Due",
      // type: 'number',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "invoice_amount",
      headerName: "Amount (KD)",
      // type: 'number',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "right",
      headerAlign: "left",
    },
    {
      field: "payable_amount",
      headerName: "Payable (KD)",
      // type: 'number',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "right",
      headerAlign: "left",
    },
    {
      field: "details",
      headerName: "",
      flex: 0.001,
      //   minWidth: 110,
      disableColumnMenu: true,
      editable: false,
      sortable: false,
      align: "right",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/invoices/${params.row.id}`)}
        >
          <NavigateNextIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Payments", url: "/payment" }}
            sub={[{ title: `Payment No. ${paymentId} Details`, url: "" }]}
          />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Payment #{paymentId} Details
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-col justify-center">
        <div className="flex lg:mx-auto max-w-7xl py-3 lg:px-8 justify-center">
          <div className="bg-white rounded-md m-5 p-4 lg:mx-3 lg:w-[50%] sm:w-[90%]">
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Status</h1>
              <h1 className="mx-2 py-2 font-bold">
                {paymentDetails?.payment_status.toUpperCase()}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 ">Payment Method</h1>
              <h1 className="mx-2 py-2 ">
                {paymentDetails?.payment_status &&
                  paymentDetails?.payment_method}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 ">Reference ID</h1>
              <h1 className="mx-2 py-2 ">
                {paymentDetails?.payment_status && paymentDetails?.reference_id}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 ">Reference Token</h1>
              <h1 className="mx-2 py-2 ">
                {paymentDetails?.payment_status &&
                  paymentDetails?.reference_token}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 ">Payment Date & Time</h1>
              <h1 className="mx-2 py-2 ">
                {paymentDetails?.payment_status &&
                  changeDateTimeFormat(paymentDetails?.payment_date)}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex lg:mx-auto max-w-7xl py-3 lg:px-8 justify-center">
          <Box
            sx={{
              width: "100%",
              background: "white",
              marginBottom: "20px",
            }}
          >
            <DataGrid
              autoHeight
              rows={
                paymentDetails?.invoices?.map((invoice) => ({
                  id: invoice.id,
                  invoice_date: changeDatesFormat(invoice.invoice_date),
                  invoice_type: invoice.invoice_type,
                  invoice_title: invoice.invoice_title,
                  from_date: invoice.from_date,
                  to_date: invoice.to_date,
                  due_date: invoice.due_date,
                  invoice_amount: changeAmountFormat(invoice.invoice_amount),
                  payable_amount: changeAmountFormat(invoice.payable_amount),
                })) || []
              }
              columns={columns}
              autosizeOptions={{
                includeHeaders: true,
                includeOutliers: true,
                outliersFactor: 1,
                expand: true,
              }}
              pageSizeOptions={[10, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
            />
          </Box>
        </div>
      </main>
    </>
  );
}

export default PaymentDetails;
