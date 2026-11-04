import { ImageResponse } from "next/og";

export const alt = "GitHub Roaster — AI GitHub profile roasts and roast battles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", background: "#090807", color: "#f7eedb", borderTop: "10px solid #efab3f", backgroundImage: "radial-gradient(ellipse at 85% 15%, #452715 0%, #090807 65%)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 3 }}>GITHUB <span style={{ marginLeft: 10, color: "#efab3f" }}>ROASTER</span></div><span style={{ color: "#efab3f", fontSize: 19 }}>PUBLIC REPOS. PERSONAL DAMAGE.</span></div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>Your GitHub profile.</div><div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#efab3f", lineHeight: 1.1 }}>On trial with AI.</div><div style={{ display: "flex", color: "#c8bfb3", marginTop: 26, fontSize: 27 }}>Solo roasts · Profile battles · Shareable verdicts</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid #6d4c27", fontSize: 23 }}><span style={{ color: "#efab3f" }}>githubroast.tech</span><span style={{ color: "#c8bfb3" }}>The evidence is public. The jokes are AI.</span></div>
    </div>,
    size,
  );
}
