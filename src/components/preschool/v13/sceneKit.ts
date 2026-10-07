export const V13_COLORS = ["#ffd84d", "#ff7a9f", "#54bff0", "#795fe8", "#68cf83", "#ff9a61"];

export function mat(B: any, scene: any, name: string, color: string, rough = 0.62, metal = 0.01) {
  const m = new B.PBRMaterial(name, scene);
  m.albedoColor = B.Color3.FromHexString(color);
  m.roughness = rough;
  m.metallic = metal;
  return m;
}

export function safeShadow(shadow: any, node: any) {
  try {
    if (node && typeof node.getBoundingInfo === "function") shadow.addShadowCaster(node, false);
    else if (node && typeof node.getChildMeshes === "function") {
      for (const m of node.getChildMeshes(false) || []) {
        if (m && typeof m.getBoundingInfo === "function") shadow.addShadowCaster(m, false);
      }
    }
  } catch {
    // Visual enhancement only. Gameplay must not depend on shadows.
  }
}

export function animateMove(B: any, scene: any, mesh: any, to: any, frames = 16, done?: () => void) {
  const a = new B.Animation(`move-${mesh.name}-${Date.now()}`, "position", 30, B.Animation.ANIMATIONTYPE_VECTOR3, B.Animation.ANIMATIONLOOPMODE_CONSTANT);
  a.setKeys([{ frame: 0, value: mesh.position.clone() }, { frame: frames, value: to.clone() }]);
  mesh.animations = [a];
  scene.beginAnimation(mesh, 0, frames, false, 1, done);
}

export function animateScale(B: any, scene: any, mesh: any, factor = 1.18, frames = 12) {
  const start = mesh.scaling.clone();
  const peak = start.scale(factor);
  const a = new B.Animation(`scale-${mesh.name}-${Date.now()}`, "scaling", 30, B.Animation.ANIMATIONTYPE_VECTOR3, B.Animation.ANIMATIONLOOPMODE_CONSTANT);
  a.setKeys([{ frame: 0, value: start }, { frame: Math.floor(frames / 2), value: peak }, { frame: frames, value: start }]);
  mesh.animations = [a];
  scene.beginAnimation(mesh, 0, frames, false);
}

export function sparkle(B: any, scene: any, pos: any, rng: () => number) {
  for (let i = 0; i < 7; i++) {
    const s = B.MeshBuilder.CreateSphere(`v13-spark-${i}-${Date.now()}`, { diameter: 0.11, segments: 8 }, scene);
    s.position = pos.clone();
    s.material = mat(B, scene, `v13-spark-m-${i}-${Date.now()}`, V13_COLORS[i % V13_COLORS.length], 0.28, 0.02);
    const to = s.position.add(new B.Vector3((rng() - 0.5) * 1.5, 0.7 + rng() * 1.2, (rng() - 0.5) * 1.5));
    animateMove(B, scene, s, to, 18, () => s.dispose());
  }
}

function bindPick(B: any, scene: any, mesh: any, fn: () => void) {
  mesh.isPickable = true;
  mesh.actionManager = new B.ActionManager(scene);
  mesh.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger, fn));
}

export function clickAction(B: any, scene: any, mesh: any, fn: () => void) {
  // Children such as a drum skin, fruit stem or turtle head are visually part of
  // the same preschool object. A child should never become a dead tap target.
  bindPick(B, scene, mesh, fn);
  if (mesh && typeof mesh.getChildMeshes === "function") {
    for (const child of mesh.getChildMeshes(false) || []) bindPick(B, scene, child, fn);
  }
  return mesh;
}

export function groundDrag(B: any, mesh: any, onEnd: (mesh: any) => void) {
  // PointerDragBehavior belongs to the semantic root object. Decorative child
  // meshes are made non-pickable so a child can grab any visible part of it.
  if (mesh && typeof mesh.getChildMeshes === "function") {
    for (const child of mesh.getChildMeshes(false) || []) child.isPickable = false;
  }
  const behavior = new B.PointerDragBehavior({ dragPlaneNormal: new B.Vector3(0, 1, 0) });
  behavior.useObjectOrientationForDragging = false;
  behavior.moveAttached = true;
  behavior.dragDeltaRatio = 1.0;
  behavior.onDragEndObservable.add(() => onEnd(mesh));
  mesh.addBehavior(behavior);
  mesh.isPickable = true;
  return behavior;
}

