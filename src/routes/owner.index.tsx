import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/owner/")({
  component: OwnerIndex,
});

function OwnerIndex() {
  const navigate = useNavigate();
  const isAuthed = useAppStore((s) => s.isOwnerAuthed);

  useEffect(() => {
    navigate({ to: isAuthed ? "/owner/dashboard" : "/owner/login", replace: true });
  }, [isAuthed, navigate]);

  return null;
}
