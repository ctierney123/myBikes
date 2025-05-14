import SocialSignIn from "../components/SocialSignIn.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  handleError,
} from "../firebase/functions.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (username.length < 5 || username.length > 25) {
      alert("Username must be between 5-25 characters in length");
      return;
    }

    try {
      if (!isNaN(Number(username)))
        throw new Error("username cannot only contain numbers");

      const regex = /[^A-Za-z0-9]/;

      if (regex.test(username))
        throw new Error(
          "username cannot contain special characters and spaces"
        );

      if (username.length < 5)
        throw new Error("username must be atleast 5 characters long");

      if (password.includes(" "))
        throw new Error("password cannot contain a space");

      if (password.length < 8)
        throw new Error("password must be at least 8 characters long");

      if (!/[A-Z]/.test(password))
        throw new Error(
          "password must contain atleast one uppercase character"
        );

      if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))
        throw new Error("password must contain atleast one special character");

      if (!/\d/.test(password))
        throw new Error("password must contain atleast one number");
    } catch (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    try {
      await doCreateUserWithEmailAndPassword(email, password, username);
      navigate("/login");
      alert("Account created successfully");
    } catch (error) {
      console.log(error);
      alert(handleError(error.message));
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f1f5f9]">
      <section className="flex flex-col items-center rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] ">
        <div className="flex items-center"></div>
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold">Create an account</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSignup}>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Username</label>
              <input
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="JohnDoe56"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
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
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Confirm password</label>
              <input
                type="password"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            <div className="pt-4 pb-0">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1.5 text-sm font-semibold rounded-md cursor-pointer hover:bg-blue-800"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="flex justify-center pb-6 mt-4">
            <p className="text-black text-sm font-medium">
              Already have an account?{" "}
              <Link to="/login" className="ml-1 text-blue-700 font-semibold">
                Log in
              </Link>
            </p>
          </div>
          <div className="fter:h-px flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
            <p className="text-sm px-3 font-medium">Or continue with </p>
          </div>
          <SocialSignIn />
        </div>
      </section>
    </div>
  );
}
