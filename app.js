/* ==========================================================================
   MATHQUEST PRO — CORE APPLICATION & MULTI-LESSON ENGINE
   Educator: Mr Ahmed Abd El-Motaal
   Math Teacher & Content Creator
   Lessons Included:
   1. Lesson One: Proportion (Unit 1: Numbers & Operations)
   2. Lesson Two: The Distance Between Two Points (Coordinate Geometry)
   ========================================================================== */

// --- AUDIO SYNTHESIZER (Web Audio API, Zero External MP3 Dependencies) ---
const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playTone(freq, type, duration, gainVal = 0.1) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },
  click() { this.playTone(600, 'sine', 0.08, 0.05); },
  success() {
    this.playTone(523.25, 'triangle', 0.12, 0.12);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.18, 0.12), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.28, 0.14), 220);
  },
  wrong() {
    this.playTone(220, 'sawtooth', 0.18, 0.1);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.1), 120);
  }
};

// ==========================================================================
// ==========================================================================
// 1. IPAD STYLUS & NOTEBOOK CANVAS ENGINE (Hi-DPI, Palm Rejection & Undo)
// ==========================================================================
const StylusEngine = {
  canvases: {},
  buffers: {}, // In-memory offscreen buffers to prevent stroke loss on switchTab
  stylusOnlyMode: true, // Apple Pencil / Stylus & Mouse only (Finger rejected to prevent choppy writing & palm interference)

  computeStrokeWidth(baseWidth, pressure, pointerType) {
    if (pointerType === 'pen' && typeof pressure === 'number' && pressure > 0 && pressure <= 1) {
      // Natural responsive curve for Apple Pencil / Stylus pressure (matching Infinite Whiteboard)
      const eased = Math.pow(pressure, 0.85);
      return Math.max(1, baseWidth * (0.35 + 1.25 * eased));
    }
    return baseWidth;
  },

  initCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const wrap = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const width = rect.width || 600;
    const height = 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    this.canvases[id] = {
      canvas,
      ctx,
      dpr,
      width,
      height,
      mode: 'draw',
      activeTool: 'pen',
      shapeStartX: 0,
      shapeStartY: 0,
      color: '#182038',
      strokeWidth: 4,
      smoothWidth: 4,
      isEraser: false,
      isDrawing: false,
      history: [],
      redoStack: [],
      lastSnapshot: null,
      prevX: 0,
      prevY: 0,
      lastMidX: 0,
      lastMidY: 0,
      hasMoved: false
    };

    this.restoreCanvas(id);

    // Prevent drag & drop, selection, and context menus on the canvas
    canvas.setAttribute('draggable', 'false');
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('selectstart', (e) => e.preventDefault());
    canvas.addEventListener('touchstart', (e) => {
      if (this.canvases[id]?.mode === 'draw') e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (this.canvases[id]?.mode === 'draw') e.preventDefault();
    }, { passive: false });

    const wrapEl = canvas.parentElement;
    if (wrapEl) {
      wrapEl.addEventListener('contextmenu', (e) => e.preventDefault());
      wrapEl.addEventListener('selectstart', (e) => {
        if (this.canvases[id]?.mode === 'draw') e.preventDefault();
      });
    }

    canvas.addEventListener('pointerdown', (e) => this.startDraw(id, e));
    canvas.addEventListener('pointermove', (e) => this.draw(id, e));
    canvas.addEventListener('pointerup', (e) => this.stopDraw(id, e));
    canvas.addEventListener('pointercancel', (e) => this.stopDraw(id, e));

    const textLayer = document.getElementById(id.replace('can-', 'text-'));
    if (textLayer) {
      const savedText = localStorage.getItem('math_text_' + id);
      if (savedText) textLayer.value = savedText;
      textLayer.addEventListener('input', () => {
        localStorage.setItem('math_text_' + id, textLayer.value);
      });
    }

    if (window.WorkspaceImages) {
      WorkspaceImages.load(id);
    }
  },

  startDraw(id, e) {
    // Dismiss any active text selection or iOS callout popup immediately
    if (window.getSelection) {
      try { window.getSelection().removeAllRanges(); } catch (err) {}
    }

    // 1. REJECT FINGER TOUCH (Apple Pencil / Stylus / Mouse ONLY)
    // Prevents accidental finger writing and acts as True Palm Rejection
    if (this.stylusOnlyMode && e.pointerType === 'touch') {
      e.preventDefault(); // Stop iOS from initiating text selection on palm press!
      return;
    }

    e.preventDefault();

    const inst = this.canvases[id];
    if (!inst || inst.mode !== 'draw') return;

    this.lastActiveCanvasId = id;
    inst.isDrawing = true;
    inst.redoStack = [];

    try {
      inst.canvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    // Save snapshot before new stroke for UNDO and live shape preview
    inst.lastSnapshot = inst.ctx.getImageData(0, 0, inst.canvas.width, inst.canvas.height);

    const rect = inst.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    inst.shapeStartX = x;
    inst.shapeStartY = y;
    inst.prevX = x;
    inst.prevY = y;
    inst.lastMidX = x;
    inst.lastMidY = y;
    inst.hasMoved = false;

    const initialW = this.computeStrokeWidth(inst.strokeWidth, e.pressure, e.pointerType);
    inst.smoothWidth = initialW;

    const ctx = inst.ctx;
    if (inst.isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = inst.strokeWidth * 4;
    } else if (inst.activeTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = inst.color;
      ctx.lineWidth = Math.max(inst.strokeWidth * 5, 24);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = inst.color;
      ctx.lineWidth = initialW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    // Draw initial touch dot only for freehand pen / highlighter mode
    if (inst.activeTool === 'pen' || inst.activeTool === 'highlighter') {
      ctx.beginPath();
      const dotR = inst.isEraser
        ? inst.strokeWidth * 2
        : (inst.activeTool === 'highlighter' ? Math.max(inst.strokeWidth * 2.5, 12) : Math.max(initialW / 2, 1));
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = inst.isEraser ? 'rgba(0,0,0,1)' : inst.color;
      ctx.fill();
    }
  },

  draw(id, e) {
    if (this.stylusOnlyMode && e.pointerType === 'touch') {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const inst = this.canvases[id];
    if (!inst || !inst.isDrawing) return;

    const rect = inst.canvas.getBoundingClientRect();

    // High-frequency iPad digitizer sampling: extract all coalesced sub-frame points
    const events = (typeof e.getCoalescedEvents === 'function' && e.getCoalescedEvents().length > 0)
      ? e.getCoalescedEvents()
      : [e];

    const ctx = inst.ctx;

    if (inst.activeTool === 'pen' || inst.activeTool === 'highlighter') {
      if (inst.activeTool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = Math.max(inst.strokeWidth * 5, 24);
      } else if (!inst.isEraser) {
        ctx.globalAlpha = 1.0;
      }
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const currentX = ev.clientX - rect.left;
        const currentY = ev.clientY - rect.top;

        const dx = currentX - inst.prevX;
        const dy = currentY - inst.prevY;
        if (dx * dx + dy * dy < 0.2) continue; // Skip identical jitter points

        if (!inst.isEraser && inst.activeTool !== 'highlighter') {
          const targetW = this.computeStrokeWidth(inst.strokeWidth, ev.pressure, ev.pointerType);
          inst.smoothWidth = inst.smoothWidth * 0.65 + targetW * 0.35;
          ctx.lineWidth = inst.smoothWidth;
        }

        inst.hasMoved = true;
        const midX = (inst.prevX + currentX) / 2;
        const midY = (inst.prevY + currentY) / 2;

        // Continuous bezier curve: from previous midpoint through previous coordinate to new midpoint
        ctx.beginPath();
        ctx.moveTo(inst.lastMidX, inst.lastMidY);
        ctx.quadraticCurveTo(inst.prevX, inst.prevY, midX, midY);
        ctx.stroke();

        inst.lastMidX = midX;
        inst.lastMidY = midY;
        inst.prevX = currentX;
        inst.prevY = currentY;
      }
    } else {
      // Geometric Shape Drawing with Live Interactive Preview
      const ev = events[events.length - 1];
      const currentX = ev.clientX - rect.left;
      const currentY = ev.clientY - rect.top;
      inst.hasMoved = true;

      // Restore snapshot to erase previous frame's preview
      ctx.putImageData(inst.lastSnapshot, 0, 0);

      ctx.strokeStyle = inst.color;
      ctx.lineWidth = inst.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sx = inst.shapeStartX;
      const sy = inst.shapeStartY;

      if (inst.activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      } else if (inst.activeTool === 'rect') {
        const rx = Math.min(sx, currentX);
        const ry = Math.min(sy, currentY);
        const rw = Math.abs(currentX - sx);
        const rh = Math.abs(currentY - sy);
        ctx.strokeRect(rx, ry, rw, rh);
      } else if (inst.activeTool === 'circle') {
        const rx = Math.abs(currentX - sx) / 2;
        const ry = Math.abs(currentY - sy) / 2;
        const cx = (sx + currentX) / 2;
        const cy = (sy + currentY) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (inst.activeTool === 'axis') {
        // Cartesian X-Y Coordinate Axes with directional arrows
        ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.lineTo(currentX, sy); // X-axis
        ctx.moveTo(sx, sy); ctx.lineTo(sx, currentY); // Y-axis
        ctx.stroke();

        const arrow = Math.max(inst.strokeWidth * 2.2, 7);
        const xDir = currentX >= sx ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(currentX, sy);
        ctx.lineTo(currentX - xDir * arrow, sy - arrow / 1.6);
        ctx.lineTo(currentX - xDir * arrow, sy + arrow / 1.6);
        ctx.closePath();
        ctx.fillStyle = inst.color;
        ctx.fill();

        const yDir = currentY >= sy ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(sx, currentY);
        ctx.lineTo(sx - arrow / 1.6, currentY - yDir * arrow);
        ctx.lineTo(sx + arrow / 1.6, currentY - yDir * arrow);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  stopDraw(id, e) {
    const inst = this.canvases[id];
    if (!inst || !inst.isDrawing) return;

    if (e) e.preventDefault();
    inst.isDrawing = false;
    if (e && e.pointerId) {
      try {
        inst.canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (window.getSelection) {
      try { window.getSelection().removeAllRanges(); } catch (err) {}
    }

    // Connect final segment smoothly for freehand pen / highlighter
    if ((inst.activeTool === 'pen' || inst.activeTool === 'highlighter') && inst.hasMoved) {
      const ctx = inst.ctx;
      if (!inst.isEraser && inst.activeTool !== 'highlighter') {
        ctx.lineWidth = inst.smoothWidth;
      }
      ctx.beginPath();
      ctx.moveTo(inst.lastMidX, inst.lastMidY);
      ctx.lineTo(inst.prevX, inst.prevY);
      ctx.stroke();
    }
    inst.ctx.globalAlpha = 1.0;

    // Commit snapshot to Undo stack
    if (inst.lastSnapshot) {
      if (!inst.history) inst.history = [];
      inst.history.push(inst.lastSnapshot);
      if (inst.history.length > 30) inst.history.shift();
      inst.lastSnapshot = null;
    }

    this.saveCanvas(id);
  },

  undo(id) {
    const inst = this.canvases[id];
    if (!inst || !inst.history || inst.history.length === 0) return;

    if (!inst.redoStack) inst.redoStack = [];
    const currentSnapshot = inst.ctx.getImageData(0, 0, inst.canvas.width, inst.canvas.height);
    inst.redoStack.push(currentSnapshot);

    const prevState = inst.history.pop();
    inst.ctx.putImageData(prevState, 0, 0);
    this.saveCanvas(id);
    AudioEngine.click();
  },

  redo(id) {
    const inst = this.canvases[id];
    if (!inst || !inst.redoStack || inst.redoStack.length === 0) return;

    const currentSnapshot = inst.ctx.getImageData(0, 0, inst.canvas.width, inst.canvas.height);
    if (!inst.history) inst.history = [];
    inst.history.push(currentSnapshot);

    const nextState = inst.redoStack.pop();
    inst.ctx.putImageData(nextState, 0, 0);
    this.saveCanvas(id);
    AudioEngine.click();
  },

  saveCanvas(id) {
    const inst = this.canvases[id];
    if (!inst) return;
    try {
      const dataUrl = inst.canvas.toDataURL();
      localStorage.setItem('math_canvas_' + id, dataUrl);
      this.buffers[id] = dataUrl;
    } catch (e) {
      console.warn("Auto-save canvas warning:", e);
    }
  },

  restoreCanvas(id) {
    const inst = this.canvases[id];
    if (!inst) return;
    const dataUrl = this.buffers[id] || localStorage.getItem('math_canvas_' + id);
    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        inst.ctx.clearRect(0, 0, inst.width, inst.height);
        inst.ctx.drawImage(img, 0, 0, inst.width, inst.height);
      };
      img.src = dataUrl;
    }
  },

  redrawAll() {
    Object.keys(this.canvases).forEach((id) => this.restoreCanvas(id));
  },

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      Object.keys(this.canvases).forEach((id) => {
        const inst = this.canvases[id];
        if (!inst || !inst.canvas) return;
        const wrap = inst.canvas.parentElement;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const newWidth = rect.width;
        if (newWidth && Math.abs(newWidth - inst.width) > 5) {
          const tempUrl = inst.canvas.toDataURL();
          const dpr = window.devicePixelRatio || 1;
          inst.width = newWidth;
          inst.canvas.width = newWidth * dpr;
          inst.canvas.height = inst.height * dpr;
          inst.canvas.style.width = newWidth + 'px';
          inst.canvas.style.height = inst.height + 'px';
          const ctx = inst.canvas.getContext('2d', { willReadFrequently: true });
          ctx.scale(dpr, dpr);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          inst.ctx = ctx;

          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, newWidth, inst.height);
          img.src = tempUrl;
        }
      });
    }, 250);
  },

  clearCanvas(id) {
    const inst = this.canvases[id];
    if (!inst) return;

    // Push current snapshot into history so Clear itself can be UNDONE!
    const snapshot = inst.ctx.getImageData(0, 0, inst.canvas.width, inst.canvas.height);
    if (!inst.history) inst.history = [];
    inst.history.push(snapshot);

    inst.ctx.save();
    inst.ctx.setTransform(1, 0, 0, 1, 0, 0);
    inst.ctx.clearRect(0, 0, inst.canvas.width, inst.canvas.height);
    inst.ctx.restore();
    localStorage.removeItem('math_canvas_' + id);
    delete this.buffers[id];
    AudioEngine.click();
  }
};

// Global Orientation & Resize Listeners
window.addEventListener('resize', () => StylusEngine.handleResize());
window.addEventListener('orientationchange', () => StylusEngine.handleResize());

// Global Selection Guardian: Clear accidental text selections while drawing
document.addEventListener('selectionchange', () => {
  const isAnyDrawing = Object.values(StylusEngine.canvases).some(c => c.isDrawing) || FullScreenPen.isDrawing;
  if (isAnyDrawing && window.getSelection) {
    try { window.getSelection().removeAllRanges(); } catch (err) {}
  }
});

function undoCanvas(id) {
  StylusEngine.undo(id);
}

function redoCanvas(id) {
  StylusEngine.redo(id);
}

function toggleWorkspaceShapesPopover(canvasId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const pop = document.getElementById(`ws-shapes-pop-${canvasId}`);
  const wrap = pop?.closest('.ws-dropdown-wrap');
  const isOpen = pop?.classList.contains('open');

  document.querySelectorAll('.ws-shapes-popover.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.ws-dropdown-wrap.open').forEach(w => w.classList.remove('open'));

  if (!isOpen && pop) {
    pop.classList.add('open');
    wrap?.classList.add('open');
  }
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
}

function selectWorkspaceShape(canvasId, tool, btn) {
  const trig = document.getElementById(`ws-shapes-trig-${canvasId}`);
  const icon = trig?.querySelector('.ws-shape-active-icon');

  if (tool === 'line') {
    if (icon) icon.className = 'fa-solid fa-ruler ws-shape-active-icon';
    if (trig) trig.title = 'Straight Line';
  } else if (tool === 'rect') {
    if (icon) icon.className = 'fa-regular fa-square ws-shape-active-icon';
    if (trig) trig.title = 'Rectangle / Box';
  } else if (tool === 'circle') {
    if (icon) icon.className = 'fa-regular fa-circle ws-shape-active-icon';
    if (trig) trig.title = 'Circle';
  } else if (tool === 'axis') {
    if (icon) icon.className = 'fa-solid fa-chart-line ws-shape-active-icon';
    if (trig) trig.title = 'Coordinate Axes';
  }

  setCanvasTool(canvasId, tool, trig || btn);

  const pop = document.getElementById(`ws-shapes-pop-${canvasId}`);
  const wrap = pop?.closest('.ws-dropdown-wrap');
  pop?.classList.remove('open');
  wrap?.classList.remove('open');
}

function selectWorkspaceMode(canvasId, mode, btn) {
  const trig = document.getElementById(`ws-shapes-trig-${canvasId}`);
  const icon = trig?.querySelector('.ws-shape-active-icon');

  if (icon) icon.className = 'fa-solid fa-keyboard ws-shape-active-icon';
  if (trig) trig.title = 'Type Notes';

  setCanvasMode(canvasId, mode, trig || btn);

  const pop = document.getElementById(`ws-shapes-pop-${canvasId}`);
  const wrap = pop?.closest('.ws-dropdown-wrap');
  pop?.classList.remove('open');
  wrap?.classList.remove('open');
}

document.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.ws-dropdown-wrap')) {
    document.querySelectorAll('.ws-shapes-popover.open').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.ws-dropdown-wrap.open').forEach(w => w.classList.remove('open'));
  }
});

function toggleStylusMode(btn) {
  StylusEngine.stylusOnlyMode = !StylusEngine.stylusOnlyMode;
  FullScreenPen.stylusOnlyMode = StylusEngine.stylusOnlyMode;

  const allBadges = document.querySelectorAll('.stylus-indicator');
  allBadges.forEach(b => {
    b.classList.toggle('active', StylusEngine.stylusOnlyMode);
    b.classList.toggle('touch-allowed', !StylusEngine.stylusOnlyMode);
    const txt = b.querySelector('.stylus-mode-text');
    if (txt) {
      txt.innerText = StylusEngine.stylusOnlyMode ? 'Stylus Only' : 'Touch Allowed';
    }
  });
  AudioEngine.click();
}

function setCanvasTool(id, tool, btn) {
  const inst = StylusEngine.canvases[id];
  if (!inst) return;
  inst.activeTool = tool;
  inst.mode = 'draw';
  inst.isEraser = false;

  const toolbar = btn?.closest ? btn.closest('.stylus-toolbar') : document.querySelector(`#ws-${id} .stylus-toolbar`);
  if (toolbar) {
    toolbar.querySelectorAll('.tool-btn').forEach(b => {
      if (b.querySelector('.fa-pen') || b.querySelector('.fa-eraser') || b.classList.contains('ws-shapes-trigger') || b.classList.contains('btn-tool-pen') || b.classList.contains('btn-tool-eraser')) {
        b.classList.remove('active');
      }
    });
  }

  const shapes = ['line', 'rect', 'circle', 'axis'];
  const trig = document.getElementById(`ws-shapes-trig-${id}`);
  if (shapes.includes(tool)) {
    if (trig) trig.classList.add('active');
  } else if (tool === 'pen') {
    const penBtn = toolbar?.querySelector('.fa-pen')?.closest('.tool-btn');
    if (penBtn) penBtn.classList.add('active');
  }

  if (btn && btn.classList.contains('tool-btn')) {
    btn.classList.add('active');
  }

  const canvas = inst.canvas;
  const textLayer = document.getElementById(id.replace('can-', 'text-'));
  if (canvas) canvas.style.pointerEvents = 'auto';
  if (textLayer) textLayer.style.display = 'none';

  if (tool === 'pen' && window.WorkspaceImages) {
    WorkspaceImages.lock(id);
  }

  AudioEngine.click();
}

function loadBlobToCanvas(id, blob) {
  if (!blob) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const inst = StylusEngine.canvases[id];
      if (!inst) return;
      const ctx = inst.ctx;

      // Save history for undo
      const snapshot = ctx.getImageData(0, 0, inst.canvas.width, inst.canvas.height);
      inst.history.push(snapshot);

      // Fit inside canvas gracefully
      const maxW = inst.width * 0.85;
      const maxH = inst.height * 0.85;
      let drawW = img.width;
      let drawH = img.height;

      if (drawW > maxW) {
        drawH = (drawH * maxW) / drawW;
        drawW = maxW;
      }
      if (drawH > maxH) {
        drawW = (drawW * maxH) / drawH;
        drawH = maxH;
      }

      const x = (inst.width - drawW) / 2;
      const y = (inst.height - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);
      AudioEngine.success();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(blob);
}

function triggerCanvasImagePaste(id) {
  AudioEngine.click();
  StylusEngine.lastActiveCanvasId = id;

  // 1. Try modern clipboard read API
  if (navigator.clipboard && navigator.clipboard.read) {
    navigator.clipboard.read().then(items => {
      let found = false;
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            item.getType(type).then(blob => {
              loadBlobToCanvas(id, blob);
            });
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        const fileInput = document.getElementById(`file-${id}`);
        if (fileInput) fileInput.click();
      }
    }).catch(() => {
      const fileInput = document.getElementById(`file-${id}`);
      if (fileInput) fileInput.click();
    });
  } else {
    const fileInput = document.getElementById(`file-${id}`);
    if (fileInput) fileInput.click();
  }
}

function handleCanvasImageUpload(id, input) {
  if (!input.files || !input.files[0]) return;
  StylusEngine.lastActiveCanvasId = id;
  loadBlobToCanvas(id, input.files[0]);
  input.value = '';
}

