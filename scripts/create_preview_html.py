import base64

def to_b64(path):
    with open(path, "rb") as f:
        data = f.read()
    mime = "image/webp" if path.endswith(".webp") else "image/png"
    return f"data:{mime};base64," + base64.b64encode(data).decode("utf-8")

orig_b64 = to_b64(r"C:\Users\dev\public\turntable\120 frames\frame_001.webp")
trans_b64 = to_b64(r"C:\Users\dev\public\turntable-transparent\frame_001.png")

html = f"""<title>Turntable Frame Review</title>
<style>
  :root {{
    --bg: #0d0f12;
    --surface: #15191e;
    --surface-elevated: #1c2229;
    --border: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.16);
    --text: #f0f3f6;
    --text-muted: #8b949e;
    --accent: #3b82f6;
    --badge-bg: rgba(59, 130, 246, 0.12);
    --badge-text: #60a5fa;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
    --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    padding-block: 28px;
    padding-inline: 24px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }}

  .container {{
    max-width: 1040px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }}

  header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }}

  .title-group h1 {{
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
  }}

  .title-group p {{
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 4px;
  }}

  .meta-chips {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }}

  .chip {{
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }}

  .chip strong {{
    color: var(--badge-text);
  }}

  .comparison-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;
    width: 100%;
  }}

  .preview-card {{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }}

  .card-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: rgba(0, 0, 0, 0.2);
  }}

  .card-title {{
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }}

  .tag {{
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  .tag-orig {{
    background: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
  }}

  .tag-trans {{
    background: var(--badge-bg);
    color: var(--badge-text);
  }}

  .bg-toggles {{
    display: flex;
    gap: 6px;
  }}

  .bg-btn {{
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }}

  .bg-btn:hover, .bg-btn.active {{
    color: #fff;
    border-color: var(--accent);
    background: rgba(59, 130, 246, 0.2);
  }}

  .image-stage {{
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #000;
  }}

  .image-stage.checkerboard {{
    background-color: #1a1e24;
    background-image:
      linear-gradient(45deg, #111418 25%, transparent 25%),
      linear-gradient(-45deg, #111418 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #111418 75%),
      linear-gradient(-45deg, transparent 75%, #111418 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }}

  .image-stage.light-bg {{
    background-color: #f1f5f9;
  }}

  .image-stage.dark-bg {{
    background-color: #0b0d10;
  }}

  .image-stage img {{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }}

  .card-footer {{
    padding: 10px 16px;
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
  }}

  .slider-section {{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }}

  .slider-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .slider-title {{
    font-size: 14px;
    font-weight: 600;
  }}

  .curtain-container {{
    position: relative;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    overflow: hidden;
    user-select: none;
    border: 1px solid var(--border-strong);
    background-color: #1a1e24;
    background-image:
      linear-gradient(45deg, #111418 25%, transparent 25%),
      linear-gradient(-45deg, #111418 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #111418 75%),
      linear-gradient(-45deg, transparent 75%, #111418 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }}

  .curtain-img {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }}

  .curtain-overlay {{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    overflow: hidden;
    border-right: 2px solid #3b82f6;
  }}

  .curtain-overlay img {{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 480px;
    max-width: none;
    object-fit: contain;
  }}

  .slider-range {{
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    accent-color: #3b82f6;
  }}
</style>

<div class="container">
  <header>
    <div class="title-group">
      <h1>Turntable Matte Inspection</h1>
      <p>Edge segmentation verification for 360-degree turntable frames</p>
    </div>
    <div class="meta-chips">
      <div class="chip">Model: <strong>u2net_human_seg</strong></div>
      <div class="chip">Frame: <strong>frame_001.webp</strong></div>
      <div class="chip">Resolution: <strong>824 &times; 824 px</strong></div>
      <div class="chip">Total Frames: <strong>120</strong></div>
    </div>
  </header>

  <div class="comparison-grid">
    <!-- Original Card -->
    <div class="preview-card">
      <div class="card-header">
        <span class="card-title"><span class="tag tag-orig">Original</span> frame_001.webp</span>
        <span style="font-size:11px; color:var(--text-muted);">RGB WebP</span>
      </div>
      <div class="image-stage">
        <img src="{orig_b64}" alt="Original Frame 001">
      </div>
      <div class="card-footer">
        <span>Source: /public/turntable/120 frames/</span>
        <span>824x824</span>
      </div>
    </div>

    <!-- Processed Card -->
    <div class="preview-card">
      <div class="card-header">
        <span class="card-title"><span class="tag tag-trans">Segmented</span> frame_001.png</span>
        <div class="bg-toggles">
          <button class="bg-btn active" onclick="setStageBg('checkerboard', this)">Grid</button>
          <button class="bg-btn" onclick="setStageBg('dark-bg', this)">Dark</button>
          <button class="bg-btn" onclick="setStageBg('light-bg', this)">Light</button>
        </div>
      </div>
      <div class="image-stage checkerboard" id="transStage">
        <img src="{trans_b64}" alt="Transparent Frame 001">
      </div>
      <div class="card-footer">
        <span>Target: /public/turntable-transparent/</span>
        <span>RGBA PNG</span>
      </div>
    </div>
  </div>

  <!-- Interactive Curtain Slider -->
  <div class="slider-section">
    <div class="slider-header">
      <span class="slider-title">Interactive Split Curtain (Drag slider to inspect hair & contour edges)</span>
      <span style="font-size:12px; color:var(--text-muted);">Left: Original | Right: Transparent</span>
    </div>
    <div class="curtain-container" id="curtainBox">
      <img class="curtain-img" src="{trans_b64}" alt="After">
      <div class="curtain-overlay" id="curtainOverlay">
        <img src="{orig_b64}" id="curtainOrigImg" alt="Before">
      </div>
    </div>
    <input type="range" class="slider-range" min="0" max="100" value="50" id="curtainRange" oninput="updateCurtain(this.value)">
  </div>
</div>

<script>
  function setStageBg(cls, btn) {{
    const stage = document.getElementById('transStage');
    stage.className = 'image-stage ' + cls;
    document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }}

  function updateCurtain(val) {{
    const overlay = document.getElementById('curtainOverlay');
    overlay.style.width = val + '%';
  }}

  function syncCurtainWidth() {{
    const box = document.getElementById('curtainBox');
    const origImg = document.getElementById('curtainOrigImg');
    if (box && origImg) {{
      origImg.style.width = box.clientWidth + 'px';
    }}
  }}

  window.addEventListener('resize', syncCurtainWidth);
  window.addEventListener('load', syncCurtainWidth);
  setTimeout(syncCurtainWidth, 100);
</script>
"""

with open(r"C:\Users\dev\turntable_preview.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Preview HTML generated.")
