import React from "react";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { changeAmountFormat, changeDatesFormat } from "../../../utils/format";
import { DataGrid } from "@mui/x-data-grid";

function FinalConfirmation({
  contract,
  outstandingInvoices,
  cancelInvoices,
  sendNotification,
}) {
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
    },
  ];
  return (
    <>
      <Typography level="h1" marginBottom={3}>
        Final Confirmation
      </Typography>
      <Stack spacing={2}>
        <Typography level="h3" fontSize="xl">
          You are about to end the contract below. Please check the details and
          confirm:
        </Typography>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Property & Unit Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Property Name</FormLabel>
                  <Input value={contract.unit.property_fk.name} />
                </FormControl>
                <FormControl size="md">
                  <FormLabel>Unit No.</FormLabel>
                  <Input value={contract.unit.number} />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Area</FormLabel>
                  <Input value={contract.unit.property_fk.area} />
                </FormControl>
                <FormControl size="md">
                  <FormLabel>Floor</FormLabel>
                  <Input value={contract.unit.floor} />
                </FormControl>
              </Stack>
            </Box>
          </Box>
        </Card>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Tenant Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Tenant Name</FormLabel>
                  <Input value={contract.tenant.user.english_name} />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>
                    {contract.get_notification_method_display !== "Email"
                      ? "Mobile"
                      : "Email"}
                  </FormLabel>
                  <Input
                    value={
                      contract.get_notification_method_display == "Email"
                        ? contract.notification_email
                        : contract.notification_mobile
                    }
                  />
                </FormControl>
              </Stack>
            </Box>
          </Box>
          {sendNotification && (
            <Typography level="h3" fontSize="lg">
              Tenant will be notified after the contract is ended.
            </Typography>
          )}
        </Card>
        {outstandingInvoices.length > 0 ? (
          <Card variant="outlined">
            <Typography level="h2" fontSize="xl">
              List of All Outstanding Invoices
            </Typography>
            <Box display="flex">
              <DataGrid
                autoHeight
                rows={
                  outstandingInvoices
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
                      invoice_amount: changeAmountFormat(
                        invoice.invoice_amount
                      ),
                      payable_amount: changeAmountFormat(
                        invoice.payable_amount
                      ),
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
            {cancelInvoices && (
              <Typography level="h3" fontSize="lg" color="danger">
                The selected invoices in the table above will be cancelled.
              </Typography>
            )}
          </Card>
        ) : (
          <Card variant="outlined">
            <Typography level="h2" fontSize="xl">
              All invoices of this contract has been paid.
            </Typography>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default FinalConfirmation;
