import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import TenantSignup from "./components/auth/TenantSignup";
import Layout from "./components/Layout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-gb";
import Home from "./components/home/Home";
import "./assets/css/tailwind.css";
import "./assets/scss/tailwind.scss";
import "./assets/scss/icons.scss";
import Checkout from "./components/checkout/Checkout";
import Status from "./components/checkout/Status";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Layout />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/tenant/:uid" element={<TenantSignup />} />
            {/* <Route path="/contracts/:id/checkout" element={<Checkout />} /> */}
            <Route path="/checkout/response" element={<Status />} />
            <Route path="/" element={<Home />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
