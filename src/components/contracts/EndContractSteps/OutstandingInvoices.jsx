import React, { useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import {
  changeAmountFormat,
  changeDatesFormat,
  changeDateTimeFormat,
} from "../../../utils/format";
// import { getInvoices } from "../../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/joy/Button";
import { useNavigate } from "react-router";
import Switch from "@mui/joy/Switch";

function OutstandingInvoices({
  outstandingInvoices,
  setCancelInvoices,
  cancelInvoices,
}) {
  const navigate = useNavigate();

  const paymentDetails = outstandingInvoices;

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
      // cellClassName: "font-bold",
    },
    {
      field: "invoice_type",
      headerName: "Type",
      //   flex: 0.1,
      width: 70,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "invoice_title",
      headerName: "Title",
      // type: 'number',
      flex: 0.1,
      minWidth: 160,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "invoice_status",
      headerName: "Status",
      // type: 'number',
      flex: 0.1,
      minWidth: 90,
      disableColumnMenu: true,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "invoice_amount",
      headerName: "Amount",
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
      headerName: "Payable",
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
      // cellClassName: "font-bold",
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
      // cellClassName: "font-bold",
      align: "left",
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
      <Typography level="h1" marginBottom={3}>
        Outstanding Invoices
      </Typography>
      <Stack spacing={5}>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            List of All Outstanding Invoices
          </Typography>
          <Box display="flex">
            <DataGrid
              autoHeight
              rows={
                paymentDetails
                  ?.filter((invoice) => {
                    if (invoice.invoice_status.toLowerCase() !== "paid") {
                      return invoice;
                    }
                  })
                  .map((invoice) => ({
                    id: invoice.id,
                    invoice_date: changeDatesFormat(invoice.invoice_date),
                    invoice_type: invoice.invoice_type,
                    invoice_title: invoice.invoice_title,
                    invoice_status: invoice.invoice_status,
                    from_date: changeDatesFormat(invoice.from_date),
                    to_date: changeDatesFormat(invoice.to_date),
                    due_date: changeDatesFormat(invoice.due_date),
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
        </Card>
        <Box display="flex" width="100%" alignItems="center">
          <Typography level="h2" fontSize="xl" marginRight="15px">
            Do you want to cancell all outstanding invoices?
          </Typography>
          <Switch
            color={cancelInvoices ? "danger" : "success"}
            onChange={(event) => setCancelInvoices(event.target.checked)}
            size="md"
            checked={cancelInvoices}
            slotProps={{
              track: {
                children: (
                  <React.Fragment>
                    <Typography
                      component="span"
                      level="inherit"
                      sx={{ ml: "7px" }}
                    >
                      Yes
                    </Typography>
                    <Typography
                      component="span"
                      level="inherit"
                      sx={{ mr: "7px" }}
                    >
                      No
                    </Typography>
                  </React.Fragment>
                ),
              },
            }}
            sx={{
              "--Switch-thumbSize": "30px",
              "--Switch-trackWidth": "67px",
              "--Switch-trackHeight": "31px",
            }}
          />
        </Box>
      </Stack>
    </>
  );
}

export default OutstandingInvoices;
