// ==========================================================================
// UNIT 1: NUMBERS & OPERATIONS • LESSON ONE: PROPORTION
// Official Curriculum • Grade 9 / Prep 3 (English Edition)
// Prepared for: Mr Ahmed Abd El-Motaal (Math Teacher & Content Creator)
// ==========================================================================
const LESSON_PROPORTION = {
  key: 'proportion',
  unitTag: '<i class="fa-solid fa-scale-balanced"></i> Unit 1 • Numbers and Operations on Them',
  title: 'Lesson One: Proportion',
  subtitle: 'Master the concept of proportion, cross-multiplication (Product of Extremes = Product of Means), solving linear and binomial unknowns, real-world rate applications, and graphical coordinate representations passing through the origin.',
  stageBadge: '<i class="fa-solid fa-graduation-cap"></i> Unit 1: Numbers & Operations • Lesson One: Proportion',

  // 1. Diagnostic Pre-Study & Readiness Review
  preStudy: {
    title: 'Pre-Study: Check Your Readiness',
    subtitle: 'Review essential prerequisite concepts: simplifying fractions, ratio equivalence, and rates before studying proportion.',
    cards: [
      {
        icon: 'fa-solid fa-divide',
        iconBg: '#6c5ce7',
        title: '1. Simplifying Fractions to Lowest Terms',
        desc: `
          Divide the numerator and denominator by their greatest common divisor (GCD):
          <div class="pre-study-formula-box">
            • $\\frac{12}{18} = \\frac{12 \\div 6}{18 \\div 6} = \\frac{2}{3}$<br>
            • Ratios with identical irreducible fractions represent equivalent quantities.
          </div>
        `
      },
      {
        icon: 'fa-solid fa-scale-balanced',
        iconBg: '#00b894',
        title: '2. Understanding Ratios & Rates',
        desc: `
          A ratio compares quantities of the same unit, while a rate compares different units:
          <div class="pre-study-formula-box">
            • <strong>Ratio:</strong> $\\frac{4}{8} = \\frac{1}{2}$ (Equality of two ratios)<br>
            • <strong>Rate:</strong> $\\frac{8\\text{ eggs}}{2\\text{ cups}} = \\frac{4\\text{ eggs}}{1\\text{ cup}}$ (Equality of two rates)
          </div>
        `
      },
      {
        icon: 'fa-solid fa-xmark',
        iconBg: '#fdcb6e',
        title: '3. Cross-Multiplication Principle',
        desc: `
          If two fractions are equal $\\frac{a}{b} = \\frac{c}{d}$, their cross products are equal:
          <div class="pre-study-formula-box">
            $$a \\times d = b \\times c$$
            If $\\frac{3}{4} = \\frac{6}{8}$, then $3 \\times 8 = 4 \\times 6 = 24$.
          </div>
        `
      }
    ],
    diagnosticQuestions: [
      {
        id: 'diag-prop-1',
        text: '1. Which ratio is equivalent to $\\frac{24}{36}$?',
        options: ['8 : 18', '10 : 12', '10 : 15', '16 : 28'],
        correct: 2,
        explanation: 'Divide numerator and denominator of $\\frac{24}{36}$ by 12 to get $\\frac{2}{3}$. Multiplying by 5 gives $\\frac{10}{15}$.'
      },
      {
        id: 'diag-prop-2',
        text: '2. If $\\frac{x}{6} = \\frac{10}{15}$, what is the value of $x$?',
        options: ['4', '5', '3', '6'],
        correct: 0,
        explanation: 'Simplify $\\frac{10}{15} = \\frac{2}{3}$. Then $\\frac{x}{6} = \\frac{2}{3} \\implies 3x = 12 \\implies x = 4$.'
      },
      {
        id: 'diag-prop-3',
        text: '3. If a person writes 150 words in 30 minutes, how many words does he write in two hours?',
        options: ['10 words', '15 words', '300 words', '600 words'],
        correct: 3,
        explanation: 'Two hours = 120 minutes. Rate = $\\frac{150\\text{ words}}{30\\text{ min}} = 5\\text{ words/min}$. In 120 minutes: $5 \\times 120 = 600\\text{ words}$.'
      }
    ]
  },

  // 2. Real-World Applications
  realWorldApps: [
    {
      accent: '#6c5ce7',
      accentBg: 'rgba(108, 92, 231, 0.12)',
      icon: 'fa-solid fa-gas-pump',
      tag: 'Automotive & Travel',
      title: 'Car Petrol & Highway Mileage',
      desc: 'A car consumes 3 liters of gasoline to travel 33 km. How many liters of gasoline does it need to travel 121 km at the same rate?',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 300 150">
          <rect x="20" y="95" width="260" height="8" rx="4" fill="#dfe6e9"/>
          <!-- Car Silhouette -->
          <rect x="70" y="65" width="75" height="30" rx="8" fill="#6c5ce7"/>
          <circle cx="90" cy="98" r="10" fill="#2d3436"/>
          <circle cx="130" cy="98" r="10" fill="#2d3436"/>
          <polygon points="85,65 100,45 130,45 140,65" fill="#a29bfe"/>
          <!-- Fuel Gauge Box -->
          <rect x="185" y="30" width="95" height="60" rx="10" fill="#ffffff" stroke="#6c5ce7" stroke-width="2"/>
          <text x="192" y="52" fill="#6c5ce7" font-size="11" font-weight="800">3 L = 33 km</text>
          <text x="192" y="74" fill="#00b894" font-size="12" font-weight="900">11 L = 121 km</text>
          <line x1="145" y1="80" x2="185" y2="80" stroke="#6c5ce7" stroke-dasharray="3,3" stroke-width="2"/>
        </svg>
      `,
      commentaryHtml: `
        <strong>Proportional Rate Modeling:</strong><br>
        Assume the car consumes $X$ liters of gasoline to travel 121 km:<br>
        $$\\frac{X}{121} = \\frac{3}{33} \\implies 33X = 363 \\implies X = \\frac{363}{33} = 11\\text{ liters}$$
        Short answer: $X = \\frac{3 \\times 121}{33} = 11\\text{ liters}$.
      `
    },
    {
      accent: '#00b894',
      accentBg: 'rgba(0, 184, 148, 0.12)',
      icon: 'fa-solid fa-cake-candles',
      tag: 'Culinary Chemistry',
      title: 'Bakery Recipe Scaling',
      desc: 'A baker needs 5 cups of sugar to make 3 cakes. How many cups of sugar does the baker need to make 15 cakes?',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 300 150">
          <g transform="translate(40, 40)">
            <rect x="0" y="30" width="40" height="25" rx="5" fill="#fdcb6e"/>
            <rect x="5" y="15" width="30" height="18" rx="4" fill="#ff7675"/>
            <text x="-5" y="75" fill="#2d3436" font-size="11" font-weight="800">3 Cakes = 5 Cups</text>
          </g>
          <line x1="125" y1="65" x2="165" y2="65" stroke="#00b894" stroke-width="3" stroke-dasharray="4,4"/>
          <polygon points="165,65 155,59 155,71" fill="#00b894"/>
          <g transform="translate(180, 25)">
            <rect x="0" y="45" width="70" height="30" rx="6" fill="#fdcb6e"/>
            <rect x="10" y="25" width="50" height="23" rx="5" fill="#ff7675"/>
            <rect x="20" y="10" width="30" height="18" rx="4" fill="#74b9ff"/>
            <text x="-5" y="95" fill="#00b894" font-size="12" font-weight="900">15 Cakes = 25 Cups</text>
          </g>
        </svg>
      `,
      commentaryHtml: `
        <strong>Proportional Scaling Formula:</strong><br>
        Let the required sugar be $S$ cups: $\\frac{S}{15} = \\frac{5}{3} \\implies 3S = 75 \\implies S = 25\\text{ cups of sugar}$.
      `
    },
    {
      accent: '#e17055',
      accentBg: 'rgba(225, 112, 85, 0.12)',
      icon: 'fa-solid fa-moon',
      tag: 'Space Physics & Gravitation',
      title: 'Earth vs. Moon Gravity Ratio',
      desc: 'The weight of a body on earth is 90 Newtons. If its weight on the moon is 15 Newtons, what is the weight of another body on the moon if its weight on earth is 60 Newtons?',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 300 150">
          <circle cx="75" cy="75" r="45" fill="rgba(9, 132, 227, 0.15)" stroke="#0984e3" stroke-width="2.5"/>
          <text x="50" y="65" fill="#0984e3" font-size="11" font-weight="800">🌍 Earth</text>
          <text x="45" y="85" fill="#2d3436" font-size="11" font-weight="700">90 N ➜ 60 N</text>
          <circle cx="225" cy="75" r="30" fill="rgba(253, 203, 110, 0.2)" stroke="#f39c12" stroke-width="2"/>
          <text x="205" y="70" fill="#f39c12" font-size="11" font-weight="800">🌕 Moon</text>
          <text x="205" y="88" fill="#e17055" font-size="11" font-weight="900">15 N ➜ 10 N</text>
          <path d="M 125 75 Q 150 40 185 75" fill="none" stroke="#e17055" stroke-width="2.5" stroke-dasharray="3,3"/>
        </svg>
      `,
      commentaryHtml: `
        <strong>Gravitational Proportionality:</strong><br>
        $\\frac{W_{\\text{Moon}}}{W_{\\text{Earth}}} = \\frac{15}{90} = \\frac{1}{6}$. For the 60 N body: $\\frac{x}{60} = \\frac{1}{6} \\implies x = 10\\text{ Newtons}$.
      `
    }
  ],

  // 3. Core Foundation Card
  foundation: {
    badge: 'Core Mathematical Foundation',
    subBadge: 'Equality of Ratios & Cross Multiplication',
    formulaText: '$$\\frac{a}{b} = \\frac{c}{d} \\iff a \\times d = b \\times c$$',
    formulaSubtext: 'A proportion is an equality of at least two ratios or two rates. For four quantities $a, b, c, d$ in proportion, the product of extremes equals the product of means.',
    rules: [
      { num: 1, title: 'Concept of Proportion', desc: 'A proportion is an equality of at least two ratios or two rates (e.g. $\\frac{4}{8} = \\frac{1}{2}$ or $\\frac{8\\text{ eggs}}{2\\text{ cups}} = \\frac{4\\text{ eggs}}{1\\text{ cup}}$).' },
      { num: 2, title: 'Writing Proportion & Order of Terms', desc: 'If quantities $a, b, c, d$ are proportional, then $\\frac{a}{b} = \\frac{c}{d}$. $a$ and $d$ are Extremes (الطرفين); $b$ and $c$ are Means (الوسطين).' },
      { num: 3, title: 'Property of Cross Multiplication', desc: 'If two ratios are equal, Product of Extremes = Product of Means: $a \\times d = b \\times c$. Conversely, if $ad = bc$, then $a, b, c, d$ are proportional.' },
      { num: 4, title: 'Solving Proportion Definition', desc: 'Solving the proportion means finding the unknown value in the proportion using cross-multiplication or equivalent fractions.' }
    ]
  },

  // 4. Special Cases Encyclopedic Section
  specialCases: [
    {
      icon: 'fa-solid fa-chart-line',
      title: '1. Graphical Representation & Origin Rule',
      diagramSvg: `
        <svg width="100%" height="110" viewBox="0 0 240 110">
          <line x1="30" y1="95" x2="220" y2="95" stroke="#b2bec3" stroke-width="1.5"/>
          <line x1="40" y1="10" x2="40" y2="105" stroke="#b2bec3" stroke-width="1.5"/>
          <line x1="40" y1="95" x2="200" y2="20" stroke="#00b894" stroke-width="2.5"/>
          <circle cx="40" cy="95" r="4" fill="#00b894"/>
          <text x="45" y="105" font-size="10" font-weight="800" fill="#00b894">(0, 0)</text>
          <text x="95" y="35" font-size="10" font-weight="800" fill="#00b894">Straight Line Through Origin</text>
        </svg>
      `,
      items: [
        'Points form a straight line passing through $(0, 0) \\implies$ <strong>Proportional</strong>.',
        'Points do NOT pass through $(0, 0)$ or do not lie on a straight line $\\implies$ <strong>Not Proportional</strong>.'
      ]
    },
    {
      icon: 'fa-solid fa-shapes',
      title: '2. Equilateral Triangles Perimeter',
      diagramSvg: `
        <svg width="100%" height="110" viewBox="0 0 240 110">
          <polygon points="50,20 20,85 80,85" fill="rgba(108, 92, 231, 0.15)" stroke="#6c5ce7" stroke-width="2"/>
          <text x="35" y="100" font-size="10" font-weight="800" fill="#6c5ce7">s = 2, P = 6</text>
          <polygon points="140,15 105,90 175,90" fill="rgba(241, 196, 15, 0.15)" stroke="#f1c40f" stroke-width="2"/>
          <text x="125" y="102" font-size="10" font-weight="800" fill="#f1c40f">s = 3, P = 9</text>
        </svg>
      `,
      items: [
        'For equilateral triangles: $\\frac{\\text{Perimeter}}{\\text{Side Length}} = \\frac{6}{2} = \\frac{9}{3} = \\frac{12}{4} = 3$ (Constant ratio!).',
        'When side length is $0$, perimeter is $0$. Therefore, it represents a <strong>valid proportion</strong>.'
      ]
    },
    {
      icon: 'fa-solid fa-person-digging',
      title: '3. Collaborative Work-Rate Problems',
      diagramSvg: `
        <svg width="100%" height="110" viewBox="0 0 240 110">
          <rect x="20" y="25" width="90" height="60" rx="8" fill="rgba(0, 184, 148, 0.1)" stroke="#00b894" stroke-width="1.5"/>
          <text x="32" y="48" font-size="11" font-weight="800" fill="#00b894">Worker 1: 4h</text>
          <text x="35" y="68" font-size="10" fill="#2d3436">Rate = 1/4 wall/h</text>
          <rect x="130" y="25" width="95" height="60" rx="8" fill="rgba(225, 112, 85, 0.1)" stroke="#e17055" stroke-width="1.5"/>
          <text x="140" y="48" font-size="11" font-weight="800" fill="#e17055">Worker 2: 2h</text>
          <text x="142" y="68" font-size="10" fill="#2d3436">Rate = 1/2 wall/h</text>
        </svg>
      `,
      items: [
        'Combined rate $= \\frac{1}{4} + \\frac{1}{2} = \\frac{3}{4}$ of the wall per hour.',
        'Time taken together $= 1 \\div \\frac{3}{4} = \\frac{4}{3}\\text{ hours} = 80\\text{ minutes}$.'
      ]
    }
  ],

  // 5. Pedagogical Ideas — Comprehensive Cards with Generous Spacing
  ideas: [
    // ========================================================================
    // IDEA 1: Testing Proportions & Equality of Ratios
    // ========================================================================
    {
      id: 1,
      badge: '💡',
      flashcardTitle: 'Idea 1: Testing Proportions via Cross Products & Simplification',
      flashcardText: '<strong>Golden Rule:</strong> If the product of the extremes equals the product of the means ($a \\times d = b \\times c$), then this pair of ratios represents a proportion. Alternatively, if both ratios simplify to the exact same irreducible fraction, they represent a proportion!',
      cards: [
        {
          id: 'p_ex1_1',
          type: 'solved',
          tag: 'Solved Example 1.1 • Testing Proportions',
          accent: '#6c5ce7',
          q: 'Determine which of the following pairs of ratios represents a proportion:<br><div class="q-sub-item">$$\\frac{3}{8} \\quad \\text{and} \\quad \\frac{6}{10}$$</div>',
          steps: [
            { num: 'Step 1: Product of Extremes', text: 'Multiply the extremes: $3 \\times 10 = 30$.' },
            { num: 'Step 2: Product of Means', text: 'Multiply the means: $8 \\times 6 = 48$.' },
            { num: 'Step 3: Compare Products', text: 'Since $30 \\ne 48$ (product of extremes $\\ne$ product of means), therefore $\\frac{3}{8} \\ne \\frac{6}{10}$.' },
            { num: 'Step 4: Another Solution (Simplification)', text: 'Simplify $\\frac{6 \\div 2}{10 \\div 2} = \\frac{3}{5}$. Since $\\frac{3}{8} \\ne \\frac{3}{5}$, they do not represent a proportion.' }
          ],
          ans: 'i.e. $\\frac{3}{8}$ and $\\frac{6}{10}$ do NOT represent a proportion.'
        },
        {
          id: 'p_ex1_2',
          type: 'solved',
          tag: 'Solved Example 1.2 • Proportional Ratios',
          accent: '#0984e3',
          q: 'Determine which of the following pairs of ratios represents a proportion:<br><div class="q-sub-item">$$\\frac{8}{10} \\quad \\text{and} \\quad \\frac{12}{15}$$</div>',
          steps: [
            { num: 'Step 1: Product of Extremes', text: 'Multiply the extremes: $8 \\times 15 = 120$.' },
            { num: 'Step 2: Product of Means', text: 'Multiply the means: $10 \\times 12 = 120$.' },
            { num: 'Step 3: Compare Products', text: 'Product of extremes = Product of means ($120 = 120$), therefore $\\frac{8}{10} = \\frac{12}{15}$.' },
            { num: 'Step 4: Another Solution (Simplification)', text: 'Simplify: $\\frac{8 \\div 2}{10 \\div 2} = \\frac{4}{5}$, and $\\frac{12 \\div 3}{15 \\div 3} = \\frac{4}{5}$. Since $\\frac{4}{5} = \\frac{4}{5}$, they represent a proportion.' }
          ],
          ans: 'i.e. $\\frac{8}{10}$ and $\\frac{12}{15}$ represent a proportion.'
        },
        {
          id: 'p_ex1_3',
          type: 'solved',
          tag: 'Solved Example 1.3 • Identifying Proportions',
          accent: '#e17055',
          q: 'For each of the following, determine whether the quantities are proportional. If they are, write the proportion:<br><div class="q-sub-item">1) $5, 8, 15, 24$</div><div class="q-sub-item">2) $7, 8, 14, 15$</div>',
          steps: [
            { num: 'Part 1: 5, 8, 15, 24', text: 'Check product of extremes: $5 \\times 24 = 120$. Check product of means: $8 \\times 15 = 120$. Since $120 = 120$, the quantities are proportional. The proportion is: $\\frac{5}{8} = \\frac{15}{24}$.' },
            { num: 'Part 2: 7, 8, 14, 15', text: 'Check extremes: $7 \\times 15 = 105$. Check means: $8 \\times 14 = 112$. Since $105 \\ne 112$, the quantities are NOT proportional.' }
          ],
          ans: '1) Yes, proportional: $\\frac{5}{8} = \\frac{15}{24}$. &nbsp;&nbsp; 2) No, not proportional.'
        },
        {
          id: 'p_try1',
          type: 'try',
          tag: 'Try It Yourself 1.1 • Equivalent Pairs',
          accent: '#00b894',
          q: 'Determine which of the following pairs of ratios represents a proportion:<br><div class="q-sub-item">1) $\\frac{5}{7}$ and $\\frac{10}{14}$</div><div class="q-sub-item">2) $\\frac{4}{12}$ and $\\frac{3}{9}$</div>',
          canvasId: 'can-prop-1',
          wrapId: 'can-wrap-prop-1',
          solId: 'sol-prop-1',
          steps: [
            { num: 'Pair 1', text: 'Product of extremes $= 5 \\times 14 = 70$. Product of means $= 7 \\times 10 = 70$. Since $70 = 70$, $\\frac{5}{7}$ and $\\frac{10}{14}$ represent a proportion.' },
            { num: 'Pair 2', text: 'Product of extremes $= 4 \\times 9 = 36$. Product of means $= 12 \\times 3 = 36$. Since $36 = 36$, $\\frac{4}{12}$ and $\\frac{3}{9}$ represent a proportion.' }
          ],
          ans: 'Both pairs 1) and 2) represent valid proportions.'
        },
        {
          id: 'p_try1_b',
          type: 'try',
          tag: 'Try It Yourself 1.2 • Proportionality Check',
          accent: '#fdcb6e',
          q: 'Which of the following represents a proportion?<br><div class="q-sub-item">1) $\\frac{2}{5} \\stackrel{?}{=} \\frac{4}{10}$</div><div class="q-sub-item">2) $\\frac{3}{4} \\stackrel{?}{=} \\frac{6}{9}$</div><div class="q-sub-item">3) $\\frac{15}{25} \\stackrel{?}{=} \\frac{30}{60}$</div><div class="q-sub-item">4) $\\frac{10}{3} \\stackrel{?}{=} \\frac{40}{12}$</div>',
          canvasId: 'can-prop-1b',
          wrapId: 'can-wrap-prop-1b',
          solId: 'sol-prop-1b',
          steps: [
            { num: '1) 2/5 and 4/10', text: '$2 \\times 10 = 20$ and $5 \\times 4 = 20 \\implies$ <strong>Represents a proportion</strong>.' },
            { num: '2) 3/4 and 6/9', text: '$3 \\times 9 = 27$ and $4 \\times 6 = 24 \\implies 27 \\ne 24 \\implies$ <strong>Does NOT represent a proportion</strong>.' },
            { num: '3) 15/25 and 30/60', text: '$15 \\times 60 = 900$ and $25 \\times 30 = 750 \\implies 900 \\ne 750 \\implies$ <strong>Does NOT represent a proportion</strong>.' },
            { num: '4) 10/3 and 40/12', text: '$10 \\times 12 = 120$ and $3 \\times 40 = 120 \\implies$ <strong>Represents a proportion</strong>.' }
          ],
          ans: 'Items 1) and 4) represent proportions.'
        }
      ]
    },

    // ========================================================================
    // IDEA 2: Solving Unknowns in Proportions
    // ========================================================================
    {
      id: 2,
      badge: '🎯',
      flashcardTitle: 'Idea 2: Solving for Unknowns in Proportions (Linear & Binomial Terms)',
      flashcardText: '<strong>Strategy:</strong> "Solving the proportion means finding the unknown value in the proportion." When an unknown has coefficients or is inside a binomial like $(x - 3)$ or $(l - 3)$, cross-multiply to isolate the binomial group: $x - 3 = \\frac{b \\times c}{a}$, then solve for the unknown!',
      cards: [
        {
          id: 'p_ex2_1',
          type: 'solved',
          tag: 'Solved Example 2.1 • Linear Variable Unknowns',
          accent: '#6c5ce7',
          q: 'Solve each of the following proportions:<br><div class="q-sub-item">1) $\\frac{4}{12} = \\frac{20}{x}$</div><div class="q-sub-item">2) $\\frac{4}{7} = \\frac{x}{35}$</div>',
          steps: [
            { num: '1: Using Cross Multiplication', text: '$4 \\times x = 20 \\times 12 \\implies 4x = 240$. Divide by 4: $\\frac{4x}{4} = \\frac{240}{4} \\implies x = 60$.<br>Short answer: $x = \\frac{20 \\times 12}{4} = 60$.' },
            { num: '2: Using Cross Multiplication', text: '$4 \\times 35 = 7 \\times x \\implies 140 = 7x$. Divide by 7: $\\frac{140}{7} = \\frac{7x}{7} \\implies x = 20$.<br>Short answer: $x = \\frac{4 \\times 35}{7} = 20$.' }
          ],
          ans: '1) $x = 60$. &nbsp;&nbsp; 2) $x = 20$.'
        },
        {
          id: 'p_ex2_2',
          type: 'solved',
          tag: 'Solved Example 2.2 • Binomial & Grouped Unknowns',
          accent: '#0984e3',
          q: 'Solve each of the following proportions:<br><div class="q-sub-item">1) $\\frac{3}{x - 3} = \\frac{12}{8}$</div><div class="q-sub-item">2) $\\frac{40}{2x} = \\frac{5}{7}$</div>',
          steps: [
            { num: '1: Solving for (x - 3)', text: 'Cross-multiply to isolate $(x - 3)$:<br>$x - 3 = \\frac{3 \\times 8}{12} = \\frac{24}{12} = 2$.<br>Then: $x = 2 + 3 = 5$.<br>Another solution: Simplify $\\frac{12 \\div 4}{8 \\div 4} = \\frac{3}{2}$. Then $\\frac{3}{x - 3} = \\frac{3}{2} \\implies x - 3 = 2 \\implies x = 5$.' },
            { num: '2: Solving for 2x', text: 'Cross-multiply to isolate $2x$:<br>$2x = \\frac{7 \\times 40}{5} = \\frac{280}{5} = 56$.<br>Then: $x = \\frac{56}{2} = 28$.<br>Another solution: Multiply numerator and denominator by 8: $\\frac{5 \\times 8}{7 \\times 8} = \\frac{40}{56} \\implies 2x = 56 \\implies x = 28$.' }
          ],
          ans: '1) $x = 5$. &nbsp;&nbsp; 2) $x = 28$.'
        },
        {
          id: 'p_ex2_3',
          type: 'solved',
          tag: 'Solved Example 2.3 • Multi-Term Proportions',
          accent: '#e17055',
          q: 'Solve the following proportions:<br><div class="q-sub-item">1) $\\frac{1}{3} = \\frac{2}{b + 1}$</div><div class="q-sub-item">2) $\\frac{l - 3}{12} = \\frac{5}{4}$</div><div class="q-sub-item">3) $\\frac{16}{3x} = \\frac{8}{12}$</div>',
          steps: [
            { num: 'Item 1: Solving for b', text: 'Cross multiply: $1 \\times (b + 1) = 3 \\times 2 \\implies b + 1 = 6 \\implies b = 6 - 1 = 5$.' },
            { num: 'Item 2: Solving for l', text: 'Cross multiply: $4(l - 3) = 12 \\times 5 = 60 \\implies l - 3 = \\frac{60}{4} = 15 \\implies l = 15 + 3 = 18$.' },
            { num: 'Item 3: Solving for 3x', text: '$8 \\times 3x = 16 \\times 12 \\implies 24x = 192 \\implies x = \\frac{192}{24} = 8$.' }
          ],
          ans: '1) $b = 5$. &nbsp;&nbsp; 2) $l = 18$. &nbsp;&nbsp; 3) $x = 8$.'
        },
        {
          id: 'p_try2',
          type: 'try',
          tag: 'Try It Yourself 2.1 • Solving for X',
          accent: '#00b894',
          q: 'Find the value of $X$ in each of the following:<br><div class="q-sub-item">1) $\\frac{X}{32} = \\frac{9}{36}$</div><div class="q-sub-item">2) $\\frac{8}{X - 1} = \\frac{16}{10}$</div>',
          canvasId: 'can-prop-2',
          wrapId: 'can-wrap-prop-2',
          solId: 'sol-prop-2',
          steps: [
            { num: 'Part 1', text: 'Simplify $\\frac{9}{36} = \\frac{1}{4}$. Then $\\frac{X}{32} = \\frac{1}{4} \\implies X = \\frac{32 \\times 9}{36} = 8$.' },
            { num: 'Part 2', text: 'Cross-multiply: $16 \\times (X - 1) = 8 \\times 10 = 80 \\implies X - 1 = \\frac{80}{16} = 5 \\implies X = 5 + 1 = 6$.' }
          ],
          ans: '1) $X = 8$. &nbsp;&nbsp; 2) $X = 6$.'
        },
        {
          id: 'p_try2_b',
          type: 'try',
          tag: 'Try It Yourself 2.2 • Practice Proportions',
          accent: '#fdcb6e',
          q: 'Solve the following:<br><div class="q-sub-item">1) $a : 16 = 5 : 4$, find $a$.</div><div class="q-sub-item">2) $7 : 8 = 21 : m$, find $m$.</div><div class="q-sub-item">3) If $\\frac{n - 2}{3} = \\frac{3}{18}$, find $n$.</div>',
          canvasId: 'can-prop-2b',
          wrapId: 'can-wrap-prop-2b',
          solId: 'sol-prop-2b',
          steps: [
            { num: '1) Finding a', text: '$\\frac{a}{16} = \\frac{5}{4} \\implies 4a = 16 \\times 5 = 80 \\implies a = 20$.' },
            { num: '2) Finding m', text: '$\\frac{7}{8} = \\frac{21}{m} \\implies 7m = 8 \\times 21 = 168 \\implies m = \\frac{168}{7} = 24$.' },
            { num: '3) Finding n', text: '$\\frac{n - 2}{3} = \\frac{3}{18} = \\frac{1}{6} \\implies 6(n - 2) = 3 \\implies n - 2 = 0.5 \\implies n = 2.5$.' }
          ],
          ans: '1) $a = 20$. &nbsp;&nbsp; 2) $m = 24$. &nbsp;&nbsp; 3) $n = 2.5$.'
        }
      ]
    },

    // ========================================================================
    // IDEA 3: Real-World Life Applications on Proportion
    // ========================================================================
    {
      id: 3,
      badge: '📝',
      flashcardTitle: 'Idea 3: Real-World Life Applications & Rate Proportions',
      flashcardText: '<strong>Modeling Protocol:</strong> Set up a rate proportion comparing two quantities of different units: $$\\frac{\\text{Quantity}_1}{\\text{Unit}_1} = \\frac{\\text{Quantity}_2}{\\text{Unit}_2}$$ Apply cross-multiplication to find the unknown quantity, and convert time units when requested (e.g. minutes to hours)!',
      cards: [
        {
          id: 'p_ex3_1',
          type: 'solved',
          tag: 'Solved Example 3.1 • Automotive Fuel Consumption',
          accent: '#6c5ce7',
          q: 'Solve both automotive problems:<br><div class="q-sub-item">1) A car consumes 3 liters of gasoline to travel 33 km. How many liters does it need to travel 121 km at the same rate?</div><div class="q-sub-item">2) A car uses 5 liters of petrol to cover 40 km. How much petrol to cover 128 km?</div>',
          steps: [
            { num: 'Problem 1: Gasoline for 121 km', text: 'Let liters be $X$: $\\frac{X}{121} = \\frac{3}{33} \\implies 33X = 363 \\implies X = \\frac{363}{33} = 11\\text{ liters}$.' },
            { num: 'Problem 2: Petrol for 128 km', text: 'Let petrol be $P$: $\\frac{P}{128} = \\frac{5}{40} = \\frac{1}{8} \\implies 8P = 128 \\implies P = \\frac{128}{8} = 16\\text{ liters}$.' }
          ],
          ans: '1) 11 liters of gasoline. &nbsp;&nbsp; 2) 16 liters of petrol.'
        },
        {
          id: 'p_ex3_2',
          type: 'solved',
          tag: 'Solved Example 3.2 • Shopping & Food Prices',
          accent: '#0984e3',
          q: 'Solve both market rate problems:<br><div class="q-sub-item">1) Omar bought 8 apples for 60 LE. How many apples of the same type can he buy for 105 LE?</div><div class="q-sub-item">2) If $\\frac{3}{4}$ liter of milk costs 24 pounds, how much would $1\\frac{3}{4}$ liters cost at the same rate?</div>',
          steps: [
            { num: 'Problem 1: Omar Apples', text: '$\\frac{8}{60} = \\frac{x}{105} \\implies 60x = 8 \\times 105 = 840 \\implies x = \\frac{840}{60} = 14\\text{ apples}$.' },
            { num: 'Problem 2: Milk Cost', text: 'Unit price per liter $= 24 \\div \\frac{3}{4} = 24 \\times \\frac{4}{3} = 32\\text{ LE/liter}$.<br>For $1\\frac{3}{4} = \\frac{7}{4}$ liters: $\\frac{7}{4} \\times 32 = 7 \\times 8 = 56\\text{ pounds}$.' }
          ],
          ans: '1) 14 apples. &nbsp;&nbsp; 2) 56 pounds.'
        },
        {
          id: 'p_ex3_3',
          type: 'solved',
          tag: 'Solved Example 3.3 • Science & Agriculture Rates',
          accent: '#e17055',
          q: 'Solve both scientific and agricultural problems:<br><div class="q-sub-item">1) The weight of a body on Earth is 90 N, on the Moon is 15 N. What is the Moon weight of another body of 60 N on Earth?</div><div class="q-sub-item">2) A tractor cultivates 840 m² in 3 hours. What area does it cultivate in 5 hours? How many hours for 1,960 m²?</div>',
          steps: [
            { num: 'Problem 1: Moon Weight', text: '$\\frac{\\text{Moon}}{\\text{Earth}} = \\frac{15}{90} = \\frac{1}{6}$. Then $\\frac{x}{60} = \\frac{1}{6} \\implies x = 10\\text{ Newtons}$.' },
            { num: 'Problem 2 (Part 1): Area in 5 hours', text: 'Rate $= \\frac{840}{3} = 280\\text{ m}^2/\\text{hour}$. In 5 hours: $280 \\times 5 = 1,400\\text{ m}^2$.' },
            { num: 'Problem 2 (Part 2): Hours for 1,960 m²', text: 'Time $= \\frac{1960}{280} = 7\\text{ hours}$.' }
          ],
          ans: '1) 10 Newtons. &nbsp;&nbsp; 2) Area: 1,400 m²; Time: 7 hours.'
        },
        {
          id: 'p_try3',
          type: 'try',
          tag: 'Try It Yourself 3.1 • Recipe Scaling',
          accent: '#00b894',
          q: 'A baker needs 5 cups of sugar to make 3 cakes. How many cups of sugar does the baker need to make 15 cakes?',
          canvasId: 'can-prop-3',
          wrapId: 'can-wrap-prop-3',
          solId: 'sol-prop-3',
          steps: [
            { num: 'Set Up Proportion', text: 'Let $S$ be the cups of sugar: $\\frac{S}{15} = \\frac{5}{3}$.' },
            { num: 'Cross-Multiply', text: '$3S = 15 \\times 5 = 75 \\implies S = \\frac{75}{3} = 25\\text{ cups}$.' }
          ],
          ans: 'The baker needs 25 cups of sugar.'
        },
        {
          id: 'p_try3_b',
          type: 'try',
          tag: 'Try It Yourself 3.2 • School & Reading Rates',
          accent: '#fdcb6e',
          q: 'Solve both practical questions:<br><div class="q-sub-item">1) In a school, there are 221 students and 13 teachers. If students increase to 272, how many teachers are needed?</div><div class="q-sub-item">2) Eman reads 10 pages in 40 minutes. How many hours would it take her to read a book of 120 pages?</div>',
          canvasId: 'can-prop-3b',
          wrapId: 'can-wrap-prop-3b',
          solId: 'sol-prop-3b',
          steps: [
            { num: '1: Teachers', text: 'Ratio $= \\frac{221}{13} = 17\\text{ students/teacher}$. For 272 students: $\\frac{272}{T} = 17 \\implies T = \\frac{272}{17} = 16\\text{ teachers}$.' },
            { num: '2: Eman Reading Time', text: 'Time in minutes $= \\frac{40 \\times 120}{10} = 480\\text{ minutes}$. Convert to hours: $\\frac{480}{60} = 8\\text{ hours}$.' }
          ],
          ans: '1) 16 teachers. &nbsp;&nbsp; 2) 8 hours.'
        }
      ]
    },

    // ========================================================================
    // IDEA 4: Graphical Representation of Proportion & Origin Test
    // ========================================================================
    {
      id: 4,
      badge: '📈',
      flashcardTitle: 'Idea 4: Graphical Representation of Proportion & The Origin Test',
      flashcardText: '<strong>Origin Line Rule:</strong><br>• If the plotted points lie on a straight line passing through the origin $(0, 0)$, then the relationship represents a proportion.<br>• If the plotted points do not lie on a straight line, or they lie on a straight line that does not pass through the origin, then the relationship does NOT represent a proportion.',
      cards: [
        {
          id: 'p_ex4_1',
          type: 'solved',
          tag: 'Solved Example 4.1 • Distance vs Time Tables',
          accent: '#6c5ce7',
          q: 'The two tables below show distance in kilometers covered by a car. Determine graphically whether distance is proportional to time:<br><div class="q-sub-item">Table 1: Time (1, 2, 3, 4), Distance (70, 140, 210, 280)</div><div class="q-sub-item">Table 2: Time (1, 2, 3, 4), Distance (80, 100, 190, 260)</div>',
          steps: [
            { num: 'Table 1 Analysis', text: 'Points: $(1, 70), (2, 140), (3, 210), (4, 280)$. Calculate ratio $\\frac{d}{t}$: $\\frac{70}{1} = 70, \\frac{140}{2} = 70, \\frac{210}{3} = 70, \\frac{280}{4} = 70$. The points lie on a straight line passing through the origin $(0, 0)$. Therefore: <strong>The distance in kilometers is proportional to the time in hours.</strong>' },
            { num: 'Table 2 Analysis', text: 'Points: $(1, 80), (2, 100), (3, 190), (4, 260)$. Ratios: $\\frac{80}{1} = 80, \\frac{100}{2} = 50, \\frac{190}{3} \\approx 63.3$. The points do not lie on a straight line. Therefore: <strong>The distance in kilometers is not proportional to the time in hours.</strong>' }
          ],
          ans: 'Table 1 is proportional; Table 2 is NOT proportional.'
        },
        {
          id: 'p_ex4_2',
          type: 'solved',
          tag: 'Solved Example 4.2 • Origin Line Test Analysis',
          accent: '#0984e3',
          q: 'Which of the relationships shown below represents a proportion?',
          svg: `
            <svg width="100%" height="160" viewBox="0 0 560 160">
              <!-- Graph (a) -->
              <g transform="translate(10, 10)">
                <rect x="25" y="10" width="80" height="90" fill="#ffffff" stroke="#e84393" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="25" y1="100" x2="115" y2="100" stroke="#d63031" stroke-width="2"/>
                <line x1="25" y1="10" x2="25" y2="100" stroke="#d63031" stroke-width="2"/>
                <path d="M 25 100 Q 65 95 105 20" fill="none" stroke="#d63031" stroke-width="2.5"/>
                <text x="70" y="125" font-size="13" font-weight="900" fill="#d63031" text-anchor="middle">(a) Curve</text>
              </g>
              <!-- Graph (b) - Correct -->
              <g transform="translate(150, 10)">
                <rect x="25" y="10" width="80" height="90" fill="#ffffff" stroke="#00b894" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="25" y1="100" x2="115" y2="100" stroke="#00b894" stroke-width="2"/>
                <line x1="25" y1="10" x2="25" y2="100" stroke="#00b894" stroke-width="2"/>
                <line x1="25" y1="100" x2="105" y2="20" stroke="#00b894" stroke-width="3"/>
                <circle cx="25" cy="100" r="4" fill="#00b894"/>
                <text x="70" y="125" font-size="13" font-weight="900" fill="#00b894" text-anchor="middle">(b) Straight via (0,0) ✔</text>
              </g>
              <!-- Graph (c) -->
              <g transform="translate(290, 10)">
                <rect x="25" y="10" width="80" height="90" fill="#ffffff" stroke="#e84393" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="25" y1="100" x2="115" y2="100" stroke="#d63031" stroke-width="2"/>
                <line x1="25" y1="10" x2="25" y2="100" stroke="#d63031" stroke-width="2"/>
                <line x1="25" y1="80" x2="105" y2="30" stroke="#d63031" stroke-width="2.5"/>
                <text x="70" y="125" font-size="13" font-weight="900" fill="#d63031" text-anchor="middle">(c) y-intercept 1</text>
              </g>
              <!-- Graph (d) -->
              <g transform="translate(430, 10)">
                <rect x="25" y="10" width="80" height="90" fill="#ffffff" stroke="#e84393" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="25" y1="100" x2="115" y2="100" stroke="#d63031" stroke-width="2"/>
                <line x1="25" y1="10" x2="25" y2="100" stroke="#d63031" stroke-width="2"/>
                <line x1="25" y1="20" x2="105" y2="85" stroke="#d63031" stroke-width="2.5"/>
                <text x="70" y="125" font-size="13" font-weight="900" fill="#d63031" text-anchor="middle">(d) y-intercept 4</text>
              </g>
            </svg>
          `,
          steps: [
            { num: 'Graph (a) Evaluation', text: 'Curved line. By definition, a proportion must be a straight line. Thus (a) is not proportional.' },
            { num: 'Graph (b) Evaluation', text: 'Straight line passing directly through the origin $(0, 0)$ and $(8, 8)$. Thus (b) <strong>represents a proportion</strong>!' },
            { num: 'Graph (c) Evaluation', text: 'Straight line, but crosses the y-axis at $(0, 1)$, NOT at the origin $(0, 0)$. Thus (c) is not proportional.' },
            { num: 'Graph (d) Evaluation', text: 'Straight line with negative slope crossing at $(0, 4) \\ne (0, 0)$. Thus (d) is not proportional.' }
          ],
          ans: 'Graph (b) is the correct relationship that represents a proportion.'
        },
        {
          id: 'p_ex4_3',
          type: 'solved',
          tag: 'Solved Example 4.3 • Travel vs Delivery Costs',
          accent: '#e17055',
          q: 'Represent the tables graphically, then determine which one shows a proportional relationship:<br><div class="q-sub-item">1) Covered Distances: Time (seconds) [1, 2, 3, 4], Distance (meters) [6, 12, 18, 24]</div><div class="q-sub-item">2) Price of pies including delivery fees: Number of Pies [1, 2, 3, 4], Price (LE) [25, 45, 65, 85]</div>',
          steps: [
            { num: 'Table 1: Distances', text: 'Ratios: $\\frac{6}{1} = 6, \\frac{12}{2} = 6, \\frac{18}{3} = 6, \\frac{24}{4} = 6$. Ratio is constant ($6\\text{ m/s}$). The line passes through $(0, 0)$. Represents a proportional relationship.' },
            { num: 'Table 2: Pies with Delivery Fee', text: 'Ratios: $\\frac{25}{1} = 25, \\frac{45}{2} = 22.5, \\frac{65}{3} \\approx 21.67$. Notice each extra pie costs 20 LE, and the delivery fee is 5 LE ($y = 20x + 5$). At $x = 0$, $y = 5 \\ne 0$. Does NOT pass through origin $\\implies$ NOT proportional.' }
          ],
          ans: 'Table 1 is proportional; Table 2 is NOT proportional.'
        },
        {
          id: 'p_try4',
          type: 'try',
          tag: 'Try It Yourself 4.1 • Data Linearity Check',
          accent: '#00b894',
          q: 'The table shows the relationship between the number of pages Adam can type on a computer and time in hours:<br><div class="q-sub-item">Time (hours): [1, 2, 3, 4] &nbsp;&nbsp;|&nbsp;&nbsp; Pages: [3, 6, 9, 21]</div>Determine whether the number of pages is proportional to the time in hours.',
          canvasId: 'can-prop-4',
          wrapId: 'can-wrap-prop-4',
          solId: 'sol-prop-4',
          steps: [
            { num: 'Check Ratios', text: '$\\frac{3}{1} = 3, \\quad \\frac{6}{2} = 3, \\quad \\frac{9}{3} = 3, \\quad \\text{but: } \\frac{21}{4} = 5.25 \\ne 3$.' },
            { num: 'Conclusion', text: 'Because the fourth ratio does not equal 3, the points do not lie on a straight line. Therefore, the number of pages is <strong>NOT proportional</strong> to the time in hours.' }
          ],
          ans: 'The relationship is NOT proportional.'
        },
        {
          id: 'p_try4_b',
          type: 'try',
          tag: 'Try It Yourself 4.2 • Market Rates Comparison',
          accent: '#fdcb6e',
          q: 'Determine which table shows a proportional relationship:<br><div class="q-sub-item">1) Price of apples in a market: Weight (kg): [1, 2, 3, 4], Price (LE): [45, 90, 135, 180]</div><div class="q-sub-item">2) Price of shampoo: Volume (mL): [100, 200, 300, 400], Price (LE): [40, 50, 58, 70]</div>',
          canvasId: 'can-prop-4b',
          wrapId: 'can-wrap-prop-4b',
          solId: 'sol-prop-4b',
          steps: [
            { num: 'Table 3: Apples', text: '$\\frac{45}{1} = 45, \\frac{90}{2} = 45, \\frac{135}{3} = 45, \\frac{180}{4} = 45$. Constant ratio, line through $(0, 0) \\implies$ <strong>Proportional</strong>.' },
            { num: 'Table 4: Shampoo', text: '$\\frac{40}{100} = 0.40, \\frac{50}{200} = 0.25, \\frac{58}{300} \\approx 0.193$. Ratios are not constant $\\implies$ <strong>NOT proportional</strong>.' }
          ],
          ans: 'Table 3 (Apples) is proportional; Table 4 (Shampoo) is NOT proportional.'
        }
      ]
    },

    // ========================================================================
    // IDEA 5: Creative Thinking & Proportional Products
    // ========================================================================
    {
      id: 5,
      badge: '⭐',
      flashcardTitle: 'Idea 5: Creative Thinking, Geometric Proportions & Combined Rates',
      flashcardText: '<strong>Advanced Strategies:</strong><br>• <strong>Equilateral Triangles:</strong> Perimeter $P = 3s$. The ratio $\\frac{P}{s} = 3$ is constant, and $P = 0$ when $s = 0$, forming a valid proportion!<br>• <strong>Combined Work Rate:</strong> Add individual fractional hourly rates: $\\text{Rate} = \\frac{1}{t_1} + \\frac{1}{t_2}$.<br>• <strong>Proportional Products:</strong> If $a, 2, 5, b$ are proportional, then $\\frac{a}{2} = \\frac{5}{b} \\implies a \\times b = 10$!',
      cards: [
        {
          id: 'p_ex5_1',
          type: 'solved',
          tag: 'Solved Example 5.1 • Equilateral Triangles Perimeter',
          accent: '#6c5ce7',
          q: 'The triangles in the figure are equilateral with side lengths 2 cm, 3 cm, and 4 cm. Does the relationship between the perimeter and the side length in the equilateral triangles represent a proportion? Explain your answer.',
          steps: [
            { num: 'Step 1: Calculate Perimeters', text: 'Triangle 1: $s_1 = 2\\text{ cm} \\implies P_1 = 3 \\times 2 = 6\\text{ cm}$.<br>Triangle 2: $s_2 = 3\\text{ cm} \\implies P_2 = 3 \\times 3 = 9\\text{ cm}$.<br>Triangle 3: $s_3 = 4\\text{ cm} \\implies P_3 = 3 \\times 4 = 12\\text{ cm}$.' },
            { num: 'Step 2: Check Ratios', text: '$$\\frac{P_1}{s_1} = \\frac{6}{2} = 3, \\quad \\frac{P_2}{s_2} = \\frac{9}{3} = 3, \\quad \\frac{P_3}{s_3} = \\frac{12}{4} = 3$$' },
            { num: 'Step 3: Verification', text: 'Since the ratio of perimeter to side length is constant ($3$), and when side length is $0$, perimeter is $0$, the plotted points lie on a straight line passing through $(0, 0)$.' }
          ],
          ans: 'Yes, the relationship represents a valid proportion because P = 3s (constant ratio = 3).'
        },
        {
          id: 'p_ex5_2',
          type: 'solved',
          tag: 'Solved Example 5.2 • Collaborative Work Rate',
          accent: '#0984e3',
          q: 'A worker can paint a wall in 4 hours, and another worker can paint the same wall in 2 hours. If both workers work together to paint the same wall, how many minutes will they need to paint the wall?',
          steps: [
            { num: 'Step 1: Find Individual Rates', text: 'Worker 1 paints $\\frac{1}{4}$ of the wall per hour.<br>Worker 2 paints $\\frac{1}{2} = \\frac{2}{4}$ of the wall per hour.' },
            { num: 'Step 2: Calculate Combined Rate', text: 'Combined rate $= \\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$ of the wall per hour.' },
            { num: 'Step 3: Calculate Time in Hours', text: 'Time $= 1 \\div \\frac{3}{4} = \\frac{4}{3}\\text{ hours}$.' },
            { num: 'Step 4: Convert to Minutes', text: 'Time in minutes $= \\frac{4}{3} \\times 60 = 4 \\times 20 = 80\\text{ minutes}$.' }
          ],
          ans: 'They will need 80 minutes to paint the wall together.'
        },
        {
          id: 'p_ex5_3',
          type: 'solved',
          tag: 'Solved Example 5.3 • Proportional Products & Variables',
          accent: '#e17055',
          q: 'Solve both problems:<br><div class="q-sub-item">1) If the quantities $a, 2, 5$, and $b$ are proportional, find the value of $a \\times b$.</div><div class="q-sub-item">2) If $\\frac{8}{y} = \\frac{y}{2}$, where $y$ is a positive integer, find $y$.</div>',
          steps: [
            { num: 'Problem 1: a × b', text: 'Since $a, 2, 5, b$ are proportional: $\\frac{a}{2} = \\frac{5}{b}$. Cross-multiplying extremes and means: $a \\times b = 2 \\times 5 = 10$.' },
            { num: 'Problem 2: y²/16', text: 'Cross-multiply: $y \\times y = 8 \\times 2 \\implies y^2 = 16$. Taking the positive square root: $y = 4$.' }
          ],
          ans: '1) a × b = 10. &nbsp;&nbsp; 2) y = 4.'
        },
        {
          id: 'p_try5',
          type: 'try',
          tag: 'Try It Yourself 5.1 • Variable Equations',
          accent: '#00b894',
          q: 'Solve both parts:<br><div class="q-sub-item">1) If $\\frac{8}{X} = 0.5$, what is the value of $X$?</div><div class="q-sub-item">2) If $\\frac{2}{3} = \\frac{6}{k}$, find the value of $k$.</div>',
          canvasId: 'can-prop-5',
          wrapId: 'can-wrap-prop-5',
          solId: 'sol-prop-5',
          steps: [
            { num: 'Part 1', text: '$\\frac{8}{X} = \\frac{1}{2} \\implies X = 8 \\times 2 = 16$. (Or $X = \\frac{8}{0.5} = 16$).' },
            { num: 'Part 2', text: '$2k = 3 \\times 6 = 18 \\implies k = \\frac{18}{2} = 9$.' }
          ],
          ans: '1) X = 16. &nbsp;&nbsp; 2) k = 9.'
        },
        {
          id: 'p_try5_b',
          type: 'try',
          tag: 'Try It Yourself 5.2 • Monthly Savings Rates',
          accent: '#fdcb6e',
          q: 'Saving: The table shows how much Ibrahim saves within a certain number of months. Are the amounts saved proportional to the number of months?<br><div class="q-sub-item">Amount (LE): [300, 600, 900, 1,200] &nbsp;&nbsp;|&nbsp;&nbsp; Months: [2, 4, 6, 8]</div>',
          canvasId: 'can-prop-5b',
          wrapId: 'can-wrap-prop-5b',
          solId: 'sol-prop-5b',
          steps: [
            { num: 'Calculate Ratios', text: '$\\frac{300}{2} = 150\\text{ LE/month}, \\quad \\frac{600}{4} = 150, \\quad \\frac{900}{6} = 150, \\quad \\frac{1200}{8} = 150$.' },
            { num: 'Conclusion', text: 'All pairs have the exact same rate of $150\\text{ LE}$ per month. Therefore, the amounts saved are directly proportional to the number of months.' }
          ],
          ans: 'Yes, the amounts saved are proportional to the number of months (rate = 150 LE/month).'
        }
      ]
    }
  ],

  // 10 Comprehensive High-Stakes Exam MCQs
  mcqs: [
    {
      id: 1,
      q: "A proportion is defined as:",
      options: [
        "The sum of two fractions",
        "The equality of at least two ratios or two rates",
        "The difference between extremes and means",
        "A single simplified fraction"
      ],
      correct: 1,
      proof: "By standard definition: 'A proportion is an equality of at least two ratios or two rates.'"
    },
    {
      id: 2,
      q: "If two ratios are equal, then the product of the extremes is equal to:",
      options: [
        "The sum of the means",
        "The difference of the means",
        "The product of the means",
        "The quotient of the means"
      ],
      correct: 2,
      proof: "By the Cross Multiplication Property: Product of Extremes = Product of Means ($ad = bc$)."
    },
    {
      id: 3,
      q: "Which of the following ratios is proportional to the given ratio $\\frac{24}{36}$?",
      options: [
        "$\\frac{8}{18}$",
        "$\\frac{10}{12}$",
        "$\\frac{10}{15}$",
        "$\\frac{16}{28}$"
      ],
      correct: 2,
      proof: "Simplify $\\frac{24}{36} = \\frac{2}{3}$. Multiply both terms by 5: $\\frac{2 \\times 5}{3 \\times 5} = \\frac{10}{15}$. Thus (c) is correct."
    },
    {
      id: 4,
      q: "Which of the following pairs of ratios are not proportional?",
      options: [
        "$\\frac{2}{5} , \\frac{12}{30}$",
        "$\\frac{8}{10} , \\frac{12}{15}$",
        "$\\frac{7}{8} , \\frac{35}{40}$",
        "$\\frac{3}{4} , \\frac{12}{18}$"
      ],
      correct: 3,
      proof: "In (d): $3 \\times 18 = 54$, while $4 \\times 12 = 48$. Since $54 \\ne 48$, $\\frac{3}{4}$ and $\\frac{12}{18}$ are NOT proportional."
    },
    {
      id: 5,
      q: "If $\\frac{8}{X} = 0.5$, what is the value of $X$?",
      options: ["4", "8", "16", "40"],
      correct: 2,
      proof: "$0.5 = \\frac{1}{2}$. $\\frac{8}{X} = \\frac{1}{2} \\implies X = 8 \\times 2 = 16$."
    },
    {
      id: 6,
      q: "A person writes 150 words in 30 minutes. How many words does he write in two hours?",
      options: ["10 words", "15 words", "300 words", "600 words"],
      correct: 3,
      proof: "Two hours = 120 minutes. $\\frac{150}{30} = \\frac{W}{120} \\implies W = \\frac{150 \\times 120}{30} = 5 \\times 120 = 600\\text{ words}$."
    },
    {
      id: 7,
      q: "Which of the relationships shown represents a proportion?",
      options: [
        "Curved line passing through (0, 0)",
        "Straight line passing through the origin (0, 0) to (8, 8)",
        "Straight line with y-intercept 1",
        "Straight line with y-intercept 4"
      ],
      correct: 1,
      proof: "By the origin line rule: only a straight line passing through $(0, 0)$ represents a proportion. Graph (b) is the correct one."
    },
    {
      id: 8,
      q: "If the quantities $a, 2, 5$, and $b$ are proportional, then the value of $a \\times b$ is:",
      options: ["7", "10", "20", "2.5"],
      correct: 1,
      proof: "$\\frac{a}{2} = \\frac{5}{b} \\implies a \\times b = 2 \\times 5 = 10$."
    },
    {
      id: 9,
      q: "If $\\frac{8}{y} = \\frac{y}{2}$, where $y$ is a positive integer, then $y = $",
      options: ["2", "4", "8", "16"],
      correct: 1,
      proof: "$y \\times y = 8 \\times 2 \\implies y^2 = 16 \\implies y = \\sqrt{16} = 4$."
    },
    {
      id: 10,
      q: "If $\\frac{3}{4}$ liter of milk costs 24 pounds, how much would $1\\frac{3}{4}$ liters cost at the same rate?",
      options: ["48 pounds", "32 pounds", "64 pounds", "56 pounds"],
      correct: 3,
      proof: "Price per liter $= 24 \\div \\frac{3}{4} = 32\\text{ pounds}$. For $1\\frac{3}{4} = \\frac{7}{4}$ liters: $\\frac{7}{4} \\times 32 = 56\\text{ pounds}$."
    }
  ],

  // 3 Timed Quiz Models (30 Questions Total)
  quizModels: [
    {
      title: "Timed Quiz — Model #1 (Definitions & Equivalence Tests)",
      questions: [
        {
          q: "1. A proportion is defined as:",
          options: ["The sum of two fractions", "The equality of at least two ratios or two rates", "The difference between extremes and means", "A single simplified fraction"],
          correct: 1,
          proof: "Standard definition: Equality of at least two ratios or two rates."
        },
        {
          q: "2. In the proportion $3 : 4 = 6 : 8$, the extremes are:",
          options: ["4 and 6", "3 and 4", "3 and 8", "6 and 8"],
          correct: 2,
          proof: "First and fourth terms are the extremes (3 and 8)."
        },
        {
          q: "3. If $\\frac{20}{25} = \\frac{36}{x}$, then $x = $",
          options: ["40", "30", "45", "50"],
          correct: 2,
          proof: "$\\frac{20}{25} = \\frac{4}{5} = \\frac{36}{x} \\implies 4x = 180 \\implies x = 45$."
        },
        {
          q: "4. Which pair represents a valid proportion?",
          options: ["$\\frac{2}{5}$ and $\\frac{4}{15}$", "$\\frac{15}{25}$ and $\\frac{30}{50}$", "$\\frac{3}{4}$ and $\\frac{6}{9}$", "$\\frac{10}{3}$ and $\\frac{40}{15}$"],
          correct: 1,
          proof: "Both simplify to $\\frac{3}{5}$."
        },
        {
          q: "5. If $\\frac{48}{72} = \\frac{x}{15}$, then $x = $",
          options: ["10", "12", "8", "14"],
          correct: 0,
          proof: "$\\frac{48}{72} = \\frac{2}{3} = \\frac{x}{15} \\implies 3x = 30 \\implies x = 10$."
        },
        {
          q: "6. If $\\frac{12}{x} = \\frac{18}{12}$, then $x = $",
          options: ["6", "8", "9", "10"],
          correct: 1,
          proof: "$18x = 144 \\implies x = 8$."
        },
        {
          q: "7. Which set of quantities is proportional?",
          options: ["5, 8, 15, 24", "7, 8, 14, 15", "10, 12, 15, 20", "4, 6, 8, 10"],
          correct: 0,
          proof: "$5 \\times 24 = 120$ and $8 \\times 15 = 120$."
        },
        {
          q: "8. In $\\frac{x}{15} = \\frac{3}{5}$, the value of $x$ is:",
          options: ["6", "9", "12", "10"],
          correct: 1,
          proof: "$5x = 45 \\implies x = 9$."
        },
        {
          q: "9. If $\\frac{6}{x} = \\frac{12}{14}$, then $x = $",
          options: ["7", "8", "6", "9"],
          correct: 0,
          proof: "$12x = 84 \\implies x = 7$."
        },
        {
          q: "10. If $\\frac{15}{x} = \\frac{30}{12}$, then $x = $",
          options: ["4", "5", "6", "8"],
          correct: 2,
          proof: "$30x = 180 \\implies x = 6$."
        }
      ]
    },
    {
      title: "Timed Quiz — Model #2 (Solving Equations & Unknowns)",
      questions: [
        {
          q: "1. If $\\frac{3}{4} = \\frac{x}{20}$, then $x = $",
          options: ["12", "15", "16", "18"],
          correct: 1,
          proof: "$4x = 60 \\implies x = 15$."
        },
        {
          q: "2. If $a : 16 = 5 : 4$, then $a = $",
          options: ["20", "15", "25", "18"],
          correct: 0,
          proof: "$4a = 80 \\implies a = 20$."
        },
        {
          q: "3. If $7 : 8 = 21 : m$, then $m = $",
          options: ["24", "28", "32", "16"],
          correct: 0,
          proof: "$7m = 168 \\implies m = 24$."
        },
        {
          q: "4. If $\\frac{1}{3} = \\frac{2}{b + 1}$, then $b = $",
          options: ["4", "5", "6", "7"],
          correct: 1,
          proof: "$b + 1 = 6 \\implies b = 5$."
        },
        {
          q: "5. If $\\frac{l - 3}{12} = \\frac{5}{4}$, then $l = $",
          options: ["18", "15", "12", "8"],
          correct: 0,
          proof: "$4(l - 3) = 60 \\implies l - 3 = 15 \\implies l = 18$."
        },
        {
          q: "6. If $\\frac{16}{3x} = \\frac{8}{12}$, then $x = $",
          options: ["6", "8", "10", "4"],
          correct: 1,
          proof: "$24x = 192 \\implies x = 8$."
        },
        {
          q: "7. If $\\frac{2}{3} = \\frac{6}{k}$, find $k$.",
          options: ["9", "12", "8", "10"],
          correct: 0,
          proof: "$2k = 18 \\implies k = 9$."
        },
        {
          q: "8. If 100 grams of chocolate provide 300 calories, how many calories in 30 grams?",
          options: ["60 calories", "90 calories", "100 calories", "80 calories"],
          correct: 1,
          proof: "$\\frac{300}{100} \\times 30 = 90\\text{ calories}$."
        },
        {
          q: "9. If $\\frac{n - 2}{3} = \\frac{3}{18}$, then $n = $",
          options: ["2", "2.5", "3", "3.5"],
          correct: 1,
          proof: "$n - 2 = \\frac{9}{18} = 0.5 \\implies n = 2.5$."
        },
        {
          q: "10. If $a, 2, 5, b$ are proportional, then $a \\times b = $",
          options: ["10", "7", "20", "2.5"],
          correct: 0,
          proof: "$a \\times b = 2 \\times 5 = 10$."
        }
      ]
    },
    {
      title: "Timed Quiz — Model #3 (Applications, Graphs & Problem Solving)",
      questions: [
        {
          q: "1. In a school of 221 students and 13 teachers, how many teachers for 272 students?",
          options: ["14", "15", "16", "18"],
          correct: 2,
          proof: "$\\frac{272}{17} = 16$ teachers."
        },
        {
          q: "2. Omar bought 8 apples for 60 LE. How many apples for 105 LE?",
          options: ["12", "14", "15", "16"],
          correct: 1,
          proof: "$\\frac{8 \\times 105}{60} = 14$ apples."
        },
        {
          q: "3. A car uses 5 L petrol for 40 km. Liters for 128 km?",
          options: ["12", "15", "16", "20"],
          correct: 2,
          proof: "$\\frac{5 \\times 128}{40} = 16$ liters."
        },
        {
          q: "4. A body weighs 90 N on Earth, 15 N on Moon. Moon weight for 60 N on Earth?",
          options: ["10 N", "12 N", "8 N", "15 N"],
          correct: 0,
          proof: "$\\frac{15 \\times 60}{90} = 10$ Newtons."
        },
        {
          q: "5. Eman reads 10 pages in 40 minutes. How many hours for 120 pages?",
          options: ["6 hours", "8 hours", "10 hours", "4 hours"],
          correct: 1,
          proof: "$\\frac{40 \\times 120}{10} = 480\\text{ min} = 8\\text{ hours}$."
        },
        {
          q: "6. A tractor cultivates 840 m² in 3 hours. Area in 5 hours?",
          options: ["1,200 m²", "1,400 m²", "1,500 m²", "1,680 m²"],
          correct: 1,
          proof: "$\\frac{840}{3} \\times 5 = 1,400\\text{ m}^2$."
        },
        {
          q: "7. Hours needed for tractor to cultivate 1,960 m²?",
          options: ["6 hours", "7 hours", "8 hours", "9 hours"],
          correct: 1,
          proof: "$\\frac{1960}{280} = 7$ hours."
        },
        {
          q: "8. Which graph represents a proportion?",
          options: ["Curved line through (0,0)", "Straight line through origin (0,0)", "Straight line with y-intercept 1", "Straight line with y-intercept 4"],
          correct: 1,
          proof: "Must be a straight line passing through $(0,0)$."
        },
        {
          q: "9. Does perimeter vs side length in equilateral triangles represent a proportion?",
          options: ["Yes, because P = 3s", "No, because geometry is not linear", "Only for right triangles", "No, because perimeter is larger"],
          correct: 0,
          proof: "$P = 3s$, constant ratio $\\frac{P}{s} = 3$ passing through origin."
        },
        {
          q: "10. Worker A takes 4 hours, Worker B takes 2 hours. Minutes together?",
          options: ["60 minutes", "80 minutes", "90 minutes", "120 minutes"],
          correct: 1,
          proof: "Combined rate $= \\frac{1}{4} + \\frac{1}{2} = \\frac{3}{4} \\implies \\frac{4}{3}\\text{ hours} = 80\\text{ minutes}$."
        }
      ]
    }
  ]
};
