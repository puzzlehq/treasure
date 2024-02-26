import { Box } from "@components/Box";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/GameIntroduction/")({
  component: function Component() {
    return (
      <Box>
        <Outlet />
      </Box>
    );
  },
});