export function createBear(B: any, scene: any) {
  const brown = mat(B, scene, "v13-bear-fur", "#b86a38", 0.82, 0);
  const cream = mat(B, scene, "v13-bear-cream", "#f3cba0", 0.88, 0);
  const dark = mat(B, scene, "v13-bear-dark", "#241d2b", 0.42, 0.03);
  const gold = mat(B, scene, "v13-bear-gold", "#ffd64d", 0.3, 0.05);
  const root = new B.TransformNode("pisipouk-bear-v13", scene);

  const body = B.MeshBuilder.CreateSphere("bear-body", { diameter: 2.08, segments: 28 }, scene);
  body.scaling = new B.Vector3(0.86, 1.05, 0.72);
  body.position.y = 1.55;
  body.material = brown;
  body.parent = root;

  const head = B.MeshBuilder.CreateSphere("bear-head", { diameter: 1.56, segments: 28 }, scene);
  head.position.y = 2.83;
  head.material = brown;
  head.parent = root;

  for (const sx of [-1, 1]) {
    const ear = B.MeshBuilder.CreateSphere("bear-ear", { diameter: 0.62, segments: 20 }, scene);
    ear.position = new B.Vector3(0.55 * sx, 3.37, 0);
    ear.material = brown;
    ear.parent = root;
    const inner = B.MeshBuilder.CreateSphere("bear-ear-inner", { diameter: 0.34, segments: 18 }, scene);
    inner.position = new B.Vector3(0.55 * sx, 3.39, -0.18);
    inner.material = cream;
    inner.parent = root;
  }

  const muzzle = B.MeshBuilder.CreateSphere("bear-muzzle", { diameter: 0.76, segments: 22 }, scene);
  muzzle.scaling = new B.Vector3(1, 0.68, 0.46);
  muzzle.position = new B.Vector3(0, 2.65, -0.68);
  muzzle.material = cream;
  muzzle.parent = root;

  const nose = B.MeshBuilder.CreateSphere("bear-nose", { diameter: 0.23, segments: 16 }, scene);
  nose.position = new B.Vector3(0, 2.72, -0.99);
  nose.material = dark;
  nose.parent = root;

  for (const sx of [-1, 1]) {
    const eye = B.MeshBuilder.CreateSphere("bear-eye", { diameter: 0.16, segments: 14 }, scene);
    eye.position = new B.Vector3(0.27 * sx, 2.98, -0.72);
    eye.material = dark;
    eye.parent = root;
  }

  for (const sx of [-1, 1]) {
    const arm = B.MeshBuilder.CreateCapsule("bear-arm", { height: 1.1, radius: 0.25, tessellation: 18 }, scene);
    arm.rotation.z = 0.62 * sx;
    arm.position = new B.Vector3(0.92 * sx, 1.7, 0);
    arm.material = brown;
    arm.parent = root;
    const leg = B.MeshBuilder.CreateCapsule("bear-leg", { height: 1.06, radius: 0.31, tessellation: 18 }, scene);
    leg.position = new B.Vector3(0.47 * sx, 0.56, 0);
    leg.material = brown;
    leg.parent = root;
  }

  const star = B.MeshBuilder.CreateDisc("bear-star", { radius: 0.27, tessellation: 5 }, scene);
  star.position = new B.Vector3(0, 1.65, -0.77);
  star.rotation.x = Math.PI;
  star.material = gold;
  star.parent = root;
  root.scaling = new B.Vector3(0.7, 0.7, 0.7);
  return root;
}

