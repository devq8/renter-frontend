import React, { useState, useEffect } from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import { getInvoicesPage } from "../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import InvoiceRow from "./InvoiceRow";
import Spinner from "../../utils/Spinner";
import SearchBox from "../../utils/SearchBox";
import Filter from "../../utils/Filter";
// import Box from "@mui/material/Box";
// import { DataGrid } from "@mui/x-data-grid";

const PAGE_SIZE = 20;

function InvoiceList() {
  // Raw search input vs the debounced term that actually hits the backend.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [property, setProperty] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSearch = (e) => setSearchInput(e.target.value);

  function invoiceStatusOnChange(e) {
    setInvoiceStatus(e.target.value);
    setPage(1);
  }
  function propertyOnChange(e) {
    setProperty(e.target.value);
    setPage(1);
  }
  function invoiceTypeOnChange(e) {
    setInvoiceType(e.target.value);
    setPage(1);
  }
  // Payment-method filter isn't supported by the invoices endpoint.
  function paymentMethodOnChange() {}

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [
      "invoices",
      { page, search, invoiceStatus, property, invoiceType, pageSize: PAGE_SIZE },
    ],
    queryFn: () =>
      getInvoicesPage({
        page,
        pageSize: PAGE_SIZE,
        search,
        status: invoiceStatus,
        property,
        invoiceType,
      }),
    keepPreviousData: true,
  });

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const invoicesList = items.map((invoice) => {
    return (
      <InvoiceRow
        key={invoice.id}
        id={invoice.id}
        tenant={invoice.contract.tenant}
        property={invoice.contract.unit.property_fk}
        floor={invoice.contract.unit.floor}
        unit={invoice.contract.unit.number}
        type={invoice.invoice_type}
        amount={invoice.payable_amount}
        status={invoice.invoice_status}
        date={invoice.due_date}
        paymentDate={invoice.payment_date}
      />
    );
  });

  return (
    <div className="">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Invoices", url: "/invoices" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Invoices
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
            placeholder={
              "Search invoice by tenant name, mobile, property, floor, unit, or invoice type"
            }
            onChange={handleSearch}
            value={searchInput}
          />

          <Filter
            invoiceStatusOnChange={invoiceStatusOnChange}
            propertyOnChange={propertyOnChange}
            invoiceTypeOnChange={invoiceTypeOnChange}
            paymentMethodOnChange={paymentMethodOnChange}
          />
          {error && (
            <div className="m-5 p-4 rounded border border-red-200 bg-red-50 text-red-700">
              Failed to load invoices.
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <div>
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
                        className="px-6 py-4 font-medium text-gray-900 text-left"
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
                    {items.length === 0 ? (
                      <tr>
                        <td className="px-6 py-6" colSpan={9}>
                          No invoices found.
                        </td>
                      </tr>
                    ) : (
                      invoicesList
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mx-5 mb-5 text-sm text-gray-600">
                <span>
                  {count} invoice{count === 1 ? "" : "s"}
                  {isFetching ? " · updating…" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-md border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-md border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default InvoiceList;
