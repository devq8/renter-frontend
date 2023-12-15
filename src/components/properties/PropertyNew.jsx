import React from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import "flowbite";
import api from "../../utils/api/properties";
import utils from "../../utils/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";

function PropertyNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addPropertyMutation = useMutation(
    (property) => api.addProperty(property),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["properties"]);
        toast.success("Property added successfully");
        navigate("/properties");
      },
      onError: (error) => {
        console.log(error.response.data.name[0]);
        toast.error("Error adding property");
      },
    }
  );

  const {
    data: areas,
    isLoading: areasLoading,
    // error: areasError,
  } = useQuery(["areas"], () => utils.getAreas());
  const areasList = areas && areas.data ? areas.data.map((area) => area) : [];

  const {
    data: banks,
    isLoading: banksLoading,
    // error: banksError,
  } = useQuery(["banks"], () => utils.getBanks());
  const banksList = banks && banks.data ? banks.data.map((bank) => bank) : [];

  const {
    data: managers,
    isLoading: managersLoading,
    // error: managersError,
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
    // error: ownersError,
  } = useQuery(["owners"], () => utils.getOwners());

  const ownersList =
    owners && owners.data
      ? owners.data.map((owner) => ({
          value: owner.id,
          label: `${owner.user.first_name} ${owner.user.last_name}`,
        }))
      : [];

  const formik = useFormik({
    initialValues: {
      name: "",
      area: "",
      address: "",
      PACI: "",
      manager: [],
      owner: [],
      bank_name: "",
      beneficiary: "",
      IBAN: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Property name is required!"),
      area: Yup.string().required("Area is required!"),
      manager: Yup.array()
        .min(1, "At least one manager must be selected")
        .required("Property manager is required"),
      owner: Yup.array()
        .min(1, "At least one owner must be selected")
        .required("Property owner is required"),
      bank_name: Yup.string().required("Bank is required"),
    }),
    onSubmit: (values) => {
      const propertyData = {
        name: values.name,
        area: values.area,
        address: values.address,
        PACI: values.PACI,
        manager: values.manager,
        owner: values.owner,
        bank_name: values.bank_name,
        beneficiary: values.beneficiary,
        IBAN: values.IBAN,
      };
      addPropertyMutation.mutate(propertyData);
    },
  });

  function handleCancel() {
    navigate("/properties");
  }

  // const provincy = [
  //   { value: "hawalli", label: "Hawalli" },
  //   { value: "farwaniya", label: "Farwaniya" },
  //   { value: "ahmadi", label: "Ahmadi" },
  //   { value: "jahra", label: "Jahra" },
  //   { value: "mubarak", label: "Mubarak Al-Kabeer" },
  //   { value: "asima", label: "Asima" },
  // ];

  // const cities = {
  //   hawalli: [
  //     { value: "salmiya", label: "Salmiya" },
  //     { value: "jabriya", label: "Jabriya" },
  //     { value: "hawalli", label: "Hawalli" },
  //     { value: "mishref", label: "Mishref" },
  //     { value: "rawda", label: "Rawda" },
  //     { value: "salwa", label: "Salwa" },
  //     { value: "shaab", label: "Shaab" },
  //     { value: "shuhada", label: "Shuhada" },
  //     { value: "siddeeq", label: "Siddeeq" },
  //     { value: "sabah", label: "Sabah Al-Salem" },
  //   ],
  //   farwaniya: [
  //     { value: "abdullah", label: "Abdullah Al-Mubarak" },
  //     { value: "andalous", label: "Andalous" },
  //     { value: "daiya", label: "Daiya" },
  //     { value: "doha", label: "Doha" },
  //     { value: "fardous", label: "Fardous" },
  //   ],
  //   ahmadi: [
  //     { value: "abuhalifa", label: "Abu Halifa" },
  //     { value: "ahmadi", label: "Ahmadi" },
  //     { value: "fahaheel", label: "Fahaheel" },
  //   ],
  //   jahra: [
  //     { value: "abdali", label: "Abdali" },
  //     { value: "jahra", label: "Jahra" },
  //     { value: "naseem", label: "Naseem" },
  //     { value: "qasr", label: "Qasr" },
  //   ],
  //   mubarak: [
  //     { value: "mubarak", label: "Mubarak Al-Kabeer" },
  //     { value: "qusoor", label: "Al-Qusoor" },
  //     { value: "adan", label: "Al-Adan" },
  //   ],
  //   asima: [
  //     { value: "kaifan", label: "Kaifan" },
  //     { value: "khaldiya", label: "Khaldiya" },
  //     { value: "rawda", label: "Rawda" },
  //     { value: "shamiya", label: "Shamiya" },
  //     { value: "sharq", label: "Sharq" },
  //     { value: "shuwaikh", label: "Shuwaikh" },
  //   ],
  // };

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
            {/* Formik */}
            <form
              className="w-full border-collapse bg-white text-left text-sm text-gray-500"
              onSubmit={formik.handleSubmit}
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    errorMessage={
                      formik.touched.name &&
                      formik.errors.name &&
                      formik.errors.name
                    }
                  />
                </div>

                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="area"
                    label="Property Area"
                    isClearable={true}
                    isSearchable={true}
                    options={areasList}
                    placeholder="Select area ..."
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "area",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    value={areasList?.find(
                      (option) => option.value === formik.values.area
                    )}
                    onBlur={formik.handleBlur}
                    isMulti={false}
                    errorMessage={formik.touched.area && formik.errors.area}
                    isLoading={areasLoading}
                  />
                  <Input
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    errorMessage={
                      formik.touched.address &&
                      formik.errors.address &&
                      formik.errors.address
                    }
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    name="PACI"
                    type="text"
                    label="PACI"
                    placeholder="e.g. 12345678"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.PACI}
                    errorMessage={
                      formik.touched.PACI &&
                      formik.errors.PACI &&
                      formik.errors.PACI
                    }
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
                    onChange={(selectedOptions) =>
                      formik.setFieldValue(
                        "manager",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : null
                      )
                    }
                    value={managersList?.filter((option) =>
                      formik.values.manager.includes(option.value)
                    )}
                    onBlur={formik.handleBlur}
                    isMulti={true}
                    isLoading={managersLoading}
                    errorMessage={
                      formik.touched.manager &&
                      formik.errors.manager &&
                      formik.errors.manager
                    }
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
                    onChange={(selectedOptions) =>
                      formik.setFieldValue(
                        "owner",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : null
                      )
                    }
                    onBlur={formik.handleBlur}
                    value={ownersList?.filter((option) =>
                      formik.values.owner.includes(option.value)
                    )}
                    isMulti={true}
                    isLoading={ownersLoading}
                    errorMessage={
                      formik.touched.owner &&
                      formik.errors.owner &&
                      formik.errors.owner
                    }
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
                    name="bank_name"
                    label="Bank Name"
                    isClearable={true}
                    isSearchable={true}
                    options={banksList}
                    placeholder="Select your bank name"
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "bank_name",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    value={
                      banksList?.find(
                        (option) => option.value === formik.values.bank_name
                      ) || null
                    }
                    isMulti={false}
                    isLoading={banksLoading}
                    errorMessage={
                      formik.touched.bank_name &&
                      formik.errors.bank_name &&
                      formik.errors.bank_name
                    }
                  />
                </div>
                <div className="flex p-3">
                  <Input
                    name="beneficiary"
                    type="text"
                    label="Beneficiary"
                    placeholder="e.g. Warba United Company"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={false}
                    value={formik.values.beneficiary}
                    errorMessage={
                      formik.touched.beneficiary &&
                      formik.errors.beneficiary && (
                        <div>{formik.errors.beneficiary}</div>
                      )
                    }
                  />
                  <Input
                    name="IBAN"
                    type="text"
                    label="IBAN"
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={false}
                    value={formik.values.IBAN}
                    errorMessage={formik.touched.IBAN && formik.errors.IBAN}
                  />
                </div>
              </div>
              {/* ######## New Code - Dependable Dropdown ######## */}
              {/* <div>
                <label htmlFor="provincy">Provincy</label>
                <Select
                  id="provincy"
                  name="provincy"
                  options={provincy}
                  value={provincy.find(
                    (s) => s.value === formik.values.provincy
                  )}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("provincy", selectedOption.value);
                    formik.setFieldValue("city", ""); // Reset city when state changes
                  }}
                  onBlur={formik.handleBlur}
                  isSearchable
                />
                {formik.touched.provincy && formik.errors.provincy && (
                  <div>{formik.errors.provincy}</div>
                )}
              </div>
              <div>
                <label htmlFor="city">City</label>
                <Select
                  id="city"
                  name="city"
                  options={cities[formik.values.provincy] || []}
                  value={cities[formik.values.provincy]?.find(
                    (c) => c.value === formik.values.city
                  )}
                  onChange={(selectedOption) =>
                    formik.setFieldValue("city", selectedOption.value)
                  }
                  onBlur={formik.handleBlur}
                  isSearchable
                />
                {formik.touched.city && formik.errors.city && (
                  <div>{formik.errors.city}</div>
                )}
              </div> */}

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
                  disabled={addPropertyMutation.isLoading}
                >
                  {addPropertyMutation.isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PropertyNew;
