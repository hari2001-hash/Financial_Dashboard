import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data || !data.email) {
          navigate("/login");
        } else {
          setUser(data);
        }
      });
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return <div>Welcome, {user.displayName}!</div>;
}