import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { sendPayment, getCheckoutDetails } from "../../utils/api/payment";
import { changeAmountFormat } from "../../utils/format";
import KNetLogo from "../../assets/images/knet.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ContractCard from "./ContractCard";
import Stack from "@mui/material/Stack";
import { useFormik } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { Divider } from "@mui/material";
import { Header } from "../navbar/Header";
import Person from "@mui/icons-material/Person";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";

function Checkout() {
  const { unique_payment_identifier } = useParams(); // Get unique_payment_identifier from url
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking form submission
  const [totalAmount, setTotalAmount] = useState(0); // New state for tracking total amount
  const [subTotalAmount, setSubTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Retreive Checkout Items details from backend
  const { data: checkoutItems, isLoading: isCheckoutItemsLoading } = useQuery(
    ["CheckoutItems", unique_payment_identifier],
    () => getCheckoutDetails(unique_payment_identifier)
  );

  console.log("Checkout items : ", checkoutItems?.data?.contracts);

  const totalOutstandingAmount = checkoutItems?.data?.contracts?.reduce(
    (acc, contract) => acc + contract.total_pending_amount,
    0
  );

  // On mount, select all invoices and calculate the initial total amount
  useEffect(() => {
    if (!checkoutItems) return; // Return if checkoutItems is not available

    // Select all invoices by default
    const allInvoicesIds = checkoutItems?.data?.contracts.flatMap((contract) =>
      contract.invoices.map((invoice) => invoice.id)
    );
    setSelectedInvoices(allInvoicesIds);

    // Calculate the initial total amount
    let initialSubTotal = 0;
    let initialDiscount = 0;

    checkoutItems?.data?.contracts.forEach((contract) => {
      contract.invoices.forEach((invoice) => {
        initialSubTotal += Number(invoice.invoice_amount);
        initialDiscount += Number(invoice.discount_value || 0);
      });
    });

    setSubTotalAmount(initialSubTotal);
    setTotalDiscount(initialDiscount);
    setTotalAmount(initialSubTotal - initialDiscount);
  }, [checkoutItems]);

  // On every change in selectedInvoices, recalculate the total amount
  useEffect(() => {
    if (!checkoutItems) return; // Return if checkoutItems is not available

    // Calculate the new total amount based on the selected invoices
    let subTotalAmount = 0;
    let totalDiscount = 0;

    checkoutItems?.data?.contracts.forEach((contract) => {
      contract.invoices.forEach((invoice) => {
        if (selectedInvoices.includes(invoice.id)) {
          subTotalAmount += Number(invoice.invoice_amount);
          totalDiscount += Number(invoice.discount_value || 0);
        }
      });
    });

    setSubTotalAmount(subTotalAmount);
    setTotalDiscount(totalDiscount);
    setTotalAmount(subTotalAmount - totalDiscount);
  }, [selectedInvoices, checkoutItems]);

  // Handle checkbox changes
  const handleCheckboxChange = (invoiceId, isChecked) => {
    setSelectedInvoices((prev) =>
      isChecked ? [...prev, invoiceId] : prev.filter((id) => id !== invoiceId)
    );
  };

  // Below variable to show Contract Card and under each Contract Card, show Invoice Card embedded
  const contractsList = checkoutItems?.data?.contracts.map((contract) => {
    // Show Contract Card only if there are pending invoices
    if (contract.total_pending_amount > 0) {
      return (
        <ContractCard
          key={contract.id}
          contract={contract}
          handleCheckboxChange={handleCheckboxChange}
          selectedInvoices={selectedInvoices}
        />
      );
    }
  });

  const formik = useFormik({
    initialValues: {
      amount: totalAmount ? parseFloat(totalAmount.toString()).toFixed(3) : "0",
      paymentType: 1, // Knet = 1, Credit Card = 2
      orderReferenceNumber: "",
      variable1: "",
      variable2: `Tenant__#${checkoutItems?.data?.tenant.user.id}-${checkoutItems?.data?.tenant.user.english_name}`,
      variable3: "",
      variable4: "",
      variable5: "",
      invoices: selectedInvoices,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number().moreThan(0, "Amount must be greater than KD 0"),
      invoices: Yup.array()
        .of(Yup.number())
        .min(1, "Select at least one invoice"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true); // Set isSubmitting to true when submission starts

      const updatedValues = {
        ...values,
        invoices: selectedInvoices,
        variable1: `ContractIDs__${checkoutItems?.data?.contracts
          .map((contract) => `#${contract.id}`)
          .join("_")}`,
        variable3: `Building__${checkoutItems?.data?.contracts
          .map((contract) =>
            contract.unit.property_fk.name.replace(/\s+/g, "_")
          )
          .join("_")}`,
      };

      try {
        // Make the API call to submit the payment data
        const response = await sendPayment(updatedValues);

        // Redirect to the payment link, if provided in the response
        if (response.data && response.data.payment_url) {
          redirectToPaymentLink(response.data.payment_url);
        } else {
          // Handle case where the payment URL is not provided
          console.error("Payment URL not provided in response");
        }
      } catch (error) {
        console.error("Error sending payment:", error);
        toast.error("Please try again later.");
        setIsSubmitting(false); // Set isSubmitting to false when submission on failure
      }
    },
  });

  function redirectToPaymentLink(link) {
    window.location.href = link;
  }

  return (
    <div className="min-h-[100vh] bg-[#F7F6F2]">
      <Header uid={unique_payment_identifier} />

      <form onSubmit={formik.handleSubmit}>
        <header className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
            <div className="flex flex-row py-3 justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Checkout
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
                    {checkoutItems?.data?.tenant.user.english_name}
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex-col pt-3 justify-between items-center">
              {totalOutstandingAmount == 0 ? (
                <Alert
                  sx={{ mb: 2 }}
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  No invoices to pay
                </Alert>
              ) : (
                <>
                  <Alert
                    sx={{ mb: 2 }}
                    icon={<CheckIcon fontSize="inherit" />}
                    severity="success"
                  >
                    Please select the invoices you want to pay
                  </Alert>

                  <h1 className="text-xl font-bold tracking-tight text-gray-900">
                    Contracts
                  </h1>
                </>
              )}
            </div>
            {/* Contract Card */}
            <div className="m-3 space-y-4">{contractsList}</div>
          </div>
        </header>
        {/* Invoice Summary Fixed Buttom Section */}
        <Divider variant="middle" />
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8 flex flex-col justify-between">
          <div className="flex-col py-2 justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 text-center">
              Payment Summary
            </h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
          <div className="m-2">
            <Box>
              <Card variant="solid">
                <CardContent>
                  <Stack direction="column" spacing={2} sx={{ px: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Subtotal</Typography>
                      <Typography variant="h7">
                        KD {changeAmountFormat(subTotalAmount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Discount</Typography>
                      <Typography variant="h7">
                        KD {changeAmountFormat(totalDiscount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h7">Fees</Typography>
                      <Typography variant="h7">KD 0.000</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        Total
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        KD {changeAmountFormat(totalAmount)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </div>
        </div>
        {/* Payment Button */}
        <div className="mx-auto max-w-sm px-6 sm:px-6 lg:px-8 flex flex-col justify-between space-y-3 my-5">
          <div className="flex justify-center items-center mx-auto w-full">
            <button
              type="submit"
              className={`rounded-md px-7 py-3 w-full text-xl font-extrabold transition duration-200 
            ${
              totalAmount > 0
                ? "bg-primary hover:bg-[52555C] hover:opacity-80 active:bg-[52555C] text-white"
                : "bg-gray-400 text-gray-500 cursor-not-allowed"
            }`}
              disabled={
                totalAmount <= 0 ||
                isSubmitting ||
                totalOutstandingAmount == 0 ||
                checkoutItems?.status != 200
              }
            >
              {isSubmitting ? (
                <span>Redirecting...</span>
              ) : (
                <div className="flex items-center justify-center space-x-5">
                  <img src={KNetLogo} className={`w-10`} />
                  <span>Pay Now!</span>
                </div>
              )}
            </button>
            {formik.touched.invoices && formik.errors.invoices ? (
              <div className="error">{formik.errors.invoices}</div>
            ) : null}
          </div>
          {/* <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button startDecorator={<CircularProgress variant="solid" />}>
              Loading…
            </Button>
          </Box> */}
        </div>
      </form>
    </div>
  );
}

export default Checkout;
