#!/usr/bin/env python3
"""Restores the 27 genuine pre-sticker gallery JPGs in memory and creates small,
accurately located privacy masks for *detected faces only*.

Run this ONLY on the isolated gallery review branch. The generated JPEGs are
never shipped to production without checking the contact sheet for missed
faces, false positives, alignment, and guardian consent.
"""
from __future__ import annotations

import io
import hashlib
import json
import math
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps

SOURCE_REV = "a2b4f2e80390aa6b64f6e95316ab288d81901726"
GALLERY = Path("src/assets/gallery-jpg")
AUDIT = Path("gallery-review")
MODEL = Path("/tmp/pisipouk-yunet-2023mar.onnx")
MODEL_URL = "https://huggingface.co/opencv/face_detection_yunet/resolve/main/face_detection_yunet_2023mar.onnx?download=true"
EXPECTED_MODEL_SHA256 = "8f2383e4dd3cfbb4553ea8718107fc0423210dc964f9f4280604804ed2552fa4"
SCORE_THRESHOLD = 0.87
# The face cover is purposely fitted to the detected face box, NEVER positioned
# at an arbitrary location in the scene or applied as a full-image sticker.
COVER_WIDTH = 1.23
COVER_HEIGHT = 1.26


def get_model():
    if not MODEL.is_file() or MODEL.stat().st_size < 200_000:
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    if MODEL.stat().st_size < 200_000 or hashlib.sha256(MODEL.read_bytes()).hexdigest() != EXPECTED_MODEL_SHA256:
        raise RuntimeError("YuNet model incomplete or checksum mismatch: fail closed")
    return MODEL


def source_jpeg(filename):
    if not filename.startswith("FB_IMG_") or not filename.endswith(".jpg"):
        raise ValueError("Unexpected gallery photo filename")
    return subprocess.check_output([
        "git", "show", f"{SOURCE_REV}:src/assets/gallery-jpg/{filename}"
    ])


def iou(box_a, box_b):
    ax, ay, aw, ah = box_a[:4]
    bx, by, bw, bh = box_b[:4]
    x0, y0, x1, y1 = max(ax, bx), max(ay, by), min(ax+aw, bx+bw), min(ay+ah, by+bh)
    common = max(0, x1-x0) * max(0, y1-y0)
    union = aw*ah + bw*bh - common
    return common/union if union else 0.0


def detect_faces(image, model):
    rgb = np.asarray(image.convert("RGB"))
    h, w = rgb.shape[:2]
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    boxes = []
    # Two sizes recover both near and small/group faces without enlarging masks.
    for longest in (800, 1440):
        factor = min(1.0, longest / max(w, h))
        dw, dh = max(32, int(round(w*factor))), max(32, int(round(h*factor)))
        resized = cv2.resize(bgr, (dw, dh), interpolation=cv2.INTER_AREA)
        detector = cv2.FaceDetectorYN.create(
            str(model), "", (dw, dh), SCORE_THRESHOLD, 0.3, 5000
        )
        _, results = detector.detect(resized)
        if results is None:
            continue
        for detection in results:
            x, y, fw, fh = (float(v)/factor for v in detection[:4])
            score = float(detection[-1])
            if fw < 16 or fh < 16:
                continue
            if score < SCORE_THRESHOLD:
                continue
            # Detector boxes can reach beyond photo edges.
            x, y = max(0., x), max(0., y)
            fw, fh = min(fw, w-x), min(fh, h-y)
            boxes.append([x,y,fw,fh,score])
    accepted=[]
    for box in sorted(boxes,key=lambda b:b[4],reverse=True):
        bx,by,bw,bh,_=box
        if any(iou(box,existing)>0.22 or (
            abs(bx+bw/2-existing[0]-existing[2]/2)<.30*max(bw,existing[2]) and
            abs(by+bh/2-existing[1]-existing[3]/2)<.30*max(bh,existing[3])
        ) for existing in accepted):
            continue
        accepted.append(box)
    return accepted


def small_face_sticker(draw, image_size, face):
    fw, fh = face[2], face[3]
    cx=face[0] + fw/2
    cy=face[1] + fh*.52
    rx=fw*COVER_WIDTH/2
    ry=fh*COVER_HEIGHT/2
    left,top=max(0,int(round(cx-rx))),max(0,int(round(cy-ry)))
    right,bottom=min(image_size[0],int(round(cx+rx))),min(image_size[1],int(round(cy+ry)))
    ww,hh=right-left,bottom-top
    if ww <= 6 or hh<=6:
        raise RuntimeError("Invalid face coverage extent")
    # Soft pastel, OPAQUE, with discreet details scaled entirely to the face size.
    border=max(1,round(min(ww,hh)*.030))
    draw.ellipse([left,top,right,bottom],fill=(255,238,205),outline=(255,255,255),width=border)
    eye_r=max(1,round(min(ww,hh)*.047))
    eye_y=top+hh*.40
    for dx in (.36,.64):
        ex=left+ww*dx
        draw.ellipse([ex-eye_r,eye_y-eye_r,ex+eye_r,eye_y+eye_r],fill=(81,60,48))
    smile_w= max(1,round(min(ww,hh)*.039))
    draw.arc([left+ww*.32,top+hh*.37,left+ww*.68,top+hh*.70],
             start=20,end=160,fill=(93,66,52),width=smile_w)


