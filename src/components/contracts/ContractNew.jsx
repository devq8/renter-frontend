import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { Select, Option } from "@material-tailwind/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getProperties } from "../../utils/api/properties";
import { addContract } from "../../utils/api/contracts";
import { getTenants } from "../../utils/api/tenants";
import { listUnit } from "../../utils/api/units";
import { toast } from "react-toastify";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import utils from "../../utils/api/utils";
import DateInput from "../../utils/form/DateInput";
import dayjs from "dayjs";
import Toggle from "../../utils/form/Toggle";
import Radio from "../../utils/form/Radio";
import Button from "../../utils/Button";
import { AiFillPlusCircle } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

function ContractNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [SelectedProperty, setSelectedProperty] = useState(null);

  const addContractMutation = useMutation((contract) => addContract(contract), {
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
      toast.success("Contract added successfully");
      navigate(`/contracts/`);
    },
    onError: (error) => {
      console.log(error.response.data.name[0]);
      toast.error("Error adding contract");
    },
  });

  const {
    data: properties,
    isLoading: propertiesLoading,
    // error: propertiesError,
  } = useQuery(["properties"], () => getProperties());

  console.log("Properties:", properties?.data);

  const propertiesList =
    properties && properties.data
      ? properties.data.map((property) => ({
          value: property.id,
          label: property.name,
        }))
      : [];

  const {
    data: units,
    isLoading: unitsLoading,
    // error: unitsError,
  } = useQuery(["units"], () => listUnit(true)); // List all vacant units

  console.log("Units:", units?.data);

  const unitsList =
    units && units.data
      ? units.data.map((unit) => ({
          value: unit.id,
          property_fk: unit.property_fk.id, // Extracting the property ID
          label: unit.number,
          vacant: unit.vacant, // Ensure to include the vacant status
        }))
      : [];

  const filteredUnits = unitsList.filter(
    (unit) => unit.property_fk === SelectedProperty && unit.vacant === true
  );

  useEffect(() => {
    console.log("Filtered Units:", filteredUnits);
  }, [filteredUnits]);

  const {
    data: tenants,
    isLoading: tenantsLoading,
    // error: tenantsError,
  } = useQuery(["tenants"], () => getTenants());

  // console.log("Tenants Data:", tenants?.data);

  const tenantsList =
    tenants && tenants.data
      ? tenants.data.map((tenant) => ({
          value: tenant.user.id,
          label: tenant.user.english_name,
        }))
      : [];

  function handleCancel() {
    navigate(`/contracts`);
  }

  const formik = useFormik({
    initialValues: {
      property: "",
      unit: "",
      tenant: "",
      start_date: null,
      end_date: null,
      first_payment_date: null,
      rent: 0,
      flexible: false,
      notification_method: "WhatsApp",
      notification_mobile: "",
      notification_email: "",
    },
    validationSchema: Yup.object({
      property: Yup.string().required("Required"),
      unit: Yup.string().required("Required"),
      tenant: Yup.string().required("Required"),
      start_date: Yup.date().nullable().required("Required"),
      end_date: Yup.date()
        .nullable()
        .required("Required")
        .test(
          "is-after-start-date",
          "End date must be after start date",
          function (value) {
            const startDate = this.parent.start_date;
            return (
              !startDate || !value || dayjs(value).isAfter(dayjs(startDate))
            );
          }
        ),
      first_payment_date: Yup.date()
        .nullable()
        .required("Required")
        .test(
          "is-after-or-same-as-start-date",
          "First payment date must be after or same as start date",
          function (value) {
            const startDate = this.parent.start_date;
            if (!startDate || !value) {
              return true; // Passing validation if either date is not set
            }
            // Convert both dates to YYYY-MM-DD format for comparison
            const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
            const formattedValue = dayjs(value).format("YYYY-MM-DD");

            // Compare as strings
            return formattedValue >= formattedStartDate;
          }
        ),
      rent: Yup.number()
        .moreThan(0, "Rent must be greater then zero")
        .required("Required"),
      flexible: Yup.boolean(),
      notification_method: Yup.string().required("Required"),
      notification_mobile: Yup.string().required("Required"),
      notification_email: Yup.string().when("notification_method", (method) =>
        method === "Email" ? Yup.string().required("Required") : Yup.string()
      ),
    }),
    onSubmit: (values) => {
      const notificationMethodMapping = {
        Email: "eml",
        WhatsApp: "wap",
      };

      const contractData = {
        unit: values.unit,
        tenant: values.tenant,
        flexible: values.flexible,
        notification_method:
          notificationMethodMapping[values.notification_method],
        notification_mobile: values.notification_mobile,
        notification_email: values.notification_email,
        start_date: values.start_date
          ? dayjs(values.start_date).format("YYYY-MM-DD")
          : null,
        end_date: values.end_date
          ? dayjs(values.end_date).format("YYYY-MM-DD")
          : null,
        first_payment_date: values.first_payment_date
          ? dayjs(values.first_payment_date).format("YYYY-MM-DD")
          : null,
        rent: values.rent,
      };
      // console.log(contractData);
      addContractMutation.mutate(contractData);
    },
  });

  useEffect(() => {
    console.log("Units List:", unitsList);
  }, [unitsList]);

  useEffect(() => {
    console.log("Selected Property:", SelectedProperty);
  }, [SelectedProperty]);

  useEffect(() => {
    console.log("Filtered Units:", filteredUnits);
  }, [filteredUnits]);

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
              onSubmit={formik.handleSubmit}
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
                    placeholder="Select property ..."
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "property",
                        selectedOption ? selectedOption.value : null
                      );
                      setSelectedProperty(
                        selectedOption ? selectedOption.value : null
                      );
                      formik.setFieldValue("unit", "");
                    }}
                    value={propertiesList?.find(
                      (option) => option.value === formik.values.property
                    )}
                    onBlur={formik.handleBlur}
                    isMulti={false}
                    errorMessage={
                      formik.touched.property && formik.errors.property
                    }
                    isLoading={propertiesLoading}
                  />

                  <Dropdown
                    name="unit"
                    label="Unit"
                    isClearable={true}
                    isSearchable={true}
                    options={filteredUnits}
                    placeholder="Select unit ..."
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "unit",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    value={filteredUnits.find(
                      (option) => option.value === formik.values.unit
                    )}
                    isMulti={false}
                    errorMessage={formik.touched.unit && formik.errors.unit}
                    isLoading={unitsLoading}
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
                    placeholder="Select tenant ..."
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "tenant",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    value={tenantsList?.find(
                      (option) => option.value === formik.values.tenant
                    )}
                    isMulti={false}
                    isLoading={tenantsLoading}
                    errorMessage={formik.touched.tenant && formik.errors.tenant}
                  />
                  {/* <div className="hide-on-print"> */}
                  {/* <button
                      id="defaultModalButton"
                      data-modal-toggle="defaultModal"
                      type="button"
                      className="flex items-center rounded-md bg-[#BD9A5F] mx-2 px-7 py-3 text-base font-medium text-white transition duration-200 hover:bg-[#BD9A5F] hover:opacity-80 active:bg-[#BD9A5F]"
                      // onClick={handleNewTenant}
                    >
                      <span className="inline-block mr-2 ">
                        <AiFillPlusCircle className="w-6 h-6" />
                      </span>
                      <span className="line-clamp-1">Add New Tenant</span>
                    </button> */}
                  {/* </div> */}
                  <div
                    id="defaultModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
                  >
                    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      {/* Modal content */}
                      <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        {/* Modal header */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Add Product
                          </h3>
                          <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="defaultModal"
                          >
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                        {/* Modal body */}
                        {/* <form action="#">
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                              <label
                                for="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type product name"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="brand"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Brand
                              </label>
                              <input
                                type="text"
                                name="brand"
                                id="brand"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Product brand"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="$2999"
                                required=""
                              />
                            </div>
                            <div>
                              <label
                                for="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Category
                              </label>
                              <select
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              >
                                <option selected="">Select category</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label
                                for="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="description"
                                rows="4"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write product description here"
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <svg
                              className="mr-1 -ml-1 w-6 h-6"
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
                        </form> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex p-3">
                  <Input
                    name="notification_mobile"
                    type="text"
                    label="Mobile Number"
                    placeholder="e.g. +965 66600499"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.notification_mobile}
                    errorMessage={
                      formik.touched.notification_mobile &&
                      formik.errors.notification_mobile
                    }
                    required={true}
                  />
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
                    name="start_date"
                    value={formik.values.start_date}
                    onChange={(value) =>
                      formik.setFieldValue("start_date", value)
                    }
                    errorMessage={
                      formik.touched.start_date && formik.errors.start_date
                    }
                  />
                  <DateInput
                    label="Contract End Date"
                    name="end_date"
                    value={formik.values.end_date}
                    onChange={(value) =>
                      formik.setFieldValue("end_date", value)
                    }
                    errorMessage={
                      formik.touched.end_date && formik.errors.end_date
                    }
                  />
                </div>
                {/* Fourth Row */}
                <div className="flex p-3">
                  <DateInput
                    label="First Payment Date"
                    name="first_payment_date"
                    value={formik.values.first_payment_date}
                    onChange={(value) =>
                      formik.setFieldValue("first_payment_date", value)
                    }
                    errorMessage={
                      formik.touched.first_payment_date &&
                      formik.errors.first_payment_date
                    }
                  />
                </div>

                {/* Fifth Row */}
                <div className="flex p-3">
                  {/* <label>Flexible Contract</label> */}
                  <Toggle
                    name="flexible"
                    title="Flexible Contract"
                    onChange={formik.handleChange}
                    value={formik.values.flexible}
                  />
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
                    <div className="flex-col">
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                          KD
                        </span>
                        <input
                          type="number"
                          id="rent"
                          name="rent"
                          className="rounded-none rounded-r-md border text-gray-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.rent}
                        />
                      </div>
                      {formik.touched.rent && formik.errors.rent && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {formik.touched.rent && formik.errors.rent}
                          </span>
                        </p>
                      )}
                    </div>
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
                    name={"notification_method"}
                    options={["WhatsApp", "Email"]}
                    onChange={formik.handleChange}
                    value={formik.values.notification_method}
                  />
                </div>
                {/* Eight Row */}
                <div className="flex p-3">
                  {formik.values.notification_method === "Email" ? (
                    <Input
                      name="notification_email"
                      type="email"
                      label="Email Address"
                      placeholder="e.g. info@wuc.com.kw"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.notification_email}
                      errorMessage={
                        formik.touched.notification_email &&
                        formik.errors.notification_email
                      }
                      required={true}
                    />
                  ) : null}
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
                  disabled={addContractMutation.isLoading}
                >
                  {addContractMutation.isLoading ? "Saving..." : "Save"}
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
