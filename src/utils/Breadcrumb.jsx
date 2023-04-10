import React from "react";
import { useNavigate } from "react-router";

function Breadcrumb({ main, sub = [] }) {
  const navigate = useNavigate();
  function handleNavigationClick(item) {
    console.log(item);
    navigate(`/${item.toLowerCase()}`);
  }
  return (
    <nav
      className="flex bg-transparent text-gray-700 border border-none py-3 px-0 rounded-lg "
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center "
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <a
              // style={{
              //   cursor: "pointer",
              // }}
              className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium "
            >
              {main}
            </a>
          </div>
        </li>
        {sub?.map((item) => {
          return (
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-gray-400 ml-1 md:ml-2 text-sm font-medium ">
                  {item}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
