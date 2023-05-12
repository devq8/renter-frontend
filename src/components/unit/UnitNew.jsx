import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import "flowbite";
import Select from "react-select";
import apiProperties from "../../utils/api/properties";
import api from "../../utils/api/units";
import utils from "../../utils/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../utils/form/Input";
import Dropdown from "../../utils/form/Dropdown";
import Validation from "./Validation";

function UnitNew() {
  const navigate = useNavigate();
  const { id: propertyId } = useParams();

  const {
    data: property,
    isLoading: PropertyLoading,
    error: PropertyError,
  } = useQuery(["propertyOverview", propertyId], () =>
    apiProperties.getPropertyOverview(propertyId)
  );
  // console.log(property?.data);

  const propertyDetails = property?.data;

  const [errors, setErrors] = useState({});
  console.log(errors);
  const queryClient = useQueryClient();

  const addUnitMutation = useMutation((unit) => api.addUnit(unit, propertyId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["units", propertyId]);
      navigate(`/properties/${propertyId}`);
      toast.success("Property added successfully");
    },
    onError: (error) => console.log(error.response.data.name[0]),
  });

  const {
    data: types,
    isLoading: typesLoading,
    error: typesError,
  } = useQuery(["types"], () => utils.getUnitTypes());
  const typesList = types && types.data ? types.data.map((type) => type) : [];

  const {
    data: floors,
    isLoading: floorsLoading,
    error: floorsError,
  } = useQuery(["floors"], () => utils.getFloors());
  const floorsList =
    floors && floors.data ? floors.data.map((floor) => floor) : [];

  const [unit, setUnit] = useState({
    number: "",
    unit_type: "",
    floor: "",
    area: 0,
  });
  const [selectedType, setSelectedType] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  function handleSelectedTypeChange(selected) {
    setSelectedType(selected);
    if (selected !== null) {
      setUnit({ ...unit, unit_type: selected.value });
    } else if (selected === null) {
      setUnit({ ...unit, unit_type: "" });
    }
  }

  function handleSelectedFloorChange(selected) {
    setSelectedFloor(selected);
    if (selected !== null) {
      setUnit({ ...unit, floor: selected.value });
    } else if (selected === null) {
      setUnit({ ...unit, floor: "" });
    }
  }

  function handleCancel() {
    navigate(`/properties/${propertyId}`);
  }

  const handleChange = (event) => {
    setUnit({ ...unit, [event.target.name]: event.target.value });
    console.log(unit);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(unit);
    setErrors(Validation(unit));
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      console.log("No errors ");
      addUnitMutation.mutate(unit);
      toast.success("Unit Added Successfully"); //Not working!!
    }
  };

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
              { title: "Add New Unit", url: "" },
            ]}
          />
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Add New Unit
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
                    onChange={handleChange}
                    required={true}
                    errorMessage={errors.number}
                    // pattern="^[4-6,9][0-9]{7}$"
                  />
                </div>

                {/* Second Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="unit_type"
                    label="Unit type"
                    isClearable={true}
                    isSearchable={true}
                    options={typesList}
                    placeholder="Select unit's type ..."
                    onChange={handleSelectedTypeChange}
                    value={selectedType}
                    isMulti={false}
                    errorMessage={errors.unit_type}
                  />
                  {/* <Input
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="e.g. Block 1 - Ibn Khaldoun Street - Building No. 32"
                    onChange={handleChange}
                    required={false}
                  /> */}
                </div>

                {/* Third Row */}
                <div className="flex p-3">
                  <Dropdown
                    name="floor"
                    label="Floor"
                    isClearable={true}
                    isSearchable={true}
                    options={floorsList}
                    placeholder="Select unit floor ..."
                    onChange={handleSelectedFloorChange}
                    value={selectedFloor}
                    isMulti={false}
                    errorMessage={errors.floor}
                  />
                </div>
                <div className="flex p-3">
                  <Input
                    name="area"
                    type="number"
                    label="Area (m²)"
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

export default UnitNew;
