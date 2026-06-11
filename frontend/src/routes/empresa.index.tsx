import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/empresa/")({
  beforeLoad: () => {
    throw redirect({ to: "/empresa/dashboard" });
  },
});
