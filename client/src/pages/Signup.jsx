import GithubButton from "../components/icons/GithubButton.jsx";
import GoogleButton from "../components/icons/GoogleButton.jsx";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#f1f5f9]">
      <section className="flex flex-col items-center rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] ">
        <div className="flex items-center"></div>
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold">Create an account</h2>
          <form className="mt-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Username</label>
              <input
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="JohnDoe56"
                required
              ></input>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="name@website.com"
                required
              ></input>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="••••••••"
                required
              ></input>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Confirm password</label>
              <input
                type="password"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="••••••••"
                required
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
          <div className="flex mt-4 justify-center space-x-4">
            <GoogleButton />
            <GithubButton />
          </div>
        </div>
      </section>
    </div>
  );
}
