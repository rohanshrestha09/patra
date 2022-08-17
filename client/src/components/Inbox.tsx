import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { Avatar, Dropdown, Spinner } from "flowbite-react";
import { IoIosArrowBack, IoIosCall, IoMdSend } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import userContext from "../utils/userContext";
import { getMessage, getUserById, sendMessage } from "../api";
import emojiArr from "./emoji";

interface Props {
  inboxToggle: boolean;
  setInboxToggle: React.Dispatch<React.SetStateAction<boolean>>;
  getId: string;
}

const Inbox: React.FC<Props> = ({ inboxToggle, setInboxToggle, getId }) => {
  const [socket, setSocket] = useState<any>(null);

  const { user } = useContext<any>(userContext);

  const [realTimeMessage, setRealTimeMessage] = useState<
    { self: boolean; message: string }[]
  >([]);

  const [hideEmoji, setHideEmoji] = useState<boolean>(true);

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket &&
      socket.on(
        "receive-message",
        ({ from, to, msg }: { from: string; to: string; msg: string }) => {
          if (from === getId && to === user._id)
            setRealTimeMessage((message: any) => [
              { self: false, message: msg },
              ...message,
            ]);
        }
      );
    // eslint-disable-next-line
  }, [socket]);

  const onChange = (e: React.SyntheticEvent): void => {
    const { value } = e.target as HTMLButtonElement;
    setMessage(value);
  };

  const {
    data: messageData,
    isFetching: isMessageFetching,
    isSuccess: isMessageSuccess,
  } = useQuery({
    queryFn: () => getMessage({ from: user && user._id, to: getId }),
    queryKey: ["getMessage", getId],
    enabled: !!getId,
    refetchOnWindowFocus: false,
    onSuccess: () => setSocket(io("/")),
  });

  const { data: receiverProfile } = useQuery({
    queryFn: () => getUserById(getId),
    queryKey: ["getUserById", getId],
    enabled: !!getId,
  });

  const handleSendMessage = useMutation(
    (data: { from: string; to: string; message: string }) => sendMessage(data),
    {
      onSuccess: (data) => {
        socket &&
          socket.emit("send-message", {
            from: user && user._id,
            to: getId,
            msg: message,
          });
        setRealTimeMessage((el: any) => [{ self: true, message }, ...el]);
        setMessage("");
      },
    }
  );

  useEffect(() => {
    if (isMessageSuccess) setRealTimeMessage(messageData);
  }, [isMessageSuccess, messageData]);

  return (
    <div
      className={`${
        inboxToggle ? "flex" : "hidden"
      } h-full md:col-span-4 col-span-full md:flex flex-col justify-between drop-shadow-lg rounded-lg shadow-lg shadow-slate-400`}
    >
      <div className="w-full basis-20 flex justify-between items-center rounded-tl-lg px-6 shadow-lg">
        <IoIosArrowBack
          size={25}
          className="text-slate-700 cursor-pointer"
          onClick={(): void => setInboxToggle(false)}
        />
        <div className="basis-3/4">
          <Avatar
            img={
              receiverProfile && receiverProfile.imgUrl
                ? `data:image/svg+xml;base64,${receiverProfile.imgUrl}`
                : undefined
            }
            rounded={true}
            status="online"
            statusPosition="bottom-right"
          >
            <div className="space-y-1 font-medium">
              <div className="truncate">
                {receiverProfile && receiverProfile.fullname}
              </div>
              <div className="text-sm text-gray-500 truncate">Active Now</div>
            </div>
          </Avatar>
        </div>
        <IoIosCall size={25} className="text-slate-700 mx-3" />
        <div className="flex items-center justify-center">
          <BiDotsVerticalRounded
            size={25}
            className="text-slate-700 absolute -z-10 pointer-events-none"
          />
          <div className="dropdown dropdown-end text-white">
            <label
              tabIndex={0}
              className="btn bg-transparent outline-none border-0 hover:bg-transparent"
            ></label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box w-52 bg-white"
            >
              <Dropdown.Item>Delete Conversation</Dropdown.Item>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full basis-3/4 flex flex-col-reverse px-6 overflow-scroll overflow-x-hidden">
        {isMessageFetching ? (
          <Spinner color="pink" aria-label="Pink spinner example" size={"xl"} />
        ) : (
          realTimeMessage &&
          realTimeMessage.map((element: any, index: number) => (
            <div className="w-full flex flex-col" key={index}>
              <div
                className={`items-end mt-3 ${
                  !element.self ? "flex" : "hidden"
                }`}
              >
                <div className="mr-2">
                  <Avatar
                    img={
                      receiverProfile && receiverProfile.imgUrl
                        ? `data:image/svg+xml;base64,${receiverProfile.imgUrl}`
                        : undefined
                    }
                    rounded={true}
                    size="xs"
                  ></Avatar>
                </div>
                <div className="min-h-fit md:max-w-[45%] max-w-[65%] border bg-slate-50 py-[14px] px-[18px] rounded-3xl rounded-bl-none md:text-sm text-xs break-words">
                  {element.message}
                </div>
              </div>
              <div
                className={`${
                  element.self ? "block" : "hidden"
                } min-h-fit md:max-w-[45%] max-w-[65%] mt-3 bg-[#1a2238] text-white py-[14px] px-[18px] rounded-3xl rounded-br-none md:text-sm text-xs self-end break-words block`}
              >
                {element.message}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full basis-24 flex items-center justify-center px-6">
        <form
          className="w-full h-12 flex items-center justify-between px-4 rounded-full border border-slate-400"
          onSubmit={(event: React.SyntheticEvent) => {
            if (message) {
              event.preventDefault();
              handleSendMessage.mutate({
                from: user._id,
                to: getId,
                message,
              });
            }
          }}
        >
          <div
            className={`absolute max-h-72 overflow-scroll overflow-x-hidden bottom-20 ${
              hideEmoji ? "hidden" : "grid"
            } grid-rows-auto grid-cols-6 p-1 rounded-2xl rounded-bl-none bg-slate-50 list-none`}
          >
            {emojiArr.map((element, index) => (
              <li
                className="text-3xl cursor-pointer"
                key={index}
                onClick={(): void => setMessage(message.concat(element))}
              >
                {element}
              </li>
            ))}
          </div>

          <BsEmojiHeartEyesFill
            size={28}
            className="text-slate-500 cursor-pointer"
            onClick={(): void => setHideEmoji(!hideEmoji)}
          />

          <input
            placeholder="Message"
            value={message}
            className="w-full h-full border-0 bg-inherit focus:border-0 focus:outline-none px-5"
            onChange={onChange}
          />

          <IoMdSend
            size={28}
            className={`${
              handleSendMessage.isLoading && "pointer-events-none"
            } cursor-pointer text-[#1a2238]`}
            onClick={(event: React.SyntheticEvent) => {
              if (message) {
                event.preventDefault();
                handleSendMessage.mutate({
                  from: user._id,
                  to: getId,
                  message,
                });
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default Inbox;
