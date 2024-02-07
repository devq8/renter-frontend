import React, { useState } from "react";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { getFileNameFromUrl } from "../../utils/format";
import AlertDialog from "../../utils/form/AlertDialog";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Button from "@mui/joy/Button";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiInvoices from "../../utils/api/invoices";

function AttachmentItem({ id, invoiceID, description, fileUrl, deleteIcon }) {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  console.log("ID is: ", id);

  const deleteInvoiceDocument = useMutation(
    (documentID) => apiInvoices.deleteInvoiceDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invoice", invoiceID]);
        toast.success("Attachment deleted successfully");
      },
      onError: (error) => {
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

  function handleDelete() {
    console.log("Delete Attachement");
    deleteInvoiceDocument.mutate(id);
  }
  return (
    <div className="w-full h-full">
      <div className=" w-full flex items-center justify-between text-[#52555C]">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex space-x-3 line-clamp-1"
        >
          <BsFillFileEarmarkTextFill className="text-[#52555C] text-xl" />
          <p className="text-base">
            {description ? description : getFileNameFromUrl(fileUrl)}
          </p>
        </a>

        <div className="flex space-x-5 text-xl">
          {
            deleteIcon && (
              <Button
                variant="outlined"
                color="danger"
                endDecorator={<DeleteForever />}
                onClick={() => setOpenDialog(true)}
              >
                Delete
              </Button>
            )
            // <BsFillTrash3Fill className="text-[#C32F27]" />
          }
        </div>
      </div>
      {openDialog && (
        <AlertDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default AttachmentItem;
