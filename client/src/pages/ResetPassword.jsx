import { Link } from "react-router-dom";
import { useState } from "react";
import { doPasswordReset } from "../firebase/functions.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const passwordReset = async (e) => {
    e.preventDefault();
    try {
      await doPasswordReset(email);
      alert("Password reset link sent to your email");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error sending password reset link");
    }
  };

  if (currentUser) {
    navigate("/dashboard");
  }

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f1f5f9]">
      <section className="flex flex-col items-center rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] ">
        <div className="flex items-center"></div>
        <div className="flex flex-col w-full h-full bg-white rounded-lg border border-gray-300 p-8 mt-8">
          <h2 className="text-2xl font-bold">Reset your password</h2>
          <form className="mt-4 space-y-4" onSubmit={passwordReset}>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="name@website.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="pt-1 pb">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1.5 text-sm font-semibold rounded-md cursor-pointer hover:bg-blue-800"
              >
                Send password reset link
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-4">
            <p className="text-black text-sm font-medium">
              Back to login?{" "}
              <Link to="/login" className="ml-1 text-blue-700 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
