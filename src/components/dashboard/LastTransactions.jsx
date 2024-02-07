import React from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import { changeAmountFormat } from "../../utils/format";

function LastTransactions() {
  const navigate = useNavigate();

  function handleInvoicesList() {
    navigate(`/invoices`);
  }

  const { data: invoices } = useQuery(["invoices"], () => api.getInvoices());

  const invoicesList = invoices?.data
    // Error when invoices has no payment, need to be fixed
    // ?.sort(
    //   (a, b) =>
    //     new Date(b.payment.payment_date) - new Date(a.payment.payment_date)
    // )
    // ?.slice(0, 10)
    ?.map((invoice) => {
      return (
        <tr key={invoice.id}>
          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
            <span className="font-semibold">
              {`${invoice.contract.tenant.user.first_name} ${invoice.contract.tenant.user.last_name}`}
            </span>
          </td>
          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
            {invoice.contract.unit.property_fk.name}
          </td>
          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
            {invoice.contract.unit.number}
          </td>
          <td className="flex p-4 whitespace-nowrap text-sm font-semibold text-gray-900 justify-between">
            <div className="mx-1">KD</div>
            {changeAmountFormat(invoice.invoice_amount)}
          </td>
        </tr>
      );
    });

  return (
    <div className="flex-1 mx-2 bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Latest Invoices
          </h3>
          <span className="text-base font-normal text-gray-500">
            This is a list of latest paid invoices
          </span>
        </div>
        <div className="flex-shrink-0">
          <a
            onClick={handleInvoicesList}
            className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
            style={{
              cursor: "pointer",
            }}
          >
            View all invoices
          </a>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tenant
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Property
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Unit
                    </th>
                    <th
                      scope="col"
                      className="flex justify-end p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">{invoicesList}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LastTransactions;
