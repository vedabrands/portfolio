import os
import sys
import time
from pathlib import Path
from PIL import Image
import rembg
from rembg import new_session, remove

def get_source_directory():
    candidates = [
        Path(r"C:\Users\dev\public\turntable\120 frames"),
        Path(r"C:\Users\dev\public\turntable"),
    ]
    for c in candidates:
        if c.exists() and len(list(c.glob("*.webp"))) == 120:
            return c
    for c in candidates:
        if c.exists() and len(list(c.glob("*.webp"))) > 0:
            return c
    return candidates[0]

def main():
    src_dir = get_source_directory()
    out_dir = Path(r"C:\Users\dev\public\turntable-transparent")
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== Turntable Background Removal Batch Processor ===")
    print(f"Source directory: {src_dir}")
    print(f"Output directory: {out_dir}")

    # Collect and sort all webp files to ensure sequential order (frame_001.webp -> frame_120.webp)
    input_files = sorted(list(src_dir.glob("*.webp")), key=lambda p: p.name)
    total_files = len(input_files)
    print(f"Found {total_files} source frames to process.")

    if total_files == 0:
        print("ERROR: No .webp files found in source directory!", file=sys.stderr)
        sys.exit(1)

    print("Initializing rembg session with model 'u2net_human_seg'...")
    session = new_session("u2net_human_seg")
    print("Model loaded successfully.\n")

    start_time = time.time()
    success_count = 0

    for idx, input_path in enumerate(input_files, 1):
        frame_start = time.time()

        # Derive output filename directly from input stem (e.g. frame_001.webp -> frame_001.png)
        out_filename = f"{input_path.stem}.png"
        out_path = out_dir / out_filename

        try:
            with Image.open(input_path) as img:
                # Remove background using u2net_human_seg model
                transparent_img = remove(img, session=session)
                # Save as transparent RGBA PNG
                transparent_img.save(out_path, format="PNG")

            elapsed = time.time() - frame_start
            success_count += 1
            print(f"[{idx:03d}/{total_files:03d}] Processed: {input_path.name} -> {out_filename} ({elapsed:.2f}s)")
        except Exception as e:
            print(f"[{idx:03d}/{total_files:03d}] ERROR processing {input_path.name}: {e}", file=sys.stderr)

    total_time = time.time() - start_time
    avg_time = total_time / total_files if total_files > 0 else 0

    print(f"\n==========================================")
    print(f"Batch Processing Complete!")
    print(f"Total processed: {success_count}/{total_files} frames")
    print(f"Total time: {total_time:.2f}s ({avg_time:.2f}s per frame)")
    print(f"Output saved to: {out_dir}")
    print(f"==========================================")

if __name__ == "__main__":
    main()
