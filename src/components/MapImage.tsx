import { useSearch } from "@tanstack/react-router";
import map_0 from "../assets/map/map_0.png";
import map_gif from "../assets/map/map_gif.gif";
import { Route as index_route } from "@routes/__root.js";

const MapImage = () => {
  const [searchParams] = useSearch({ from: index_route.id });

  const loading = searchParams.get("loading");

  return (
    <img
      src={loading === "true" ? map_gif : map_0}
      alt="Treasure Map"
      className="fixed bottom-0 left-0 w-screen items-center justify-center object-contain"
      style={{
        transformOrigin: "center bottom",
      }}
    />
  );
};

export default MapImage;
