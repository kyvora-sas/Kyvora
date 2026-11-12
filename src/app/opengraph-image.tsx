import { ImageResponse } from "next/og";

export const alt = "KYVORA — Tecnología con intención. Studio & Lab en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080B12",
          color: "#FFFFFF",
          padding: "56px 68px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle blueprint corner frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid #252D3A",
            display: "flex",
          }}
        />

        {/* Top Bar: Logo lockup + Division Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="46" height="42" viewBox="0 0 261 238" fill="none">
              <path
                d="M 39 7 Q 45 0 53 0 Q 59 0 59 6 L 59 93 Q 59 100 54 105 L 5 154 Q 0 159 0 152 L 0 52 Q 0 46 4 42 Z"
                fill="#1677FF"
              />
              <path
                d="M 169 7 Q 176 0 185 0 L 257 0 Q 261 0 258 3 L 29 232 Q 23 238 15 238 L 6 238 Q 0 238 0 232 L 0 184 Q 0 176 6 170 Z"
                fill="#2B85FF"
              />
              <path
                d="M 147 134 Q 155 126 163 134 L 258 232 Q 261 237 256 238 L 185 238 Q 178 238 173 232 L 119 175 Q 113 168 120 161 Z"
                fill="#1677FF"
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  color: "#FFFFFF",
                }}
              >
                KYVORA
              </span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  color: "#AFC4E8",
                }}
              >
                STUDIO &amp; LAB
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              backgroundColor: "#0D121D",
              border: "1px solid #252D3A",
              borderRadius: 999,
              fontSize: 15,
              color: "#AFC4E8",
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#2B85FF",
                display: "flex",
              }}
            />
            <span>COLOMBIA · SOFTWARE &amp; R&amp;D</span>
          </div>
        </div>

        {/* Main Statement */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 940,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              display: "flex",
            }}
          >
            Tecnología con intención.
          </div>
          <div
            style={{
              fontSize: 27,
              lineHeight: 1.4,
              color: "#AFC4E8",
              display: "flex",
            }}
          >
            Desarrollo web, sistemas a la medida, automatización e investigación tecnológica propia.
          </div>
        </div>

        {/* Bottom Axis */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #252D3A",
            paddingTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 16,
              color: "#9AA5B8",
            }}
          >
            <span>KYVORA STUDIO</span>
            <span style={{ color: "#2B85FF" }}>/</span>
            <span>KYVORA LAB</span>
            <span style={{ color: "#2B85FF" }}>/</span>
            <span>RECURSOS</span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            www.kyvora.net.co
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