def make_sheet(samples, path):
    cols=3
    width=360
    cell_h=260
    rows=math.ceil(len(samples)/cols)
    sheet=Image.new("RGB",(cols*width,rows*cell_h),(245,248,250))
    draw=ImageDraw.Draw(sheet)
    for i,(name,image,note) in enumerate(samples):
        x=(i%cols)*width
        y=(i//cols)*cell_h
        src=image.copy()
        src.thumbnail((width-14,cell_h-44))
        sheet.paste(src,(x+(width-src.width)//2,y+8))
        draw.text((x+9,y+cell_h-27),f"{name[:25]}  {note}",fill=(30,50,70))
    path.parent.mkdir(parents=True,exist_ok=True)
    sheet.save(path,"JPEG",quality=89,optimize=True)


def run():
    model = get_model()
    images = sorted(GALLERY.glob("FB_IMG_*.jpg"))
    if len(images) != 27:
        raise RuntimeError(f"Expected 27 original images, found {len(images)}")
    overrides=json.loads(Path("scripts/gallery_face_overrides.json").read_text(encoding="utf-8"))
    clean=set(overrides["clean_original_without_new_sticker"])
    ignore_all=set(overrides.get("ignore_all_automatic", []))
    AUDIT.mkdir(parents=True,exist_ok=True)
    report={
        "source_revision":SOURCE_REV,
        "privacy_policy":"Gallery-specific review branch only. Manual overrides checked against original photos.",
        "detector":"OpenCV YuNet 0.87 + hand-checked face positions (no poster/illustration masks)",
        "total":len(images), "photos":[]
    }
    sheet=[]
    for path in images:
        previous=Image.open(path).convert("RGB")
        original=ImageOps.exif_transpose(Image.open(io.BytesIO(source_jpeg(path.name)))).convert("RGB")
        detected=[] if path.name in ignore_all else detect_faces(original,model)
        excluded=overrides.get("reject_boxes_near",{}).get(path.name,[])
        faces=[]
        for face in detected:
            cx=face[0]+face[2]/2
            cy=face[1]+face[3]/2
            if any(math.hypot(cx-ex,cy-ey)<max(25,face[2]*.42) for ex,ey in excluded):
                continue
            faces.append(face)
        for x,y,w,h in overrides.get("additional_faces",{}).get(path.name,[]):
            if not (w>8 and h>8 and x>=0 and y>=0 and x+w<=original.width and y+h<=original.height):
                raise RuntimeError(f"Invalid manual face box {path.name}: {[x,y,w,h]}")
            box=[float(x),float(y),float(w),float(h),1.0]
            if any(iou(box,f)>0.28 for f in faces):
                continue
            faces.append(box)

        if path.name in clean:
            if faces:
                raise RuntimeError("Clean-scene whitelist unexpectedly has detected or manual faces: "+path.name)
            # Four photos show only artwork; one has an original opaque heart on the child face.
            out=original.copy()
            out.save(path,"JPEG",quality=91,subsampling=0,optimize=True,progressive=True)
            status="clean_original_restored__MANUALLY_VERIFIED"
        elif faces:
            out=original.copy()
            draw=ImageDraw.Draw(out)
            for box in faces:
                small_face_sticker(draw,out.size,box)
            out.save(path,"JPEG",quality=91,subsampling=0,optimize=True,progressive=True)
            status="face_only_masks__MANUALLY_REVIEWED"
        else:
            # No original is ever released if face coverage is uncertain.
            out=previous
            status="kept_previous_mask__REQUIRES_MORE_REVIEW"
        report["photos"].append({
            "name":path.name,"size":list(original.size),"status":status,
            "face_masks":[{"x":round(b[0]),"y":round(b[1]),"w":round(b[2]),"h":round(b[3]),
                           "confidence":round(b[4],3)} for b in faces],
        })
        sheet.append((path.name,out,"masks="+str(len(faces))))
        print(f"{path.name} | {status} | masks={len(faces)}",flush=True)
    report["masked_photos"]=sum(x["status"].startswith("face_only") for x in report["photos"])
    report["clean_restored"]=sum(x["status"].startswith("clean_original") for x in report["photos"])
    report["kept_existing"]=len(images)-report["masked_photos"]-report["clean_restored"]
    report["face_masks"]=sum(len(x["face_masks"]) for x in report["photos"])
    (AUDIT/"masked-face-positions.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    make_sheet(sheet,AUDIT/"contact-sheet-MASKED-only.jpg")
    print(f"TOTAL: {report['masked_photos']} photos re-masked, {report['clean_restored']} original scenes restored, {report['kept_existing']} kept, {report['face_masks']} tight face stickers")
    if report["kept_existing"]:
        raise RuntimeError("Some images still require manual coverage: review report before release.")
    print("All 27 staged. Check contact sheet and obtain final approval BEFORE promoting to public site.")


if __name__=="__main__":
    run()
