import initKaplay from "./kaplayCtx";
import { isTextBoxVisibleAtom, store, textBoxContentAtom } from "./store";
import backgroundImageUrl from "/background5.png";
import charactersImageUrl from "/walk.png";
import npcImageUrl from "/npc.png";

export default async function initGame() {
  const DIAGONAL_FACTOR = 1 / Math.sqrt(2);
  const k = initKaplay();

  // ✅ Attendi il caricamento delle sprite
  await k.loadSprite("background", backgroundImageUrl);
  await k.loadSprite("npc1", npcImageUrl, {
    sliceY: 3,
    sliceX: 2,
    anims: {
      "npc-down": 0,
      "npc-up": 0,
      "npc-right": 0,
      "npc-left": 0,
    },
  });
   await k.loadSprite("npc2", npcImageUrl, {
    sliceY: 3,
    sliceX: 2,
    anims: {
      "npc-down": 1,
      "npc-up": 1,
      "npc-right": 1,
      "npc-left": 1,
    },
  });
  await k.loadSprite("npc3", npcImageUrl, {
    sliceY: 3,
    sliceX: 2,
    anims: {
      "npc-down": 0,
      "npc-up": 0,
      "npc-right": 0,
      "npc-left": 0,
    },
  });
  await k.loadSprite("characters", charactersImageUrl, {
    sliceY: 4,
    sliceX: 9,
    anims: {
      "down-idle": 18,
      "up-idle": 0,
      "right-idle": 27,
      "left-idle": 9,
      right: { from: 27, to: 35, loop: true },
      left: { from: 9, to: 17, loop: true },
      down: { from: 18, to: 26, loop: true },
      up: { from: 0, to: 8, loop: true },
      "npc-down": 0, // Potrebbe essere ridondante se 'characters' è solo per il giocatore
      "npc-up": 0,   // e queste animazioni sono solo per l'NPC.
      "npc-right": 0,
      "npc-left": 0,
    },
  });

  // Aggiungi lo sfondo
  const background = k.add([k.sprite("background"), k.pos(0, -70), k.scale(1.3)]);

  // Calcola i limiti dello sfondo dopo che è stato aggiunto e scalato.
  // Poiché l'ancora predefinita per gli sprite è "topleft", k.pos(0, -70)
  // si riferisce all'angolo in alto a sinistra dello sfondo.
  const bgMinX = background.pos.x;
  const bgMinY = background.pos.y;
  const bgMaxX = background.pos.x + background.width;
  const bgMaxY = background.pos.y + background.height;

  const player = k.add([
    k.sprite("characters", { anim: "down-idle" }),
    k.area(),
    k.body(),
    k.anchor("center"), // L'ancora del giocatore è al centro
    k.pos(k.center()),
    k.scale(6),
    "player",
    {
      speed: 800,
      direction: k.vec2(0, 0), // Direzione iniziale del giocatore
    },
  ]);
  // --- NUOVA LOGICA PER LO SPAWN IN BASSO A SINISTRA ---
  // Calcola la metà della larghezza e altezza del giocatore per posizionarlo correttamente
  const playerSpawnHalfWidth = player.width / 2;
  const playerSpawnHalfHeight = player.height / 2;

  // Imposta la posizione iniziale del giocatore in basso a sinistra dello sfondo
  player.pos = k.vec2(
    bgMinX + playerSpawnHalfWidth +70, // Bordo sinistro dello sfondo + metà larghezza del giocatore
    bgMaxY - playerSpawnHalfHeight -70  // Bordo inferiore dello sfondo - metà altezza del giocatore
  );
  // --- FINE NUOVA LOGICA PER LO SPAWN IN BASSO A SINISTRA ---



  player.onUpdate(() => {
    // Reset della direzione del giocatore ad ogni frame
    player.direction.x = 0;
    player.direction.y = 0;

    // Aggiorna la direzione in base ai tasti premuti
    if (k.isKeyDown("left")) player.direction.x = -1;
    if (k.isKeyDown("right")) player.direction.x = 1;
    if (k.isKeyDown("up")) player.direction.y = -1;
    if (k.isKeyDown("down")) player.direction.y = 1;

    // Ottieni il nome dell'animazione corrente per il confronto
    const currentAnimName = player.getCurAnim().name;

    // Aggiorna l'animazione del giocatore in base alla direzione
    if (player.direction.eq(k.vec2(-1, 0)) && currentAnimName !== "left") {
      player.play("left");
    } else if (player.direction.eq(k.vec2(1, 0)) && currentAnimName !== "right") {
      player.play("right");
    } else if (player.direction.eq(k.vec2(0, -1)) && currentAnimName !== "up") {
      player.play("up");
    } else if (player.direction.eq(k.vec2(0, 1)) && currentAnimName !== "down") {
      player.play("down");
    } else if (player.direction.eq(k.vec2(0, 0)) && !currentAnimName.includes("idle")) {
      // Se nessun tasto è premuto e non è già in idle, passa all'animazione idle
      player.play(`${currentAnimName}-idle`);
    }

    // Muovi il giocatore
    if (player.direction.x !== 0 && player.direction.y !== 0) {
      // Movimento diagonale
      player.move(player.direction.scale(DIAGONAL_FACTOR * player.speed));
    } else {
      // Movimento orizzontale o verticale
      player.move(player.direction.scale(player.speed));
    }

    // --- LOGICA PER I CONFINI ---
    // Ottieni la metà della larghezza e altezza del giocatore (per l'ancora al centro)
    const playerHalfWidth = player.width / 2;
    const playerHalfHeight = player.height / 2;

    // Limita la posizione X del giocatore
    player.pos.x = k.clamp(
      player.pos.x,
      bgMinX + playerHalfWidth, // Bordo sinistro (minX dello sfondo + metà larghezza giocatore)
      bgMaxX - playerHalfWidth  // Bordo destro (maxX dello sfondo - metà larghezza giocatore)
    );

    // Limita la posizione Y del giocatore
    player.pos.y = k.clamp(
      player.pos.y,
      bgMinY + playerHalfHeight, // Bordo superiore (minY dello sfondo + metà altezza giocatore)
      bgMaxY - playerHalfHeight   // Bordo inferiore (maxY dello sfondo - metà altezza giocatore)
    );
    // --- FINE LOGICA PER I CONFINI ---
  });

  const npc = k.add([
    k.sprite("npc1", { anim: "npc-left" }),
    k.area(),
    k.body({ isStatic: true }), // L'NPC è statico e non si muove a causa della fisica
    k.anchor("center"),
    k.scale(0.55),
    k.pos(1500, 500),
  ]);

  const npc2 = k.add([
    k.sprite("npc2", { anim: "npc-left" }),
    k.area(),
    k.body({ isStatic: true }), // L'NPC è statico e non si muove a causa della fisica
    k.anchor("center"),
    k.scale(0.55),
    k.pos(1000, 500),
  ]);

  const npc3 = k.add([
    k.sprite("npc3", { anim: "npc-left" }),
    k.area(),
    k.body({ isStatic: true }), // L'NPC è statico e non si muove a causa della fisica
    k.anchor("center"),
    k.scale(0.55),
    k.pos(500, 500),
  ]);
  npc.onCollide("player", () => {
  store.set(textBoxContentAtom, "Messaggio NPC 1");
  store.set(isTextBoxVisibleAtom, true);
});

npc2.onCollide("player", () => {
  store.set(textBoxContentAtom, "Messaggio NPC 2");
  store.set(isTextBoxVisibleAtom, true);
});

npc3.onCollide("player", () => {
  store.set(textBoxContentAtom, "Solo chi sa dove guardare vede l’inganno. Gli altri? Si limitano a cliccare e sperare.");
  store.set(isTextBoxVisibleAtom, true);
});

}
