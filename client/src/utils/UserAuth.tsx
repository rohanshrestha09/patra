import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";
import UserContext from "./userContext";
import { AUTH } from "../constant";

const UserAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    type: "",
  });

  const { data: user, refetch } = useQuery({
    queryFn: auth,
    queryKey: [AUTH],
    retry: false,
    onError: () => navigate("/signup"),
  });

  const userLogout = () => {
    localStorage.removeItem("token");
    refetch();
    navigate("/signup");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userLogout,
        alert,
        setAlert,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
