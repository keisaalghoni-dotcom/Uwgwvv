import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const C = {
  bg: '#07111f',
  panel: '#101f33',
  cyan: '#49e6ff',
  yellow: '#ffe66d',
  white: '#f4f7fb',
  muted: '#a8b8ca',
  pink: '#ff5e8a',
};

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = interpolate(frame, [0, 900], [0, -160]);
  const pulse = 0.25 + Math.sin(frame / 18) * 0.08;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, #18334c 0%, ${C.bg} 54%, #030811 100%)`, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: -200,
        backgroundImage: `radial-gradient(${C.cyan} 1.5px, transparent 1.5px)`,
        backgroundSize: '54px 54px',
        opacity: pulse,
        transform: `translateY(${drift}px) rotate(-8deg)`,
      }} />
      <div style={{
        position: 'absolute', width: 720, height: 720, borderRadius: '50%',
        border: `2px solid ${C.cyan}22`, left: 180, top: 390,
        transform: `scale(${1 + Math.sin(frame / 25) * 0.025})`,
        boxShadow: `0 0 80px ${C.cyan}12`,
      }} />
      <div style={{
        position: 'absolute', width: 540, height: 540, borderRadius: '50%',
        border: `1px solid ${C.pink}30`, left: 270, top: 480,
        transform: `rotate(${frame * 0.15}deg)`,
      }} />
    </AbsoluteFill>
  );
};

const TextLine: React.FC<{
  children: React.ReactNode;
  frame: number;
  start: number;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ children, frame, start, color = C.white, size = 76, delay = 0 }) => {
  const local = frame - start - delay;
  const y = interpolate(local, [0, 16], [42, 0], clamp);
  const opacity = interpolate(local, [0, 12], [0, 1], clamp);
  const scale = spring({ frame: Math.max(0, local), fps: 30, config: { damping: 14, stiffness: 120 } });
  return (
    <div style={{
      opacity, transform: `translateY(${y}px) scale(${0.92 + scale * 0.08})`,
      color, fontSize: size, fontWeight: 900, lineHeight: 1.08,
      letterSpacing: -2, textAlign: 'center', maxWidth: 900,
      textShadow: `0 6px 28px ${color}22`,
    }}>{children}</div>
  );
};

const Pill: React.FC<{ text: string; frame: number; start: number }> = ({ text, frame, start }) => {
  const opacity = interpolate(frame, [start, start + 10], [0, 1], clamp);
  const x = interpolate(frame, [start, start + 14], [30, 0], clamp);
  return <div style={{
    opacity, transform: `translateX(${x}px)`,
    border: `2px solid ${C.cyan}88`, color: C.cyan,
    borderRadius: 100, padding: '13px 24px', fontSize: 26,
    fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase',
    background: '#07111fcc',
  }}>{text}</div>;
};

const Heart: React.FC<{ left: number; top: number; delay: number; frame: number; size?: number }> = ({ left, top, delay, frame, size = 88 }) => {
  const beat = 1 + Math.max(0, Math.sin((frame - delay) * 0.35)) * 0.14;
  const entrance = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 10, stiffness: 150 } });
  return <div style={{
    position: 'absolute', left, top, fontSize: size, lineHeight: 1,
    transform: `scale(${entrance * beat}) rotate(-8deg)`,
    filter: `drop-shadow(0 0 24px ${C.pink}88)`,
  }}>❤️</div>;
};

const Scene: React.FC<{ frame: number; start: number; end: number; children: React.ReactNode }> = ({ frame, start, end, children }) => {
  const opacity = interpolate(frame, [start, start + 10, end - 10, end], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity, justifyContent: 'center', alignItems: 'center', padding: 70 }}>{children}</AbsoluteFill>;
};

