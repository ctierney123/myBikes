import GoogleButton from "./icons/GoogleButton.jsx";
import GithubButton from "./icons/GithubButton.jsx";
import { doSocialSignIn, handleError } from "../firebase/functions.js";

export default function SocialSignIn() {
  const handleSocialSignIn = async (provider) => {
    try {
      console.log(provider);
      await doSocialSignIn(provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mt-4 justify-center space-x-4">
      <GoogleButton onClick={() => handleSocialSignIn("google")} />
      <GithubButton onClick={() => handleSocialSignIn("github")} />
    </div>
  );
}