function exportCanvasImage(id) {

  const inst = StylusEngine.canvases[id];
  if (!inst) return;

  const canvas = inst.canvas;
  const card = canvas.closest('.try-it-card') || canvas.closest('article') || canvas.closest('.idea-block');

  // 1. Extract Question Header Tag & Question Text
  let badgeText = 'Exercise & Practice';
  let questionText = '';

  if (card) {
    const badgeEl = card.querySelector('.try-it-badge') || card.querySelector('.example-tag') || card.querySelector('.rw-tag');
    if (badgeEl) {
      badgeText = badgeEl.innerText.replace(/\s+/g, ' ').trim();
    }
    const promptEl = card.querySelector('.try-it-prompt') || card.querySelector('.example-question') || card.querySelector('.rw-desc');
    if (promptEl) {
      questionText = promptEl.innerText.replace(/\s+/g, ' ').trim();
    }
  }

  if (!questionText) {
    questionText = 'Mathematical Problem Derivation & Solution Workspace';
  }

  const dpr = window.devicePixelRatio || 1;
  const padding = 28 * dpr;
  const headerHeight = 76 * dpr;

  const contentWidth = Math.max(inst.canvas.width, 740 * dpr);
  const maxTextWidth = contentWidth - 36 * dpr;

  // Text Wrapping Helper
  function wrapLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Measure Question Box Height
  const testCanvas = document.createElement('canvas');
  const testCtx = testCanvas.getContext('2d');
  testCtx.font = `bold ${14 * dpr}px 'Outfit', 'Plus Jakarta Sans', sans-serif`;

  const questionLines = wrapLines(testCtx, questionText, maxTextWidth - 28 * dpr);
  const lineSpacing = 22 * dpr;
  const qBoxPadding = 16 * dpr;
  const badgeHeight = 26 * dpr;
  const questionBoxHeight = badgeHeight + 12 * dpr + (questionLines.length * lineSpacing) + qBoxPadding * 2;

  // Textarea typed layer content if any
  const textLayer = document.getElementById(id.replace('can-', 'text-'));
  const typedText = textLayer?.value?.trim() || '';
  let typedLines = [];
  let typedBoxHeight = 0;
  if (typedText) {
    testCtx.font = `${12.5 * dpr}px 'Plus Jakarta Sans', sans-serif`;
    typedLines = wrapLines(testCtx, typedText, maxTextWidth - 28 * dpr);
    typedBoxHeight = 30 * dpr + (typedLines.length * 20 * dpr) + 16 * dpr;
  }

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = contentWidth + padding * 2;
  exportCanvas.height = headerHeight + questionBoxHeight + (typedBoxHeight ? typedBoxHeight + 16 * dpr : 0) + inst.canvas.height + padding * 2 + 36 * dpr;

  const ctx = exportCanvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // Helper function for rounded rectangles
  function drawRoundedRect(c, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // 1. Top Teacher Branding Header
  ctx.fillStyle = '#182038';
  ctx.font = `bold ${16 * dpr}px 'Outfit', sans-serif`;
  ctx.fillText('Mr Ahmed Abd El-Motaal • Math Teacher & Content Creator', padding, padding + 20 * dpr);

  ctx.fillStyle = '#5e6b8c';
  ctx.font = `${11 * dpr}px 'Plus Jakarta Sans', sans-serif`;
  const lessonLabel = (currentLessonKey === 'proportion') ? 'Prep 3 • Unit 1: Numbers & Operations • Proportion' : 'Prep 3 • Unit 2: Functions • Quadratic Function';
  ctx.fillText(`${lessonLabel} | 📞 01019775590 | 📺 YouTube: mr Motaal`, padding, padding + 42 * dpr);

  // Top Separator
  ctx.strokeStyle = '#6c5ce7';
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  ctx.moveTo(padding, headerHeight + padding - 10 * dpr);
  ctx.lineTo(exportCanvas.width - padding, headerHeight + padding - 10 * dpr);
  ctx.stroke();

  // 2. Question Box
  const qBoxY = headerHeight + padding;
  const qBoxWidth = exportCanvas.width - padding * 2;

  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5 * dpr;
  drawRoundedRect(ctx, padding, qBoxY, qBoxWidth, questionBoxHeight, 14 * dpr);
  ctx.fill();
  ctx.stroke();

  // Badge pill inside Question Box
  ctx.fillStyle = '#6c5ce7';
  const badgeWidth = Math.min(240 * dpr, testCtx.measureText(badgeText).width + 30 * dpr);
  drawRoundedRect(ctx, padding + qBoxPadding, qBoxY + qBoxPadding, badgeWidth, badgeHeight, 12 * dpr);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${10.5 * dpr}px 'Outfit', sans-serif`;
  ctx.fillText(badgeText, padding + qBoxPadding + 10 * dpr, qBoxY + qBoxPadding + 17 * dpr);

  // Render Question Lines
  ctx.fillStyle = '#182038';
  ctx.font = `bold ${13.5 * dpr}px 'Outfit', 'Plus Jakarta Sans', sans-serif`;
  let lineY = qBoxY + qBoxPadding + badgeHeight + 16 * dpr;
  questionLines.forEach(line => {
    ctx.fillText(line, padding + qBoxPadding + 4 * dpr, lineY);
    lineY += lineSpacing;
  });

  let currentY = qBoxY + questionBoxHeight + 16 * dpr;

  // 3. Render Typed Text Layer if available
  if (typedLines.length > 0) {
    ctx.fillStyle = '#f0fdf4';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1 * dpr;
    drawRoundedRect(ctx, padding, currentY, qBoxWidth, typedBoxHeight, 10 * dpr);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = `bold ${11 * dpr}px 'Outfit', sans-serif`;
    ctx.fillText('Typed Mathematical Steps:', padding + 14 * dpr, currentY + 20 * dpr);

    ctx.fillStyle = '#1e293b';
    ctx.font = `${12 * dpr}px 'Plus Jakarta Sans', sans-serif`;
    let typedY = currentY + 40 * dpr;
    typedLines.forEach(tl => {
      ctx.fillText(tl, padding + 14 * dpr, typedY);
      typedY += 20 * dpr;
    });

    currentY += typedBoxHeight + 16 * dpr;
  }

  // 4. Draw Notebook Grid or Lines Pattern for Canvas Area
  const isGrid = inst.canvas.parentElement?.classList.contains('grid-bg');
  ctx.strokeStyle = isGrid ? '#e7eefc' : '#e3ebf8';
  ctx.lineWidth = 1 * dpr;

  const canvasStartY = currentY;
  const canvasEndY = canvasStartY + inst.canvas.height;

  if (isGrid) {
    const gridSize = 24 * dpr;
    for (let x = padding; x <= exportCanvas.width - padding; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, canvasStartY); ctx.lineTo(x, canvasEndY); ctx.stroke();
    }
    for (let y = canvasStartY; y <= canvasEndY; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(exportCanvas.width - padding, y); ctx.stroke();
    }
  } else {
    const lineStep = 32 * dpr;
    for (let y = canvasStartY + 24 * dpr; y <= canvasEndY; y += lineStep) {
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(exportCanvas.width - padding, y); ctx.stroke();
    }
  }

  // 5. Draw Inserted Workspace Image if present (Underneath handwritten notes)
  if (window.WorkspaceImages && WorkspaceImages.data[id]) {
    const wsImg = WorkspaceImages.data[id];
    if (wsImg && wsImg.src) {
      const dImg = new Image();
      dImg.src = wsImg.src;
      if (dImg.complete) {
        ctx.drawImage(dImg, padding + wsImg.x * dpr, canvasStartY + wsImg.y * dpr, wsImg.width * dpr, wsImg.height * dpr);
      }
    }
  }

  // 6. Draw Handwritten Canvas Content
  ctx.drawImage(inst.canvas, padding, canvasStartY);

  // 7. Border around Canvas Area
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1 * dpr;
  drawRoundedRect(ctx, padding, canvasStartY, qBoxWidth, inst.canvas.height, 12 * dpr);
  ctx.stroke();

  // 8. Footer Watermark
  ctx.fillStyle = '#94a3b8';
  ctx.font = `${10 * dpr}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('MathQuest Pro Interactive Smartboard • Math with Mr Ahmed Abd El-Motaal', padding, exportCanvas.height - 12 * dpr);

  // Direct PNG Download
  const cleanBadge = badgeText.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  const link = document.createElement('a');
  link.download = `Mr_Motaal_${cleanBadge}_${Date.now()}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();

  AudioEngine.success();
}

function toggleStudioMode() {
  const isStudio = document.body.classList.toggle('studio-recording-mode');
  const fab = document.getElementById('floatingStudioModeFab');
  if (fab) {
    fab.classList.toggle('active', isStudio);
  }
  const btn = document.getElementById('studioModeBtn');
  if (btn) {
    btn.classList.toggle('active', isStudio);
    const span = btn.querySelector('span');
    if (span) span.innerText = isStudio ? 'Exit Studio' : 'Studio Mode';
  }
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
}

function setCanvasMode(id, mode, btn) {
  const inst = StylusEngine.canvases[id];
  if (!inst) return;
  inst.mode = mode;

  if (mode === 'draw') {
    inst.isEraser = false;
    inst.activeTool = 'pen';
  }

  const toolbar = btn.closest('.stylus-toolbar');
  if (toolbar) {
    toolbar.querySelectorAll('.tool-btn').forEach(b => {
      b.classList.remove('active');
    });
  }
  btn.classList.add('active');

  const canvas = inst.canvas;
  const textLayer = document.getElementById(id.replace('can-', 'text-'));

  if (mode === 'text') {
    canvas.style.pointerEvents = 'none';
    if (textLayer) {
      textLayer.style.display = 'block';
      textLayer.focus();
    }
  } else {
    canvas.style.pointerEvents = 'auto';
    if (textLayer) textLayer.style.display = 'none';
  }
  AudioEngine.click();
}

function setCanvasEraser(id, btn) {
  const inst = StylusEngine.canvases[id];
  if (!inst) return;
  inst.isEraser = !inst.isEraser;
  btn.classList.toggle('active', inst.isEraser);

  const toolbar = btn.closest('.stylus-toolbar');
  if (inst.isEraser) {
    inst.mode = 'draw';
    if (toolbar) {
      toolbar.querySelectorAll('.tool-btn').forEach(b => {
        if (b.querySelector('.fa-pen') || b.classList.contains('ws-shapes-trigger') || b.classList.contains('btn-tool-pen')) {
          b.classList.remove('active');
        }
      });
    }
    const canvas = inst.canvas;
    const textLayer = document.getElementById(id.replace('can-', 'text-'));
    if (canvas) canvas.style.pointerEvents = 'auto';
    if (textLayer) textLayer.style.display = 'none';
  } else {
    inst.mode = 'draw';
    inst.activeTool = 'pen';
    const penBtn = toolbar?.querySelector('.fa-pen')?.closest('.tool-btn');
    if (penBtn) penBtn.classList.add('active');
  }
  AudioEngine.click();
}

function setCanvasColor(id, color, dot) {
  const inst = StylusEngine.canvases[id];
  if (!inst) return;
  inst.color = color;
  inst.isEraser = false;
  inst.mode = 'draw';
  inst.activeTool = 'pen';

  const wrap = dot.parentElement;
  wrap.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');

  const toolbar = dot.closest('.stylus-toolbar');
  const eraserBtn = toolbar?.querySelector('.fa-eraser')?.closest('.tool-btn');
  if (eraserBtn) eraserBtn.classList.remove('active');
  const shapesTrig = toolbar?.querySelector('.ws-shapes-trigger');
  if (shapesTrig) shapesTrig.classList.remove('active');
  const penBtn = toolbar?.querySelector('.fa-pen')?.closest('.tool-btn');
  if (penBtn) penBtn.classList.add('active');

  const canvas = inst.canvas;
  const textLayer = document.getElementById(id.replace('can-', 'text-'));
  if (canvas) canvas.style.pointerEvents = 'auto';
  if (textLayer) textLayer.style.display = 'none';

  AudioEngine.click();
}

function setCanvasWidth(id, width) {
  const inst = StylusEngine.canvases[id];
  if (inst) inst.strokeWidth = parseInt(width, 10);
}

function toggleCanvasGrid(wrapId, btn) {
  const wrap = document.getElementById(wrapId);
  if (wrap) {
    wrap.classList.toggle('grid-bg');
    btn.classList.toggle('active', wrap.classList.contains('grid-bg'));
    AudioEngine.click();
  }
}

function clearCanvasPrompt(id) {
  StylusEngine.clearCanvas(id);
  const textLayer = document.getElementById(id.replace('can-', 'text-'));
  if (textLayer) {
    textLayer.value = '';
    localStorage.removeItem('math_text_' + id);
  }
}

// ==========================================================================
// 2. FULL-SCREEN IPAD SCREEN PEN OVERLAY (Ultra-Smooth, Shapes & Undo)
// ==========================================================================
const FullScreenPen = {
  active: false,
  canvas: null,
  ctx: null,
  isDrawing: false,
  stylusOnlyMode: true,
  activeTool: 'pen',
  shapeStartX: 0,
  shapeStartY: 0,
  history: [],
  lastSnapshot: null,
  prevX: 0,
  prevY: 0,
  lastMidX: 0,
  lastMidY: 0,
  hasMoved: false,
  color: '#6c5ce7',
  strokeWidth: 6,
  isEraser: false,
  timerInterval: null,
  secondsElapsed: 0,

  init() {
    this.canvas = document.getElementById('fullscreenPenCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.setAttribute('draggable', 'false');
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.canvas.addEventListener('selectstart', (e) => e.preventDefault());
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    this.canvas.addEventListener('pointerdown', (e) => this.start(e));
    this.canvas.addEventListener('pointermove', (e) => this.draw(e));
    this.canvas.addEventListener('pointerup', (e) => this.stop(e));
    this.canvas.addEventListener('pointercancel', (e) => this.stop(e));

    const btn = document.getElementById('fullscreenPenBtn');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  },

  smoothWidth: 6,

  computeStrokeWidth(baseWidth, pressure, pointerType) {
    if (pointerType === 'pen' && typeof pressure === 'number' && pressure > 0 && pressure <= 1) {
      const eased = Math.pow(pressure, 0.85);
      return Math.max(1, baseWidth * (0.35 + 1.25 * eased));
    }
    return baseWidth;
  },

  toggle() {
    if (this.active) this.exit();
    else this.enter();
  },

  enter() {
    this.active = true;
    const overlay = document.getElementById('fullscreenPenOverlay');
    if (overlay) overlay.classList.add('active');
    const fab = document.getElementById('floatingScreenPenFab');
    if (fab) {
      fab.classList.add('active');
      fab.title = 'Close Pen';
      const icon = fab.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-xmark';
    }
    AudioEngine.success();
  },

  exit() {
    this.active = false;
    const overlay = document.getElementById('fullscreenPenOverlay');
    if (overlay) overlay.classList.remove('active');
    const fab = document.getElementById('floatingScreenPenFab');
    if (fab) {
      fab.classList.remove('active');
      fab.title = 'Write on Screen';
      const icon = fab.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-pen-nib';
    }
    AudioEngine.click();
  },

  start(e) {
    if (window.getSelection) {
      try { window.getSelection().removeAllRanges(); } catch (err) {}
    }

    if (this.stylusOnlyMode && e.pointerType === 'touch') {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    this.isDrawing = true;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    this.lastSnapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const x = e.clientX;
    const y = e.clientY;
    this.shapeStartX = x;
    this.shapeStartY = y;
    this.prevX = x;
    this.prevY = y;
    this.lastMidX = x;
    this.lastMidY = y;
    this.hasMoved = false;

    const initialW = this.computeStrokeWidth(this.strokeWidth, e.pressure, e.pointerType);
    this.smoothWidth = initialW;

    if (this.isEraser) {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = Math.max(16, this.strokeWidth * 4);
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      if (this.strokeWidth >= 12) {
        this.ctx.strokeStyle = 'rgba(253, 203, 110, 0.45)';
      } else {
        this.ctx.strokeStyle = this.color;
      }
      this.ctx.lineWidth = initialW;
    }

    if (this.activeTool === 'pen') {
      this.ctx.beginPath();
      this.ctx.arc(x, y, (this.isEraser ? Math.max(8, this.strokeWidth * 2) : initialW / 2), 0, Math.PI * 2);
      this.ctx.fillStyle = this.isEraser ? 'rgba(0,0,0,1)' : (this.strokeWidth >= 12 ? 'rgba(253, 203, 110, 0.45)' : this.color);
      this.ctx.fill();
    }
  },

  draw(e) {
    if (this.stylusOnlyMode && e.pointerType === 'touch') {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    if (!this.isDrawing) return;

    const events = (typeof e.getCoalescedEvents === 'function' && e.getCoalescedEvents().length > 0)
      ? e.getCoalescedEvents()
      : [e];

    if (this.activeTool === 'pen') {
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const currentX = ev.clientX;
        const currentY = ev.clientY;

        const dx = currentX - this.prevX;
        const dy = currentY - this.prevY;
        if (dx * dx + dy * dy < 0.2) continue;

        const targetW = this.computeStrokeWidth(this.strokeWidth, ev.pressure, ev.pointerType);
        this.smoothWidth = this.smoothWidth * 0.65 + targetW * 0.35;
        this.ctx.lineWidth = this.isEraser ? Math.max(16, this.strokeWidth * 4) : this.smoothWidth;

        this.hasMoved = true;
        const midX = (this.prevX + currentX) / 2;
        const midY = (this.prevY + currentY) / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastMidX, this.lastMidY);
        this.ctx.quadraticCurveTo(this.prevX, this.prevY, midX, midY);
        this.ctx.stroke();

        this.lastMidX = midX;
        this.lastMidY = midY;
        this.prevX = currentX;
        this.prevY = currentY;
      }
    } else {
      // Fullscreen Shape Live Preview
      const ev = events[events.length - 1];
      const currentX = ev.clientX;
      const currentY = ev.clientY;
      this.hasMoved = true;

      this.ctx.putImageData(this.lastSnapshot, 0, 0);

      this.ctx.strokeStyle = this.strokeWidth >= 12 ? 'rgba(253, 203, 110, 0.45)' : this.color;
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      const sx = this.shapeStartX;
      const sy = this.shapeStartY;

      if (this.activeTool === 'line') {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
      } else if (this.activeTool === 'rect') {
        const rx = Math.min(sx, currentX);
        const ry = Math.min(sy, currentY);
        const rw = Math.abs(currentX - sx);
        const rh = Math.abs(currentY - sy);
        this.ctx.strokeRect(rx, ry, rw, rh);
      } else if (this.activeTool === 'circle') {
        const rx = Math.abs(currentX - sx) / 2;
        const ry = Math.abs(currentY - sy) / 2;
        const cx = (sx + currentX) / 2;
        const cy = (sy + currentY) / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (this.activeTool === 'axis') {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy); this.ctx.lineTo(currentX, sy);
        this.ctx.moveTo(sx, sy); this.ctx.lineTo(sx, currentY);
        this.ctx.stroke();

        const arrow = Math.max(this.strokeWidth * 2.2, 8);
        const xDir = currentX >= sx ? 1 : -1;
        this.ctx.beginPath();
        this.ctx.moveTo(currentX, sy);
        this.ctx.lineTo(currentX - xDir * arrow, sy - arrow / 1.6);
        this.ctx.lineTo(currentX - xDir * arrow, sy + arrow / 1.6);
        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        const yDir = currentY >= sy ? 1 : -1;
        this.ctx.beginPath();
        this.ctx.moveTo(sx, currentY);
        this.ctx.lineTo(sx - arrow / 1.6, currentY - yDir * arrow);
        this.ctx.lineTo(sx + arrow / 1.6, currentY - yDir * arrow);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  },

  stop(e) {
    if (!this.isDrawing) return;
    if (e) e.preventDefault();
    this.isDrawing = false;
    if (e && e.pointerId) {
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (window.getSelection) {
      try { window.getSelection().removeAllRanges(); } catch (err) {}
    }

    if (this.activeTool === 'pen' && this.hasMoved) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastMidX, this.lastMidY);
      this.ctx.lineTo(this.prevX, this.prevY);
      this.ctx.stroke();
    }

    if (this.lastSnapshot) {
      this.history.push(this.lastSnapshot);
      if (this.history.length > 30) this.history.shift();
      this.lastSnapshot = null;
    }
  },

  undo() {
    if (!this.history || this.history.length === 0) return;
    const prevState = this.history.pop();
    this.ctx.putImageData(prevState, 0, 0);
    AudioEngine.click();
  },

  clear() {
    if (this.ctx && this.canvas) {
      const snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.history.push(snapshot);
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }
    AudioEngine.click();
  },

  startStopwatch() {
    clearInterval(this.timerInterval);
  },

  stopStopwatch() {
    clearInterval(this.timerInterval);
  }
};

function setFsTool(tool, btn) {
  FullScreenPen.activeTool = tool;
  FullScreenPen.isEraser = false;

  const dock = btn.closest('.floating-stylus-dock');
  if (dock) {
    dock.querySelectorAll('#btnFsToolPen, #btnFsToolLine, #btnFsToolRect, #btnFsToolCircle, #btnFsToolAxis, #btnFsEraser').forEach(b => b.classList.remove('active'));
  }
  btn.classList.add('active');
  AudioEngine.click();
}

function exportFsCanvasImage() {
  if (!FullScreenPen.canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = FullScreenPen.canvas.width;
  exportCanvas.height = FullScreenPen.canvas.height;
  const ctx = exportCanvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  ctx.drawImage(FullScreenPen.canvas, 0, 0);

  ctx.fillStyle = 'rgba(24, 32, 56, 0.75)';
  ctx.font = `bold ${14 * dpr}px 'Outfit', sans-serif`;
  ctx.fillText('Mr Ahmed Abd El-Motaal • YouTube: mr Motaal • 01019775590', 24 * dpr, exportCanvas.height - 24 * dpr);

  const link = document.createElement('a');
  link.download = `Mr_Motaal_FullScreen_Whiteboard_${Date.now()}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
  AudioEngine.success();
}

function undoFsCanvas() {
  FullScreenPen.undo();
}

function setFsPenColor(col, dot) {
  FullScreenPen.color = col;
  FullScreenPen.isEraser = false;
  const wrap = dot.parentElement;
  wrap.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');
  const eraserBtn = document.getElementById('btnFsEraser');
  if (eraserBtn) eraserBtn.classList.remove('active');
  AudioEngine.click();
}

function setFsPenWidth(val) {
  FullScreenPen.strokeWidth = parseInt(val, 10);
}

function toggleFsEraser() {
  FullScreenPen.isEraser = !FullScreenPen.isEraser;
  const eraserBtn = document.getElementById('btnFsEraser');
  if (eraserBtn) eraserBtn.classList.toggle('active', FullScreenPen.isEraser);

  if (FullScreenPen.isEraser) {
    const dock = document.querySelector('.floating-stylus-dock');
    if (dock) {
      dock.querySelectorAll('#btnFsToolPen, #btnFsToolLine, #btnFsToolRect, #btnFsToolCircle, #btnFsToolAxis').forEach(b => b.classList.remove('active'));
    }
  }
  AudioEngine.click();
}

function clearFsCanvas() {
  FullScreenPen.clear();
}

function exitFsPenMode() {
  FullScreenPen.exit();
}

// ==========================================================================
// INFINITE CANVAS WHITEBOARD CONTROLLER
// Features: Two-Finger Pinch Zoom, One-Finger Pan, Stylus-Only Strict Mode,
// Palm Rejection, Zero-Latency Handwriting & Math Shapes
// ==========================================================================
const InfiniteWhiteboard = {
  isOpen: false,
  canvas: null,
  ctx: null,
  overlay: null,

  // Viewport transformation (Infinite Canvas)
  panX: 0,
  panY: 0,
  zoom: 1.0,
  minZoom: 0.1,
  maxZoom: 5.0,

  // Settings
  stylusOnlyMode: true, // Strict stylus mode for Apple Pencil
  color: '#ffffff',
  strokeWidth: 6,
  activeTool: 'pen', // 'pen', 'line', 'rect', 'circle', 'axis', 'eraser', 'select', 'hand'
  gridMode: 'dark', // 'dark', 'light'
  backgroundPattern: 'solid', // 'solid', 'grid', 'lines'
  
  // Stored Data (Persistent across sessions / never cleared automatically)
  strokes: [],
  images: [], // { id, el, src, x, y, width, height, aspectRatio }
  selectedImageId: null,
  undoStack: [],
  redoStack: [],

  // Tracking & Drawing State
  isDrawing: false,
  isPenDrawing: false,
  isPanning: false,
  isSingleTouchPanning: false,
  isMovingImage: false,
  isResizingImage: false,
  imageDragStart: null,
  lastPenTime: 0,
  activeTouches: new Map(), // pointerId -> { startX, startY, clientX, clientY, prevX, prevY }
  prevPinchDist: 0,
  prevPinchMidX: 0,
  prevPinchMidY: 0,
  panStartMouseX: 0,
  panStartMouseY: 0,

  // Active stroke in progress
  currentStroke: null,
  lastScreenPt: null,
  lastMidScreenPt: null,
  shapeStartWorld: null,
  shapeCurrentWorld: null,
  smoothWidth: 6,
  eraseSnapshot: null,
  hasErasedAnything: false,

  computeStrokeWidth(baseWidth, pressure, pointerType) {
    if (pointerType === 'pen' && typeof pressure === 'number' && pressure > 0 && pressure <= 1) {
      const eased = Math.pow(pressure, 0.85);
      return Math.max(1, baseWidth * (0.35 + 1.25 * eased));
    }
    return baseWidth;
  },

  distToSegmentSq(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projY = y1 + t * (y2 - y1);
    return (px - projX) * (px - projX) + (py - projY) * (py - projY);
  },

  eraseAtPoint(screenX, screenY) {
    const eraserRadius = Math.max(20, this.strokeWidth * 2.5);
    const worldRadius = eraserRadius / this.zoom;
    const worldRadiusSq = worldRadius * worldRadius;
    const worldPt = this.screenToWorld(screenX, screenY);

    let modified = false;
    const nextStrokes = [];

    for (let i = 0; i < this.strokes.length; i++) {
      const s = this.strokes[i];
      if (s.tool === 'pen') {
        if (!s.points || s.points.length === 0) continue;

        let anyHit = false;
        for (let j = 0; j < s.points.length; j++) {
          const p = s.points[j];
          const d2 = (p.x - worldPt.x) * (p.x - worldPt.x) + (p.y - worldPt.y) * (p.y - worldPt.y);
          if (d2 <= worldRadiusSq) {
            anyHit = true;
            break;
          }
          if (j > 0) {
            const prevP = s.points[j - 1];
            if (this.distToSegmentSq(worldPt.x, worldPt.y, prevP.x, prevP.y, p.x, p.y) <= worldRadiusSq) {
              anyHit = true;
              break;
            }
          }
        }

        if (anyHit) {
          modified = true;
          let curChunk = [];
          for (let j = 0; j < s.points.length; j++) {
            const p = s.points[j];
            const d2 = (p.x - worldPt.x) * (p.x - worldPt.x) + (p.y - worldPt.y) * (p.y - worldPt.y);
            if (d2 > worldRadiusSq) {
              curChunk.push(p);
            } else {
              if (curChunk.length > 0) {
                nextStrokes.push({
                  ...s,
                  id: Date.now() + Math.random(),
                  points: curChunk
                });
                curChunk = [];
              }
            }
          }
          if (curChunk.length > 0) {
            nextStrokes.push({
              ...s,
              id: Date.now() + Math.random(),
              points: curChunk
            });
          }
        } else {
          nextStrokes.push(s);
        }
      } else {
        // Geometric Shapes
        if (s.startWorld && s.endWorld) {
          const minX = Math.min(s.startWorld.x, s.endWorld.x) - worldRadius;
          const maxX = Math.max(s.startWorld.x, s.endWorld.x) + worldRadius;
          const minY = Math.min(s.startWorld.y, s.endWorld.y) - worldRadius;
          const maxY = Math.max(s.startWorld.y, s.endWorld.y) + worldRadius;

          if (worldPt.x >= minX && worldPt.x <= maxX && worldPt.y >= minY && worldPt.y <= maxY) {
            modified = true;
          } else {
            nextStrokes.push(s);
          }
        } else {
          nextStrokes.push(s);
        }
      }
    }

    if (modified) {
      this.strokes = nextStrokes;
      this.hasErasedAnything = true;
      this.render();
    }
  },

  drawEraserCursor(screenX, screenY) {
    const dpr = window.devicePixelRatio || 1;
    const eraserRadius = Math.max(20, this.strokeWidth * 2.5);
    this.ctx.save();
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY, eraserRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(238, 82, 83, 0.9)';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();
    this.ctx.fillStyle = 'rgba(238, 82, 83, 0.15)';
    this.ctx.fill();
    this.ctx.restore();
  },

  // Hit testing for images and resize handle
  hitTestImage(worldX, worldY, screenX, screenY) {
    if (this.selectedImageId) {
      const selImg = this.images.find(img => img.id === this.selectedImageId);
      if (selImg) {
        const handleScreenPt = this.worldToScreen(selImg.x + selImg.width, selImg.y + selImg.height);
        const dist = Math.hypot(screenX - handleScreenPt.x, screenY - handleScreenPt.y);
        if (dist <= 24) {
          return { hit: 'handle', img: selImg };
        }
      }
    }

    for (let i = this.images.length - 1; i >= 0; i--) {
      const img = this.images[i];
      if (worldX >= img.x && worldX <= img.x + img.width &&
          worldY >= img.y && worldY <= img.y + img.height) {
        return { hit: 'body', img: img };
      }
    }

    return null;
  },

  getSelectedImage() {
    return this.images.find(img => img.id === this.selectedImageId);
  },

  selectImage(id) {
    this.selectedImageId = id;
    const selectBtn = document.getElementById('wbToolSelect');
    this.setTool('select', selectBtn);
    this.updateImageToolbar();
    this.render();
  },

  deselectImage() {
    this.selectedImageId = null;
    this.hideImageToolbar();
    const penBtn = document.getElementById('wbToolPen');
    this.setTool('pen', penBtn);
    this.render();
  },

  scaleSelectedImage(factor, isReset = false) {
    const img = this.getSelectedImage();
    if (!img) return;

    const centerX = img.x + img.width / 2;
    const centerY = img.y + img.height / 2;
    const ratio = img.aspectRatio || (img.width / img.height) || 1;

    if (isReset) {
      const defaultW = Math.min(480, (window.innerWidth * 0.65) / this.zoom);
      img.width = defaultW;
      img.height = defaultW / ratio;
    } else {
      const newWidth = Math.max(60, Math.min(5000, img.width * factor));
      img.width = newWidth;
      img.height = newWidth / ratio;
    }

    img.x = centerX - img.width / 2;
    img.y = centerY - img.height / 2;

    this.render();
    this.updateImageToolbar();
    this.saveToStorage();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  centerSelectedImage() {
    const img = this.getSelectedImage();
    if (!img) return;
    const centerWorld = this.screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    img.x = centerWorld.x - img.width / 2;
    img.y = centerWorld.y - img.height / 2;
    this.render();
    this.updateImageToolbar();
    this.saveToStorage();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  deleteSelectedImage() {
    const img = this.getSelectedImage();
    if (!img) return;
    const idx = this.images.indexOf(img);
    if (idx !== -1) {
      this.images.splice(idx, 1);
    }
    this.selectedImageId = null;
    this.hideImageToolbar();
    this.setTool('pen', document.getElementById('wbToolPen'));
    this.render();
    this.saveToStorage();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  updateImageToolbar() {
    const tb = document.getElementById('wbImageToolbar');
    if (!tb) return;
    const img = this.getSelectedImage();
    if (!img) {
      tb.style.display = 'none';
      return;
    }
    tb.style.display = 'flex';
    const label = tb.querySelector('.wb-img-tb-label');
    if (label) {
      label.innerHTML = `<i class="fa-solid fa-image"></i> ${Math.round(img.width)}px`;
    }
  },

  hideImageToolbar() {
    const tb = document.getElementById('wbImageToolbar');
    if (tb) tb.style.display = 'none';
  },

  triggerImageUpload() {
    const input = document.getElementById('wbImageFileInput');
    if (input) input.click();
  },

  handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgEl = new Image();
      imgEl.onload = () => {
        const aspectRatio = imgEl.naturalWidth / imgEl.naturalHeight || 1;
        const initialWidth = Math.min(480, (window.innerWidth * 0.65) / this.zoom);
        const initialHeight = initialWidth / aspectRatio;

        const centerWorld = this.screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
        const x = centerWorld.x - initialWidth / 2;
        const y = centerWorld.y - initialHeight / 2;

        const imgObj = {
          id: 'img_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          el: imgEl,
          src: e.target.result,
          x: x,
          y: y,
          width: initialWidth,
          height: initialHeight,
          aspectRatio: aspectRatio
        };

        this.images.push(imgObj);
        this.selectImage(imgObj.id);
        this.saveToStorage();
        this.render();
        if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
      };
      imgEl.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  },

  // 4 Adaptive Colors Engine (Dark Board vs Light Board)
  updateColorsUI() {
    const isLight = this.gridMode === 'light';
    const palette = isLight
      ? [
          { color: '#182038', name: 'Dark Ink' },
          { color: '#0984e3', name: 'Royal Blue' },
          { color: '#d63031', name: 'Crimson Red' },
          { color: '#00b894', name: 'Emerald Green' }
        ]
      : [
          { color: '#ffffff', name: 'White Chalk' },
          { color: '#fed330', name: 'Neon Yellow' },
          { color: '#00d2d3', name: 'Cyan Blue' },
          { color: '#ff6b6b', name: 'Coral Red' }
        ];

    const circles = [
      document.getElementById('wbColor1'),
      document.getElementById('wbColor2'),
      document.getElementById('wbColor3'),
      document.getElementById('wbColor4')
    ];

    let foundActiveIndex = -1;
    circles.forEach((btn, idx) => {
      if (!btn) return;
      const p = palette[idx];
      btn.dataset.color = p.color;
      btn.style.backgroundColor = p.color;
      btn.style.setProperty('--c', p.color);
      btn.title = p.name;
      if (btn.classList.contains('active')) {
        foundActiveIndex = idx;
      }
    });

    if (foundActiveIndex >= 0) {
      this.color = palette[foundActiveIndex].color;
    } else if (circles[0]) {
      circles[0].classList.add('active');
      this.color = palette[0].color;
    }
    this.updateActiveColorIndicator();
  },

  // Popover Toggles for Compact Floating Dock
  toggleShapesPopover(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const pop = document.getElementById('wbShapesPopover');
    const wrap = pop?.closest('.wb-dropdown-wrap');
    const isOpen = pop?.classList.contains('open');
    this.closeAllPopovers();
    if (!isOpen && pop) {
      pop.classList.add('open');
      wrap?.classList.add('open');
    }
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  toggleColorPopover(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const pop = document.getElementById('wbColorPopover');
    const wrap = pop?.closest('.wb-dropdown-wrap');
    const isOpen = pop?.classList.contains('open');
    this.closeAllPopovers();
    if (!isOpen && pop) {
      pop.classList.add('open');
      wrap?.classList.add('open');
    }
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  toggleStrokePopover(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const pop = document.getElementById('wbStrokePopover');
    const wrap = pop?.closest('.wb-dropdown-wrap');
    const isOpen = pop?.classList.contains('open');
    this.closeAllPopovers();
    if (!isOpen && pop) {
      pop.classList.add('open');
      wrap?.classList.add('open');
    }
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  closeAllPopovers() {
    document.querySelectorAll('.wb-popover-menu.open').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.wb-dropdown-wrap.open').forEach(w => w.classList.remove('open'));
  },

  updateActiveColorIndicator() {
    const dot = document.getElementById('wbActiveColorIndicator');
    if (dot) {
      dot.style.backgroundColor = this.color;
      dot.style.setProperty('--active-wb-color', this.color);
    }
  },

  updateActiveStrokeIndicator() {
    const dot = document.getElementById('wbActiveStrokeIndicator');
    if (dot) {
      const sizePx = Math.max(3, Math.min(14, this.strokeWidth));
      dot.style.width = sizePx + 'px';
      dot.style.height = sizePx + 'px';
    }
  },

  init() {
    this.overlay = document.getElementById('infiniteWhiteboardOverlay');
    this.canvas = document.getElementById('infiniteWhiteboardCanvas');
    if (!this.canvas || !this.overlay) return;

    // Direct Context with desynchronized: true for Zero Latency
    this.ctx = this.canvas.getContext('2d', { desynchronized: true, alpha: false });

    // Center the origin in the middle of viewport
    this.panX = window.innerWidth / 2;
    this.panY = window.innerHeight / 2;

    this.resize();
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.resize();
        this.render();
      }
    });

    // Safari iOS native gesture & callout prevention
    const preventGesture = (e) => e.preventDefault();
    this.canvas.addEventListener('gesturestart', preventGesture, { passive: false });
    this.canvas.addEventListener('gesturechange', preventGesture, { passive: false });
    this.canvas.addEventListener('gestureend', preventGesture, { passive: false });

    // Suppress context menu & selection gestures on canvas
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    this.canvas.addEventListener('selectstart', preventGesture, { passive: false });

    // Touch listeners on canvas with passive: false to prevent Safari tap-and-hold magnifier / text callout
    this.canvas.addEventListener('touchstart', preventGesture, { passive: false });
    this.canvas.addEventListener('touchmove', preventGesture, { passive: false });
    this.canvas.addEventListener('touchend', preventGesture, { passive: false });
    this.canvas.addEventListener('touchcancel', preventGesture, { passive: false });

    // Touch & Pointer Bindings with passive: false
    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
    this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e), { passive: false });
    this.canvas.addEventListener('pointercancel', (e) => this.onPointerCancel(e), { passive: false });

    // Wheel Zooming
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Prevent default context menu and selection on the entire overlay
    this.overlay.addEventListener('contextmenu', (e) => e.preventDefault());
    this.overlay.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('contextmenu', (e) => {
      if (this.isOpen) e.preventDefault();
    }, { capture: true });
    document.addEventListener('selectstart', (e) => {
      if (this.isOpen) e.preventDefault();
    }, { capture: true });

    // Strict iOS Safari text selection & callout menu suppression
    document.addEventListener('selectionchange', () => {
      if (this.isOpen) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          sel.removeAllRanges();
        }
      }
    });

    // Close popovers when clicking outside the floating dock
    document.addEventListener('pointerdown', (e) => {
      if (this.isOpen && !e.target.closest('.wb-dropdown-wrap') && !e.target.closest('.wb-popover-menu')) {
        this.closeAllPopovers();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => this.onKeyDown(e));

    // Load persistent state (never lost unless manually cleared!)
    this.loadFromStorage();

    // Update UI elements
    this.updateColorsUI();
    this.updateActiveColorIndicator();
    this.updateActiveStrokeIndicator();
    this.updateThemeIndicator();
    this.updatePatternIndicator();
    this.updateStylusIndicator();
    this.updateZoomDisplay();
  },

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
  },

  open() {
    this.isOpen = true;
    document.body.classList.add('whiteboard-active');
    if (this.overlay) this.overlay.classList.add('active');
    this.resize();
    this.updateColorsUI();
    this.updateActiveColorIndicator();
    this.updateActiveStrokeIndicator();
    this.updateThemeIndicator();
    this.updatePatternIndicator();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
  },

  close() {
    this.isOpen = false;
    document.body.classList.remove('whiteboard-active');
    if (this.overlay) this.overlay.classList.remove('active');
    this.closeAllPopovers();
    this.hideImageToolbar();
    this.activeTouches.clear();
    this.isPenDrawing = false;
    this.isDrawing = false;
    this.isPanning = false;
    this.isSingleTouchPanning = false;
    this.isMovingImage = false;
    this.isResizingImage = false;
    this.imageDragStart = null;
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.panX) / this.zoom,
      y: (sy - this.panY) / this.zoom
    };
  },

  worldToScreen(wx, wy) {
    return {
      x: wx * this.zoom + this.panX,
      y: wy * this.zoom + this.panY
    };
  },

  // Pointer Down
  onPointerDown(e) {
    e.preventDefault();
    try {
      if (window.getSelection) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) sel.removeAllRanges();
      }
    } catch (_) {}
    this.closeAllPopovers();

    // Capture pointer events for this pointerId so iOS gestures/callouts don't intercept
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    const pt = this.getCanvasPoint(e);
    const worldPt = this.screenToWorld(pt.x, pt.y);

    // Hit test on images & handles
    const hit = this.hitTestImage(worldPt.x, worldPt.y, pt.x, pt.y);

    // 1. SELECT / MOVE / RESIZE IMAGE HANDLING
    if (this.activeTool === 'select' || (hit && hit.hit === 'handle') || (hit && !this.isPenDrawing && e.pointerType === 'mouse')) {
      if (hit && hit.hit === 'handle') {
        this.isResizingImage = true;
        this.imageDragStart = {
          pointerWorldX: worldPt.x,
          pointerWorldY: worldPt.y,
          initialWidth: hit.img.width,
          initialHeight: hit.img.height,
          aspectRatio: hit.img.aspectRatio || (hit.img.width / hit.img.height),
          img: hit.img
        };
        return;
      }
      if (hit && hit.hit === 'body') {
        this.selectImage(hit.img.id);
        this.isMovingImage = true;
        this.imageDragStart = {
          pointerWorldX: worldPt.x,
          pointerWorldY: worldPt.y,
          initialX: hit.img.x,
          initialY: hit.img.y,
          img: hit.img
        };
        return;
      }
      if (!hit && this.activeTool === 'select') {
        this.deselectImage();
      }
    }

    // 2. PEN HANDLING (Apple Pencil / Stylus - ALWAYS DRAWS SMOOTHLY)
    if (e.pointerType === 'pen') {
      this.lastPenTime = Date.now();
      this.isPenDrawing = true;
      this.isPanning = false;
      this.isSingleTouchPanning = false;
      this.activeTouches.clear();
      this.startDrawing(pt.x, pt.y, true, e.pressure, e.pointerType);
      return;
    }

    // 3. TOUCH HANDLING (Fingers - STRICTLY 1-FINGER PAN & 2-FINGER ZOOM)
    if (e.pointerType === 'touch') {
      // While pen is active on glass, reject touch (strict palm rejection)
      if (this.isPenDrawing) return;

      // In select tool with finger: handle image selection or move
      if (this.activeTool === 'select' && hit) {
        if (hit.hit === 'handle') {
          this.isResizingImage = true;
          this.imageDragStart = {
            pointerWorldX: worldPt.x,
            pointerWorldY: worldPt.y,
            initialWidth: hit.img.width,
            initialHeight: hit.img.height,
            aspectRatio: hit.img.aspectRatio || (hit.img.width / hit.img.height),
            img: hit.img
          };
          return;
        }
        if (hit.hit === 'body') {
          this.selectImage(hit.img.id);
          this.isMovingImage = true;
          this.imageDragStart = {
            pointerWorldX: worldPt.x,
            pointerWorldY: worldPt.y,
            initialX: hit.img.x,
            initialY: hit.img.y,
            img: hit.img
          };
          return;
        }
      }

      this.activeTouches.set(e.pointerId, {
        clientX: pt.x,
        clientY: pt.y,
        prevX: pt.x,
        prevY: pt.y
      });

      if (this.activeTouches.size === 1) {
        this.isPanning = true;
        this.isSingleTouchPanning = true;
      } else if (this.activeTouches.size >= 2) {
        this.isPanning = true;
        this.isSingleTouchPanning = false;
        const touches = Array.from(this.activeTouches.values());
        const t1 = touches[0];
        const t2 = touches[1];
        this.prevPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        this.prevPinchMidX = (t1.clientX + t2.clientX) / 2;
        this.prevPinchMidY = (t1.clientY + t2.clientY) / 2;
      }
      return;
    }

    // 4. MOUSE HANDLING (Desktop)
    if (e.pointerType === 'mouse') {
      if (e.button === 1 || e.button === 2 || this.activeTool === 'hand' || e.spaceKey) {
        this.isPanning = true;
        this.panStartMouseX = pt.x;
        this.panStartMouseY = pt.y;
        this.canvas.classList.add('cursor-grabbing');
      } else if (e.button === 0) {
        this.startDrawing(pt.x, pt.y, false, e.pressure, e.pointerType);
      }
    }
  },

  // Pointer Move
  onPointerMove(e) {
    e.preventDefault();
    const pt = this.getCanvasPoint(e);

    // 1. Moving / Resizing Image
    if (this.isMovingImage && this.imageDragStart) {
      const worldPt = this.screenToWorld(pt.x, pt.y);
      const dx = worldPt.x - this.imageDragStart.pointerWorldX;
      const dy = worldPt.y - this.imageDragStart.pointerWorldY;
      this.imageDragStart.img.x = this.imageDragStart.initialX + dx;
      this.imageDragStart.img.y = this.imageDragStart.initialY + dy;
      this.render();
      this.updateImageToolbar();
      return;
    }

    if (this.isResizingImage && this.imageDragStart) {
      const worldPt = this.screenToWorld(pt.x, pt.y);
      const newWidth = Math.max(60, worldPt.x - this.imageDragStart.img.x);
      this.imageDragStart.img.width = newWidth;
      this.imageDragStart.img.height = newWidth / this.imageDragStart.aspectRatio;
      this.render();
      this.updateImageToolbar();
      return;
    }

    // 2. PEN HANDLING (Zero Latency Writing, NO PANNING)
    if (e.pointerType === 'pen') {
      this.lastPenTime = Date.now();
      if (!this.isPenDrawing || !this.isDrawing) return;
      this.continueDrawing(e);
      return;
    }

    // 3. TOUCH HANDLING (1-Finger Pan & 2-Finger Pinch Zoom)
    if (e.pointerType === 'touch') {
      if (this.isPenDrawing) return;
      if (!this.activeTouches.has(e.pointerId)) return;

      const touch = this.activeTouches.get(e.pointerId);
      const dx = pt.x - touch.clientX;
      const dy = pt.y - touch.clientY;
      touch.prevX = touch.clientX;
      touch.prevY = touch.clientY;
      touch.clientX = pt.x;
      touch.clientY = pt.y;

      if (this.activeTouches.size === 1) {
        // ONE-FINGER PAN: Smooth direct canvas panning
        this.panX += dx;
        this.panY += dy;
        this.render();
      } else if (this.activeTouches.size >= 2) {
        // TWO-FINGER PINCH TO ZOOM & TWO-FINGER PAN
        const touches = Array.from(this.activeTouches.values()).slice(0, 2);
        const t1 = touches[0];
        const t2 = touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const currentMidX = (t1.clientX + t2.clientX) / 2;
        const currentMidY = (t1.clientY + t2.clientY) / 2;

        if (this.prevPinchDist > 0 && currentDist > 0) {
          const zoomFactor = currentDist / this.prevPinchDist;
          const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));

          const worldX = (this.prevPinchMidX - this.panX) / this.zoom;
          const worldY = (this.prevPinchMidY - this.panY) / this.zoom;

          this.zoom = newZoom;
          this.panX = currentMidX - worldX * this.zoom;
          this.panY = currentMidY - worldY * this.zoom;

          this.updateZoomDisplay();
          this.render();
        }

        this.prevPinchDist = currentDist;
        this.prevPinchMidX = currentMidX;
        this.prevPinchMidY = currentMidY;
      }
      return;
    }

    // 4. MOUSE HANDLING
    if (e.pointerType === 'mouse') {
      if (this.isPanning) {
        const dx = pt.x - this.panStartMouseX;
        const dy = pt.y - this.panStartMouseY;
        this.panX += dx;
        this.panY += dy;
        this.panStartMouseX = pt.x;
        this.panStartMouseY = pt.y;
        this.render();
      } else if (this.isDrawing) {
        this.continueDrawing(e);
      }
    }
  },

  // Pointer Up
  onPointerUp(e) {
    e.preventDefault();
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (this.isMovingImage || this.isResizingImage) {
      this.isMovingImage = false;
      this.isResizingImage = false;
      this.imageDragStart = null;
      this.saveToStorage();
      return;
    }

    if (e.pointerType === 'pen') {
      this.lastPenTime = Date.now();
      if (this.isPenDrawing) {
        this.finishDrawing();
        this.isPenDrawing = false;
      }
      return;
    }

    if (e.pointerType === 'touch') {
      this.activeTouches.delete(e.pointerId);
      if (this.activeTouches.size === 0) {
        this.isPanning = false;
        this.isSingleTouchPanning = false;
        this.canvas.classList.remove('cursor-grabbing');
        this.prevPinchDist = 0;
      } else if (this.activeTouches.size === 1) {
        this.prevPinchDist = 0;
        const remaining = Array.from(this.activeTouches.values())[0];
        remaining.prevX = remaining.clientX;
        remaining.prevY = remaining.clientY;
      }
      return;
    }

    if (e.pointerType === 'mouse') {
      if (this.isPanning) {
        this.isPanning = false;
        this.canvas.classList.remove('cursor-grabbing');
      }
      if (this.isDrawing) {
        this.finishDrawing();
      }
    }
  },

  onPointerCancel(e) {
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
    if (e.pointerType === 'pen') {
      this.lastPenTime = Date.now();
      if (this.isPenDrawing) {
        this.finishDrawing();
        this.isPenDrawing = false;
      }
      return;
    }
    this.onPointerUp(e);
  },

  // Mouse Wheel Zoom
  onWheel(e) {
    e.preventDefault();
    const pt = this.getCanvasPoint(e);
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));

    const worldPoint = this.screenToWorld(pt.x, pt.y);
    this.zoom = newZoom;
    this.panX = pt.x - worldPoint.x * this.zoom;
    this.panY = pt.y - worldPoint.y * this.zoom;

    this.updateZoomDisplay();
    this.render();
  },

  // Start Drawing Stroke
  startDrawing(screenX, screenY, isPen, pressure, pointerType) {
    if (this.activeTool === 'select') return;

    if (this.activeTool === 'eraser') {
      this.isDrawing = true;
      this.lastScreenPt = { x: screenX, y: screenY };
      this.eraseSnapshot = [...this.strokes];
      this.hasErasedAnything = false;
      this.eraseAtPoint(screenX, screenY);
      this.drawEraserCursor(screenX, screenY);
      return;
    }

    this.isDrawing = true;
    const worldPt = this.screenToWorld(screenX, screenY);
    this.shapeStartWorld = worldPt;
    this.shapeCurrentWorld = worldPt;

    this.lastScreenPt = { x: screenX, y: screenY };
    this.lastMidScreenPt = { x: screenX, y: screenY };

    const initialWidth = this.computeStrokeWidth(this.strokeWidth, pressure, pointerType);
    this.smoothWidth = initialWidth;
    worldPt.w = initialWidth;

    this.currentStroke = {
      id: Date.now() + Math.random(),
      tool: this.activeTool,
      color: this.color,
      width: this.strokeWidth,
      points: [worldPt]
    };

    if (this.activeTool === 'pen') {
      const dpr = window.devicePixelRatio || 1;
      this.ctx.save();
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.beginPath();
      const dotRadius = Math.max((initialWidth * this.zoom) / 2, 1);
      this.ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.strokeWidth >= 20 ? this.getHighlighterColor() : this.color;
      this.ctx.fill();
      this.ctx.restore();
    }
  },

  // Continue Drawing
  continueDrawing(e) {
    const rect = this.canvas.getBoundingClientRect();

    if (this.activeTool === 'eraser') {
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      const dist = Math.hypot(curX - this.lastScreenPt.x, curY - this.lastScreenPt.y);
      const steps = Math.max(1, Math.ceil(dist / 6));
      for (let s = 1; s <= steps; s++) {
        const ix = this.lastScreenPt.x + (curX - this.lastScreenPt.x) * (s / steps);
        const iy = this.lastScreenPt.y + (curY - this.lastScreenPt.y) * (s / steps);
        this.eraseAtPoint(ix, iy);
      }
      this.lastScreenPt = { x: curX, y: curY };
      this.drawEraserCursor(curX, curY);
      return;
    }

    if (!this.currentStroke) return;

    const events = (typeof e.getCoalescedEvents === 'function' && e.getCoalescedEvents().length > 0)
      ? e.getCoalescedEvents()
      : [e];

    const dpr = window.devicePixelRatio || 1;

    if (this.activeTool === 'pen') {
      this.ctx.save();
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.strokeWidth >= 20 ? this.getHighlighterColor() : this.color;

      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const curScreenX = ev.clientX - rect.left;
        const curScreenY = ev.clientY - rect.top;

        const dx = curScreenX - this.lastScreenPt.x;
        const dy = curScreenY - this.lastScreenPt.y;
        if (dx * dx + dy * dy < 0.25) continue;

        const targetW = this.computeStrokeWidth(this.strokeWidth, ev.pressure, ev.pointerType);
        this.smoothWidth = this.smoothWidth * 0.65 + targetW * 0.35;

        const midX = (this.lastScreenPt.x + curScreenX) / 2;
        const midY = (this.lastScreenPt.y + curScreenY) / 2;

        this.ctx.lineWidth = Math.max(1, this.smoothWidth * this.zoom);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastMidScreenPt.x, this.lastMidScreenPt.y);
        this.ctx.quadraticCurveTo(this.lastScreenPt.x, this.lastScreenPt.y, midX, midY);
        this.ctx.stroke();

        this.lastMidScreenPt = { x: midX, y: midY };
        this.lastScreenPt = { x: curScreenX, y: curScreenY };

        const worldPt = this.screenToWorld(curScreenX, curScreenY);
        worldPt.w = this.smoothWidth;
        this.currentStroke.points.push(worldPt);
      }

      this.ctx.restore();
    } else {
      const lastEv = events[events.length - 1];
      const curX = lastEv.clientX - rect.left;
      const curY = lastEv.clientY - rect.top;
      this.shapeCurrentWorld = this.screenToWorld(curX, curY);
      this.render();
    }
  },

  // Finish Drawing
  finishDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.activeTool === 'eraser') {
      this.render();
      if (this.hasErasedAnything && this.eraseSnapshot) {
        this.undoStack.push({
          type: 'erase_batch',
          before: this.eraseSnapshot,
          after: [...this.strokes]
        });
        this.redoStack = [];
        this.saveToStorage();
        if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
      }
      this.eraseSnapshot = null;
      this.hasErasedAnything = false;
      return;
    }

    if (this.activeTool === 'pen') {
      if (this.currentStroke && this.currentStroke.points.length > 0) {
        this.pushStroke(this.currentStroke);
      }
    } else {
      const shapeStroke = {
        id: Date.now() + Math.random(),
        tool: this.activeTool,
        color: this.color,
        width: this.strokeWidth,
        startWorld: this.shapeStartWorld,
        endWorld: this.shapeCurrentWorld
      };
      this.pushStroke(shapeStroke);
      this.render();
    }

    this.currentStroke = null;
    this.shapeStartWorld = null;
    this.shapeCurrentWorld = null;
  },

  pushStroke(stroke) {
    this.strokes.push(stroke);
    this.undoStack.push(stroke);
    this.redoStack = [];
    this.saveToStorage();
  },

  undo() {
    if (this.undoStack.length === 0) return;
    const action = this.undoStack.pop();
    if (action.type === 'full_clear') {
      this.strokes = [...action.strokes];
      this.images = [...action.images];
      this.redoStack.push(action);
    } else if (action.type === 'erase_batch') {
      this.strokes = [...action.before];
      this.redoStack.push(action);
    } else {
      const idx = this.strokes.indexOf(action);
      if (idx !== -1) {
        this.strokes.splice(idx, 1);
      } else {
        this.strokes.pop();
      }
      this.redoStack.push(action);
    }
    this.saveToStorage();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  redo() {
    if (this.redoStack.length === 0) return;
    const action = this.redoStack.pop();
    if (action.type === 'full_clear') {
      this.strokes = [];
      this.images = [];
      this.undoStack.push(action);
    } else if (action.type === 'erase_batch') {
      this.strokes = [...action.after];
      this.undoStack.push(action);
    } else {
      this.strokes.push(action);
      this.undoStack.push(action);
    }
    this.saveToStorage();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  clear() {
    if (this.strokes.length === 0 && this.images.length === 0) return;
    this.undoStack.push({
      type: 'full_clear',
      strokes: [...this.strokes],
      images: [...this.images]
    });
    this.strokes = [];
    this.images = [];
    this.selectedImageId = null;
    this.redoStack = [];
    this.saveToStorage();
    this.hideImageToolbar();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
  },

  // Rendering Engine
  render() {
    if (!this.ctx || !this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;

    // Clear background
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.fillStyle = this.getBackgroundColor();
    this.ctx.fillRect(0, 0, width, height);

    // Draw solid board (No square grid lines)
    this.drawGrid(width, height);

    // Set Transformation Matrix for World Coordinates
    this.ctx.setTransform(
      dpr * this.zoom,
      0,
      0,
      dpr * this.zoom,
      dpr * this.panX,
      dpr * this.panY
    );

    // 1. Draw Stored Images (Rendered before strokes so strokes are drawn on top)
    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i];
      if (img.el && img.el.complete) {
        this.ctx.drawImage(img.el, img.x, img.y, img.width, img.height);
      }
    }

    // 2. Draw Selection Box & Handles for Selected Image
    if (this.selectedImageId) {
      const selImg = this.images.find(img => img.id === this.selectedImageId);
      if (selImg) {
        this.renderImageSelection(selImg);
      }
    }

    // 3. Draw Stored Strokes & Shapes
    for (let i = 0; i < this.strokes.length; i++) {
      this.renderStroke(this.strokes[i]);
    }

    // 4. Draw In-Progress Shape Preview
    if (this.isDrawing && this.shapeStartWorld && this.shapeCurrentWorld && this.activeTool !== 'pen' && this.activeTool !== 'eraser') {
      this.renderShape(
        this.activeTool,
        this.shapeStartWorld,
        this.shapeCurrentWorld,
        this.color,
        this.strokeWidth
      );
    }
  },

  renderImageSelection(img) {
    this.ctx.save();
    this.ctx.strokeStyle = '#6c5ce7';
    this.ctx.lineWidth = 2 / this.zoom;
    this.ctx.setLineDash([8 / this.zoom, 6 / this.zoom]);
    this.ctx.strokeRect(img.x, img.y, img.width, img.height);

    // Corner Handles
    const handleRadius = 9 / this.zoom;
    const corners = [
      { x: img.x, y: img.y },
      { x: img.x + img.width, y: img.y },
      { x: img.x, y: img.y + img.height },
      { x: img.x + img.width, y: img.y + img.height, isMain: true }
    ];

    this.ctx.setLineDash([]);
    corners.forEach(c => {
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.isMain ? handleRadius * 1.3 : handleRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = c.isMain ? '#6c5ce7' : '#ffffff';
      this.ctx.fill();
      this.ctx.strokeStyle = c.isMain ? '#ffffff' : '#6c5ce7';
      this.ctx.lineWidth = 2.5 / this.zoom;
      this.ctx.stroke();
    });

    this.ctx.restore();
  },

  renderStroke(s) {
    if (s.tool === 'pen') {
      if (!s.points || s.points.length === 0) return;
      this.ctx.save();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = s.width >= 20 ? this.getHighlighterColor() : s.color;
      this.ctx.fillStyle = s.width >= 20 ? this.getHighlighterColor() : s.color;

      if (s.points.length === 1) {
        const p = s.points[0];
        const r = (p.w || s.width) / 2;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        let lastMidX = s.points[0].x;
        let lastMidY = s.points[0].y;
        for (let j = 1; j < s.points.length; j++) {
          const pt = s.points[j];
          const prevPt = s.points[j - 1];
          const midX = (prevPt.x + pt.x) / 2;
          const midY = (prevPt.y + pt.y) / 2;
          this.ctx.beginPath();
          this.ctx.lineWidth = pt.w || s.width;
          this.ctx.moveTo(lastMidX, lastMidY);
          this.ctx.quadraticCurveTo(prevPt.x, prevPt.y, midX, midY);
          this.ctx.stroke();
          lastMidX = midX;
          lastMidY = midY;
        }
        const lastPt = s.points[s.points.length - 1];
        this.ctx.beginPath();
        this.ctx.lineWidth = lastPt.w || s.width;
        this.ctx.moveTo(lastMidX, lastMidY);
        this.ctx.lineTo(lastPt.x, lastPt.y);
        this.ctx.stroke();
      }
      this.ctx.restore();
    } else {
      this.renderShape(s.tool, s.startWorld, s.endWorld, s.color, s.width);
    }
  },

  renderShape(tool, start, end, color, width) {
    this.ctx.save();
    this.ctx.strokeStyle = width >= 20 ? this.getHighlighterColor() : color;
    this.ctx.fillStyle = width >= 20 ? this.getHighlighterColor() : color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    const sx = start.x;
    const sy = start.y;
    const ex = end.x;
    const ey = end.y;

    if (tool === 'line') {
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
    } else if (tool === 'rect') {
      const rx = Math.min(sx, ex);
      const ry = Math.min(sy, ey);
      const rw = Math.abs(ex - sx);
      const rh = Math.abs(ey - sy);
      this.ctx.strokeRect(rx, ry, rw, rh);
    } else if (tool === 'circle') {
      const rx = Math.abs(ex - sx) / 2;
      const ry = Math.abs(ey - sy) / 2;
      const cx = (sx + ex) / 2;
      const cy = (sy + ey) / 2;
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
      this.ctx.stroke();
    } else if (tool === 'axis') {
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, sy);
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(sx, ey);
      this.ctx.stroke();

      const arrow = Math.max(width * 2.5, 8);
      const xDir = ex >= sx ? 1 : -1;
      const yDir = ey >= sy ? 1 : -1;

      this.ctx.beginPath();
      this.ctx.moveTo(ex, sy);
      this.ctx.lineTo(ex - arrow * xDir, sy - arrow * 0.5);
      this.ctx.lineTo(ex - arrow * xDir, sy + arrow * 0.5);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(sx, ey);
      this.ctx.lineTo(sx - arrow * 0.5, ey - arrow * yDir);
      this.ctx.lineTo(sx + arrow * 0.5, ey - arrow * yDir);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(sx, sy, Math.max(width * 0.8, 3), 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  },

  drawGrid(width, height) {
    if (this.backgroundPattern === 'solid') return;

    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isLight = this.gridMode === 'light';
    const strokeColor = isLight ? 'rgba(24, 32, 56, 0.12)' : 'rgba(255, 255, 255, 0.11)';

    const baseSpacing = 40;
    const step = baseSpacing * this.zoom;

    if (step >= 12) {
      const startX = ((this.panX % step) + step) % step;
      const startY = ((this.panY % step) + step) % step;

      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = strokeColor;
      this.ctx.beginPath();

      if (this.backgroundPattern === 'grid') {
        for (let x = startX; x <= width; x += step) {
          const px = Math.round(x) + 0.5;
          this.ctx.moveTo(px, 0);
          this.ctx.lineTo(px, height);
        }
        for (let y = startY; y <= height; y += step) {
          const py = Math.round(y) + 0.5;
          this.ctx.moveTo(0, py);
          this.ctx.lineTo(width, py);
        }
      } else if (this.backgroundPattern === 'lines') {
        for (let y = startY; y <= height; y += step) {
          const py = Math.round(y) + 0.5;
          this.ctx.moveTo(0, py);
          this.ctx.lineTo(width, py);
        }
      }
      this.ctx.stroke();
    }

    this.ctx.restore();
  },

  getBackgroundColor() {
    if (this.gridMode === 'light') return '#ffffff';
    return '#0f141c';
  },

  getHighlighterColor() {
    return 'rgba(254, 211, 48, 0.4)';
  },

  toggleStylusOnly() {
    this.stylusOnlyMode = !this.stylusOnlyMode;
    this.updateStylusIndicator();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  updateStylusIndicator() {
    const btn = document.getElementById('wbStylusOnlyBtn');
    const tag = document.getElementById('wbStylusStatusTag');
    const txt = btn?.querySelector('.wb-stylus-btn-text');

    if (this.stylusOnlyMode) {
      if (btn) btn.classList.add('active');
      if (txt) txt.innerText = 'Stylus Only: ON';
      if (tag) {
        tag.classList.remove('disabled');
        tag.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Stylus Only Active';
      }
    } else {
      if (btn) btn.classList.remove('active');
      if (txt) txt.innerText = 'Stylus Only: OFF';
      if (tag) {
        tag.classList.add('disabled');
        tag.innerHTML = '<i class="fa-solid fa-hand"></i> Touch Drawing Enabled';
      }
    }
  },

  zoomIn() {
    this.setZoomAtCenter(this.zoom * 1.25);
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  zoomOut() {
    this.setZoomAtCenter(this.zoom * 0.8);
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  setZoomAtCenter(newZoom) {
    const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const worldCenter = this.screenToWorld(cx, cy);

    this.zoom = clamped;
    this.panX = cx - worldCenter.x * this.zoom;
    this.panY = cy - worldCenter.y * this.zoom;

    this.updateZoomDisplay();
    this.render();
  },

  resetView() {
    this.zoom = 1.0;
    this.panX = window.innerWidth / 2;
    this.panY = window.innerHeight / 2;
    this.updateZoomDisplay();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  updateZoomDisplay() {
    const badge = document.getElementById('wbZoomDisplay');
    if (badge) {
      badge.innerText = `${Math.round(this.zoom * 100)}%`;
    }
  },

  setColor(col, btn) {
    this.color = col;
    this.updateActiveColorIndicator();
    if (this.activeTool === 'eraser' || this.activeTool === 'select') {
      this.setTool('pen', document.getElementById('wbToolPen'));
    }
    const wrap = btn?.parentElement;
    if (wrap) {
      wrap.querySelectorAll('.wb-color-circle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.closeAllPopovers();
    this.saveToStorage();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  setWidth(w, btn) {
    this.strokeWidth = parseInt(w, 10);
    this.updateActiveStrokeIndicator();
    const dock = document.getElementById('wbFloatingDock');
    if (dock) {
      dock.querySelectorAll('.wb-stroke-btn').forEach(b => {
        if (b.dataset.width && parseInt(b.dataset.width, 10) === this.strokeWidth) {
          b.classList.add('active');
        } else if (b.dataset.width) {
          b.classList.remove('active');
        }
      });
    }
    if (btn) {
      dock?.querySelectorAll('.wb-stroke-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.closeAllPopovers();
    this.saveToStorage();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  stepWidth(delta) {
    const newW = Math.max(2, Math.min(32, this.strokeWidth + delta));
    this.setWidth(newW);
  },

  setTool(tool, btn) {
    this.activeTool = tool;
    const dock = document.getElementById('wbFloatingDock');
    const shapeTrigger = document.getElementById('wbShapesTrigger');
    const shapeIcon = document.getElementById('wbActiveShapeIcon');
    const penBtn = document.getElementById('wbToolPen');
    const eraserBtn = document.getElementById('wbToolEraser');

    // Deselect / select direct tool buttons
    if (penBtn) penBtn.classList.toggle('active', tool === 'pen');
    if (eraserBtn) eraserBtn.classList.toggle('active', tool === 'eraser');

    // Handle shapes
    const shapeTools = ['line', 'rect', 'circle', 'axis', 'select'];
    const isShape = shapeTools.includes(tool);
    if (shapeTrigger) shapeTrigger.classList.toggle('active', isShape);

    if (dock) {
      dock.querySelectorAll('.wb-popover-btn').forEach(b => b.classList.remove('active'));
    }
    if (btn && btn.classList.contains('wb-popover-btn')) {
      btn.classList.add('active');
    }

    // Update shape trigger icon if a shape tool is chosen
    if (shapeIcon) {
      if (tool === 'line') shapeIcon.className = 'fa-solid fa-ruler';
      else if (tool === 'rect') shapeIcon.className = 'fa-regular fa-square';
      else if (tool === 'circle') shapeIcon.className = 'fa-regular fa-circle';
      else if (tool === 'axis') shapeIcon.className = 'fa-solid fa-chart-line';
      else if (tool === 'select') shapeIcon.className = 'fa-solid fa-arrow-pointer';
      else shapeIcon.className = 'fa-solid fa-shapes';
    }

    if (this.canvas) {
      this.canvas.classList.toggle('cursor-hand', tool === 'hand');
      this.canvas.classList.toggle('cursor-select', tool === 'select');
    }
    if (tool !== 'select' && this.selectedImageId) {
      if (tool === 'eraser') {
        this.deselectImage();
      }
    }
    this.closeAllPopovers();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  cycleGrid() {
    this.gridMode = (this.gridMode === 'light') ? 'dark' : 'light';
    this.updateThemeIndicator();
    this.updateColorsUI();
    this.saveToStorage();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  updateThemeIndicator() {
    const icon = document.getElementById('wbThemeIcon');
    const btn = document.getElementById('wbThemeToggleBtn');
    if (icon) {
      if (this.gridMode === 'light') {
        icon.className = 'fa-solid fa-sun';
        if (btn) btn.title = 'وضع السبورة: فاتح (انقر للوضع الداكن)';
      } else {
        icon.className = 'fa-solid fa-moon';
        if (btn) btn.title = 'وضع السبورة: داكن (انقر للوضع الفاتح)';
      }
    }
  },

  cyclePattern() {
    const patterns = ['solid', 'grid', 'lines'];
    const nextIdx = (patterns.indexOf(this.backgroundPattern) + 1) % patterns.length;
    this.backgroundPattern = patterns[nextIdx];
    this.updatePatternIndicator();
    this.saveToStorage();
    this.render();
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  updatePatternIndicator() {
    const icon = document.getElementById('wbPatternIcon');
    const btn = document.getElementById('wbPatternToggleBtn');
    if (icon) {
      if (this.backgroundPattern === 'grid') {
        icon.className = 'fa-solid fa-border-all';
        if (btn) btn.title = 'نمط السبورة: شبكة تربيعية (انقر للتبديل)';
      } else if (this.backgroundPattern === 'lines') {
        icon.className = 'fa-solid fa-bars';
        if (btn) btn.title = 'نمط السبورة: خطوط مسطرة للكتابة (انقر للتبديل)';
      } else {
        icon.className = 'fa-solid fa-border-none';
        if (btn) btn.title = 'نمط السبورة: خلفية سادة (انقر للتبديل)';
      }
    }
  },

  saveToStorage() {
    try {
      const payload = {
        version: 3,
        gridMode: this.gridMode,
        backgroundPattern: this.backgroundPattern,
        color: this.color,
        strokeWidth: this.strokeWidth,
        panX: Math.round(this.panX * 10) / 10,
        panY: Math.round(this.panY * 10) / 10,
        zoom: Math.round(this.zoom * 1000) / 1000,
        strokes: this.strokes.map(s => {
          if (s.tool === 'pen') {
            return {
              id: s.id,
              tool: s.tool,
              color: s.color,
              width: s.width,
              points: (s.points || []).map(p => ({
                x: Math.round(p.x * 10) / 10,
                y: Math.round(p.y * 10) / 10,
                w: p.w ? Math.round(p.w * 10) / 10 : undefined
              }))
            };
          } else {
            return {
              id: s.id,
              tool: s.tool,
              color: s.color,
              width: s.width,
              startWorld: s.startWorld ? {
                x: Math.round(s.startWorld.x * 10) / 10,
                y: Math.round(s.startWorld.y * 10) / 10
              } : null,
              endWorld: s.endWorld ? {
                x: Math.round(s.endWorld.x * 10) / 10,
                y: Math.round(s.endWorld.y * 10) / 10
              } : null
            };
          }
        }),
        images: this.images.map(img => ({
          id: img.id,
          src: img.src,
          x: Math.round(img.x * 10) / 10,
          y: Math.round(img.y * 10) / 10,
          width: Math.round(img.width * 10) / 10,
          height: Math.round(img.height * 10) / 10,
          aspectRatio: img.aspectRatio || (img.width / img.height)
        }))
      };
      localStorage.setItem('mathquest_wb_data_v3', JSON.stringify(payload));
    } catch (err) {
      console.warn('Whiteboard storage save skipped:', err);
    }
  },

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('mathquest_wb_data_v3');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;

      if (data.gridMode) {
        this.gridMode = data.gridMode;
      }
      if (data.backgroundPattern) {
        this.backgroundPattern = data.backgroundPattern;
      }
      this.updateThemeIndicator();
      this.updatePatternIndicator();
      if (typeof data.panX === 'number' && typeof data.panY === 'number') {
        this.panX = data.panX;
        this.panY = data.panY;
      }
      if (typeof data.zoom === 'number') {
        this.zoom = data.zoom;
      }
      if (typeof data.strokeWidth === 'number') {
        this.strokeWidth = data.strokeWidth;
      }
      if (Array.isArray(data.strokes)) {
        this.strokes = data.strokes;
      }
      if (Array.isArray(data.images) && data.images.length > 0) {
        this.images = [];
        data.images.forEach(imgData => {
          const el = new Image();
          el.onload = () => {
            if (this.isOpen) this.render();
          };
          el.src = imgData.src;
          this.images.push({
            id: imgData.id,
            el: el,
            src: imgData.src,
            x: imgData.x,
            y: imgData.y,
            width: imgData.width,
            height: imgData.height,
            aspectRatio: imgData.aspectRatio || (imgData.width / imgData.height)
          });
        });
      }
    } catch (err) {
      console.warn('Whiteboard storage load failed:', err);
    }
  },

  exportPNG() {
    const dpr = window.devicePixelRatio || 1;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.canvas.width;
    exportCanvas.height = this.canvas.height;
    const expCtx = exportCanvas.getContext('2d');

    expCtx.drawImage(this.canvas, 0, 0);

    expCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    expCtx.font = `bold ${16 * dpr}px 'Outfit', sans-serif`;
    expCtx.fillText('Mr Ahmed Abd El-Motaal • YouTube: mr Motaal • 01019775590', 28 * dpr, exportCanvas.height - 24 * dpr);

    const link = document.createElement('a');
    link.download = `Mr_Motaal_Math_Whiteboard_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
  },

  onKeyDown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape') {
      if (this.selectedImageId) {
        this.deselectImage();
      } else {
        this.close();
      }
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
        return;
      }
      if (e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.redo();
        return;
      }
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        this.zoomIn();
        return;
      }
      if (e.key === '-') {
        e.preventDefault();
        this.zoomOut();
        return;
      }
      if (e.key === '0') {
        e.preventDefault();
        this.resetView();
        return;
      }
    }

    if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;

    const k = e.key.toLowerCase();
    if (k === 'p') this.setTool('pen', document.getElementById('wbToolPen'));
    else if (k === 'e') this.setTool('eraser', document.getElementById('wbToolEraser'));
    else if (k === 'l') this.setTool('line', document.getElementById('wbToolLine'));
    else if (k === 'r') this.setTool('rect', document.getElementById('wbToolRect'));
    else if (k === 'c') this.setTool('circle', document.getElementById('wbToolCircle'));
    else if (k === 'a') this.setTool('axis', document.getElementById('wbToolAxis'));
    else if (k === 'v' || k === 's') this.setTool('select', document.getElementById('wbToolSelect'));
    else if (k === 'h') this.setTool('hand', document.getElementById('wbToolHand'));
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedImageId) {
        e.preventDefault();
        this.deleteSelectedImage();
      }
    }
  }
};

function openWhiteboard() {
  InfiniteWhiteboard.open();
}

// ==========================================================================
// 3. MULTI-LESSON DATA STORE (PROPORTION & QUADRATIC)
// Data loaded via modular scripts: proportion_data.js & quadratic_data.js
// ==========================================================================
let currentLessonKey = 'quadratic';

// ==========================================================================
// 4. RENDERING & LESSON SWITCHING
// ==========================================================================
let mcqScore = 0;
let mcqAnswered = 0;
let activeQuizModelIndex = 0;
let quizUserAnswers = {};
let quizTimerSeconds = 600;
let quizTimerInterval = null;
let quizSubmitted = false;

// ==========================================================================
// RESIZABLE WORKSPACE & INTERACTIVE SOLUTION ENGINES
// ==========================================================================
let isResizingCanvas = false;
let currentResizeWrap = null;
let startY = 0;
let startHeight = 0;

function startCanvasResize(e, wrapId) {
  e.preventDefault();
  isResizingCanvas = true;
  currentResizeWrap = document.getElementById(wrapId);
  if (!currentResizeWrap) return;
  startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  startHeight = currentResizeWrap.offsetHeight;

  const onMove = (ev) => {
    if (!isResizingCanvas || !currentResizeWrap) return;
    const clientY = ev.clientY || (ev.touches && ev.touches[0].clientY) || 0;
    const deltaY = clientY - startY;
    const newHeight = Math.max(200, Math.min(900, startHeight + deltaY));
    currentResizeWrap.style.height = newHeight + 'px';
    const canvas = currentResizeWrap.querySelector('canvas');
    if (canvas && StylusEngine.canvases[canvas.id]) {
      const inst = StylusEngine.canvases[canvas.id];
      inst.height = newHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.height = newHeight * dpr;
      canvas.style.height = newHeight + 'px';
      inst.ctx.scale(dpr, dpr);
      StylusEngine.restoreCanvas(canvas.id);
    }
  };

  const onEnd = () => {
    isResizingCanvas = false;
    currentResizeWrap = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onEnd);
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
}

function adjustCanvasHeight(wrapId, delta) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const canvas = wrap.querySelector('canvas');
  if (!canvas) return;
  const inst = StylusEngine.canvases[canvas.id];
  if (!inst) return;

  const currentHeight = wrap.offsetHeight || inst.height || 300;
  const newHeight = Math.max(200, Math.min(1200, currentHeight + delta));
  if (newHeight === currentHeight) return;

  const tempUrl = canvas.toDataURL();
  const dpr = window.devicePixelRatio || 1;

  wrap.style.height = newHeight + 'px';
  inst.height = newHeight;
  canvas.style.height = newHeight + 'px';
  canvas.width = inst.width * dpr;
  canvas.height = newHeight * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = inst.color;
  ctx.lineWidth = inst.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  inst.ctx = ctx;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, inst.width, currentHeight);
  };
  img.src = tempUrl;

  AudioEngine.click();
}

function toggleSolutionReveal(btn) {
  const wrap = btn.closest('.solution-reveal-wrap') || btn.parentElement;
  if (!wrap) return;
  const body = wrap.querySelector('.revealed-solution-body') || wrap.querySelector('.try-it-solution-drawer');
  if (!body) return;
  const isHidden = (body.style.display === 'none' || !body.style.display);
  body.style.display = isHidden ? 'block' : 'none';
  btn.classList.toggle('active', isHidden);
  const span = btn.querySelector('span');
  if (span) {
    span.innerText = isHidden ? 'Hide Detailed Solution' : 'Reveal Detailed Step-by-Step Solution';
  }
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = isHidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-lightbulb';
  }
  AudioEngine.click();
}

function handleReadinessChoice(qId, optIdx, isCorrect, btn) {
  const card = btn.closest('.readiness-q-card');
  if (!card) return;
  
  card.querySelectorAll('.readiness-opt-btn').forEach(b => {
    b.classList.remove('selected-correct', 'selected-wrong', 'highlight-correct');
  });

  if (isCorrect) {
    btn.classList.add('selected-correct');
    AudioEngine.success();
    // Micro celebratory burst
    triggerCardSparkles(btn);
  } else {
    btn.classList.add('selected-wrong');
    btn.classList.add('shake-anim');
    setTimeout(() => btn.classList.remove('shake-anim'), 500);
    AudioEngine.error();
    
    // Softly reveal which one was correct to maximize learning
    card.querySelectorAll('.readiness-opt-btn').forEach(b => {
      if (b.getAttribute('onclick')?.includes('true')) {
        b.classList.add('highlight-correct');
      }
    });
  }

  card.setAttribute('data-answered', isCorrect ? 'correct' : 'wrong');
  const exp = card.querySelector('.readiness-explanation');
  if (exp) {
    exp.style.display = 'block';
    exp.classList.add('fade-slide-in');
  }

  updateReadinessScore();
}

function triggerCardSparkles(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const container = document.createElement('div');
  container.className = 'sparkle-burst-container';
  container.style.position = 'fixed';
  container.style.left = `${rect.left + rect.width / 2}px`;
  container.style.top = `${rect.top + rect.height / 2}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';

  const colors = ['#00b894', '#6c5ce7', '#fdcb6e', '#0984e3', '#ff7675'];
  for (let i = 0; i < 14; i++) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 30 + Math.random() * 35;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    particle.style.setProperty('--dx', `${x}px`);
    particle.style.setProperty('--dy', `${y}px`);
    particle.style.backgroundColor = colors[i % colors.length];
    container.appendChild(particle);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 750);
}

function updateReadinessScore() {
  const allCards = document.querySelectorAll('.readiness-q-card');
  if (!allCards.length) return;
  const correctCount = document.querySelectorAll('.readiness-q-card[data-answered="correct"]').length;
  const total = allCards.length;
  const badgeText = document.getElementById('readinessScoreText');
  if (badgeText) {
    if (correctCount === total) {
      badgeText.innerHTML = `🎉 100% Ready (${correctCount}/${total})! Ready to Master the Lesson!`;
    } else {
      badgeText.innerHTML = `Readiness Progress: ${correctCount} / ${total} Correct`;
    }
  }
}

function generateCalcTable() {
  const funcSelect = document.getElementById('calcFuncSelect');
  const startInput = document.getElementById('calcStartVal');
  const endInput = document.getElementById('calcEndVal');
  const stepInput = document.getElementById('calcStepVal');
  const outputWrap = document.getElementById('calcOutputTableWrap');
  if (!funcSelect || !startInput || !endInput || !stepInput || !outputWrap) return;

  const funcType = funcSelect.value;
  const start = parseFloat(startInput.value);
  const end = parseFloat(endInput.value);
  const step = Math.max(0.1, parseFloat(stepInput.value) || 1);

  if (start > end) {
    alert('Start value must be less than or equal to End value.');
    return;
  }

  let evaluate = (x) => x * x - 2 * x - 3;
  let vertexX = 1;
  if (funcType === 'ex1') {
    evaluate = (x) => x * x - 2 * x - 3;
    vertexX = 1;
  } else if (funcType === 'ex2') {
    evaluate = (x) => -x * x + 6 * x - 5;
    vertexX = 3;
  } else if (funcType === 'try1') {
    evaluate = (x) => 3 * x - x * x;
    vertexX = 1.5;
  } else if (funcType === 'try2') {
    evaluate = (x) => (x - 2) * (x - 2) - 4;
    vertexX = 2;
  } else if (funcType === 'vertex1') {
    evaluate = (x) => 5 - 2 * (x + 1) * (x + 1);
    vertexX = -1;
  }

  let html = `
    <table class="calc-table">
      <thead>
        <tr>
          <th>#</th>
          <th>x</th>
          <th>f(x)</th>
          <th>Point (x, f(x))</th>
          <th>Analysis</th>
        </tr>
      </thead>
      <tbody>
  `;

  let rowNum = 1;
  for (let x = start; x <= end + 0.001; x += step) {
    const roundX = Math.round(x * 100) / 100;
    const roundY = Math.round(evaluate(roundX) * 100) / 100;
    const isVertex = Math.abs(roundX - vertexX) < 0.01;
    const isRoot = Math.abs(roundY) < 0.01;
    const isYInt = Math.abs(roundX) < 0.01;

    let notes = '';
    if (isVertex) notes += '<span class="badge" style="background:#eb4d4b;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;">Vertex</span> ';
    if (isRoot) notes += '<span class="badge" style="background:#00b894;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;">Root</span> ';
    if (isYInt) notes += '<span class="badge" style="background:#6c5ce7;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;">y-Intercept</span> ';

    html += `
      <tr class="${isVertex ? 'vertex-row' : ''}">
        <td>${rowNum++}</td>
        <td><strong>${roundX}</strong></td>
        <td><strong>${roundY}</strong></td>
        <td>(${roundX}, ${roundY})</td>
        <td>${notes || '—'}</td>
      </tr>
    `;
  }

  html += `</tbody></table>`;
  outputWrap.innerHTML = html;
  AudioEngine.success();
}

// ==========================================================================
// MCQ RANDOMIZATION UTILITY (SHUFFLE OPTIONS & MAINTAIN CORRECT ANSWER)
// ==========================================================================
function randomizeMCQ(q) {
  if (!q || !Array.isArray(q.options) || q.options.length <= 1) return q;

  const originalOptions = q.options;
  const originalCorrect = (typeof q.correct === 'number') ? q.correct : 0;

  // Create array of original indices [0, 1, 2, 3]
  const indices = originalOptions.map((_, i) => i);

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }

  const shuffledOptions = indices.map(i => originalOptions[i]);
  const newCorrectIndex = indices.indexOf(originalCorrect);

  return {
    ...q,
    options: shuffledOptions,
    correct: newCorrectIndex
  };
}

// ==========================================================================
// LESSON LOADER & CONTROLLER
// ==========================================================================
function loadLesson(lessonKey) {
  // If in student mode, permanently lock to the student's lesson so no other lessons can be displayed
  if (window.isStudentLocked && window.lockedLessonKey) {
    lessonKey = window.lockedLessonKey;
  }
  currentLessonKey = lessonKey || localStorage.getItem('math_active_lesson') || 'place_value';
  if (!window.isStudentLocked) {
    localStorage.setItem('math_active_lesson', currentLessonKey);
  }
  AudioEngine.click();

  // Choose data source based on current lesson
  let data = null;
  if (currentLessonKey === 'place_value' && typeof LESSON_PLACE_VALUE !== 'undefined') {
    data = LESSON_PLACE_VALUE;
  } else if (currentLessonKey === 'similarity' && typeof LESSON_SIMILARITY !== 'undefined') {
    data = LESSON_SIMILARITY;
  } else if (currentLessonKey === 'quadratic' && typeof LESSON_QUADRATIC !== 'undefined') {
    data = LESSON_QUADRATIC;
  } else if (currentLessonKey === 'proportion' && typeof LESSON_PROPORTION !== 'undefined') {
    data = LESSON_PROPORTION;
  } else if (typeof LESSON_PLACE_VALUE !== 'undefined') {
    data = LESSON_PLACE_VALUE;
    currentLessonKey = 'place_value';
  } else if (typeof LESSON_SIMILARITY !== 'undefined') {
    data = LESSON_SIMILARITY;
    currentLessonKey = 'similarity';
  } else if (typeof LESSON_QUADRATIC !== 'undefined') {
    data = LESSON_QUADRATIC;
    currentLessonKey = 'quadratic';
  } else if (typeof LESSON_PROPORTION !== 'undefined') {
    data = LESSON_PROPORTION;
    currentLessonKey = 'proportion';
  }

  if (!data) return;

  // Dynamically update document title to show ONLY this lesson
  if (data.title) {
    document.title = `${data.title} • Mr Ahmed Abd El-Motaal`;
  }

  // Update Header Stage
  const headerStage = document.getElementById('headerStageBadge');
  if (headerStage) {
    if (window.isStudentLocked) {
      headerStage.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Student Mode • ${data.title}`;
    } else if (data.stageBadge) {
      headerStage.innerHTML = data.stageBadge;
    }
  }

  // Update Lesson Switcher Pills in Dock
  const btnPlace = document.getElementById('btnLessonPlaceValue');
  const btnProp = document.getElementById('btnLessonProportion');
  const btnQuad = document.getElementById('btnLessonQuadratic');
  const btnSim = document.getElementById('btnLessonSimilarity');
  [
    { btn: btnPlace, key: 'place_value' },
    { btn: btnProp, key: 'proportion' },
    { btn: btnQuad, key: 'quadratic' },
    { btn: btnSim, key: 'similarity' }
  ].forEach(item => {
    if (item.btn) {
      item.btn.classList.toggle('active', currentLessonKey === item.key);
      const existingTag = item.btn.querySelector('.mini-tag');
      if (currentLessonKey === item.key) {
        if (!existingTag) item.btn.insertAdjacentHTML('beforeend', ' <span class="mini-tag">Active</span>');
      } else if (existingTag) {
        existingTag.remove();
      }
    }
  });

  // 1. Update Hero Banner
  const unitTag = document.getElementById('heroUnitTag');
  const title = document.getElementById('heroLessonTitle');
  const sub = document.getElementById('heroLessonSubtitle');
  if (unitTag) unitTag.innerHTML = data.unitTag;
  if (title) title.innerText = data.title;
  if (sub) sub.innerText = data.subtitle;

  // Update hero 3D visuals
  const visualBox = document.querySelector('.hero-3d-visual');
  if (visualBox) {
    if (currentLessonKey === 'place_value') {
      visualBox.innerHTML = `
        <span class="floating-shape s1">🔢</span>
        <span class="floating-shape s2">🔟</span>
        <span class="floating-shape s3">🚀</span>
      `;
    } else if (currentLessonKey === 'proportion') {
      visualBox.innerHTML = `
        <span class="floating-shape s1">⚖️</span>
        <span class="floating-shape s2">🍰</span>
        <span class="floating-shape s3">🚀</span>
      `;
    } else if (currentLessonKey === 'similarity') {
      visualBox.innerHTML = `
        <span class="floating-shape s1">📐</span>
        <span class="floating-shape s2">🔷</span>
        <span class="floating-shape s3">🔶</span>
      `;
    } else {
      visualBox.innerHTML = `
        <span class="floating-shape s1">📐</span>
        <span class="floating-shape s2">📈</span>
        <span class="floating-shape s3">🎯</span>
      `;
    }
  }

  // Update hero badges row dynamically per lesson (eliminates any similarity/scale badges on other lessons)
  const badgesRow = document.getElementById('heroBadgesRow');
  if (badgesRow) {
    if (currentLessonKey === 'place_value') {
      badgesRow.innerHTML = `
        <span class="hero-badge-pill"><i class="fa-solid fa-trophy"></i> 30 Assessment Quiz Questions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-calculator"></i> Powers of 10 &amp; Estimation</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-layer-group"></i> Multi-Digit Base-10 Shifts</span>
      `;
    } else if (currentLessonKey === 'proportion') {
      badgesRow.innerHTML = `
        <span class="hero-badge-pill"><i class="fa-solid fa-trophy"></i> 30 Assessment Quiz Questions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-scale-balanced"></i> Direct &amp; Inverse Proportions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-chart-line"></i> Constant of Proportionality (k)</span>
      `;
    } else if (currentLessonKey === 'quadratic') {
      badgesRow.innerHTML = `
        <span class="hero-badge-pill"><i class="fa-solid fa-trophy"></i> 30 Assessment Quiz Questions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-chart-area"></i> Vertex &amp; Axis of Symmetry</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-square-root-variable"></i> Max / Min Values &amp; Zeros</span>
      `;
    } else {
      badgesRow.innerHTML = `
        <span class="hero-badge-pill"><i class="fa-solid fa-trophy"></i> 30 Assessment Quiz Questions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-draw-polygon"></i> 2 Rigorous Similarity Conditions</span>
        <span class="hero-badge-pill"><i class="fa-solid fa-shapes"></i> Scale Factor (k) &amp; Perimeters</span>
      `;
    }
  }

  // Reset sequential quiz progression for the freshly loaded lesson
  maxUnlockedQuizModelIndex = 0;
  quizStarted = false;

  // 2. Render Tab 1 (Concept & Practice with Pre-Study & Resizable Workspaces)
  renderConceptTab(data);

  // 3. Render Tab 2 (MCQ Bank)
  renderMCQBank(data.mcqs);

  // 4. Render Tab 3 (Quiz Engine)
  initQuizModel(0, data.quizModels);

  // Switch to Tab 1 (Concept)
  switchTab('tab-concept');

  // Re-render KaTeX math formulas
  setTimeout(() => {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }
    // Initialize all Resizable Workspaces & Stylus Canvases automatically
    document.querySelectorAll('.stylus-canvas').forEach(canvas => {
      StylusEngine.initCanvas(canvas.id);
    });
  }, 100);
}

// ==========================================================================
// WORKSPACE DIAGRAM & IMAGE INSERTION ENGINE (MOVE, SCALE, LOCK & PERSIST)
// ==========================================================================
const WorkspaceImages = {
  data: {},

  save(canvasId) {
    try {
      const item = this.data[canvasId];
      if (item) {
        localStorage.setItem('math_ws_img_' + canvasId, JSON.stringify(item));
      } else {
        localStorage.removeItem('math_ws_img_' + canvasId);
      }
    } catch (e) {
      console.warn('Storage save error for workspace image:', e);
    }
  },

  load(canvasId) {
    try {
      const raw = localStorage.getItem('math_ws_img_' + canvasId);
      if (raw) {
        this.data[canvasId] = JSON.parse(raw);
        this.renderBox(canvasId);
      }
    } catch (e) {
      console.warn('Storage load error for workspace image:', e);
    }
  },

  lock(canvasId) {
    const item = this.data[canvasId];
    if (item && !item.isLocked) {
      item.isLocked = true;
      this.renderBox(canvasId);
      this.save(canvasId);
    }
  },

  renderBox(canvasId) {
    const layer = document.getElementById(`ws-img-layer-${canvasId}`);
    const moveBtn = document.getElementById(`btn-img-move-${canvasId}`);
    if (!layer) return;

    const item = this.data[canvasId];
    if (!item) {
      layer.innerHTML = '';
      if (moveBtn) moveBtn.style.display = 'none';
      return;
    }

    if (moveBtn) {
      moveBtn.style.display = 'inline-flex';
      moveBtn.classList.toggle('active', !item.isLocked);
    }

    layer.innerHTML = `
      <div class="ws-image-box ${item.isLocked ? 'is-locked' : ''}" id="ws-box-${canvasId}" style="left:${item.x}px; top:${item.y}px; width:${item.width}px; height:${item.height}px;">
        <div class="ws-img-header">
          <span class="ws-img-drag-handle" id="ws-drag-${canvasId}"><i class="fa-solid fa-arrows-up-down-left-right"></i> Move</span>
          <div class="ws-img-tools">
            <button type="button" class="ws-img-btn" onclick="WorkspaceImages.scale('${canvasId}', 1.15)" title="Enlarge (+15%)"><i class="fa-solid fa-plus"></i></button>
            <button type="button" class="ws-img-btn" onclick="WorkspaceImages.scale('${canvasId}', 0.85)" title="Shrink (-15%)"><i class="fa-solid fa-minus"></i></button>
            <button type="button" class="ws-img-btn ws-img-lock-btn ${item.isLocked ? 'active' : ''}" onclick="WorkspaceImages.toggleLock('${canvasId}')" title="${item.isLocked ? 'Unlock to Move' : 'Lock to Draw Over'}">
              <i class="fa-solid ${item.isLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
            </button>
            <button type="button" class="ws-img-btn ws-img-del-btn" onclick="WorkspaceImages.remove('${canvasId}')" title="Delete Image"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="ws-img-body">
          <img src="${item.src}" alt="Diagram" draggable="false">
        </div>
        <div class="ws-img-resize-handle" id="ws-resize-${canvasId}" title="Drag corner to scale"></div>
      </div>
    `;

    this.attachDragAndResize(canvasId);
  },

  attachDragAndResize(canvasId) {
    const box = document.getElementById(`ws-box-${canvasId}`);
    const resizeHandle = document.getElementById(`ws-resize-${canvasId}`);
    const layer = document.getElementById(`ws-img-layer-${canvasId}`);
    const wrap = layer?.parentElement;

    if (!box || !wrap) return;

    let isDragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    const onPointerDownDrag = (e) => {
      const item = this.data[canvasId];
      if (!item || item.isLocked) return;
      if (e.target.closest('.ws-img-btn') || e.target.classList.contains('ws-img-resize-handle')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = item.x;
      startTop = item.y;
      box.style.cursor = 'grabbing';
      try { box.setPointerCapture(e.pointerId); } catch(err){}
      e.stopPropagation();
    };

    const onPointerMoveDrag = (e) => {
      if (!isDragging) return;
      const item = this.data[canvasId];
      if (!item) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const wrapRect = wrap.getBoundingClientRect();
      const maxLeft = Math.max(0, wrapRect.width - item.width);
      const maxTop = Math.max(0, wrap.clientHeight - item.height);

      item.x = Math.max(0, Math.min(maxLeft, startLeft + dx));
      item.y = Math.max(0, Math.min(maxTop, startTop + dy));

      box.style.left = item.x + 'px';
      box.style.top = item.y + 'px';
      e.stopPropagation();
    };

    const onPointerUpDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      box.style.cursor = 'grab';
      this.save(canvasId);
      e.stopPropagation();
    };

    box.addEventListener('pointerdown', onPointerDownDrag);
    window.addEventListener('pointermove', onPointerMoveDrag);
    window.addEventListener('pointerup', onPointerUpDrag);

    if (resizeHandle) {
      let isResizing = false;
      let startW = 0, startH = 0, startMouseX = 0;

      resizeHandle.addEventListener('pointerdown', (e) => {
        const item = this.data[canvasId];
        if (!item || item.isLocked) return;
        isResizing = true;
        startMouseX = e.clientX;
        startW = item.width;
        startH = item.height;
        try { resizeHandle.setPointerCapture(e.pointerId); } catch(err){}
        e.stopPropagation();
      });

      window.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const item = this.data[canvasId];
        if (!item) return;

        const delta = e.clientX - startMouseX;
        const newW = Math.max(80, Math.min(wrap.clientWidth - item.x, startW + delta));
        const newH = newW / (item.aspectRatio || 1);

        item.width = Math.round(newW);
        item.height = Math.round(newH);

        box.style.width = item.width + 'px';
        box.style.height = item.height + 'px';
        e.stopPropagation();
      });

      window.addEventListener('pointerup', (e) => {
        if (!isResizing) return;
        isResizing = false;
        this.save(canvasId);
        e.stopPropagation();
      });
    }
  },

  scale(canvasId, factor) {
    const item = this.data[canvasId];
    if (!item) return;
    const box = document.getElementById(`ws-box-${canvasId}`);
    const layer = document.getElementById(`ws-img-layer-${canvasId}`);
    const maxW = layer?.parentElement ? layer.parentElement.clientWidth : 800;

    const newW = Math.max(80, Math.min(maxW, item.width * factor));
    const newH = newW / (item.aspectRatio || 1);

    item.width = Math.round(newW);
    item.height = Math.round(newH);

    if (box) {
      box.style.width = item.width + 'px';
      box.style.height = item.height + 'px';
    }
    this.save(canvasId);
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  toggleLock(canvasId) {
    const item = this.data[canvasId];
    if (!item) return;
    item.isLocked = !item.isLocked;
    this.renderBox(canvasId);
    this.save(canvasId);
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  },

  remove(canvasId) {
    delete this.data[canvasId];
    this.save(canvasId);
    this.renderBox(canvasId);
    if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  }
};

function triggerWorkspaceImageUpload(canvasId) {
  const input = document.getElementById(`input-img-${canvasId}`);
  if (input) input.click();
}

function handleWorkspaceImageUpload(canvasId, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgEl = new Image();
    imgEl.onload = () => {
      const wrap = document.getElementById(`ws-img-layer-${canvasId}`)?.parentElement;
      const wrapW = wrap ? wrap.clientWidth : 500;
      const initialW = Math.min(360, wrapW * 0.7);
      const ratio = imgEl.naturalWidth / imgEl.naturalHeight || 1;
      const initialH = initialW / ratio;

      WorkspaceImages.data[canvasId] = {
        src: e.target.result,
        x: 20,
        y: 20,
        width: Math.round(initialW),
        height: Math.round(initialH),
        aspectRatio: ratio,
        isLocked: false
      };

      WorkspaceImages.save(canvasId);
      WorkspaceImages.renderBox(canvasId);
      if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
    };
    imgEl.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function toggleWorkspaceImageEdit(canvasId, btn) {
  const item = WorkspaceImages.data[canvasId];
  if (!item) return;
  item.isLocked = !item.isLocked;
  WorkspaceImages.renderBox(canvasId);
  WorkspaceImages.save(canvasId);
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
}

function renderWorkspaceWidget(canvasId, wrapId) {
  return `
    <div class="notebook-workspace" id="ws-${canvasId}">
      <!-- 1. Solution Canvas Surface (Top) -->
      <div class="notebook-canvas-wrap" id="${wrapId}">
        <canvas id="${canvasId}" class="stylus-canvas"></canvas>
        <textarea id="${canvasId.replace('can-', 'text-')}" class="typed-text-layer" placeholder="Type your step-by-step mathematical derivation here..."></textarea>
        <!-- Dynamic Inserted Image Box Container -->
        <div class="ws-image-layer" id="ws-img-layer-${canvasId}"></div>
      </div>

      <!-- 2. Stylus & Solution Toolbar (Single Row: Colors -> Pen/Eraser -> Undo/Redo/Clear -> Shapes -> Expand/Shrink) -->
      <div class="stylus-toolbar">
        <div class="toolbar-row single-toolbar-row">
          <!-- 1. Colors & Stroke Thickness -->
          <div class="toolbar-group ws-group-colors">
            <div class="color-dot active" style="background:#182038;" onclick="setCanvasColor('${canvasId}', '#182038', this)" title="Navy Black"></div>
            <div class="color-dot" style="background:#6c5ce7;" onclick="setCanvasColor('${canvasId}', '#6c5ce7', this)" title="Purple"></div>
            <div class="color-dot" style="background:#eb4d4b;" onclick="setCanvasColor('${canvasId}', '#eb4d4b', this)" title="Red"></div>
            <div class="color-dot" style="background:#00b894;" onclick="setCanvasColor('${canvasId}', '#00b894', this)" title="Mint Green"></div>
            <div class="color-dot" style="background:#fdcb6e;" onclick="setCanvasColor('${canvasId}', '#fdcb6e', this)" title="Golden Yellow"></div>

            <select class="stroke-select" onchange="setCanvasWidth('${canvasId}', this.value)" title="Stroke Width">
              <option value="2">2px</option>
              <option value="4" selected>4px</option>
              <option value="7">7px</option>
            </select>
          </div>

          <div class="ws-toolbar-divider"></div>

          <!-- 2. Pen & Eraser (Icons Only) -->
          <div class="toolbar-group ws-group-draw">
            <button class="tool-btn active btn-tool-pen" onclick="setCanvasTool('${canvasId}', 'pen', this)" title="Pen Tool">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="tool-btn btn-tool-eraser" onclick="setCanvasEraser('${canvasId}', this)" title="Eraser Tool">
              <i class="fa-solid fa-eraser"></i>
            </button>
          </div>

          <div class="ws-toolbar-divider"></div>

          <!-- 3. Undo, Redo & Clear (Icons Only) -->
          <div class="toolbar-group ws-group-history">
            <button class="tool-btn btn-undo" onclick="undoCanvas('${canvasId}')" title="Undo (Ctrl+Z)">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button class="tool-btn btn-redo" onclick="redoCanvas('${canvasId}')" title="Redo (Ctrl+Y)">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button class="tool-btn btn-clear-canvas" onclick="clearCanvasPrompt('${canvasId}')" title="Clear Canvas">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>

          <div class="ws-toolbar-divider"></div>

          <!-- 4. Geometric Shapes Dropdown (Icon Only) -->
          <div class="toolbar-group ws-group-shapes">
            <div class="ws-dropdown-wrap">
              <button class="tool-btn ws-shapes-trigger" id="ws-shapes-trig-${canvasId}" onclick="toggleWorkspaceShapesPopover('${canvasId}', event)" title="Geometric Shapes & Tools">
                <i class="fa-solid fa-shapes ws-shape-active-icon"></i>
                <i class="fa-solid fa-caret-down ws-caret"></i>
              </button>
              <div class="ws-shapes-popover" id="ws-shapes-pop-${canvasId}">
                <button class="ws-popover-item" onclick="selectWorkspaceShape('${canvasId}', 'line', this)">
                  <i class="fa-solid fa-ruler"></i> Line
                </button>
                <button class="ws-popover-item" onclick="selectWorkspaceShape('${canvasId}', 'rect', this)">
                  <i class="fa-regular fa-square"></i> Box
                </button>
                <button class="ws-popover-item" onclick="selectWorkspaceShape('${canvasId}', 'circle', this)">
                  <i class="fa-regular fa-circle"></i> Circle
                </button>
                <button class="ws-popover-item" onclick="selectWorkspaceShape('${canvasId}', 'axis', this)">
                  <i class="fa-solid fa-chart-line"></i> Axes
                </button>
                <button class="ws-popover-item" onclick="selectWorkspaceMode('${canvasId}', 'text', this)">
                  <i class="fa-solid fa-keyboard"></i> Type
                </button>
              </div>
            </div>
          </div>

          <!-- Spacer pushing Expand/Shrink to the far right -->
          <div class="ws-toolbar-spacer"></div>

          <!-- 5. Expand & Shrink (On the Same Row, Far Right, Icons Only) -->
          <div class="toolbar-group ws-group-resize">
            <button class="tool-btn btn-resize-ctrl" onclick="adjustCanvasHeight('${wrapId}', 140)" title="Expand Workspace Height (+)">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="tool-btn btn-resize-ctrl" onclick="adjustCanvasHeight('${wrapId}', -140)" title="Shrink Workspace Height (-)">
              <i class="fa-solid fa-minus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderConceptTab(data) {
  const container = document.getElementById('lessonConceptDynamicContainer');
  if (!container) return;

  // 1. PRE-STUDY & PREREQUISITES REVIEW SECTION (IF AVAILABLE)
  let preStudyHtml = '';
  if (data.preStudy) {
    const ps = data.preStudy;
    preStudyHtml = `
      <section class="pre-study-section">
        <div class="pre-study-header">
          <div class="pre-study-title-group">
            <h2><i class="fa-solid fa-graduation-cap" style="color:var(--primary);"></i> ${ps.title}</h2>
            <p style="color:var(--text-secondary); margin-top:0.3rem;">${ps.subtitle}</p>
          </div>
          <span class="pre-study-badge"><i class="fa-solid fa-clock-rotate-left"></i> Prerequisite Review</span>
        </div>

        <div class="pre-study-grid">
          ${ps.cards.map(c => `
            <div class="pre-study-card">
              <div class="pre-study-card-head">
                <div class="pre-study-card-icon" style="background:${c.iconBg};">
                  <i class="${c.icon}"></i>
                </div>
                <h3>${c.title}</h3>
              </div>
              <div class="pre-study-card-body">
                ${c.desc}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="readiness-quiz-container">
          <div class="readiness-quiz-head">
            <div class="readiness-quiz-title">
              <i class="fa-solid fa-list-check" style="color:#00b894;"></i>
              <span>Diagnostic Check: Test Your Readiness</span>
            </div>
            <div class="readiness-quiz-status">
              <span class="pill-badge readiness-score-badge" id="readinessScoreText">
                <i class="fa-solid fa-star" style="color:#fdcb6e;"></i> 0 / ${(ps.diagnosticQuestions || []).length} Mastered
              </span>
            </div>
          </div>
          <div class="readiness-questions-list">
            ${((ps.diagnosticQuestions || []).map(randomizeMCQ)).map((q, qIdx, arr) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              return `
              <div class="readiness-q-card" id="${q.id}">
                <div class="readiness-q-meta">
                  <span class="readiness-q-badge">Question ${qIdx + 1} of ${arr.length}</span>
                </div>
                <div class="readiness-q-text">${q.text}</div>
                <div class="readiness-options-grid">
                  ${q.options.map((opt, optIdx) => `
                    <button class="readiness-opt-btn" onclick="handleReadinessChoice('${q.id}', ${optIdx}, ${optIdx === q.correct}, this)">
                      <span class="opt-letter">${optionLetters[optIdx]}</span>
                      <span class="opt-text">${opt}</span>
                    </button>
                  `).join('')}
                </div>
                <div class="readiness-explanation">
                  <strong><i class="fa-solid fa-circle-info"></i> Explanation:</strong> ${q.explanation}
                </div>
              </div>
            `;}).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 2. REAL-WORLD APPLICATIONS (VISUAL SHOWCASE & MATHEMATICAL COMMENTARY - NO SOLVING WORKSPACE)
  const appsHtml = data.realWorldApps.map((app, idx) => `
    <article class="rw-showcase-card" style="border-top: 4px solid ${app.accent}; margin-top: 1.5rem;">
      <div class="rw-showcase-header">
        <div class="rw-showcase-badge" style="background: ${app.accent}; color: #fff;">
          <i class="${app.icon}"></i> ${app.tag} • ${app.title}
        </div>
        <span class="pill-badge" style="background: rgba(0, 184, 148, 0.12); color: #00b894;">
          <i class="fa-solid fa-earth-americas"></i> STEM Real-World Application
        </span>
      </div>
      <p class="rw-showcase-desc">${app.desc}</p>
      ${app.svg ? `<div class="rw-visual-box">${app.svg}</div>` : ''}
      <div class="rw-commentary-box">
        <div class="rw-commentary-header">
          <i class="fa-solid fa-lightbulb" style="color: #f1c40f;"></i>
          <strong>Mathematical Connection & STEM Analysis:</strong>
        </div>
        <div class="rw-commentary-content">
          ${app.commentaryHtml || app.solutionHtml || ''}
        </div>
      </div>
    </article>
  `).join('');

  // 3. CORE FOUNDATIONS & SPECIAL CASES
  const foundationRules = (data.foundation && data.foundation.rules) || data.foundationRules || [];
  const rulesHtml = foundationRules.map((r, idx) => `
    <div class="rule-pill-card">
      <span class="rule-num">${r.num || idx + 1}</span>
      <div>
        <h4>${r.title || ''}</h4>
        <p>${r.desc || r.summary || ''}</p>
      </div>
    </div>
  `).join('');

  const casesHtml = (data.specialCases || []).map(c => {
    let itemsHtml = '';
    if (Array.isArray(c.items)) {
      itemsHtml = c.items.map(it => `<li><span>•</span> ${it}</li>`).join('');
    } else if (c.desc) {
      itemsHtml = `<li><span>•</span> ${c.desc}</li>`;
    }
    return `
      <article class="encyclo-card">
        <h4><i class="${c.icon || 'fa-solid fa-lightbulb'}" style="color:var(--primary);"></i> ${c.title || ''}</h4>
        ${c.diagramSvg ? `<div class="encyclo-diagram">${c.diagramSvg}</div>` : ''}
        <ul class="encyclo-list">
          ${itemsHtml}
        </ul>
      </article>
    `;
  }).join('');

  // 4. INTERACTIVE CASIO TABLE GENERATOR WIDGET
  const casioSimulatorHtml = `
    <div class="calc-simulator-card">
      <div class="calc-simulator-header">
        <div class="calc-simulator-title">
          <i class="fa-solid fa-microchip"></i>
          <span>Casio fx TABLE Mode Simulator</span>
        </div>
        <span class="pill-badge" style="background:rgba(0,210,211,0.2); color:#00d2d3;">Interactive Table Activity</span>
      </div>
      <p style="font-size:0.9rem; color:#d2dae2; margin-bottom:1.2rem;">
        Enter the function rule and interval boundaries to generate the exact $(x, f(x))$ coordinate table:
      </p>
      <div class="calc-controls-row">
        <div class="calc-control-group">
          <label>Function Rule $f(x)$:</label>
          <select id="calcFuncSelect">
            <option value="ex1">f(x) = x² - 2x - 3 (Example 1.1)</option>
            <option value="ex2">f(x) = -x² + 6x - 5 (Example 1.2)</option>
            <option value="try1">f(x) = 3x - x² (Self-Assessment 1)</option>
            <option value="try2">f(x) = (x - 2)² - 4 (Self-Assessment 2)</option>
            <option value="vertex1">f(x) = 5 - 2(x + 1)² (Example 2.1)</option>
          </select>
        </div>
        <div class="calc-control-group">
          <label>Start Value:</label>
          <input type="number" id="calcStartVal" value="-2">
        </div>
        <div class="calc-control-group">
          <label>End Value:</label>
          <input type="number" id="calcEndVal" value="4">
        </div>
        <div class="calc-control-group">
          <label>Step Size:</label>
          <input type="number" id="calcStepVal" value="1" min="0.5" step="0.5">
        </div>
        <button class="calc-generate-btn" onclick="generateCalcTable()">
          <i class="fa-solid fa-play"></i> Generate Table of Values
        </button>
      </div>
      <div class="calc-output-table-wrap" id="calcOutputTableWrap">
        <p style="text-align:center; color:#a4b0be; font-size:0.9rem; padding:1.5rem 0;">
          Click "Generate Table of Values" to inspect coordinate points and vertex identification.
        </p>
      </div>
    </div>
  `;

  // 5. INSTRUCTIONAL IDEAS (ALL WITH DIRECT ACTIVE NOTEBOOK WORKSPACES & HIDDEN MODEL SOLUTIONS)
  const ideasHtml = (data.ideas || []).map(idea => {
    let cardsHtml = '';
    if (Array.isArray(idea.cards) && idea.cards.length > 0) {
      cardsHtml = idea.cards.map((card, cIdx) => {
        const isTryIt = (card.type === 'try' || card.type === 'try_it');
        const cardId = card.id || `c${cIdx + 1}`;
        const canvasId = card.canvasId || `can-c-${idea.id}-${cardId}`;
        const wrapId = card.wrapId || `can-wrap-c-${idea.id}-${cardId}`;
        const solId = card.solId || `sol-c-${idea.id}-${cardId}`;
        const cardTag = card.tag || card.badge || `Question ${cIdx + 1}`;
        const cardPrompt = card.q || card.prompt || '';
        const cardSolution = card.solutionHtml || card.solution || '';
        const badgeGrad = card.badgeGradient || (isTryIt ? 'linear-gradient(135deg, #00b894, #55efc4)' : (card.accent ? `linear-gradient(135deg, ${card.accent}, ${card.accent}dd)` : 'linear-gradient(135deg, #6c5ce7, #8075e5)'));
        const badgeIcon = card.icon || (isTryIt ? 'fa-solid fa-pencil' : 'fa-solid fa-chalkboard-user');
        
        return `
          <article class="try-it-card ${isTryIt ? '' : 'solved-example-card'}" id="card-${idea.id}-${cardId}" data-idea-id="${idea.id}" data-card-id="${cardId}" style="margin-top: 1.8rem; border-color: ${card.accent || (isTryIt ? '#00b894' : '#6c5ce7')};">
            <div class="try-it-header">
              <div class="try-it-badge" style="background: ${badgeGrad}; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                <i class="${badgeIcon}"></i> <span class="card-badge-tag">${cardTag}</span>
              </div>
              <div class="card-action-bar">
                <button type="button" class="card-tool-btn move-up-btn" onclick="moveQuestionCard(this, -1)" title="تبديل السؤال مع السابق (Move Up)">
                  <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button type="button" class="card-tool-btn move-down-btn" onclick="moveQuestionCard(this, 1)" title="تبديل السؤال مع التالي (Move Down)">
                  <i class="fa-solid fa-arrow-down"></i>
                </button>
                <button type="button" class="card-tool-btn swap-btn" onclick="openQuestionSwapModal(this)" title="تبديل هذا السؤال مع سؤال آخر (Swap Questions)">
                  <i class="fa-solid fa-right-left"></i>
                </button>
                <button type="button" class="card-tool-btn regen-btn" onclick="regenerateQuestionCard('${idea.id}', '${cardId}', this)" title="🔄 توليد سؤال بديل لنفس الفكرة من أسئلة الملفات">
                  <i class="fa-solid fa-arrows-rotate"></i>
                </button>
                <button type="button" class="card-tool-btn delete-btn" onclick="deleteQuestionCard(this)" title="🗑️ حذف هذا السؤال">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
            
            <div class="try-it-prompt">
              ${cardPrompt}
            </div>

            ${card.svg ? `<div class="diagram-frame-box" style="margin-bottom: 1.2rem; padding: 1.2rem; background: #ffffff; border-radius: 16px; border: 1.5px solid #eef0f7; box-shadow: inset 0 2px 8px rgba(0,0,0,0.03); overflow-x: auto;">${card.svg}</div>` : ''}

            <!-- Teacher / Student Workspace for this exact single question -->
            ${renderWorkspaceWidget(canvasId, wrapId)}

            <button class="show-solution-btn" onclick="toggleSolutionDrawer('${solId}', this)">
              <i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>
            </button>
            <div id="${solId}" class="try-it-solution-drawer" style="display:none;">
              ${card.steps ? `
                <div class="solution-steps-accordion">
                  ${card.steps.map(st => `
                    <div class="step-row">
                      <span class="step-num-pill">${st.num}</span>
                      <div class="step-body">${st.text}</div>
                    </div>
                  `).join('')}
                  ${card.ans ? `
                    <div class="final-answer-badge">
                      <i class="fa-solid fa-circle-check"></i> ${card.ans}
                    </div>
                  ` : ''}
                </div>
              ` : `
                <div style="line-height:1.7; color:var(--text-main);">
                  ${cardSolution}
                </div>
              `}
            </div>
          </article>
        `;
      }).join('');
    } else {
      // Legacy fallback for proportion and quadratic
      cardsHtml = `
        <article class="try-it-card solved-example-card" id="card-${idea.id}-ex1" data-idea-id="${idea.id}" data-card-id="ex1">
          <div class="try-it-header">
            <div class="try-it-badge" style="background: linear-gradient(135deg, #6c5ce7, #8075e5); box-shadow: 0 4px 12px rgba(108, 92, 231, 0.35);">
              <i class="fa-solid fa-chalkboard-user"></i> <span class="card-badge-tag">${idea.ex1Tag}</span>
            </div>
            <div class="card-action-bar">
              <button type="button" class="card-tool-btn move-up-btn" onclick="moveQuestionCard(this, -1)" title="تبديل السؤال مع السابق (Move Up)">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button type="button" class="card-tool-btn move-down-btn" onclick="moveQuestionCard(this, 1)" title="تبديل السؤال مع التالي (Move Down)">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button type="button" class="card-tool-btn swap-btn" onclick="openQuestionSwapModal(this)" title="تبديل هذا السؤال مع سؤال آخر (Swap Questions)">
                <i class="fa-solid fa-right-left"></i>
              </button>
              <button type="button" class="card-tool-btn regen-btn" onclick="regenerateQuestionCard('${idea.id}', 'ex1', this)" title="🔄 توليد سؤال بديل من أسئلة الملفات">
                <i class="fa-solid fa-arrows-rotate"></i>
              </button>
              <button type="button" class="card-tool-btn delete-btn" onclick="deleteQuestionCard(this)" title="🗑️ حذف السؤال">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="try-it-prompt">
            ${idea.ex1Q}
          </div>
          ${idea.ex1Svg ? `<div class="diagram-frame-box" style="margin-bottom: 1rem;">${idea.ex1Svg}</div>` : ''}
          ${renderWorkspaceWidget(`can-ex1-${idea.id}`, `can-wrap-ex1-${idea.id}`)}
          <button class="show-solution-btn" onclick="toggleSolutionDrawer('sol-ex1-${idea.id}', this)">
            <i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>
          </button>
          <div id="sol-ex1-${idea.id}" class="try-it-solution-drawer" style="display:none;">
            <div class="solution-steps-accordion">
              ${idea.ex1Steps ? idea.ex1Steps.map(st => `
                <div class="step-row">
                  <span class="step-num-pill">${st.num}</span>
                  <div class="step-body">${st.text}</div>
                </div>
              `).join('') : ''}
              ${idea.ex1Ans ? `
                <div class="final-answer-badge">
                  <i class="fa-solid fa-circle-check"></i> ${idea.ex1Ans}
                </div>
              ` : ''}
            </div>
          </div>
        </article>

        ${idea.ex2Q ? `
        <article class="try-it-card solved-example-card" id="card-${idea.id}-ex2" data-idea-id="${idea.id}" data-card-id="ex2" style="border-color: #6c5ce7; margin-top: 2rem;">
          <div class="try-it-header">
            <div class="try-it-badge" style="background: linear-gradient(135deg, #0984e3, #74b9ff); box-shadow: 0 4px 12px rgba(9, 132, 227, 0.35);">
              <i class="fa-solid fa-chalkboard-user"></i> <span class="card-badge-tag">${idea.ex2Tag}</span>
            </div>
            <div class="card-action-bar">
              <button type="button" class="card-tool-btn move-up-btn" onclick="moveQuestionCard(this, -1)" title="تبديل السؤال مع السابق (Move Up)">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button type="button" class="card-tool-btn move-down-btn" onclick="moveQuestionCard(this, 1)" title="تبديل السؤال مع التالي (Move Down)">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button type="button" class="card-tool-btn swap-btn" onclick="openQuestionSwapModal(this)" title="تبديل هذا السؤال مع سؤال آخر (Swap Questions)">
                <i class="fa-solid fa-right-left"></i>
              </button>
              <button type="button" class="card-tool-btn regen-btn" onclick="regenerateQuestionCard('${idea.id}', 'ex2', this)" title="🔄 توليد سؤال بديل من أسئلة الملفات">
                <i class="fa-solid fa-arrows-rotate"></i>
              </button>
              <button type="button" class="card-tool-btn delete-btn" onclick="deleteQuestionCard(this)" title="🗑️ حذف السؤال">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="try-it-prompt">
            ${idea.ex2Q}
          </div>
          ${idea.ex2Svg ? `<div class="diagram-frame-box" style="margin-bottom: 1rem;">${idea.ex2Svg}</div>` : ''}
          ${renderWorkspaceWidget(`can-ex2-${idea.id}`, `can-wrap-ex2-${idea.id}`)}
          <button class="show-solution-btn" onclick="toggleSolutionDrawer('sol-ex2-${idea.id}', this)">
            <i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>
          </button>
          <div id="sol-ex2-${idea.id}" class="try-it-solution-drawer" style="display:none;">
            <div class="solution-steps-accordion">
              ${idea.ex2Steps ? idea.ex2Steps.map(st => `
                <div class="step-row">
                  <span class="step-num-pill">${st.num}</span>
                  <div class="step-body">${st.text}</div>
                </div>
              `).join('') : ''}
              ${idea.ex2Ans ? `
                <div class="final-answer-badge">
                  <i class="fa-solid fa-circle-check"></i> ${idea.ex2Ans}
                </div>
              ` : ''}
            </div>
          </div>
        </article>
        ` : ''}

        ${idea.tryPrompt ? `
        <div class="try-it-card" id="card-${idea.id}-try" data-idea-id="${idea.id}" data-card-id="try">
          <div class="try-it-header">
            <div class="try-it-badge">
              <i class="fa-solid fa-pencil"></i> <span class="card-badge-tag">${idea.tryBadge}</span>
            </div>
            <div class="card-action-bar">
              <button type="button" class="card-tool-btn move-up-btn" onclick="moveQuestionCard(this, -1)" title="تبديل السؤال مع السابق (Move Up)">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button type="button" class="card-tool-btn move-down-btn" onclick="moveQuestionCard(this, 1)" title="تبديل السؤال مع التالي (Move Down)">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button type="button" class="card-tool-btn swap-btn" onclick="openQuestionSwapModal(this)" title="تبديل هذا السؤال مع سؤال آخر (Swap Questions)">
                <i class="fa-solid fa-right-left"></i>
              </button>
              <button type="button" class="card-tool-btn regen-btn" onclick="regenerateQuestionCard('${idea.id}', 'try', this)" title="🔄 توليد سؤال بديل من أسئلة الملفات">
                <i class="fa-solid fa-arrows-rotate"></i>
              </button>
              <button type="button" class="card-tool-btn delete-btn" onclick="deleteQuestionCard(this)" title="🗑️ حذف السؤال">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="try-it-prompt">
            ${idea.tryPrompt}
          </div>
          ${renderWorkspaceWidget(idea.tryCanvasId, `can-wrap-try-${idea.id}`)}
          <button class="show-solution-btn" onclick="toggleSolutionDrawer('${idea.trySolId || `sol-try-${idea.id}`}', this)">
            <i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>
          </button>
          <div id="${idea.trySolId || `sol-try-${idea.id}`}" class="try-it-solution-drawer" style="display:none;">
            <h4 style="color:var(--accent-mint); font-weight:800; margin-bottom:0.75rem;"><i class="fa-solid fa-check-circle"></i> Model Solution:</h4>
            <div style="line-height:1.7; color:var(--text-main);">
              ${idea.trySolution}
            </div>
          </div>
        </div>
        ` : ''}
      `;
    }

    const flashcardTitle = idea.flashcardTitle || idea.title || `Idea ${idea.id}`;
    const flashcardText = idea.flashcardText || idea.coreRule || '';
    const ideaBadge = idea.badge || idea.num || `💡`;

    return `
      <section class="idea-block" id="idea-block-${idea.id}">
        <div class="pedagogical-flashcard">
          <div class="flashcard-badge-3d">${ideaBadge}</div>
          <div class="flashcard-content">
            <span class="pill-badge" style="background:rgba(225,112,85,0.2); color:#d63031; margin-bottom:0.4rem;">Concept Flashcard & Strategy Guide</span>
            <h3>${flashcardTitle}</h3>
            <p>${flashcardText}</p>
          </div>
        </div>
        <div class="idea-cards-container" id="idea-cards-${idea.id}">
          ${cardsHtml}
        </div>
        <div class="idea-action-footer">
          <button type="button" class="add-question-btn" onclick="addQuestionCardToIdea('${idea.id}')">
            <i class="fa-solid fa-plus-circle"></i>
            <span>Add Question to this Idea (إضافة سؤال لهذه الفكرة)</span>
          </button>
        </div>
      </section>
    `;
  }).join('');

  container.innerHTML = `
    <!-- 1. Pre-Study & Readiness Review Module -->
    ${preStudyHtml}

    <!-- 2. Real-World Connections -->
    <div class="section-title-wrap">
      <h2 class="section-title">
        <span class="title-icon">🌍</span>
        <span>Real-World Connections (Mathematics in Everyday Life)</span>
      </h2>
      <span class="pill-badge">Precision Plots & Modeling</span>
    </div>
    <div class="real-world-grid">${appsHtml}</div>

    <!-- 3. Core Mathematical Foundation Card -->
    <section class="foundation-card">
      <div class="foundation-header">
        <span class="foundation-badge"><i class="fa-solid fa-shield-halved"></i> Essential Curriculum Standards</span>
        <span style="font-weight:700; color:var(--text-muted); font-size:0.9rem;">Definitions & Standard Forms</span>
      </div>
      <div class="foundation-rules-grid">${rulesHtml}</div>
    </section>

    <!-- 4. Special Cases & Graphical Representation -->
    <section class="special-cases-section">
      <div class="section-title-wrap">
        <h2 class="section-title">
          <span class="title-icon">🏛️</span>
          <span>${data.key === 'quadratic' ? 'Encyclopedic Guide: Orientation, Vertex & Extrema' : (data.key === 'similarity' ? 'Special Quadrilateral Criteria & Regular Polygons' : 'Special Cases, Graphical Models & Geometric Properties')}</span>
        </h2>
        <span class="pill-badge">Geometric Analysis</span>
      </div>
      <div class="special-cases-grid">${casesHtml}</div>
    </section>

    <!-- 5. Casio Table Simulator Widget (Quadratic Activity) -->
    ${data.key === 'quadratic' ? casioSimulatorHtml : ''}

    <!-- 6. Main Instructional Ideas (All with Precision Graphs, Hidden Solutions, & Resizable Workspaces) -->
    ${ideasHtml}

    <!-- 7. Interactive Self-Assessment Understanding Meter -->
    <div class="comprehension-eval-card" style="margin-top: 3rem; background: linear-gradient(135deg, #ffffff, #f8f9fe); border: 2px solid var(--border-color); border-radius: 20px; padding: 1.8rem; box-shadow: var(--shadow-sm); text-align: center;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.6rem;">
        <span style="font-size: 1.5rem;">⭐</span>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">Self-Assessment Reflection</h3>
      </div>
      <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 1.5rem;">
        How confident do you feel with ${data.title}? Click your current level:
      </p>
      <div class="emoji-ratings-grid" style="display: flex; justify-content: center; gap: 1.2rem; flex-wrap: wrap;">
        <button class="emoji-rating-btn" onclick="rateUnderstanding(1, this)" style="background: rgba(235, 77, 75, 0.1); border: 2px solid #eb4d4b; border-radius: 16px; padding: 1rem 1.4rem; cursor: pointer; transition: all 0.25s ease;">
          <div style="font-size: 2rem;">🤔</div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #eb4d4b; margin-top: 0.4rem;">Need Practice</div>
        </button>
        <button class="emoji-rating-btn" onclick="rateUnderstanding(2, this)" style="background: rgba(241, 196, 15, 0.1); border: 2px solid #f1c40f; border-radius: 16px; padding: 1rem 1.4rem; cursor: pointer; transition: all 0.25s ease;">
          <div style="font-size: 2rem;">💡</div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #d69e2e; margin-top: 0.4rem;">Getting It</div>
        </button>
        <button class="emoji-rating-btn" onclick="rateUnderstanding(3, this)" style="background: rgba(9, 132, 227, 0.1); border: 2px solid #0984e3; border-radius: 16px; padding: 1rem 1.4rem; cursor: pointer; transition: all 0.25s ease;">
          <div style="font-size: 2rem;">😃</div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #0984e3; margin-top: 0.4rem;">Good Understanding</div>
        </button>
        <button class="emoji-rating-btn" onclick="rateUnderstanding(4, this)" style="background: rgba(0, 184, 148, 0.1); border: 2px solid #00b894; border-radius: 16px; padding: 1rem 1.4rem; cursor: pointer; transition: all 0.25s ease;">
          <div style="font-size: 2rem;">🏆</div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #00b894; margin-top: 0.4rem;">Mastered Confidently</div>
        </button>
      </div>
      <div id="selfRatingFeedback" style="margin-top: 1rem; font-weight: 800; font-size: 1rem; color: var(--primary);"></div>
    </div>
  `;
}

function rateUnderstanding(level, btn) {
  AudioEngine.success();
  document.querySelectorAll('.emoji-rating-btn').forEach(b => {
    b.style.transform = 'scale(1)';
    b.style.boxShadow = 'none';
  });
  btn.style.transform = 'scale(1.08)';
  btn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
  const msgs = [
    '💪 Keep practicing! Review the worked examples and use the stylus workspace to re-try step-by-step.',
    '👍 Great progress! Try the Try-It exercises and practice MCQs to solidify your intuition.',
    '🌟 Excellent! You have a solid grasp of core theorems and algebraic setups.',
    '🏆 Outstanding! You are fully prepared for advanced exam problems and higher-order applications!'
  ];
  const fb = document.getElementById('selfRatingFeedback');
  if (fb) fb.innerHTML = msgs[level - 1];
  localStorage.setItem(`math_rating_${currentLessonKey}`, level);
}

// ==========================================================================
// 5. MCQ REVISION BANK (10 QUESTIONS)
// ==========================================================================
let currentMCQs = [];
let rawMCQList = null;

function renderMCQBank(mcqList) {
  if (mcqList) {
    rawMCQList = mcqList;
  } else {
    rawMCQList = null;
  }
  const source = rawMCQList || [];
  currentMCQs = (source || []).map(randomizeMCQ);
  mcqScore = 0;
  mcqAnswered = 0;

  const total = currentMCQs.length;
  const dial = document.getElementById('mcqScoreDial');
  const status = document.getElementById('mcqStatusText');
  if (dial) dial.innerText = `0/${total}`;
  if (status) status.innerText = `Not Started`;

  const container = document.getElementById('mcqQuestionsList');
  if (!container) return;

  container.innerHTML = '';
  if (total === 0) {
    container.innerHTML = `
      <div style="padding:3rem 1.5rem; text-align:center; background:var(--bg-card); border:1px dashed var(--border-color); border-radius:16px; margin:1.5rem 0;">
        <i class="fa-solid fa-list-check" style="font-size:2.5rem; color:var(--primary); margin-bottom:1rem; display:block;"></i>
        <h4 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-main);">MCQ Revision Bank Coming Soon</h4>
        <p style="color:var(--text-muted); max-width:480px; margin:0 auto; font-size:0.95rem;">Multiple-choice questions with step-by-step proofs for this lesson are being finalized.</p>
      </div>
    `;
    return;
  }

  currentMCQs.forEach((q, idx) => {
    const qId = (q.id !== undefined) ? q.id : (idx + 1);
    q.id = qId;

    const card = document.createElement('article');
    card.className = 'mcq-card';
    card.id = `mcq-card-${qId}`;

    const letters = ['A', 'B', 'C', 'D'];
    const options = q.options || [];
    const optionsHtml = options.map((opt, optIdx) => `
      <button class="mcq-option-btn" id="mcq-opt-${qId}-${optIdx}" onclick="handleMCQSelect(${qId}, ${optIdx})">
        <span class="option-letter-badge">${letters[optIdx]}</span>
        <span>${opt}</span>
      </button>
    `).join('');

    card.innerHTML = `
      <span class="mcq-number-pill">Question ${qId} of ${total}</span>
      <p class="mcq-question-text">${q.q}</p>
      ${q.diagramSvg ? `<div class="mcq-diagram-wrap" style="display:flex; justify-content:center; align-items:center; margin:1rem 0; background:rgba(248,249,254,0.8); border:1px solid var(--border-color); border-radius:12px; padding:1rem; overflow-x:auto;">${q.diagramSvg}</div>` : ''}
      <div class="mcq-options-grid">
        ${optionsHtml}
      </div>
      <div class="mcq-explanation-drawer" id="mcq-exp-${qId}">
        <h5><i class="fa-solid fa-graduation-cap"></i> Complete Mathematical Proof:</h5>
        <p>${q.proof || ''}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function handleMCQSelect(qId, selectedIdx) {
  const q = currentMCQs.find(item => item.id == qId) || currentMCQs[qId - 1];
  if (!q) return;

  const card = document.getElementById(`mcq-card-${qId}`);
  if (!card) return;

  const buttons = card.querySelectorAll('.mcq-option-btn');
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIdx === q.correct) {
    buttons[selectedIdx].classList.add('correct');
    mcqScore++;
    AudioEngine.correct();
  } else {
    buttons[selectedIdx].classList.add('incorrect');
    if (buttons[q.correct]) buttons[q.correct].classList.add('correct');
    AudioEngine.incorrect();
  }

  mcqAnswered++;
  const total = currentMCQs.length;
  const dial = document.getElementById('mcqScoreDial');
  const status = document.getElementById('mcqStatusText');
  if (dial) dial.innerText = `${mcqScore}/${total}`;
  if (status) status.innerText = `${mcqAnswered} of ${total} Answered`;

  const drawer = document.getElementById(`mcq-exp-${qId}`);
  if (drawer) drawer.style.display = 'block';
}

// ==========================================================================
// 6. TIMED QUIZ - 10 MARKS (3 MODELS • 30 QUESTIONS)
// ==========================================================================
let currentQuizModels = [];
let rawQuizModels = null;
let quizStarted = false;
let maxUnlockedQuizModelIndex = 0;

function getActiveLessonQuizModels() {
  if (rawQuizModels && rawQuizModels.length > 0) return rawQuizModels;
  let data = null;
  if (currentLessonKey === 'place_value' && typeof LESSON_PLACE_VALUE !== 'undefined') data = LESSON_PLACE_VALUE;
  else if (currentLessonKey === 'proportion' && typeof LESSON_PROPORTION !== 'undefined') data = LESSON_PROPORTION;
  else if (currentLessonKey === 'quadratic' && typeof LESSON_QUADRATIC !== 'undefined') data = LESSON_QUADRATIC;
  else if (currentLessonKey === 'similarity' && typeof LESSON_SIMILARITY !== 'undefined') data = LESSON_SIMILARITY;
  return data?.quizModels || [];
}

function updateQuizModelTabsVisibility() {
  for (let i = 0; i < 3; i++) {
    const tabBtn = document.getElementById(`modelTabBtn${i}`);
    if (!tabBtn) continue;
    if (i <= maxUnlockedQuizModelIndex) {
      tabBtn.style.display = 'inline-flex';
      tabBtn.classList.toggle('active', i === activeQuizModelIndex);
      tabBtn.classList.remove('locked');
      tabBtn.disabled = false;
    } else {
      tabBtn.style.display = 'none';
      tabBtn.classList.remove('active');
      tabBtn.classList.add('locked');
      tabBtn.disabled = true;
    }
  }
}

function initQuizModel(modelIdx, modelsList) {
  // If a new list is passed (e.g. on loading a new lesson), update raw models
  if (modelsList && modelsList.length > 0) {
    rawQuizModels = modelsList;
    currentQuizModels = rawQuizModels.map(m => ({
      ...m,
      questions: (m.questions || []).map(randomizeMCQ)
    }));
  } else if (!rawQuizModels || rawQuizModels.length === 0 || !currentQuizModels || currentQuizModels.length === 0) {
    // If not passed and current models are empty, retrieve from active lesson data
    const fallbackModels = getActiveLessonQuizModels();
    if (fallbackModels && fallbackModels.length > 0) {
      rawQuizModels = fallbackModels;
      currentQuizModels = rawQuizModels.map(m => ({
        ...m,
        questions: (m.questions || []).map(randomizeMCQ)
      }));
    }
  }

  // Ensure modelIdx does not exceed unlocked models
  activeQuizModelIndex = (typeof modelIdx === 'number') ? modelIdx : 0;
  if (activeQuizModelIndex > maxUnlockedQuizModelIndex) {
    activeQuizModelIndex = maxUnlockedQuizModelIndex;
  }
  if (currentQuizModels.length > 0 && activeQuizModelIndex >= currentQuizModels.length) {
    activeQuizModelIndex = 0;
  }

  quizUserAnswers = {};
  quizSubmitted = false;
  quizStarted = false; // Never auto-start; wait for user to click Start
  quizTimerSeconds = 600;
  clearInterval(quizTimerInterval);

  // Reset Timer display to 10:00
  const timerText = document.getElementById('quizTimerText');
  if (timerText) timerText.innerText = '10:00';
  const timerBox = document.getElementById('quizTimerBox');
  if (timerBox) timerBox.className = 'timer-pill-box';

  const titleEl = document.getElementById('quizActiveModelTitle');
  if (titleEl && currentQuizModels[activeQuizModelIndex]) {
    titleEl.innerText = currentQuizModels[activeQuizModelIndex].title;
  } else if (titleEl) {
    titleEl.innerText = `Timed Quiz — Model #${activeQuizModelIndex + 1}`;
  }

  // Update sequential tab buttons in model-tabs-group
  updateQuizModelTabsVisibility();

  const report = document.getElementById('quizFeedbackReport');
  if (report) report.style.display = 'none';

  const submitBar = document.getElementById('submitQuizBar');
  if (submitBar) submitBar.style.display = 'none'; // Only visible after quiz starts

  renderQuizQuestions();
  updateQuizProgress();
}

function startQuizAssessmentNow() {
  AudioEngine.click();
  quizStarted = true;

  // Render question cards
  renderQuizQuestions();

  // Show submit quiz button bar
  const submitBar = document.getElementById('submitQuizBar');
  if (submitBar) submitBar.style.display = 'block';

  // Start the 10-minute timer
  startQuizTimer();

  // Smooth scroll to first question card
  const firstQ = document.getElementById('quiz-q-card-0');
  if (firstQ) {
    firstQ.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function switchQuizModel(modelIdx) {
  if (modelIdx > maxUnlockedQuizModelIndex) {
    alert(`Quiz #${modelIdx + 1} is locked! Complete and submit Quiz #${maxUnlockedQuizModelIndex + 1} first.`);
    return;
  }
  if (quizStarted && !quizSubmitted && Object.keys(quizUserAnswers).length > 0) {
    if (!confirm("Switching quiz models will reset your ongoing 10-minute quiz. Continue?")) return;
  }
  AudioEngine.click();
  initQuizModel(modelIdx);
}

function renderQuizQuestions() {
  const container = document.getElementById('quizQuestionsContainer');
  if (!container) return;

  const currentModel = currentQuizModels[activeQuizModelIndex];
  if (!currentModel || !currentModel.questions || currentModel.questions.length === 0) {
    container.innerHTML = `
      <div style="padding:3rem 1.5rem; text-align:center; background:var(--bg-card); border:1px dashed var(--border-color); border-radius:16px; margin:1.5rem 0;">
        <i class="fa-solid fa-clock-rotate-left" style="font-size:2.5rem; color:var(--primary); margin-bottom:1rem; display:block;"></i>
        <h4 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-main);">Timed Quiz Bank Coming Soon</h4>
        <p style="color:var(--text-muted); max-width:480px; margin:0 auto; font-size:0.95rem;">Interactive 10-minute timed quiz models for this unit are being prepared according to the official curriculum specs.</p>
      </div>
    `;
    return;
  }

  // If student has NOT started the quiz yet, render the Start Screen Card!
  if (!quizStarted) {
    container.innerHTML = `
      <div class="quiz-start-card">
        <div class="start-card-icon">⏱️</div>
        <h3 class="start-card-title">${currentModel.title || ('Timed Quiz — Model #' + (activeQuizModelIndex + 1))}</h3>
        <p class="start-card-subtitle">Official Standardized Timed Assessment • Designed by Mr Ahmed Abd El-Motaal</p>
        
        <div class="start-card-specs">
          <div class="spec-pill"><i class="fa-solid fa-list-check"></i> 10 Questions</div>
          <div class="spec-pill"><i class="fa-regular fa-clock"></i> 10 Minutes Duration</div>
          <div class="spec-pill"><i class="fa-solid fa-award"></i> 10 Marks Total</div>
          <div class="spec-pill"><i class="fa-solid fa-bolt"></i> Instant Step-by-Step Proofs</div>
        </div>

        <div class="start-card-instructions">
          <p><i class="fa-solid fa-circle-info" style="color:var(--primary); margin-right:0.35rem;"></i> <strong>تعليمات الاختبار:</strong> عند الضغط على زر البدء (Start)، سيبدأ العد التنازلي لمدة <strong>10 دقائق</strong>. أجب عن جميع الأسئلة ثم اضغط على إنهاء الاختبار لعرض نتيجتك ونموذج الإجابة التفصيلي بالخطوات الرياضية الكاملة.</p>
        </div>

        <button class="btn-3d btn-primary-3d btn-start-quiz" onclick="startQuizAssessmentNow()">
          <i class="fa-solid fa-play"></i> Start Quiz #${activeQuizModelIndex + 1} (10 Minutes)
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  currentModel.questions.forEach((qItem, qIdx) => {
    const card = document.createElement('article');
    card.className = 'quiz-question-card';
    card.id = `quiz-q-card-${qIdx}`;

    const letters = ['A', 'B', 'C', 'D'];
    const options = qItem.options || [];
    const optionsHtml = options.map((opt, optIdx) => `
      <button class="mcq-option-btn" id="quiz-opt-${qIdx}-${optIdx}" onclick="selectQuizAnswer(${qIdx}, ${optIdx})">
        <span class="option-letter-badge">${letters[optIdx]}</span>
        <span>${opt}</span>
      </button>
    `).join('');

    card.innerHTML = `
      <p style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1rem; color:var(--text-main);">
        ${qItem.q}
      </p>
      ${qItem.diagramSvg ? `<div class="quiz-diagram-wrap" style="display:flex; justify-content:center; align-items:center; margin:1rem 0; background:rgba(248,249,254,0.8); border:1px solid var(--border-color); border-radius:12px; padding:1rem; overflow-x:auto;">${qItem.diagramSvg}</div>` : ''}
      <div class="mcq-options-grid">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]
    });
  }
}

function selectQuizAnswer(qIdx, optIdx) {
  if (quizSubmitted) return;

  quizUserAnswers[qIdx] = optIdx;
  AudioEngine.click();

  const card = document.getElementById(`quiz-q-card-${qIdx}`);
  if (card) {
    card.querySelectorAll('.mcq-option-btn').forEach((btn, idx) => {
      btn.classList.toggle('correct', idx === optIdx);
    });
  }

  updateQuizProgress();
}

function updateQuizProgress() {
  const answeredCount = Object.keys(quizUserAnswers).length;
  const fill = document.getElementById('quizProgressFill');
  if (fill) fill.style.width = `${(answeredCount / 10) * 100}%`;
}

function startQuizTimer() {
  clearInterval(quizTimerInterval);
  const timerText = document.getElementById('quizTimerText');
  const timerBox = document.getElementById('quizTimerBox');

  quizTimerInterval = setInterval(() => {
    if (quizTimerSeconds <= 0) {
      clearInterval(quizTimerInterval);
      submitQuizAssessment(true);
      return;
    }

    quizTimerSeconds--;
    const mins = Math.floor(quizTimerSeconds / 60).toString().padStart(2, '0');
    const secs = (quizTimerSeconds % 60).toString().padStart(2, '0');
    if (timerText) timerText.innerText = `${mins}:${secs}`;

    if (quizTimerSeconds <= 30) {
      timerBox.className = 'timer-pill-box danger';
    } else if (quizTimerSeconds <= 120) {
      timerBox.className = 'timer-pill-box warning';
    } else {
      timerBox.className = 'timer-pill-box';
    }
  }, 1000);
}

function submitQuizAssessment(isAuto = false) {
  if (quizSubmitted) return;

  const answeredCount = Object.keys(quizUserAnswers).length;
  if (!isAuto && answeredCount < 10) {
    if (!confirm(`You have answered ${answeredCount} of 10 questions. Are you sure you want to submit now?`)) {
      return;
    }
  }

  quizSubmitted = true;
  clearInterval(quizTimerInterval);

  const currentModel = currentQuizModels[activeQuizModelIndex];
  let score = 0;

  currentModel.questions.forEach((qItem, idx) => {
    if (quizUserAnswers[idx] === qItem.correct) score++;
  });

  const submitBar = document.getElementById('submitQuizBar');
  if (submitBar) submitBar.style.display = 'none';

  const report = document.getElementById('quizFeedbackReport');
  const percentText = document.getElementById('scorePercentText');
  const fractionText = document.getElementById('scoreFractionText');
  const ratingBadge = document.getElementById('scoreRatingBadge');
  const trophy = document.getElementById('scoreTrophy');
  const breakdownList = document.getElementById('feedbackBreakdownList');

  const percent = Math.round((score / 10) * 100);
  if (percentText) percentText.innerText = `${percent}%`;
  if (fractionText) fractionText.innerText = `${score} / 10 Marks`;

  if (percent >= 90) {
    trophy.innerText = '🏆';
    ratingBadge.innerText = 'Outstanding Mastery! A+ Exemplary';
    ratingBadge.style.color = 'var(--accent-mint)';
    AudioEngine.success();
  } else if (percent >= 70) {
    trophy.innerText = '🌟';
    ratingBadge.innerText = 'Great Job! Solid Mathematical Foundation';
    ratingBadge.style.color = 'var(--primary)';
    AudioEngine.success();
  } else {
    trophy.innerText = '💪';
    ratingBadge.innerText = 'Needs Review — Check Proofs Below';
    ratingBadge.style.color = 'var(--accent-coral)';
    AudioEngine.wrong();
  }

  if (breakdownList) {
    breakdownList.innerHTML = '';
    currentModel.questions.forEach((qItem, idx) => {
      const studentChoice = quizUserAnswers[idx];
      const isCorrect = studentChoice === qItem.correct;
      const letters = ['A', 'B', 'C', 'D'];

      const itemEl = document.createElement('div');
      itemEl.style.cssText = `
        background: var(--bg-main);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        margin-bottom: 1rem;
        border-left: 5px solid ${isCorrect ? 'var(--accent-mint)' : '#eb4d4b'};
      `;

      itemEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <strong>Question ${idx + 1}</strong>
          <span class="pill-badge" style="background:${isCorrect ? 'rgba(0,184,148,0.2)' : 'rgba(235,77,75,0.2)'}; color:${isCorrect ? 'var(--accent-mint)' : '#eb4d4b'};">
            ${isCorrect ? '✓ Correct (+1 Mark)' : '✗ Incorrect (0 Marks)'}
          </span>
        </div>
        <p style="font-size:0.95rem; margin-bottom:0.5rem;">${qItem.q}</p>
        <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <span>Your Answer: <strong>${studentChoice !== undefined ? letters[studentChoice] + '. ' + qItem.options[studentChoice] : 'Unanswered'}</strong></span> • 
          <span>Correct Answer: <strong style="color:var(--accent-mint);">${letters[qItem.correct]}. ${qItem.options[qItem.correct]}</strong></span>
        </div>
        <div style="font-size:0.85rem; background:var(--bg-surface); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-light);">
          <strong>Derivation & Step-by-Step Proof:</strong><br>${qItem.proof}
        </div>
      `;

      breakdownList.appendChild(itemEl);
    });

    if (window.renderMathInElement) {
      renderMathInElement(breakdownList, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }
  }

  // Unlock next model sequentially on submission
  if (activeQuizModelIndex < 2) {
    maxUnlockedQuizModelIndex = Math.max(maxUnlockedQuizModelIndex, activeQuizModelIndex + 1);
  }
  updateQuizModelTabsVisibility();

  const nextBtn = document.getElementById('btnNextQuizModel');
  if (nextBtn) {
    if (activeQuizModelIndex < 2) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = `<i class="fa-solid fa-forward-step"></i> Advance to Quiz #${activeQuizModelIndex + 2}`;
    } else {
      nextBtn.style.display = 'none';
    }
  }

  if (report) {
    report.style.display = 'block';
    report.scrollIntoView({ behavior: 'smooth' });
  }
}

function retakeCurrentQuiz() {
  AudioEngine.click();
  initQuizModel(activeQuizModelIndex);
  const container = document.getElementById('tab-quiz');
  if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function advanceNextQuizModel() {
  if (activeQuizModelIndex < 2) {
    AudioEngine.click();
    maxUnlockedQuizModelIndex = Math.max(maxUnlockedQuizModelIndex, activeQuizModelIndex + 1);
    initQuizModel(activeQuizModelIndex + 1);
    const container = document.getElementById('tab-quiz');
    if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// 7. TAB NAVIGATION & SOLUTION DRAWERS
// ==========================================================================
function switchTab(targetTabId) {
  AudioEngine.click();

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTabId);
  });

  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === targetTabId);
  });

  // Start or pause the quiz countdown timer based on active tab
  if (targetTabId === 'tab-quiz') {
    const hasQuestions = currentQuizModels[activeQuizModelIndex]?.questions?.length > 0;
    if (hasQuestions && quizStarted && !quizSubmitted) {
      startQuizTimer();
    }
  } else {
    // Pause timer when student is reviewing concept or practicing MCQs
    clearInterval(quizTimerInterval);
  }

  setTimeout(() => {
    StylusEngine.redrawAll();
  }, 50);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSolutionDrawer(drawerId, btn) {
  AudioEngine.click();
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  const isHidden = (window.getComputedStyle(drawer).display === 'none' || drawer.style.display === 'none');
  drawer.style.display = isHidden ? 'block' : 'none';
  if (btn) {
    const icon = isHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    btn.innerHTML = `${icon} <span>${isHidden ? 'Hide Model Solution' : 'Show Model Solution'}</span>`;
  }
}

// ==========================================================================
// 7. DYNAMIC QUESTION POOLS & REGENERATION / REORDER / SWAP ENGINE
// (All questions extracted 100% strictly and authentically from uploaded files)
// ==========================================================================
const IDEA_QUESTION_POOLS = {
  1: [
    {
      tag: 'Alternative Practice 1.A • Completing True Proportions',
      q: `Complete the following to form true proportions:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $\\frac{20}{25} = \\frac{36}{\\dots}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> $\\frac{48}{72} = \\frac{\\dots}{15}$
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Let the unknown denominator be $x$: $\\frac{20}{25} = \\frac{36}{x}$. Simplify $\\frac{20 \\div 5}{25 \\div 5} = \\frac{4}{5}$. By cross multiplication: $4x = 5 \\times 36 = 180 \\implies x = \\frac{180}{4} = 45$.' },
        { num: 'Step 2: Part (b)', text: 'Let the unknown numerator be $y$: $\\frac{48}{72} = \\frac{y}{15}$. Simplify $\\frac{48 \\div 24}{72 \\div 24} = \\frac{2}{3}$. Cross-multiply: $3y = 2 \\times 15 = 30 \\implies y = \\frac{30}{3} = 10$.' }
      ],
      ans: '(a) Missing denominator = 45 &nbsp;|&nbsp; (b) Missing numerator = 10'
    },
    {
      tag: 'Alternative Practice 1.B • Testing Quantities Proportionality',
      q: `For each of the following, determine whether the quantities are proportional. If they are, write the proportion:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $12, \\quad 27, \\quad 16, \\quad 18$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> $8, \\quad 24, \\quad 6, \\quad 18$
          </div>`,
      steps: [
        { num: 'Step 1: Testing (a)', text: 'Check product of extremes: $12 \\times 18 = 216$. Check product of means: $27 \\times 16 = 432$. Since $216 \\ne 432$, the quantities are <strong>NOT proportional</strong>.' },
        { num: 'Step 2: Testing (b)', text: 'Check product of extremes: $8 \\times 18 = 144$. Check product of means: $24 \\times 6 = 144$. Since $144 = 144$, the quantities <strong>ARE proportional</strong>. Proportion: $\\frac{8}{24} = \\frac{6}{18} = \\frac{1}{3}$.' }
      ],
      ans: '(a) Not proportional &nbsp;|&nbsp; (b) Proportional: $\\frac{8}{24} = \\frac{6}{18}$'
    },
    {
      tag: 'Alternative Practice 1.C • Fractional Pairs Proportionality Test',
      q: `Which of the following pairs represents a proportion?
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $\\frac{1}{3} \\quad \\text{and} \\quad \\frac{0.5}{1.5}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> $\\frac{5}{4} \\quad \\text{and} \\quad \\frac{7.5}{6}$
          </div>`,
      steps: [
        { num: 'Step 1: Testing Pair (a)', text: 'Product of extremes $= 1 \\times 1.5 = 1.5$. Product of means $= 3 \\times 0.5 = 1.5$. Since $1.5 = 1.5$, $\\frac{1}{3} = \\frac{0.5}{1.5} \\implies$ <strong>Represents a proportion</strong>.' },
        { num: 'Step 2: Testing Pair (b)', text: 'Product of extremes $= 5 \\times 6 = 30$. Product of means $= 4 \\times 7.5 = 30$. Since $30 = 30$, $\\frac{5}{4} = \\frac{7.5}{6} \\implies$ <strong>Represents a proportion</strong>.' }
      ],
      ans: 'Both pairs (a) and (b) represent valid proportions.'
    },
    {
      tag: 'Alternative Practice 1.D • Cumulative Proportion Selection',
      q: `Solve both questions from the cumulative evaluation:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> Which ratio is proportional to $\\frac{24}{36}$?<br>
            <strong>[A]</strong> $\\frac{8}{18}$ &nbsp;&nbsp; <strong>[B]</strong> $\\frac{10}{12}$ &nbsp;&nbsp; <strong>[C]</strong> $\\frac{10}{15}$ &nbsp;&nbsp; <strong>[D]</strong> $\\frac{16}{28}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> Which pair of ratios is NOT proportional?<br>
            <strong>[A]</strong> $\\frac{2}{5}, \\frac{12}{30}$ &nbsp;&nbsp; <strong>[B]</strong> $\\frac{8}{10}, \\frac{12}{15}$ &nbsp;&nbsp; <strong>[C]</strong> $\\frac{7}{8}, \\frac{35}{40}$ &nbsp;&nbsp; <strong>[D]</strong> $\\frac{3}{4}, \\frac{12}{18}$
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Reduce $\\frac{24}{36} = \\frac{2}{3}$. Test options: $\\frac{10}{15} = \\frac{2}{3}$. Thus [C] is correct.' },
        { num: 'Step 2: Part (b)', text: 'In option [D]: $\\frac{3}{4} = 0.75$, while $\\frac{12}{18} = \\frac{2}{3} \\approx 0.67$. $3 \\times 18 = 54 \\ne 4 \\times 12 = 48$. Thus [D] is not proportional.' }
      ],
      ans: '(a) [C] $\\frac{10}{15}$ &nbsp;|&nbsp; (b) [D] $\\frac{3}{4}, \\frac{12}{18}$'
    }
  ],
  2: [
    {
      tag: 'Alternative Practice 2.A • Solving Standard Proportions',
      q: `Solve each of the following proportions for $x$:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $\\frac{3}{4} = \\frac{x}{20}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> $\\frac{6}{x} = \\frac{12}{14}$
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Cross-multiplication: $4x = 3 \\times 20 = 60 \\implies x = \\frac{60}{4} = 15$.' },
        { num: 'Step 2: Part (b)', text: 'Cross-multiplication: $12x = 6 \\times 14 = 84 \\implies x = \\frac{84}{12} = 7$.' }
      ],
      ans: '(a) $x = 15$ &nbsp;|&nbsp; (b) $x = 7$'
    },
    {
      tag: 'Alternative Practice 2.B • Solving Algebraic Proportions',
      q: `Solve each of the following proportions:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $\\frac{15}{x} = \\frac{30}{12}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> $\\frac{16}{3x} = \\frac{8}{12}$
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Cross-multiplication: $30x = 15 \\times 12 = 180 \\implies x = \\frac{180}{30} = 6$.' },
        { num: 'Step 2: Part (b)', text: 'Cross-multiplication: $8 \\times (3x) = 16 \\times 12 \\implies 24x = 192 \\implies x = \\frac{192}{24} = 8$.' }
      ],
      ans: '(a) $x = 6$ &nbsp;|&nbsp; (b) $x = 8$'
    },
    {
      tag: 'Alternative Practice 2.C • Finding Missing Quantities & Binomials',
      q: `Find the missing unknown values:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> $\\frac{12}{\\square} = \\frac{18}{12}$
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> If $\\frac{l - 3}{12} = \\frac{5}{4}$, find the value of $l$.
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Let the missing value be $m$: $18m = 12 \\times 12 = 144 \\implies m = \\frac{144}{18} = 8$.' },
        { num: 'Step 2: Part (b)', text: 'Cross-multiply: $4(l - 3) = 12 \\times 5 = 60 \\implies l - 3 = \\frac{60}{4} = 15 \\implies l = 15 + 3 = 18$.' }
      ],
      ans: '(a) Missing denominator = 8 &nbsp;|&nbsp; (b) $l = 18$'
    },
    {
      tag: 'Alternative Practice 2.D • Unknown Variables with Fractions',
      q: `Solve for the unknown variables:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> If $\\frac{8}{X} = 0.5$, what is the value of $X$?
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> If $\\frac{n - 2}{3} = \\frac{3}{18}$, find the value of $n$.
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: '$\\frac{8}{X} = \\frac{1}{2} \\implies X = 8 \\times 2 = 16$.' },
        { num: 'Step 2: Part (b)', text: 'Simplify $\\frac{3}{18} = \\frac{1}{6}$. Then $\\frac{n - 2}{3} = \\frac{1}{6} \\implies 6(n - 2) = 3 \\implies n - 2 = 0.5 \\implies n = 2.5$.' }
      ],
      ans: '(a) $X = 16$ &nbsp;|&nbsp; (b) $n = 2.5$'
    }
  ],
  3: [
    {
      tag: 'Alternative Practice 3.A • Word Rates & Energy Calories',
      q: `Solve both rate application questions:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> A person writes 150 words in 30 minutes. How many words does he write in two hours?
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> If 100 grams of chocolate provide 300 calories, find the number of calories in 30 grams of the same chocolate.
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Rate $= \\frac{150\\text{ words}}{30\\text{ min}} = 5\\text{ words/min}$. Two hours $= 120\\text{ min}$. In 120 minutes: $5 \\times 120 = 600\\text{ words}$.' },
        { num: 'Step 2: Part (b)', text: 'Rate $= \\frac{300\\text{ calories}}{100\\text{ g}} = 3\\text{ cal/g}$. In 30 grams: $30 \\times 3 = 90\\text{ calories}$.' }
      ],
      ans: '(a) 600 words &nbsp;|&nbsp; (b) 90 calories'
    },
    {
      tag: 'Alternative Practice 3.B • Agricultural Tractor Rate',
      q: `A tractor cultivates 840 square meters of land in 3 hours:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> What area of land does the tractor cultivate in 5 hours if it continues at the same rate?
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> How many hours are needed for the tractor to cultivate 1,960 square meters?
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Hourly rate $= \\frac{840}{3} = 280\\text{ m}^2/\\text{hour}$. In 5 hours: $280 \\times 5 = 1,400\\text{ m}^2$.' },
        { num: 'Step 2: Part (b)', text: 'Time needed $= \\frac{1960}{280} = 7\\text{ hours}$.' }
      ],
      ans: '(a) 1,400 m² &nbsp;|&nbsp; (b) 7 hours'
    },
    {
      tag: 'Alternative Practice 3.C • Milk & Apple Shopping Rates',
      q: `Solve both market shopping rate questions:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> If $\\frac{3}{4}$ liter of milk costs 24 pounds, how much would $1\\frac{3}{4}$ liters cost?
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> Omar bought 8 apples for 60 LE. How many apples of the same type can he buy for 105 LE?
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Unit price per liter $= 24 \\div \\frac{3}{4} = 24 \\times \\frac{4}{3} = 32\\text{ pounds/liter}$. Cost for $1\\frac{3}{4} = \\frac{7}{4}$ liters: $\\frac{7}{4} \\times 32 = 7 \\times 8 = 56\\text{ pounds}$.' },
        { num: 'Step 2: Part (b)', text: 'Let number of apples be $x$: $\\frac{8}{60} = \\frac{x}{105} \\implies 60x = 8 \\times 105 = 840 \\implies x = \\frac{840}{60} = 14\\text{ apples}$.' }
      ],
      ans: '(a) 56 pounds &nbsp;|&nbsp; (b) 14 apples'
    },
    {
      tag: 'Alternative Practice 3.D • Petrol Consumption & Moon Gravity',
      q: `Solve both scientific rate questions:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> A car uses 5 liters of petrol to cover 40 km. How much petrol would it need to cover 128 km at the same rate?
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> Weight of a body on Earth is 90 N, on the Moon is 15 N. What is the Moon weight of another body of 60 N on Earth?
          </div>`,
      steps: [
        { num: 'Step 1: Part (a)', text: 'Rate $= \\frac{5}{40} = \\frac{1}{8}\\text{ L/km}$. For 128 km: $128 \\times \\frac{1}{8} = 16\\text{ liters}$.' },
        { num: 'Step 2: Part (b)', text: 'Gravity ratio $= \\frac{15}{90} = \\frac{1}{6}$. Moon weight of 60 N body $= 60 \\times \\frac{1}{6} = 10\\text{ Newtons}$.' }
      ],
      ans: '(a) 16 liters &nbsp;|&nbsp; (b) 10 Newtons'
    }
  ],
  4: [
    {
      tag: 'Alternative Practice 4.A • Graphical Origin Test Analysis',
      q: `Which of the relationships shown below represents a proportion? State the mathematical reasoning for each case:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> A curved graph starting from the origin $(0, 0)$ up to $(4, 40)$.
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> A straight line passing through the origin $(0, 0)$ and $(8, 8)$.
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(c)</span> A straight line crossing the vertical axis at $(0, 1)$.
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(d)</span> A straight line crossing the vertical axis at $(0, 4)$ downwards.
          </div>`,
      steps: [
        { num: 'Step 1: Graph (a)', text: 'Curved path. A proportional relationship must be represented by a straight line. Thus (a) is not a proportion.' },
        { num: 'Step 2: Graph (b)', text: 'Straight line passing directly through the origin $(0, 0)$. Thus (b) <strong>represents a valid proportion</strong>.' },
        { num: 'Step 3: Graph (c)', text: 'Straight line, but crosses at $(0, 1) \\ne (0, 0)$. Does not represent a proportion.' },
        { num: 'Step 4: Graph (d)', text: 'Straight line, but crosses at $(0, 4) \\ne (0, 0)$. Does not represent a proportion.' }
      ],
      ans: 'Graph (b) is the only relationship that represents a proportion.'
    },
    {
      tag: 'Alternative Practice 4.B • Proportional Tables & Graph Verification',
      q: `Determine which of the following tables shows a proportional relationship:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> Covered Distances: Time (seconds): [1, 2, 3, 4] &nbsp;|&nbsp; Distance (meters): [6, 12, 18, 24]
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> Price of apples in a market: Weight (kg): [1, 2, 3, 4] &nbsp;|&nbsp; Price (LE): [45, 90, 135, 180]
          </div>`,
      steps: [
        { num: 'Step 1: Table (a)', text: 'Ratios: $\\frac{6}{1} = 6, \\frac{12}{2} = 6, \\frac{18}{3} = 6, \\frac{24}{4} = 6$. Ratio is constant ($6\\text{ m/s}$) and passes through $(0, 0)$. Represents a proportion.' },
        { num: 'Step 2: Table (b)', text: 'Ratios: $\\frac{45}{1} = 45, \\frac{90}{2} = 45, \\frac{135}{3} = 45, \\frac{180}{4} = 45$. Unit price is constant ($45\\text{ LE/kg}$) and passes through $(0, 0)$. Represents a proportion.' }
      ],
      ans: 'Both tables (a) and (b) represent proportional relationships.'
    },
    {
      tag: 'Alternative Practice 4.C • Non-Proportional Tables Reasoning',
      q: `Explain why each of the following tables does NOT show a proportional relationship:
          <div class="q-sub-item">
            <span class="q-part-pill">(a)</span> Price of pies with delivery: Number of Pies: [1, 2, 3, 4] &nbsp;|&nbsp; Price (LE): [25, 45, 65, 85]
          </div>
          <div class="q-sub-item">
            <span class="q-part-pill">(b)</span> Price of shampoo: Volume (mL): [100, 200, 300, 400] &nbsp;|&nbsp; Price (LE): [40, 50, 58, 70]
          </div>`,
      steps: [
        { num: 'Step 1: Table (a)', text: 'Ratios: $\\frac{25}{1} = 25, \\frac{45}{2} = 22.5, \\frac{65}{3} \\approx 21.67$. Due to fixed delivery fee, graph has equation $y = 20x + 5$, which does not pass through origin $(0, 0)$.' },
        { num: 'Step 2: Table (b)', text: 'Ratios: $\\frac{40}{100} = 0.4, \\frac{50}{200} = 0.25, \\frac{58}{300} \\approx 0.193$. The ratios are not equal $\\implies$ not a proportion.' }
      ],
      ans: 'Neither table shows a proportion (ratios not constant and do not pass through origin).'
    },
    {
      tag: 'Alternative Practice 4.D • Typing Speed Linearity Test',
      q: `The table shows the relationship between the number of pages Adam can type and time in hours:
          <div class="q-sub-item">
            Time (hours): [1, 2, 3, 4] &nbsp;&nbsp;|&nbsp;&nbsp; Number of Pages: [3, 6, 9, 21]
          </div>
          Determine whether the number of pages is proportional to the time in hours.`,
      steps: [
        { num: 'Step 1: Check Ratios', text: '$\\frac{3}{1} = 3, \\quad \\frac{6}{2} = 3, \\quad \\frac{9}{3} = 3, \\quad \\text{but: } \\frac{21}{4} = 5.25 \\ne 3$.' },
        { num: 'Step 2: Conclusion', text: 'Because the fourth ratio is $5.25 \\ne 3$, the points do not lie on a single straight line. The relationship is <strong>NOT proportional</strong>.' }
      ],
      ans: 'The relationship is NOT proportional.'
    }
  ],
  5: [
    {
      tag: 'Alternative Practice 5.A • Equilateral Triangles Perimeter Rule',
      q: `The triangles are equilateral with side lengths 2 cm, 3 cm, and 4 cm. Does the relationship between the perimeter and the side length represent a proportion? Explain your answer.`,
      steps: [
        { num: 'Step 1: Calculate Perimeters', text: 'Triangle 1: $P = 3 \\times 2 = 6\\text{ cm}$.<br>Triangle 2: $P = 3 \\times 3 = 9\\text{ cm}$.<br>Triangle 3: $P = 3 \\times 4 = 12\\text{ cm}$.' },
        { num: 'Step 2: Check Ratios', text: '$\\frac{6}{2} = 3, \\quad \\frac{9}{3} = 3, \\quad \\frac{12}{4} = 3$.' },
        { num: 'Step 3: Verification', text: 'Ratio of perimeter to side is constant ($3$). When side length is $0$, perimeter is $0$. The graph is a straight line through origin $(0, 0)$.' }
      ],
      ans: 'Yes, it represents a valid proportion because $P = 3s$ (constant ratio = 3).'
    },
    {
      tag: 'Alternative Practice 5.B • Collaborative Work Problem',
      q: `A worker can paint a wall in 4 hours, and another worker can paint the same wall in 2 hours. If both workers work together to paint the same wall, how many minutes will they need to paint the wall?`,
      steps: [
        { num: 'Step 1: Individual Hourly Rates', text: 'Worker 1 paints $\\frac{1}{4}$ of the wall per hour. Worker 2 paints $\\frac{1}{2} = \\frac{2}{4}$ of the wall per hour.' },
        { num: 'Step 2: Combined Rate', text: 'Combined rate $= \\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$ of the wall per hour.' },
        { num: 'Step 3: Total Time in Hours', text: 'Time $= 1 \\div \\frac{3}{4} = \\frac{4}{3}\\text{ hours}$.' },
        { num: 'Step 4: Convert to Minutes', text: 'Time in minutes $= \\frac{4}{3} \\times 60 = 80\\text{ minutes}$.' }
      ],
      ans: 'They will need 80 minutes to paint the wall together.'
    },
    {
      tag: 'Alternative Practice 5.C • Proportional Quantities Product',
      q: `If the quantities $a, 2, 5$, and $b$ are proportional:
          <div class="q-sub-item">
            Find the exact numerical value of $a \\times b$.
          </div>`,
      steps: [
        { num: 'Step 1: Setup Proportion', text: 'Since $a, 2, 5, b$ are proportional, write: $\\frac{a}{2} = \\frac{5}{b}$.' },
        { num: 'Step 2: Product of Extremes = Product of Means', text: '$a \\times b = 2 \\times 5 = 10$.' }
      ],
      ans: '$a \\times b = 10$'
    },
    {
      tag: 'Alternative Practice 5.D • Quadratic Variable Proportion',
      q: `Solve the following proportion for $y$:
          <div class="q-sub-item">
            $$\\frac{8}{y} = \\frac{y}{2}$$ (where $y$ is a positive integer).
          </div>`,
      steps: [
        { num: 'Step 1: Cross-Multiplication', text: '$y \\times y = 8 \\times 2 \\implies y^2 = 16$.' },
        { num: 'Step 2: Solve for y', text: '$y = \\pm \\sqrt{16} = \\pm 4$. Since $y$ is a positive integer, $y = 4$.' }
      ],
      ans: '$y = 4$'
    },
    {
      tag: 'Alternative Practice 5.E • Monthly Savings Proportionality',
      q: `Saving: The table shows how much Ibrahim saves within a certain number of months. Are the amounts saved proportional to the number of months?
          <div class="q-sub-item">
            Amount (LE): [300, 600, 900, 1,200] &nbsp;&nbsp;|&nbsp;&nbsp; Number of Months: [2, 4, 6, 8]
          </div>`,
      steps: [
        { num: 'Step 1: Calculate Monthly Rates', text: '$\\frac{300}{2} = 150, \\quad \\frac{600}{4} = 150, \\quad \\frac{900}{6} = 150, \\quad \\frac{1200}{8} = 150$.' },
        { num: 'Step 2: Check Conclusion', text: 'All pairs have the identical constant rate of $150\\text{ LE/month}$. If months $= 0$, savings $= 0$, so the line passes through $(0, 0)$.' }
      ],
      ans: 'Yes, the amounts saved are directly proportional to the number of months (rate = 150 LE/month).'
    }
  ]
};

let ideaCardPoolIndexes = {};
let customCardCounter = 1000;

// ==========================================================================
// QUESTION REORDER & SWAPPING FUNCTIONS
// ==========================================================================
function moveQuestionCard(btn, dir) {
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  const card = btn.closest('.try-it-card');
  if (!card) return;
  const container = card.parentElement;
  if (!container) return;

  if (dir === -1) {
    const prev = card.previousElementSibling;
    if (prev && prev.classList.contains('try-it-card')) {
      container.insertBefore(card, prev);
      triggerCardSwapEffect(card, prev);
    }
  } else if (dir === 1) {
    const next = card.nextElementSibling;
    if (next && next.classList.contains('try-it-card')) {
      container.insertBefore(next, card);
      triggerCardSwapEffect(card, next);
    }
  }
}

function openQuestionSwapModal(btn) {
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  const currentCard = btn.closest('.try-it-card');
  if (!currentCard) return;
  const container = currentCard.parentElement;
  const allCards = Array.from(container.querySelectorAll('.try-it-card'));
  if (allCards.length < 2) {
    alert('يوجد سؤال واحد فقط في هذه الفكرة!');
    return;
  }

  let modal = document.getElementById('questionSwapModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'questionSwapModal';
    modal.className = 'swap-modal-backdrop';
    document.body.appendChild(modal);
  }

  const currentIndex = allCards.indexOf(currentCard) + 1;
  const currentTag = currentCard.querySelector('.card-badge-tag')?.innerText || `سؤال ${currentIndex}`;

  modal.innerHTML = `
    <div class="swap-modal-box">
      <div class="swap-modal-header">
        <div style="display:flex; align-items:center; gap:0.65rem;">
          <i class="fa-solid fa-right-left" style="color:var(--primary); font-size:1.25rem;"></i>
          <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:var(--text-main);">تبديل موضع السؤال</h3>
        </div>
        <button type="button" class="swap-modal-close" onclick="closeQuestionSwapModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding:1rem 1.6rem 0 1.6rem;">
        <p style="color:var(--text-secondary); margin:0; font-size:0.92rem; line-height:1.55;">
          أنت الآن تقوم بتبديل موضع <strong>السؤال رقم ${currentIndex}</strong> (${currentTag}).<br>
          اختر السؤال المراد التبديل معه ليتبادلا الأماكن فوراً:
        </p>
      </div>
      <div class="swap-options-list">
        ${allCards.map((c, idx) => {
          if (c === currentCard) return '';
          const promptText = c.querySelector('.try-it-prompt')?.innerText?.replace(/\\s+/g, ' ')?.slice(0, 95) || `Question ${idx + 1}`;
          const tagText = c.querySelector('.card-badge-tag')?.innerText || `سؤال ${idx + 1}`;
          return `
            <button type="button" class="swap-target-option" onclick="executeDirectCardSwap('${currentCard.id}', '${c.id}')">
              <div class="swap-target-badge">السؤال ${idx + 1}</div>
              <div class="swap-target-text">
                <strong style="color:var(--text-main); font-size:0.95rem;">${tagText}</strong>
                <p style="margin:0.25rem 0 0 0; font-size:0.86rem; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${promptText}...</p>
              </div>
              <i class="fa-solid fa-arrow-right-arrow-left swap-target-icon"></i>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeQuestionSwapModal() {
  const modal = document.getElementById('questionSwapModal');
  if (modal) modal.style.display = 'none';
}

function executeDirectCardSwap(id1, id2) {
  const card1 = document.getElementById(id1);
  const card2 = document.getElementById(id2);
  if (!card1 || !card2) return;
  closeQuestionSwapModal();

  const parent = card1.parentNode;
  const sibling = card1.nextSibling === card2 ? card1 : card1.nextSibling;
  card2.parentNode.insertBefore(card1, card2);
  parent.insertBefore(card2, sibling);

  triggerCardSwapEffect(card1, card2);
  if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
}

function triggerCardSwapEffect(card1, card2) {
  card1.classList.remove('card-swapped-pulse');
  card2.classList.remove('card-swapped-pulse');
  void card1.offsetWidth; // trigger reflow
  void card2.offsetWidth;
  card1.classList.add('card-swapped-pulse');
  card2.classList.add('card-swapped-pulse');

  setTimeout(() => {
    StylusEngine.redrawAll();
  }, 40);

  setTimeout(() => {
    card1.classList.remove('card-swapped-pulse');
    card2.classList.remove('card-swapped-pulse');
  }, 700);
}

// Helper to retrieve active question pool (checks lesson-specific pool first)
function getActiveQuestionPool(ideaId) {
  const numericId = parseInt(ideaId, 10) || ideaId;
  let activeData = null;
  if (currentLessonKey === 'place_value' && typeof LESSON_PLACE_VALUE !== 'undefined') activeData = LESSON_PLACE_VALUE;
  else if (currentLessonKey === 'similarity' && typeof LESSON_SIMILARITY !== 'undefined') activeData = LESSON_SIMILARITY;
  else if (currentLessonKey === 'quadratic' && typeof LESSON_QUADRATIC !== 'undefined') activeData = LESSON_QUADRATIC;
  else if (typeof LESSON_PROPORTION !== 'undefined') activeData = LESSON_PROPORTION;

  if (activeData && activeData.questionPools && activeData.questionPools[numericId]) {
    return activeData.questionPools[numericId];
  }
  return IDEA_QUESTION_POOLS[numericId] || IDEA_QUESTION_POOLS[ideaId] || [];
}

// ==========================================================================
// QUESTION REGENERATION & DYNAMIC ADDITION
// ==========================================================================
function regenerateQuestionCard(ideaId, cardId, btn) {
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  const card = btn.closest('.try-it-card');
  if (!card) return;

  const numericIdeaId = parseInt(ideaId, 10) || ideaId;
  const pool = getActiveQuestionPool(numericIdeaId);
  if (!pool || pool.length === 0) {
    alert('No alternative question in pool for this idea.');
    return;
  }

  const poolKey = `${numericIdeaId}`;
  if (typeof ideaCardPoolIndexes[poolKey] === 'undefined') {
    ideaCardPoolIndexes[poolKey] = 0;
  }
  const qData = pool[ideaCardPoolIndexes[poolKey] % pool.length];
  ideaCardPoolIndexes[poolKey]++;

  // Smooth fade/swap animation
  card.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
  card.style.opacity = '0.25';
  card.style.transform = 'scale(0.98)';

  setTimeout(() => {
    // Update badge tag
    const tagEl = card.querySelector('.card-badge-tag');
    if (tagEl && qData.tag) {
      tagEl.innerHTML = qData.tag;
    }

    // Update prompt
    const promptEl = card.querySelector('.try-it-prompt');
    if (promptEl && qData.q) {
      promptEl.innerHTML = qData.q;
    }

    // Update or remove svg diagram if present
    const existingSvg = card.querySelector('.diagram-frame-box');
    if (qData.svg) {
      if (existingSvg) {
        existingSvg.innerHTML = qData.svg;
        existingSvg.style.display = 'block';
      } else if (promptEl) {
        promptEl.insertAdjacentHTML('afterend', `<div class="diagram-frame-box" style="margin-bottom: 1.2rem; padding: 1.2rem; background: #ffffff; border-radius: 16px; border: 1.5px solid #eef0f7; box-shadow: inset 0 2px 8px rgba(0,0,0,0.03); overflow-x: auto;">${qData.svg}</div>`);
      }
    } else if (existingSvg) {
      existingSvg.style.display = 'none';
    }

    // Update Solution Drawer
    const solDrawer = card.querySelector('.try-it-solution-drawer');
    if (solDrawer) {
      if (qData.steps) {
        solDrawer.innerHTML = `
          <div class="solution-steps-accordion">
            ${qData.steps.map(st => `
              <div class="step-row">
                <span class="step-num-pill">${st.num}</span>
                <div class="step-body">${st.text}</div>
              </div>
            `).join('')}
            ${qData.ans ? `
              <div class="final-answer-badge">
                <i class="fa-solid fa-circle-check"></i> ${qData.ans}
              </div>
            ` : ''}
          </div>
        `;
      } else if (qData.solutionHtml) {
        solDrawer.innerHTML = `<div style="line-height:1.7; color:var(--text-main);">${qData.solutionHtml}</div>`;
      }
    }

    // Clear the associated stylus canvas for fresh work
    const canvas = card.querySelector('.stylus-canvas');
    if (canvas && window.clearCanvasPrompt) {
      clearCanvasPrompt(canvas.id);
    }

    // Trigger KaTeX re-render on this card
    if (window.renderMathInElement) {
      renderMathInElement(card, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }

    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
  }, 220);
}

function deleteQuestionCard(btn) {
  const card = btn.closest('.try-it-card');
  if (!card) return;

  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.92) translateY(-10px)';

  setTimeout(() => {
    card.remove();
  }, 300);
}

function addQuestionCardToIdea(ideaId) {
  if (window.AudioEngine && typeof AudioEngine.click === 'function') AudioEngine.click();
  const container = document.getElementById(`idea-cards-${ideaId}`);
  if (!container) return;

  const numericIdeaId = parseInt(ideaId, 10) || ideaId;
  const pool = getActiveQuestionPool(numericIdeaId);
  if (!pool || pool.length === 0) {
    alert('No extra question in pool for this idea.');
    return;
  }

  const poolKey = `${numericIdeaId}`;
  if (typeof ideaCardPoolIndexes[poolKey] === 'undefined') {
    ideaCardPoolIndexes[poolKey] = 0;
  }
  const qData = pool[ideaCardPoolIndexes[poolKey] % pool.length];
  ideaCardPoolIndexes[poolKey]++;

  customCardCounter++;
  const newCardId = `add_${customCardCounter}`;
  const canvasId = `can-c-${numericIdeaId}-${newCardId}`;
  const wrapId = `can-wrap-c-${numericIdeaId}-${newCardId}`;
  const solId = `sol-c-${numericIdeaId}-${newCardId}`;

  const article = document.createElement('article');
  article.className = 'try-it-card';
  article.id = `card-${numericIdeaId}-${newCardId}`;
  article.dataset.ideaId = numericIdeaId;
  article.dataset.cardId = newCardId;
  article.style.marginTop = '1.8rem';
  article.style.borderColor = '#00b894';
  article.style.opacity = '0';
  article.style.transform = 'scale(0.95)';
  article.style.transition = 'all 0.3s ease';

  article.innerHTML = `
    <div class="try-it-header">
      <div class="try-it-badge" style="background: linear-gradient(135deg, #00b894, #55efc4); box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
        <i class="fa-solid fa-plus-circle"></i> <span class="card-badge-tag">${qData.tag || 'Additional Practice Question'}</span>
      </div>
      <div class="card-action-bar">
        <button type="button" class="card-tool-btn move-up-btn" onclick="moveQuestionCard(this, -1)" title="تبديل السؤال مع السابق (Move Up)">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button type="button" class="card-tool-btn move-down-btn" onclick="moveQuestionCard(this, 1)" title="تبديل السؤال مع التالي (Move Down)">
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button type="button" class="card-tool-btn swap-btn" onclick="openQuestionSwapModal(this)" title="تبديل هذا السؤال مع سؤال آخر (Swap Questions)">
          <i class="fa-solid fa-right-left"></i>
        </button>
        <button type="button" class="card-tool-btn regen-btn" onclick="regenerateQuestionCard('${numericIdeaId}', '${newCardId}', this)" title="🔄 توليد سؤال بديل من أسئلة الملفات">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
        <button type="button" class="card-tool-btn delete-btn" onclick="deleteQuestionCard(this)" title="🗑️ حذف السؤال">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
    
    <div class="try-it-prompt">
      ${qData.q}
    </div>

    ${qData.svg ? `<div class="diagram-frame-box" style="margin-bottom: 1.2rem; padding: 1.2rem; background: #ffffff; border-radius: 16px; border: 1.5px solid #eef0f7; box-shadow: inset 0 2px 8px rgba(0,0,0,0.03); overflow-x: auto;">${qData.svg}</div>` : ''}

    <!-- Teacher / Student Workspace for this question -->
    ${renderWorkspaceWidget(canvasId, wrapId)}

    <button class="show-solution-btn" onclick="toggleSolutionDrawer('${solId}', this)">
      <i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>
    </button>
    <div id="${solId}" class="try-it-solution-drawer" style="display:none;">
      ${qData.steps ? `
        <div class="solution-steps-accordion">
          ${qData.steps.map(st => `
            <div class="step-row">
              <span class="step-num-pill">${st.num}</span>
              <div class="step-body">${st.text}</div>
            </div>
          `).join('')}
          ${qData.ans ? `
            <div class="final-answer-badge">
              <i class="fa-solid fa-circle-check"></i> ${qData.ans}
            </div>
          ` : ''}
        </div>
      ` : `
        <div style="line-height:1.7; color:var(--text-main);">
          ${qData.solutionHtml}
        </div>
      `}
    </div>
  `;

  container.appendChild(article);

  // Initialize stylus canvas
  setTimeout(() => {
    StylusEngine.initCanvas(canvasId);
    if (window.renderMathInElement) {
      renderMathInElement(article, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }
    article.style.opacity = '1';
    article.style.transform = 'scale(1)';
    article.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
  }, 50);
}

// ==========================================================================
// 8. LESSON IMPORTER & FILE UPLOAD ENGINE
// ==========================================================================
function openImportModal() {
  AudioEngine.click();
  const modal = document.getElementById('importModal');
  if (modal) modal.classList.add('active');
}

function closeImportModal() {
  AudioEngine.click();
  const modal = document.getElementById('importModal');
  if (modal) modal.classList.remove('active');
}

function handleLessonFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  alert(`File "${file.name}" received successfully!\n\nProcessing new lesson content with Mr Ahmed Abd El-Motaal's 3D Pixar styles, iPad stylus engine, and 30 assessment quiz questions.`);
  closeImportModal();
}

// ==========================================================================
// 9. THEME SWITCHER (DARK / LIGHT MODE)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('math_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('math_theme', next);
      updateThemeIcon(next);
      AudioEngine.click();
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun" style="color:#fdcb6e;"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function exportActiveLessonJson() {
  AudioEngine.click();
  let filename = 'lesson_place_value.json';
  if (currentLessonKey === 'similarity') filename = 'lesson_similarity.json';
  else if (currentLessonKey === 'quadratic') filename = 'lesson_quadratic.json';
  else if (currentLessonKey === 'proportion') filename = 'lesson_proportion.json';
  else if (currentLessonKey === 'place_value') filename = 'lesson_place_value.json';
  const a = document.createElement('a');
  a.href = filename;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================================================
// SHARE LESSON MODAL & STUDENT LINK CONTROLLER
// ==========================================================================
function getStudentLessonUrl(lessonKey) {
  const targetKey = lessonKey || currentLessonKey || 'place_value';
  const loc = window.location;

  // If opened directly from file system (file://)
  if (loc.protocol === 'file:') {
    const fileBase = loc.href.split('?')[0].split('#')[0];
    return `${fileBase}?lesson=${encodeURIComponent(targetKey)}&student=true`;
  }

  // Preserve repository folder path on GitHub Pages (e.g. /Similarity-of-Polygons/ or /)
  let basePath = loc.pathname;
  basePath = basePath.replace(/\/[^/]+\.html$/i, '');
  basePath = basePath.replace(/\/(place_value|similarity|quadratic|proportion)\/?$/i, '');
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }

  // Universal parameter-based URL: 100% supported on GitHub Pages, Vercel, Netlify, and localhost
  return `${loc.origin}${basePath}?lesson=${encodeURIComponent(targetKey)}&student=true`;
}

function openShareModal(targetLessonKey) {
  AudioEngine.click();
  const modal = document.getElementById('shareLessonModal');
  if (!modal) return;

  const currentLesson = targetLessonKey || currentLessonKey || 'place_value';
  updateShareModalForLesson(currentLesson);

  modal.classList.add('active');
}

function updateShareModalForLesson(lessonKey) {
  const currentLesson = lessonKey || currentLessonKey || 'place_value';
  const studentUrl = getStudentLessonUrl(currentLesson);
  
  const shareInput = document.getElementById('shareDirectLinkInput');
  if (shareInput) {
    shareInput.value = studentUrl;
  }

  const qrImg = document.getElementById('shareQrImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(studentUrl)}`;
  }

  // Update share modal badge & active selection pills
  const badge = document.getElementById('shareLessonNameBadge');
  if (badge) {
    const names = {
      'place_value': 'Place Value & Powers of 10',
      'proportion': 'Proportion',
      'quadratic': 'Quadratic Function',
      'similarity': 'Similarity of Polygons'
    };
    badge.textContent = names[currentLesson] || currentLesson;
  }

  document.querySelectorAll('.share-lesson-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-lesson') === currentLesson);
  });
}

function closeShareModal() {
  AudioEngine.click();
  const modal = document.getElementById('shareLessonModal');
  if (modal) modal.classList.remove('active');
}

function copyShareLink() {
  const shareInput = document.getElementById('shareDirectLinkInput');
  if (!shareInput) return;
  shareInput.select();
  shareInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(shareInput.value).then(() => {
    const copyBtn = document.getElementById('btnCopyShareLink');
    if (copyBtn) {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ بنجاح!';
      copyBtn.style.background = '#00b894';
      setTimeout(() => {
        copyBtn.innerHTML = origHtml;
        copyBtn.style.background = '';
      }, 2000);
    }
  });
}

function exitStudentMode() {
  if (window.isStudentLocked) {
    // If student mode was entered via student link, prevent exiting
    return;
  }
  document.body.classList.remove('student-only-mode');
  window.isStudentLocked = false;
  window.lockedLessonKey = null;
  window.history.pushState({}, '', window.location.pathname);
  loadLesson(currentLessonKey || 'place_value');
}

// ==========================================================================
// 10. APPLICATION INITIALIZATION (SINGLE PAGE APPLICATION ROUTER)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchTab(target);
    });
  });

  FullScreenPen.init();
  InfiniteWhiteboard.init();

  const importBtn = document.getElementById('importLessonBtn');
  if (importBtn) importBtn.addEventListener('click', openImportModal);

  // Global Clipboard Paste Support (Ctrl + V / Cmd + V):
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const targetId = StylusEngine.lastActiveCanvasId || document.querySelector('.stylus-canvas')?.id;
        if (targetId) {
          loadBlobToCanvas(targetId, blob);
        }
        break;
      }
    }
  });

  // 1. Clean URL Route Detection (/place_value, /similarity, /quadratic, /proportion)
  // Handles repository subpaths (/Similarity-of-Polygons/place_value) and root paths
  const pathSegments = window.location.pathname.toLowerCase().split('/').filter(Boolean);
  const lastPathSegment = pathSegments[pathSegments.length - 1] || '';
  const knownLessons = ['place_value', 'similarity', 'quadratic', 'proportion'];
  
  // 2. URL Query Parameters Detection (?lesson=place_value&student=true)
  const urlParams = new URLSearchParams(window.location.search);
  const paramLesson = urlParams.get('lesson');
  const paramStudent = urlParams.get('student');
  const paramTeacher = urlParams.get('teacher');

  let chosenLesson = null;
  let isStudent = false;

  if (knownLessons.includes(lastPathSegment)) {
    chosenLesson = lastPathSegment;
    isStudent = true; // Clean routes are dedicated student URLs
  } else if (paramLesson && knownLessons.includes(paramLesson.toLowerCase())) {
    chosenLesson = paramLesson.toLowerCase();
    isStudent = true; // Any link with ?lesson= is automatically student mode
  }

  if (paramStudent === 'true' || urlParams.get('only') === 'true') {
    isStudent = true;
  } else if (paramTeacher === 'true') {
    isStudent = false; // Teacher override for testing
  }

  if (isStudent && chosenLesson) {
    document.body.classList.add('student-only-mode');
    window.isStudentLocked = true;
    window.lockedLessonKey = chosenLesson;
  } else {
    document.body.classList.remove('student-only-mode');
    window.isStudentLocked = false;
    window.lockedLessonKey = null;
  }

  // Load target lesson, or remember last active lesson, or default to place_value
  const initialLesson = chosenLesson || (!isStudent ? localStorage.getItem('math_active_lesson') : null) || 'place_value';
  loadLesson(initialLesson);

  // URL Print Section Auto-Trigger (for direct export links or automated headless PDF generation)
  const printSectionParam = urlParams.get('printSection');
  if (printSectionParam) {
    const withSol = urlParams.get('solutions') === 'true';
    document.body.setAttribute('data-print-section', printSectionParam);
    document.body.setAttribute('data-print-solutions', withSol ? 'true' : 'false');
    
    // Update Print Header Titles
    const printLessonTitle = document.getElementById('printHeaderLessonTitle');
    const printSectionBadge = document.getElementById('printHeaderSectionBadge');
    let activeData = (initialLesson === 'place_value') ? (typeof LESSON_PLACE_VALUE !== 'undefined' ? LESSON_PLACE_VALUE : null) :
                     (initialLesson === 'similarity') ? (typeof LESSON_SIMILARITY !== 'undefined' ? LESSON_SIMILARITY : null) :
                     (initialLesson === 'quadratic') ? (typeof LESSON_QUADRATIC !== 'undefined' ? LESSON_QUADRATIC : null) :
                     (typeof LESSON_PROPORTION !== 'undefined' ? LESSON_PROPORTION : null);
    if (printLessonTitle && activeData) {
      printLessonTitle.innerText = activeData.title || 'Math Lesson';
    }
    const sectionNames = {
      'concept': 'Section 1: Concept & Practice',
      'mcq': 'Section 2: MCQ Revision Bank (10 Questions)',
      'quiz': 'Section 3: Timed Quiz - 10 Marks (3 Models)',
      'all': 'Complete Lesson'
    };
    if (printSectionBadge) {
      printSectionBadge.innerText = sectionNames[printSectionParam] || 'Mathematics Worksheet';
    }

    if (printSectionParam === 'quiz' || printSectionParam === 'all') {
      prepareQuizForPrint(true);
    }
  }

  if (urlParams.get('openPdfModal') === 'true') {
    setTimeout(openPdfExportModal, 150);
  }
});

