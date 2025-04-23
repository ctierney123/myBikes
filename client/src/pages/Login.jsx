import GithubButton from "../components/icons/GithubButton.jsx";
import GoogleButton from "../components/icons/GoogleButton.jsx";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#f1f5f9]">
      <section className="flex flex-col items-center rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] ">
        <div className="flex items-center"></div>
        <div className="flex flex-col w-full h-full bg-white rounded-lg border border-gray-300 p-8 mt-8">
          <h2 className="text-2xl font-bold">Sign in to your account</h2>
          <form className="mt-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="name@website.com"
              ></input>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600 "
                placeholder="••••••••"
              ></input>
            </div>
            <div className="pt-1 pb">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1.5 text-sm font-semibold rounded-md cursor-pointer hover:bg-blue-800"
              >
                Log in
              </button>
            </div>
          </form>
          <div className="flex justify-center pb-6 mt-4">
            <p className="text-black text-sm font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="ml-1 text-blue-700 font-semibold">
                Sign up
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
