import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 3,
          background: "#f97316",
          borderRadius: 8,
          padding: "5px 6px",
        }}
      >
        <div style={{ width: 5, height: 10, background: "#fff8f0", borderRadius: 1.5 }} />
        <div style={{ width: 5, height: 16, background: "#fff8f0", borderRadius: 1.5 }} />
        <div style={{ width: 5, height: 22, background: "#fff8f0", borderRadius: 1.5 }} />
      </div>
    ),
    { ...size }
  );
}