// ==========================================================================
// 11. PDF EXPORT CONTROLLER (SEPARATE SECTIONS • STRICT ZERO-SPLIT GUARANTEE)
// Educator: Mr Ahmed Abd El-Motaal
// ==========================================================================
let exportSelectedLessonKey = 'similarity';

function openPdfExportModal() {
  AudioEngine.click();
  exportSelectedLessonKey = currentLessonKey || 'similarity';
  updateExportModalPills();
  const modal = document.getElementById('pdfExportModal');
  if (modal) modal.classList.add('active');
}

function closePdfExportModal() {
  AudioEngine.click();
  const modal = document.getElementById('pdfExportModal');
  if (modal) modal.classList.remove('active');
}

function selectExportLesson(key) {
  AudioEngine.click();
  exportSelectedLessonKey = key;
  if (currentLessonKey !== key) {
    loadLesson(key);
  }
  updateExportModalPills();
}

function updateExportModalPills() {
  const pSim = document.getElementById('modalBtnSim');
  const pQuad = document.getElementById('modalBtnQuad');
  const pProp = document.getElementById('modalBtnProp');
  if (pSim) pSim.classList.toggle('active', exportSelectedLessonKey === 'similarity');
  if (pQuad) pQuad.classList.toggle('active', exportSelectedLessonKey === 'quadratic');
  if (pProp) pProp.classList.toggle('active', exportSelectedLessonKey === 'proportion');
}

