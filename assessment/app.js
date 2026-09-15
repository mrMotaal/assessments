/* ==========================================================================
   MATH ASSESSMENT & RULED NOTEBOOK TEACHING SUITE
   Educator: Mr Ahmed Abd El-Motaal (Math Teacher & Content Creator)
   Platform: Desktop 3 • Self-Contained Educational Engine
   ========================================================================== */

// --- AUDIO SYNTHESIZER (Web Audio API) ---
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

/* ==========================================================================
   ASSESSMENT APP CONTROLLER
   ========================================================================== */
const AssessmentApp = {
  currentWeek: 'week5', // default to latest assessment (Week 5)
  currentGroup: 'groupA',
  currentQuestionIndex: 0,
  userSelectedOptions: {}, // { questionId: 'key' }
  canvasBuffers: {},       // { questionId: dataUrl }
  canvasHistory: {},       // { questionId: [snapshots] }
  canvasRedoStack: {},     // { questionId: [snapshots] }

  // Canvas Drawing State
  canvasEl: null,
  ctx: null,
  isDrawing: false,
  currentColor: '#182038',
  currentStrokeWidth: 4,
  currentTool: 'pen',
  isEraser: false,
  prevX: 0,
  prevY: 0,
  lastMidX: 0,
  lastMidY: 0,
  hasMoved: false,
  canvasHeight: 290,

  // Timer State
  timerDuration: 60,
  timerRemaining: 60,
  timerInterval: null,
  isTimerRunning: false,

  init() {
    // Parse URL parameter for week (?week=2, ?week=3, ?week=4, ?week=5)
    const urlParams = new URLSearchParams(window.location.search);
    const weekParam = urlParams.get('week');
    if (weekParam) {
      const normalized = weekParam.startsWith('week') ? weekParam : 'week' + weekParam;
      if (WEEKS_DATA[normalized]) {
        this.currentWeek = normalized;
      } else {
        this.currentWeek = 'week5';
      }
    } else {
      this.currentWeek = 'week5';
    }

    this.canvasEl = document.getElementById('notebook-canvas');
    if (this.canvasEl) {
      this.ctx = this.canvasEl.getContext('2d', { willReadFrequently: true });
      this.initCanvasEvents();
      this.resizeCanvas();
    }

    this.updateWeekButtons();
    this.renderQuestion();

    // Listen to window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas(true);
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (window.InfiniteWhiteboard && InfiniteWhiteboard.isOpen) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.nextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.prevQuestion();
      } else if (e.key.toLowerCase() === 's' && !e.altKey && !e.ctrlKey) {
        this.toggleModelSolution();
      } else if (e.key.toLowerCase() === 't' && !e.altKey && !e.ctrlKey) {
        this.toggleTimer();
      }
    });

    console.log('✅ Math Assessment Suite Initialized for Mr Ahmed Abd El-Motaal');
  },

  getActiveGroup() {
    const weekObj = WEEKS_DATA[this.currentWeek] || WEEKS_DATA.week5;
    return weekObj[this.currentGroup] || weekObj.groupA;
  },

  getCurrentQuestion() {
    const group = this.getActiveGroup();
    return group.questions[this.currentQuestionIndex];
  },

  switchWeek(weekKey) {
    if (this.currentWeek === weekKey) return;
    this.saveCurrentCanvas();
    this.currentWeek = weekKey;
    this.currentQuestionIndex = 0;
    this.updateWeekButtons();
    if (window.AudioEngine) AudioEngine.click();
    this.renderQuestion();
  },

  updateWeekButtons() {
    ['week2', 'week3', 'week4', 'week5'].forEach(w => {
      const btn = document.getElementById(`btn${w.charAt(0).toUpperCase() + w.slice(1)}`);
      if (btn) {
        btn.classList.toggle('active', this.currentWeek === w);
      }
    });

    const stageBadge = document.getElementById('headerStageBadge');
    if (WEEKS_DATA[this.currentWeek]) {
      document.title = `${WEEKS_DATA[this.currentWeek].title} • Mr Ahmed Abd El-Motaal`;
      if (stageBadge) {
        stageBadge.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${WEEKS_DATA[this.currentWeek].stageName}`;
      }
    }
  },

  switchGroup(groupId) {
    if (this.currentGroup === groupId) return;
    this.saveCurrentCanvas();
    this.currentGroup = groupId;
    this.currentQuestionIndex = 0;

    document.querySelectorAll('.group-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tab${groupId.charAt(0).toUpperCase() + groupId.slice(1)}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (window.AudioEngine) AudioEngine.click();
    this.renderQuestion();
  },

  cycleGroup() {
    const groups = ['groupA', 'groupB', 'groupC'];
    const nextIdx = (groups.indexOf(this.currentGroup) + 1) % groups.length;
    this.switchGroup(groups[nextIdx]);
  },

  goToQuestion(index) {
    if (this.currentQuestionIndex === index) return;
    this.saveCurrentCanvas();
    this.currentQuestionIndex = index;
    if (window.AudioEngine) AudioEngine.click();
    this.renderQuestion();
  },

  nextQuestion() {
    const group = this.getActiveGroup();
    if (this.currentQuestionIndex < group.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    } else {
      this.cycleGroup();
    }
  },

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  },

  renderQuestion() {
    const q = this.getCurrentQuestion();
    const group = this.getActiveGroup();

    // 1. Update Pill Tag
    const pillText = document.getElementById('cardPillText');
    if (pillText) {
      pillText.innerText = `${group.title} • Q${q.questionNum}: ${q.title}`;
    }

    // 2. Update Question Stepper
    const stepperContainer = document.getElementById('questionStepperRow');
    if (stepperContainer) {
      stepperContainer.querySelectorAll('.q-step-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === this.currentQuestionIndex);
        const checkQ = group.questions[idx];
        const hasDraw = !!(checkQ && this.canvasBuffers[checkQ.id]);
        btn.classList.toggle('has-draw', hasDraw);
      });
    }

    // 3. Update Category & Statement
    const catLabel = document.getElementById('questionCategoryLabel');
    if (catLabel) catLabel.innerText = q.category;

    const statementEl = document.getElementById('questionStatementText');
    if (statementEl) {
      statementEl.innerHTML = q.prompt;
    }

    // 4. Render MCQ Options (or hide if word problem)
    const mcqWrapper = document.getElementById('mcqOptionsWrapper');
    if (mcqWrapper) {
      if (q.type === 'mcq' && q.options) {
        mcqWrapper.style.display = 'grid';
        mcqWrapper.innerHTML = q.options.map(opt => {
          const isSelected = this.userSelectedOptions[q.id] === opt.key;
          let extraClass = '';
          if (isSelected) {
            extraClass = opt.isCorrect ? 'correct' : 'incorrect';
          }
          return `
            <div class="mcq-option-card ${extraClass}" onclick="AssessmentApp.selectOption('${q.id}', '${opt.key}')">
              <span class="mcq-option-letter">${opt.key.toUpperCase()}</span>
              <span class="mcq-option-text">${opt.text}</span>
            </div>
          `;
        }).join('');
      } else {
        mcqWrapper.style.display = 'none';
        mcqWrapper.innerHTML = '';
      }
    }

    // 5. Render Model Solution (keep closed by default)
    const solDrawer = document.getElementById('modelSolutionContent');
    const solBtn = document.getElementById('btnToggleModelSolution');
    if (solDrawer) {
      solDrawer.classList.remove('open');
      solDrawer.innerHTML = q.modelSolution;
    }
    if (solBtn) {
      solBtn.innerHTML = '<i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>';
    }

    // 6. Restore Canvas Drawing for this Question
    this.restoreCanvasForQuestion(q.id);

    // 7. Render KaTeX Math
    this.renderMath();

    // 8. Reset timer for current question
    this.resetTimerDisplay();
  },

  renderMath() {
    if (window.renderMathInElement) {
      const card = document.getElementById('activeQuestionCard');
      if (card) {
        try {
          renderMathInElement(card, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.warn('KaTeX render error:', e);
        }
      }
    }
  },

  selectOption(questionId, optionKey) {
    const q = this.getCurrentQuestion();
    if (q.id !== questionId || q.type !== 'mcq') return;

    this.userSelectedOptions[questionId] = optionKey;
    const selectedOpt = q.options.find(o => o.key === optionKey);

    if (window.AudioEngine) {
      if (selectedOpt && selectedOpt.isCorrect) {
        AudioEngine.success();
      } else {
        AudioEngine.wrong();
      }
    }

    const mcqWrapper = document.getElementById('mcqOptionsWrapper');
    if (mcqWrapper) {
      mcqWrapper.querySelectorAll('.mcq-option-card').forEach((card, idx) => {
        const opt = q.options[idx];
        card.classList.remove('correct', 'incorrect');
        if (opt.key === optionKey) {
          card.classList.add(opt.isCorrect ? 'correct' : 'incorrect');
        }
      });
    }
  },

  toggleModelSolution() {
    const solDrawer = document.getElementById('modelSolutionContent');
    const solBtn = document.getElementById('btnToggleModelSolution');
    if (!solDrawer || !solBtn) return;

    const isOpen = solDrawer.classList.contains('open');
    if (isOpen) {
      solDrawer.classList.remove('open');
      solBtn.innerHTML = '<i class="fa-solid fa-eye"></i> <span>Show Model Solution</span>';
    } else {
      solDrawer.classList.add('open');
      solBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Hide Model Solution</span>';
      this.renderMath();
    }
    if (window.AudioEngine) AudioEngine.click();
  },

  resetCurrentQuestion() {
    const q = this.getCurrentQuestion();
    delete this.userSelectedOptions[q.id];
    this.clearCurrentScratchpad();
    this.resetTimerDisplay();
    this.renderQuestion();
    if (window.AudioEngine) AudioEngine.click();
  },

  /* ==========================================================================
     NOTEBOOK CANVAS ENGINE (STYLUS / PALM REJECTION / DRAWING)
     ========================================================================== */
  initCanvasEvents() {
    const c = this.canvasEl;
    if (!c) return;

    c.addEventListener('pointerdown', (e) => this.startDraw(e));
    c.addEventListener('pointermove', (e) => this.draw(e));
    c.addEventListener('pointerup', (e) => this.stopDraw(e));
    c.addEventListener('pointercancel', (e) => this.stopDraw(e));

    c.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    c.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  },

  resizeCanvas(restore = false) {
    if (!this.canvasEl) return;
    const wrap = document.getElementById('notebookPaperWrapper');
    if (!wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const width = wrap.clientWidth || 800;
    const height = this.canvasHeight;

    wrap.style.height = height + 'px';

    const oldData = restore ? this.canvasEl.toDataURL() : null;

    this.canvasEl.width = width * dpr;
    this.canvasEl.height = height * dpr;
    this.canvasEl.style.width = width + 'px';
    this.canvasEl.style.height = height + 'px';

    this.ctx.scale(dpr, dpr);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (oldData) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = oldData;
    }
  },

  adjustCanvasHeight(delta) {
    this.canvasHeight = Math.max(200, Math.min(800, this.canvasHeight + delta));
    this.resizeCanvas(true);
    if (window.AudioEngine) AudioEngine.click();
  },

  startDraw(e) {
    e.preventDefault();
    if (!this.ctx || !this.canvasEl) return;

    this.isDrawing = true;

    const q = this.getCurrentQuestion();
    if (!this.canvasHistory[q.id]) this.canvasHistory[q.id] = [];
    if (!this.canvasRedoStack[q.id]) this.canvasRedoStack[q.id] = [];

    const snapshot = this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.canvasHistory[q.id].push(snapshot);
    if (this.canvasHistory[q.id].length > 25) this.canvasHistory[q.id].shift();
    this.canvasRedoStack[q.id] = [];

    const rect = this.canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.prevX = x;
    this.prevY = y;
    this.lastMidX = x;
    this.lastMidY = y;
    this.hasMoved = false;

    let strokeW = this.currentStrokeWidth;
    if (e.pointerType === 'pen' && typeof e.pressure === 'number' && e.pressure > 0) {
      strokeW = Math.max(1, strokeW * (0.4 + 1.2 * e.pressure));
    }

    this.ctx.save();
    if (this.isEraser) {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.currentStrokeWidth * 4;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.fillStyle = this.currentColor;
      this.ctx.lineWidth = strokeW;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.isEraser ? strokeW * 2 : strokeW / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  },

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();

    const rect = this.canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = (this.prevX + x) / 2;
    const midY = (this.prevY + y) / 2;

    let strokeW = this.currentStrokeWidth;
    if (e.pointerType === 'pen' && typeof e.pressure === 'number' && e.pressure > 0) {
      strokeW = Math.max(1, strokeW * (0.4 + 1.2 * e.pressure));
    }

    this.ctx.save();
    if (this.isEraser) {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.currentStrokeWidth * 4;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = strokeW;
    }

    this.ctx.beginPath();
    if (!this.hasMoved) {
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(midX, midY);
    } else {
      this.ctx.moveTo(this.lastMidX, this.lastMidY);
      this.ctx.quadraticCurveTo(this.prevX, this.prevY, midX, midY);
    }
    this.ctx.stroke();
    this.ctx.restore();

    this.lastMidX = midX;
    this.lastMidY = midY;
    this.prevX = x;
    this.prevY = y;
    this.hasMoved = true;
  },

  stopDraw(e) {
    if (!this.isDrawing) return;
    if (e) e.preventDefault();
    this.isDrawing = false;

    this.saveCurrentCanvas();

    const stepperContainer = document.getElementById('questionStepperRow');
    if (stepperContainer) {
      const activeStepBtn = stepperContainer.children[this.currentQuestionIndex];
      if (activeStepBtn) activeStepBtn.classList.add('has-draw');
    }
  },

  saveCurrentCanvas() {
    if (!this.canvasEl) return;
    const q = this.getCurrentQuestion();
    if (!q) return;
    try {
      this.canvasBuffers[q.id] = this.canvasEl.toDataURL();
    } catch (err) {
      console.warn('Canvas save error:', err);
    }
  },

  restoreCanvasForQuestion(questionId) {
    if (!this.ctx || !this.canvasEl) return;
    const wrap = document.getElementById('notebookPaperWrapper');
    const width = wrap ? wrap.clientWidth : 800;
    const height = this.canvasHeight;

    this.ctx.clearRect(0, 0, width, height);

    const savedData = this.canvasBuffers[questionId];
    if (savedData) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = savedData;
    }
  },

  undoCurrentCanvas() {
    const q = this.getCurrentQuestion();
    const history = this.canvasHistory[q.id];
    if (!history || history.length === 0) return;

    if (!this.canvasRedoStack[q.id]) this.canvasRedoStack[q.id] = [];
    const curSnap = this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.canvasRedoStack[q.id].push(curSnap);

    const prevState = history.pop();
    this.ctx.putImageData(prevState, 0, 0);
    this.saveCurrentCanvas();
    if (window.AudioEngine) AudioEngine.click();
  },

  redoCurrentCanvas() {
    const q = this.getCurrentQuestion();
    const redoStack = this.canvasRedoStack[q.id];
    if (!redoStack || redoStack.length === 0) return;

    if (!this.canvasHistory[q.id]) this.canvasHistory[q.id] = [];
    const curSnap = this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.canvasHistory[q.id].push(curSnap);

    const nextState = redoStack.pop();
    this.ctx.putImageData(nextState, 0, 0);
    this.saveCurrentCanvas();
    if (window.AudioEngine) AudioEngine.click();
  },

  clearCurrentScratchpad() {
    if (!this.ctx || !this.canvasEl) return;
    const wrap = document.getElementById('notebookPaperWrapper');
    const width = wrap ? wrap.clientWidth : 800;
    const height = this.canvasHeight;

    const q = this.getCurrentQuestion();
    if (!this.canvasHistory[q.id]) this.canvasHistory[q.id] = [];
    this.canvasHistory[q.id].push(this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));

    this.ctx.clearRect(0, 0, width, height);
    delete this.canvasBuffers[q.id];

    const stepperContainer = document.getElementById('questionStepperRow');
    if (stepperContainer) {
      const activeStepBtn = stepperContainer.children[this.currentQuestionIndex];
      if (activeStepBtn) activeStepBtn.classList.remove('has-draw');
    }

    if (window.AudioEngine) AudioEngine.click();
  },

  setPenColor(color, el) {
    this.currentColor = color;
    this.isEraser = false;
    document.querySelectorAll('.nb-color-dot').forEach(d => d.classList.remove('active'));
    if (el) el.classList.add('active');

    const penBtn = document.getElementById('nbToolPenBtn');
    const eraserBtn = document.getElementById('nbToolEraserBtn');
    if (penBtn) penBtn.classList.add('active');
    if (eraserBtn) eraserBtn.classList.remove('active');

    if (window.AudioEngine) AudioEngine.click();
  },

  setPenWidth(width) {
    this.currentStrokeWidth = parseFloat(width) || 4;
  },

  setTool(tool, el) {
    this.currentTool = tool;
    this.isEraser = (tool === 'eraser');

    const penBtn = document.getElementById('nbToolPenBtn');
    const eraserBtn = document.getElementById('nbToolEraserBtn');
    if (penBtn) penBtn.classList.toggle('active', !this.isEraser);
    if (eraserBtn) eraserBtn.classList.toggle('active', this.isEraser);

    if (window.AudioEngine) AudioEngine.click();
  },

  toggleEraser(el) {
    this.isEraser = !this.isEraser;
    const penBtn = document.getElementById('nbToolPenBtn');
    const eraserBtn = document.getElementById('nbToolEraserBtn');
    if (penBtn) penBtn.classList.toggle('active', !this.isEraser);
    if (eraserBtn) eraserBtn.classList.toggle('active', this.isEraser);
    if (window.AudioEngine) AudioEngine.click();
  },

  /* ==========================================================================
     TIMER ENGINE (60s COUNTDOWN)
     ========================================================================== */
  toggleTimer() {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  },

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    if (window.AudioEngine) AudioEngine.click();

    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      this.updateTimerDisplay();

      if (this.timerRemaining <= 0) {
        this.stopTimer();
        if (window.AudioEngine) AudioEngine.success();
      }
    }, 1000);
  },

  stopTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  },

  resetTimerDisplay() {
    this.stopTimer();
    this.timerRemaining = this.timerDuration;
    this.updateTimerDisplay();
  },

  updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    const mins = Math.floor(this.timerRemaining / 60);
    const secs = this.timerRemaining % 60;
    display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /* ==========================================================================
     EXPORT SNAPSHOT IMAGE (CAMERA BUTTON)
     ========================================================================== */
  exportCurrentCardImage() {
    const q = this.getCurrentQuestion();
    const card = document.getElementById('activeQuestionCard');
    if (!card) return;

    if (window.AudioEngine) AudioEngine.click();

    const tempCanvas = document.createElement('canvas');
    const rect = card.getBoundingClientRect();
    tempCanvas.width = rect.width * 2;
    tempCanvas.height = rect.height * 2;
    const ctx = tempCanvas.getContext('2d');
    ctx.scale(2, 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = '#182038';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText(`Mr Ahmed Abd El-Motaal • ${q.title}`, 24, 38);

    if (this.canvasEl) {
      ctx.drawImage(this.canvasEl, 24, 60, rect.width - 48, this.canvasHeight);
    }

    const a = document.createElement('a');
    a.download = `Math_${this.currentWeek}_${this.currentGroup}_Q${q.questionNum}.png`;
    a.href = tempCanvas.toDataURL('image/png');
    a.click();
  }
};

/* ==========================================================================
   GLOBAL HELPERS & APP INITIALIZATION
   ========================================================================== */
function toggleAppTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('math_theme', next);
  updateThemeIcon(next);
  if (window.AudioEngine) AudioEngine.click();
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun" style="color:#fdcb6e;"></i>'
    : '<i class="fa-solid fa-moon"></i>';
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
  if (window.AudioEngine) AudioEngine.click();
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('math_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  AssessmentApp.init();

  if (typeof FullScreenPen !== 'undefined' && typeof FullScreenPen.init === 'function') {
    try { FullScreenPen.init(); } catch (e) { console.warn('FullScreenPen init error:', e); }
  }
  if (typeof InfiniteWhiteboard !== 'undefined' && typeof InfiniteWhiteboard.init === 'function') {
    try { InfiniteWhiteboard.init(); } catch (e) { console.warn('InfiniteWhiteboard init error:', e); }
  }
});

