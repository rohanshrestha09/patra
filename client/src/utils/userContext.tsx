import { Types } from "mongoose";
import React, { createContext } from "react";

interface context {
  user: {
    _id: string | Types.ObjectId;
    createdAt: string;
    creation: string;
    email: string;
    fullname: string;
    imgUrl: string;
    updatedAt: string;
  };
  userLogout: () => void;
  alert: { isOpen: boolean; title: string; type: string };
  setAlert: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; title: string; type: string }>
  >;
}

const userContext = createContext<context | any>(null);

export default userContext;
