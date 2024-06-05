import React from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/joy/Box";
import { changeAmountFormat, changeDateTimeFormat } from "../../utils/format";
import { useQuery } from "@tanstack/react-query";
import { getAllPaymentsList } from "../../utils/api/payment";

function PaymentList() {
  const columns = [
    {
      field: "id",
      headerName: "No.",
      //   flex: 0.01,
      disableColumnMenu: true,
      maxWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_date",
      headerName: "Paid On",
      // type: 'number',
      flex: 0.1,
      //   minWidth: 200,
      editable: false,
      cellClassName: "font-bold",
    },
    {
      field: "payment_status",
      headerName: "Status",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_method",
      headerName: "Method",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoices",
      headerName: "Invoices",
      // type: 'number',
      flex: 0.1,
      //   maxWidth: 80,
      disableColumnMenu: true,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "payment_amount",
      headerName: "Amount",
      // type: 'number',
      flex: 0.1,
      maxWidth: 110,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "right",
      headerAlign: "center",
    },
    {
      field: "details",
      headerName: "",
      flex: 0.001,
      //   minWidth: 110,
      disableColumnMenu: true,
      editable: false,
      align: "right",
      renderCell: (params) => <NavigateNextIcon />,
    },
  ];
  const { data: payments } = useQuery(["payments"], () => getAllPaymentsList());
  const paymentItems = payments?.data;
  console.log("Payments:", paymentItems);
  const handleRowClick = (params) => {
    // navigate(`/payments/${unique_payment_identifier}/${params.row.id}`);
  };
  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Payments", url: "/payment" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Payments
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <Box
            sx={{
              width: "100%",
              background: "white",
              marginBottom: "20px",
            }}
          >
            <DataGrid
              autoHeight
              rows={paymentItems.map((payment) => ({
                id: payment.id,
                payment_date: changeDateTimeFormat(payment.payment_date),
                payment_status:
                  payment.payment_status.charAt(0).toUpperCase() +
                  payment.payment_status.slice(1).toLowerCase(),
                payment_method:
                  payment.payment_method.charAt(0).toUpperCase() +
                  payment.payment_method.slice(1).toLowerCase(),
                invoices: payment.invoices.length,
                payment_amount: `KD ${changeAmountFormat(
                  payment.payment_amount
                )}`,
                reference_token: payment.reference_token,
              }))}
              onRowClick={handleRowClick}
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

export default PaymentList;
