from pathlib import Path
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw

GALLERY = Path("src/assets/gallery-jpg")

def iou(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    x1, y1 = max(ax, bx), max(ay, by)
    x2, y2 = min(ax + aw, bx + bw), min(ay + ah, by + bh)
    iw, ih = max(0, x2 - x1), max(0, y2 - y1)
    inter = iw * ih
    union = aw * ah + bw * bh - inter
    return inter / union if union else 0.0

def merge_boxes(boxes):
    merged = []
    for box in sorted(boxes, key=lambda b: b[2] * b[3], reverse=True):
        if any(iou(box, other) > 0.25 for other in merged):
            continue
        merged.append(box)
    return merged

def detect_faces(bgr):
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    cascades = [
        (cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml"), 1.05, 3),
        (cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml"), 1.05, 3),
    ]
    boxes = []
    for cascade, scale, neighbors in cascades:
        found = cascade.detectMultiScale(
            gray,
            scaleFactor=scale,
            minNeighbors=neighbors,
            minSize=(18, 18),
        )
        boxes.extend([tuple(map(int, f)) for f in found])

    profile = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")
    for working, flipped in [(gray, False), (cv2.flip(gray, 1), True)]:
        found = profile.detectMultiScale(
            working,
            scaleFactor=1.06,
            minNeighbors=4,
            minSize=(18, 18),
        )
        for x, y, w, h in found:
            if flipped:
                x = gray.shape[1] - x - w
            boxes.append((int(x), int(y), int(w), int(h)))
    return merge_boxes(boxes)

def draw_smiley(im, box):
    x, y, w, h = box
    cx = x + w / 2
    cy = y + h / 2
    diameter = max(w, h) * 1.38
    diameter = max(34, diameter)
    r = diameter / 2

    left = int(max(0, cx - r))
    top = int(max(0, cy - r))
    right = int(min(im.width - 1, cx + r))
    bottom = int(min(im.height - 1, cy + r))

    d = ImageDraw.Draw(im)
    outline = max(2, int(diameter * 0.045))
    d.ellipse((left, top, right, bottom), fill=(255, 210, 40), outline=(255, 255, 255), width=outline)

    rw = right - left
    rh = bottom - top
    eye_r = max(2, int(min(rw, rh) * 0.065))
    eye_y = top + int(rh * 0.36)
    eye_dx = int(rw * 0.18)
    center_x = (left + right) // 2
    for ex in (center_x - eye_dx, center_x + eye_dx):
        d.ellipse((ex-eye_r, eye_y-eye_r, ex+eye_r, eye_y+eye_r), fill=(35, 35, 35))

    smile_box = (
        left + int(rw * 0.27),
        top + int(rh * 0.43),
        right - int(rw * 0.27),
        bottom - int(rh * 0.18),
    )
    smile_w = max(2, int(min(rw, rh) * 0.055))
    d.arc(smile_box, start=20, end=160, fill=(35, 35, 35), width=smile_w)

def process(path):
    bgr = cv2.imread(str(path))
    if bgr is None:
        return 0
    boxes = detect_faces(bgr)
    if not boxes:
        return 0

    im = Image.open(path).convert("RGB")
    for box in boxes:
        draw_smiley(im, box)

    im.save(path, "JPEG", quality=82, optimize=True, progressive=True, subsampling=2)
    return len(boxes)

def main():
    files = sorted(GALLERY.glob("FB_IMG_*.jpg"))
    total = 0
    changed = 0
    for path in files:
        count = process(path)
        if count:
            changed += 1
            total += count
        print(f"{path.name}: {count} face sticker(s)")
    print(f"Processed {len(files)} files; changed {changed}; stickers {total}")

if __name__ == "__main__":
    main()