export const FaktaShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, 899], [0, 100]);
  const badgeIn = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.white, fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden' }}>
      <Background frame={frame} />

      {/* Persistent top label and progress bar */}
      <div style={{ position: 'absolute', top: 76, left: 64, right: 64, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 25, fontWeight: 900, letterSpacing: 3, color: C.white }}>FAKTA<span style={{ color: C.cyan }}>•</span>UNIK</div>
        <div style={{ fontSize: 20, color: C.muted, fontWeight: 700 }}>30 DETIK</div>
      </div>
      <div style={{ position: 'absolute', top: 132, left: 64, right: 64, height: 5, borderRadius: 9, background: '#ffffff20', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: C.cyan, borderRadius: 9, boxShadow: `0 0 18px ${C.cyan}` }} />
      </div>

      {/* 0–5 sec: Hook */}
      <Scene frame={frame} start={0} end={150}>
        <Pill text="FAKTA HEWAN" frame={frame} start={8} />
        <div style={{ height: 36 }} />
        <TextLine frame={frame} start={12} size={82}>GURITA PUNYA</TextLine>
        <TextLine frame={frame} start={25} color={C.yellow} size={118}>3 JANTUNG?!</TextLine>
        <div style={{ marginTop: 34, color: C.muted, fontSize: 29, fontWeight: 600 }}>Dan itu bukan satu-satunya keanehannya.</div>
        <Heart left={180} top={560} delay={25} frame={frame} size={62} />
        <Heart left={760} top={620} delay={32} frame={frame} size={72} />
      </Scene>

      {/* 5–10 sec: Reveal */}
      <Scene frame={frame} start={150} end={300}>
        <Pill text="TIGA JANTUNG" frame={frame} start={155} />
        <div style={{ height: 42 }} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map((n) => (
            <div key={n} style={{
              width: 220, height: 250, borderRadius: 30,
              background: `linear-gradient(145deg, ${n === 1 ? '#2b2546' : C.panel}, #0b1525)`,
              border: `2px solid ${n === 1 ? C.pink : C.cyan}88`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: `translateY(${Math.sin((frame - 150) / 8 + n) * 8}px)`,
              boxShadow: `0 20px 50px #0005`,
            }}>
              <div style={{ fontSize: 74 }}>❤️</div>
              <div style={{ marginTop: 18, color: n === 1 ? C.pink : C.cyan, fontSize: 25, fontWeight: 900 }}>JANTUNG {n + 1}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 42, fontSize: 33, color: C.white, fontWeight: 700, textAlign: 'center' }}>Dua membantu mengalirkan darah ke insang.</div>
      </Scene>

      {/* 10–15 sec: How it works */}
      <Scene frame={frame} start={300} end={450}>
        <Pill text="CARA KERJANYA" frame={frame} start={305} />
        <div style={{ height: 38 }} />
        <TextLine frame={frame} start={310} size={68}>DUA JANTUNG</TextLine>
        <TextLine frame={frame} start={322} size={58} color={C.cyan}>→ KE INSANG</TextLine>
        <div style={{ height: 40 }} />
        <TextLine frame={frame} start={340} size={68}>SATU JANTUNG</TextLine>
        <TextLine frame={frame} start={352} size={58} color={C.yellow}>→ KE TUBUH</TextLine>
        <div style={{ marginTop: 46, fontSize: 29, color: C.muted, textAlign: 'center' }}>Sistem ini membantu darah membawa oksigen.</div>
      </Scene>

      {/* 15–20 sec: Blue blood */}
      <Scene frame={frame} start={450} end={600}>
        <Pill text="FAKTA KEDUA" frame={frame} start={455} />
        <div style={{ height: 40 }} />
        <TextLine frame={frame} start={462} size={74}>DARAHNYA</TextLine>
        <TextLine frame={frame} start={474} size={126} color={C.cyan}>BIRU!</TextLine>
        <div style={{ marginTop: 34, width: 600, height: 8, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, boxShadow: `0 0 25px ${C.cyan}` }} />
        <div style={{ marginTop: 38, fontSize: 33, color: C.white, textAlign: 'center', maxWidth: 800, lineHeight: 1.35 }}>Karena darahnya memakai protein hemosianin yang mengandung tembaga.</div>
      </Scene>

      {/* 20–25 sec: Detail */}
      <Scene frame={frame} start={600} end={750}>
        <Pill text="KENAPA BIRU?" frame={frame} start={605} />
        <div style={{ height: 40 }} />
        <div style={{ width: 620, height: 620, borderRadius: 310, border: `3px solid ${C.cyan}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `0 0 70px ${C.cyan}15` }}>
          <div style={{ width: 440, height: 440, borderRadius: 220, background: `radial-gradient(circle at 35% 30%, ${C.cyan}, #1766a0 55%, #082b52)`, opacity: 0.92, boxShadow: `0 0 80px ${C.cyan}55` }} />
          <div style={{ position: 'absolute', fontSize: 72, fontWeight: 900, color: '#fff', textShadow: '0 4px 20px #001' }}>Cu</div>
        </div>
        <div style={{ marginTop: 30, fontSize: 31, color: C.white, textAlign: 'center' }}>Tembaga membantu mengikat oksigen, terutama di air dingin.</div>
      </Scene>

      {/* 25–30 sec: CTA */}
      <Scene frame={frame} start={750} end={900}>
        <Pill text="MASIH ADA LAGI" frame={frame} start={755} />
        <div style={{ height: 38 }} />
        <TextLine frame={frame} start={762} size={78}>HEWAN INI</TextLine>
        <TextLine frame={frame} start={774} size={92} color={C.yellow}>LUAR BIASA!</TextLine>
        <div style={{ marginTop: 42, padding: '24px 34px', borderRadius: 24, background: C.cyan, color: '#06111e', fontSize: 32, fontWeight: 900, transform: `scale(${0.98 + badgeIn * 0.02})`, textAlign: 'center' }}>
          KAMU BARU TAHU?
        </div>
        <div style={{ marginTop: 30, fontSize: 30, color: C.white, fontWeight: 700 }}>Tulis di komentar 👇</div>
        <div style={{ marginTop: 52, fontSize: 25, color: C.muted, letterSpacing: 2 }}>FOLLOW UNTUK FAKTA BERIKUTNYA</div>
      </Scene>

      {/* bottom brand accent */}
      <div style={{ position: 'absolute', bottom: 64, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ width: 70, height: 6, background: C.pink, borderRadius: 8 }} />
        <div style={{ color: '#a8b8ca99', fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>SHORTS / FACTS</div>
      </div>
    </AbsoluteFill>
  );
};
