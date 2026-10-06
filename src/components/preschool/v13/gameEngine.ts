import type { GameDef } from "./gameCatalog";
import {
  V13_COLORS,
  animateMove,
  animateScale,
  clickAction,
  createBasket,
  createBear,
  createDrum,
  createFish,
  createFlower,
  createFruit,
  createTone,
  createTurtle,
  createWorld,
  distance2D,
  groundDrag,
  mat,
  safeShadow,
  sparkle,
} from "./sceneKit";

export type GameCallbacks = {
  onMessage: (message: string) => void;
  onProgress: (value: number, total: number) => void;
  onDone: () => void;
  onMistake: () => void;
};

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let x = seed || 1234567;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

function speak(text: string) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "el-GR";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch {
    // Speech is optional enhancement.
  }
}

function clickNode(B: any, scene: any, node: any, fn: () => void) {
  if (node && typeof node.getBoundingInfo === "function") clickAction(B, scene, node, fn);
  if (node && typeof node.getChildMeshes === "function") {
    for (const m of node.getChildMeshes(false) || []) clickAction(B, scene, m, fn);
  }
}

function worldVariant(game: GameDef): "garden" | "harbor" | "village" | "lab" {
  if (["count-delivery", "story-quest"].includes(game.kind)) return "harbor";
  if (["story-order", "build-bridge", "pretend-market", "rhythm-copy"].includes(game.kind)) return "village";
  if (["float-predict", "marble-run"].includes(game.kind)) return "lab";
  return "garden";
}

