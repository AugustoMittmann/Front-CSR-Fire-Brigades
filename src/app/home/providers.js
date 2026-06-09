"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { getConfig } from "./../config";

export function Providers({ children }) {
  const config = getConfig();
  const router = useRouter();

  // Auth0 redirects back to this URL after login. Pin it to the app origin so
  // the tenant's allow-list can be a single fixed entry; the actual destination
  // ride-shares through `appState.returnTo` and is restored below.
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  const onRedirectCallback = (appState) => {
    router.replace(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
