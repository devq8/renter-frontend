import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../utils/auth";
import Input from "../../utils/form/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendResetPasswordLink } from "../../utils/api/utils";
import { toast } from "react-toastify";

function ForgetPasswordForm() {
  const navigate = useNavigate();

  const [IsLoading, setIsLoading] = useState(false);
  const [ResetError, setResetError] = useState("");
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleSignUp() {
    navigate("/signup");
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address!").required("Required!"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setResetError("");
      setSuccessMessage("");

      // Use the sendResetPasswordLink function to send the reset request
      sendResetPasswordLink(values.email)
        .then((response) => {
          console.log("response", response);
          setIsLoading(false);
          setSuccessMessage(
            "A reset link has been sent to your email address."
          );
          toast.success(response.data.message);
          setShowConfirmation(true);
        })
        .catch((error) => {
          setIsLoading(false);
          setShowConfirmation(false);
          if (error.response && error.response.status === 400) {
            console.log("error.response.data", error.response.data);
            setResetError(error.response.data.error);
            toast.error(error.response.data.error);
          } else {
            console.log("error", error);
            setResetError(error.response.data.error);
            toast.error(error.response.data.error);
          }
        });
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md px-4 py-8 bg-transparent rounded-lg sm:px-6 md:px-8 lg:px-10">
      {showConfirmation ? (
        <>
          <div className="self-start text-3xl font-bold text-[#1C1F2A]">
            Reset password link has been sent
          </div>
          <div className="mt-5 mb-5 text-[#000000] font-thin">
            Check your email for further instructions.
          </div>
          <div className="flex items-center justify-center mt-6">
            <Link
              to="/signin"
              className="inline-flex items-center font-thin text-center text-[#000000] hover:text-gray-700 "
            >
              <span className="">Back to Sign In</span>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="self-start mb-1 text-3xl font-bold text-[#1C1F2A] sm:text-3xl">
            Forget Your Password?
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
              <div className="flex w-full mt-5">
                <button
                  type="submit"
                  className="py-3 px-4  bg-[#BD9A5F] hover:bg-[#BD9A5F] hover:opacity-90 focus:ring-[#BD9A5F] focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  disabled={IsLoading}
                >
                  {IsLoading ? "Sending email ..." : "Send Reset Link"}
                </button>
              </div>
              {ResetError && (
                <div className="text-red-600 mt-2">{ResetError}</div>
              )}
              {SuccessMessage && (
                <div className="text-green-600 mt-2">{SuccessMessage}</div>
              )}
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
        </>
      )}
    </div>
  );
}

export default ForgetPasswordForm;
