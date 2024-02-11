import React, { useEffect, useState, useMemo } from "react";
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

// import { BsCreditCard2Back } from "react-icons/bs";
// import VISALogo from "../../assets/images/visa.png";
// import MasterCardLogo from "../../assets/images/mastercard.png";
// import { BsFillBuildingFill, BsFillPersonFill } from "react-icons/bs";

function Checkout() {
  const { unique_payment_identifier } = useParams(); // Get unique_payment_identifier from url
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking form submission
  const [totalAmount, setTotalAmount] = useState(0); // New state for tracking total amount
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Retreive Checkout Items details from backend
  const { data: checkoutItems, isLoading: isCheckoutItemsLoading } = useQuery(
    ["CheckoutItems", unique_payment_identifier],
    () => getCheckoutDetails(unique_payment_identifier)
  );

  // On mount, select all invoices and calculate the initial total amount
  useEffect(() => {
    if (!checkoutItems) return; // Return if checkoutItems is not available

    const allInvoicesIds = checkoutItems?.data.flatMap((contract) =>
      contract.pending_invoices.map((invoice) => invoice.id)
    );
    setSelectedInvoices(allInvoicesIds);

    const initialTotal = checkoutItems?.data.reduce(
      (accumulator, contract) =>
        accumulator +
        contract.pending_invoices.reduce(
          (sum, invoice) => sum + Number(invoice.invoice_amount),
          0
        ),
      0
    );
    setTotalAmount(initialTotal);
  }, [checkoutItems]);

  // On every change in selectedInvoices, recalculate the total amount
  useEffect(() => {
    if (!checkoutItems) return; // Return if checkoutItems is not available

    // Calculate the new total amount based on the selected invoices
    const newTotal = checkoutItems?.data.reduce(
      (accumulator, contract) =>
        accumulator +
        contract.pending_invoices
          .filter((invoice) => selectedInvoices.includes(invoice.id))
          .reduce((sum, invoice) => sum + Number(invoice.invoice_amount), 0),
      0
    );

    setTotalAmount(newTotal);
  }, [selectedInvoices, checkoutItems]);

  // Handle checkbox changes
  const handleCheckboxChange = (invoiceId, isChecked) => {
    setSelectedInvoices((prev) =>
      isChecked ? [...prev, invoiceId] : prev.filter((id) => id !== invoiceId)
    );
  };

  // Below variable to show Contract Card and under each Contract Card, show Invoice Card embedded
  const contractsList = checkoutItems?.data?.map((contract) => {
    // Show Contract Card only if there are pending invoices
    if (contract.pending_invoices.length > 0) {
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
      variable2: `Tenant__#${checkoutItems?.data[0]?.tenant.user.id}-${checkoutItems?.data[0]?.tenant.user.first_name}_${checkoutItems?.data[0]?.tenant.user.last_name}`,
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
        variable1: `ContractIDs__${checkoutItems?.data
          .map((contract) => `#${contract.id}`)
          .join("_")}`,
        variable3: `Building__${checkoutItems?.data
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
    <div className="min-h-[100vh] bg-[#F7F6F2] lg:pt-4">
      {/* <NavBar /> */}
      <form onSubmit={formik.handleSubmit}>
        <header className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
            <div className="flex flex-row py-3 justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Checkout
              </h1>
            </div>

            {/* Tenant Details */}
            <div className="m-3 space-y-4">
              <Card
                sx={{
                  minWidth: 275,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  ></Typography>
                  <Typography variant="h5" component="div">
                    {checkoutItems?.data[0]?.tenant.user.first_name}{" "}
                    {checkoutItems?.data[0]?.tenant.user.last_name}
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex-col pt-3 justify-between items-center">
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
                        KD {changeAmountFormat(totalAmount)}
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
              disabled={totalAmount <= 0 || isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  Redirecting...
                  {/* Optional: Add a loader icon here */}
                </span>
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
        </div>
      </form>
    </div>
  );
}

export default Checkout;
