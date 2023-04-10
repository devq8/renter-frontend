import React, { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import api from "../../utils/api/properties";
import { useQuery } from "@tanstack/react-query";
import PropertyRow from "./PropertyRow";
import SearchBox from "../../utils/SearchBox";
import Spinner from "../../utils/Spinner";

function PropertyList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery(["properties"], () => api.getProperties());

  const propertiesList = properties?.data
    ?.filter((property) => {
      if (search === "") {
        return property;
      } else if (
        property.name?.toLowerCase().includes(search.toLowerCase()) ||
        property.get_area_display?.toLowerCase().includes(search.toLowerCase())
      ) {
        return property;
      }
    })
    .map((property) => {
      return (
        <PropertyRow
          id={property.id}
          name={property.name}
          area={property.get_area_display}
          address={property.address}
          owner={property.owner}
        />
      );
    });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={"Properties"} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Properties
            </h1>
            <div onClick={() => navigate("/properties/new")}>
              <Button
                text="Add New Property"
                type="add"
                className_="bg-primary"
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={"Search property by name or area"}
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
                      Property Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Owner
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    ></th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {propertiesList}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PropertyList;
