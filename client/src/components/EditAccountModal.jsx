import ReactModal from "react-modal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateUsername, updateEmailAddress } from "../firebase/functions.js";

ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #28547a",
    minWidth: "400px",
    borderRadius: "4px",
    backgroundColor: "white",
  },
};

export default function EditAccountModal({
  isOpen,
  handleClose,
  updateUsernameState,
  updateEmailState,
}) {
  const { currentUser } = useAuth();

  const [showAccountModal, setShowAccountModal] = useState(isOpen);
  const [username, setUsername] = useState(currentUser.displayName);
  const [email, setEmail] = useState(currentUser.email);

  const handleCloseEditModal = () => {
    setShowAccountModal(false);
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Username:", username);
    console.log("Email:", email);

    try {
      await updateUsername(username);
      updateUsernameState(username);
    } catch (error) {
      console.error("Error updating username:", error);
    }

    try {
      await updateEmailAddress(email);
      updateEmailState(email);
    } catch (error) {
      console.error("Error updating email:", error);
    }

    handleCloseEditModal();
  };

  return (
    <ReactModal
      name="editAccountModal"
      isOpen={showAccountModal}
      contentLabel="Edit Account"
      style={customStyles}
    >
      <div className="flex flex-col items-center px-4 py-1">
        <h2 className="text-2xl font-semibold mb-4">
          Edit Account Information
        </h2>
        <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Username</label>
            <input
              className="bg-white border border-gray-500 rounded-md px-2 py-1 placeholder:text-sm"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Date Formed</label>
            <input
              className="bg-white border border-gray-500 rounded-md px-2 py-1 placeholder:text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-400"
              onClick={handleCloseEditModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
