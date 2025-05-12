import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="landing">
      <h1>Welcome to the Landing Page</h1>
      <p>Redirecting to login...</p>
    </div>
  );
}
