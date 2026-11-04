import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#090807", color: "#efab3f", border: "10px solid #efab3f", fontSize: 92, fontWeight: 700 }}>GR</div>, size);
}
