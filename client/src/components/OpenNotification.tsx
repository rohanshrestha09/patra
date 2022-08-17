import { Alert } from "flowbite-react";
import React, { useContext } from "react";
import { HiInformationCircle } from "react-icons/hi";
import userContext from "../utils/userContext";

const OpenNotification: React.FC = () => {
  const { isAlert, setIsAlert } = useContext<any>(userContext);

  if (isAlert.isOpen)
    setTimeout(() => {
      setIsAlert({ ...isAlert, isOpen: false });
    }, 3000);

  return (
    <div
      className={`w-11/12 md:w-[60rem] ${
        isAlert.isOpen
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } absolute top-0 z-50 transition-all`}
    >
      <Alert
        color={isAlert.type}
        icon={HiInformationCircle}
        onDismiss={() => setIsAlert({ ...isAlert, isOpen: false })}
      >
        <span className="font-medium">{isAlert.title}</span>
      </Alert>
    </div>
  );
};

export default OpenNotification;
