import React from "react";
import { Header } from "../navbar/Header";
import { useParams, useNavigate } from "react-router";
import { getPaymentsList } from "../../utils/api/payment";
import { useQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/joy/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { changeAmountFormat, changeDateTimeFormat } from "../../utils/format";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Person from "@mui/icons-material/Person";

const countInvoices = (contracts) => {
  let invoiceCount = 0;
  contracts.forEach((contract) => {
    invoiceCount += contract.invoices?.length || 0;
  });
  return invoiceCount;
};

function Payments() {
  const { unique_payment_identifier } = useParams(); // Get unique_payment_identifier from url
  const navigate = useNavigate();

  const { data: payments } = useQuery(
    ["payments", unique_payment_identifier],
    () => getPaymentsList(unique_payment_identifier)
  );
  const paymentItems = payments?.data;

  const columns = [
    {
      field: "id",
      headerName: "Payment No.",
      flex: 0.1,
      disableColumnMenu: true,
      // width: 90
    },
    {
      field: "payment_date",
      headerName: "Paid On",
      // type: 'number',
      flex: 0.3,
      minWidth: 200,
      editable: false,
      cellClassName: "font-bold",
    },
    {
      field: "payment_method",
      headerName: "Method",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      editable: false,
    },
    {
      field: "invoices",
      headerName: "Invoices",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      disableColumnMenu: true,
      editable: false,
    },
    {
      field: "payment_amount",
      headerName: "Amount",
      // type: 'number',
      flex: 0.3,
      minWidth: 110,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      // align: "right",
    },
    {
      field: "details",
      headerName: "",
      // flex: 0.005,
      minWidth: 110,
      disableColumnMenu: true,
      editable: false,
      align: "right",
      renderCell: (params) => <NavigateNextIcon />,
    },
  ];

  const handleRowClick = (params) => {
    navigate(`/payments/${unique_payment_identifier}/${params.row.id}`);
  };

  return (
    <div className="min-h-[100vh] bg-[#F7F6F2]">
      <Header uid={unique_payment_identifier} />
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <div className="flex flex-row py-3 justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Payments
            </h1>
          </div>

          {/* Tenant Details */}
          <div className="m-1 space-y-4">
            <Card
              sx={{
                minWidth: 275,
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                // padding: "1rem",
              }}
            >
              <Person fontSize="large" sx={{ ml: 2, mr: 2 }} />
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Name
                </Typography>
                <Typography variant="h5" component="div">
                  {paymentItems && paymentItems.tenant.user.english_name}
                </Typography>
              </CardContent>
            </Card>
            <div className="flex flex-row py-3 justify-between items-center">
              <h1 className="font-bold text-3xl tracking-tight text-gray-900">
                List of Payments
              </h1>
            </div>

            {paymentItems && (
              <Box
                sx={{
                  width: "100%",
                  background: "white",
                  marginBottom: "20px",
                }}
              >
                <DataGrid
                  autoHeight
                  rows={paymentItems.payments.map((payment) => ({
                    id: payment.id,
                    payment_date: changeDateTimeFormat(payment.payment_date),
                    payment_method:
                      payment.payment_method.charAt(0).toUpperCase() +
                      payment.payment_method.slice(1).toLowerCase(),
                    invoices: countInvoices(payment.contracts),
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
