import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../utils/api/properties";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import SearchBox from "../../utils/SearchBox";
import Spinner from "../../utils/Spinner";
import UnitRow from "../unit/UnitRow";
import format from "../../utils/format";

function PropertyDetails() {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const {
    data: property,
    isLoading: PropertyLoading,
    error: PropertyError,
  } = useQuery(["propertyOverview", propertyId], () =>
    api.getPropertyOverview(propertyId)
  );

  const propertyDetails = property?.data;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const {
    data: units,
    isLoading,
    error,
  } = useQuery(["units", propertyId], () => api.getUnitsList(propertyId));

  const unitsList = units?.data
    ?.filter((unit) => {
      if (search === "") {
        return unit;
      } else if (
        unit.number.toLowerCase().includes(search.toLowerCase()) ||
        unit.unit_type.toLowerCase().includes(search.toLowerCase()) ||
        unit.floor.toLowerCase().includes(search.toLowerCase()) ||
        unit.active_contract?.tenant.user.mobile
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return unit;
      }
    })
    .map((unit) => {
      return (
        <UnitRow
          key={unit.id}
          id={unit.id}
          property={propertyId}
          floor={unit.floor}
          number={unit.number}
          type={unit.unit_type}
          vacant={unit.vacant}
          tenantFirstName={unit.active_contract?.tenant.user.first_name}
          tenantLastName={unit.active_contract?.tenant.user.last_name}
          rent={unit.active_contract?.rent}
          startPeriod={unit.active_contract?.start_date}
          endPeriod={unit.active_contract?.end_date}
          overdueAmount={unit.active_contract?.total_pending_amount}
        />
      );
    });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Properties", url: "/properties" }}
            sub={[{ title: `${propertyDetails?.name}`, url: "" }]}
          />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {propertyDetails?.name} Details
            </h1>
            <div className="flex">
              <div
                onClick={() =>
                  navigate(`/properties/${propertyDetails.id}/update`)
                }
              >
                <Button color="#52555C" text="Edit Property" type="edit" />
              </div>
              <div
                onClick={() =>
                  navigate(`/properties/${propertyDetails.id}/new_unit`, {
                    state: { propertyDetails },
                  })
                }
              >
                <Button color="#BD9A5F" text="Add New Unit" type="add" />
              </div>
            </div>
          </div>
          <div className="flex bg-transparent h-[122px] items-center rounded-md mt-4">
            <div className="flex flex-row justify-between bg-[#F7F7F7] h-[100%] w-[50%] mx-2 rounded-md border-[13px] border-white">
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-4">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Area</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 w-28">
                  {propertyDetails?.area ?? "N/A"}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Address</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1">
                  {propertyDetails?.address ?? "N/A"}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 pr-10 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Owner Name</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 w-28">
                  {propertyDetails?.owner_name[0] ?? "N/A"}
                </h1>
              </div>
            </div>
            <div className="flex flex-row justify-between bg-[#F7F7F7] h-[100%] w-[50%] mx-2 rounded-md border-[13px] border-white">
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-4">
                <h1 className="text-[#AEB3C2] text-sm font-bold">
                  Total Rents
                </h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1">
                  {`KD ${format.changeAmountFormat(
                    propertyDetails?.total_rents,
                    0
                  )}`}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Last Month</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1">
                  {`KD ${format.changeAmountFormat(
                    propertyDetails?.last_month_rents,
                    0
                  )}`}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">
                  Total Units
                </h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                  {propertyDetails?.number_of_units}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 px-5 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">
                  Vacant Units
                </h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                  {propertyDetails?.vacancies}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={
              "Search unit by number, type, floor, tenant name or mobile ..."
            }
            onChange={handleSearch}
          />
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Unit No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Floor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Tenant Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Rent Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Contract Period
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Overdue Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Edit
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Delete
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {unitsList}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PropertyDetails;