export function createGameScene(B: any, canvas: HTMLCanvasElement, game: GameDef, cb: GameCallbacks) {
  const engine = new B.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true });
  const scene = new B.Scene(engine);
  scene.clearColor = new B.Color4(0.84, 0.96, 1, 1);

  const camera = new B.ArcRotateCamera("v13-camera", -Math.PI / 2, 1.03, 15, new B.Vector3(0, 1.2, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = game.age === "2" ? 11 : 9;
  camera.upperRadiusLimit = 18;
  camera.lowerBetaLimit = 0.68;
  camera.upperBetaLimit = 1.3;
  camera.wheelPrecision = 85;
  camera.pinchPrecision = 95;
  camera.panningSensibility = 0;

  const hemi = new B.HemisphericLight("v13-hemi", new B.Vector3(0, 1, 0), scene);
  hemi.intensity = 1.03;
  const sun = new B.DirectionalLight("v13-sun", new B.Vector3(-0.45, -1, 0.35), scene);
  sun.position = new B.Vector3(8, 14, -8);
  sun.intensity = 1.15;
  const shadow = new B.ShadowGenerator(1024, sun);
  shadow.useBlurExponentialShadowMap = true;
  shadow.blurKernel = 12;

  createWorld(B, scene, worldVariant(game));
  const bear = createBear(B, scene);
  bear.position = new B.Vector3(-4.2, 0.45, -0.7);
  safeShadow(shadow, bear);

  const rng = makeRng(hash(`${game.id}:${new Date().toISOString().slice(0, 10)}:${Math.floor(Math.random() * 10000)}`));
  const audioState: { ctx?: AudioContext } = {};
  const timers: number[] = [];
  let elapsed = 0;
  scene.registerBeforeRender(() => {
    elapsed += engine.getDeltaTime() / 1000;
    bear.position.y = 0.45 + Math.sin(elapsed * 2.0) * 0.05;
    bear.rotation.y = Math.sin(elapsed * 0.72) * 0.06;
  });

  let finished = false;
  const progress = (value: number, total: number, message?: string) => {
    cb.onProgress(value, total);
    if (message) cb.onMessage(message);
  };
  const finish = (message = "Τα κατάφερες! Θες να το ξαναπαίξεις;") => {
    if (finished) return;
    finished = true;
    cb.onMessage(message);
    speak("Μπράβο! Τα κατάφερες!");
    const id = window.setTimeout(cb.onDone, 420);
    timers.push(id);
  };
  const gentleRetry = (message: string) => {
    cb.onMistake();
    cb.onMessage(message);
  };

  if (game.kind === "tap-discovery") {
    cb.onMessage("Άγγιξε ό,τι σου κάνει εντύπωση. Κάθε πράγμα κάνει κάτι διαφορετικό!");
    cb.onProgress(0, 6);
    const touched = new Set<string>();
    const positions = [
      [-2.2, 0.5, -2.2], [-0.5, 0.5, -2.5], [1.4, 0.5, -2.1],
      [-1.6, 0.5, 1.5], [0.5, 0.5, 1.7], [2.4, 0.5, 1.1],
    ];

    const flower = createFlower(B, scene, "discover-flower", "#ff78a3");
    flower.position = new B.Vector3(...positions[0]);
    clickNode(B, scene, flower, () => {
      animateScale(B, scene, flower.getChildMeshes()[1] || flower, 1.24);
      touched.add("flower");
      progress(touched.size, 6, "Το λουλούδι χόρεψε!");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });

    const drum = createDrum(B, scene, "discover-drum", "#56c2ed");
    drum.position = new B.Vector3(...positions[1]);
    clickAction(B, scene, drum, () => {
      createTone(audioState, 262);
      animateScale(B, scene, drum, 1.16);
      touched.add("drum");
      progress(touched.size, 6, "Μπουμ! Το τύμπανο απάντησε.");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });

    const apple = createFruit(B, scene, "discover-apple", "#ef635d");
    apple.position = new B.Vector3(...positions[2]);
    clickAction(B, scene, apple, () => {
      animateScale(B, scene, apple, 1.2);
      touched.add("apple");
      progress(touched.size, 6, "Μήλο! Ο Πισιπούκ το είδε.");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });

    const fish = createFish(B, scene, "discover-fish", "#54bff0");
    fish.position = new B.Vector3(...positions[3]);
    clickAction(B, scene, fish, () => {
      const to = fish.position.add(new B.Vector3(0, 0.8, 0));
      animateMove(B, scene, fish, to, 10, () => animateMove(B, scene, fish, to.add(new B.Vector3(0, -0.8, 0)), 10));
      touched.add("fish");
      progress(touched.size, 6, "Το ψαράκι πήδηξε!");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });

    const turtle = createTurtle(B, scene, "discover-turtle");
    turtle.position = new B.Vector3(...positions[4]);
    clickAction(B, scene, turtle, () => {
      turtle.rotation.y += Math.PI / 3;
      touched.add("turtle");
      progress(touched.size, 6, "Η χελώνα γύρισε να σε δει!");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });

    const bell = B.MeshBuilder.CreateSphere("discover-bell", { diameter: 0.95, segments: 20 }, scene);
    bell.position = new B.Vector3(...positions[5]);
    bell.material = mat(B, scene, "discover-bell-m", "#ffd44f", 0.32, 0.08);
    safeShadow(shadow, bell);
    clickAction(B, scene, bell, () => {
      createTone(audioState, 660, 0.35);
      animateScale(B, scene, bell, 1.2);
      touched.add("bell");
      progress(touched.size, 6, "Ντιν-νταν! Άκουσες το κουδούνι;");
      if (touched.size === 6) finish("Ξύπνησες όλο τον κήπο! 🌼");
    });
  }

  if (game.kind === "feed-drag") {
    cb.onMessage("Σύρε τα φρούτα στο πιατάκι του Πισιπούκ.");
    cb.onProgress(0, 4);
    const plate = B.MeshBuilder.CreateCylinder("feed-plate", { height: 0.12, diameter: 2.2, tessellation: 40 }, scene);
    plate.position = new B.Vector3(-2.7, 0.58, 1.0);
    plate.material = mat(B, scene, "feed-plate-m", "#fff9e8", 0.72, 0);
    let count = 0;
    const foods = [
      ["μήλο", "#ef635d"], ["λεμόνι", "#ffd84d"], ["αχλάδι", "#8dcc6f"], ["πορτοκάλι", "#ff995d"],
    ] as const;
    foods.forEach(([label, color], i) => {
      const fruit = createFruit(B, scene, `feed-fruit-${i}`, color);
      fruit.position = new B.Vector3(-0.5 + i * 1.25, 0.9, -2.2 + (i % 2) * 0.5);
      const home = fruit.position.clone();
      safeShadow(shadow, fruit);
      groundDrag(B, fruit, () => {
        if (distance2D(fruit.position, plate.position) < 1.35) {
          count++;
          fruit.removeBehavior(fruit.behaviors[0]);
          sparkle(B, scene, plate.position, rng);
          animateMove(B, scene, fruit, new B.Vector3(-2.8 + (count % 2) * 0.5, 0.85, 0.8 + Math.floor(count / 2) * 0.4), 12);
          progress(count, 4, `Έδωσες ${label}. Μπράβο!`);
          if (count === 4) finish("Ο Πισιπούκ χόρτασε και σε ευχαριστεί! 🍎");
        } else {
          animateMove(B, scene, fruit, home, 12);
          cb.onMessage("Φέρε το φρούτο πάνω στο μεγάλο πιατάκι.");
        }
      });
    });
  }

  if (game.kind === "music-free") {
    cb.onMessage("Παίξε όπως θέλεις. Δεν υπάρχει σωστό ή λάθος.");
    cb.onProgress(0, 8);
    const freqs = [220, 294, 392, 523, 659];
    let taps = 0;
    for (let i = 0; i < 5; i++) {
      const drum = createDrum(B, scene, `free-drum-${i}`, V13_COLORS[i]);
      drum.position = new B.Vector3(-2.3 + i * 1.15, 0.9, 0.8 + Math.sin(i) * 0.4);
      clickAction(B, scene, drum, () => {
        createTone(audioState, freqs[i], 0.32);
        animateScale(B, scene, drum, 1.16);
        taps++;
        progress(Math.min(taps, 8), 8, taps < 8 ? "Ωραίος ήχος! Δοκίμασε κι άλλον." : "Έφτιαξες τη δική σου μικρή συναυλία!");
        if (taps === 8) finish("Η συναυλία τελείωσε — μπορείς να συνεχίσεις να παίζεις! 🎵");
      });
    }
  }

  if (game.kind === "peekaboo") {
    cb.onMessage("Ποιος κρύβεται πίσω από τις πόρτες; Άνοιξέ τες μία-μία.");
    cb.onProgress(0, 3);
    let found = 0;
    const animalCreators = [
      () => createTurtle(B, scene, "peek-turtle"),
      () => createFish(B, scene, "peek-fish", "#5bc5ef"),
      () => createFruit(B, scene, "peek-apple", "#ef635d"),
    ];
    for (let i = 0; i < 3; i++) {
      const x = -1.9 + i * 1.9;
      const door = B.MeshBuilder.CreateBox(`peek-door-${i}`, { width: 1.35, height: 1.9, depth: 0.18 }, scene);
      door.position = new B.Vector3(x, 1.35, 0.4);
      door.material = mat(B, scene, `peek-door-m-${i}`, ["#ffb476", "#7ccff0", "#9adf8a"][i], 0.7, 0);
      const animal = animalCreators[i]();
      animal.position = new B.Vector3(x, 0.9, 0.9);
      animal.setEnabled(false);
      let open = false;
      clickAction(B, scene, door, () => {
        if (open) return;
        open = true;
        door.rotation.y = Math.PI / 2.4;
        animal.setEnabled(true);
        found++;
        sparkle(B, scene, animal.position, rng);
        progress(found, 3, found < 3 ? "Βρήκες έναν φίλο! Ποιος κρύβεται στην επόμενη;" : "Τους βρήκες όλους!");
        if (found === 3) finish("Κανείς δεν κρύβεται πια! 🙈");
      });
    }
  }

  if (game.kind === "color-sort") {
    cb.onMessage("Σύρε κάθε αντικείμενο στο καλάθι με το ίδιο χρώμα.");
    cb.onProgress(0, 6);
    const basketColors = ["#ef635d", "#54bff0", "#ffd84d"];
    const baskets = basketColors.map((c, i) => {
      const basket = createBasket(B, scene, `color-basket-${i}`, c);
      basket.position = new B.Vector3(-2.2 + i * 2.2, 0.72, 2.1);
      return basket;
    });
    let count = 0;
    for (let i = 0; i < 6; i++) {
      const target = i % 3;
      const object = createFruit(B, scene, `color-object-${i}`, basketColors[target]);
      object.position = new B.Vector3(-2.8 + i * 1.1, 0.9, -2.0 + (i % 2) * 0.4);
      const home = object.position.clone();
      groundDrag(B, object, () => {
        const nearest = baskets.map((b, index) => ({ index, d: distance2D(object.position, b.position) })).sort((a, b) => a.d - b.d)[0];
        if (nearest.d < 1.2 && nearest.index === target) {
          count++;
          object.removeBehavior(object.behaviors[0]);
          animateMove(B, scene, object, baskets[target].position.add(new B.Vector3(0, 0.55 + count * 0.02, 0)), 10);
          sparkle(B, scene, baskets[target].position, rng);
          progress(count, 6, count < 6 ? "Ναι! Ίδιο χρώμα." : "Όλα τα χρώματα βρήκαν το καλάθι τους!");
          if (count === 6) finish();
        } else {
          animateMove(B, scene, object, home, 10);
          gentleRetry("Κοίτα το χρώμα του αντικειμένου και βρες το ίδιο καλάθι.");
        }
      });
    }
  }

  if (game.kind === "bead-string") {
    cb.onMessage("Πέρασε τις μεγάλες χάντρες στο κορδόνι με όποια σειρά σου αρέσει.");
    cb.onProgress(0, 6);
    const cord = B.MeshBuilder.CreateBox("bead-cord", { width: 6.6, height: 0.08, depth: 0.08 }, scene);
    cord.position = new B.Vector3(0, 1.05, 1.5);
    cord.material = mat(B, scene, "bead-cord-m", "#7c634c", 0.9, 0);
    const slots = Array.from({ length: 6 }, (_, i) => new B.Vector3(-2.5 + i, 1.05, 1.5));
    const occupied = new Set<number>();
    let count = 0;
    for (let i = 0; i < 6; i++) {
      const bead = B.MeshBuilder.CreateTorus(`bead-${i}`, { diameter: 0.72, thickness: 0.24, tessellation: 26 }, scene);
      bead.rotation.x = Math.PI / 2;
      bead.position = new B.Vector3(-2.5 + i, 0.9, -1.8);
      bead.material = mat(B, scene, `bead-m-${i}`, V13_COLORS[i], 0.48, 0.02);
      const home = bead.position.clone();
      groundDrag(B, bead, () => {
        const nearest = slots.map((s, index) => ({ index, d: distance2D(bead.position, s) })).sort((a, b) => a.d - b.d)[0];
        if (nearest.d < 0.9 && !occupied.has(nearest.index)) {
          occupied.add(nearest.index);
          count++;
          bead.removeBehavior(bead.behaviors[0]);
          animateMove(B, scene, bead, slots[nearest.index], 10);
          progress(count, 6, count < 6 ? "Ωραία! Διάλεξε την επόμενη χάντρα." : "Έφτιαξες το δικό σου κολιέ!");
          if (count === 6) finish("Το κολιέ είναι έτοιμο! 📿");
        } else {
          animateMove(B, scene, bead, home, 10);
          cb.onMessage("Βρες ένα άδειο σημείο πάνω στο κορδόνι.");
        }
      });
    }
  }

  if (game.kind === "action-match") {
    cb.onProgress(0, 3);
    const actions = ["τρέχει", "τρώει", "κοιμάται"];
    const bodies: any[] = [];
    for (let i = 0; i < 3; i++) {
      const body = B.MeshBuilder.CreateCapsule(`action-${actions[i]}`, { height: 1.7, radius: 0.42, tessellation: 18 }, scene);
      body.position = new B.Vector3(-2 + i * 2, 1.25, 0.7);
      body.material = mat(B, scene, `action-m-${i}`, V13_COLORS[i + 1], 0.56, 0.01);
      safeShadow(shadow, body);
      bodies.push(body);
      if (i === 1) {
        const snack = createFruit(B, scene, "action-snack", "#ef635d");
        snack.scaling.scaleInPlace(0.45);
        snack.position = new B.Vector3(0.45, 0.35, -0.35);
        snack.parent = body;
      }
      if (i === 2) body.rotation.z = Math.PI / 2;
    }
    let round = 0;
    const targets = [0, 2, 1];
    const prompt = () => {
      const text = `Ποιος ${actions[targets[round]]};`;
      cb.onMessage(text);
      speak(text);
    };
    bodies.forEach((body, index) => {
      clickAction(B, scene, body, () => {
        if (index === targets[round]) {
          animateScale(B, scene, body, 1.2);
          sparkle(B, scene, body.position, rng);
          round++;
          progress(round, 3);
          if (round === 3) finish("Βρήκες όλες τις δράσεις! 🏃");
          else prompt();
        } else {
          gentleRetry("Κοίτα τι κάνει ο καθένας και δοκίμασε ξανά.");
        }
      });
    });
    prompt();
  }

  if (game.kind === "two-step") {
    cb.onMessage("Βήμα 1: βάλε τα 3 φρούτα στο καλάθι.");
    cb.onProgress(0, 4);
    const basket = createBasket(B, scene, "routine-basket");
    basket.position = new B.Vector3(1.9, 0.72, 0.9);
    const cloth = B.MeshBuilder.CreateBox("routine-cloth", { width: 2.8, height: 0.08, depth: 2.0 }, scene);
    cloth.position = new B.Vector3(-1.8, 0.55, 2.0);
    cloth.material = mat(B, scene, "routine-cloth-m", "#ffd9e6", 0.75, 0);
    let fruitCount = 0;
    const basketHome = basket.position.clone();
    const basketDrag = groundDrag(B, basket, () => {
      if (fruitCount < 3) {
        animateMove(B, scene, basket, basketHome, 10);
        return;
      }
      if (distance2D(basket.position, cloth.position) < 1.4) {
        animateMove(B, scene, basket, cloth.position.add(new B.Vector3(0, 0.5, 0)), 10);
        progress(4, 4);
        finish("Το πικνίκ είναι έτοιμο! 🧺");
      } else {
        animateMove(B, scene, basket, basketHome, 10);
        cb.onMessage("Βήμα 2: πήγαινε το καλάθι πάνω στο ροζ τραπεζομάντιλο.");
      }
    });
    basketDrag.enabled = false;

    ["#ef635d", "#ffd84d", "#8dcc6f"].forEach((color, i) => {
      const fruit = createFruit(B, scene, `routine-fruit-${i}`, color);
      fruit.position = new B.Vector3(-2.0 + i * 1.1, 0.9, -1.8);
      const home = fruit.position.clone();
      groundDrag(B, fruit, () => {
        if (distance2D(fruit.position, basket.position) < 1.2) {
          fruitCount++;
          fruit.removeBehavior(fruit.behaviors[0]);
          animateMove(B, scene, fruit, basket.position.add(new B.Vector3((i - 1) * 0.22, 0.52, 0)), 10);
          progress(fruitCount, 4, fruitCount < 3 ? "Μπήκε στο καλάθι. Συνέχισε." : "Βήμα 2: τώρα σύρε όλο το καλάθι στο τραπεζομάντιλο.");
          if (fruitCount === 3) basketDrag.enabled = true;
        } else {
          animateMove(B, scene, fruit, home, 10);
          cb.onMessage("Πρώτα βάζουμε τα φρούτα μέσα στο καλάθι.");
        }
      });
    });
  }

  if (game.kind === "story-order") {
    cb.onMessage("Βάλε τις τρεις σκηνές στη σειρά: πρώτα, μετά, στο τέλος.");
    cb.onProgress(0, 3);
    const slots = [-2, 0, 2].map((x, i) => {
      const slot = B.MeshBuilder.CreateBox(`story-slot-${i}`, { width: 1.45, height: 0.08, depth: 1.45 }, scene);
      slot.position = new B.Vector3(x, 0.55, 2.0);
      slot.material = mat(B, scene, `story-slot-m-${i}`, "#f4f2ff", 0.85, 0);
      return slot;
    });
    const tokens = [
      { label: "σύννεφο", color: "#7bbbe2", shape: "sphere" },
      { label: "ομπρέλα", color: "#ff789c", shape: "cylinder" },
      { label: "ουράνιο τόξο", color: "#ffd84d", shape: "torus" },
    ];
    let placed = 0;
    tokens.forEach((token, index) => {
      const mesh = token.shape === "sphere"
        ? B.MeshBuilder.CreateSphere(`story-token-${index}`, { diameter: 1.0, segments: 20 }, scene)
        : token.shape === "cylinder"
          ? B.MeshBuilder.CreateCylinder(`story-token-${index}`, { height: 0.9, diameter: 1.0, tessellation: 24 }, scene)
          : B.MeshBuilder.CreateTorus(`story-token-${index}`, { diameter: 1.0, thickness: 0.28, tessellation: 28 }, scene);
      mesh.position = new B.Vector3(-2 + index * 2, 0.95, -1.8);
      mesh.material = mat(B, scene, `story-token-m-${index}`, token.color, 0.48, 0.02);
      const home = mesh.position.clone();
      groundDrag(B, mesh, () => {
        if (distance2D(mesh.position, slots[index].position) < 1.0) {
          placed++;
          mesh.removeBehavior(mesh.behaviors[0]);
          animateMove(B, scene, mesh, slots[index].position.add(new B.Vector3(0, 0.62, 0)), 10);
          progress(placed, 3, placed < 3 ? "Ωραία. Ποια σκηνή έρχεται μετά;" : "Η ιστορία μπήκε στη σειρά!");
          if (placed === 3) finish("Πρώτα ήρθε το σύννεφο, μετά ανοίξαμε ομπρέλα και στο τέλος βγήκε ουράνιο τόξο! 🌈");
        } else {
          animateMove(B, scene, mesh, home, 10);
          gentleRetry("Σκέψου τι έγινε πρώτο, τι μετά και τι στο τέλος.");
        }
      });
    });
  }

  if (game.kind === "build-bridge") {
    cb.onMessage("Σύρε τα 4 ξύλα πάνω από το ρυάκι για να φτιάξεις γέφυρα.");
    cb.onProgress(0, 4);
    const stream = B.MeshBuilder.CreateBox("bridge-stream", { width: 7, height: 0.08, depth: 1.9 }, scene);
    stream.position = new B.Vector3(0, 0.5, 1.0);
    stream.material = mat(B, scene, "bridge-stream-m", "#55c2ef", 0.25, 0.02);
    const slotPos = [-2.25, -0.75, 0.75, 2.25].map(x => new B.Vector3(x, 0.72, 1.0));
    const occupied = new Set<number>();
    let placed = 0;
    for (let i = 0; i < 4; i++) {
      const plank = B.MeshBuilder.CreateBox(`bridge-plank-${i}`, { width: 1.35, height: 0.22, depth: 1.55 }, scene);
      plank.position = new B.Vector3(-2.3 + i * 1.55, 0.78, -1.8);
      plank.material = mat(B, scene, `bridge-plank-m-${i}`, "#b77c4a", 0.9, 0);
      const home = plank.position.clone();
      groundDrag(B, plank, () => {
        const nearest = slotPos.map((s, index) => ({ index, d: distance2D(plank.position, s) })).sort((a, b) => a.d - b.d)[0];
        if (nearest.d < 1.0 && !occupied.has(nearest.index)) {
          occupied.add(nearest.index);
          placed++;
          plank.removeBehavior(plank.behaviors[0]);
          animateMove(B, scene, plank, slotPos[nearest.index], 10);
          progress(placed, 4, placed < 4 ? "Η γέφυρα μεγαλώνει. Συνέχισε." : "Η γέφυρα φαίνεται έτοιμη. Ας τη δοκιμάσουμε!");
          if (placed === 4) {
            const cart = B.MeshBuilder.CreateBox("bridge-cart", { width: 0.75, height: 0.55, depth: 0.7 }, scene);
            cart.position = new B.Vector3(-3.6, 1.12, 1.0);
            cart.material = mat(B, scene, "bridge-cart-m", "#ff7a9f", 0.48, 0.02);
            animateMove(B, scene, cart, new B.Vector3(3.6, 1.12, 1.0), 70, () => finish("Η γέφυρα κράτησε! Μπορείς να ξαναχτίσεις άλλη διαδρομή. 🌉"));
          }
        } else {
          animateMove(B, scene, plank, home, 10);
          cb.onMessage("Βρες ένα άδειο σημείο πάνω από το ρυάκι.");
        }
      });
    }
  }

  if (game.kind === "pretend-market") {
    cb.onProgress(0, 3);
    const counter = B.MeshBuilder.CreateBox("market-counter", { width: 2.6, height: 0.4, depth: 1.4 }, scene);
    counter.position = new B.Vector3(1.8, 0.75, 1.7);
    counter.material = mat(B, scene, "market-counter-m", "#f2c98e", 0.85, 0);
    const products = [
      createFruit(B, scene, "market-apple", "#ef635d"),
      createFruit(B, scene, "market-lemon", "#ffd84d"),
      createFruit(B, scene, "market-pear", "#8dcc6f"),
    ];
    const labels = ["μήλο", "λεμόνι", "αχλάδι"];
    products.forEach((p, i) => p.position = new B.Vector3(-2.0 + i * 1.2, 0.95, -1.5));
    const order = [2, 0, 1];
    let round = 0;
    const prompt = () => cb.onMessage(`Ο πελάτης ζητά ${labels[order[round]]}. Σύρε το στον πάγκο.`);
    products.forEach((p, index) => {
      const home = p.position.clone();
      groundDrag(B, p, () => {
        if (distance2D(p.position, counter.position) < 1.35 && index === order[round]) {
          p.removeBehavior(p.behaviors[0]);
          animateMove(B, scene, p, counter.position.add(new B.Vector3(-0.5 + round * 0.5, 0.55, 0)), 10);
          round++;
          progress(round, 3);
          if (round === 3) finish("Εξυπηρέτησες όλους τους πελάτες! 🛒");
          else prompt();
        } else {
          animateMove(B, scene, p, home, 10);
          gentleRetry("Άκου ξανά τι ζήτησε ο πελάτης και βρες το σωστό προϊόν.");
        }
      });
    });
    prompt();
  }

  if (game.kind === "rhythm-copy") {
    cb.onProgress(0, 3);
    cb.onMessage("Άκου τον ρυθμό και μετά παίξ' τον στα τύμπανα.");
    const drums = [0, 1, 2].map(i => {
      const d = createDrum(B, scene, `rhythm-drum-${i}`, V13_COLORS[i]);
      d.position = new B.Vector3(-1.6 + i * 1.6, 0.92, 1.0);
      return d;
    });
    const freqs = [262, 392, 523];
    const sequences = [[0, 1], [2, 0, 2], [1, 2, 0]];
    let round = 0;
    let input: number[] = [];
    let accepting = false;
    const playSequence = () => {
      accepting = false;
      input = [];
      cb.onMessage(`Άκου τον ρυθμό ${round + 1}…`);
      sequences[round].forEach((index, step) => {
        const id = window.setTimeout(() => {
          createTone(audioState, freqs[index]);
          animateScale(B, scene, drums[index], 1.18);
          if (step === sequences[round].length - 1) {
            const readyId = window.setTimeout(() => {
              accepting = true;
              cb.onMessage("Τώρα εσύ!");
            }, 420);
            timers.push(readyId);
          }
        }, 500 + step * 520);
        timers.push(id);
      });
    };
    drums.forEach((drum, index) => clickAction(B, scene, drum, () => {
      if (!accepting) return;
      createTone(audioState, freqs[index]);
      animateScale(B, scene, drum, 1.16);
      input.push(index);
      const expected = sequences[round].slice(0, input.length);
      if (input.some((v, i) => v !== expected[i])) {
        accepting = false;
        gentleRetry("Δεν πειράζει. Άκου τον ίδιο ρυθμό άλλη μία φορά.");
        const id = window.setTimeout(playSequence, 850);
        timers.push(id);
        return;
      }
      if (input.length === sequences[round].length) {
        accepting = false;
        round++;
        progress(round, 3, round < 3 ? "Το βρήκες! Πάμε στον επόμενο ρυθμό." : "Αντέγραψες και τους τρεις ρυθμούς!");
        if (round === 3) finish("Έγινες μαέστρος του ρυθμού! 🥁");
        else {
          const id = window.setTimeout(playSequence, 900);
          timers.push(id);
        }
      }
    }));
    const id = window.setTimeout(playSequence, 900);
    timers.push(id);
  }

  if (game.kind === "count-delivery") {
    const target = 4 + Math.floor(rng() * 7);
    cb.onMessage(`Το καραβάκι χρειάζεται ακριβώς ${target} κιβώτια. Πάτα για να βάλεις ή να βγάλεις κιβώτια.`);
    cb.onProgress(0, target);
    const selected = new Set<number>();
    const homes: any[] = [];
    const crates: any[] = [];
    for (let i = 0; i < 10; i++) {
      const c = B.MeshBuilder.CreateBox(`count-crate-${i}`, { size: 0.72 }, scene);
      c.position = new B.Vector3(-2.8 + (i % 5) * 1.15, 0.85, -2 + Math.floor(i / 5) * 1.1);
      c.material = mat(B, scene, `count-crate-m-${i}`, i % 2 ? "#c98d52" : "#d8a160", 0.9, 0);
      homes.push(c.position.clone());
      crates.push(c);
      clickAction(B, scene, c, () => {
        if (selected.has(i)) {
          selected.delete(i);
          animateMove(B, scene, c, homes[i], 9);
        } else {
          selected.add(i);
          const s = selected.size - 1;
          animateMove(B, scene, c, new B.Vector3(0.8 + (s % 5) * 0.55, 0.85, 2.0 + Math.floor(s / 5) * 0.55), 9);
        }
        progress(Math.min(selected.size, target), target, `Έχεις ${selected.size}. Χρειάζεσαι ${target}.`);
      });
    }
    const send = B.MeshBuilder.CreateCylinder("count-send", { height: 0.35, diameter: 1.6, tessellation: 32 }, scene);
    send.position = new B.Vector3(-2.8, 0.72, 2.4);
    send.material = mat(B, scene, "count-send-m", "#68cf83", 0.45, 0.02);
    clickAction(B, scene, send, () => {
      if (selected.size === target) {
        sparkle(B, scene, send.position, rng);
        finish(`Σωστά — ${target} κιβώτια! Το καραβάκι μπορεί να φύγει. ⛵`);
      } else {
        gentleRetry(`Έχεις ${selected.size}. Το καραβάκι χρειάζεται ${target}. Μπορείς να προσθέσεις ή να αφαιρέσεις.`);
      }
    });
  }

  if (game.kind === "float-predict") {
    cb.onMessage("Πρώτα πρόβλεψε και μετά θα το δοκιμάσουμε στο νερό.");
    cb.onProgress(0, 4);
    const pool = B.MeshBuilder.CreateCylinder("float-pool", { height: 0.25, diameter: 4.2, tessellation: 48 }, scene);
    pool.position = new B.Vector3(0, 0.58, 1.5);
    pool.material = mat(B, scene, "float-pool-m", "#54bff0", 0.2, 0.02);
    const floatButton = B.MeshBuilder.CreateCylinder("predict-float", { height: 0.3, diameter: 1.8, tessellation: 30 }, scene);
    floatButton.position = new B.Vector3(-2.3, 0.72, -1.8);
    floatButton.material = mat(B, scene, "predict-float-m", "#68cf83", 0.48, 0.02);
    const sinkButton = B.MeshBuilder.CreateCylinder("predict-sink", { height: 0.3, diameter: 1.8, tessellation: 30 }, scene);
    sinkButton.position = new B.Vector3(2.3, 0.72, -1.8);
    sinkButton.material = mat(B, scene, "predict-sink-m", "#795fe8", 0.48, 0.02);
    const outcomes = [true, false, true, false];
    const objects = outcomes.map((floats, i) => {
      const obj = i % 2 === 0
        ? B.MeshBuilder.CreateSphere(`float-object-${i}`, { diameter: 0.8, segments: 22 }, scene)
        : B.MeshBuilder.CreateBox(`float-object-${i}`, { size: 0.78 }, scene);
      obj.position = new B.Vector3(-1.8 + i * 1.2, 1.05, 2.7);
      obj.material = mat(B, scene, `float-object-m-${i}`, V13_COLORS[i], floats ? 0.75 : 0.3, floats ? 0 : 0.12);
      obj.setEnabled(i === 0);
      return obj;
    });
    let index = 0;
    const choose = (prediction: boolean) => {
      if (index >= objects.length) return;
      const obj = objects[index];
      const result = outcomes[index];
      const to = new B.Vector3(0, result ? 0.9 : 0.28, 1.5);
      animateMove(B, scene, obj, to, 22);
      const text = result
        ? prediction === result ? "Η πρόβλεψη ταίριαξε: επιπλέει!" : "Νέα ανακάλυψη: τελικά επιπλέει!"
        : prediction === result ? "Η πρόβλεψη ταίριαξε: βυθίζεται!" : "Νέα ανακάλυψη: τελικά βυθίζεται!";
      index++;
      progress(index, 4, text);
      const id = window.setTimeout(() => {
        obj.setEnabled(false);
        if (index === 4) finish("Έκανες 4 προβλέψεις και τις έλεγξες σαν μικρός επιστήμονας! 🔬");
        else {
          objects[index].setEnabled(true);
          cb.onMessage("Καινούργιο αντικείμενο: θα επιπλεύσει ή θα βυθιστεί;");
        }
      }, 1050);
      timers.push(id);
    };
    clickAction(B, scene, floatButton, () => choose(true));
    clickAction(B, scene, sinkButton, () => choose(false));
  }

  if (game.kind === "marble-run") {
    cb.onMessage("Βάλε τις 3 ράμπες στα κενά και πάτησε το πράσινο κουμπί για δοκιμή.");
    cb.onProgress(0, 3);
    const anchors = [-1.9, 0, 1.9].map(x => new B.Vector3(x, 1.05, 0.5));
    const occupied = new Map<number, any>();
    const ramps: any[] = [];
    for (let i = 0; i < 3; i++) {
      const ramp = B.MeshBuilder.CreateBox(`marble-ramp-${i}`, { width: 1.55, height: 0.22, depth: 1.0 }, scene);
      ramp.position = new B.Vector3(-2 + i * 2, 0.9, -2.0);
      ramp.rotation.z = [-0.18, 0.12, -0.14][i];
      ramp.material = mat(B, scene, `marble-ramp-m-${i}`, V13_COLORS[i], 0.56, 0.02);
      const home = ramp.position.clone();
      ramps.push(ramp);
      groundDrag(B, ramp, () => {
        const nearest = anchors.map((a, index) => ({ index, d: distance2D(ramp.position, a) })).sort((a, b) => a.d - b.d)[0];
        if (nearest.d < 0.95 && !occupied.has(nearest.index)) {
          occupied.set(nearest.index, ramp);
          animateMove(B, scene, ramp, anchors[nearest.index], 10);
          progress(occupied.size, 3, occupied.size < 3 ? "Μπήκε μια ράμπα. Δοκίμασε άλλη θέση για τις υπόλοιπες." : "Οι ράμπες είναι στη θέση τους. Πάτησε δοκιμή!");
        } else {
          for (const [slot, value] of occupied) if (value === ramp) occupied.delete(slot);
          animateMove(B, scene, ramp, home, 10);
          cb.onMessage("Βρες ένα άδειο σημείο στη διαδρομή.");
          progress(occupied.size, 3);
        }
      });
    }
    const launch = B.MeshBuilder.CreateCylinder("marble-launch", { height: 0.35, diameter: 1.5, tessellation: 30 }, scene);
    launch.position = new B.Vector3(-3.4, 0.72, 2.4);
    launch.material = mat(B, scene, "marble-launch-m", "#68cf83", 0.44, 0.02);
    clickAction(B, scene, launch, () => {
      const ball = B.MeshBuilder.CreateSphere(`marble-ball-${Date.now()}`, { diameter: 0.48, segments: 20 }, scene);
      ball.position = new B.Vector3(-3.2, 1.45, 0.5);
      ball.material = mat(B, scene, `marble-ball-m-${Date.now()}`, "#ff7a9f", 0.28, 0.05);
      if (occupied.size === 3) {
        const points = [new B.Vector3(-3.2, 1.45, 0.5), ...anchors.map(a => a.add(new B.Vector3(0, 0.28, 0))), new B.Vector3(3.3, 0.85, 0.5)];
        let step = 1;
        const moveNext = () => {
          if (step >= points.length) {
            finish("Η μπίλια έφτασε στον στόχο! Άλλαξε τις ράμπες και ξαναδοκίμασε. ⚙️");
            return;
          }
          animateMove(B, scene, ball, points[step], 13, () => { step++; moveNext(); });
        };
        moveNext();
      } else {
        animateMove(B, scene, ball, new B.Vector3(-1.5, 0.1, 0.5), 20, () => ball.dispose());
        gentleRetry("Η μπίλια έπεσε στο κενό. Χρειάζονται και οι 3 ράμπες στη διαδρομή.");
      }
    });
  }

  if (game.kind === "story-quest") {
    cb.onProgress(0, 3);
    let stage = 0;
    let path = "";
    const left = B.MeshBuilder.CreateBox("quest-left", { width: 2.1, height: 1.3, depth: 1.0 }, scene);
    left.position = new B.Vector3(-1.7, 1.15, 1.1);
    left.material = mat(B, scene, "quest-left-m", "#54bff0", 0.5, 0.02);
    const right = B.MeshBuilder.CreateBox("quest-right", { width: 2.1, height: 1.3, depth: 1.0 }, scene);
    right.position = new B.Vector3(1.7, 1.15, 1.1);
    right.material = mat(B, scene, "quest-right-m", "#ffd84d", 0.5, 0.02);
    const setStage = () => {
      if (stage === 0) cb.onMessage("Ο χάρτης δείχνει δύο δρόμους. Θάλασσα ή δάσος; Διάλεξε μπλε ή χρυσή πύλη.");
      if (stage === 1) cb.onMessage(path === "sea" ? "Στη θάλασσα χρειάζεσαι κάτι που φωτίζει. Ποια πύλη θα διαλέξεις;" : "Στο δάσος χρειάζεσαι κάτι που ανοίγει την παλιά πόρτα. Ποια πύλη θα διαλέξεις;");
      if (stage === 2) cb.onMessage("Βρήκες το σημάδι του χάρτη. Θες να ψάξεις τη σπηλιά ή τον κήπο;");
    };
    const choose = (side: "left" | "right") => {
      if (stage === 0) path = side === "left" ? "sea" : "forest";
      stage++;
      progress(stage, 3);
      sparkle(B, scene, side === "left" ? left.position : right.position, rng);
      if (stage === 3) {
        const ending = side === "left" ? "μια σπηλιά γεμάτη ζωγραφιές" : "έναν κήπο με σπόρους";
        finish(`Ο Πισιπούκ βρήκε ${ending}. Η ιστορία άλλαξε από τις επιλογές σου! 🗺️`);
      } else setStage();
    };
    clickAction(B, scene, left, () => choose("left"));
    clickAction(B, scene, right, () => choose("right"));
    setStage();
  }

  engine.runRenderLoop(() => scene.render());
  const resize = () => engine.resize();
  window.addEventListener("resize", resize);

  return () => {
    timers.forEach(id => window.clearTimeout(id));
    window.removeEventListener("resize", resize);
    try { audioState.ctx?.close(); } catch {}
    scene.dispose();
    engine.dispose();
  };
}
