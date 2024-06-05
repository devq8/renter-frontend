import TenantList from "./tenants/TenantList";
import TenantNewUpdate from "./tenants/TenentNewUpdate";
import PropertyList from "./properties/PropertyList";
import ContractList from "./contracts/ContractList";
import InvoiceList from "./invoices/InvoiceList";
import Dashboard from "./dashboard/Dashboard";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from "react-router";
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
import PropertyNewUpdate from "./properties/PropertyNewUpdate";
import UnitNewUpdate from "./unit/UnitNewUpdate";
import InvoiceNew from "./invoices/InvoiceNew";
import ConnectionChecker from "../utils/ConnectionChecker";
import Receipt from "./invoices/Receipt";
import Checkout from "./checkout/Checkout";
import Payments from "./invoices/Payments";
import PaymentDetails from "./invoices/PaymentDetails";
import MetersList from "./meters/MetersList";
import MeterBulkReadings from "./meters/MeterBulkReadings";
import ContractEnd from "./contracts/ContractEnd";
import PaymentList from "./payments/PaymentList";

export default function Layout() {
  const navigate = useNavigate();
  const user = useUser();
  const location = useLocation();

  // Check if the current route is the Checkout page
  const isCheckoutPage =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/payments");

  if (!user?.data && !isCheckoutPage) navigate("/signin");

  let { lan } = useParams();
  !lan ? (lan = "en") : (lan = lan);
  const profile = user?.data;
  // const { first_name, email } = profile;
  const first_name = profile?.first_name;
  const email = profile?.email;

  return (
    <>
      <div
        className={`min-h-[100vh] bg-[#F7F6F2] ${
          !isCheckoutPage && "lg: pt-4"
        } ${lan == "en" ? "text-left" : "text-right"}`}
      >
        {!isCheckoutPage && <Navbar first_name={first_name} email={email} />}
        <ConnectionChecker>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="/tenants/:id/update" element={<TenantNewUpdate />} />
            <Route path="/tenants/new_tenant" element={<TenantNewUpdate />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route
              path="/properties/:id/update"
              element={<PropertyNewUpdate />}
            />
            <Route
              path="/properties/new_property"
              element={<PropertyNewUpdate />}
            />
            <Route
              path="/properties/:propertyId/new_unit"
              element={<UnitNewUpdate />}
            />
            <Route
              path="/properties/:propertyId/units/:unitId/update"
              element={<UnitNewUpdate />}
            />
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/:id" element={<ContractDetails />} />
            <Route path="/contracts/:id/new_invoice" element={<InvoiceNew />} />
            <Route path="/contracts/:id/end" element={<ContractEnd />} />
            <Route
              path="/checkout/:unique_payment_identifier"
              element={<Checkout />}
            />
            <Route
              path="/payments/:unique_payment_identifier"
              element={<Payments />}
            />
            <Route
              path="/payments/:unique_payment_identifier/:payment_id"
              element={<PaymentDetails />}
            />
            <Route path="/contracts/new_contract" element={<ContractNew />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/mobile/:id" element={<InvoiceView />} />
            <Route path="/invoices/:id/pay" element={<PaymentForm />} />
            <Route path="/invoices/:id/return" element={<PaymentReturn />} />
            <Route path="/invoices/:paymentid/receipt" element={<Receipt />} />
            <Route path="/payment" element={<PaymentList />} />
            <Route path="/meters" element={<MetersList />} />
            <Route
              path="/meters/bulk_readings"
              element={<MeterBulkReadings />}
            />
          </Routes>
        </ConnectionChecker>
        <Footer />
      </div>
    </>
  );
}
