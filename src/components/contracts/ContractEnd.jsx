import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import Button from "@mui/joy/Button";
import { CustomStepper } from "../../utils/Stepper";
import Breadcrumb from "../../utils/Breadcrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getContractDetails, endContract } from "../../utils/api/contracts";
import ContractDetails from "./EndContractSteps/ContractDetails";
import MeterReadings from "./EndContractSteps/MeterReadings";
import OutstandingInvoices from "./EndContractSteps/OutstandingInvoices";
import UploadDocuments from "./EndContractSteps/UploadDocuments";
import TenantNotifications from "./EndContractSteps/TenantNotifications";
import FinalConfirmation from "./EndContractSteps/FinalConfirmation";
import { getInvoices } from "../../utils/api/invoices";
import { set } from "date-fns";
import { toast } from "react-toastify";

function ContractEnd() {
  const { id: contractId } = useParams();
  const queryClient = useQueryClient();

  //   Outstanding Invoices State
  const [cancelInvoices, setCancelInvoices] = useState(false);

  //   Submitting the form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Documents States
  //   const [evacuatedUnitFile, setEvacuatedUnitFile] = useState(null);
  //   const [mewClearanceFile, setMewClearanceFile] = useState(null);
  //   const [uploading, setUploading] = useState(false);

  //   Send Notification to Tenant
  const [sendNotification, setSendNotification] = useState(false);

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { data: contract, isLoading } = useQuery(["contract", contractId], () =>
    getContractDetails(contractId)
  );

  const { data: invoices, isLoading: invoicesLoading } = useQuery(
    ["invoices", contractId],
    () =>
      getInvoices({ uid: null, contract_id: contractId, invoice_status: null })
  );

  const outstandingInvoices = invoices?.data.filter((invoice) => {
    if (
      invoice.invoice_status.toLowerCase() !== "paid" &&
      invoice.invoice_status.toLowerCase() !== "cancelled"
    ) {
      return invoice;
    }
  });

  const contractDetails = contract?.data;

  const endContractMutation = useMutation(
    (data) => endContract(contractDetails.id, data),
    {
      onSuccess: () => {
        setIsSubmitting(false);
        queryClient.invalidateQueries(["properties"]);
        toast.success("Contract Ended Successfully!");
        navigate(`/contracts/${contractId}`);
      },
      onError: (error) => {
        setIsSubmitting(false);
        let errorMessage = "";
        if (error.response && error.response.data) {
          errorMessage += `${
            error.response.data.detail || error.response.data.message
          }`;
        }

        console.log("Error: ", error);
        toast.error(errorMessage);
      },
    }
  );

  const steps = [
    {
      label: "Contract Details",
      component: contractDetails ? (
        <ContractDetails contract={contractDetails} />
      ) : (
        <CircularProgress />
      ),
    },
    {
      label: "Meter Readings",
      component: contractDetails ? (
        <MeterReadings contract={contractDetails} />
      ) : (
        <CircularProgress />
      ),
    },
    {
      label: "Outstanding Invoices",
      component: contractDetails ? (
        <OutstandingInvoices
          contract={contractDetails}
          outstandingInvoices={!invoicesLoading && outstandingInvoices}
          setCancelInvoices={setCancelInvoices}
          cancelInvoices={cancelInvoices}
        />
      ) : (
        <CircularProgress />
      ),
    },
    // {
    //   label: "Upload Documents",
    //   component: contractDetails ? (
    //     <UploadDocuments contract={contractDetails} />
    //   ) : (
    //     <CircularProgress />
    //   ),
    // },
    {
      label: "Tenant Notification",
      component: contractDetails ? (
        <TenantNotifications
          contract={contractDetails}
          setSendNotification={setSendNotification}
          sendNotification={sendNotification}
        />
      ) : (
        <CircularProgress />
      ),
    },
    {
      label: "Final Confirmation",
      component: contractDetails ? (
        <FinalConfirmation
          contract={contractDetails}
          cancelInvoices={cancelInvoices}
          outstandingInvoices={!invoicesLoading && outstandingInvoices}
          sendNotification={sendNotification}
        />
      ) : (
        <CircularProgress />
      ),
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const handleNext = () => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const endContractData = {
      contract_id: contractDetails.id,
      cancel_invoices: cancelInvoices,
      send_notification: sendNotification,
    };
    // const formData = new FormData();
    //     if (evacuatedUnitFile) formData.append("evacuated_unit", evacuatedUnitFile);
    //     if (mewClearanceFile) formData.append("mew_clearance", mewClearanceFile);
    //     formData.append("cancel_invoices", cancelInvoices);
    //     formData.append("send_notification", sendNotification);
    console.log("Submit endContractData:", endContractData);
    endContractMutation.mutate(endContractData);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
      <Breadcrumb
        main={{ title: "Contracts", url: "/contracts" }}
        sub={[
          {
            title: `Contract No. ${contractDetails?.id}`,
            url: `/contracts/${contractDetails?.id}`,
          },
          { title: `End Contract`, url: "" },
        ]}
      />
      <Box
        display="flex"
        height="130vh"
        // margin={20}
        // sx={{ backgroundColor: "green" }}
      >
        <Box width="25%" marginX={5} marginY={10}>
          <CustomStepper steps={steps} activeStep={activeStep} />
        </Box>
        <Box
          width="75%"
          padding="2rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box flexGrow={1}>{steps[activeStep].component}</Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ marginRight: 2 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                // variant="contained"
                color="danger"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                //  disabled={activeStep === steps.length - 1}
              >
                End Contract
              </Button>
            ) : (
              <Button
                // variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ContractEnd;
