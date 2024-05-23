import React from "react";
import { Header } from "../navbar/Header";
import { useParams, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { paymentResponse } from "../../utils/api/payment";
import { useQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/material/Typography";
import { changeAmountFormat, changeDateTimeFormat } from "../../utils/format";
import CircularProgress from "@mui/joy/CircularProgress";
import Button from "@mui/joy/Button";
import ContractCard from "../invoices/ContractCard";
import Person from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function PaymentDetails() {
  const { unique_payment_identifier, payment_id } = useParams();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const data = searchParams.get("data");

  const {
    data: payments,
    isLoading,
    error,
  } = useQuery(["payments", payment_id], () =>
    paymentResponse(data, payment_id)
  );
  const paymentItems = payments?.data;
  console.log("Payments:", paymentItems);

  if (isLoading) {
    return (
      <div className="min-h-[100vh] bg-[#F7F6F2]">
        <Header uid={unique_payment_identifier} />
        <div className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex justify-center items-center">
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100vh] bg-[#F7F6F2]">
        <Header uid={unique_payment_identifier} />
        <div className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex justify-center items-center">
            <div>Error loading payment details.</div>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = paymentItems?.payment.contracts
    .flatMap((contract) => contract.invoices)
    .reduce((sum, invoice) => sum + parseFloat(invoice.invoice_amount), 0);

  const totalDiscount = paymentItems?.payment.contracts
    .flatMap((contract) => contract.invoices)
    .reduce(
      (sum, invoice) => sum + (parseFloat(invoice.discount_value) || 0),
      0
    );

  const contractsList = paymentItems?.payment.contracts.map((contract) => {
    return <ContractCard key={contract.id} contract={contract} />;
  });

  function handlePrint() {
    window.print();
  }

  function handleBack() {
    navigate(-1);
  }

  return (
    <div className="min-h-[100vh] bg-[#F7F6F2]">
      <Header uid={unique_payment_identifier} />
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <div className="flex flex-row py-3 justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Receipt #{paymentItems && paymentItems.payment.id}
            </h1>
          </div>

          {/* Tenant Details */}
          <div className="m-1 space-y-4">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Card
                sx={{
                  minWidth: 275,
                  width: "100%",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
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
                    {paymentItems && paymentItems.payment.tenant_name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <div className="flex flex-row py-3 justify-between items-center">
              <h1 className="font-bold text-3xl tracking-tight text-gray-900">
                Items
              </h1>
            </div>

            {paymentItems && (
              <Box
                sx={{
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                {contractsList}
              </Box>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between mb-10">
          <div className="m-2">
            <Box>
              <Card variant="solid">
                <CardContent>
                  <Stack direction="column" spacing={2} sx={{ px: 3 }}>
                    {/* <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        Result
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        {paymentItems.payment_status.toUpperCase()}
                      </Typography>
                    </Stack> */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7" style={{ fontWeight: "bold" }}>
                        Payment Status
                      </Typography>
                      <Typography
                        variant="h7"
                        style={{
                          fontWeight: "bold",
                          color:
                            paymentItems.payment.payment_status.toLowerCase() !==
                            "captured"
                              ? "red"
                              : "green",
                        }}
                      >
                        {paymentItems.payment.payment_status
                          .charAt(0)
                          .toUpperCase() +
                          paymentItems.payment.payment_status.slice(1)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Payment Method</Typography>
                      <Typography variant="h7">
                        {paymentItems.payment.payment_method}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Date & Time</Typography>
                      <Box
                        component="div"
                        variant="h7"
                        sx={{ overflow: "auto" }}
                      >
                        {changeDateTimeFormat(
                          paymentItems.payment.payment_date
                        )}
                      </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Total Amount</Typography>
                      <Typography variant="h7">
                        KD {changeAmountFormat(totalAmount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Discount</Typography>
                      <Typography variant="h7">
                        KD {changeAmountFormat(totalDiscount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7" style={{ fontWeight: "bold" }}>
                        Paid Amount
                      </Typography>
                      <Typography variant="h7" style={{ fontWeight: "bold" }}>
                        KD{" "}
                        {changeAmountFormat(
                          paymentItems.payment.payment_amount
                        )}
                      </Typography>
                    </Stack>

                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Payment No</Typography>
                      <Typography variant="h7">
                        {paymentItems.payment.id}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Reference Token</Typography>
                      <Box
                        component="div"
                        variant="h7"
                        sx={{ overflow: "auto" }}
                      >
                        {paymentItems.payment.reference_token}
                      </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Payment ID</Typography>
                      <Box
                        component="div"
                        variant="h7"
                        sx={{ overflow: "auto" }}
                      >
                        {paymentItems.payment.reference_id}
                      </Box>
                    </Stack>

                    {/* <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Authorization ID</Typography>
                      <Typography variant="h7">
                        {paymentItems.authorization_id}
                      </Typography>
                    </Stack> */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Transaction ID</Typography>
                      <Box
                        component="div"
                        variant="h7"
                        sx={{ overflow: "auto" }}
                      >
                        {paymentItems.payment.transaction_id}
                      </Box>
                    </Stack>
                    {/* <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Bank Reference</Typography>
                      <Typography variant="h7">
                        {paymentItems.bank_reference}
                      </Typography>
                    </Stack> */}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between mb-10">
          <Box sx={{ displayPrint: "none" }}>
            <Card
              variant="plain"
              sx={{
                bgcolor: "initial",
              }}
            >
              <CardContent>
                <Stack direction="column" spacing={2} sx={{ px: 3 }}>
                  <Stack direction="row" justifyContent="center" spacing={3}>
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      startDecorator={<ArrowBackIcon />}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="solid"
                      startDecorator={<PrintIcon />}
                    >
                      Print
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
