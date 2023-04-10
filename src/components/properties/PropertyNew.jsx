import React, { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import "flowbite";
import Select from "react-select";
import api from "../../utils/api/properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function PropertyNew() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const addPropertyMutation = useMutation(
    (property) => api.addProperty(property),
    {
      onSuccess: () => queryClient.invalidateQueries(["properties"]),
    }
  );

  const areas = [
    { value: "hawalli", label: "Hawalli" },
    { value: "khaitan", label: "Khaitan" },
    { value: "farwaniya", label: "Farwaniya" },
  ];

  const managers = [
    { value: "khaled", label: "Khaled" },
    { value: "ali", label: "Ali" },
    { value: "mohd", label: "Mohammad" },
  ];

  const owners = [
    { value: "nadia", label: "Nadia" },
    { value: "ahmad", label: "Ahmad" },
    { value: "ali", label: "Ali" },
  ];

  const banks = [
    { value: "kfh", label: "KFH" },
    { value: "bbyn", label: "Boubyan" },
    { value: "nbk", label: "NBK" },
  ];

  const [property, setProperty] = useState("");
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  function handleSelectedManagerChange(selected) {
    setSelectedManagers(selected);
    setProperty({ ...property, managers: selected });
    console.log(property);
  }

  function handleSelectedOwnerChange(selected) {
    setSelectedOwners(selected);
    setProperty({ ...property, owners: selected });
    console.log(property);
  }

  function handleSelectedBankChange(selected) {
    setSelectedBank(selected);
    setProperty({ ...property, bank: selected });
    console.log(property);
  }

  function handleSelectedAreaChange(selected) {
    setSelectedArea(selected);
    setProperty({ ...property, area: selected });
    console.log(property);
  }

  function handleCancel() {
    navigate("/properties");
  }

  const handleChange = (event) => {
    setProperty({ ...property, [event.target.name]: event.target.value });
    console.log(property);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Adding new property function called");
    // console.log(`The property details to be saved is ${property}`);
    try {
      addPropertyMutation.mutate(property);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={"Properties"} sub={["Add New Property"]} />
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Add New Property
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 p-7 bg-white">
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={handleSubmit}
            >
              <div className="border-gray-900/10 pb-12 ">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Property Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter the property details below.
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <div className="flex flex-col w-[50%] pe-2">
                    <label
                      for="name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Property name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      placeholder="e.g. Hawalli 29"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="flex p-3">
                  <div className="w-[50%] pe-2">
                    <label
                      for="area"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Property area
                    </label>
                    <Select
                      name="area"
                      isClearable={true}
                      isSearchable={true}
                      options={areas}
                      placeholder="Select property's area ..."
                      //   onChange={handleSelectedAreaChange}
                      value={selectedArea}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          height: "42px",
                          borderColor: state.isFocused ? "#BD9A5F" : "white",
                          boxShadow: "0 0 0 1px #D1D5DB",
                        }),
                      }}
                    />
                    {/* <SelectSearch
                      label="Property area"
                      options={areas}
                      clearable={true}
                      searchable={true}
                      name="area"
                      //   onInputChange={handleChange}
                      placeholder="Select property's area ..."
                    /> */}
                  </div>
                  <div className="flex flex-col w-[50%] ps-2">
                    <label
                      for="address"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                      <span className=" mb-2 text-xs font-medium text-gray-400 dark:text-white">
                        {" "}
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      //   onChange={handleChange}
                      class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      //   placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                      //   required
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div className="flex p-3">
                  <div className="flex flex-col w-[50%] pe-2">
                    <label
                      for="paci"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      PACI
                      <span className=" mb-2 text-xs font-medium text-gray-400 dark:text-white">
                        {" "}
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="paci"
                      name="paci"
                      class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      //   onChange={handleChange}
                      //   placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                      //   required
                    />
                  </div>
                </div>
              </div>
              <div className="border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Management Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter the property management details below.
                </p>
                {/* Fourth Row */}
                <div className="flex flex-col w-[50%] p-3">
                  <label
                    for="manager"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Manager
                  </label>
                  <Select
                    name="manager"
                    isMulti
                    isClearable={true}
                    isSearchable={true}
                    options={managers}
                    placeholder="Select property manager"
                    // onInputChange={handleChange}
                    // onChange={handleSelectedManagerChange}
                    value={selectedManagers}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        height: "42px",
                        borderColor: state.isFocused ? "#BD9A5F" : "white",
                        boxShadow: "0 0 0 1px #D1D5DB",
                      }),
                    }}
                  />
                </div>

                {/* Fifth Row */}
                <div className="flex flex-col w-[50%] p-3">
                  <label
                    for="owner"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Owner
                  </label>

                  <Select
                    name="owner"
                    isMulti
                    isClearable={true}
                    isSearchable={true}
                    options={owners}
                    placeholder="Select property owner"
                    // onChange={handleSelectedOwnerChange}
                    value={selectedOwners}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        height: "42px",
                        borderColor: state.isFocused ? "#BD9A5F" : "white",
                        boxShadow: "0 0 0 1px #D1D5DB",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Bank Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter the bank details below.
                </p>
                {/* Sixth Row */}
                <div className="flex flex-col w-[50%] p-3">
                  <label
                    for="bank"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Bank name
                  </label>

                  <Select
                    name="bank"
                    isClearable={true}
                    isSearchable={true}
                    options={banks}
                    placeholder="Select your bank name"
                    value={selectedBank}
                    // onChange={handleSelectedBankChange}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        height: "42px",
                        borderColor: state.isFocused ? "#BD9A5F" : "white",
                        boxShadow: "0 0 0 1px #D1D5DB",
                      }),
                    }}
                  />
                </div>
                <div className="flex p-3">
                  <div className="flex flex-col w-[50%] pe-2">
                    <label
                      for="beneficiary"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Beneficiary
                    </label>
                    <input
                      type="text"
                      id="beneficiary"
                      name="beneficiary"
                      //   onChange={handleChange}
                      class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      //   placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                      //   required
                    />
                  </div>
                  <div className="flex flex-col w-[50%] ps-2">
                    <label
                      for="iban"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      IBAN
                    </label>
                    <input
                      type="text"
                      id="iban"
                      name="iban"
                      //   onChange={handleChange}
                      class="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      //   placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                      //   required
                    />
                  </div>
                </div>
              </div>
              <hr class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

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
                  //   onClick={handleSave}
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

export default PropertyNew;
