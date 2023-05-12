import React, { useState, useEffect } from "react";
import Disconnect from "../assets/images/disconnect.png";
import api from "./api/index";

function ConnectionChecker({ children }) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(api.defaults.baseURL);
        if (response.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  if (!isConnected) {
    return (
      <div className="flex flex-col h-[76vh] items-center justify-start space-y-4">
        <img
          src={Disconnect}
          alt="disconnect"
          className="lg:w-1/4 sm:w-full md:w-1/4 mt-4"
        />
        <h1 className="text-7xl">Oops...</h1>
        <h1 className="text-xl m-2">Looks like something went wrong.</h1>
        <h1 className="text-xl m-2">We're working on it.</h1>
      </div>
    );
  }

  return <>{children}</>;
}

export default ConnectionChecker;
