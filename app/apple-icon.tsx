import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 17,
          background: "#3b82f6",
          borderRadius: 45,
          padding: "28px 34px",
        }}
      >
        <div style={{ width: 28, height: 56, background: "#fff8f0", borderRadius: 8 }} />
        <div style={{ width: 28, height: 90, background: "#fff8f0", borderRadius: 8 }} />
        <div style={{ width: 28, height: 124, background: "#fff8f0", borderRadius: 8 }} />
      </div>
    ),
    { ...size }
  );
}
