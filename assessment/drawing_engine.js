var currentLessonKey = 'educational_tool';
/* ==========================================================================
   MATHQUEST PRO â€” CORE APPLICATION & MULTI-LESSON ENGINE
   Educator: Mr Ahmed Abd El-Motaal
   Math Teacher & Content Creator
   Lessons Included:
   1. Lesson One: Proportion (Unit 1: Numbers & Operations)
   2. Lesson Two: The Distance Between Two Points (Coordinate Geometry)
   ========================================================================== */

// --- AUDIO SYNTHESIZER (Web Audio API, Zero External MP3 Dependencies) ---
window.AudioEngine = window.AudioEngine || {
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
  ctx.fillText('Mr Ahmed Abd El-Motaal â€¢ Math Teacher & Content Creator', padding, padding + 20 * dpr);

  ctx.fillStyle = '#5e6b8c';
  ctx.font = `${11 * dpr}px 'Plus Jakarta Sans', sans-serif`;
  const lessonLabel = (currentLessonKey === 'proportion') ? 'Prep 3 â€¢ Unit 1: Numbers & Operations â€¢ Proportion' : 'Prep 3 â€¢ Unit 2: Functions â€¢ Quadratic Function';
  ctx.fillText(`${lessonLabel} | ðŸ“ž 01019775590 | ðŸ“º YouTube: mr Motaal`, padding, padding + 42 * dpr);

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
  ctx.fillText('MathQuest Pro Interactive Smartboard â€¢ Math with Mr Ahmed Abd El-Motaal', padding, exportCanvas.height - 12 * dpr);

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
  if (fab) fab.classList.toggle('active', isStudio);
  const exitBtn = document.getElementById('exitStudioBtn');
  if (exitBtn) exitBtn.style.display = isStudio ? 'inline-flex' : 'none';
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
    if (!this.canvas) this.init();
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
    if (window.AudioEngine && typeof AudioEngine.success === 'function') AudioEngine.success();
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
  ctx.fillText('Mr Ahmed Abd El-Motaal â€¢ YouTube: mr Motaal â€¢ 01019775590', 24 * dpr, exportCanvas.height - 24 * dpr);

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
    if (!this.canvas || !this.overlay) {
      this.init();
    }
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
        if (btn) btn.title = 'ÙˆØ¶Ø¹ Ø§Ù„Ø³Ø¨ÙˆØ±Ø©: ÙØ§ØªØ­ (Ø§Ù†Ù‚Ø± Ù„Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†)';
      } else {
        icon.className = 'fa-solid fa-moon';
        if (btn) btn.title = 'ÙˆØ¶Ø¹ Ø§Ù„Ø³Ø¨ÙˆØ±Ø©: Ø¯Ø§ÙƒÙ† (Ø§Ù†Ù‚Ø± Ù„Ù„ÙˆØ¶Ø¹ Ø§Ù„ÙØ§ØªØ­)';
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
        if (btn) btn.title = 'Ù†Ù…Ø· Ø§Ù„Ø³Ø¨ÙˆØ±Ø©: Ø´Ø¨ÙƒØ© ØªØ±Ø¨ÙŠØ¹ÙŠØ© (Ø§Ù†Ù‚Ø± Ù„Ù„ØªØ¨Ø¯ÙŠÙ„)';
      } else if (this.backgroundPattern === 'lines') {
        icon.className = 'fa-solid fa-bars';
        if (btn) btn.title = 'Ù†Ù…Ø· Ø§Ù„Ø³Ø¨ÙˆØ±Ø©: Ø®Ø·ÙˆØ· Ù…Ø³Ø·Ø±Ø© Ù„Ù„ÙƒØªØ§Ø¨Ø© (Ø§Ù†Ù‚Ø± Ù„Ù„ØªØ¨Ø¯ÙŠÙ„)';
      } else {
        icon.className = 'fa-solid fa-border-none';
        if (btn) btn.title = 'Ù†Ù…Ø· Ø§Ù„Ø³Ø¨ÙˆØ±Ø©: Ø®Ù„ÙÙŠØ© Ø³Ø§Ø¯Ø© (Ø§Ù†Ù‚Ø± Ù„Ù„ØªØ¨Ø¯ÙŠÙ„)';
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
    expCtx.fillText('Mr Ahmed Abd El-Motaal â€¢ YouTube: mr Motaal â€¢ 01019775590', 28 * dpr, exportCanvas.height - 24 * dpr);

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

// Global Window Bindings & Auto-Init for Assessment Page
window.FullScreenPen = FullScreenPen;
window.InfiniteWhiteboard = InfiniteWhiteboard;
window.openWhiteboard = function() {
  InfiniteWhiteboard.open();
};

window.addEventListener('DOMContentLoaded', () => {
  try {
    FullScreenPen.init();
  } catch (e) {
    console.warn('FullScreenPen init error:', e);
  }
  try {
    InfiniteWhiteboard.init();
  } catch (e) {
    console.warn('InfiniteWhiteboard init error:', e);
  }
});

