import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import SearchBox from "../../utils/SearchBox";
import api from "../../utils/api/tenants";
import TenantRow from "./TenantRow";
import { useNavigate } from "react-router";
import Spinner from "../../utils/Spinner";

function TenantList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const {
    data: tenants,
    isLoading,
    error,
  } = useQuery(["tenants"], () => api.getTenants());

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const tenantsList = tenants?.data
    ?.filter((tenant) => {
      if (search === "") {
        return tenant;
      } else if (
        tenant.user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        tenant.user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        tenant.user.mobile?.toLowerCase().includes(search.toLowerCase()) ||
        tenant.cid?.toLowerCase().includes(search.toLowerCase()) ||
        tenant.user.email?.toLowerCase().includes(search.toLowerCase())
      ) {
        return tenant;
      }
    })
    .map((tenant) => {
      return (
        <TenantRow
          key={tenant.user.id}
          firstName={tenant.user.first_name}
          lastName={tenant.user.last_name}
          email={tenant.user.email}
          cid={tenant.cid}
          status={tenant.user.is_active}
          mobile={tenant.user.mobile}
        />
      );
    });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Tenants", url: "/tenants" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tenants
            </h1>
            <div onClick={() => navigate("/tenants/new")}>
              <Button color="#BD9A5F" text="Add New Tenant" type="add" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={"Search tenant by name, mobile, civil ID or email"}
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
                      Name
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
                      Mobile
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Civil ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {tenantsList}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TenantList;
