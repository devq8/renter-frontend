import React from "react";
import {
  BsCloudDownloadFill,
  BsFillTrash3Fill,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";

function AttachmentItem({ fileName, deleteIcon }) {
  return (
    <div className="w-full h-full ">
      <div className=" w-full flex items-center justify-between text-[#52555C]">
        <div className="flex space-x-3 line-clamp-1">
          <BsFillFileEarmarkTextFill className="text-[#52555C] text-xl" />
          <p className="text-base">{fileName}</p>
        </div>
        <div className="flex space-x-5 text-xl">
          {deleteIcon && <BsFillTrash3Fill className="text-[#C32F27]" />}
          <BsCloudDownloadFill className="text-[#52555C]" />
        </div>
      </div>
    </div>
  );
}

export default AttachmentItem;
