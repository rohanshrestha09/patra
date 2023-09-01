import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { Avatar, Button, Dropdown, Spinner } from "flowbite-react";
import { IoIosArrowBack, IoIosCall, IoMdSend } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import userContext from "../../utils/userContext";
import { getMessage, getUserById, sendMessage } from "../../api";
import emojiArr from "../shared/emoji";
import Skeleton from "../shared/Skeleton";
import { GET_MESSAGES, GET_USER_BY_ID } from "../../constant";

interface Props {
  inboxToggle: boolean;
  setInboxToggle: React.Dispatch<React.SetStateAction<boolean>>;
  user: string;
}

const Inbox: React.FC<Props> = ({
  inboxToggle,
  setInboxToggle,
  user: userId,
}) => {
  const [socket, setSocket] = useState<any>(null);

  const { user } = useContext(userContext);

  const loaderRef = useRef<HTMLDivElement>(null);

  const [clientMessages, setClientMessages] = useState<unknown[]>([]);

  const [hideEmoji, setHideEmoji] = useState<boolean>(true);

  const [message, setMessage] = useState<string>("");

  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState(20);

  useEffect(() => {
    socket && socket.emit("add", user._id);
  }, [socket, user]);

  useEffect(() => {
    socket &&
      socket.on("receive-message", (msg: string) => {
        setClientMessages((message: any) => [
          { sender: userId, message: msg },
          ...message,
        ]);
      });
    // eslint-disable-next-line
  }, [socket]);

  const onChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLButtonElement;
    setMessage(value);
  };

  const {
    data: messages,
    isPreviousData: isMessageFetching,
    refetch: refetchMessages,
  } = useQuery({
    queryFn: () => getMessage({ user: userId, size }),
    queryKey: [GET_MESSAGES, userId, size],
    enabled: !!userId,
    onSuccess: (messages) => {
      setClientMessages(messages.data);
      setSocket(io("/"));
      setLoading(false);
      setTimeout(() => {
        if (loaderRef.current && !loading)
          loaderRef.current.scrollIntoView({
            behavior: "smooth",
          });
      }, 500);
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    setLoading(true);
    setSize(20);
  }, [userId]);

  useEffect(() => {
    refetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const { data: receiverProfile, isLoading: isUserLoading } = useQuery({
    queryFn: () => getUserById(userId),
    queryKey: [GET_USER_BY_ID, userId],
    enabled: !!userId,
  });

  const handleSendMessage = useMutation(
    (data: { to: string; message: string }) => sendMessage(data),
    {
      onSuccess: () => {
        socket &&
          socket.emit("send-message", {
            from: user && user._id,
            to: userId,
            msg: message,
          });
        setClientMessages((prev: unknown[]) => [
          { sender: user._id, message },
          ...prev,
        ]);
        setMessage("");
      },
    }
  );

  return (
    <div
      className={`${inboxToggle ? "flex" : "hidden"
        } h-full md:col-span-4 col-span-full md:flex flex-col justify-between drop-shadow-lg rounded-lg shadow-lg shadow-slate-400`}
    >
      <div className="w-full basis-20 flex justify-between items-center rounded-tl-lg px-6 shadow-lg">
        <IoIosArrowBack
          size={25}
          className="text-slate-700 cursor-pointer"
          onClick={() => setInboxToggle(false)}
        />

        <div className="basis-3/4">
          {isUserLoading ? (
            <Skeleton nullMargin />
          ) : (
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
          )}
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
        {messages?.count && loading ? (
          Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)
        ) : (
          <>
            {clientMessages &&
              clientMessages.map(({ sender, message }: any, index: number) => (
                <div className="w-full flex flex-col" key={index}>
                  <div
                    className={`items-end mt-3 ${!(sender === user._id) ? "flex" : "hidden"
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
                      {message}
                    </div>
                  </div>
                  <div
                    className={`${sender === user._id ? "block" : "hidden"
                      } min-h-fit md:max-w-[45%] max-w-[65%] mt-3 bg-[#1a2238] text-white py-[14px] px-[18px] rounded-3xl rounded-br-none md:text-sm text-xs self-end break-words block`}
                  >
                    {message}
                  </div>
                </div>
              ))}

            {size < messages?.count && (
              <div
                ref={loaderRef}
                className="flex w-full items-center justify-center"
              >
                <Button onClick={() => setSize((prev) => prev + 10)}>
                  {isMessageFetching ? (
                    <>
                      <div className="mr-3">
                        <Spinner size="sm" light={true} />
                      </div>
                      Loading ...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full basis-24 flex items-center justify-center px-6">
        <form
          className="w-full h-12 flex items-center justify-between px-4 rounded-full border border-slate-400"
          onSubmit={(event) => {
            if (message) {
              event.preventDefault();
              handleSendMessage.mutate({
                to: userId,
                message,
              });
            }
          }}
        >
          <div
            className={`absolute max-h-72 overflow-scroll overflow-x-hidden bottom-20 ${hideEmoji ? "hidden" : "grid"
              } grid-rows-auto grid-cols-6 p-1 rounded-2xl rounded-bl-none bg-slate-50 list-none`}
          >
            {emojiArr.map((emoji, index) => (
              <li
                className="text-3xl cursor-pointer"
                key={index}
                onClick={() => setMessage(message.concat(emoji))}
              >
                {emoji}
              </li>
            ))}
          </div>

          <BsEmojiHeartEyesFill
            size={28}
            className="text-slate-500 cursor-pointer"
            onClick={() => setHideEmoji(!hideEmoji)}
          />

          <input
            placeholder="Message"
            value={message}
            className="w-full h-full border-0 bg-inherit focus:border-0 focus:outline-none px-5"
            onChange={onChange}
          />

          <IoMdSend
            size={28}
            className={`${handleSendMessage.isLoading && "pointer-events-none"
              } cursor-pointer text-[#1a2238]`}
            onClick={(event) => {
              if (message) {
                event.preventDefault();
                handleSendMessage.mutate({
                  to: userId,
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
