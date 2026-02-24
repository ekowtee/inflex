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
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: "36px",
        }}
      >
        <span
          style={{
            fontSize: 140,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            color: "#BD2E25",
            lineHeight: 1,
            marginTop: -4,
          }}
        >
          X
        </span>
      </div>
    ),
    { ...size }
  );
}
