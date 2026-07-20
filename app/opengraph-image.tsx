import { ImageResponse } from "next/og";

export const alt = "Toolbox — the tools you reach for, built right";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            backgroundColor: "#5E5CE6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            color: "white",
          }}
        >
          ✦
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Toolbox
        </div>
      </div>
      <div style={{ fontSize: 32, color: "#a3a3a3", display: "flex" }}>
        The tools you reach for, built right.
      </div>
    </div>,
    { ...size }
  );
}
