import { useAuth } from "../context/AuthContext.jsx";
import { Settings as SettingsIcon, SquarePen } from "lucide-react";
import EditAccountModal from "../components/EditAccountModal.jsx";
import { useState } from "react";

export default function Settings() {
  const { currentUser } = useAuth();

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currUsername, setCurrUsername] = useState(currentUser.displayName);
  const [currEmail, setCurrEmail] = useState(currentUser.email);

  const handleClose = () => {
    setShowAccountModal(false);
  };

  return (
    <>
      <div className="p-8 w-full h-full flex flex-col items-center">
        <section className="flex items-center bg-white rounded-md p-4 shadow-sm mb-6 w-full max-w-3xl gap-1">
          <SettingsIcon className="w-7 h-7 text-black" />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </section>

        <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6 w-full max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            <button
              className="flex items-center cursor-pointer"
              onClick={() => setShowAccountModal(true)}
            >
              <p className="font-semibold">Edit</p>
              <SquarePen className="w-4 h-4 text-black ml-1" />
            </button>
          </div>
          <p className="text-gray-500">
            Update your email, password, and other account details.
          </p>

          <div className="flex flex-col bg-gray-50 px-4 py-2 border border-gray-300 rounded-md space-y-2 mt-4">
            <div className="flex">
              <label className="mr-2 font-medium text-gray-600">
                Username:
              </label>
              <p className="font-normal">{currUsername}</p>
            </div>

            <div className="flex">
              <label className="mr-2 font-medium text-gray-600">Email:</label>
              <p className="font-normal">{currEmail}</p>
            </div>
          </div>
        </section>

        <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6 w-full max-w-3xl">
          <h2 className="text-xl font-semibold">Notificiaton Settings</h2>
          <p className="text-gray-500">
            Manage your notification preferences for updates and alerts.
          </p>
        </section>
      </div>
      {showAccountModal && (
        <EditAccountModal
          isOpen={showAccountModal}
          handleClose={handleClose}
          updateUsernameState={setCurrUsername}
          updateEmailState={setCurrEmail}
        />
      )}
    </>
  );
}
