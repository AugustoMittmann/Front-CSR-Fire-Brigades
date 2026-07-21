"use client";

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { usePathname } from "next/navigation";
import RequireAdmin from "./components/requireAdmin";
import AdminSidebar from "./components/adminSidebar";
import { setTokenProvider, clearTokenProvider } from "@/lib/apiAuth";
import { getConfig } from "../config";
import styles from "./layout.module.css";

// Layout shared by every /admin/* route. Renders the two-pane shell (sidebar
// + main) and connects the Auth0 token retrieval to the shared API client so
// writes attach an access token automatically.
//
// The /admin/login page bypasses the RequireAdmin gate and the sidebar
// chrome — a user landing there hasn't authenticated yet.
export default function AdminLayout({ children }) {
  const pathname = usePathname() || "";
  const isLoginRoute = pathname === "/admin/login";

  return isLoginRoute ? (
    <>{children}</>
  ) : (
    <RequireAdmin>
      <TokenBridge />
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </RequireAdmin>
  );
}

// Small effect-only component that registers the Auth0 token provider on
// mount and clears it on unmount. Kept separate so it can sit *inside*
// RequireAdmin and only run after the user is authenticated (and thus
// getAccessTokenSilently will actually work).
function TokenBridge() {
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const { audience } = getConfig();
    setTokenProvider(() =>
      getAccessTokenSilently(
        audience
          ? { authorizationParams: { audience } }
          : undefined
      )
    );
    return () => clearTokenProvider();
  }, [getAccessTokenSilently]);
  return null;
}
