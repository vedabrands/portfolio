import React, { useRef, useEffect, useState, useCallback } from "react";

const FRAME_COUNT = 60;

export default function ScrubberDemo() {
  const canvasRef = useRef(null);
  const scrollBoxRef = useRef(null);
  const framesRef = useRef([]);
  const [ready, setReady] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const dragState = useRef({ dragging: false, startX: 0, startFrame: 0 });

  useEffect(() => {
    const frames = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const off = document.createElement("canvas");
      off.width = 400;
      off.height = 500;
      const ctx = off.getContext("2d");
      const angle = (i / (FRAME_COUNT - 1)) * Math.PI * 2;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 400, 500);
      const cx = 200, cy = 220, r = 90;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(Math.cos(angle) * 0.9, 1);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#d8a888";
      ctx.fill();
      ctx.restore();
      const facingFront = Math.cos(angle) > 0.15;
      if (facingFront) {
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.arc(cx - 25, cy - 10, 6, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8a5a45";
        ctx.fillRect(cx - 15, cy + 25, 30, 6);
      }
      ctx.fillStyle = "#e8e8e8";
      ctx.beginPath();
      ctx.moveTo(60, 500);
      ctx.quadraticCurveTo(200, 340, 340, 500);
      ctx.fill();
      ctx.fillStyle = "#666";
      ctx.font = "12px monospace";
      ctx.fillText(`frame ${i + 1}/${FRAME_COUNT}`, 12, 24);
      frames.push(off);
    }
    framesRef.current = frames;
    setReady(true);
  }, []);

  const draw = useCallback((idx) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[idx];
    if (!canvas || !frame) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (ready) draw(frameIndex);
  }, [ready, frameIndex, draw]);

  const handleScroll = () => {
    const box = scrollBoxRef.current;
    if (!box) return;
    const maxScroll = box.scrollHeight - box.clientHeight;
    const progress = maxScroll > 0 ? box.scrollTop / maxScroll : 0;
    const idx = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
    setFrameIndex(idx);
  };

  const onPointerDown = (e) => {
    dragState.current = { dragging: true, startX: e.clientX, startFrame: frameIndex };
  };
  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const sensitivity = 4;
    const delta = Math.round(dx / sensitivity);
    let next = dragState.current.startFrame + delta;
    next = ((next % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    setFrameIndex(next);
  };
  const endDrag = () => (dragState.current.dragging = false);

  return (
    <div style={{ background: "#000", color: "#eee", fontFamily: "system-ui" }}>
      <div style={{ padding: "16px 20px", fontSize: 13, color: "#888" }}>
        Scroll inside the black box below, or click-and-drag left/right on the image itself.
      </div>
      <div ref={scrollBoxRef} onScroll={handleScroll} style={{ height: 420, overflowY: "scroll", position: "relative", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
        <div style={{ height: "400vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: 420 }}>
            <canvas ref={canvasRef} width={400} height={500} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag} style={{ display: "block", margin: "0 auto", height: "100%", width: "auto", cursor: "grab", touchAction: "none" }} />
          </div>
        </div>
      </div>
      <div style={{ padding: 16, fontSize: 13, color: "#888" }}>
        Frame {frameIndex + 1} / {FRAME_COUNT} — progress {Math.round((frameIndex / (FRAME_COUNT - 1)) * 100)}%
      </div>
    </div>
  );
}
