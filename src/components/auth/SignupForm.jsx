import React from "react";

function SignupForm() {
  return (
    <div class="flex flex-col max-w-md px-4 py-8 bg-transparent rounded-lg sm:px-6 md:px-8 lg:px-10">
      <div class="self-start px-6 mb-1 text-3xl font-Bold text-[#1C1F2A] sm:text-3xl">
        Create a new account
      </div>

      <div class="p-6 mt-6">
        <form action="#">
          <div class="flex gap-4 mb-2">
            <div class=" relative ">
              <input
                type="text"
                id="create-account-first-name"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                name="First name"
                placeholder="First name"
              />
            </div>
            <div class=" relative ">
              <input
                type="text"
                id="create-account-last-name"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                name="Last name"
                placeholder="Last name"
              />
            </div>
          </div>
          <div class="flex flex-col mb-2">
            <div class=" relative ">
              <input
                type="text"
                id="create-account-email"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                placeholder="Email"
              />
            </div>
          </div>
          <div class="flex flex-col mb-2">
            <div class=" relative ">
              <input
                type="tel"
                id="create-account-mobile"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                placeholder="Mobile"
              />
            </div>
          </div>
          <div class="flex flex-col mb-2">
            <div class=" relative ">
              <input
                type="password"
                id="create-account-password"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                name="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="flex flex-col mb-2">
            <div class=" relative ">
              <input
                type="password"
                id="confirm-password"
                class=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#BD9A5F] focus:border-transparent"
                name="confirm-password"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div class="flex w-full my-4">
            <button
              type="submit"
              class="py-3 px-4  bg-[#BD9A5F] hover:bg-[#BD9A5F] hover:opacity-80 focus:ring-[#BD9A5F] focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Sign Up
            </button>
          </div>
          <span class="justify-center text-sm text-center text-[#52555C] flex-items-center ">
            Already have an account ?
            <a
              href=""
              //   target="_blank"
              class="text-sm text-[#818FC2] underline hover:text-[#818FC2] hover:opacity-80"
            >
              Sign in
            </a>
          </span>
        </form>
        {/* <div class="flex items-center justify-center mt-6"></div> */}
      </div>
    </div>
  );
}

export default SignupForm;
