import React from "react";
import ietLogo from "../iet.png";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Welcome to OBEasy!</h1>
      <img src={ietLogo} alt="iet_logo" />
      <h4>
        Designed and developed by: Department of Electrical Engineering, IET
        Lucknow
      </h4>
    </div>
  );
};

export default Home;
