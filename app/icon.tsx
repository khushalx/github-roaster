import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#090807", color: "#efab3f", border: "3px solid #efab3f", borderRadius: 10, fontSize: 25, fontWeight: 700 }}>GR</div>, size);
}
