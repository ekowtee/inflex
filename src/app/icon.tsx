import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "12px",
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            color: "#BD2E25",
            lineHeight: 1,
            marginTop: -2,
          }}
        >
          X
        </span>
      </div>
    ),
    { ...size }
  );
}
