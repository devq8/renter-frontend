import React from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import "flowbite";
import { getPropertyOverview } from "../../utils/api/properties";
import { getUnitDetails, addUnit, updateUnit } from "../../utils/api/units";
import { getFloors, getUnitTypes } from "../../utils/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import * as Yup from "yup";
import { useFormik } from "formik";

function UnitNewUpdate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { propertyId, unitId } = useParams();

  const isUpdatingMode = unitId != null;

  const {
    data: property,
    // isLoading: PropertyLoading,
  } = useQuery(["propertyOverview", propertyId], () =>
    getPropertyOverview(propertyId)
  );
  const propertyDetails = property?.data;

  const {
    data: unitData,
    // isLoading: unitLoading,
  } = useQuery(["unit", unitId], () => getUnitDetails(unitId), {
    enabled: isUpdatingMode,
  });

  const addUnitMutation = useMutation((unit) => addUnit(unit, propertyId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["units", propertyId]);
      toast.success("Unit added successfully");
      navigate(`/properties/${propertyId}`);
    },
    onError: (error) => {
      console.log(error.response.data.name[0]);
      toast.error("Error adding unit");
    },
  });

  const updateUnitMutation = useMutation(
    ({ id, ...unitData }) => updateUnit(unitData, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["units"]);
        toast.success("Unit updated successfully");
        navigate(`/properties/${propertyId}`);
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

  const {
    data: types,
    isLoading: typesLoading,
    // error: typesError,
  } = useQuery(["types"], () => getUnitTypes());
  const typesList = types && types.data ? types.data.map((type) => type) : [];

  const {
    data: floors,
    isLoading: floorsLoading,
    // error: floorsError,
  } = useQuery(["floors"], () => getFloors());
  const floorsList =
    floors && floors.data ? floors.data.map((floor) => floor) : [];

  function handleCancel() {
    navigate(-1);
  }

  const formik = useFormik({
    initialValues: {
      number: isUpdatingMode && unitData?.data ? unitData.data.number : "",
      unit_type:
        isUpdatingMode && unitData?.data ? unitData.data.unit_type : [],
      floor: isUpdatingMode && unitData?.data ? unitData.data.floor : [],
      area: isUpdatingMode && unitData?.data ? unitData.data.area : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      number: Yup.string().required("Required"),
      unit_type: Yup.string().required("Required"),
      floor: Yup.string().required("Required"),
      area: Yup.number(),
    }),
    onSubmit: (values) => {
      const unitData = {
        number: values.number,
        unit_type: values.unit_type,
        floor: values.floor,
        area: values.area,
      };

      if (isUpdatingMode) {
        updateUnitMutation.mutate({ id: unitId, ...unitData });
      } else {
        addUnitMutation.mutate(unitData);
      }
    },
  });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Properties", url: "/properties" }}
            sub={[
              {
                title: propertyDetails?.name,
                url: `/properties/${propertyId}`,
              },
              {
                title: isUpdatingMode ? "Update Unit" : "Add New Unit",
                url: "",
              },
            ]}
          />
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isUpdatingMode
                ? `Update Unit ${unitData?.data?.number}`
                : `Add New Unit`}
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
                  Unit Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Enter the unit details below.
                </p>
                {/* First Row */}
                <div className="flex p-3">
                  <Input
                    name="number"
                    type="text"
                    label="Unit number"
                    placeholder="e.g. GF-08"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.number}
                    required={true}
                    errorMessage={formik.touched.number && formik.errors.number}
                  />
                </div>

                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="unit_type"
                    label="Unit type"
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "unit_type",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    onBlur={formik.handleBlur}
                    value={typesList?.find(
                      (option) => option.value === formik.values.unit_type
                    )}
                    isClearable={true}
                    isSearchable={true}
                    options={typesList}
                    placeholder="Select unit's type ..."
                    isLoading={typesLoading}
                    isMulti={false}
                    errorMessage={
                      formik.touched.unit_type && formik.errors.unit_type
                    }
                  />
                </div>

                {/* Third Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="floor"
                    label="Floor"
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "floor",
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    onBlur={formik.handleBlur}
                    value={floorsList?.find(
                      (option) => option.value === formik.values.floor
                    )}
                    isClearable={true}
                    isSearchable={true}
                    options={floorsList}
                    placeholder="Select unit floor ..."
                    isLoading={floorsLoading}
                    isMulti={false}
                    errorMessage={formik.touched.floor && formik.errors.floor}
                  />
                </div>
                <div className="flex p-3">
                  <Input
                    name="area"
                    type="number"
                    label="Area (m²)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.area}
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
                  disabled={
                    isUpdatingMode
                      ? updateUnitMutation.isLoading
                      : addUnitMutation.isLoading
                  }
                >
                  {isUpdatingMode
                    ? updateUnitMutation.isLoading
                      ? "Updating..."
                      : "Update"
                    : addUnitMutation.isLoading
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>
            {/* <ToastContainer /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UnitNewUpdate;
