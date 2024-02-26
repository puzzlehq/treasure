import { Outlet, createRootRoute } from "@tanstack/react-router";
import z from "zod";
import "../index.css";

const loadingSchema = z.object({
  loading: z.boolean().optional().default(false).catch(false),
});

export const Route = createRootRoute({
  validateSearch: (search) => loadingSchema.parse(search),
  component: function Component() {
    return (
      <div className="h-full w-full p-4">
        <Outlet />
      </div>
    );
  },
});
