import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "I Am Going To Canada by Marina Snyder",
    short_name: "Going to Canada",
    description: "Multilingual Canadian immigration consulting and a clear route to the right professional conversation.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f8f6",
    theme_color: "#b4233a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
