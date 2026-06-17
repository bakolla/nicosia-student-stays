import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/owner/")({
  component: OwnerIndex,
});

function OwnerIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/owner/dashboard", replace: true });
  }, [navigate]);
  return null;
}
