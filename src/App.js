import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./components/auth/Signin";
import ForgetPassword from "./components/auth/ForgetPassword";
import Signup from "./components/auth/Signup";
import TenantSignup from "./components/auth/TenantSignup";
import Layout from "./components/Layout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-gb";
import Home from "./components/home/Home";
import PrivacyPolicy from "./components/privacypolicy/PrivacyPolicy";
import "./assets/css/tailwind.css";
import "./assets/scss/tailwind.scss";
import "./assets/scss/icons.scss";
import Checkout from "./components/checkout/Checkout";
import Status from "./components/checkout/Status";
import PaymentDetails from "./components/invoices/PaymentDetails";
import { ToastContainer } from "react-toastify";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";
import ResetPassword from "./components/auth/ResetPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
        <GlobalStyles
          styles={{
            ":root": {
              "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
              "--Cover-width": "50vw", // must be `vw` only
              "--Form-maxWidth": "800px",
              "--Transition-duration": "0.4s", // set to `none` to disable transition
            },
          }}
        />

        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Layout />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/reset-password/:uid/:reset_token"
              element={<ResetPassword />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/tenant/:uid" element={<TenantSignup />} />
            <Route path="/checkout/response" element={<PaymentDetails />} />
            <Route path="/" element={<Home />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
