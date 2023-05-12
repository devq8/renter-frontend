import React, { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import "flowbite";
import Select from "react-select";
import api from "../../utils/api/properties";
import utils from "../../utils/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import Validation from "./Validation";

function PropertyNew() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const addPropertyMutation = useMutation(
    (property) => api.addProperty(property),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["properties"]);
        navigate("/properties");
        toast.success("Property added successfully");
      },
      onError: (error) => console.log(error.response.data.name[0]),
    }
  );

  const {
    data: areas,
    isLoading: areasLoading,
    error: areasError,
  } = useQuery(["areas"], () => utils.getAreas());
  const areasList = areas && areas.data ? areas.data.map((area) => area) : [];
  console.log(areasList);

  const {
    data: banks,
    isLoading: banksLoading,
    error: banksError,
  } = useQuery(["banks"], () => utils.getBanks());
  const banksList = banks && banks.data ? banks.data.map((bank) => bank) : [];

  const {
    data: managers,
    isLoading: managersLoading,
    error: managersError,
  } = useQuery(["managers"], () => utils.getManagers());
  const managersList =
    managers && managers.data
      ? managers.data.map((manager) => ({
          value: manager.id,
          label:
            manager.legal_name ??
            `${manager.user.first_name} ${manager.user.last_name}`,
        }))
      : [];

  const {
    data: owners,
    isLoading: ownersLoading,
    error: ownersError,
  } = useQuery(["owners"], () => utils.getOwners());
  const ownersList =
    owners && owners.data
      ? owners.data.map((owner) => ({
          value: owner.id,
          label: `${owner.user.first_name} ${owner.user.last_name}`,
        }))
      : [];

  const [property, setProperty] = useState({
    name: "",
    area: "",
    address: "",
    paci: "",
    manager: [],
    owner: [],
    bank: "",
    beneficiary: "",
    iban: "",
  });
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  function handleSelectedManagerChange(selected) {
    setSelectedManagers(selected);
    setProperty({
      ...property,
      manager: selected.map((manager) => manager.value),
    });
  }

  function handleSelectedOwnerChange(selected) {
    setSelectedOwners(selected);
    setProperty({
      ...property,
      owner: selected.map((owner) => owner.value),
    });
    console.log(property);
  }

  function handleSelectedBankChange(selected) {
    setSelectedBank(selected);
    if (selected && selected.value !== null) {
      setProperty({ ...property, bank: selected.value });
    } else if (selected === null) {
      setProperty({ ...property, bank: "" });
    }
  }

  function handleSelectedAreaChange(selected) {
    setSelectedArea(selected);
    if (selected !== null) {
      setProperty({ ...property, area: selected.value });
    } else if (selected === null) {
      setProperty({ ...property, area: "" });
    }
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

    setErrors(Validation(property));
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      addPropertyMutation.mutate(property);
      toast.success("Property Added Successfully"); //Not working!!
    }
  };

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Properties", url: "/properties" }}
            sub={[{ title: "Add New Property", url: "" }]}
          />
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
                  <Input
                    name="name"
                    type="text"
                    label="Property name"
                    placeholder="e.g. Hawalli 290"
                    required={true}
                    onChange={handleChange}
                    errorMessage={errors.name}
                    // pattern="^[4-6,9][0-9]{7}$"
                  />
                </div>

                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="area"
                    label="Property area"
                    isClearable={true}
                    isSearchable={true}
                    options={areasList}
                    placeholder="Select property's area ..."
                    onChange={handleSelectedAreaChange}
                    value={selectedArea}
                    isMulti={false}
                    errorMessage={errors.area}
                  />
                  <Input
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                    onChange={handleChange}
                    required={false}
                  />
                </div>

                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    name="paci"
                    type="text"
                    label="PACI"
                    placeholder="e.g. 12345678"
                    onChange={handleChange}
                    required={false}
                  />
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
                <div className="flex p-3">
                  <Dropdown
                    name="manager"
                    label="Manager"
                    isClearable={true}
                    isSearchable={true}
                    options={managersList}
                    placeholder="Select property manager"
                    onChange={handleSelectedManagerChange}
                    value={selectedManagers}
                    isMulti={true}
                    errorMessage={errors.manager}
                  />
                </div>

                {/* Fifth Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="owner"
                    label="Owner"
                    isClearable={true}
                    isSearchable={true}
                    options={ownersList}
                    placeholder="Select property owner"
                    onChange={handleSelectedOwnerChange}
                    value={selectedOwners}
                    isMulti={true}
                    errorMessage={errors.owner}
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
                <div className="flex p-3">
                  <Dropdown
                    name="bank"
                    label="Bank Name"
                    isClearable={true}
                    isSearchable={true}
                    options={banksList}
                    placeholder="Select your bank name"
                    onChange={handleSelectedBankChange}
                    value={selectedBank}
                    isMulti={false}
                  />
                </div>
                <div className="flex p-3">
                  <Input
                    name="beneficiary"
                    type="text"
                    label="Beneficiary"
                    placeholder="e.g. Warba United Company"
                    onChange={handleChange}
                    required={false}
                  />
                  <Input
                    name="iban"
                    type="text"
                    label="IBAN"
                    placeholder=""
                    onChange={handleChange}
                    required={false}
                  />
                </div>
              </div>
              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

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
                >
                  Save
                </button>
              </div>
            </form>
            {/* <button>Notification</button> */}
            <ToastContainer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PropertyNew;
