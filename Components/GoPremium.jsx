import { Button } from "react-bootstrap";
import { useCelo } from "@celo/react-celo";

export function GoPremiumButton() {
  const { address } = useCelo();
  
  if (!address) {
    return null;
  }

  return (
    <span style={{ padding: "0 5px" }}>
      <Button variant="outline-light">Go Premium</Button>
    </span>
  );
}
