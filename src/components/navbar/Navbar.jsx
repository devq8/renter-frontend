import React from "react";
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DarkLogo from "../../assets/dark-logo.png";
import LightLogo from "../../assets/horizontal.png";
import { useNavigate, useLocation } from "react-router";
import { useLogout } from "../../utils/auth";
import { IoIosStats, IoIosPerson } from "react-icons/io";
import { BsFillBuildingFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
import { IoReceipt } from "react-icons/io5";

const Navbar = () => {
  const logout = useLogout();
  const user = {
    name: "Khaled Alghanim",
    email: "al.ghanim@me.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  const navigation = [
    {
      name: "Dashboard",
      current: true,
      path: "/",
      icon: <IoIosStats className="mr-3" />,
    },
    {
      name: "Tenants",
      current: false,
      path: "/tenants",
      icon: <IoIosPerson className="mr-3" />,
    },
    {
      name: "Properties",
      current: false,
      path: "/properties",
      icon: <BsFillBuildingFill className="mr-3" />,
    },
    {
      name: "Contracts",
      current: false,
      path: "/contracts",
      icon: <AiFillFileText className="mr-3" />,
    },
    {
      name: "Invoices",
      current: false,
      path: "/invoices",
      icon: <IoReceipt className="mr-3" />,
    },
  ];
  const userNavigation = [
    { name: "Your Profile" },
    { name: "Settings" },
    {
      name: "Sign out",
      onClick: () => {
        logout.mutate();
      },
    },
  ];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const navigate = useNavigate();
  const location = useLocation();
  function handleNavigationClick(item) {
    navigate(`${item.path}`);
  }
  console.log(location.pathname);
  return (
    <Disclosure
      as="nav"
      className="bg-white mx-auto max-w-7xl lg:rounded-md md:rounded-md"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 " src={LightLogo} alt="Renter Co." />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-0">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        className={classNames(
                          (location.pathname.includes(item.path) &&
                            item.path !== "/") ||
                            location.pathname === item.path
                            ? "bg-[#F7F6F2] text-[#BD9A5F]"
                            : "text-[#52555C] hover:bg-[#F7F6F2] hover:text-[#BD9A5F]",
                          "px-6 py-7 text-base font-medium flex items-center"
                        )}
                        style={{
                          cursor: "pointer",
                        }}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => handleNavigationClick(item)}
                      >
                        {item.icon}
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="rounded-full bg-[#F7F6F2] p-1 text-[#52555C] hover:text-[#BD9A5F] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#BD9A5F]"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#BD9A5F]">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                onClick={item?.onClick}
                                style={{
                                  cursor: "pointer",
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#BD9A5F] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#BD9A5F]">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  onClick={() => handleNavigationClick(item)}
                  style={{
                    cursor: "pointer",
                  }}
                  className={classNames(
                    (location.pathname.includes(item.path) &&
                      item.path !== "/") ||
                      location.pathname === item.path
                      ? "bg-[#BD9A5F] text-[white]"
                      : "text-[#52555C] hover:bg-[#F7F6F2] hover:text-[#BD9A5F]",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                {/* User Profile */}
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3 space-y-1">
                  <div className="text-base font-medium leading-none text-[#52555C]">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-[#BD9A5F] p-1 text-[#52555C] hover:text-[#52555C] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#52555C]"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    style={{
                      cursor: "pointer",
                    }}
                    as="a"
                    onClick={item?.onClick}
                    className="block rounded-md px-3 py-2 text-base font-medium text-[#52555C] hover:bg-[#F7F6F2] hover:text-[#BD9A5F]"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
