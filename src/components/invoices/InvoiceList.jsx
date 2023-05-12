import React, { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import api from "../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import InvoiceRow from "./InvoiceRow";
import Spinner from "../../utils/Spinner";
import SearchBox from "../../utils/SearchBox";
import Filter from "../../utils/Filter";

function InvoiceList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [invoiceStatus, setInvoiceStatus] = useState("");
  function invoiceStatusOnChange(e) {
    setInvoiceStatus(e.target.value);
  }

  const [property, setProperty] = useState("");
  function propertyOnChange(e) {
    setProperty(e.target.value);
  }

  const [invoiceType, setInvoiceType] = useState("");
  function invoiceTypeOnChange(e) {
    setInvoiceType(e.target.value);
  }

  const [paymentMethod, setPaymentMethod] = useState("");
  function paymentMethodOnChange(e) {
    setPaymentMethod(e.target.value);
  }

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery(["invoices"], () => api.getInvoices());

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const invoicesList = invoices?.data
    ?.filter((invoice) => {
      if (search === "") {
        return invoice;
      } else if (
        invoice.contract.tenant.user.first_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        invoice.contract.tenant.user.last_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        invoice.id.toString().includes(search.toLowerCase()) ||
        invoice.contract.unit.property_fk.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        invoice.contract.unit.floor
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        invoice.contract.unit.number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        invoice.get_type_display.toLowerCase().includes(search.toLowerCase()) ||
        invoice.get_invoice_status_display
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return invoice;
      }
    })
    .filter((invoice) => {
      if (invoiceStatus === "") {
        return invoice;
      } else if (
        invoice.get_invoice_status_display.toLowerCase() ===
        invoiceStatus.toLowerCase()
      ) {
        return invoice;
      }
    })
    .filter((invoice) => {
      if (property === "") {
        return invoice;
      } else if (
        invoice.contract.unit.property_fk.name.toLowerCase() ===
        property.toLowerCase()
      ) {
        return invoice;
      }
    })
    .filter((invoice) => {
      if (invoiceType === "") {
        return invoice;
      } else if (
        invoice.get_type_display.toLowerCase() === invoiceType.toLowerCase()
      ) {
        return invoice;
      }
    })
    .filter((invoice) => {
      if (paymentMethod === "") {
        return invoice;
      } else if (
        invoice.method_of_payment.toLowerCase() === paymentMethod.toLowerCase()
      ) {
        return invoice;
      }
    })
    .map((invoice) => {
      return (
        <InvoiceRow
          key={invoice.id}
          id={invoice.id}
          tenant={invoice.contract.tenant}
          property={invoice.contract.unit.property_fk}
          floor={invoice.contract.unit.floor}
          unit={invoice.contract.unit.number}
          type={invoice.get_type_display}
          amount={invoice.invoice_amount}
          status={invoice.get_invoice_status_display}
          date={invoice.invoice_date}
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
            {/* <div onClick={() => navigate("/invoices/new")}>
              <Button color="#BD9A5F" text="Add New Invoice" type="add" />
            </div> */}
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <SearchBox
            placeholder={
              "Search invoice by tenant name, mobile, property, floor, unit, invoice type, or status"
            }
            onChange={handleSearch}
          />

          <Filter
            invoiceStatusOnChange={invoiceStatusOnChange}
            propertyOnChange={propertyOnChange}
            invoiceTypeOnChange={invoiceTypeOnChange}
            paymentMethodOnChange={paymentMethodOnChange}
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
                  {invoicesList}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default InvoiceList;
