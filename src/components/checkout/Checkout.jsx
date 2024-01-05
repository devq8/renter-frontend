import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../../utils/api/invoices";
import contractApi from "../../utils/api/contracts";
import paymentApi from "../../utils/api/payment";
import CheckoutItem from "./CheckoutItem";
import KNetLogo from "../../assets/images/knet.png";
import NavBar from "../navbar/Navbar";
import Footer from "../home/components/Footer";
// import { BsCreditCard2Back } from "react-icons/bs";
// import VISALogo from "../../assets/images/visa.png";
// import MasterCardLogo from "../../assets/images/mastercard.png";
// import { BsFillBuildingFill, BsFillPersonFill } from "react-icons/bs";
import { useFormik } from "formik";
import * as Yup from "yup";

function Checkout() {
  const { id: contractId } = useParams(); // Get contract id from url

  const [selectedInvoices, setSelectedInvoices] = useState({}); // This is to catch the selected invoices
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking form submission

  const fetchContractDetails = async () => {
    return contractApi.getContractDetails(contractId);
  };
  const fetchInvoices = async () => {
    return invoiceApi.getInvoices(contractId, "unpaid");
  };
  // Retreive contract details
  const { data: contract, isLoading: isContractLoading } = useQuery(
    ["contract", contractId],
    fetchContractDetails
  );
  const contractDetails = contract?.data;

  // Retreive invoices
  const { data: invoices, isLoading: isInvoicesLoading } = useQuery(
    ["invoices", contractId],
    fetchInvoices
  );
  const invoicesArray = invoices?.data;

  // This state to populate all invoices from backend into selectedInvoices (all invoices will be selected by default)
  // This will be run only one time when the page loads.
  useEffect(() => {
    if (Array.isArray(invoicesArray) && invoicesArray.length > 0) {
      const initialSelectedInvoices = invoicesArray.reduce((acc, invoice) => {
        acc[invoice.id] = true; // Set all invoices as selected initially
        return acc;
      }, {});
      setSelectedInvoices(initialSelectedInvoices);
    }
  }, [invoicesArray]);

  // Calculate the total amount of seleceted invoices
  const totalAmount = useMemo(() => {
    return invoicesArray?.reduce((total, invoice) => {
      return selectedInvoices[invoice.id]
        ? total + parseFloat(invoice.invoice_amount)
        : total;
    }, 0);
  }, [invoicesArray, selectedInvoices]);

  function redirectToPaymentLink(link) {
    window.location.href = link;
  }

  // This invoices list will be used to show the invoices items in the checkout page
  const invoicesList = invoices?.data?.map((invoice) => {
    return (
      <CheckoutItem
        key={invoice.id}
        id={invoice.id}
        date={invoice.invoice_date}
        title={invoice.invoice_title}
        type={invoice.get_invoice_type_display}
        start={invoice.from_date}
        end={invoice.to_date}
        amount={invoice.invoice_amount}
        status={invoice.get_invoice_status_display}
        isChecked={
          !invoice.contract.flexible
            ? true
            : selectedInvoices[invoice.id]?.selected
        }
        disabled={!invoice.contract.flexible}
        onSelectionChange={() => handleCheckboxChange(invoice.id)}
      />
    );
  });

  // Handle checkbox changes
  const handleCheckboxChange = (invoiceId) => {
    setSelectedInvoices((prevSelectedInvoices) => ({
      ...prevSelectedInvoices,
      [invoiceId]: !prevSelectedInvoices[invoiceId],
    }));
  };

  const formik = useFormik({
    initialValues: {
      amount: totalAmount ? totalAmount.toString() : "0",
      paymentType: 1, // Knet = 1, Credit Card = 2
      orderReferenceNumber: "",
      variable1: `ContractID__${contractDetails?.id}`,
      variable2: `Tenant__${contractDetails?.tenant.user.id}`,
      variable3: `Building__${contractDetails?.unit.property_fk.id}`,
      variable4: "",
      variable5: "",
      invoices: Object.entries(selectedInvoices)
        .filter(([id, isSelected]) => isSelected)
        .map(([id]) => id),
    },
    enableReinitialize: true,
    // validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      setIsSubmitting(true); // Set isSubmitting to true when submission starts

      const paymentData = {
        ...values,
        // Ensure invoices are sent as an array of selected invoice IDs
        invoices: Object.entries(selectedInvoices)
          .filter(([id, isSelected]) => isSelected)
          .map(([id]) => id),
      };

      try {
        // Make the API call to submit the payment data
        const response = await paymentApi.sendPayment(paymentData);
        console.log("Payment response:", response);

        // Redirect to the payment link, if provided in the response
        if (response.data && response.data.payment_url) {
          redirectToPaymentLink(response.data.payment_url);
        } else {
          // Handle case where the payment URL is not provided
          console.error("Payment URL not provided in response");
        }
      } catch (error) {
        console.error("Error sending payment:", error);
        setIsSubmitting(false); // Set isSubmitting to false when submission on failure
      }
    },
  });

  return (
    <div className="min-h-[100vh] bg-[#F7F6F2] lg:pt-4">
      <NavBar />
      <form onSubmit={formik.handleSubmit}>
        <header className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
            <Breadcrumb
              main={{ title: "Contracts", url: "/contracts" }}
              sub={[
                {
                  title: `Contract No. ${contractId}`,
                  url: `/contracts/${contractId}`,
                },
                { title: `Checkout`, url: "" },
              ]}
            />
            <div className="flex flex-row py-3 justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Checkout
              </h1>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Contract Details
            </h1>
            {/* Contract Details */}
            <div className="flex-col max-w-md">
              {contractDetails && (
                <div className="flex-col mx-3">
                  <div className="flex items-center justify-between">
                    <h2>Contract ID:</h2>
                    <h2 className="font-bold"> {contractDetails.id}</h2>
                  </div>
                  {contractDetails.unit && (
                    <>
                      <div className="flex items-center justify-between">
                        <h2>Property:</h2>
                        <h2 className="font-bold">
                          {contractDetails.unit.property_fk.name}
                        </h2>
                      </div>
                      <div className="flex items-center justify-between">
                        <h2>Area:</h2>
                        <h2 className="font-bold">
                          {contractDetails.unit.property_fk.area}
                        </h2>
                      </div>
                      <div className="flex items-center justify-between">
                        <h2>Unit:</h2>
                        <h2 className="font-bold">
                          {contractDetails.unit.number}
                        </h2>
                      </div>
                      <div className="flex items-center justify-between">
                        <h2>Tenant:</h2>
                        <h2 className="font-bold">
                          {contractDetails.tenant.user.first_name}{" "}
                          {contractDetails.tenant.user.last_name}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-row pt-3 justify-between items-center">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Items
              </h1>
            </div>
            {/* Items Section Below */}
            <div className="flex flex-col justify-center items-center">
              <div className="flex-row justify-between w-full  items-center rounded-md my-5">
                <ul className="flex-col space-y-3 w-full gap-6 ">
                  {invoicesList?.length < 1 ? <h1>No Items</h1> : invoicesList}
                </ul>
              </div>
            </div>
            <div className="flex flex-row pt-3 justify-between items-center">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-3">
                Choose Payment Method
              </h1>
            </div>
            <div className="flex space-x-2 mb-3 max-w-md">
              <button
                type="button"
                className="flex items-center justify-center border border-gray-500 rounded-md w-full p-3 focus:ring-2"
                //   onClick={handlePaymentMethod}
                name="Knet"
              >
                <img src={KNetLogo} className={`w-10 mx-2`} />
              </button>
              {/* <button
              disabled
              className="flex flex-col items-center justify-center border border-gray-500 rounded-md w-full p-3 focus:ring-2"
              onClick={handlePaymentMethod}
              name="CreditCard"
            >
              <div className="flex items-center justify-center">
                <img
                  src={VISALogo}
                  className={`w-10 mx-2 ${
                    selectedPaymentMethod === "Knet" && "grayscale"
                  }`}
                />
                <img
                  src={MasterCardLogo}
                  className={`w-10 mx-2 ${
                    selectedPaymentMethod === "Knet" && "grayscale"
                  }`}
                />
              </div>
            </button> */}
            </div>
          </div>
        </header>
        {/* Invoice Summary Fixed Buttom Section */}

        {/* <footer className="bg-gray-900 text-white p-4 fixed bottom-0 left-0 right-0 z-50"> */}

        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between space-y-3 my-5">
          <div className="flex justify-between items-center">
            <h3>Subtotal</h3>
            <h3>KD {totalAmount}</h3>
          </div>
          <div className="flex justify-between items-center">
            <h3>Fees</h3>
            <h3>KD 0.000</h3>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Total</h1>
            <h1 className="text-xl font-bold">KD {totalAmount}</h1>
          </div>
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
                <span>Pay Now!</span>
              )}
            </button>
          </div>
        </div>

        {/* </footer> */}
      </form>
      <Footer />
    </div>
  );
}

export default Checkout;
