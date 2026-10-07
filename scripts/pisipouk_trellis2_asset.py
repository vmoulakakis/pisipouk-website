#!/usr/bin/env python3
"""
Build-time Pisipouk asset generator using Microsoft TRELLIS.2.

This script is intentionally NOT part of the website runtime.
Run only in a compatible Linux + NVIDIA environment after installing
the official microsoft/TRELLIS.2 repository and its dependencies.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR", "1")
os.environ.setdefault("PYTORCH_CUDA_ALLOC_CONF", "expandable_segments:True")

import cv2
from PIL import Image
import torch

from trellis2.pipelines import Trellis2ImageTo3DPipeline
from trellis2.renderers import EnvMap
import o_voxel


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path, help="Clean single-object reference image")
    parser.add_argument("--output", type=Path, default=Path("pisipouk.generated.glb"))
    parser.add_argument("--envmap", type=Path, default=Path("assets/hdri/forest.exr"))
    parser.add_argument("--model", default="microsoft/TRELLIS.2-4B")
    parser.add_argument("--decimate", type=int, default=90000, help="Web target triangle budget")
    parser.add_argument("--texture-size", type=int, default=2048)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not torch.cuda.is_available():
        raise SystemExit("TRELLIS.2 generation requires a supported NVIDIA CUDA GPU.")

    env_np = cv2.imread(str(args.envmap), cv2.IMREAD_UNCHANGED)
    if env_np is None:
        raise SystemExit(f"Environment map not found: {args.envmap}")

    envmap = EnvMap(
        torch.tensor(
            cv2.cvtColor(env_np, cv2.COLOR_BGR2RGB),
            dtype=torch.float32,
            device="cuda",
        )
    )

    pipeline = Trellis2ImageTo3DPipeline.from_pretrained(args.model)
    pipeline.cuda()

    image = Image.open(args.image).convert("RGBA")
    mesh = pipeline.run(image)[0]

    # Keep the internal mesh under nvdiffrast's practical limits before export.
    mesh.simplify(16_777_216)

    glb = o_voxel.postprocess.to_glb(
        vertices=mesh.vertices,
        faces=mesh.faces,
        attr_volume=mesh.attrs,
        coords=mesh.coords,
        attr_layout=mesh.layout,
        voxel_size=mesh.voxel_size,
        aabb=[[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]],
        decimation_target=args.decimate,
        texture_size=args.texture_size,
        remesh=True,
        remesh_band=1,
        remesh_project=0,
        verbose=True,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    glb.export(str(args.output), extension_webp=True)
    print(f"Generated {args.output}")
    print("NEXT: inspect, retopologize, rig and animate in Blender before website use.")


if __name__ == "__main__":
    main()
