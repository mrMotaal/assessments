// ==========================================================================
// UNIT 2: ALGEBRA • LESSON 2-1: QUADRATIC FUNCTION
// Official Egyptian Prep 3 / Grade 9 Mathematics Curriculum (English Edition)
// Prepared for: Mr Ahmed Abd El-Motaal (Math Teacher & Content Creator)
// ==========================================================================

const LESSON_QUADRATIC = {
  key: 'quadratic',
  unitTag: '<i class="fa-solid fa-chart-line"></i> Unit 2: Algebra • Lesson 2-1',
  title: 'Lesson 2-1: Quadratic Function',
  subtitle: 'Master the Standard Form $f(x) = ax^2 + bx + c$, Vertex Form $a(x-h)^2 + k$, Parabola Graphing, Vertex & Axis of Symmetry Formulas, Maximum/Minimum Extrema, and Real-World Projectile Trajectories.',
  stageBadge: '<i class="fa-solid fa-graduation-cap"></i> Prep 3 • Unit 2: Algebra • Lesson 2-1: Quadratic Function',

  // ========================================================================
  // PRE-STUDY & PREREQUISITES REVIEW (CHECK YOUR READINESS)
  // ========================================================================
  preStudy: {
    title: 'Pre-Study: Check Your Readiness',
    subtitle: 'Review the fundamental mathematical concepts required to master Quadratic Functions.',
    cards: [
      {
        icon: 'fa-solid fa-superscript',
        iconBg: '#6c5ce7',
        title: '1. Polynomial Degrees & Function Types',
        desc: `
          The <strong>degree</strong> of a polynomial in one variable is the highest exponent of $x$ with a non-zero coefficient:
          <div class="pre-study-formula-box">
            • <strong>Degree 0 (Constant Function):</strong> $f(x) = c$ &rarr; Graph is a horizontal line.<br>
            • <strong>Degree 1 (Linear Function):</strong> $f(x) = ax + b$ ($a \\ne 0$) &rarr; Graph is an oblique straight line.<br>
            • <strong>Degree 2 (Quadratic Function):</strong> $f(x) = ax^2 + bx + c$ ($a \\ne 0$) &rarr; Graph is a smooth curve called a <strong>Parabola</strong>.
          </div>
        `
      },
      {
        icon: 'fa-solid fa-calculator',
        iconBg: '#00b894',
        title: '2. Substitution & Negative Sign Mastery',
        desc: `
          Evaluating $f(k)$ means replacing every occurrence of $x$ with the number $k$. Beware the sign rule:
          <div class="pre-study-formula-box">
            • <strong>Parentheses Squaring:</strong> $(-3)^2 = (-3) \\times (-3) = +9$<br>
            • <strong>Negative Before Squared Term:</strong> $-3^2 = -(3 \\times 3) = -9$<br>
            • <strong>Example:</strong> For $f(x) = -x^2 + 5$, then $f(-2) = -(-2)^2 + 5 = -4 + 5 = 1$.
          </div>
        `
      },
      {
        icon: 'fa-solid fa-expand',
        iconBg: '#fdcb6e',
        title: '3. Expanding Binomial Squares (Perfect Squares)',
        desc: `
          Crucial for transitioning between <em>Vertex Form</em> and <em>Standard Form</em>:
          <div class="pre-study-formula-box">
            $$(x \\pm h)^2 = x^2 \\pm 2hx + h^2$$
            • $(x - 3)^2 = x^2 - 6x + 9$<br>
            • $(x + 2)^2 = (x - (-2))^2 = x^2 + 4x + 4$ &rarr; Note that $h = -2$!
          </div>
        `
      },
      {
        icon: 'fa-solid fa-arrows-split-up-and-left',
        iconBg: '#eb4d4b',
        title: '4. The Cartesian Plane & Vertical Symmetry',
        desc: `
          Every vertical line has equation $x = h$. A parabola is perfectly symmetrical about its <strong>axis of symmetry</strong>:
          <div class="pre-study-formula-box">
            Points on the curve at equal vertical heights $y$ are equidistant from the axis $x = h$.
            The midpoint between any two symmetric points gives the $x$-coordinate of the vertex!
          </div>
        `
      }
    ],

    diagnosticQuestions: [
      {
        id: 'diag-q1',
        text: '1. What is the degree of the polynomial function $f(x) = x(x - 4) + 7$?',
        options: ['Degree 1 (Linear)', 'Degree 0 (Constant)', 'Degree 2 (Quadratic)', 'Degree 3 (Cubic)'],
        correct: 2,
        explanation: 'Expanding gives $f(x) = x^2 - 4x + 7$. The highest exponent of $x$ is 2, so it is a Quadratic Function of Degree 2.'
      },
      {
        id: 'diag-q2',
        text: '2. If $f(x) = 1 - x^2$, what is the exact value of $f(-3)$?',
        options: ['-8', '10', '-5', '8'],
        correct: 0,
        explanation: '$f(-3) = 1 - (-3)^2 = 1 - 9 = -8$. Remember that $(-3)^2 = +9$, preceded by the minus sign.'
      },
      {
        id: 'diag-q3',
        text: '3. Which expression is the algebraic expansion of $(x - 5)^2$?',
        options: ['$x^2 - 25$', '$x^2 + 25$', '$x^2 - 5x + 25$', '$x^2 - 10x + 25$'],
        correct: 3,
        explanation: 'Using $(a - b)^2 = a^2 - 2ab + b^2$, we get $x^2 - 2(x)(5) + 5^2 = x^2 - 10x + 25$.'
      }
    ]
  },

  // ========================================================================
  // REAL-WORLD APPLICATIONS (PAGES 1, 5, 8 OF TEXTBOOK)
  // ========================================================================
  realWorldApps: [
    {
      accent: '#0984e3',
      accentBg: 'rgba(9, 132, 227, 0.12)',
      icon: 'fa-solid fa-water',
      tag: 'Marine Acrobatics & Kinematics',
      title: 'Dolphin Leap Trajectory',
      desc: 'In marine biology and physics, fluid dynamics models aquatic leaps using projectile parabolas. The curve $f(x) = -0.2x^2 + 2x$ maps horizontal distance against vertical clearance.',
      svg: `
        <div class="math-svg-container">
          <svg width="360" height="180" viewBox="0 0 360 180">
            <!-- Sky and Water -->
            <rect x="0" y="0" width="360" height="130" fill="rgba(116, 185, 255, 0.15)"/>
            <rect x="0" y="130" width="360" height="50" fill="rgba(9, 132, 227, 0.3)"/>
            <line x1="20" y1="130" x2="340" y2="130" stroke="#0984e3" stroke-width="2.5"/>
            <!-- Grid Lines -->
            <line x1="180" y1="20" x2="180" y2="130" stroke="#eb4d4b" stroke-dasharray="4,4" stroke-width="2"/>
            <!-- Parabolic Leap Arc -->
            <path d="M 40,130 Q 180,10 320,130" fill="none" stroke="#0984e3" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Vertex Point -->
            <circle cx="180" cy="40" r="6" fill="#fdcb6e" stroke="#2d3436" stroke-width="2"/>
            <text x="190" y="38" fill="#182038" font-size="12" font-weight="900">Peak: (5, 5m)</text>
            <!-- Launch and Landing -->
            <circle cx="40" cy="130" r="4" fill="#00b894"/>
            <circle cx="320" cy="130" r="4" fill="#00b894"/>
            <text x="35" y="150" fill="#2d3436" font-size="11" font-weight="700">0 m</text>
            <text x="305" y="150" fill="#2d3436" font-size="11" font-weight="700">10 m</text>
            <text x="160" y="150" fill="#eb4d4b" font-size="11" font-weight="800">x = 5 m</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Peak Altitude</span> $f(x) = -0.2x^2 + 2x$ &bull; Max Height $= 5\\text{ meters}$ at $x = 5\\text{ m}$.
          </div>
        </div>
      `,
      commentaryHtml: `
        <strong>Kinematic Parabolic Modeling:</strong><br>
        The quadratic coefficient $a = -0.2 < 0$ produces a downward-opening parabola with a peak vertex at $x = -\\frac{b}{2a} = -\\frac{2}{2(-0.2)} = 5\\text{ meters}$. Evaluating $f(5) = -0.2(25) + 2(5) = 5\\text{ meters}$ confirms that the dolphin attains its maximum altitude of $5\\text{ m}$ precisely at the midpoint of its 10-meter leap.
      `
    },
    {
      accent: '#e17055',
      accentBg: 'rgba(225, 112, 85, 0.12)',
      icon: 'fa-solid fa-basketball',
      tag: 'Sports Science & Ballistics',
      title: 'Basketball Arc & Trajectory Analysis',
      desc: 'Sports biomechanics models basketball shooting arcs through vertex form parabolas $f(x) = a(x - h)^2 + k$, revealing the precise mathematical conditions required to clear the rim.',
      svg: `
        <div class="math-svg-container">
          <svg width="360" height="180" viewBox="0 0 360 180">
            <!-- Floor -->
            <line x1="20" y1="160" x2="340" y2="160" stroke="#636e72" stroke-width="2"/>
            <!-- Hoop Stand -->
            <line x1="310" y1="160" x2="310" y2="95" stroke="#2d3436" stroke-width="3"/>
            <rect x="300" y="90" width="20" height="6" rx="2" fill="#e17055"/>
            <!-- Basketball Arc -->
            <path d="M 40,130 Q 160,35 310,95" fill="none" stroke="#e17055" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Vertex -->
            <circle cx="160" cy="50" r="5" fill="#fdcb6e" stroke="#2d3436" stroke-width="2"/>
            <text x="140" y="38" fill="#182038" font-size="11" font-weight="800">Apex (3, 6m)</text>
            <!-- Hoop Point Target -->
            <circle cx="310" cy="95" r="6" fill="#00b894"/>
            <text x="260" y="85" fill="#00b894" font-size="11" font-weight="800">Hoop (7, 3)</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Trajectory Test</span> $f(7) = -\\frac{1}{3}(7 - 3)^2 + 6 = \\frac{2}{3} \\approx 0.67\\text{ m} \\ne 3\\text{ m}$.
          </div>
        </div>
      `,
      commentaryHtml: `
        <strong>Vertex Form Trajectory Proof:</strong><br>
        With vertex form $f(x) = -\\frac{1}{3}(x - 3)^2 + 6$, the ball achieves its apex of $6\\text{ meters}$ at $x = 3\\text{ meters}$. Evaluating the flight path at the basket distance $x = 7$ yields $f(7) = -\\frac{1}{3}(16) + 6 = \\frac{2}{3}\\text{ m} \\approx 0.67\\text{ m}$. Because this height is well below the 3-meter hoop, the trajectory falls short of the target.
      `
    },
    {
      accent: '#00b894',
      accentBg: 'rgba(0, 184, 148, 0.12)',
      icon: 'fa-solid fa-futbol',
      tag: 'Kinematics & Physics',
      title: 'Football Projectile Peak & Flight Time',
      desc: 'Gravitational acceleration ($g = 9.8\\text{ m/s}^2$) governs the symmetric flight of a kicked soccer ball, modeled by second-degree polynomial functions.',
      svg: `
        <div class="math-svg-container">
          <svg width="360" height="190" viewBox="0 0 360 190">
            <!-- Ground -->
            <line x1="30" y1="160" x2="330" y2="160" stroke="#00b894" stroke-width="2.5"/>
            <!-- Parabolic Flight Curve -->
            <path d="M 40,160 Q 180,20 320,160" fill="none" stroke="#2d3436" stroke-width="3" stroke-dasharray="2,2"/>
            <path d="M 40,160 Q 180,20 320,160" fill="none" stroke="#00b894" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Vertex Apex -->
            <circle cx="180" cy="35" r="6" fill="#fdcb6e" stroke="#2d3436" stroke-width="2"/>
            <text x="190" y="32" fill="#182038" font-size="12" font-weight="900">Vertex: (2s, 19.6m)</text>
            <!-- Axis of Symmetry -->
            <line x1="180" y1="35" x2="180" y2="160" stroke="#eb4d4b" stroke-dasharray="3,3" stroke-width="2"/>
            <!-- Time Markers -->
            <text x="35" y="175" fill="#2d3436" font-size="11" font-weight="700">t = 0s</text>
            <text x="165" y="175" fill="#eb4d4b" font-size="11" font-weight="800">t = 2s</text>
            <text x="305" y="175" fill="#2d3436" font-size="11" font-weight="700">t = 4s</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Peak Flight</span> Apex reached at $t = 2\\text{ seconds}$ with maximum altitude $19.6\\text{ meters}$.
          </div>
        </div>
      `,
      commentaryHtml: `
        <strong>Gravitational Kinematics:</strong><br>
        For $h(t) = -4.9t^2 + 19.6t$, time to reach the apex is $t = -\\frac{b}{2a} = -\\frac{19.6}{2(-4.9)} = 2\\text{ seconds}$. The ball ascends to a peak altitude of $h(2) = 19.6\\text{ meters}$ before symmetrically returning to earth at $t = 4\\text{ seconds}$.
      `
    }
  ],

  // ========================================================================
  // CORE FOUNDATION & MATHEMATICAL ENCYCLOPEDIA (PAGES 1, 2, 4 OF TEXTBOOK)
  // ========================================================================
  foundation: {
    title: 'Core Mathematical Foundation: Quadratic Functions & Parabolas',
    subtitle: 'Formal definitions, standard and vertex representations, and geometric properties.',
    rules: [
      {
        num: '1',
        title: 'Definition & Domain of a Quadratic Function',
        desc: 'A quadratic function is a second-degree polynomial function in one variable of the form $f(x) = ax^2 + bx + c$, where $a, b, c \\in \\mathbb{R}$ and $a \\ne 0$. Its domain is the set of all real numbers $\\mathbb{R}$. Its geometric graph is a smooth, continuous U-shaped curve known as a <strong>Parabola</strong>.'
      },
      {
        num: '2',
        title: 'Standard Form: $f(x) = ax^2 + bx + c$',
        desc: '• <strong>x-coordinate of the Vertex:</strong> $x = -\\frac{b}{2a}$.<br>• <strong>y-coordinate of the Vertex:</strong> $y = f\\left(-\\frac{b}{2a}\\right)$.<br>• <strong>Axis of Symmetry:</strong> Vertical line $x = -\\frac{b}{2a}$.<br>• <strong>y-intercept:</strong> Point $(0, c)$ since $f(0) = c$.'
      },
      {
        num: '3',
        title: 'Vertex Form: $f(x) = a(x - h)^2 + k$',
        desc: '• <strong>Vertex Point:</strong> Exactly $(h, k)$.<br>• <strong>Axis of Symmetry:</strong> Vertical line $x = h$.<br>• <strong>Sign Alert:</strong> For $f(x) = (x + 3)^2 + 1$, write it as $(x - (-3))^2 + 1$, giving vertex $(-3, 1)$.'
      },
      {
        num: '4',
        title: 'Orientation & Extrema (Maximum vs Minimum)',
        desc: '• If $a > 0$: Parabola <strong>opens upward</strong> (&cup;); the vertex is a <strong>Minimum Point</strong>, with minimum value $y = k = f\\left(-\\frac{b}{2a}\\right)$.<br>• If $a < 0$: Parabola <strong>opens downward</strong> (&cap;); the vertex is a <strong>Maximum Point</strong>, with maximum value $y = k = f\\left(-\\frac{b}{2a}\\right)$.'
      }
    ]
  },

  specialCases: [
    {
      icon: 'fa-solid fa-arrows-up-down',
      title: 'Parabola Orientation & Vertex Extrema',
      diagramSvg: `
        <svg width="240" height="120" viewBox="0 0 240 120">
          <!-- a > 0 Upward -->
          <g transform="translate(15, 10)">
            <line x1="0" y1="90" x2="90" y2="90" stroke="#b2bec3" stroke-width="1.5"/>
            <line x1="45" y1="10" x2="45" y2="100" stroke="#b2bec3" stroke-width="1.5"/>
            <path d="M 15,30 Q 45,95 75,30" fill="none" stroke="#00b894" stroke-width="3"/>
            <circle cx="45" cy="80" r="4" fill="#fdcb6e"/>
            <text x="25" y="110" fill="#00b894" font-size="10" font-weight="800">a &gt; 0 (Min Value)</text>
          </g>
          <!-- a < 0 Downward -->
          <g transform="translate(135, 10)">
            <line x1="0" y1="90" x2="90" y2="90" stroke="#b2bec3" stroke-width="1.5"/>
            <line x1="45" y1="10" x2="45" y2="100" stroke="#b2bec3" stroke-width="1.5"/>
            <path d="M 15,80 Q 45,15 75,80" fill="none" stroke="#eb4d4b" stroke-width="3"/>
            <circle cx="45" cy="27" r="4" fill="#fdcb6e"/>
            <text x="25" y="110" fill="#eb4d4b" font-size="10" font-weight="800">a &lt; 0 (Max Value)</text>
          </g>
        </svg>
      `,
      items: [
        '<strong>When $a > 0$:</strong> Parabola curves upward, having a valley at the minimum vertex.',
        '<strong>When $a < 0$:</strong> Parabola curves downward, having a peak at the maximum vertex.',
        '<strong>Axis of Symmetry:</strong> Divides the parabola into two congruent reflectional halves.'
      ]
    },
    {
      icon: 'fa-solid fa-shapes',
      title: 'Standard Form vs. Vertex Form Conversion',
      diagramSvg: `
        <svg width="240" height="120" viewBox="0 0 240 120">
          <rect x="10" y="15" width="100" height="40" rx="8" fill="rgba(108, 92, 231, 0.15)" stroke="#6c5ce7" stroke-width="1.5"/>
          <text x="18" y="38" fill="#6c5ce7" font-size="10" font-weight="800">ax² + bx + c</text>
          <path d="M 115,35 L 135,35" stroke="#2d3436" stroke-width="2" marker-end="url(#arrow)"/>
          <rect x="140" y="15" width="90" height="40" rx="8" fill="rgba(0, 184, 148, 0.15)" stroke="#00b894" stroke-width="1.5"/>
          <text x="148" y="38" fill="#00b894" font-size="10" font-weight="800">a(x-h)² + k</text>
          <text x="60" y="80" fill="#2d3436" font-size="10" font-weight="700">h = -b / (2a)</text>
          <text x="60" y="100" fill="#2d3436" font-size="10" font-weight="700">k = c - b² / (4a)</text>
        </svg>
      `,
      items: [
        'To find vertex from standard form: Compute $h = -\\frac{b}{2a}$, then $k = f(h)$.',
        'To expand vertex form: Expand $a(x - h)^2 + k = a(x^2 - 2hx + h^2) + k$.',
        'Both forms describe the exact same parabola with identical geometric properties.'
      ]
    }
  ],

  // ========================================================================
  // INSTRUCTIONAL IDEAS & WORKED EXAMPLES (COMPREHENSIVE 8-PAGE COVERAGE)
  // All with pixel-perfect SVG graphs, hidden solutions, & resizable canvases
  // ========================================================================
  ideas: [
    // ----------------------------------------------------------------------
    // IDEA 1: Graphing Standard Form & Table Construction
    // ----------------------------------------------------------------------
    {
      id: '1',
      badge: 'Idea 1 • Standard Form',
      flashcardTitle: 'Graphing & Analyzing Standard Form: $f(x) = ax^2 + bx + c$',
      flashcardText: 'Follow the 4-step algorithm: (1) Find vertex $x = -\\frac{b}{2a}$, (2) Select symmetric $x$-values around the vertex, (3) Construct the table of values, (4) Plot points and draw a smooth parabola.',
      
      // Solved Example 1.1 (Page 2 of Textbook)
      ex1Tag: 'Example 1.1 (Page 2)',
      ex1Q: 'Graph the quadratic function $f(x) = x^2 - 2x - 3$. Identify the axis of symmetry equation and find the maximum or minimum value.',
      ex1Svg: `
        <div class="math-svg-container">
          <svg width="360" height="260" viewBox="0 0 360 260">
            <!-- Grid Lines -->
            <defs>
              <pattern id="grid1" width="30" height="20" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#f1f2f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="360" height="260" fill="url(#grid1)"/>
            
            <!-- Axes: Origin (0,0) at (150, 160) -->
            <!-- X-axis: y=0 at Y=160 -->
            <line x1="20" y1="160" x2="340" y2="160" stroke="#2d3436" stroke-width="2"/>
            <polygon points="340,160 332,156 332,164" fill="#2d3436"/>
            <text x="330" y="178" fill="#2d3436" font-size="12" font-weight="800">x</text>
            
            <!-- Y-axis: x=0 at X=150 -->
            <line x1="150" y1="240" x2="150" y2="20" stroke="#2d3436" stroke-width="2"/>
            <polygon points="150,20 146,28 154,28" fill="#2d3436"/>
            <text x="135" y="30" fill="#2d3436" font-size="12" font-weight="800">y</text>

            <!-- Axis of Symmetry: x = 1 (X = 180) -->
            <line x1="180" y1="20" x2="180" y2="250" stroke="#eb4d4b" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="185" y="35" fill="#eb4d4b" font-size="11" font-weight="800">Axis: x = 1</text>

            <!-- Exact Pixel-by-Pixel Parabola: f(x) = x² - 2x - 3 -->
            <path d="M 80,30 Q 180,340 280,30" fill="none" stroke="#6c5ce7" stroke-width="3.5" stroke-linecap="round"/>

            <!-- Plotted Points -->
            <circle cx="90" cy="60" r="4.5" fill="#6c5ce7"/>
            <circle cx="120" cy="160" r="5" fill="#00b894"/>
            <circle cx="150" cy="220" r="4.5" fill="#fdcb6e"/>
            <circle cx="180" cy="240" r="6.5" fill="#eb4d4b" stroke="#fff" stroke-width="2"/>
            <circle cx="210" cy="220" r="4.5" fill="#fdcb6e"/>
            <circle cx="240" cy="160" r="5" fill="#00b894"/>
            <circle cx="270" cy="60" r="4.5" fill="#6c5ce7"/>

            <!-- Labels -->
            <text x="185" y="250" fill="#eb4d4b" font-size="11" font-weight="900">Vertex (1, -4)</text>
            <text x="95" y="152" fill="#00b894" font-size="10" font-weight="700">(-1, 0)</text>
            <text x="245" y="152" fill="#00b894" font-size="10" font-weight="700">(3, 0)</text>
            <text x="155" y="215" fill="#2d3436" font-size="10" font-weight="700">(0, -3)</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Precision Plot</span> $f(x) = x^2 - 2x - 3$ &bull; Vertex $(1, -4)$ &bull; Min Value $= -4$.
          </div>
        </div>
      `,
      ex1Steps: [
        { num: 'Step 1', text: 'Identify coefficients: $a = 1$, $b = -2$, $c = -3$. Since $a > 0$, the parabola opens <strong>upward</strong>.' },
        { num: 'Step 2', text: 'Find $x$-coordinate of the vertex: $x = -\\frac{b}{2a} = -\\frac{-2}{2(1)} = \\mathbf{1}$. Axis of symmetry equation is $\\mathbf{x = 1}$.' },
        { num: 'Step 3', text: 'Construct symmetric table: values $\\{-2, -1, 0, 1, 2, 3, 4\\}$ centered around $x = 1$.<br>• $f(-2) = 5$, $f(-1) = 0$, $f(0) = -3$<br>• $f(1) = 1^2 - 2(1) - 3 = \\mathbf{-4}$ (Vertex)<br>• $f(2) = -3$, $f(3) = 0$, $f(4) = 5$.' },
        { num: 'Step 4', text: 'Determine extremum: Since the curve opens upward, the vertex is a minimum point. The <strong>minimum value</strong> is $\\mathbf{-4}$.' }
      ],
      ex1Ans: 'Axis of Symmetry: x = 1 • Vertex: (1, -4) • Minimum Value: -4',

      // Solved Example 1.2 (Page 2 & 3 of Textbook)
      ex2Tag: 'Example 1.2 (Downward Parabola)',
      ex2Q: 'Graph $f(x) = -x^2 + 6x - 5$. State the vertex coordinates, axis of symmetry, and the maximum value.',
      ex2Svg: `
        <div class="math-svg-container">
          <svg width="360" height="260" viewBox="0 0 360 260">
            <!-- Grid Lines -->
            <defs>
              <pattern id="grid2" width="30" height="20" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#f1f2f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="360" height="260" fill="url(#grid2)"/>
            
            <!-- Axes: Origin (0,0) at (80, 190) -->
            <!-- X-axis at Y=190 -->
            <line x1="20" y1="190" x2="340" y2="190" stroke="#2d3436" stroke-width="2"/>
            <polygon points="340,190 332,186 332,194" fill="#2d3436"/>
            <text x="330" y="208" fill="#2d3436" font-size="12" font-weight="800">x</text>
            
            <!-- Y-axis at X=80 -->
            <line x1="80" y1="250" x2="80" y2="20" stroke="#2d3436" stroke-width="2"/>
            <polygon points="80,20 76,28 84,28" fill="#2d3436"/>
            <text x="65" y="30" fill="#2d3436" font-size="12" font-weight="800">y</text>

            <!-- Axis of Symmetry: x = 3 (X = 170) -->
            <line x1="170" y1="20" x2="170" y2="250" stroke="#eb4d4b" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="175" y="35" fill="#eb4d4b" font-size="11" font-weight="800">Axis: x = 3</text>

            <!-- Parabola: f(x) = -x² + 6x - 5 -->
            <path d="M 60,250 Q 170,-30 280,250" fill="none" stroke="#e17055" stroke-width="3.5" stroke-linecap="round"/>

            <!-- Points -->
            <circle cx="80" cy="250" r="4.5" fill="#fdcb6e"/>
            <circle cx="110" cy="190" r="5" fill="#00b894"/>
            <circle cx="140" cy="130" r="4.5" fill="#e17055"/>
            <circle cx="170" cy="110" r="6.5" fill="#eb4d4b" stroke="#fff" stroke-width="2"/>
            <circle cx="200" cy="130" r="4.5" fill="#e17055"/>
            <circle cx="230" cy="190" r="5" fill="#00b894"/>
            <circle cx="260" cy="250" r="4.5" fill="#fdcb6e"/>

            <text x="180" y="105" fill="#eb4d4b" font-size="11" font-weight="900">Vertex (3, 4)</text>
            <text x="100" y="180" fill="#00b894" font-size="10" font-weight="700">(1, 0)</text>
            <text x="235" y="180" fill="#00b894" font-size="10" font-weight="700">(5, 0)</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Downward Parabola</span> $f(x) = -x^2 + 6x - 5$ &bull; Peak Vertex $(3, 4)$ &bull; Max Value $= 4$.
          </div>
        </div>
      `,
      ex2Steps: [
        { num: 'Step 1', text: 'Coefficients: $a = -1$, $b = 6$, $c = -5$. Since $a < 0$, the parabola opens <strong>downward</strong>.' },
        { num: 'Step 2', text: 'Vertex $x$-coordinate: $x = -\\frac{b}{2a} = -\\frac{6}{2(-1)} = \\mathbf{3}$. Axis of symmetry is $\\mathbf{x = 3}$.' },
        { num: 'Step 3', text: 'Calculate maximum value: $f(3) = -(3)^2 + 6(3) - 5 = -9 + 18 - 5 = \\mathbf{4}$.' },
        { num: 'Step 4', text: 'Roots on x-axis: $-x^2 + 6x - 5 = 0 \\implies x^2 - 6x + 5 = 0 \\implies (x - 1)(x - 5) = 0 \\implies x = 1, 5$.' }
      ],
      ex2Ans: 'Vertex: (3, 4) • Axis: x = 3 • Maximum Value: 4',

      // Try It Yourself 1 (Self-Assessment 1 from Page 2)
      tryBadge: 'Self-Assessment 1 (Page 2)',
      tryPrompt: 'Graph the function $f(x) = 3x - x^2$. On your drawing, clearly indicate the axis of symmetry and find the maximum or minimum value. Also verify whether the point $(6, 21)$ lies on the curve.',
      tryCanvasId: 'can-try1',
      trySolId: 'sol-try1',
      trySolution: `
        <strong>Step-by-Step Model Solution:</strong><br>
        1. <strong>Rewrite in standard form:</strong> $f(x) = -x^2 + 3x + 0$, where $a = -1$, $b = 3$, $c = 0$.<br>
        2. <strong>Vertex x-coordinate:</strong>
        $$x = -\\frac{b}{2a} = -\\frac{3}{2(-1)} = \\frac{3}{2} = 1.5$$
        3. <strong>Vertex y-coordinate (Maximum Value):</strong>
        $$f(1.5) = 3(1.5) - (1.5)^2 = 4.5 - 2.25 = 2.25 = \\frac{9}{4}$$
        Vertex is $(1.5, 2.25)$. Since $a = -1 < 0$, the parabola opens downward and the <strong>maximum value is $2.25$</strong>.<br>
        4. <strong>Axis of Symmetry Equation:</strong> $x = 1.5$.<br>
        5. <strong>Point $(6, 21)$ Verification:</strong><br>
        Substitute $x = 6$: $f(6) = 3(6) - 6^2 = 18 - 36 = -18 \\ne 21$.<br>
        &rarr; Therefore, $(6, 21)$ does <strong>not</strong> lie on the curve.
      `
    },

    // ----------------------------------------------------------------------
    // IDEA 2: Vertex Form & Transformations
    // ----------------------------------------------------------------------
    {
      id: '2',
      badge: 'Idea 2 • Vertex Form',
      flashcardTitle: 'Vertex Form: $f(x) = a(x - h)^2 + k$',
      flashcardText: 'The vertex is directly $(h, k)$ without using formulas! Watch the negative sign inside: $(x - h)$ means $h$ is positive, but $(x + 2)$ means $h = -2$. The vertical line $x = h$ is the axis of symmetry, and $k$ is the maximum or minimum value.',

      // Solved Example 2.1 (Page 4 of Textbook)
      ex1Tag: 'Example 2.1 (Page 4)',
      ex1Q: 'Graph $f(x) = 5 - 2(x + 1)^2$. State the vertex coordinates, axis of symmetry, and the maximum or minimum value.',
      ex1Svg: `
        <div class="math-svg-container">
          <svg width="360" height="240" viewBox="0 0 360 240">
            <!-- Grid Lines -->
            <defs>
              <pattern id="grid3" width="30" height="20" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#f1f2f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="360" height="240" fill="url(#grid3)"/>
            
            <!-- Axes: Origin (0,0) at (180, 160) -->
            <line x1="20" y1="160" x2="340" y2="160" stroke="#2d3436" stroke-width="2"/>
            <polygon points="340,160 332,156 332,164" fill="#2d3436"/>
            <text x="330" y="178" fill="#2d3436" font-size="12" font-weight="800">x</text>
            
            <line x1="180" y1="230" x2="180" y2="20" stroke="#2d3436" stroke-width="2"/>
            <polygon points="180,20 176,28 184,28" fill="#2d3436"/>
            <text x="165" y="30" fill="#2d3436" font-size="12" font-weight="800">y</text>

            <!-- Axis of symmetry: x = -1 (X = 140) -->
            <line x1="140" y1="20" x2="140" y2="230" stroke="#eb4d4b" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="80" y="35" fill="#eb4d4b" font-size="11" font-weight="800">Axis: x = -1</text>

            <!-- Parabola: f(x) = -2(x+1)² + 5 -->
            <path d="M 50,230 Q 140,-50 230,230" fill="none" stroke="#6c5ce7" stroke-width="3.5" stroke-linecap="round"/>

            <circle cx="60" cy="220" r="4.5" fill="#6c5ce7"/>
            <circle cx="100" cy="100" r="4.5" fill="#00b894"/>
            <circle cx="140" cy="60" r="6.5" fill="#eb4d4b" stroke="#fff" stroke-width="2"/>
            <circle cx="180" cy="100" r="4.5" fill="#00b894"/>
            <circle cx="220" cy="220" r="4.5" fill="#6c5ce7"/>

            <text x="150" y="55" fill="#eb4d4b" font-size="11" font-weight="900">Vertex (-1, 5)</text>
            <text x="190" y="105" fill="#00b894" font-size="10" font-weight="700">(0, 3)</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Vertex Form Graph</span> $f(x) = -2(x + 1)^2 + 5$ &bull; Peak $(-1, 5)$ &bull; Max Value $= 5$.
          </div>
        </div>
      `,
      ex1Steps: [
        { num: 'Step 1', text: 'Rearrange into standard vertex form: $f(x) = -2(x - (-1))^2 + 5$. Here $a = -2$, $h = -1$, $k = 5$.' },
        { num: 'Step 2', text: 'The vertex is immediately $\\mathbf{(h, k) = (-1, 5)}$.' },
        { num: 'Step 3', text: 'The axis of symmetry is the vertical line through the vertex: $\\mathbf{x = -1}$.' },
        { num: 'Step 4', text: 'Since $a = -2 < 0$, the parabola opens downward and has a <strong>maximum value of 5</strong>.' }
      ],
      ex1Ans: 'Vertex: (-1, 5) • Axis: x = -1 • Maximum Value: 5',

      // Solved Example 2.2 (Solving for Unknown Point, Page 5)
      ex2Tag: 'Example 2.2 (Page 5)',
      ex2Q: 'Given $f(x) = 2(x - 3)^2 + 1$. State the vertex and extrema. If the point $(b, 9)$ lies on the parabola, find all possible values of $b$.',
      ex2Svg: `
        <div class="math-svg-container">
          <svg width="360" height="200" viewBox="0 0 360 200">
            <line x1="20" y1="160" x2="340" y2="160" stroke="#2d3436" stroke-width="2"/>
            <line x1="60" y1="190" x2="60" y2="20" stroke="#2d3436" stroke-width="2"/>
            <path d="M 80,40 Q 180,240 280,40" fill="none" stroke="#00b894" stroke-width="3"/>
            <circle cx="180" cy="140" r="5" fill="#eb4d4b"/>
            <text x="190" y="145" fill="#eb4d4b" font-size="11" font-weight="800">Vertex (3, 1)</text>
            <line x1="60" y1="50" x2="300" y2="50" stroke="#fdcb6e" stroke-dasharray="3,3" stroke-width="1.5"/>
            <circle cx="100" cy="50" r="5" fill="#6c5ce7"/>
            <circle cx="260" cy="50" r="5" fill="#6c5ce7"/>
            <text x="75" y="42" fill="#6c5ce7" font-size="11" font-weight="900">b = 1 &rarr; (1, 9)</text>
            <text x="250" y="42" fill="#6c5ce7" font-size="11" font-weight="900">b = 5 &rarr; (5, 9)</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Two Symmetric Solutions</span> Horizontal line $y = 9$ intersects the parabola at $b = 1$ and $b = 5$.
          </div>
        </div>
      `,
      ex2Steps: [
        { num: 'Step 1', text: 'Identify vertex from $f(x) = 2(x - 3)^2 + 1$: $h = 3, k = 1 \\implies$ <strong>Vertex is $(3, 1)$</strong>.' },
        { num: 'Step 2', text: 'Since $a = 2 > 0$, the parabola opens upward, giving a <strong>minimum value of 1</strong>.' },
        { num: 'Step 3', text: 'Substitute the point $(b, 9)$ into $f(x)$: $2(b - 3)^2 + 1 = 9$.' },
        { num: 'Step 4', text: 'Isolate the squared binomial: $2(b - 3)^2 = 8 \\implies (b - 3)^2 = 4$.' },
        { num: 'Step 5', text: 'Take square roots: $b - 3 = \\pm 2 \\implies b = 3 + 2 = \\mathbf{5}$ or $b = 3 - 2 = \\mathbf{1}$.' }
      ],
      ex2Ans: 'Vertex: (3, 1) • Min Value: 1 • b = 1 or b = 5',

      // Try It Yourself 2 (Self-Assessment 3 & 4 from Pages 4 & 5)
      tryBadge: 'Self-Assessment 2 (Pages 4 & 5)',
      tryPrompt: '1) Graph $f(x) = (x - 2)^2 - 4$. State the vertex, axis of symmetry, and minimum value.<br>2) If the point $(-1, m)$ lies on the curve of $g(x) = -(x + 1)^2 + 3$, calculate the value of $m$.',
      tryCanvasId: 'can-try2',
      trySolId: 'sol-try2',
      trySolution: `
        <strong>Part 1: Graphing $f(x) = (x - 2)^2 - 4$:</strong><br>
        • Vertex form: $a = 1, h = 2, k = -4$.<br>
        • <strong>Vertex coordinates:</strong> $\\mathbf{(2, -4)}$.<br>
        • <strong>Axis of symmetry:</strong> $\\mathbf{x = 2}$.<br>
        • Since $a = 1 > 0$, the parabola opens upward, giving a <strong>minimum value of $-4$</strong>.<br>
        • Roots ($f(x) = 0$): $(x - 2)^2 = 4 \\implies x - 2 = \\pm 2 \\implies x = 0$ or $x = 4$.<br><br>
        <strong>Part 2: Finding $m$ on $g(x)$:</strong><br>
        Substitute $x = -1$ into $g(x)$:<br>
        $$m = g(-1) = -(-1 + 1)^2 + 3 = -(0)^2 + 3 = 3$$
        &rarr; The value of $m$ is $\\mathbf{3}$ (and $(-1, 3)$ is the maximum vertex of $g$!).
      `
    },

    // ----------------------------------------------------------------------
    // IDEA 3: Finding Unknown Coefficients & Higher-Order Thinking
    // ----------------------------------------------------------------------
    {
      id: '3',
      badge: 'Idea 3 • Creative Problem Solving',
      flashcardTitle: 'Solving for Unknown Parameters & Geometric Proofs',
      flashcardText: 'Use the conditions of the problem (e.g., degree of polynomial, coordinates of vertex, axis of symmetry, or geometric distance) to set up algebraic equations and solve for unknown constants.',

      // Solved Example 3.1 (Page 8 #12 of Textbook)
      ex1Tag: 'Example 3.1 • Geometry & Parabola (Page 8 #12)',
      ex1Q: 'In the figure, the curve represents $f(x) = x^2 - 2x + k + 1$ with vertex $V$ and intersecting the y-axis at $C$. $A$ is the projection of $V$ on the x-axis ($x = 1$). If $OA = \\frac{1}{2} VA$, find the value of $k$ and the coordinates of point $C$.',
      ex1Svg: `
        <div class="math-svg-container">
          <svg width="360" height="240" viewBox="0 0 360 240">
            <line x1="40" y1="120" x2="330" y2="120" stroke="#2d3436" stroke-width="2"/>
            <polygon points="330,120 322,116 322,124" fill="#2d3436"/>
            <text x="320" y="138" fill="#2d3436" font-size="12" font-weight="800">x</text>

            <line x1="140" y1="230" x2="140" y2="20" stroke="#2d3436" stroke-width="2"/>
            <polygon points="140,20 136,28 144,28" fill="#2d3436"/>
            <text x="125" y="30" fill="#2d3436" font-size="12" font-weight="800">y</text>

            <path d="M 80,40 Q 190,260 300,40" fill="none" stroke="#6c5ce7" stroke-width="3"/>

            <line x1="140" y1="120" x2="190" y2="120" stroke="#00b894" stroke-width="3"/>
            <line x1="190" y1="120" x2="190" y2="180" stroke="#eb4d4b" stroke-width="3" stroke-dasharray="3,3"/>

            <circle cx="140" cy="120" r="4.5" fill="#2d3436"/>
            <text x="125" y="115" fill="#2d3436" font-size="11" font-weight="800">O</text>

            <circle cx="190" cy="120" r="4.5" fill="#00b894"/>
            <text x="195" y="115" fill="#00b894" font-size="11" font-weight="800">A (1, 0)</text>

            <circle cx="190" cy="180" r="6" fill="#eb4d4b"/>
            <text x="200" y="185" fill="#eb4d4b" font-size="11" font-weight="800">V (1, k)</text>

            <circle cx="140" cy="150" r="5" fill="#fdcb6e"/>
            <text x="100" y="155" fill="#fdcb6e" font-size="11" font-weight="900">C (0, k+1)</text>

            <text x="150" y="215" fill="#2d3436" font-size="11" font-weight="700">OA = 1 unit, VA = 2 units &rarr; k = -2</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Geometric Relationship</span> $OA = 1$, $VA = -k$. Given $OA = \\frac{1}{2} VA \\implies 1 = \\frac{1}{2}(-k) \\implies k = -2$.
          </div>
        </div>
      `,
      ex1Steps: [
        { num: 'Step 1', text: 'Find vertex $x$-coordinate: $x = -\\frac{b}{2a} = -\\frac{-2}{2(1)} = 1$. Thus, projection $A$ is at $(1, 0)$, which means the length $\\mathbf{OA = 1}$ unit.' },
        { num: 'Step 2', text: 'Find vertex $y$-coordinate: $f(1) = 1^2 - 2(1) + k + 1 = 1 - 2 + k + 1 = k$. Since $V$ is below the x-axis, length $\\mathbf{VA = -k}$.' },
        { num: 'Step 3', text: 'Use the given ratio $OA = \\frac{1}{2} VA$:<br>$$1 = \\frac{1}{2}(-k) \\implies -k = 2 \\implies \\mathbf{k = -2}$$' },
        { num: 'Step 4', text: 'Find point $C$ ($y$-intercept): Substitute $x = 0$ into $f(x)$:<br>$$f(0) = 0^2 - 2(0) + k + 1 = k + 1 = -2 + 1 = -1$$' },
        { num: 'Step 5', text: 'Therefore, the coordinates of $C$ are $\\mathbf{(0, -1)}$.' }
      ],
      ex1Ans: 'k = -2 • Coordinates of C: (0, -1)',

      // Solved Example 3.2 (Algebraic Parameter Degree Constraint, Page 7 #5 & #6)
      ex2Tag: 'Example 3.2 • Parameter & Degree Constraints (Page 7)',
      ex2Q: '1) If $f(x) = (a + 4)x^3 + x^2 - 5x + 6$ is a quadratic function, find $a$.<br>2) If $x = 2$ is the axis of symmetry of $f(x) = ax^2 + 12x + 7$, find $a$.',
      ex2Svg: `
        <div class="math-svg-container">
          <svg width="360" height="150" viewBox="0 0 360 150">
            <rect x="20" y="20" width="150" height="110" rx="10" fill="rgba(108, 92, 231, 0.08)" stroke="#6c5ce7" stroke-width="2"/>
            <text x="35" y="45" fill="#6c5ce7" font-size="12" font-weight="900">Degree Constraint</text>
            <text x="35" y="70" fill="#2d3436" font-size="11" font-weight="700">Must be Degree 2</text>
            <text x="35" y="90" fill="#eb4d4b" font-size="11" font-weight="800">Coeff of x³ = 0</text>
            <text x="35" y="110" fill="#00b894" font-size="12" font-weight="900">a + 4 = 0 &rarr; a = -4</text>

            <rect x="190" y="20" width="150" height="110" rx="10" fill="rgba(0, 184, 148, 0.08)" stroke="#00b894" stroke-width="2"/>
            <text x="205" y="45" fill="#00b894" font-size="12" font-weight="900">Axis Constraint</text>
            <text x="205" y="70" fill="#2d3436" font-size="11" font-weight="700">Axis Formula: -b / 2a</text>
            <text x="205" y="90" fill="#eb4d4b" font-size="11" font-weight="800">-12 / (2a) = 2</text>
            <text x="205" y="110" fill="#6c5ce7" font-size="12" font-weight="900">4a = -12 &rarr; a = -3</text>
          </svg>
          <div class="math-svg-caption">
            <span class="badge">Algebraic Properties</span> Eliminating cubic term gives $a = -4$ &bull; Equating axis gives $a = -3$.
          </div>
        </div>
      `,
      ex2Steps: [
        { num: 'Part 1', text: 'For $f(x)$ to be a quadratic function, the degree must be strictly 2. Therefore, the coefficient of $x^3$ must vanish: $a + 4 = 0 \\implies \\mathbf{a = -4}$.' },
        { num: 'Part 2', text: 'The axis of symmetry formula is $x = -\\frac{b}{2a}$. Here $b = 12$, and the axis is given as $x = 2$:<br>$$-\\frac{12}{2a} = 2 \\implies \\frac{-6}{a} = 2 \\implies 2a = -6 \\implies \\mathbf{a = -3}$$.' }
      ],
      ex2Ans: 'Part 1: a = -4 • Part 2: a = -3',

      // Try It Yourself 3 (Page 8 #13 - Distance Connection to Origin)
      tryBadge: 'High-Order Thinking (Page 8 #13)',
      tryPrompt: 'If $f(x) = x^2 - 10x + k$ is a quadratic function, and the vertex $V$ is at a distance of 13 units from the origin $O(0, 0)$, find all possible values of the constant $k$.',
      tryCanvasId: 'can-try3',
      trySolId: 'sol-try3',
      trySolution: `
        <strong>Step-by-Step Derivation (Distance Formula Integration):</strong><br>
        1. <strong>Find the vertex coordinates:</strong><br>
        • $a = 1$, $b = -10$, $c = k$.<br>
        • $x = -\\frac{b}{2a} = -\\frac{-10}{2(1)} = 5$.<br>
        • $y = f(5) = 5^2 - 10(5) + k = 25 - 50 + k = k - 25$.<br>
        Thus, the vertex is $\\mathbf{V(5, k - 25)}$.<br><br>
        2. <strong>Set up the Distance from Origin $O(0, 0)$ to $V$:</strong><br>
        $$d(O, V) = \\sqrt{x^2 + y^2} = 13$$
        $$\\sqrt{5^2 + (k - 25)^2} = 13$$
        3. <strong>Square both sides:</strong><br>
        $$25 + (k - 25)^2 = 169$$
        $$(k - 25)^2 = 169 - 25 = 144$$
        4. <strong>Solve for $k$:</strong><br>
        $$k - 25 = \\pm \\sqrt{144} = \\pm 12$$
        • <strong>Case 1:</strong> $k - 25 = 12 \\implies \\mathbf{k = 37}$<br>
        • <strong>Case 2:</strong> $k - 25 = -12 \\implies \\mathbf{k = 13}$<br><br>
        <strong>Conclusion:</strong> The possible values of $k$ are $\\mathbf{13}$ and $\\mathbf{37}$.
      `
    }
  ],

  // ========================================================================
  // TAB 2: MCQ REVISION BANK (12 COMPREHENSIVE QUESTIONS)
  // Complete coverage of Page 7 & Page 8 with detailed proofs
  // ========================================================================
  mcqs: [
    {
      q: "1. What are the coordinates of the vertex of the quadratic function $f(x) = 2(x - 3)^2 + 1$?",
      options: ["(2, 3)", "(3, 1)", "(2, 1)", "(-3, 1)"],
          correct: 1,
      proof: "The vertex form is $f(x) = a(x - h)^2 + k$. Here $h = 3$ and $k = 1$, so the vertex is directly $(3, 1)$."
    },
    {
      q: "2. If $(h, k)$ is the vertex of $f(x) = 2x^2 - 8x + 7$, what is the value of $h$?",
      options: ["4", "6", "2", "8"],
          correct: 2,
      proof: "The $x$-coordinate of the vertex is given by $h = -\\frac{b}{2a} = -\\frac{-8}{2(2)} = \\frac{8}{4} = 2$."
    },
    {
      q: "3. What is the point of intersection of the parabola $f(x) = x^2 - 3x - 5$ with the y-axis?",
      options: ["(0, -3)", "(0, 3)", "(0, 5)", "(0, -5)"],
          correct: 3,
      proof: "To find the y-intercept, set $x = 0$: $f(0) = 0^2 - 3(0) - 5 = -5$. The point is $(0, -5)$."
    },
    {
      q: "4. What is the minimum value of the quadratic function $f(x) = x^2 - 6x + 14$?",
      options: ["5", "-6", "9", "14"],
          correct: 0,
      proof: "Vertex $x = -\\frac{-6}{2(1)} = 3$. The minimum value is $f(3) = 3^2 - 6(3) + 14 = 9 - 18 + 14 = 5$."
    },
    {
      q: "5. If $f(x) = (a + 4)x^3 + x^2 - 5x + 6$ is a quadratic function, then the value of $a$ is:",
      options: ["-5", "5", "-4", "6"],
          correct: 2,
      proof: "For $f(x)$ to be a quadratic function (degree 2), the coefficient of $x^3$ must be 0: $a + 4 = 0 \\implies a = -4$."
    },
    {
      q: "6. If $x = 2$ is the $x$-coordinate of the vertex of $f(x) = ax^2 + 12x + 7$, then $a = $",
      options: ["3", "2", "-2", "-3"],
          correct: 3,
      proof: "$-\\frac{b}{2a} = 2 \\implies -\\frac{12}{2a} = 2 \\implies -\\frac{6}{a} = 2 \\implies 2a = -6 \\implies a = -3$."
    },
    {
      q: "7. Which of the following functions has a vertex at $(2, 4)$ and opens upward?",
      options: ["$f(x) = (x - 2)^2 + 4$", "$f(x) = -(x - 2)^2 + 4$", "$f(x) = (x + 2)^2 + 4$", "$f(x) = (x - 4)^2 + 2$"],
          correct: 0,
      proof: "Opening upward requires $a > 0$, and vertex $(2, 4)$ requires $h = 2, k = 4$. Thus $f(x) = (x - 2)^2 + 4$."
    },
    {
      q: "8. The axis of symmetry equation for $f(x) = 5 - (x + 1)^2$ is:",
      options: ["$x = 1$", "$x = -1$", "$y = 5$", "$x = 5$"],
          correct: 1,
      proof: "The vertex form is $-(x - (-1))^2 + 5$, so $h = -1$. The vertical line of symmetry is $x = -1$."
    },
    {
      q: "9. If the point $(k, 5)$ lies on the curve $f(x) = x^2 + 1$, then the possible values of $k$ are:",
      options: ["$4$", "$\\pm 4$", "$2$", "$\\pm 2$"],
          correct: 3,
      proof: "$f(k) = 5 \\implies k^2 + 1 = 5 \\implies k^2 = 4 \\implies k = \\pm 2$."
    },
    {
      q: "10. The maximum value of the function $f(x) = -(x - 4)^2 + 16$ is:",
      options: ["16", "4", "-4", "-16"],
          correct: 0,
      proof: "Since $a = -1 < 0$, the parabola opens downward and reaches its maximum value at $y = k = 16$."
    },
    {
      q: "11. If $f(x) = x^2 - 4x + c$ has a minimum value of $-1$, then $c = $",
      options: ["-1", "3", "5", "4"],
          correct: 1,
      proof: "Vertex $x = -\\frac{-4}{2} = 2$. Minimum value $f(2) = 2^2 - 4(2) + c = -1 \\implies 4 - 8 + c = -1 \\implies c = 3$."
    },
    {
      q: "12. The parabola $f(x) = 2x^2 + 8$ has its vertex at:",
      options: ["(8, 0)", "(2, 8)", "(0, 8)", "(-2, 8)"],
          correct: 2,
      proof: "Here $b = 0$, so $x = -\\frac{0}{2(2)} = 0$. Then $f(0) = 8$. The vertex is on the y-axis at $(0, 8)$."
    }
  ],

  // ========================================================================
  // TAB 3: TIMED QUIZ ENGINE (3 MODELS • 30 QUESTIONS TOTAL • 10 MARKS EACH)
  // ========================================================================
  quizModels: [
    {
      title: "Timed Quiz — Model #1 (Standard Form & Vertex Fundamentals)",
      questions: [
        {
          q: "1. What is the $x$-coordinate of the vertex of $f(x) = 3x^2 - 12x + 5$?",
          options: ["-2", "4", "2", "3"],
          correct: 2,
          proof: "$x = -\\frac{b}{2a} = -\\frac{-12}{2(3)} = \\frac{12}{6} = 2$."
        },
        {
          q: "2. The parabola $f(x) = -2x^2 + 4x - 1$ opens:",
          options: ["Upward and has a minimum value", "Downward and has a maximum value", "To the right", "To the left"],
          correct: 1,
          proof: "Since $a = -2 < 0$, the parabola opens downward and possesses a maximum value at its peak."
        },
        {
          q: "3. What is the y-intercept of $f(x) = 4x^2 - 7x + 9$?",
          options: ["(0, 9)", "(9, 0)", "(0, -7)", "(0, 4)"],
          correct: 0,
          proof: "$f(0) = 4(0)^2 - 7(0) + 9 = 9 \\implies (0, 9)$."
        },
        {
          q: "4. The vertex of $f(x) = x^2 - 2x - 8$ is:",
          options: ["(1, 9)", "(-1, -9)", "(2, -8)", "(1, -9)"],
          correct: 3,
          proof: "$x = -\\frac{-2}{2} = 1$; $f(1) = 1 - 2 - 8 = -9 \\implies (1, -9)$."
        },
        {
          q: "5. If the vertex of $f(x) = x^2 + bx + 5$ is at $x = 3$, then $b = $",
          options: ["6", "-6", "-3", "3"],
          correct: 1,
          proof: "$-\\frac{b}{2(1)} = 3 \\implies -b = 6 \\implies b = -6$."
        },
        {
          q: "6. What is the minimum value of $f(x) = 2x^2 - 8x + 11$?",
          options: ["11", "2", "3", "-3"],
          correct: 2,
          proof: "$x = -\\frac{-8}{4} = 2$; $f(2) = 2(4) - 8(2) + 11 = 8 - 16 + 11 = 3$."
        },
        {
          q: "7. Which of the following is the axis of symmetry for $f(x) = x^2 + 10x + 21$?",
          options: ["$x = 5$", "$x = -10$", "$y = -5$", "$x = -5$"],
          correct: 3,
          proof: "$x = -\\frac{10}{2(1)} = -5$."
        },
        {
          q: "8. If $f(x) = ax^2 + 4x + 1$ has a vertex at $x = 1$, then $a = $",
          options: ["-2", "2", "-4", "1"],
          correct: 0,
          proof: "$-\\frac{4}{2a} = 1 \\implies 2a = -4 \\implies a = -2$."
        },
        {
          q: "9. The roots of $f(x) = x^2 - 9$ are the intersection points with the x-axis, which are:",
          options: ["(0, 3) and (0, -3)", "(9, 0)", "(3, 0) and (-3, 0)", "(0, -9)"],
          correct: 2,
          proof: "$x^2 - 9 = 0 \\implies x^2 = 9 \\implies x = \\pm 3$."
        },
        {
          q: "10. What is the domain of any quadratic function $f(x) = ax^2 + bx + c$?",
          options: ["Positive real numbers $\\mathbb{R}^+$", "Integers $\\mathbb{Z}$", "Rational numbers $\\mathbb{Q}$", "All real numbers $\\mathbb{R}$"],
          correct: 3,
          proof: "As a polynomial function, its domain is unrestricted across all real numbers $\\mathbb{R}$."
        }
      ]
    },

    {
      title: "Timed Quiz — Model #2 (Vertex Form & Transformations)",
      questions: [
        {
          q: "1. The vertex of $f(x) = -3(x + 5)^2 - 7$ is:",
          options: ["(-5, -7)", "(5, -7)", "(-5, 7)", "(5, 7)"],
          correct: 0,
          proof: "$f(x) = -3(x - (-5))^2 + (-7) \\implies h = -5, k = -7$."
        },
        {
          q: "2. The maximum value of $f(x) = 12 - 4(x - 1)^2$ is:",
          options: ["4", "12", "1", "-4"],
          correct: 1,
          proof: "Since $a = -4 < 0$, the maximum occurs at the vertex where $y = 12$."
        },
        {
          q: "3. If the point $(3, y)$ lies on $f(x) = (x - 1)^2 + 4$, then $y = $",
          options: ["6", "10", "4", "8"],
          correct: 3,
          proof: "$f(3) = (3 - 1)^2 + 4 = 2^2 + 4 = 4 + 4 = 8$."
        },
        {
          q: "4. In the vertex form $f(x) = a(x - h)^2 + k$, the vertical line $x = h$ represents:",
          options: ["The axis of symmetry", "The y-intercept", "The root", "The horizontal asymptote"],
          correct: 0,
          proof: "By definition, the axis of symmetry passes through the vertex $(h, k)$ with equation $x = h$."
        },
        {
          q: "5. If $f(x) = (x - 2)^2 - 9$, what are the x-intercepts?",
          options: ["(1, 0) and (-5, 0)", "(-1, 0) and (5, 0)", "(2, 0) and (-9, 0)", "(0, -5) and (0, 0)"],
          correct: 1,
          proof: "$(x - 2)^2 = 9 \\implies x - 2 = \\pm 3 \\implies x = 5$ or $x = -1$."
        },
        {
          q: "6. If $(-2, m)$ lies on $f(x) = 3(x + 2)^2 + 5$, then $m = $",
          options: ["8", "0", "5", "3"],
          correct: 2,
          proof: "$f(-2) = 3(-2 + 2)^2 + 5 = 3(0) + 5 = 5$."
        },
        {
          q: "7. Which function has a minimum value of $-3$ and an axis of symmetry at $x = 4$?",
          options: ["$f(x) = -2(x - 4)^2 - 3$", "$f(x) = 2(x + 4)^2 - 3$", "$f(x) = 2(x - 4)^2 - 3$", "$f(x) = 2(x - 4)^2 + 3$"],
          correct: 2,
          proof: "Minimum requires $a > 0$, axis $x = 4 \\implies h = 4$, min value $-3 \\implies k = -3$."
        },
        {
          q: "8. Expanding $f(x) = 2(x - 1)^2 + 3$ into standard form yields:",
          options: ["$2x^2 - 2x + 5$", "$2x^2 - 4x + 5$", "$2x^2 - 4x + 3$", "$2x^2 + 4x + 5$"],
          correct: 1,
          proof: "$2(x^2 - 2x + 1) + 3 = 2x^2 - 4x + 2 + 3 = 2x^2 - 4x + 5$."
        },
        {
          q: "9. If $(p, 10)$ lies on $f(x) = 2(x - 1)^2 + 2$, then the positive value of $p$ is:",
          options: ["3", "2", "4", "5"],
          correct: 0,
          proof: "$2(p - 1)^2 = 8 \\implies (p - 1)^2 = 4 \\implies p - 1 = 2 \\implies p = 3$."
        },
        {
          q: "10. The range of $f(x) = (x - 3)^2 + 2$ is:",
          options: ["$(-\\infty, 2]$", "$[3, \\infty)$", "$\\mathbb{R}$", "$[2, \\infty)$"],
          correct: 3,
          proof: "Since $a = 1 > 0$, the minimum value is $2$, so $y \\ge 2$, giving range $[2, \\infty)$."
        }
      ]
    },

    {
      title: "Timed Quiz — Model #3 (Real-World Trajectories & High-Order Thinking)",
      questions: [
        {
          q: "1. An arrow is launched with height $h(t) = -5t^2 + 20t$. Its maximum height is reached at $t = $",
          options: ["4 seconds", "2 seconds", "1 second", "5 seconds"],
          correct: 1,
          proof: "$t = -\\frac{20}{2(-5)} = \\frac{20}{10} = 2$ seconds."
        },
        {
          q: "2. In question 1, what is the maximum altitude reached by the arrow?",
          options: ["15 meters", "25 meters", "20 meters", "40 meters"],
          correct: 2,
          proof: "$h(2) = -5(4) + 20(2) = -20 + 40 = 20$ meters."
        },
        {
          q: "3. If the vertex of $f(x) = x^2 - 6x + k$ is at distance 5 from the origin $(0, 0)$, and $k < 9$, then $k = $",
          options: ["4", "3", "7", "5"],
          correct: 3,
          proof: "Vertex $x = 3, y = k - 9$. Distance $\\sqrt{3^2 + (k - 9)^2} = 5 \\implies 9 + (k - 9)^2 = 25 \\implies (k - 9)^2 = 16 \\implies k - 9 = -4 \\implies k = 5$."
        },
        {
          q: "4. A diver leaps along $h(x) = -x^2 + 2x + 8$. At what horizontal distance $x$ does the diver hit the water ($h=0$)?",
          options: ["4 meters", "2 meters", "8 meters", "1 meter"],
          correct: 0,
          proof: "$-x^2 + 2x + 8 = 0 \\implies x^2 - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0$. Since $x > 0$, $x = 4$ m."
        },
        {
          q: "5. If $f(x) = (m - 2)x^3 + 3x^2 + x - 1$ is a quadratic function, then $m = $",
          options: ["3", "0", "2", "-2"],
          correct: 2,
          proof: "The cubic term must vanish: $m - 2 = 0 \\implies m = 2$."
        },
        {
          q: "6. The height of a toy rocket is $h(t) = -t^2 + 6t$. After how many seconds does it return to the ground?",
          options: ["3 seconds", "12 seconds", "4 seconds", "6 seconds"],
          correct: 3,
          proof: "$-t(t - 6) = 0 \\implies t = 0$ (launch) or $t = 6$ (return to ground)."
        },
        {
          q: "7. If a parabola has vertex $(0, 0)$ and passes through $(2, 12)$, its equation is:",
          options: ["$f(x) = 3x^2$", "$f(x) = 6x^2$", "$f(x) = 12x^2$", "$f(x) = x^2 + 8$"],
          correct: 0,
          proof: "$f(x) = ax^2 \\implies 12 = a(2^2) = 4a \\implies a = 3 \\implies f(x) = 3x^2$."
        },
        {
          q: "8. A bridge arch is modeled by $y = -0.1x^2 + 10$ for $-10 \\le x \\le 10$. The maximum height of the arch is:",
          options: ["20 meters", "10 meters", "100 meters", "5 meters"],
          correct: 1,
          proof: "Vertex occurs at $x = 0$, giving $y = 10$ meters."
        },
        {
          q: "9. If $f(x) = x^2 - 2x + c$ and $f(3) = 7$, then $c = $",
          options: ["3", "5", "2", "4"],
          correct: 3,
          proof: "$3^2 - 2(3) + c = 7 \\implies 9 - 6 + c = 7 \\implies 3 + c = 7 \\implies c = 4$."
        },
        {
          q: "10. Two points on the parabola $f(x) = x^2 - 4x + 1$ have the same y-value. If one point has $x = -1$, the other point has $x = $",
          options: ["5", "3", "4", "2"],
          correct: 0,
          proof: "The axis of symmetry is $x = 2$. The distance from $-1$ to $2$ is $3$. By symmetry, the other $x$ is $2 + 3 = 5$."
        }
      ]
    }
  ]
};


