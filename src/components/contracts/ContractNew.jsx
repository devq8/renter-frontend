import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { Select, Option } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api/properties";

function ContractNew() {
  const navigate = useNavigate();

  const [contract, setContract] = useState("");

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery(["properties"], () => api.getProperties());

  const propertiesData = properties?.data;

  console.log(propertiesData);

  // const propertiesList = propertiesData.map((property) => {
  //   return <Option>{property?.name}</Option>;
  // });

  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleCancel() {
    navigate("/contracts");
  }

  const handleChange = (event) => {
    setContract({ ...contract, [event.target.name]: event.target.value });
  };

  function handleSave() {
    console.log("Adding new contract function called");
  }

  const handleFileInput = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={"Contracts"} sub={["Add New Contract"]} />
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Add New Contract
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 p-7 bg-white">
            <form className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <div className="border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Property & Unit Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose the property and unit for this contract.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="w-72">
                    <Select label="Select Property">
                      <Option>Khaitan 25</Option>
                      {/* {propertiesList} */}
                    </Select>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      for="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#BD9A5F] sm:text-sm sm:leading-6"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      for="mobile"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Mobile
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="mobile"
                        id="mobile"
                        autocomplete="mobile"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#BD9A5F] sm:text-sm sm:leading-6"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose the way of notification you want to receive for the
                  tenant.
                </p>

                <div className="space-y-10">
                  <fieldset>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="sms"
                          name="notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#BD9A5F] focus:ring-[#BD9A5F]"
                        />
                        <label
                          htmlFor="sms"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          SMS
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="whatsapp"
                          name="notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#BD9A5F] focus:ring-[#BD9A5F]"
                        />
                        <label
                          htmlFor="whatsapp"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          WhatsApp
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="email"
                          name="notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#BD9A5F] focus:ring-[#BD9A5F]"
                        />
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Documents
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex items-center text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Select files</span>
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          onChange={handleFileInput}
                          className="sr-only"
                          multiple
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PDF, PNG, JPG, GIF up to 10MB
                    </p>
                    <div>
                      <h3>Selected files:</h3>
                      <ul>
                        {selectedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#BD9A5F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#BD9A5F] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BD9A5F]"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContractNew;
