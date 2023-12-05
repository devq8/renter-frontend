import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { Select, Option } from "@material-tailwind/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import apiProperties from "../../utils/api/properties";
import apiContracts from "../../utils/api/contracts";
import apiTenants from "../../utils/api/tenants";
import apiUnits from "../../utils/api/units";
import { toast, ToastContainer } from "react-toastify";
import Validation from "./Validation";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import utils from "../../utils/api/utils";
import DateInput from "../../utils/form/DateInput";
import dayjs from "dayjs";
import Toggle from "../../utils/form/Toggle";
import Radio from "../../utils/form/Radio";
import Button from "../../utils/Button";
import { AiFillPlusCircle } from "react-icons/ai";

function ContractNew() {
  const navigate = useNavigate();

  const {
    data: properties,
    isLoading: propertiesLoading,
    error,
  } = useQuery(["properties"], () => apiProperties.getProperties());

  const propertiesList =
    properties && properties.data
      ? properties.data.map((property) => ({
          value: property.id,
          label: property.name,
        }))
      : [];

  // console.log(propertiesList);

  const {
    data: units,
    isLoading: unitsLoading,
    error: unitsError,
  } = useQuery(["units"], () => apiUnits.listUnit(true));

  const unitsList =
    units && units.data
      ? units.data.map((unit) => ({
          value: unit.id,
          property: unit.property_fk,
          label: unit.number,
        }))
      : [];

  // console.log(unitsList);

  const {
    data: tenants,
    isLoading: tenantsLoading,
    error: tenantsError,
  } = useQuery(["tenants"], () => apiTenants.getTenants());

  const tenantsList =
    tenants && tenants.data
      ? tenants.data.map((tenant) => ({
          value: tenant.user.id,
          label: `${tenant.user.first_name} ${tenant.user.last_name}`,
        }))
      : [];

  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const addContractMutation = useMutation(
    (contract) => apiContracts.addContract(contract),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contracts"]);
        navigate(`/contracts/`);
        toast.success("Contract added successfully");
      },
      onError: (error) => {
        console.log(error.response.data.name[0]);
        toast.error("Error adding contract");
      },
    }
  );

  const [contract, setContract] = useState({
    property: "",
    unit: "",
    tenant: "",
    status: "ACTIVE",
    flexible: false,
    notification_method: "sms",
    notification_mobile: "",
    notification_email: "",
    start_date: "",
    end_date: "",
    first_payment_date: "",
    rent: "",
  });

  // const [selectedProperty, setSelectedProperty] = useState("");

  // const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  // const [unitsList, setUnitsList] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [selectedNotificationMethod, setNotificationMethod] = useState("SMS");

  function handleSelectedTenantChange(selected) {
    setSelectedTenant(selected);
    setContract({ ...contract, tenant: selected ? selected.value : "" });
    console.log(contract);
    // setErrors(Validation(contract));
  }

  // function handleSelectedUnitChange(selected) {
  //   setSelectedUnit(selected);
  //   setContract({ ...contract, unit: selected ? selected.value : "" });
  //   setErrors(Validation(contract));
  // }

  function handleCancel() {
    navigate(`/contracts`);
  }

  const handleChange = (event) => {
    setContract({ ...contract, [event.target.name]: event.target.value });
    console.log(contract);
    // setErrors(Validation(contract));
  };

  function handleNotificationMethodChange(event) {
    console.log(event.target.value);
    setNotificationMethod(event.target.value);

    setContract({
      ...contract,
      notification_method: event.target.value,
    });
    console.log(contract);
  }

  function handleDateChange(date, name) {
    setContract({ ...contract, [name]: dayjs(date).format("YYYY-MM-DD") });

    // setErrors(Validation(contract));
  }

  function handleNewTenant(event) {
    console.log("New tenant function");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(contract);
    setErrors(Validation(contract));
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      console.log("No errors");
      addContractMutation.mutate(contract);
    }
  };

  const [property, setProperty] = useState([]);
  const [unit, setUnit] = useState([]);

  useEffect(() => {
    setProperty(propertiesList);
  }, []);

  const handlePropertyChange = (selectedProperty) => {
    if (selectedProperty === null || selectedProperty === "") {
      setContract({
        ...contract,
        ["property"]: "",
      });
      setUnit([]);
    } else {
      setContract({
        ...contract,
        ["property"]: selectedProperty.value,
        ["unit"]: "",
      });

      setUnit(
        unitsList.filter((unit) => unit.property === selectedProperty.value)
      );
    }
  };

  const handleUnitChange = (selectedUnit) => {
    if (selectedUnit === null || selectedUnit === "") {
      console.log("Selected unit is null");
      setContract({
        ...contract,
        ["unit"]: "",
      });
      return;
    }
    setContract({
      ...contract,
      ["unit"]: selectedUnit.value,
    });
    console.log(`Selected unit is ${selectedUnit.value}`);
  };

  const handleFlexibleChange = (event) => {
    setIsOn(event.target.checked);
    setContract({ ...contract, flexible: !isOn });
    console.log(contract);
  };

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Contracts", url: "/contracts" }}
            sub={[{ title: "Add New Contract", url: "" }]}
          />
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
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={handleSubmit}
            >
              <div className="border-gray-900/10 pb-12 ">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Property & Unit Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter the property and unit details below.
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="property"
                    label="Property"
                    isClearable={true}
                    isSearchable={true}
                    options={propertiesList}
                    placeholder="Select property from the list ..."
                    onChange={handlePropertyChange}
                    isMulti={false}
                    errorMessage={errors.property}
                    // isLoading={propertiesLoading}
                  />

                  <Dropdown
                    name="unit"
                    label="Unit"
                    isClearable={true}
                    isSearchable={true}
                    options={unit}
                    placeholder="Select unit from the list ..."
                    onChange={handleUnitChange}
                    // value={selectedUnit}
                    isMulti={false}
                    errorMessage={errors.unit}
                    // isLoading={unitsLoading}
                  />
                </div>
                <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">
                  Tenant Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter tenant details below.
                </p>
                {/* Second Row */}
                <div className="flex p-3 items-center justify-between">
                  <Dropdown
                    name="tenant"
                    label="Tenant"
                    isClearable={true}
                    isSearchable={true}
                    options={tenantsList}
                    placeholder="Select tenant from the list ..."
                    onChange={handleSelectedTenantChange}
                    value={selectedTenant}
                    isMulti={false}
                    errorMessage={errors.tenant}
                  />
                  <div className="hide-on-print">
                    <button
                      id="defaultModalButton"
                      data-modal-toggle="defaultModal"
                      type="button"
                      className="flex items-center rounded-md bg-[#BD9A5F] mx-2 px-7 py-3 text-base font-medium text-white transition duration-200 hover:bg-[#BD9A5F] hover:opacity-80 active:bg-[#BD9A5F]"
                      onClick={handleNewTenant}
                    >
                      <span className="inline-block mr-2 ">
                        <AiFillPlusCircle className="w-6 h-6" />
                      </span>
                      <span className="line-clamp-1">Add New Tenant</span>
                    </button>
                  </div>
                  <div
                    id="defaultModal"
                    tabindex="-1"
                    aria-hidden="true"
                    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
                  >
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      {/* Modal content */}
                      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        {/* Modal header */}
                        <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Add Product
                          </h3>
                          <button
                            type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="defaultModal"
                          >
                            <svg
                              aria-hidden="true"
                              class="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        {/* Modal body */}
                        <form action="#">
                          <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                              <label
                                for="name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type product name"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="brand"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Brand
                              </label>
                              <input
                                type="text"
                                name="brand"
                                id="brand"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Product brand"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="price"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="$2999"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="category"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Category
                              </label>
                              <select
                                id="category"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              >
                                <option selected="">Select category</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                              </select>
                            </div>
                            <div class="sm:col-span-2">
                              <label
                                for="description"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="description"
                                rows="4"
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write product description here"
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="submit"
                            class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <svg
                              class="mr-1 -ml-1 w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Add new product
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">
                  Contract Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter contract details below.
                </p>
                {/* Third Row */}
                <div className="flex p-3">
                  <DateInput
                    label="Contract Start Date"
                    name="from_date"
                    // value={selectedContractPeriod.startDate}
                    onChange={(date) => handleDateChange(date, "start_date")}
                    errorMessage={errors.start_date}
                  />
                  <DateInput
                    label="Contract End Date"
                    name="to_date"
                    // value={selectedContractPeriod.endDate}
                    onChange={(date) => handleDateChange(date, "end_date")}
                    errorMessage={errors.end_date}
                    // defaultValue={selectedContractPeriod.endDate}
                    // minDate={dayjs(selectedStartDate)}
                  />
                </div>
                {/* Fourth Row */}
                <div className="flex p-3">
                  <DateInput
                    label="First Payment Date"
                    name="first_payment_date"
                    // value={selectedContractPeriod.firstPaymentDate}
                    errorMessage={errors.first_payment_date}
                    onChange={(date) =>
                      handleDateChange(date, "first_payment_date")
                    }
                    // defaultValue={dayjs(selectedStartDate)}
                  />
                </div>

                {/* Fifth Row */}
                <div className="flex p-3">
                  {/* <label>Flexible Contract</label> */}
                  <Toggle onChange={handleFlexibleChange} />
                </div>

                {/* Sixth Row */}
                <div className="flex p-3">
                  <div className="flex flex-col w-[25%] px-2">
                    <label
                      htmlFor="rent"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Rent (KD)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        KD
                      </span>
                      <input
                        type="number"
                        id="rent"
                        name="rent"
                        defaultValue={0}
                        className="rounded-none rounded-r-md border text-gray-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                        onChange={handleChange}
                      />
                    </div>
                    {errors.rent && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">{errors.rent}</span>
                      </p>
                    )}
                  </div>
                </div>
                <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">
                  Notifications Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter notification details below.
                </p>
                {/* Seventh Row */}
                <div className="flex p-3">
                  <Radio
                    options={["SMS", "WhatsApp", "Email"]}
                    name={"notifications_method"}
                    defaultChoice={"SMS"}
                    onChange={handleNotificationMethodChange}
                  />
                </div>
                {/* Eight Row */}
                <div className="flex p-3">
                  {selectedNotificationMethod === "Email" ? (
                    <Input
                      name="notification_email"
                      type="email"
                      label="Notification Email"
                      placeholder="e.g. info@wuc.com.kw"
                      required={true}
                      onChange={handleChange}
                      errorMessage={errors.notification_email}
                      // pattern="^[4-6,9][0-9]{7}$"
                    />
                  ) : (
                    <Input
                      name="notification_mobile"
                      type="number"
                      label="Notification Mobile"
                      placeholder="e.g. +965 66600499"
                      required={true}
                      onChange={handleChange}
                      errorMessage={errors.notification_mobile}
                      // pattern="^[4-6,9][0-9]{7}$"
                    />
                  )}
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
            {/* <ToastContainer /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
export default ContractNew;
