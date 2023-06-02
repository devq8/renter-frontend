import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api/payment";
import { useQuery } from "@tanstack/react-query";
import Success from "../../assets/images/success.png";
import Error from "../../assets/images/error.png";
import format from "../../utils/format";
import Spinner from "../../utils/Spinner";

function Status() {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get("data");
    setApiData(dataParam);
  }, []);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery(["payment", apiData], () => api.paymentResponse(apiData));

  const paymentInfo = response?.data;

  function handleReturnHome() {
    navigate(`/dashboard`);
  }
  return (
    <div className="flex-col">
      {isLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <header className="bg-transparent">
            <div className="mx-20 my-10 flex-col items-center justify-center">
              <div className="flex items-center justify-center h-[20vh] my-20 mx-4">
                {paymentInfo?.status ? (
                  <img
                    src={Success}
                    alt="Success Image"
                    className="object-fill"
                  />
                ) : (
                  <img src={Error} alt="Error Image" className="object-fill" />
                )}
              </div>
              <div className="flex flex-row my-8 justify-center items-center">
                {paymentInfo?.status ? (
                  <h1 className="text-3xl text-successGreen text-center font-bold tracking-tight text-gray-900">
                    {paymentInfo?.message}
                  </h1>
                ) : (
                  <h1 className="text-3xl text-center font-bold tracking-tight text-gray-900">
                    {paymentInfo?.message}
                  </h1>
                )}
              </div>
            </div>
          </header>
          {paymentInfo?.status ? (
            <div className="flex-col justify-center items-center space-y-3 max-w-992 mx-auto">
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Result</h2>
                <h2 className="font-bold">
                  {paymentInfo?.response.resultCode}
                </h2>
              </div>
              {/* Below information to be dynamic */}
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Contract No.</h2>
                <h2>{paymentInfo?.response.variable1?.split("__")[1]}</h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Tenant Name</h2>
                <h2>{paymentInfo?.response.variable2?.split("__")[1]}</h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Building Name</h2>
                <h2>{paymentInfo?.response.variable3?.split("__")[1]}</h2>
              </div>
              <hr className="border my-4 mx-7" />
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Payment Method</h2>
                {paymentInfo?.response.method == 1 ? (
                  <h2>KNet</h2>
                ) : (
                  <h2>CreditCard</h2>
                )}
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Date & Time</h2>
                <h2>{paymentInfo?.response.paidOn}</h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Paid Amount</h2>
                <h2>
                  KD {format.changeAmountFormat(paymentInfo?.response.amount)}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Admin Charges</h2>
                <h2>
                  KD{" "}
                  {format.changeAmountFormat(
                    paymentInfo?.response.administrativeCharge
                  )}
                </h2>
              </div>
              <hr className="border my-4 mx-7" />
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Token</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.paymentToken}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Payment ID</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.paymentId}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Order No.</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.orderReferenceNumber}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Authorization ID</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.auth}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Transaction ID</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.transactionId}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Track ID</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.trackID}
                </h2>
              </div>
              <div className="flex mx-8 justify-between">
                <h2 className="font-bold pe-2">Bank Reference</h2>
                <h2 className="truncate line-clamp-2">
                  {paymentInfo?.response.bankReferenceId}
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center m-4">
              <h1 className="text-errorRed">
                We aren't able to process your payment. Please try again.
              </h1>
            </div>
          )}
          <div className="mx-auto max-w-768 px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between space-y-3 my-5">
            <div className="flex justify-center items-center mx-auto w-full">
              {paymentInfo?.status ? (
                <button
                  className="rounded-md bg-primary px-7 py-3 w-full text-xl font-extrabold text-white transition duration-200 hover:bg-[52555C] hover:opacity-80 active:bg-[52555C]"
                  // onClick={handleReturnHome}
                >
                  Print
                </button>
              ) : (
                <button
                  className="rounded-md border border-primary hover:bg-primary bg-transparent px-7 py-3 w-full text-xl font-extrabold text-primary hover:text-white transition duration-200 hover:bg-[52555C] hover:opacity-80 active:bg-[52555C]"
                  // onClick={handleReturnHome}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Status;
