"use client";

import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import Loading from "../../components/loading";

// Gates the admin panel on authentication only — the app does not use roles.
// Any authenticated user reaches the panel; the backend enforces access on
// every write/read. While Auth0 is resolving the session we show a spinner.
function RequireAdminInner({ children }) {
  const { isLoading } = useAuth0();
  if (isLoading) return <Loading />;
  return children;
}

// Auth0 redirects unauthenticated users to login; `returnTo` preserves the
// admin URL they were trying to reach so they land back on it afterwards.
const RequireAdmin = withAuthenticationRequired(RequireAdminInner, {
  onRedirecting: () => <Loading />,
  returnTo: () =>
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/admin",
});

export default RequireAdmin;
