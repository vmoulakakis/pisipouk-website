from pathlib import Path
import cv2
from PIL import Image, ImageDraw

GALLERY = Path("src/assets/gallery-jpg")
DETECT_MAX_SIDE = 760

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
    oh, ow = bgr.shape[:2]
    scale = min(DETECT_MAX_SIDE / max(ow, oh), 1.0)
    if scale < 1:
        work = cv2.resize(bgr, (round(ow * scale), round(oh * scale)), interpolation=cv2.INTER_AREA)
    else:
        work = bgr

    gray = cv2.cvtColor(work, cv2.COLOR_BGR2GRAY)
    boxes = []
    cascade_specs = [
        ("haarcascade_frontalface_default.xml", 1.08, 3),
        ("haarcascade_frontalface_alt2.xml", 1.08, 3),
    ]
    for name, sf, neighbors in cascade_specs:
        cascade = cv2.CascadeClassifier(cv2.data.haarcascades + name)
        found = cascade.detectMultiScale(gray, scaleFactor=sf, minNeighbors=neighbors, minSize=(16, 16))
        boxes.extend([tuple(map(int, f)) for f in found])

    profile = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")
    for working, flipped in [(gray, False), (cv2.flip(gray, 1), True)]:
        found = profile.detectMultiScale(working, scaleFactor=1.08, minNeighbors=4, minSize=(16, 16))
        for x, y, w, h in found:
            if flipped:
                x = gray.shape[1] - x - w
            boxes.append((int(x), int(y), int(w), int(h)))

    boxes = merge_boxes(boxes)
    if scale < 1:
        inv = 1.0 / scale
        boxes = [(round(x*inv), round(y*inv), round(w*inv), round(h*inv)) for x,y,w,h in boxes]
    return boxes

def draw_smiley(im, box):
    x, y, w, h = box
    cx, cy = x + w/2, y + h/2
    diameter = max(36, max(w, h) * 1.42)
    r = diameter / 2
    left = int(max(0, cx-r)); top = int(max(0, cy-r))
    right = int(min(im.width-1, cx+r)); bottom = int(min(im.height-1, cy+r))

    d = ImageDraw.Draw(im)
    rw, rh = right-left, bottom-top
    border = max(2, int(min(rw, rh)*0.045))
    d.ellipse((left, top, right, bottom), fill=(255, 211, 42), outline=(255,255,255), width=border)

    eye_r = max(2, int(min(rw,rh)*0.065))
    ey = top + int(rh*0.36)
    dx = int(rw*0.18)
    mx = (left+right)//2
    for ex in (mx-dx, mx+dx):
        d.ellipse((ex-eye_r, ey-eye_r, ex+eye_r, ey+eye_r), fill=(30,30,30))

    smile = (left+int(rw*0.27), top+int(rh*0.43), right-int(rw*0.27), bottom-int(rh*0.18))
    d.arc(smile, start=20, end=160, fill=(30,30,30), width=max(2, int(min(rw,rh)*0.055)))

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
    total = changed = 0
    for path in files:
        count = process(path)
        if count:
            changed += 1
            total += count
        print(f"{path.name}: {count} face sticker(s)", flush=True)
    print(f"Processed {len(files)} files; changed {changed}; stickers {total}", flush=True)

if __name__ == "__main__":
    main()
