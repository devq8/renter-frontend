import TenantList from "./tenants/TenantList";
import AddTenent from "./tenants/AddTenent";
import PropertyList from "./properties/PropertyList";
import ContractList from "./contracts/ContractList";
import InvoiceList from "./invoices/InvoiceList";
import Dashboard from "./dashboard/Dashboard";
import { Route, Routes, useNavigate, useParams } from "react-router";
import Navbar from "./navbar/Navbar";
import { useUser } from "../utils/auth";
import PropertyDetails from "./properties/PropertyDetails";
import ContractDetails from "./contracts/ContractDetails";
import InvoiceDetails from "./invoices/InvoiceDetails";
import InvoiceView from "./mobile/InvoiceView";
import Footer from "./home/components/Footer";
import ContractNew from "./contracts/ContractNew";
import PaymentForm from "./invoices/PaymentForm";
import PaymentReturn from "./invoices/PaymentReturn";
import PropertyNew from "./properties/PropertyNew";
import UnitNew from "./unit/UnitNew";
import InvoiceNew from "./invoices/InvoiceNew";
import Checkout from "./checkout/Checkout";
import Status from "./checkout/Status";
import ConnectionChecker from "../utils/ConnectionChecker";
import Receipt from "./invoices/Receipt";

export default function Layout() {
  const navigate = useNavigate();
  const user = useUser();

  if (!user?.data) navigate("/signin");

  let { lan } = useParams();
  !lan ? (lan = "en") : (lan = lan);
  const profile = user?.data;
  // const { first_name, email } = profile;
  const first_name = profile?.first_name;
  const email = profile?.email;

  return (
    <>
      <div
        className={`min-h-[100vh] bg-[#F7F6F2] lg:pt-4 ${
          lan == "en" ? "text-left" : "text-right"
        }`}
      >
        <Navbar first_name={first_name} email={email} />
        <ConnectionChecker>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="/tenants/new" element={<AddTenent />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/properties/new" element={<PropertyNew />} />
            <Route path="/properties/:id/new" element={<UnitNew />} />
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/:id" element={<ContractDetails />} />
            <Route path="/contracts/:id/new" element={<InvoiceNew />} />
            <Route path="/contracts/:id/checkout" element={<Checkout />} />
            <Route path="/contracts/new" element={<ContractNew />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceNew />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/mobile/:id" element={<InvoiceView />} />
            <Route path="/invoices/:id/pay" element={<PaymentForm />} />
            <Route path="/invoices/:id/return" element={<PaymentReturn />} />
            <Route path="/invoices/:paymentid/receipt" element={<Receipt />} />
            <Route path="/checkout/response" element={<Status />} />
          </Routes>
        </ConnectionChecker>
        <Footer />
      </div>
    </>
  );
}
