import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Label, Model } from "./ui";

// LinkedIn cover 1584x396. Profile photo covers the left ~420px, so content sits right.
export const Banner: React.FC = () => {
  const parts = ["hex_bolt", "self_drill", "hex_nut", "u_bolt", "eye_bolt", "custom"];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(120deg, ${C.sky} 0%, ${C.blue} 45%, #4FA9D6 75%, ${C.mint} 100%)` }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.28), transparent 55%)" }} />
      <div style={{ position: "absolute", left: 450, top: 46 }}>
        <Label size={54} color="#fff" weight={300} style={{ letterSpacing: "-0.02em", lineHeight: 1.05 }}>Motion ads that<br /><b style={{ fontWeight: 700 }}>get watched.</b></Label>
        <Label size={26} color="rgba(255,255,255,.9)" weight={400} style={{ marginTop: 14 }}>Ads · Product launches · Walkthroughs · Explainers</Label>
        <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
          {["2D & 3D motion", "Voiceover & sound", "9:16 + 16:9"].map((x) => (
            <div key={x} style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 600, color: C.royal, background: "#fff", borderRadius: 99, padding: "8px 18px" }}>{x}</div>
          ))}
        </div>
      </div>
      {/* video card */}
      <div style={{ position: "absolute", right: 245, top: 96, width: 230, height: 140, borderRadius: 16, background: "rgba(255,255,255,.92)", boxShadow: "0 12px 30px rgba(10,40,90,.25)", overflow: "hidden" }}>
        <div style={{ height: 96, background: `linear-gradient(135deg, ${C.royal}, ${C.sky})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderLeft: "15px solid " + C.royal, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", marginLeft: 4 }} />
          </div>
        </div>
        <div style={{ padding: "10px 14px" }}><div style={{ height: 6, borderRadius: 9, background: "#E3EBF2" }}><div style={{ width: "62%", height: "100%", borderRadius: 9, background: C.blue }} /></div></div>
      </div>
      {/* phone */}
      <div style={{ position: "absolute", right: 70, top: 34, width: 150, height: 300, borderRadius: 26, background: "#fff", border: "6px solid #1d2633", boxShadow: "0 16px 34px rgba(10,40,90,.3)", overflow: "hidden" }}>
        <div style={{ padding: 12 }}>
          <div style={{ height: 70, borderRadius: 10, background: `linear-gradient(135deg, ${C.sky}, ${C.mint})` }} />
          {[80, 60, 70].map((w, i) => <div key={i} style={{ height: 8, width: `${w}%`, borderRadius: 9, background: "#E3EBF2", marginTop: 10 }} />)}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, marginTop: 14 }}>{[30, 50, 40, 70, 60].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === 3 ? C.blue : "#BFD7F0" }} />)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 330, top: 226 }}><Model name="hex_bolt" size={130} offset={3} style={{ transform: "scale(1.3)" }} /></div>
      <Label size={20} color="rgba(255,255,255,.85)" weight={600} style={{ position: "absolute", right: 40, bottom: 22, letterSpacing: "0.3em" }}>SAMTECK STUDIO</Label>
    </AbsoluteFill>
  );
};
