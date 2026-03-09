"use client";

import { useEffect } from "react";

export default function Game({ onExit }: { onExit?: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onExit?.(); };
    window.addEventListener("keydown", handleEsc);
    // Load medieval font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    let game: unknown = null;
    let mounted = true;

    import("phaser").then(({ default: Phaser }) => {
      if (!mounted) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const FONT = '"IM Fell English", Georgia, serif';

      const C = {
        skyTop:      0x0d0a1e,
        skyBot:      0x1a1535,
        mtFar:       0x1a1530,
        mtMid:       0x221d3a,
        mtNear:      0x1e2535,
        tower:       0x252030,
        towerDark:   0x1c1826,
        towerWin:    0xf4a642,
        tree:        0x182c1e,
        treeDark:    0x0f1f14,
        ground:      0x131f15,
        wizRobe:     0x4a3060,
        wizDark:     0x2d1f4a,
        staffGlow:   0x9b6fd4,
        dlgBg:       0x0d0a1e,
        dlgBorder:   0x6b4d8a,
        accent:      0x9b6fd4,
        green:       0x4db87a,
      };

      // ─── Shared dialogue box factory ──────────────────────────────────────
      function makeDialogue(scene: Phaser.Scene) {
        const boxH = H * 0.27;
        const boxY = H - boxH;
        const pad  = 24;

        const bg = scene.add.graphics();
        bg.fillStyle(C.dlgBg, 0.93);
        bg.fillRect(0, boxY, W, boxH);
        bg.lineStyle(2, C.dlgBorder, 1);
        bg.strokeRect(2, boxY + 2, W - 4, boxH - 4);
        bg.lineStyle(1, C.dlgBorder, 0.35);
        bg.strokeRect(9, boxY + 9, W - 18, boxH - 18);

        // Speaker nameplate
        const nameplate = scene.add.graphics();
        const speakerTxt = scene.add.text(pad + 14, boxY - 24, "", {
          fontFamily: FONT, fontSize: "15px", color: "#0d0a1e", fontStyle: "italic",
        });

        const bodyTxt = scene.add.text(pad + 10, boxY + pad, "", {
          fontFamily: FONT,
          fontSize: H > 700 ? "18px" : "15px",
          color: "#e8d5a3",
          wordWrap: { width: W - pad * 2 - 20 },
          lineSpacing: 6,
        });

        const arrow = scene.add.text(W - pad - 24, H - pad - 16, "▼", {
          fontFamily: FONT, fontSize: "15px", color: "#9b6fd4",
        }).setAlpha(0);
        scene.tweens.add({ targets: arrow, alpha: { from: 0, to: 1 }, duration: 550, yoyo: true, repeat: -1 });

        let typing = false;
        let timer: Phaser.Time.TimerEvent | null = null;

        const dlg = {
          boxY, boxH,
          arrow,
          get isTyping() { return typing; },

          setSpeaker(name: string) {
            nameplate.clear();
            if (name) {
              nameplate.fillStyle(C.dlgBorder, 1);
              nameplate.fillRect(pad, boxY - 28, Math.max(120, name.length * 10 + 24), 28);
            }
            speakerTxt.setText(name);
          },

          type(text: string, onDone?: () => void) {
            typing = true;
            arrow.setAlpha(0);
            bodyTxt.setText("");
            let i = 0;
            if (timer) timer.destroy();
            timer = scene.time.addEvent({
              delay: 28,
              repeat: text.length - 1,
              callback: () => {
                i++;
                bodyTxt.setText(text.slice(0, i));
                if (i >= text.length) {
                  typing = false;
                  onDone?.();
                }
              },
            });
          },

          finish() {
            if (timer) { timer.destroy(); timer = null; }
            typing = false;
          },

          clear() {
            bodyTxt.setText("");
            arrow.setAlpha(0);
          },
        };
        return dlg;
      }

      // ─── Helper: draw wizard shape ────────────────────────────────────────
      function drawWizard(g: Phaser.GameObjects.Graphics, x: number, y: number, s: number) {
        // Staff
        g.fillStyle(0x5c3d1a);
        g.fillRect(x - s * 1.5, y - s * 3.8, s * 0.17, s * 4);
        // Staff orb glow
        for (let r = s * 0.75; r > s * 0.15; r -= s * 0.13) {
          g.fillStyle(C.staffGlow, ((s * 0.75 - r) / (s * 0.75)) * 0.38);
          g.fillCircle(x - s * 1.42, y - s * 3.9, r);
        }
        g.fillStyle(C.staffGlow, 0.92);
        g.fillCircle(x - s * 1.42, y - s * 3.9, s * 0.2);

        // Robe
        g.fillStyle(C.wizRobe);
        g.fillPoints([
          { x: x - s * 0.5, y: y - s * 2.1 },
          { x: x + s * 0.5, y: y - s * 2.1 },
          { x: x + s * 0.95, y: y },
          { x: x - s * 0.95, y: y },
        ].map(p => new Phaser.Geom.Point(p.x, p.y)), true);
        // Robe shadow
        g.fillStyle(C.wizDark, 0.45);
        g.fillPoints([
          { x: x,           y: y - s * 2.1 },
          { x: x + s * 0.5, y: y - s * 2.1 },
          { x: x + s * 0.95,y: y },
          { x: x,           y: y },
        ].map(p => new Phaser.Geom.Point(p.x, p.y)), true);

        // Head
        g.fillStyle(0x9b7d5a);
        g.fillCircle(x, y - s * 2.5, s * 0.4);
        // Beard
        g.fillStyle(0xddd5c5, 0.9);
        g.fillTriangle(x - s * 0.24, y - s * 2.18, x + s * 0.24, y - s * 2.18, x, y - s * 1.72);

        // Hat brim
        g.fillStyle(C.wizDark);
        g.fillEllipse(x, y - s * 2.85, s * 1.25, s * 0.3);
        // Hat cone
        g.fillTriangle(x - s * 0.56, y - s * 2.85, x + s * 0.56, y - s * 2.85, x, y - s * 4.4);
        // Hat sheen
        g.fillStyle(0x4a3570, 0.45);
        g.fillTriangle(x, y - s * 4.4, x + s * 0.56, y - s * 2.85, x + s * 0.08, y - s * 2.85);
        // Hat star
        g.fillStyle(C.staffGlow, 0.7);
        g.fillCircle(x + s * 0.18, y - s * 3.5, s * 0.08);
      }

      // ═══════════════════════════════════════════════════════════════════════
      // SCENE 1 — EXTERIOR
      // ═══════════════════════════════════════════════════════════════════════
      class ExteriorScene extends Phaser.Scene {
        private dlg!: ReturnType<typeof makeDialogue>;
        private playerName = "";
        private step = 0;
        private canNext = false;
        private nameInput: HTMLInputElement | null = null;
        private interactLocked = false;

        constructor() { super({ key: "ExteriorScene" }); }

        create() {
          this.drawSky();
          this.drawStars();
          this.drawMountains();
          this.drawTower();
          this.drawTrees();
          this.drawGround();
          this.drawFog();
          this.drawWizardGuard();

          this.dlg = makeDialogue(this);

          this.time.delayedCall(900, () => this.runStep());

          this.input.on("pointerdown", () => this.onAct());
          this.input.keyboard?.on("keydown-ENTER", () => this.onAct());
          this.input.keyboard?.on("keydown-SPACE", () => this.onAct());
        }

        // ── visuals ──────────────────────────────────────────────────────────

        drawSky() {
          const g = this.add.graphics();
          const steps = 36;
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const r  = Math.round(0x0d + (0x1a - 0x0d) * t);
            const gr = Math.round(0x0a + (0x15 - 0x0a) * t);
            const b  = Math.round(0x1e + (0x35 - 0x1e) * t);
            g.fillStyle((r << 16) | (gr << 8) | b);
            g.fillRect(0, (H * 0.78 * i) / steps, W, H * 0.78 / steps + 1);
          }
        }

        drawStars() {
          const g = this.add.graphics();
          const count = Math.floor((W * H) / 7500);
          for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(0, W);
            const y = Phaser.Math.Between(0, H * 0.62);
            g.fillStyle(0xe8e0ff, Phaser.Math.FloatBetween(0.35, 0.95));
            g.fillCircle(x, y, Math.random() < 0.08 ? 2 : 1);
          }
          // Twinklers
          for (let i = 0; i < 10; i++) {
            const sg = this.add.graphics();
            const x  = Phaser.Math.Between(W * 0.05, W * 0.95);
            const y  = Phaser.Math.Between(0, H * 0.5);
            sg.fillStyle(0xffffff, 1);
            sg.fillCircle(x, y, 2);
            this.tweens.add({
              targets: sg, alpha: { from: 1, to: 0.15 },
              duration: Phaser.Math.Between(1200, 3000),
              yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2500),
            });
          }
          // Moon
          const mg = this.add.graphics();
          mg.fillStyle(0xf0e8d0, 0.88); mg.fillCircle(W * 0.82, H * 0.1, H * 0.042);
          mg.fillStyle(C.skyTop, 0.62); mg.fillCircle(W * 0.82 + H * 0.02, H * 0.1, H * 0.036);
          mg.fillStyle(0xf0e8d0, 0.04); mg.fillCircle(W * 0.82, H * 0.1, H * 0.09);
        }

        drawMountains() {
          const g = this.add.graphics();

          g.fillStyle(C.mtFar);
          g.fillPoints([
            {x:0,       y:H}, {x:0,       y:H*0.63},
            {x:W*0.12,  y:H*0.38}, {x:W*0.22,  y:H*0.56},
            {x:W*0.35,  y:H*0.33}, {x:W*0.48,  y:H*0.52},
            {x:W*0.58,  y:H*0.37}, {x:W*0.7,   y:H*0.51},
            {x:W*0.82,  y:H*0.35}, {x:W*0.93,  y:H*0.53},
            {x:W,       y:H*0.45}, {x:W,       y:H},
          ].map(p => new Phaser.Geom.Point(p.x, p.y)), true);

          g.fillStyle(C.mtMid);
          g.fillPoints([
            {x:0,       y:H}, {x:0,       y:H*0.7},
            {x:W*0.09,  y:H*0.53}, {x:W*0.19,  y:H*0.65},
            {x:W*0.3,   y:H*0.47}, {x:W*0.42,  y:H*0.63},
            {x:W*0.54,  y:H*0.48}, {x:W*0.66,  y:H*0.62},
            {x:W*0.77,  y:H*0.45}, {x:W*0.89,  y:H*0.61},
            {x:W,       y:H*0.53}, {x:W,       y:H},
          ].map(p => new Phaser.Geom.Point(p.x, p.y)), true);

          g.fillStyle(C.mtNear);
          g.fillPoints([
            {x:0,       y:H}, {x:0,       y:H*0.76},
            {x:W*0.06,  y:H*0.65}, {x:W*0.16,  y:H*0.75},
            {x:W*0.27,  y:H*0.59}, {x:W*0.39,  y:H*0.73},
            {x:W*0.61,  y:H*0.72}, {x:W*0.74,  y:H*0.57},
            {x:W*0.86,  y:H*0.73}, {x:W*0.96,  y:H*0.63},
            {x:W,       y:H*0.7},  {x:W,       y:H},
          ].map(p => new Phaser.Geom.Point(p.x, p.y)), true);
        }

        drawTower() {
          const g  = this.add.graphics();
          const tx = W * 0.46, tw = W * 0.09;
          const ty = H * 0.16, th = H * 0.52;

          // Shadow
          g.fillStyle(C.towerDark);
          g.fillRect(tx + tw * 0.06, ty + 12, tw * 1.04, th);
          // Body
          g.fillStyle(C.tower);
          g.fillRect(tx, ty, tw, th);
          // Stone lines
          g.lineStyle(1, 0x1a1530, 0.38);
          for (let y = ty; y < ty + th; y += 18)
            g.strokeRect(tx, y, tw, 18);

          // Battlements
          g.fillStyle(C.towerDark);
          const bw = tw / 5;
          for (let i = 0; i < 5; i++)
            if (i % 2 === 0) g.fillRect(tx + i * bw, ty - bw * 0.85, bw, bw * 0.85);

          // Pointed roof
          g.fillStyle(0x1a1530);
          g.fillTriangle(tx, ty, tx + tw, ty, tx + tw / 2, ty - H * 0.07);

          // Windows
          const wins = [
            { x: tx + tw * 0.28, y: ty + th * 0.18, w: tw * 0.44, h: th * 0.09 },
            { x: tx + tw * 0.28, y: ty + th * 0.44, w: tw * 0.44, h: th * 0.09 },
          ];
          wins.forEach(w => {
            g.fillStyle(C.towerWin, 0.14); g.fillRect(w.x - 7, w.y - 7, w.w + 14, w.h + 14);
            g.fillStyle(C.towerWin, 0.26); g.fillRect(w.x - 3, w.y - 3, w.w + 6,  w.h + 6);
            g.fillStyle(C.towerWin, 0.82); g.fillRect(w.x, w.y, w.w, w.h);
            g.fillStyle(C.towerWin, 0.6);  g.fillCircle(w.x + w.w / 2, w.y, w.w / 2);
          });

          // Flicker
          const flk = this.add.graphics();
          this.tweens.add({
            targets: { v: 0.82 }, v: 0.38, duration: 180, yoyo: true, repeat: -1, delay: 3200,
            onUpdate: (tw) => {
              flk.clear();
              wins.forEach(w => {
                flk.fillStyle(C.towerWin, (tw.getValue() as number) * 0.14);
                flk.fillRect(w.x - 9, w.y - 9, w.w + 18, w.h + 18);
              });
            },
          });
        }

        drawTrees() {
          const g = this.add.graphics();
          const trees = [
            {x:W*0.31, y:H*0.68, s:1.2}, {x:W*0.36, y:H*0.72, s:0.9},
            {x:W*0.41, y:H*0.70, s:1.05},{x:W*0.44, y:H*0.74, s:0.82},
            {x:W*0.57, y:H*0.73, s:0.88},{x:W*0.61, y:H*0.70, s:1.1},
            {x:W*0.65, y:H*0.72, s:0.95},{x:W*0.69, y:H*0.68, s:1.18},
            {x:W*0.22, y:H*0.76, s:1.4}, {x:W*0.14, y:H*0.77, s:1.1},
            {x:W*0.78, y:H*0.75, s:1.3}, {x:W*0.86, y:H*0.76, s:1.0},
            {x:W*0.05, y:H*0.78, s:1.5}, {x:W*0.95, y:H*0.77, s:1.35},
          ];
          trees.forEach(({ x, y, s }) => {
            const h = H * 0.13 * s, w = h * 0.68;
            g.fillStyle(0x2a1f14); g.fillRect(x - w * 0.08, y, w * 0.16, h * 0.3);
            [[C.tree, 1], [C.treeDark, 0.85], [0x243d2a, 0.7]].forEach(([col, sc], i) => {
              g.fillStyle(col as number);
              const lw = w * (1 - i * 0.12) * (sc as number);
              const ly = y - h * (0.28 + i * 0.26);
              g.fillTriangle(x, ly - h * 0.32, x - lw / 2, ly + h * 0.1, x + lw / 2, ly + h * 0.1);
            });
          });

          // Vines on tower
          const tx = W * 0.46, tw = W * 0.09;
          g.lineStyle(2, 0x1f3020, 0.65);
          for (let i = 0; i < 6; i++) {
            const vx = tx + (i / 5) * tw;
            g.beginPath(); g.moveTo(vx, H * 0.52);
            for (let vy = H * 0.52; vy < H * 0.74; vy += 10)
              g.lineTo(vx + Math.sin((vy + i * 35) * 0.14) * 5, vy);
            g.strokePath();
          }
        }

        drawGround() {
          const g = this.add.graphics();
          g.fillStyle(C.ground); g.fillRect(0, H * 0.77, W, H * 0.23);
          g.fillStyle(0x1f3020, 0.45); g.fillRect(0, H * 0.77, W, 3);
          g.lineStyle(1, 0x0d1a0f, 0.28);
          for (let x = 0; x < W; x += 45)
            g.strokeLineShape(new Phaser.Geom.Line(x, H * 0.785, x + 22, H * 0.815));
        }

        drawFog() {
          const g = this.add.graphics();
          [{y:H*0.74, a:0.07},{y:H*0.76, a:0.11},{y:H*0.78, a:0.06}].forEach(({y,a}) => {
            g.fillStyle(0x140f23, a); g.fillEllipse(W*0.5, y, W*1.5, H*0.09);
          });
        }

        drawWizardGuard() {
          const g = this.add.graphics();
          const x = W * 0.18, y = H * 0.78, s = (H / 800) * 42;
          drawWizard(g, x, y, s);
          this.tweens.add({ targets: g, y: -6, duration: 2100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
          this.tweens.add({ targets: g, alpha: 0.86, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        }

        // ── dialogue flow ────────────────────────────────────────────────────

        private steps: Array<{speaker:string; text:string; next?:string}> = [
          { speaker: "Stranger", text: "*A hooded figure steps from the shadows*" },
          { speaker: "Stranger", text: '"Who goes there?\n\nThis place has been forgotten by all who walk these lands..."' },
          { speaker: "Stranger", text: '"State your name, traveler. Or turn back."', next: "name" },
        ];

        runStep() {
          const s = this.steps[this.step];
          if (!s) return;
          this.dlg.setSpeaker(s.speaker);
          this.dlg.type(s.text, () => {
            this.canNext = true;
            if (s.next === "name") this.showNameInput();
          });
          this.step++;
        }

        onAct() {
          if (this.interactLocked || this.nameInput) return;
          if (this.dlg.isTyping) { this.dlg.finish(); this.canNext = true; return; }
          if (!this.canNext) return;
          this.canNext = false;
          this.dlg.arrow.setAlpha(0);
          this.runStep();
        }

        showNameInput() {
          this.interactLocked = true;
          this.dlg.clear();
          this.dlg.setSpeaker("");

          const prompt = this.add.text(W / 2, this.dlg.boxY + this.dlg.boxH * 0.24, "State your name, traveler:", {
            fontFamily: FONT, fontSize: "18px", color: "#9b6fd4", fontStyle: "italic",
          }).setOrigin(0.5);

          const el = document.createElement("input");
          el.type = "text"; el.maxLength = 24; el.placeholder = "Your name...";
          el.style.cssText = `
            position:absolute; left:50%; top:${this.dlg.boxY + this.dlg.boxH * 0.5}px;
            transform:translateX(-50%);
            background:rgba(13,10,30,0.88); border:none; border-bottom:2px solid #9b6fd4;
            color:#e8d5a3; font-family:'IM Fell English',serif; font-size:22px;
            padding:8px 20px; outline:none; text-align:center; width:260px;
            letter-spacing:3px; z-index:100;
          `;
          document.getElementById("game-container")?.appendChild(el);
          el.focus();
          this.nameInput = el;

          const hint = this.add.text(W / 2, this.dlg.boxY + this.dlg.boxH * 0.82, "Press ENTER to continue", {
            fontFamily: FONT, fontSize: "13px", color: "#6b4d8a", fontStyle: "italic",
          }).setOrigin(0.5);

          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && el.value.trim()) {
              this.playerName = el.value.trim();
              document.getElementById("game-container")?.removeChild(el);
              this.nameInput = null;
              prompt.destroy(); hint.destroy();
              this.interactLocked = false;
              this.time.delayedCall(120, () => this.startResponse());
            }
          });
        }

        startResponse() {
          const n = this.playerName;
          const responseSteps: Array<{speaker:string; text:string}> = [
            { speaker: n,         text: `"I am ${n}.\n\nI seek a sorcerer — one named Krush."` },
            { speaker: "Stranger",text: '"...Krush."\n\n*The staff\'s glow dims. The figure goes very still.*' },
            { speaker: "Stranger",text: '"That name has not been spoken aloud in many years.\n\nMost believe him gone. Swallowed by the forgetting."' },
            { speaker: "Stranger",text: '"But you are here. And the tower still stands."\n\n"Come. Perhaps you were meant to find this place."' },
          ];

          let i = 0;
          const next = () => {
            if (i >= responseSteps.length) { this.enterTower(); return; }
            const s = responseSteps[i++];
            this.dlg.setSpeaker(s.speaker);
            this.dlg.type(s.text, () => { this.canNext = true; });
          };

          this.input.off("pointerdown");
          this.input.keyboard?.off("keydown-ENTER");
          this.input.keyboard?.off("keydown-SPACE");

          const act = () => {
            if (this.dlg.isTyping) { this.dlg.finish(); this.canNext = true; return; }
            if (!this.canNext) return;
            this.canNext = false; this.dlg.arrow.setAlpha(0); next();
          };
          this.input.on("pointerdown", act);
          this.input.keyboard?.on("keydown-ENTER", act);
          this.input.keyboard?.on("keydown-SPACE", act);

          next();
        }

        enterTower() {
          const ov = this.add.graphics();
          ov.fillStyle(0x000000); ov.fillRect(0, 0, W, H); ov.setAlpha(0);
          this.tweens.add({
            targets: ov, alpha: 1, duration: 1600, ease: "Power2",
            onComplete: () => this.scene.start("LibraryScene", { playerName: this.playerName }),
          });
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // SCENE 2 — LIBRARY
      // ═══════════════════════════════════════════════════════════════════════
      class LibraryScene extends Phaser.Scene {
        private playerName = "";
        private dlg!: ReturnType<typeof makeDialogue>;
        private canNext = false;
        private scrollsOpened = 0;
        private scrollsRevealed = false;

        constructor() { super({ key: "LibraryScene" }); }
        init(d: {playerName: string}) { this.playerName = d.playerName || "Traveler"; }

        create() {
          this.drawRoom();
          this.drawShelves();
          this.drawCandles();
          this.drawTable();
          this.drawLibraryWizard();
          this.dlg = makeDialogue(this);

          // Fade in
          const ov = this.add.graphics();
          ov.fillStyle(0x000000); ov.fillRect(0, 0, W, H);
          this.tweens.add({
            targets: ov, alpha: 0, duration: 1500, ease: "Power2",
            onComplete: () => this.time.delayedCall(400, () => this.startIntro()),
          });
        }

        drawRoom() {
          const g = this.add.graphics();
          g.fillStyle(0x1a1520); g.fillRect(0, 0, W, H);

          // Stone wall
          g.lineStyle(1, 0x252030, 0.45);
          for (let row = 0; row * 42 < H * 0.8; row++) {
            const off = (row % 2) * 40;
            for (let col = -1; col * 80 < W; col++)
              g.strokeRect(col * 80 + off, row * 42, 80, 42);
          }

          // Floor
          g.fillStyle(0x2a1f14); g.fillRect(0, H * 0.78, W, H * 0.22);
          g.lineStyle(1, 0x1e1510, 0.55);
          for (let x = 0; x < W; x += 65) g.strokeLineShape(new Phaser.Geom.Line(x, H*0.78, x, H));
          g.lineStyle(2, 0x3d2e1c, 0.4); g.strokeRect(0, H*0.78, W, H*0.22);

          // Ceiling beams
          g.fillStyle(0x1e1510);
          for (let x = W * 0.08; x < W; x += W * 0.22)
            g.fillRect(x, 0, 28, H * 0.14);

          // Warm ambient tint
          g.fillStyle(0xf4a642, 0.025); g.fillRect(0, 0, W, H);

          // Vignette
          g.fillStyle(0x000000, 0.38); g.fillRect(0, 0, W * 0.13, H);
          g.fillStyle(0x000000, 0.38); g.fillRect(W * 0.87, 0, W * 0.13, H);
          g.fillStyle(0x000000, 0.2);  g.fillRect(0, 0, W, H * 0.09);
        }

        drawShelves() {
          const g = this.add.graphics();
          const sw = W * 0.13;
          this.buildShelf(g, 0, H * 0.08, sw, H * 0.7);
          this.buildShelf(g, W - sw, H * 0.08, sw, H * 0.7);
        }

        buildShelf(g: Phaser.GameObjects.Graphics, x:number, y:number, w:number, h:number) {
          g.fillStyle(0x1e1510); g.fillRect(x, y, w, h);
          const rows = 6, rowH = h / rows;
          const bookCols = [0x8b2020,0x1a4a8b,0x2a6b2a,0x7b4a10,0x4a1a6b,0x6b6b1a,0x1a6b6b,0x8b4a1a];
          for (let r = 0; r < rows; r++) {
            const sy = y + r * rowH;
            g.fillStyle(0x3d2e1c); g.fillRect(x, sy + rowH - 7, w, 7);
            let bx = x + 4;
            while (bx < x + w - 6) {
              const bw = Phaser.Math.Between(7, 15);
              const bh = Phaser.Math.Between(rowH * 0.48, rowH * 0.82);
              g.fillStyle(bookCols[Math.floor(Math.random() * bookCols.length)], 0.82);
              g.fillRect(bx, sy + rowH - 7 - bh, bw, bh);
              g.lineStyle(1, 0x00000044, 0.35); g.strokeRect(bx, sy + rowH - 7 - bh, bw, bh);
              bx += bw + 2;
            }
          }
          g.lineStyle(2, 0x3d2e1c); g.strokeRect(x, y, w, h);
        }

        drawCandles() {
          [{x:W*0.24,y:H*0.73},{x:W*0.76,y:H*0.73},{x:W*0.16,y:H*0.46},{x:W*0.84,y:H*0.46}]
            .forEach(({x,y}) => {
              const g = this.add.graphics();
              g.fillStyle(0xe8dcc8); g.fillRect(x-4, y-22, 8, 22);
              g.fillStyle(0xf4c842, 0.92); g.fillTriangle(x, y-33, x-5, y-24, x+5, y-24);
              g.fillStyle(0xff9020, 0.82); g.fillTriangle(x, y-30, x-3, y-24, x+3, y-24);
              g.fillStyle(0xf4a642, 0.055); g.fillCircle(x, y-27, 62);
              g.fillStyle(0xf4a642, 0.09);  g.fillCircle(x, y-27, 32);
              this.tweens.add({
                targets: g, alpha: {from:0.72, to:1}, scaleX:{from:0.96, to:1.04},
                duration: Phaser.Math.Between(140,320), yoyo:true, repeat:-1,
                delay: Phaser.Math.Between(0,600),
              });
            });
        }

        drawTable() {
          const g = this.add.graphics();
          const tx=W*0.3, ty=H*0.62, tw=W*0.4, th=H*0.16;
          g.fillStyle(0x2a1f14);
          g.fillRect(tx+12, ty+th*0.3, 14, H*0.1);
          g.fillRect(tx+tw-26, ty+th*0.3, 14, H*0.1);
          g.fillStyle(0x3d2e1c); g.fillRect(tx, ty, tw, th*0.3);
          g.fillStyle(0x2a1f14); g.fillRect(tx, ty+th*0.3, tw, th*0.7);
          g.fillStyle(0x5c4430, 0.5); g.fillRect(tx, ty, tw, 3);
        }

        drawLibraryWizard() {
          const g = this.add.graphics();
          const x=W*0.82, y=H*0.78, s=(H/800)*36;
          drawWizard(g, x, y, s);
          this.tweens.add({ targets:g, y:-5, duration:2200, yoyo:true, repeat:-1, ease:"Sine.easeInOut" });
        }

        startIntro() {
          const lines = [
            { speaker:"Stranger", text:'"Welcome to the Archive.\n\nThis is what remains of his work — his life, preserved in these walls."' },
            { speaker:"Stranger", text:`"These scrolls hold what we know of the Sorcerer Krush.\n\nRead them, ${this.playerName}. Then we shall see if you are worthy to find him."` },
          ];
          let i = 0;
          const next = () => {
            if (i >= lines.length) { this.showScrolls(); return; }
            const l = lines[i++];
            this.dlg.setSpeaker(l.speaker);
            this.dlg.type(l.text, () => { this.canNext = true; });
          };
          const act = () => {
            if (this.scrollsRevealed) return;
            if (this.dlg.isTyping) { this.dlg.finish(); this.canNext = true; return; }
            if (!this.canNext) return;
            this.canNext = false; this.dlg.arrow.setAlpha(0); next();
          };
          this.input.on("pointerdown", act);
          this.input.keyboard?.on("keydown-ENTER", act);
          this.input.keyboard?.on("keydown-SPACE", act);
          next();
        }

        showScrolls() {
          this.scrollsRevealed = true;
          this.dlg.clear(); this.dlg.setSpeaker("");

          const scrolls = [
            {
              label: "Experience", color: 0xd4a853, x: W * 0.28,
              content: [
                "EMERSON  —  Software Developer Co-op",
                "Jan 2026 – Present  ·  Elyria, OH",
                "",
                "· Full-stack CRM used by 5,000+ employees",
                "· SQL schema updates & Entity Framework",
                "· .NET unit testing & CI pipeline validation",
                "",
                "EMERSON  —  System Analyst Co-op",
                "· Streamlined redemption processing by ~50%",
                "· Stakeholder interviews & UI mockups",
                "· DOMO analytics integration",
                "",
                "AEIGIS  —  Co-Founder   Jan–Mar 2025",
                "· Top 11 of 60 · OSU Buckeye Accelerator",
                "· Firefighter safety tracking solution",
                "",
                "PARCEL  —  Co-Founder   Aug–Nov 2025",
                "· Top 6 of 50+ · $5,000 funding recipient",
                "· Insurance adjuster workflow application",
                "",
                "BIG CREEK CONVENIENCE  —  Manager",
                "· $1.5M gross revenue · POS systems",
              ],
            },
            {
              label: "Projects", color: 0x8b5ea7, x: W * 0.5,
              content: [
                "2D ZELDA STYLE GAME",
                "C#  ·  MonoGame  ·  C  ·  Arduino  ·  ESP32",
                "",
                "· 5-person agile team using Jira & Git",
                "· HUD, map/mini-map, sprite mechanics",
                "· Physical ESP32 controller built in C",
                "· github.com/LiamG5/sprint0",
                "",
                "SYSTEMS PROGRAMMING",
                "C  ·  x86-64 Assembly  ·  GDB",
                "",
                "· Multi-file programs with file I/O",
                "· x86-64 calling conventions",
                "· Low-level debugging with GDB",
              ],
            },
            {
              label: "Skills", color: 0x4a9b6b, x: W * 0.72,
              content: [
                "LANGUAGES",
                "C#  ·  Java  ·  C  ·  JavaScript",
                "TypeScript  ·  Python  ·  SQL  ·  HTML/CSS",
                "",
                "FRAMEWORKS",
                "Node.js  ·  Vue.js  ·  .NET  ·  Next.js",
                "MonoGame  ·  JUnit  ·  React",
                "",
                "TOOLS",
                "Git  ·  Linux/WSL  ·  Visual Studio",
                "VS Code  ·  SSMS  ·  Jira  ·  Azure",
                "",
                "EDUCATION",
                "Ohio State University",
                "B.S. Computer Science & Engineering",
                "GPA 3.6 / 4.0  ·  May 2027",
              ],
            },
          ];

          const scrollY = H * 0.12;
          scrolls.forEach((s, i) => {
            this.time.delayedCall(i * 280, () => this.makeScroll(s.x, scrollY, s.label, s.color, s.content));
          });

          this.time.delayedCall(1100, () => {
            const hint = this.add.text(W/2, H*0.08, "Click a scroll to read it", {
              fontFamily: FONT, fontSize: "14px", color: "#6b4d8a", fontStyle: "italic",
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: hint, alpha: 1, duration: 800 });
          });
        }

        makeScroll(x:number, y:number, label:string, color:number, content:string[]) {
          const sw=W*0.09, sh=H*0.13;
          const g = this.add.graphics();
          // Glow
          g.fillStyle(color, 0.08); g.fillRoundedRect(x-sw/2-10, y-10, sw+20, sh+20, 10);
          // Body
          g.fillStyle(color, 0.88); g.fillRoundedRect(x-sw/2, y, sw, sh, 5);
          // Handles
          g.fillStyle(0x8b6a1a);
          g.fillEllipse(x-sw/2+5, y+sh/2, 11, sh*0.88);
          g.fillEllipse(x+sw/2-5, y+sh/2, 11, sh*0.88);
          // Ribbon
          g.fillStyle(0x8b2020, 0.75); g.fillRect(x-2, y, 4, sh);

          const lbl = this.add.text(x, y+sh+12, label, {
            fontFamily: FONT, fontSize: "14px", color: "#e8d5a3", fontStyle: "italic",
          }).setOrigin(0.5);

          const hit = this.add.rectangle(x, y+sh/2, sw+24, sh+36, 0xffffff, 0).setInteractive({useHandCursor:true});

          // Entrance
          g.setAlpha(0); lbl.setAlpha(0);
          this.tweens.add({ targets:[g,lbl], alpha:1, y:"-=10", duration:550, ease:"Back.easeOut" });

          // Float
          this.tweens.add({
            targets:[g,lbl,hit], y:"-=6",
            duration: 1900 + Math.random()*500,
            yoyo:true, repeat:-1, ease:"Sine.easeInOut", delay:Math.random()*700,
          });

          hit.on("pointerover",  () => this.tweens.add({targets:[g,lbl], scaleX:1.06, scaleY:1.06, duration:140}));
          hit.on("pointerout",   () => this.tweens.add({targets:[g,lbl], scaleX:1,    scaleY:1,    duration:140}));
          hit.on("pointerdown",  () => { hit.disableInteractive(); this.openScroll(label, color, content); });
        }

        openScroll(label:string, color:number, content:string[]) {
          const pw=W*0.68, ph=H*0.74, px=(W-pw)/2, py=(H-ph)/2;

          const ov = this.add.graphics();
          ov.fillStyle(0x000000, 0.72); ov.fillRect(0,0,W,H); ov.setAlpha(0);

          const panel = this.add.graphics();
          panel.fillStyle(0x1a1020, 0.97); panel.fillRoundedRect(px,py,pw,ph,8);
          panel.lineStyle(2, color, 0.82); panel.strokeRoundedRect(px,py,pw,ph,8);
          panel.lineStyle(1, color, 0.28); panel.strokeRoundedRect(px+7,py+7,pw-14,ph-14,6);
          panel.setAlpha(0);

          const hexColor = "#" + color.toString(16).padStart(6,"0");
          const title = this.add.text(px+pw/2, py+28, `— ${label.toUpperCase()} —`, {
            fontFamily:FONT, fontSize:"22px", color:hexColor, fontStyle:"italic",
          }).setOrigin(0.5).setAlpha(0);

          const body = this.add.text(px+30, py+66, content.join("\n"), {
            fontFamily:FONT, fontSize:"15px", color:"#e8d5a3", lineSpacing:5,
            wordWrap:{ width: pw-60 },
          }).setAlpha(0);

          const close = this.add.text(px+pw/2, py+ph-22, "Click anywhere to close", {
            fontFamily:FONT, fontSize:"13px", color:"#6b4d8a", fontStyle:"italic",
          }).setOrigin(0.5).setAlpha(0);

          this.tweens.add({ targets:[ov,panel,title,body,close], alpha:1, duration:380 });

          this.time.delayedCall(500, () => {
            this.input.once("pointerdown", () => {
              this.tweens.add({
                targets:[ov,panel,title,body,close], alpha:0, duration:300,
                onComplete: () => {
                  [ov,panel,title,body,close].forEach(o => o.destroy());
                  this.scrollsOpened++;
                  if (this.scrollsOpened >= 3) this.time.delayedCall(600, () => this.endDialogue());
                },
              });
            });
          });
        }

        endDialogue() {
          const lines = [
            { speaker:"Stranger", text:'"You have read the scrolls.\n\nYou know his craft. His journey."' },
            { speaker:"Stranger", text:'"To find Krush himself... that requires reaching beyond these walls."\n\n"Come. I will show you the way."' },
          ];
          let i = 0;
          const next = () => {
            if (i >= lines.length) { this.goContact(); return; }
            const l = lines[i++];
            this.dlg.setSpeaker(l.speaker);
            this.dlg.type(l.text, () => { this.canNext = true; });
          };
          this.input.off("pointerdown");
          const act = () => {
            if (this.dlg.isTyping) { this.dlg.finish(); this.canNext = true; return; }
            if (!this.canNext) return;
            this.canNext = false; this.dlg.arrow.setAlpha(0); next();
          };
          this.input.on("pointerdown", act);
          this.input.keyboard?.on("keydown-ENTER", act);
          this.input.keyboard?.on("keydown-SPACE", act);
          next();
        }

        goContact() {
          const ov = this.add.graphics();
          ov.fillStyle(0x000000); ov.fillRect(0,0,W,H); ov.setAlpha(0);
          this.tweens.add({
            targets:ov, alpha:1, duration:1500,
            onComplete: () => this.scene.start("ContactScene", { playerName: this.playerName }),
          });
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // SCENE 3 — CONTACT
      // ═══════════════════════════════════════════════════════════════════════
      class ContactScene extends Phaser.Scene {
        private playerName = "";
        private dlg!: ReturnType<typeof makeDialogue>;
        private canNext = false;

        constructor() { super({ key: "ContactScene" }); }
        init(d: {playerName:string}) { this.playerName = d.playerName || "Traveler"; }

        create() {
          this.drawRoom();
          this.drawPortal();
          this.dlg = makeDialogue(this);

          const ov = this.add.graphics();
          ov.fillStyle(0x000000); ov.fillRect(0,0,W,H);
          this.tweens.add({
            targets:ov, alpha:0, duration:1500,
            onComplete: () => this.time.delayedCall(500, () => this.startDialogue()),
          });
        }

        drawRoom() {
          const g = this.add.graphics();
          g.fillStyle(0x0a0814); g.fillRect(0,0,W,H);
          g.lineStyle(1, 0x1a1528, 0.4);
          for (let r=0; r*44<H*0.8; r++) {
            const off=(r%2)*42;
            for (let c=-1; c*84<W; c++) g.strokeRect(c*84+off,r*44,84,44);
          }
          g.fillStyle(0x1a1520); g.fillRect(0,H*0.78,W,H*0.22);
          g.lineStyle(1, 0x1e1510, 0.5);
          for (let x=0;x<W;x+=70) g.strokeLineShape(new Phaser.Geom.Line(x,H*0.78,x,H));
          g.fillStyle(0x000000, 0.42); g.fillRect(0,0,W*0.1,H);
          g.fillStyle(0x000000, 0.42); g.fillRect(W*0.9,0,W*0.1,H);
        }

        drawPortal() {
          const px=W*0.5, py=H*0.4;
          const g = this.add.graphics();

          // Glow rings
          [{r:H*0.3,a:0.025},{r:H*0.23,a:0.055},{r:H*0.17,a:0.1},{r:H*0.13,a:0.18},{r:H*0.1,a:0.3}]
            .forEach(({r,a}) => { g.fillStyle(C.accent,a); g.fillCircle(px,py,r); });

          g.fillStyle(0x2a1040,0.92); g.fillCircle(px,py,H*0.09);
          g.fillStyle(0x180830,1);    g.fillCircle(px,py,H*0.065);
          g.lineStyle(3,C.accent,0.8); g.strokeCircle(px,py,H*0.09);
          g.lineStyle(1,0xb07de8,0.45); g.strokeCircle(px,py,H*0.1);

          // Spinning particles
          const spinG = this.add.graphics();
          let ang = 0;
          this.time.addEvent({
            delay: 45, repeat: -1,
            callback: () => {
              spinG.clear(); ang += 0.05;
              for (let i=0;i<8;i++) {
                const a = ang + (i/8)*Math.PI*2;
                spinG.fillStyle(0xd4a8f0, 0.45 + Math.sin(ang+i)*0.32);
                spinG.fillCircle(px+Math.cos(a)*H*0.095, py+Math.sin(a)*H*0.095, 2.5);
              }
            },
          });

          // Floating runes
          ["✦","◈","⬡","✧","◇"].forEach((r,i) => {
            const a=(i/5)*Math.PI*2, dist=H*0.2;
            const rx=px+Math.cos(a)*dist, ry=py+Math.sin(a)*dist;
            const rt = this.add.text(rx,ry,r,{fontFamily:FONT,fontSize:"20px",color:"#6b4d8a"}).setOrigin(0.5).setAlpha(0.45);
            this.tweens.add({targets:rt, y:ry-9, alpha:0.8, duration:2000+i*280, yoyo:true, repeat:-1, ease:"Sine.easeInOut", delay:i*380});
          });

          // Floor glow
          g.fillStyle(C.accent,0.045); g.fillEllipse(px,H*0.82,H*0.22,H*0.045);
        }

        startDialogue() {
          const lines = [
            { speaker:"Stranger", text:'"This portal connects to the channels Krush monitors.\n\nThrough these, you may reach him."' },
            { speaker:"Stranger", text:`"He watches for those who seek him with purpose.\n\nAnd you, ${this.playerName}... have shown purpose."`, action:"show" },
          ];
          let i=0;
          const next = () => {
            if (i>=lines.length) return;
            const l=lines[i++];
            this.dlg.setSpeaker(l.speaker);
            this.dlg.type(l.text, () => {
              this.canNext=true;
              if (l.action==="show") this.time.delayedCall(350,()=>this.showContacts());
            });
          };
          const act = () => {
            if (this.dlg.isTyping) { this.dlg.finish(); this.canNext=true; return; }
            if (!this.canNext) return;
            this.canNext=false; this.dlg.arrow.setAlpha(0); next();
          };
          this.input.on("pointerdown",act);
          this.input.keyboard?.on("keydown-ENTER",act);
          this.input.keyboard?.on("keydown-SPACE",act);
          next();
        }

        showContacts() {
          const contacts = [
            { label:"LinkedIn", sub:"krush-patel-54324a2a5", color:0x4a7bc4, icon:"⚑" },
            { label:"GitHub",   sub:"krushpatel04",          color:0x9b6fd4, icon:"◈" },
            { label:"Email",    sub:"patel.5355@osu.edu",    color:0x4a9b6b, icon:"✉" },
          ];
          const cw=W*0.22, ch=H*0.1, cy=H*0.18;
          const startX = W/2 - (contacts.length-1)*(cw+20)/2;

          contacts.forEach(({label,sub,color,icon},i) => {
            const cx = startX + i*(cw+20);
            this.time.delayedCall(i*200, () => {
              const g=this.add.graphics();
              const hx=color.toString(16).padStart(6,"0");
              g.fillStyle(0x1a1020,0.92); g.fillRoundedRect(cx-cw/2,cy,cw,ch,6);
              g.fillStyle(color,0.055); g.fillRoundedRect(cx-cw/2-5,cy-5,cw+10,ch+10,9);
              g.lineStyle(1,color,0.72); g.strokeRoundedRect(cx-cw/2,cy,cw,ch,6);
              g.setAlpha(0);

              const ic  = this.add.text(cx,cy+ch*0.28,icon,{fontFamily:FONT,fontSize:"18px",color:"#"+hx}).setOrigin(0.5).setAlpha(0);
              const lbl = this.add.text(cx,cy+ch*0.58,label,{fontFamily:FONT,fontSize:"15px",color:"#e8d5a3",fontStyle:"italic"}).setOrigin(0.5).setAlpha(0);
              const sv  = this.add.text(cx,cy+ch*0.82,sub,  {fontFamily:FONT,fontSize:"10px",color:"#9b8a7a"}).setOrigin(0.5).setAlpha(0);

              this.tweens.add({ targets:[g,ic,lbl,sv], alpha:1, y:"-=8", duration:480, ease:"Back.easeOut" });
              this.tweens.add({ targets:[g,ic,lbl,sv], y:"-=5", duration:2000+i*200, yoyo:true, repeat:-1, ease:"Sine.easeInOut" });
            });
          });

          this.time.delayedCall(1000, () => {
            const final = this.add.text(W/2, H*0.1, `"Seek well, ${this.playerName}."`, {
              fontFamily:FONT, fontSize:"19px", color:"#9b6fd4", fontStyle:"italic",
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets:final, alpha:1, duration:1000 });
          });
        }
      }

      // ─── Boot ──────────────────────────────────────────────────────────────
      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: W, height: H,
        backgroundColor: "#0d0a1e",
        scene: [ExteriorScene, LibraryScene, ContactScene],
        parent: "game-container",
        scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      });
    });

    return () => {
      mounted = false;
      window.removeEventListener("keydown", handleEsc);
      (game as { destroy?: (b: boolean) => void })?.destroy?.(true);
    };
  }, []);

  return (
    <div
      id="game-container"
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    />
  );
}