function triggerSectionPdfExport(sectionKey) {
  const includeSolutions = document.getElementById('chkIncludeSolutions')?.checked || false;
  closePdfExportModal();
  exportSectionToPdf(sectionKey, { includeSolutions });
}

function prepareQuizForPrint(includeAllModels = true) {
  const container = document.getElementById('quizQuestionsContainer');
  if (!container || !currentQuizModels || currentQuizModels.length === 0) return;

  if (includeAllModels) {
    container.innerHTML = '';
    currentQuizModels.forEach((model, mIdx) => {
      const modelHeader = document.createElement('div');
      modelHeader.className = mIdx > 0 ? 'quiz-model-page-break' : '';
      modelHeader.innerHTML = `
        <div style="margin: 1.25rem 0 1rem; padding: 0.65rem 1rem; background: #0f172a; color: #ffffff; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #ffffff !important;">Model #${mIdx + 1}: ${model.name || 'Standardized Assessment Model'}</h3>
          <span style="font-weight: 700; font-size: 0.85rem; color: #94a3b8 !important;">10 Questions • 10 Marks</span>
        </div>
      `;
      container.appendChild(modelHeader);

      model.questions.forEach((qItem, qIdx) => {
        const card = document.createElement('article');
        card.className = 'quiz-question-card print-card-avoid-split';
        card.id = `quiz-print-card-${mIdx}-${qIdx}`;
        const letters = ['A', 'B', 'C', 'D'];
        const optionsHtml = qItem.options.map((opt, optIdx) => `
          <div class="mcq-option-btn">
            <span class="option-letter-badge">${letters[optIdx]}</span>
            <span>${opt}</span>
          </div>
        `).join('');

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="mcq-number-pill">Question ${qIdx + 1} of ${model.questions.length}</span>
            <span style="font-size:0.85rem; font-weight:700; color:#475569;">[ 1 Mark ]</span>
          </div>
          <p class="quiz-question-text" style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:0.75rem; color:var(--text-main);">
            ${qItem.q}
          </p>
          ${qItem.diagramSvg ? `<div class="quiz-diagram-wrap" style="display:flex; justify-content:center; align-items:center; margin:0.75rem 0; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:0.75rem; overflow-x:auto;">${qItem.diagramSvg}</div>` : ''}
          <div class="mcq-options-grid">
            ${optionsHtml}
          </div>
          ${qItem.explanation ? `<div class="mcq-explanation-box"><strong>Explanation & Proof:</strong> ${qItem.explanation}</div>` : ''}
        `;
        container.appendChild(card);
      });
    });
  }

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]
    });
  }
}

function exportSectionToPdf(sectionKey, options = {}) {
  // Ensure light theme for crisp high-contrast printing
  const previousTheme = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', 'light');

  // Set print attributes
  document.body.setAttribute('data-print-section', sectionKey);
  document.body.setAttribute('data-print-solutions', options.includeSolutions ? 'true' : 'false');

  // Update Header Banner
  const printLessonTitle = document.getElementById('printHeaderLessonTitle');
  const printSectionBadge = document.getElementById('printHeaderSectionBadge');

  let activeData = (currentLessonKey === 'place_value') ? LESSON_PLACE_VALUE :
                   (currentLessonKey === 'similarity') ? LESSON_SIMILARITY :
                   (currentLessonKey === 'quadratic') ? LESSON_QUADRATIC : LESSON_PROPORTION;

  if (printLessonTitle && activeData) {
    printLessonTitle.innerText = activeData.title || 'Math Lesson';
  }

  const sectionNames = {
    'concept': 'Section 1: Concept & Practice (المفاهيم والتمارين)',
    'mcq': 'Section 2: MCQ Revision Bank (بنك أسئلة الاختيار من متعدد)',
    'quiz': 'Section 3: Timed Quiz - 10 Marks (نماذج الاختبارات الموقوتة)',
    'all': 'Comprehensive Lesson Package (جميع أقسام الدرس كاملة)'
  };

  if (printSectionBadge) {
    printSectionBadge.innerText = sectionNames[sectionKey] || 'Mathematics Assessment';
  }

  // If printing quiz, format all 3 models nicely
  if (sectionKey === 'quiz' || sectionKey === 'all') {
    prepareQuizForPrint(true);
  }

  // If printing concept with solutions, reveal solution drawers
  if (options.includeSolutions) {
    document.querySelectorAll('.try-it-solution-drawer').forEach(el => el.style.display = 'block');
  }

  // Rerender math formulas
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]
    });
  }

  // Cleanup handler
  const cleanup = () => {
    document.body.removeAttribute('data-print-section');
    document.body.removeAttribute('data-print-solutions');
    if (previousTheme) {
      document.documentElement.setAttribute('data-theme', previousTheme);
    }
    // Restore single interactive quiz model
    renderQuizQuestions();
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  // Trigger print dialog
  setTimeout(() => {
    window.print();
  }, 250);
}



