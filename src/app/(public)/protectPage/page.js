"use client";

import React from "react";
import LogoutButton from "./logoutButton";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../../components/loading";

const ProtectedPage = () => {
  return (
    <div style={{ opacity: "1", transition: "opacity 0.5s" }}>
      <div style={{ margin: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LogoutButton />
      </div>
    </div>
  );
};

export default withAuthenticationRequired(ProtectedPage, {
  onRedirecting: () => <Loading />,
});
