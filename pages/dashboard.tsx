import React from "react";
import { useAuth } from "../src/hooks/useAuth";
import { useUser } from "../src/hooks/useUser";

const Dashboard: React.FC = () => {
  const { user, authToken } = useAuth();
  console.log(user);
  useUser(authToken);

  return <p>dashboard</p>;
};

export default Dashboard;
