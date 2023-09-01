import { Alert } from "flowbite-react";
import React, { useContext } from "react";
import { HiInformationCircle } from "react-icons/hi";
import userContext from "../../utils/userContext";

const OpenNotification: React.FC = () => {
  const { alert, setAlert } = useContext(userContext);

  if (alert.isOpen)
    setTimeout(() => {
      setAlert({ ...alert, isOpen: false });
    }, 3000);

  return (
    <div
      className={`w-11/12 md:w-[60rem] ${alert.isOpen
        ? "opacity-1 pointer-events-auto"
        : "opacity-0 pointer-events-none"
        } absolute top-0 z-50 transition-all`}
    >
      <Alert
        color={alert.type}
        icon={HiInformationCircle}
        onDismiss={() => alert({ ...alert, isOpen: false })}
      >
        <span className="font-medium">{alert.title}</span>
      </Alert>
    </div>
  );
};

export default OpenNotification;
