import React from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../utils/form/Input";
import { addTenant, getTenants, updateTenant } from "../../utils/api/tenants";

// import { PhotoIcon } from "@heroicons/react/24/solid";

function TenantNewUpdate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id: tenantId } = useParams();
  const isUpdatingMode = tenantId != null;

  const { data: tenantData } = useQuery(
    ["tenant", tenantId],
    () => getTenants(tenantId),
    { enabled: isUpdatingMode }
  );

  console.log("Tenant Details :", tenantData);

  function handleCancel() {
    navigate(-1);
  }

  const addTenantMutation = useMutation(
    (tenant) => {
      // addTenant(tenant)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tenants"]);
        toast.success("Tenant added successfully");
        navigate("/tenants");
      },
      onError: (error) => {
        console.log("Error adding tenant: ", error.response.data);
        toast.error("Error adding tenant");
      },
    }
  );

  const updateTenantMutation = useMutation(
    ({ id, ...tenantData }) => updateTenant(tenantData, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tenants"]);
        toast.success("Tenant updated successfully");
        navigate("/tenants");
      },
      onError: (error) => {
        let errorMessage = "";
        if (error.response && error.response.data) {
          errorMessage += `${
            error.response.data.details || error.response.data.message
          }`;
        }
        console.log("Error updating tenant: ", error);
        toast.error("Error updating tenant", errorMessage);
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      english_name:
        isUpdatingMode && tenantData?.data
          ? tenantData.data.user.english_name
          : "",
      arabic_name:
        isUpdatingMode && tenantData?.data
          ? tenantData.data.user.arabic_name
          : "",
      email:
        isUpdatingMode && tenantData?.data ? tenantData.data.user.email : "",
      mobile:
        isUpdatingMode && tenantData?.data ? tenantData.data.user.mobile : "",
      cid: isUpdatingMode && tenantData?.data ? tenantData.data.cid : "",
      address:
        isUpdatingMode && tenantData?.data ? tenantData.data.address : "",
      sponsor:
        isUpdatingMode && tenantData?.data ? tenantData.data.sponsor : "",
      paci: isUpdatingMode && tenantData?.data ? tenantData.data.paci : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      english_name: Yup.string().required("Required"),
      arabic_name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").nullable(),
      mobile: Yup.string()
        .matches(/^\d{8}$/, "Mobile must be exactly 8 digits")
        .required("Required"),
      cid: Yup.string()
        .matches(/^\d{12}$/, "CID must be exactly 12 digits")
        .required("Required"),
      address: Yup.string().required("Required"),
      sponsor: Yup.string().nullable(),
      paci: Yup.string().nullable(),
    }),
    onSubmit: (values) => {
      const tenantData = {
        cid: values.cid,
        address: values.address,
        sponsor: values.sponsor,
        paci: values.paci,
        user: {
          email: values.email,
          english_name: values.english_name,
          arabic_name: values.arabic_name,
          mobile: values.mobile,
        },
      };

      console.log("Tenant data: ", tenantData);
      if (isUpdatingMode) {
        updateTenantMutation.mutate({ id: tenantId, ...tenantData });
      } else {
        addTenantMutation.mutate(tenantData);
      }
    },
  });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          {isUpdatingMode ? (
            <Breadcrumb
              main={{ title: "Tenants", url: "/tenants" }}
              sub={[
                {
                  title: tenantData?.data?.user.english_name,
                  url: "",
                },
                {
                  title: "Update Tenant",
                  url: "",
                },
              ]}
            />
          ) : (
            <Breadcrumb
              main={{ title: "Tenants", url: "/tenants" }}
              sub={[
                {
                  title: "Add New Tenant",
                  url: "",
                },
              ]}
            />
          )}
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isUpdatingMode
                ? `Update Tenant ${tenantData?.data.user.english_name}`
                : "Add New Tenant"}
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
              <div className="border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Tenant Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter tenant detail below
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <Input
                    name="english_name"
                    type="text"
                    label="English name"
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.english_name || ""}
                    errorMessage={
                      formik.touched.english_name && formik.errors.english_name
                    }
                  />
                  <Input
                    name="arabic_name"
                    type="text"
                    label="Arabic name"
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.arabic_name || ""}
                    errorMessage={
                      formik.touched.arabic_name && formik.errors.arabic_name
                    }
                    direction="rtl"
                  />
                </div>
                {/* Second Row */}
                <div className="flex p-3">
                  <Input
                    name="mobile"
                    type="text"
                    label="Mobile"
                    placeholder="e.g. 66600499 (Kuwaiti Mobile only)"
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile || ""}
                    errorMessage={formik.touched.mobile && formik.errors.mobile}
                  />
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="e.g. info@wuc.com.kw"
                    required={false}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email || ""}
                    errorMessage={formik.touched.email && formik.errors.email}
                  />
                </div>
                {/* Third Row */}
                <div className="flex p-3">
                  <Input
                    name="cid"
                    type="text"
                    label="Civil ID Number"
                    placeholder="e.g. 123456789012"
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cid || ""}
                    errorMessage={formik.touched.cid && formik.errors.cid}
                  />
                  <Input
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="e.g. Khaitan - Block 9 - Street 25 - Building 13"
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address || ""}
                    errorMessage={
                      formik.touched.address && formik.errors.address
                    }
                  />
                </div>
                {/* Fourth Row */}
                <div className="flex p-3">
                  <Input
                    name="sponsor"
                    type="text"
                    label="Sponsor"
                    required={false}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sponsor || ""}
                    errorMessage={
                      formik.touched.sponsor && formik.errors.sponsor
                    }
                  />
                  <Input
                    name="paci"
                    type="text"
                    label="PACI"
                    required={false}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.paci || ""}
                    errorMessage={formik.touched.paci && formik.errors.paci}
                  />
                </div>
              </div>
              {/* Document Upload */}
              {/* <div className="col-span-full">
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
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          onChange={handleFileInput}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PDF, PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
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
                  disabled={addTenantMutation.isLoading}
                >
                  {isUpdatingMode
                    ? updateTenantMutation.isLoading
                      ? "Updating..."
                      : "Update"
                    : addTenantMutation.isLoading
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TenantNewUpdate;