export function createWorld(B: any, scene: any, variant: "garden" | "harbor" | "village" | "lab" = "garden") {
  const sand = mat(B, scene, `v13-sand-${variant}`, variant === "lab" ? "#e8eef4" : "#f5da95", 0.9, 0);
  const grass = mat(B, scene, `v13-grass-${variant}`, "#7acb70", 0.88, 0);
  const water = mat(B, scene, `v13-water-${variant}`, "#46b9e9", 0.2, 0.03);
  const white = mat(B, scene, `v13-white-${variant}`, "#fff9eb", 0.8, 0);
  const blue = mat(B, scene, `v13-blue-${variant}`, "#4c79da", 0.46, 0.03);

  const sea = B.MeshBuilder.CreateDisc("v13-sea", { radius: 20, tessellation: 64 }, scene);
  sea.rotation.x = Math.PI / 2;
  sea.position.y = -0.35;
  sea.material = water;

  const island = B.MeshBuilder.CreateCylinder("v13-island", { height: 0.8, diameterTop: 13.5, diameterBottom: 12, tessellation: 64 }, scene);
  island.material = sand;
  island.position.y = -0.08;
  const top = B.MeshBuilder.CreateCylinder("v13-island-top", { height: 0.18, diameter: 12.8, tessellation: 64 }, scene);
  top.material = variant === "lab" ? white : grass;
  top.position.y = 0.39;

  if (variant !== "lab") {
    for (const p of [[-4.2, 2.8], [3.8, 2.6], [4.1, -2.6]]) {
      const trunk = B.MeshBuilder.CreateCylinder("v13-tree-trunk", { height: 1.3, diameter: 0.34, tessellation: 14 }, scene);
      trunk.position = new B.Vector3(p[0], 1.02, p[1]);
      trunk.material = mat(B, scene, `v13-trunk-${p[0]}-${p[1]}`, "#8a5a3d", 0.92, 0);
      const crown = B.MeshBuilder.CreateSphere("v13-tree-crown", { diameter: 1.55, segments: 18 }, scene);
      crown.position = new B.Vector3(p[0], 2.03, p[1]);
      crown.material = grass;
    }
  }

  if (variant === "village" || variant === "harbor") {
    for (const p of [[-3.1, -2.2], [2.4, 2.7]]) {
      const house = B.MeshBuilder.CreateBox("v13-house", { width: 1.7, height: 1.35, depth: 1.5 }, scene);
      house.position = new B.Vector3(p[0], 1.07, p[1]);
      house.material = white;
      const roof = B.MeshBuilder.CreateCylinder("v13-roof", { diameter: 2.1, height: 0.75, tessellation: 4 }, scene);
      roof.rotation.y = Math.PI / 4;
      roof.position = new B.Vector3(p[0], 1.98, p[1]);
      roof.material = blue;
    }
  }

  if (variant === "lab") {
    const bench = B.MeshBuilder.CreateBox("v13-lab-bench", { width: 7, height: 0.35, depth: 1.6 }, scene);
    bench.position = new B.Vector3(0, 0.75, 2.4);
    bench.material = mat(B, scene, "v13-bench", "#f7d4a5", 0.84, 0);
  }

  return { sea, island, top };
}

export function createFruit(B: any, scene: any, name: string, color: string) {
  const fruit = B.MeshBuilder.CreateSphere(name, { diameter: 0.78, segments: 24 }, scene);
  fruit.scaling = new B.Vector3(1, 0.94, 1);
  fruit.material = mat(B, scene, `${name}-mat`, color, 0.48, 0.01);
  const stem = B.MeshBuilder.CreateCylinder(`${name}-stem`, { height: 0.24, diameter: 0.08, tessellation: 10 }, scene);
  stem.position = new B.Vector3(0, 0.45, 0);
  stem.material = mat(B, scene, `${name}-stem-mat`, "#6e5635", 0.9, 0);
  stem.parent = fruit;
  return fruit;
}

