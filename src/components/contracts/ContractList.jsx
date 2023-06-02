import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import api from "../../utils/api/contracts";
import ContractRow from "./ContractRow";
import SearchBox from "../../utils/SearchBox";
import Spinner from "../../utils/Spinner";
import dayjs from "dayjs";

function ContractList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery(["contracts"], () => api.getContracts());
  console.log(contracts?.data);
  const contractsList = contracts?.data
    ?.filter((contract) => {
      if (search === "") {
        return contract;
      } else if (
        contract.tenant.user.first_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        contract.tenant.user.last_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        contract.tenant.user.mobile
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        contract.unit.number.toLowerCase().includes(search.toLowerCase()) ||
        contract.unit.get_floor_display
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        contract.unit.get_unit_type_display
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        contract.unit.property_fk.name
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return contract;
      }
    })
    .map((contract) => {
      return (
        <ContractRow
          key={contract.id}
          id={contract.id}
          unit={contract.unit}
          property={contract.unit.property_fk}
          tenant={contract.tenant}
          status={contract.status}
          flexible={contract.flexible}
          start={contract.start_date}
          end={contract.end_date}
          rent={contract.rent}
          daysToExpire={dayjs(contract.end_date).diff(dayjs(), "day")}
          amountDue={contract.total_pending_amount}
        />
      );
    });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Contracts", url: "/contracts" }}
            sub={[]}
          />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Contracts
            </h1>
            <div onClick={() => navigate("/contracts/new")}>
              <Button color="#BD9A5F" text="Add New Contract" type="add" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8 ">
          <SearchBox
            placeholder={
              "Search contract by tenant name, mobile, floor, type, or property"
            }
            onChange={handleSearch}
          />

          {/* <div className="sm:col-span-3 m-5">
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Country
            </label>
            <div className="mt-2">
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div> */}
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
                      className="px-4 py-4 font-medium text-gray-900"
                    >
                      No
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
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Ends In
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 text-center"
                    >
                      Amount Due
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 text-center"
                    >
                      Rent
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
                  {contractsList}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ContractList;
