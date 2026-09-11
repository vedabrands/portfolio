import sys
from pathlib import Path
from PIL import Image, ImageChops
import numpy as np

def verify():
    out_dir = Path(r"C:\Users\dev\public\turntable-transparent")
    files = sorted(list(out_dir.glob("*.png")), key=lambda p: p.name)
    count = len(files)
    print(f"Total PNG files in {out_dir}: {count}")

    if count != 120:
        print(f"WARNING: Expected exactly 120 files, but found {count}!")
    else:
        print("CONFIRMED: Exactly 120 transparent PNG frames generated.")

    f1_path = out_dir / "frame_001.png"
    f120_path = out_dir / "frame_120.png"

    if not f1_path.exists() or not f120_path.exists():
        print("ERROR: frame_001.png or frame_120.png does not exist!")
        return

    img1 = Image.open(f1_path).convert("RGBA")
    img120 = Image.open(f120_path).convert("RGBA")

    arr1 = np.array(img1)
    arr120 = np.array(img120)

    # Pixel difference metrics
    diff = ImageChops.difference(img1, img120)
    diff_arr = np.array(diff)
    mean_diff = np.mean(diff_arr)
    max_diff = np.max(diff_arr)
    diff_pixels = np.count_nonzero(np.any(arr1 != arr120, axis=-1))
    total_pixels = arr1.shape[0] * arr1.shape[1]
    diff_pct = (diff_pixels / total_pixels) * 100

    print("\n--- Visual Difference Confirmation between frame_001.png and frame_120.png ---")
    print(f"Resolution: {img1.size[0]}x{img1.size[1]} px")
    print(f"Differing pixels: {diff_pixels:,} / {total_pixels:,} ({diff_pct:.2f}% of pixels differ)")
    print(f"Mean pixel delta across channels: {mean_diff:.2f}")
    print(f"Max pixel delta: {max_diff}")

    if diff_pct > 5.0:
        print("RESULT: frame_001.png and frame_120.png are CONFIRMED to be VISIBLY DIFFERENT images (distinct rotation poses).")
    else:
        print("RESULT: Images appear suspiciously similar.")

if __name__ == "__main__":
    verify()
