import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../utils/auth";
import Input from "../../utils/form/Input";
import { useFormik } from "formik";
import * as Yup from "yup";

function SigninForm() {
  const navigate = useNavigate();

  const login = useLogin();

  const [IsLoading, setIsLoading] = useState(false);
  const [LoginError, setLoginError] = useState("");

  function handleSignUp() {
    navigate("/signup");
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address!").required("Required!"),
      password: Yup.string().required("Required!"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setLoginError("");

      login.mutate(values, {
        onError: (error) => {
          console.log(`There's an error: ${error.message}`);
          setLoginError(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          console.log("Logged in successfully!");
          navigate("/dashboard");
          setIsLoading(false);
        },
      });
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md px-4 py-8 bg-transparent rounded-lg sm:px-6 md:px-8 lg:px-10">
      <div className="self-start mb-1 text-3xl font-bold text-[#1C1F2A] sm:text-3xl">
        Sign In
      </div>
      <div className="mt-8">
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col mb-2">
            <div className="flex-col">
              <div className="flex relative">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                  placeholder="Your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              <div className="flex justify-end">
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {formik.touched.email && formik.errors.email}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-6">
            <div className="flex-col">
              <div className="flex relative">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                  placeholder="Your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>
              <div className="flex justify-end">
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {formik.touched.password && formik.errors.password}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-6 -mt-4">
            <div className="flex ml-auto">
              <a
                href="#"
                className="inline-flex text-sm font-light text-[#818FC2] sm:text-sm  hover:text-gray-700 "
              >
                Forgot Your Password?
              </a>
            </div>
          </div>
          <div className="flex w-full">
            <button
              type="submit"
              className="py-3 px-4  bg-[#BD9A5F] hover:bg-[#BD9A5F] hover:opacity-90 focus:ring-[#BD9A5F] focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              disabled={IsLoading}
            >
              {IsLoading ? "Signing In ..." : "Sign In"}
            </button>
          </div>
          {LoginError && <div className="text-red-600 mt-2">{LoginError}</div>}
        </form>
      </div>
      <div className="flex items-center justify-center mt-6">
        <a
          onClick={handleSignUp}
          style={{
            cursor: "pointer",
          }}
          className="inline-flex items-center text-sm font-light text-center text-[#818FC2] hover:text-gray-700 "
        >
          <span className="ml-2">You don&#x27;t have an account?</span>
        </a>
      </div>
    </div>
  );
}

export default SigninForm;
