import { Button } from "react-bootstrap";
import { useCelo } from "@celo/react-celo";

export function RegisterButton({ isRegistered = false }) {
  const { address } = useCelo();
  if (!address) {
    return null;
  }

  if (isRegistered) {
    return null;
  }

  return (
    <span style={{ padding: "0 5px" }}>
      <Button variant="light">Register</Button>
    </span>
  );
}
