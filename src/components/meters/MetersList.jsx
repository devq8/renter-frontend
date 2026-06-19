import React, { useState } from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import SearchBox from "../../utils/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { getMeters } from "../../utils/api/meters";
import MeterRow from "./MeterRow";
import { useNavigate } from "react-router";
import Button from "../../utils/Button";

const PAGE_SIZE = 10; // match your backend default if different

function MetersList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["meters", { page, search, pageSize: PAGE_SIZE }],
    queryFn: () => getMeters({ page, pageSize: PAGE_SIZE, search }),
    keepPreviousData: true,
  });

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // const metersList = meters?.data.map((meter) => {
  //   //   meters?.data
  //   // ?.filter((meter) => {
  //   //   if (search === "") {
  //   //     return meter;
  //   //   } else if (
  //   //     meter.meter_number.toLowerCase().includes(search.toLowerCase())
  //   //   ) {
  //   //     return meter;
  //   //   }
  //   // })
  //   // .map((meter) => {
  //   return <MeterRow key={meter.id} meter={meter} />;
  // });
  // });

  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Meters", url: "/meters" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Meters{" "}
              {isFetching ? (
                <span className="text-sm text-gray-400">(updating…)</span>
              ) : null}
            </h1>
            <div className="flex">
              <div onClick={() => navigate("/meters/bulk_readings")}>
                <Button color="#BD9A5F" text="Enter Bulk Readings" type="add" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={"Search meter by meter number"}
            onChange={handleSearch}
            value={search}
          />
          {error && (
            <div className="m-5 p-4 rounded border border-red-200 bg-red-50 text-red-700">
              Failed to load meters.
            </div>
          )}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-4 font-medium text-gray-900"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Number
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
                    Last Reading
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Last Reading Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    %
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Units
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-6" colSpan={7}>
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6" colSpan={7}>
                      No meters found.
                    </td>
                  </tr>
                ) : (
                  items.map((meter) => (
                    <MeterRow key={meter.id} meter={meter} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default MetersList;