export function createFlower(B: any, scene: any, name: string, color: string) {
  const root = new B.TransformNode(name, scene);
  const green = mat(B, scene, `${name}-stem-mat`, "#4da863", 0.86, 0);
  const petal = mat(B, scene, `${name}-petal-mat`, color, 0.52, 0.01);
  const centerMat = mat(B, scene, `${name}-center-mat`, "#ffd64f", 0.45, 0.01);
  const stem = B.MeshBuilder.CreateCylinder(`${name}-stem`, { height: 1.05, diameter: 0.12, tessellation: 12 }, scene);
  stem.position.y = 0.52;
  stem.material = green;
  stem.parent = root;
  const center = B.MeshBuilder.CreateSphere(`${name}-center`, { diameter: 0.34, segments: 16 }, scene);
  center.position.y = 1.08;
  center.material = centerMat;
  center.parent = root;
  for (let i = 0; i < 6; i++) {
    const p = B.MeshBuilder.CreateSphere(`${name}-petal`, { diameter: 0.34, segments: 14 }, scene);
    p.scaling = new B.Vector3(1.35, 0.65, 0.55);
    const a = (i / 6) * Math.PI * 2;
    p.position = new B.Vector3(Math.cos(a) * 0.34, 1.08 + Math.sin(a) * 0.34, 0);
    p.material = petal;
    p.parent = root;
  }
  return root;
}

export function createFish(B: any, scene: any, name: string, color: string) {
  const body = B.MeshBuilder.CreateSphere(name, { diameter: 0.82, segments: 20 }, scene);
  body.scaling = new B.Vector3(1.35, 0.72, 0.62);
  body.material = mat(B, scene, `${name}-m`, color, 0.48, 0.01);
  const tail = B.MeshBuilder.CreateCylinder(`${name}-tail`, { diameter: 0.58, height: 0.15, tessellation: 3 }, scene);
  tail.rotation.z = Math.PI / 2;
  tail.position.x = 0.58;
  tail.material = body.material;
  tail.parent = body;
  return body;
}

export function createTurtle(B: any, scene: any, name: string) {
  const shell = B.MeshBuilder.CreateSphere(name, { diameter: 0.9, segments: 20 }, scene);
  shell.scaling = new B.Vector3(1.2, 0.55, 0.85);
  shell.material = mat(B, scene, `${name}-shell`, "#59a75c", 0.8, 0);
  const head = B.MeshBuilder.CreateSphere(`${name}-head`, { diameter: 0.34, segments: 14 }, scene);
  head.position.x = -0.58;
  head.material = mat(B, scene, `${name}-head-m`, "#78c77b", 0.84, 0);
  head.parent = shell;
  return shell;
}

export function createBasket(B: any, scene: any, name: string, color = "#d7a45f") {
  const base = B.MeshBuilder.CreateCylinder(name, { height: 0.55, diameterTop: 1.25, diameterBottom: 1.0, tessellation: 28 }, scene);
  base.material = mat(B, scene, `${name}-m`, color, 0.92, 0);
  const rim = B.MeshBuilder.CreateTorus(`${name}-rim`, { diameter: 1.25, thickness: 0.1, tessellation: 28 }, scene);
  rim.position.y = 0.27;
  rim.material = base.material;
  rim.parent = base;
  return base;
}

export function createDrum(B: any, scene: any, name: string, color: string) {
  const drum = B.MeshBuilder.CreateCylinder(name, { height: 0.82, diameter: 1.2, tessellation: 32 }, scene);
  drum.material = mat(B, scene, `${name}-m`, color, 0.42, 0.02);
  const top = B.MeshBuilder.CreateCylinder(`${name}-top`, { height: 0.06, diameter: 1.22, tessellation: 32 }, scene);
  top.position.y = 0.44;
  top.material = mat(B, scene, `${name}-top-m`, "#fff8e8", 0.72, 0);
  top.parent = drum;
  return drum;
}

export function createTone(audioState: { ctx?: AudioContext }, frequency: number, length = 0.28) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioState.ctx = audioState.ctx || new AudioCtx();
    const ctx = audioState.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + length + 0.02);
  } catch {
    // Audio is enhancement; gameplay remains usable if autoplay/device policy blocks it.
  }
}

export function distance2D(a: any, b: any) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}
