import React, { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import { Avatar, Button, Dropdown, Modal, Spinner } from "flowbite-react";
import moment from "moment";
import { Buffer } from "buffer";
import axios from "axios";
import { getAllUsers, setAvatar, deleteUser } from "../api";
import userContext from "../utils/userContext";

interface Props {
  inboxToggle: boolean;
  setInboxToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setGetId: React.Dispatch<React.SetStateAction<string>>;
}

const Preview: React.FC<Props> = ({
  inboxToggle,
  setInboxToggle,
  setGetId,
}) => {
  const { user, userLogout, isSuccess, refetch, isAlert, setIsAlert } =
    useContext<any>(userContext);

  const searchRef = useRef() as any;

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] =
    useState<boolean>(false);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  const [avatarImage, setAvatarImage] = useState<string[]>([]);

  const [avatarSelectIndex, setAvatarSelectIndex] = useState<number>(NaN);

  const {
    data: allUsers,
    isLoading: isPreviewLoading,
    refetch: refetchAllUsers,
  } = useQuery({
    queryFn: () => getAllUsers(user && user._id),
    queryKey: ["allUsersData"],
    enabled: !!isSuccess,
  });

  const { isLoading: isAvatarLoading } = useQuery({
    queryFn: async () => {
      const imageData = [];
      for (let i = 0; i < 6; i++) {
        const { data } = await axios.get(
          `https://api.multiavatar.com/4645646/${Math.round(
            Math.random() * 1000
          )}?apikey=nQluaHjWZ83G95`
        );
        const buffer = new Buffer(data);
        imageData.push(buffer.toString("base64"));
      }
      setAvatarImage(imageData);
    },
    queryKey: ["getAvatar"],
    refetchOnWindowFocus: false,
  });

  const handleSetAvatar = useMutation(
    ({ id, imgUrl }: { id: string | Types.ObjectId; imgUrl: string }) =>
      setAvatar({ id, imgUrl }),
    {
      onSuccess: (res) => {
        refetchAllUsers();
        refetch();
        setIsAvatarModalOpen(false);
        setIsAlert({
          ...isAlert,
          isOpen: true,
          title: res.message,
          type: "success",
        });
      },
      onError: (err: any) =>
        setIsAlert({
          ...isAlert,
          isOpen: true,
          title: err.response.data,
          type: "failure",
        }),
    }
  );

  const handleDeleteUser = useMutation((id: string) => deleteUser(id), {
    onSuccess: (res) => {
      userLogout();
      setIsDeleteUserModalOpen(false);
      setIsAlert({
        ...isAlert,
        isOpen: true,
        title: res.message,
        type: "success",
      });
    },
    onError: (err: any) =>
      setIsAlert({
        ...isAlert,
        isOpen: true,
        title: err.response.data,
        type: "failure",
      }),
  });

  return (
    <div
      className={`${
        inboxToggle ? "hidden" : "flex"
      } h-full md:col-span-2 col-span-full md:flex flex-col gap-2 drop-shadow-lg z-10`}
    >
      <div className="w-full basis-20 flex justify-between items-center rounded-tl-lg px-4 shadow-lg">
        <p className="font-dev text-[#FF6A3D] text-7xl">kq</p>
        <div className="flex items-center justify-end w-full z-10">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn bg-transparent outline-none border-0 hover:bg-transparent"
            >
              <Avatar
                className="absolute -z-10 text-[#ff6a3d] pointer-events-none"
                img={
                  user && user.imgUrl
                    ? `data:image/svg+xml;base64,${user.imgUrl}`
                    : undefined
                }
                rounded={true}
                status="online"
                statusPosition="bottom-right"
              ></Avatar>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box w-52 bg-white"
            >
              <Dropdown.Header>
                <span className="block text-sm truncate">
                  {user && user.fullname}
                </span>
                <span className="block truncate text-sm font-medium">
                  {user && user.email}
                </span>
              </Dropdown.Header>

              <Dropdown.Item onClick={() => searchRef.current.focus()}>
                New Message
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setIsAvatarModalOpen(true)}>
                Pick an Avatar
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setIsDeleteUserModalOpen(true)}>
                Delete Account
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={userLogout}>Sign out</Dropdown.Item>
            </ul>
          </div>
        </div>
      </div>

      {user && (
        <>
          <Modal
            show={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
          >
            <Modal.Header>Pick an Avatar</Modal.Header>
            <Modal.Body>
              <div className="w-full h-full flex justify-between items-center">
                {isAvatarLoading ? (
                  <Button color="gray">
                    <Spinner aria-label="Alternate spinner button example" />
                    <span className="pl-3">Loading...</span>
                  </Button>
                ) : (
                  avatarImage.map((element, index) => (
                    <img
                      src={`data:image/svg+xml;base64,${element}`}
                      alt="avatar"
                      key={index}
                      className={`w-12 h-12 md:w-16 md:h-16 p-[0.2rem] rounded-full cursor-pointer ${
                        index === avatarSelectIndex &&
                        "border-[0.25rem] border-[#4e0eff]"
                      }`}
                      onClick={(): void => setAvatarSelectIndex(index)}
                    />
                  ))
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() =>
                  handleSetAvatar.mutate({
                    id: user._id,
                    imgUrl: avatarImage[avatarSelectIndex],
                  })
                }
              >
                {handleSetAvatar.isLoading && (
                  <div className="mr-3">
                    <Spinner size="sm" light={true} />
                  </div>
                )}
                Set Avatar
              </Button>
              <Button color="gray" onClick={() => setIsAvatarModalOpen(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={isDeleteUserModalOpen}
            onClose={() => setIsDeleteUserModalOpen(false)}
          >
            <Modal.Header>Are you sure?</Modal.Header>
            <Modal.Body>
              <div className="text-black">
                Once performed the action is irreversible.
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  handleDeleteUser.mutate(user._id);
                }}
                color="failure"
              >
                Delete Account
              </Button>
              <Button
                color="gray"
                onClick={() => setIsDeleteUserModalOpen(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      <div className="px-4">
        <input
          type="search"
          placeholder="Search"
          ref={searchRef}
          className="w-full rounded-xl focus:outline-none focus:border-0 border-0"
          // onChange={onChange}
        />
      </div>

      <div
        className={`basis-[80%] flex flex-col overflow-scroll overflow-x-hidden px-3 ${
          isPreviewLoading && "items-center justify-center"
        }`}
      >
        {isPreviewLoading ? (
          <Spinner size={"xl"} />
        ) : (
          <>
            {allUsers &&
              allUsers.map((element: any, index: number) => (
                <div
                  className="w-full flex justify-between items-start px-3 my-1 py-3 cursor-pointer rounded-lg hover:bg-gray-50"
                  key={index}
                  onClick={(): void => {
                    setInboxToggle(true);
                    setGetId(element._id);
                  }}
                >
                  <Avatar
                    img={
                      element.imgUrl &&
                      `data:image/svg+xml;base64,${element.imgUrl}`
                    }
                    rounded={true}
                    status="online"
                    statusPosition="bottom-right"
                  >
                    <div className="space-y-1 font-medium w-40">
                      <div className="truncate">{element.fullname}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {element.email}
                      </div>
                    </div>
                  </Avatar>
                  <div className="text-gray-500 text-xs py-1">
                    {moment(element.createdAt).format("ll").slice(0, -6)}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Preview;
