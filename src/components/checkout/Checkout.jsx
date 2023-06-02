import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import Breadcrumb from "../../utils/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../../utils/api/invoices";
import contractApi from "../../utils/api/contracts";
import paymentApi from "../../utils/api/payment";
import CheckoutItem from "./CheckoutItem";
import KNetLogo from "../../assets/images/knet.png";
// import { BsCreditCard2Back } from "react-icons/bs";
// import VISALogo from "../../assets/images/visa.png";
// import MasterCardLogo from "../../assets/images/mastercard.png";
// import { BsFillBuildingFill, BsFillPersonFill } from "react-icons/bs";

function Checkout() {
  const { id: contractId } = useParams();
  const [total, setTotal] = useState(parseFloat(0));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Knet");
  const [isSubmitting, setIsSubmitting] = useState(false); // Redirecting spinner loading
  const [paymentInfo, setPaymentInfo] = useState({
    amount: "0",
    paymentType: 1,
    orderReferenceNumber: "",
    variable1: "",
    variable2: "",
    variable3: "",
    variable4: "",
    variable5: "",
    invoices: [],
  });
  const {
    data: contract,
    isLoading,
    error,
  } = useQuery(
    ["contract", contractId],
    () => contractApi.getContractDetails(contractId),
    {
      onSuccess: (contract) => {
        setPaymentInfo((prevPaymentInfo) => ({
          ...prevPaymentInfo,
          variable1: `ContractID__${contract?.data?.id}`,
          variable2: `Tenant__${contract?.data?.tenant.user.id}`,
          variable3: `Building__${contract?.data?.unit.property_fk.id}`,
        }));
      },
    }
  );

  //   const {
  //     data: paymentLink,
  //     LinkIsLoading,
  //     LinkError,
  //   } = useQuery(["paymentLink"], () => paymentApi.sendPayment(), {
  //     onSuccess: (link) => {
  //       window.location.href = link;
  //     },
  //   });

  //   console.log(paymentLink);

  const contractDetails = contract?.data;

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useQuery(
    ["invoices", contractId],
    () => invoiceApi.getInvoices(contractId),
    {
      onSuccess: (invoices) => {
        const totalAmount = invoices?.data
          ?.filter((invoice) => {
            if (invoice.invoice_status.toLowerCase() !== "paid") {
              return invoice;
            }
          })
          .reduce((total, invoice) => {
            return parseFloat(total) + parseFloat(invoice.invoice_amount);
          }, parseFloat(0));
        setTotal(totalAmount);
        const invoiceNumbers =
          invoices?.data
            ?.filter((invoice) => {
              if (invoice.invoice_status.toLowerCase() !== "paid") {
                return invoice;
              }
            })
            .map((invoice) => invoice.id) || [];
        setPaymentInfo((prevPaymentInfo) => ({
          ...prevPaymentInfo,
          amount: totalAmount,
          paymentType: 1,
          invoices: invoiceNumbers,
        }));
      },
    }
  );

  function changeAmountFormat(amount) {
    if (amount === null || amount === 0 || amount === "0") {
      const zeroWithDecimals = Number.parseFloat(0).toFixed(3);
      return zeroWithDecimals;
    } else {
      const amountFloat = parseFloat(amount);
      const amountDecimal = amountFloat.toFixed(3);
      const amountSeparator = amountDecimal
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      return amountSeparator;
    }
  }

  function handlePaymentMethod(e) {
    if (e.target.name === "Knet") {
      setSelectedPaymentMethod("Knet");
    } else if (e.target.name === "CreditCard") {
      setSelectedPaymentMethod("CreditCard");
    }
  }

  function redirectToPaymentLink(link) {
    window.location.href = link;
  }

  useEffect(() => {
    console.log("Im in useEffect");

    // setPaymentInfo((prevPaymentInfo) => ({
    //   ...prevPaymentInfo,
    //   amount: total,
    //   paymentType: paymentType,
    //   variable1: `ContractID__${contractDetails?.id}`,
    //   variable2: `Tenant__${contractDetails?.tenant.user.first_name} ${contractDetails?.tenant.user.last_name}`,
    //   variable3: `Building__${contractDetails?.unit.property_fk.name}`,
    // }));

    const handlePaymentSubmission = async () => {
      console.log(`I'm in handlePaymentSubmission function in useEffect`);
      console.log(`Redirecting to PG`);
      try {
        const link = await paymentApi.sendPayment(paymentInfo);
        console.log("Payment Link\n");
        console.log(link);
        redirectToPaymentLink(link.data.payment_url);
      } catch (error) {
        console.error("Error sending payment:", error);
      }
    };
    if (isSubmitting == true) {
      console.log(`isSubmitting is true`);
      handlePaymentSubmission();
    } else {
      console.log(`isSubmitting is false`);
    }
  }, [isSubmitting]);

  async function handleSubmit() {
    // setIsSubmitting(true);

    const paymentType = selectedPaymentMethod === "Knet" ? 1 : 2;

    // setPaymentInfo((prevPaymentInfo) => ({
    //   ...prevPaymentInfo,
    //   amount: total,
    //   paymentType: paymentType,
    //   variable1: `ContractID__${contractDetails?.id}`,
    //   variable2: `Tenant__${contractDetails?.tenant.user.first_name} ${contractDetails?.tenant.user.last_name}`,
    //   variable3: `Building__${contractDetails?.unit.property_fk.name}`,
    // }));

    // try {
    //   const link = await paymentApi.sendPayment(paymentInfo);
    //   redirectToPaymentLink(link);
    // } catch (error) {
    //   console.error("Error sending payment:", error);
    // } finally {
    //   setIsSubmitting(false); // Stop the loading spinner
    // }
  }

  const invoicesList = invoices?.data
    ?.filter((invoice) => {
      if (invoice.invoice_status.toLowerCase() !== "paid") {
        return invoice;
      }
    })
    .map((invoice) => {
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
        />
      );
    });

  return (
    <div>
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
              className="flex items-center justify-center border border-gray-500 rounded-md w-full p-3 focus:ring-2"
              //   onClick={handlePaymentMethod}
              name="Knet"
            >
              <img
                src={KNetLogo}
                className={`w-10 mx-2 ${
                  selectedPaymentMethod === "CreditCard" && "grayscale"
                }`}
              />
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
          <h3>KD {changeAmountFormat(total)}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Fees</h3>
          <h3>KD 0.000</h3>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Total</h1>
          <h1 className="text-xl font-bold">KD {changeAmountFormat(total)}</h1>
        </div>
        <div className="flex justify-center items-center mx-auto w-full">
          {isSubmitting ? (
            <button
              className="rounded-md bg-primary px-7 py-3 w-full text-xl font-extrabold text-white transition duration-200 hover:bg-[52555C] hover:opacity-80 active:bg-[52555C]"
              //   disabled
              onClick={() => setIsSubmitting(!isSubmitting)}
            >
              <span>
                <svg
                  aria-hidden="true"
                  className="inline w-6 h-6 mx-4 text-gray-200 animate-spin dark:text-gray-600 fill-secondary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                Redirecting ...
              </span>
            </button>
          ) : (
            <button
              className="rounded-md bg-primary px-7 py-3 w-full text-xl font-extrabold text-white transition duration-200 hover:bg-[52555C] hover:opacity-80 active:bg-[52555C]"
              onClick={() => setIsSubmitting(!isSubmitting)}
              //   disabled={paymentInfo.amount === 0}
            >
              <span>Pay Now</span>
            </button>
          )}

          {/* <button
            className="rounded-md bg-primary px-7 py-3 w-full text-xl font-extrabold text-white transition duration-200 hover:bg-[52555C] hover:opacity-80 active:bg-[52555C]"
            onClick={handleSubmit}
          >
            Pay Now
          </button> */}
        </div>
      </div>

      {/* </footer> */}
    </div>
  );
}

export default Checkout;
