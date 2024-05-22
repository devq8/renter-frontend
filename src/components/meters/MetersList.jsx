import React, { useState } from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import SearchBox from "../../utils/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { getMeters } from "../../utils/api/meters";
import MeterRow from "./MeterRow";

function MetersList() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const {
    data: meters,
    isLoading,
    error,
  } = useQuery(["meters"], () => getMeters());

  console.log("Meters List:", meters?.data);

  const metersList = (
    //   meters?.data
    // ?.filter((meter) => {
    //   if (search === "") {
    //     return meter;
    //   } else if (
    //     meter.meter_number.toLowerCase().includes(search.toLowerCase())
    //   ) {
    //     return meter;
    //   }
    // })
    // .map((meter) => {
    <MeterRow />
  );
  // });

  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Meters", url: "/meters" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Meters
            </h1>
            {/* <div onClick={() => navigate("/invoices/new_invoice")}>
              <Button color="#BD9A5F" text="Add New Invoice" type="add" />
            </div> */}
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={"Search meter by meter number"}
            onChange={handleSearch}
          />
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-4 font-medium text-gray-900"
                  >
                    Invoice No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Tenant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Property
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
                    Unit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-end"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 flex justify-center items-center"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {metersList}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default MetersList;
