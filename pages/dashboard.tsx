import React, { useEffect } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUser } from "../src/hooks/useUser";
import { Navbar } from "./parts/Navbar";

const Dashboard: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { user, loaded } = useUser(authToken);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Navbar />

      <main>
        <h1>Dashboard</h1>

        {loaded ? (
          <div>
            <p>名前: {user?.display_name}</p>
            <p>みょんポイント: {user?.point}</p>
          </div>
        ) : (
          <p>loading...</p>
        )}
      </main>
    </>
  );
};

export default Dashboard;
