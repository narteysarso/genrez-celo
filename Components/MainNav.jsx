import { useMemo } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, Na } from "react-bootstrap";

import packageJSON from "../package.json";
import { BeACreator } from "./BeACreator";
import { ConnectWalletButton } from "./ConnectWallet";
import { GoPremiumButton } from "./GoPremium";
import { RegisterButton } from "./Register";
import { Button } from "react-bootstrap";

export function MainNav({ appName = packageJSON?.name, address }) {
  const AppName = useMemo(() => {
    return `${appName.slice(0, 1).toUpperCase()}${appName.slice(1)}`;
  }, [appName]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <Button variant="light">{AppName}</Button>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1">
            <GoPremiumButton />
            <ConnectWalletButton />
            <RegisterButton />
            <BeACreator />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}