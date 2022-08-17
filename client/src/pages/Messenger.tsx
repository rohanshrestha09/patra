import React, { useState } from "react";
import Inbox from "../components/Inbox";
import OpenNotification from "../components/OpenNotification";
import Preview from "../components/Preview";

const Messenger: React.FC = () => {
  const [inboxToggle, setInboxToggle] = useState<boolean>(false);

  const [getId, setGetId] = useState<string>("");

  return (
    <div className="min-h-screen max-w-screen font-sans flex items-center justify-center bg-slate-100 text-black">
      <OpenNotification />

      <div className="md:w-[63rem] w-full md:h-[94vh] h-screen grid grid-rows-1 grid-cols-6 md:rounded-xl bg-white shadow-lg shadow-slate-400">
        <Preview
          inboxToggle={inboxToggle}
          setInboxToggle={setInboxToggle}
          setGetId={setGetId}
        />

        <Inbox
          getId={getId}
          inboxToggle={inboxToggle}
          setInboxToggle={setInboxToggle}
        />
      </div>
    </div>
  );
};

export default Messenger;
