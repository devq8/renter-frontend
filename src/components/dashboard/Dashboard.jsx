import { useQuery } from "@tanstack/react-query";
import React from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import RentCollectionsChart from "./RentCollectionsChart";
import RentCollectionsBars from "./RentCollectionsBars";
import LastTransactions from "./LastTransactions";

export default function Dashboard() {
  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Dashboard", url: "/" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="md:flex md:mx-auto md:max-w-7xl md:py-3 mt-4 p-2">
          <div className="flex flex-col space-y-4 md:w-[50%] md:me-1 mx-2 mb-4">
            <RentCollectionsChart />
            <RentCollectionsBars />
          </div>
          <div className="flex flex-col space-y-4 md:w-[50%] md:ms-1">
            <LastTransactions />
          </div>
        </div>
      </main>
    </>
  );
}
