import { CeloProvider } from "@celo/react-celo";
import { useMemo } from "react";

import packageJSON from "../package.json";
import { MainNav } from "./MainNav";
import { CreateSBTProvider } from "../hooks/CreatorSBT";
import { PlayerProvider } from "../hooks/Player";
import { MainPlayer } from "./Player/Player";
import { Container } from "react-bootstrap";

export default function Layout({ appName = packageJSON?.name, children }) {
  const AppName = useMemo(() => {
    return `${appName.slice(0, 1).toUpperCase()}${appName.slice(1)}`;
  }, [appName]);

  return (
    <Container fluid className="pb-5">
    <CeloProvider
      dapp={{
        name: AppName,
        description: "The music universe",
        url: "https://localhost",
      }}
      theme={{
        primary: "#eef2ff",
        secondary: "#6366f1",
        text: "#ffffff",
        textSecondary: "#cbd5e1",
        textTertiary: "#64748b",
        muted: "#334155",
        background: "#1e293b",
        error: "#ef4444",
      }}
    >
      <CreateSBTProvider>
        <PlayerProvider>
        <MainNav />
        {children}
        <MainPlayer />
        </PlayerProvider>
      </CreateSBTProvider>
    </CeloProvider>
    </Container>
  );
}
