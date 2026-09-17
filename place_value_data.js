// ==========================================================================
// UNIT 1: NUMBERS & OPERATIONS IN BASE TEN
// LESSON: PLACE VALUE, POWERS OF 10 & ESTIMATION
// Official Curriculum • Grade 5 (English Edition)
// Prepared for: Mr Ahmed Abd El-Motaal (Math Teacher & Content Creator)
// ==========================================================================
const LESSON_PLACE_VALUE = {
  key: 'place_value',
  unitTag: '<i class="fa-solid fa-cubes-stacked"></i> Unit 1 • Numbers & Operations in Base Ten',
  title: 'Place Value, Powers of 10 & Product Estimation',
  subtitle: 'Master multidigit place value through millions, base-10 shifts (10 times more/less), multiplying by powers of 10, exponential notation, and strategic product estimation using rounding and compatible numbers.',
  stageBadge: '<i class="fa-solid fa-graduation-cap"></i> Grade 5 • Place Value, Powers of 10 & Estimation',

  // 1. Diagnostic Pre-Study & Readiness Review
  preStudy: {
    title: 'Pre-Study: Check Your Readiness',
    subtitle: 'Review essential prerequisite concepts: reading multi-digit whole numbers, multiplying by 10, and basic rounding before advancing to millions and powers of 10.',
    cards: [
      {
        icon: 'fa-solid fa-table-cells',
        iconBg: '#6c5ce7',
        title: '1. Understanding Periods & Digits',
        desc: `
          Numbers are grouped into 3-digit periods separated by commas (Millions, Thousands, Ones):
          <div class="pre-study-formula-box">
            • In each period, place values follow the repeating pattern: <strong>Hundreds, Tens, Ones</strong>.<br>
            • Example: In $213,560,447$, the digit 2 is in the hundred millions place.
          </div>
        `
      },
      {
        icon: 'fa-solid fa-arrows-left-right',
        iconBg: '#00b894',
        title: '2. The Base-Ten Shift Rule',
        desc: `
          Our number system is based on ten:
          <div class="pre-study-formula-box">
            • Moving <strong>1 place to the left</strong> multiplies a digit's value by $10$ ($10\\times$ more).<br>
            • Moving <strong>1 place to the right</strong> divides a digit's value by $10$ ($10\\times$ less).
          </div>
        `
      },
      {
        icon: 'fa-solid fa-superscript',
        iconBg: '#fdcb6e',
        title: '3. What is an Exponent?',
        desc: `
          Repeated multiplication can be written in exponential form:
          <div class="pre-study-formula-box">
            $$10 \\times 10 \\times 10 = 10^3$$
            • <strong>Base:</strong> The repeated factor ($10$).<br>
            • <strong>Exponent:</strong> How many times the factor is repeated ($3$).
          </div>
        `
      }
    ],
    diagnosticQuestions: [
      {
        id: 'diag-pv-1',
        text: '1. In the number $421,389$, what is the place value of the digit 2?',
        options: ['Ten thousands', 'Thousands', 'Hundred thousands', 'Millions'],
        correct: 0,
        explanation: 'The digit 4 is in hundred-thousands, 2 is in ten-thousands, and 1 is in thousands.'
      },
      {
        id: 'diag-pv-2',
        text: '2. What is the value of $10^4$ in standard form?',
        options: ['40', '400', '1,000', '10,000'],
        correct: 3,
        explanation: '$10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$ (1 followed by 4 zeros).'
      },
      {
        id: 'diag-pv-3',
        text: '3. What is the estimated product of $69 \\times 63$ using rounding to the nearest ten?',
        options: ['4,200', '3,600', '4,500', '4,800'],
        correct: 0,
        explanation: 'Round 69 to 70 and 63 to 60. Then $70 \\times 60 = 4,200$.'
      }
    ]
  },

  // 2. Real-World Applications (STEM & Astronomy)
  realWorldApps: [
    {
      accent: '#6c5ce7',
      accentBg: 'rgba(108, 92, 231, 0.12)',
      icon: 'fa-solid fa-shuttle-space',
      tag: 'Aerospace Engineering',
      title: 'Earth & Spacecraft Mass in Powers of 10',
      desc: 'Earth has an estimated mass of about $6 \\times 10^{24}\\text{ kg}$. A deep-space exploration spacecraft has a mass of $3 \\times 10^4\\text{ kg}$. Writing these in standard form allows aerospace engineers to compute propulsion ratios accurately.',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 320 150">
          <circle cx="75" cy="75" r="48" fill="url(#earthGrad)"/>
          <defs>
            <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00cec9"/>
              <stop offset="100%" stop-color="#0984e3"/>
            </linearGradient>
          </defs>
          <path d="M 50 65 Q 65 50 85 60 Q 95 75 75 90 Z" fill="#55efc4" opacity="0.6"/>
          <!-- Spacecraft -->
          <g transform="translate(170, 45)">
            <rect x="20" y="25" width="45" height="16" rx="4" fill="#6c5ce7"/>
            <polygon points="65,25 85,33 65,41" fill="#fdcb6e"/>
            <rect x="30" y="10" width="8" height="46" rx="2" fill="#74b9ff"/>
            <text x="0" y="80" fill="#2d3436" font-size="11" font-weight="900">Spacecraft = 3 × 10⁴ kg</text>
            <text x="0" y="95" fill="#00b894" font-size="12" font-weight="900">= 30,000 kg</text>
          </g>
        </svg>
      `,
      solutionHtml: `
        <p><strong>Astronomical Calculation:</strong></p>
        <p>• Spacecraft mass $= 3 \\times 10^4 = 3 \\times 10,000 = 30,000\\text{ kilograms}$.</p>
        <p>• The power of 10 indicates that 1 is followed by 4 zeros, moving the digit 3 four place-value positions to the left.</p>
      `
    },
    {
      accent: '#0984e3',
      accentBg: 'rgba(9, 132, 227, 0.12)',
      icon: 'fa-solid fa-sun',
      tag: 'Planetary Astronomy',
      title: 'Solar System Distance from Earth to Sun',
      desc: 'The average distance from Earth to the Sun is approximately 93 million miles ($93,000,000\\text{ miles}$). If an interstellar observatory needs to measure 10 times this baseline distance, calculate the total distance using place-value shifts.',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 320 150">
          <circle cx="50" cy="75" r="38" fill="#f1c40f"/>
          <circle cx="50" cy="75" r="44" fill="none" stroke="#f39c12" stroke-width="2" stroke-dasharray="4,3"/>
          <circle cx="260" cy="75" r="14" fill="#0984e3"/>
          <line x1="88" y1="75" x2="246" y2="75" stroke="#74b9ff" stroke-width="2" stroke-dasharray="6,4"/>
          <rect x="105" y="45" width="120" height="45" rx="8" fill="#ffffff" stroke="#0984e3" stroke-width="1.5"/>
          <text x="115" y="64" fill="#2d3436" font-size="10" font-weight="800">93,000,000 × 10</text>
          <text x="115" y="80" fill="#00b894" font-size="11" font-weight="900">= 930,000,000 mi</text>
        </svg>
      `,
      solutionHtml: `
        <p><strong>Place-Value Shift Analysis:</strong></p>
        <p>• $93,000,000 \\times 10 = 930,000,000\\text{ miles}$ (Nine hundred thirty million miles).</p>
        <p>• Multiplying by 10 shifts all digits 1 position to the left on the place-value chart, adding one zero to the end of the whole number.</p>
      `
    },
    {
      accent: '#00b894',
      accentBg: 'rgba(0, 184, 148, 0.12)',
      icon: 'fa-solid fa-rotate-right',
      tag: 'Orbital Mechanics',
      title: 'Venus Orbital Revolution Estimation',
      desc: 'Venus orbits around the Sun in 225 Earth days. About how many days will it take for Venus to complete 16 full revolutions around the Sun? Estimate the total days using rounding.',
      svg: `
        <svg width="100%" height="150" viewBox="0 0 320 150">
          <ellipse cx="160" cy="75" rx="120" ry="50" fill="none" stroke="#dfe6e9" stroke-width="2" stroke-dasharray="6,4"/>
          <circle cx="160" cy="75" r="22" fill="#f1c40f"/>
          <circle cx="280" cy="75" r="11" fill="#e17055"/>
          <text x="210" y="40" fill="#6c5ce7" font-size="11" font-weight="800">225 days × 16 orbits</text>
          <text x="210" y="58" fill="#00b894" font-size="12" font-weight="900">≈ 200 × 20 = 4,000 days</text>
        </svg>
      `,
      solutionHtml: `
        <p><strong>Estimation Calculation:</strong></p>
        <p>• Round $225$ to the nearest hundred: $200$.</p>
        <p>• Round $16$ to the nearest ten: $20$.</p>
        <p>• Multiply estimated factors: $200 \\times 20 = 4,000\\text{ days}$.</p>
      `
    }
  ],

  // 3. Core Foundation Rules
  foundation: {
    rules: [
      {
        num: 'Rule 1',
        title: 'Periods & Place-Value Structure',
        desc: 'Large multidigit numbers are separated into periods (Millions, Thousands, Ones). Each period contains three places: Hundreds, Tens, and Ones.'
      },
      {
        num: 'Rule 2',
        title: 'The 10-Times Principle',
        desc: 'Each place value is 10 times the value of the place to its immediate right, and $\\frac{1}{10}$ of the value of the place to its immediate left.'
      },
      {
        num: 'Rule 3',
        title: 'Powers of 10 & Exponent Rule',
        desc: 'In $10^n$, the base is 10 and the exponent $n$ represents the number of times 10 is multiplied by itself. The value is 1 followed by $n$ zeros ($10^4 = 10,000$).'
      },
      {
        num: 'Rule 4',
        title: 'Estimation Protocols',
        desc: 'To estimate products, round each factor to its greatest place-value, or select compatible numbers close to the original values that multiply easily mentally.'
      }
    ]
  },

  // 4. Special Cases & Mathematical Models
  specialCases: [
    {
      icon: 'fa-solid fa-arrows-split-up-and-left',
      title: 'Moving Left vs Moving Right on Place-Value Chart',
      diagramSvg: `
        <svg width="100%" height="95" viewBox="0 0 360 95">
          <rect x="15" y="15" width="155" height="65" rx="10" fill="#eef9f6" stroke="#00b894" stroke-width="2"/>
          <text x="92" y="38" font-size="12" font-weight="900" fill="#00b894" text-anchor="middle">← Move Left</text>
          <text x="92" y="58" font-size="11" font-weight="800" fill="#2d3436" text-anchor="middle">Multiply by 10 (10× more)</text>
          
          <rect x="190" y="15" width="155" height="65" rx="10" fill="#fff5f5" stroke="#eb4d4b" stroke-width="2"/>
          <text x="267" y="38" font-size="12" font-weight="900" fill="#eb4d4b" text-anchor="middle">Move Right →</text>
          <text x="267" y="58" font-size="11" font-weight="800" fill="#2d3436" text-anchor="middle">Divide by 10 (10× less)</text>
        </svg>
      `,
      items: [
        'Each shift to the left increases a digit\'s value by a factor of 10: $3\\text{ thousands} \\times 10 = 3\\text{ ten thousands}$.',
        'Each shift to the right decreases a digit\'s value by a factor of 10: $3\\text{ thousands} \\div 10 = 3\\text{ hundreds}$.',
        'Multiplying by $100$ shifts digits 2 places to the left; dividing by $1,000$ shifts digits 3 places to the right.'
      ]
    },
    {
      icon: 'fa-solid fa-triangle-exclamation',
      title: 'Exponent Misconceptions (Lamiaa & Jonah Analysis)',
      diagramSvg: `
        <svg width="100%" height="95" viewBox="0 0 360 95">
          <rect x="15" y="15" width="155" height="65" rx="10" fill="#fff0f0" stroke="#d63031" stroke-width="2"/>
          <text x="92" y="38" font-size="12" font-weight="900" fill="#d63031" text-anchor="middle">❌ Common Mistake</text>
          <text x="92" y="58" font-size="11" font-weight="800" fill="#2d3436" text-anchor="middle">10³ ≠ 3 × 10 = 30</text>
          
          <rect x="190" y="15" width="155" height="65" rx="10" fill="#eef9f6" stroke="#00b894" stroke-width="2"/>
          <text x="267" y="38" font-size="12" font-weight="900" fill="#00b894" text-anchor="middle">✔ Correct Principle</text>
          <text x="267" y="58" font-size="11" font-weight="800" fill="#2d3436" text-anchor="middle">10³ = 10 × 10 × 10 = 1,000</text>
        </svg>
      `,
      items: [
        'An exponent indicates repeated multiplication of the base, NOT multiplying the base by the exponent number.',
        'When multiplying whole numbers by $10^n$, append exactly $n$ zeros: $254 \\times 10^4 = 2,540,000$.',
        'Compatible numbers provide quick estimates close to benchmark friendly numbers.'
      ]
    }
  ],

  // 5. Instructional Ideas (25 Total Question Cards with Workspaces)
  ideas: [
    // ========================================================================
    // IDEA 1: Understanding Place Value through Millions
    // ========================================================================
    {
      id: 1,
      badge: '💡',
      flashcardTitle: 'Idea 1: Multi-Digit Place Value through Millions',
      flashcardText: '<strong>Place Value Protocol:</strong> A multi-digit number is organized into periods: Millions, Thousands, and Ones. Each period has Hundreds, Tens, and Ones places. A number can be written in <strong>Standard Form</strong> ($213,560,447$), <strong>Expanded Form</strong> (sum of digit values), or <strong>Word Form</strong>.',
      cards: [
        {
          id: 'pv_ex1_1',
          type: 'solved',
          tag: 'Solved Example 1.1 • Standard, Expanded & Word Forms',
          accent: '#6c5ce7',
          q: 'Represent the multidigit number on a place-value chart and write it in standard, expanded, and word forms:<br><div class="q-sub-item">$$213,560,447$$</div>',
          steps: [
            { num: 'Step 1: Place-Value Chart Analysis', text: 'Millions period: 2 hundreds, 1 ten, 3 ones ($213\\text{ million}$).<br>Thousands period: 5 hundreds, 6 tens, 0 ones ($560\\text{ thousand}$).<br>Ones period: 4 hundreds, 4 tens, 7 ones ($447$).' },
            { num: 'Step 2: Standard Form', text: '$213,560,447$.' },
            { num: 'Step 3: Expanded Form', text: '$200,000,000 + 10,000,000 + 3,000,000 + 500,000 + 60,000 + 400 + 40 + 7$.' },
            { num: 'Step 4: Word Form', text: 'Two hundred thirteen million, five hundred sixty thousand, four hundred forty-seven.' }
          ],
          ans: 'Standard: 213,560,447 &nbsp;|&nbsp; Word Form: Two hundred thirteen million, five hundred sixty thousand, four hundred forty-seven.'
        },
        {
          id: 'pv_ex1_2',
          type: 'solved',
          tag: 'Solved Example 1.2 • Place Value vs Value Analysis',
          accent: '#0984e3',
          q: `Given the number $820,146,375$, determine each of the following:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> The digit in the hundred-thousands place.</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> The place value of the digit 2.</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> The value of the digit 2.</div>
              <div class="q-sub-item"><span class="q-part-pill">(4)</span> The number of hundred millions.</div>`,
          steps: [
            { num: 'Part 1: Hundred-thousands digit', text: 'Look at the thousands period: 1 is in hundred-thousands, 4 in ten-thousands, 6 in thousands. The digit is $1$.' },
            { num: 'Part 2: Place value of digit 2', text: 'In the millions period: 8 hundred millions, 2 ten millions, 0 ones. Place value is <strong>ten millions</strong>.' },
            { num: 'Part 3: Value of digit 2', text: '$2 \\times 10,000,000 = 20,000,000$.' },
            { num: 'Part 4: Number of hundred millions', text: 'The digit in the hundred-millions place is $8$.' }
          ],
          ans: '(1) 1 &nbsp;|&nbsp; (2) Ten millions &nbsp;|&nbsp; (3) 20,000,000 &nbsp;|&nbsp; (4) 8'
        },
        {
          id: 'pv_ex1_3',
          type: 'solved',
          tag: 'Solved Example 1.3 • Word & Expanded Forms with Millions',
          accent: '#e17055',
          q: `Write each multidigit number in word form and expanded form:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $7,564,209$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $39,072,468$</div>`,
          steps: [
            { num: 'Number (a): 7,564,209', text: '<strong>Word Form:</strong> Seven million, five hundred sixty-four thousand, two hundred nine.<br><strong>Expanded Form:</strong> $7,000,000 + 500,000 + 60,000 + 4,000 + 200 + 9$.' },
            { num: 'Number (b): 39,072,468', text: '<strong>Word Form:</strong> Thirty-nine million, seventy-two thousand, four hundred sixty-eight.<br><strong>Expanded Form:</strong> $30,000,000 + 9,000,000 + 70,000 + 2,000 + 400 + 60 + 8$.' }
          ],
          ans: '(a) Seven million, five hundred sixty-four thousand, two hundred nine &nbsp;|&nbsp; (b) Thirty-nine million, seventy-two thousand, four hundred sixty-eight.'
        },
        {
          id: 'pv_try1',
          type: 'try',
          tag: 'Try It Yourself 1.1 • Nine-Digit Place Value',
          accent: '#00b894',
          q: `Write the number in word form and expanded form:
              <div class="q-sub-item">$$562,347,089$$</div>`,
          canvasId: 'can-pv-1',
          wrapId: 'can-wrap-pv-1',
          solId: 'sol-pv-1',
          steps: [
            { num: 'Word Form', text: 'Five hundred sixty-two million, three hundred forty-seven thousand, eighty-nine.' },
            { num: 'Expanded Form', text: '$500,000,000 + 60,000,000 + 2,000,000 + 300,000 + 40,000 + 7,000 + 80 + 9$.' }
          ],
          ans: 'Word: Five hundred sixty-two million, three hundred forty-seven thousand, eighty-nine.'
        },
        {
          id: 'pv_try1_b',
          type: 'try',
          tag: 'Try It Yourself 1.2 • Underlined Digit Values',
          accent: '#fdcb6e',
          q: `Write the value of each underlined digit:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $2,\\underline{4}79,082$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $\\underline{6},790,428$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $\\underline{4}09,265,312$</div>
              <div class="q-sub-item"><span class="q-part-pill">(4)</span> $720,3\\underline{4}5,860$</div>`,
          canvasId: 'can-pv-1b',
          wrapId: 'can-wrap-pv-1b',
          solId: 'sol-pv-1b',
          steps: [
            { num: 'Part 1', text: 'Digit 4 is in the hundred-thousands place $\\implies$ Value is $400,000$.' },
            { num: 'Part 2', text: 'Digit 6 is in the millions place $\\implies$ Value is $6,000,000$.' },
            { num: 'Part 3', text: 'Digit 4 is in the hundred-millions place $\\implies$ Value is $400,000,000$.' },
            { num: 'Part 4', text: 'Digit 4 is in the ten-thousands place $\\implies$ Value is $40,000$.' }
          ],
          ans: '(1) 400,000 &nbsp;|&nbsp; (2) 6,000,000 &nbsp;|&nbsp; (3) 400,000,000 &nbsp;|&nbsp; (4) 40,000'
        }
      ]
    },

    // ========================================================================
    // IDEA 2: Base-10 Place-Value Shifts (Multiplying & Dividing by 10, 100, 1000)
    // ========================================================================
    {
      id: 2,
      badge: '🔄',
      flashcardTitle: 'Idea 2: The 10-Times Principle & Digit Shifts',
      flashcardText: '<strong>Shift Principle:</strong><br>• Moving <strong>left</strong> on the place-value chart: Value increases by $10\\times$ (Multiply by $10$).<br>• Moving <strong>right</strong> on the place-value chart: Value decreases by $10\\times$ (Divide by $10$).<br>• For example: $3\\text{ thousand} \\times 10 = 3\\text{ ten thousands}$, and $3\\text{ thousand} \\div 10 = 3\\text{ hundreds}$.',
      cards: [
        {
          id: 'pv_ex2_1',
          type: 'solved',
          tag: 'Solved Example 2.1 • Digit Shifts with Multi-Digit Numbers',
          accent: '#6c5ce7',
          q: `Explain how the place value of each digit changes and compute the result:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $421,389 \\times 10$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $652,193,000 \\div 10$</div>`,
          steps: [
            { num: 'Part (a): 421,389 × 10', text: 'Multiplying by 10 moves every digit one place to the left on the place-value chart (10 times more).<br>$421,389 \\times 10 = 4,213,890$.' },
            { num: 'Part (b): 652,193,000 ÷ 10', text: 'Dividing by 10 moves every digit one place to the right on the place-value chart (10 times less).<br>$652,193,000 \\div 10 = 65,219,300$.' }
          ],
          ans: '(a) 4,213,890 &nbsp;|&nbsp; (b) 65,219,300'
        },
        {
          id: 'pv_ex2_2',
          type: 'solved',
          tag: 'Solved Example 2.2 • Multiplying & Dividing by 10 and 100',
          accent: '#0984e3',
          q: `Complete each place-value calculation with the number and its product or quotient:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $5,432,719 \\times 10$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $327,500 \\div 100$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $948,374 \\times 100$</div>
              <div class="q-sub-item"><span class="q-part-pill">(4)</span> $7,657,400 \\div 10$</div>`,
          steps: [
            { num: 'Item 1: × 10', text: 'Every digit shifts 1 place to the left: $5,432,719 \\times 10 = 54,327,190$.' },
            { num: 'Item 2: ÷ 100', text: 'Every digit shifts 2 places to the right: $327,500 \\div 100 = 3,275$.' },
            { num: 'Item 3: × 100', text: 'Every digit shifts 2 places to the left: $948,374 \\times 100 = 94,837,400$.' },
            { num: 'Item 4: ÷ 10', text: 'Every digit shifts 1 place to the right: $7,657,400 \\div 10 = 765,740$.' }
          ],
          ans: '(1) 54,327,190 &nbsp;|&nbsp; (2) 3,275 &nbsp;|&nbsp; (3) 94,837,400 &nbsp;|&nbsp; (4) 765,740'
        },
        {
          id: 'pv_ex2_3',
          type: 'solved',
          tag: 'Solved Example 2.3 • Word Unit Operations',
          accent: '#e17055',
          q: `Write each product or quotient in standard numerical form:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $4\\text{ million} \\times 10$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $9\\text{ hundred thousand} \\times 100$</div>
              <div class="q-sub-item"><span class="q-part-pill">(c)</span> $3\\text{ hundred million} \\div 10$</div>
              <div class="q-sub-item"><span class="q-part-pill">(d)</span> $6\\text{ million} \\div 100$</div>`,
          steps: [
            { num: 'Part (a)', text: '$4,000,000 \\times 10 = 40,000,000$ (40 million).' },
            { num: 'Part (b)', text: '$900,000 \\times 100 = 90,000,000$ (90 million).' },
            { num: 'Part (c)', text: '$300,000,000 \\div 10 = 30,000,000$ (30 million).' },
            { num: 'Part (d)', text: '$6,000,000 \\div 100 = 60,000$ (60 thousand).' }
          ],
          ans: '(a) 40,000,000 &nbsp;|&nbsp; (b) 90,000,000 &nbsp;|&nbsp; (c) 30,000,000 &nbsp;|&nbsp; (d) 60,000'
        },
        {
          id: 'pv_try2',
          type: 'try',
          tag: 'Try It Yourself 2.1 • Multiplying & Dividing by 1,000',
          accent: '#00b894',
          q: `Calculate each of the following:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $8\\text{ thousand} \\times 1,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $2\\text{ million} \\div 1,000$</div>`,
          canvasId: 'can-pv-2',
          wrapId: 'can-wrap-pv-2',
          solId: 'sol-pv-2',
          steps: [
            { num: 'Problem 1', text: '$8,000 \\times 1,000 = 8,000,000$ (8 million).' },
            { num: 'Problem 2', text: '$2,000,000 \\div 1,000 = 2,000$ (2 thousand).' }
          ],
          ans: '(1) 8,000,000 &nbsp;|&nbsp; (2) 2,000'
        },
        {
          id: 'pv_try2_b',
          type: 'try',
          tag: 'Try It Yourself 2.2 • Place-Value Chart Completion',
          accent: '#fdcb6e',
          q: `Find the product and quotient for each:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $710,468 \\times 100$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $412,973,000 \\div 100$</div>
              <div class="q-sub-item"><span class="q-part-pill">(c)</span> $806,335,000 \\div 1,000$</div>`,
          canvasId: 'can-pv-2b',
          wrapId: 'can-wrap-pv-2b',
          solId: 'sol-pv-2b',
          steps: [
            { num: 'Calculation (a)', text: 'Shift 2 places left: $710,468 \\times 100 = 71,046,800$.' },
            { num: 'Calculation (b)', text: 'Shift 2 places right: $412,973,000 \\div 100 = 4,129,730$.' },
            { num: 'Calculation (c)', text: 'Shift 3 places right: $806,335,000 \\div 1,000 = 806,335$.' }
          ],
          ans: '(a) 71,046,800 &nbsp;|&nbsp; (b) 4,129,730 &nbsp;|&nbsp; (c) 806,335'
        }
      ]
    },

    // ========================================================================
    // IDEA 3: Powers of 10 & Exponential Notation
    // ========================================================================
    {
      id: 3,
      badge: '🔢',
      flashcardTitle: 'Idea 3: Powers of 10 & Exponential Forms',
      flashcardText: '<strong>Exponential Principle:</strong> In $10^n$, $10$ is the <strong>base</strong> (repeated factor) and $n$ is the <strong>exponent</strong> (number of times the base is repeated).<br>• $10^1 = 10$<br>• $10^2 = 10 \\times 10 = 100$<br>• $10^3 = 10 \\times 10 \\times 10 = 1,000$<br>• The exponent tells you exactly how many zeros follow the 1 in standard form!',
      cards: [
        {
          id: 'pv_ex3_1',
          type: 'solved',
          tag: 'Solved Example 3.1 • Standard, Expanded & Exponential Forms',
          accent: '#6c5ce7',
          q: `Complete the representations in standard, expanded, and exponential forms:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $1,000,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $100,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $10,000$</div>`,
          steps: [
            { num: 'Item 1: 1,000,000', text: 'Expanded Form: $10 \\times 10 \\times 10 \\times 10 \\times 10 \\times 10$.<br>Exponential Form: $10^6$ (ten to the sixth power).' },
            { num: 'Item 2: 100,000', text: 'Expanded Form: $10 \\times 10 \\times 10 \\times 10 \\times 10$.<br>Exponential Form: $10^5$ (ten to the fifth power).' },
            { num: 'Item 3: 10,000', text: 'Expanded Form: $10 \\times 10 \\times 10 \\times 10$.<br>Exponential Form: $10^4$ (ten to the fourth power).' }
          ],
          ans: '1,000,000 = 10⁶ &nbsp;|&nbsp; 100,000 = 10⁵ &nbsp;|&nbsp; 10,000 = 10⁴'
        },
        {
          id: 'pv_ex3_2',
          type: 'solved',
          tag: 'Solved Example 3.2 • Writing in Exponential Form',
          accent: '#0984e3',
          q: `Write each number in exponential form:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $10$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $1,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(c)</span> $10,000,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(d)</span> $100,000 \\times 10$</div>`,
          steps: [
            { num: 'Part (a)', text: '$10 = 10^1$ (1 zero).' },
            { num: 'Part (b)', text: '$1,000 = 10^3$ (3 zeros).' },
            { num: 'Part (c)', text: '$10,000,000 = 10^7$ (7 zeros).' },
            { num: 'Part (d)', text: '$100,000 \\times 10 = 1,000,000 = 10^6$ (6 zeros).' }
          ],
          ans: '(a) 10¹ &nbsp;|&nbsp; (b) 10³ &nbsp;|&nbsp; (c) 10⁷ &nbsp;|&nbsp; (d) 10⁶'
        },
        {
          id: 'pv_ex3_3',
          type: 'solved',
          tag: 'Solved Example 3.3 • Converting to Standard Form',
          accent: '#e17055',
          q: `Write each expression in standard whole-number form:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $5 \\times 10^2$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $64 \\times 10^4$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $7 \\times 10^8$</div>
              <div class="q-sub-item"><span class="q-part-pill">(4)</span> $98 \\times 10^3$</div>`,
          steps: [
            { num: '1: 5 × 10²', text: '$10^2 = 100 \\implies 5 \\times 100 = 500$.' },
            { num: '2: 64 × 10⁴', text: '$10^4 = 10,000 \\implies 64 \\times 10,000 = 640,000$.' },
            { num: '3: 7 × 10⁸', text: '$10^8 = 100,000,000 \\implies 7 \\times 100,000,000 = 700,000,000$.' },
            { num: '4: 98 × 10³', text: '$10^3 = 1,000 \\implies 98 \\times 1,000 = 98,000$.' }
          ],
          ans: '(1) 500 &nbsp;|&nbsp; (2) 640,000 &nbsp;|&nbsp; (3) 700,000,000 &nbsp;|&nbsp; (4) 98,000'
        },
        {
          id: 'pv_try3',
          type: 'try',
          tag: 'Try It Yourself 3.1 • Repeated Multiplication to Value',
          accent: '#00b894',
          q: `Write as repeated multiplication, then write the standard value:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $10^2$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $10^5$</div>
              <div class="q-sub-item"><span class="q-part-pill">(c)</span> $10^6$</div>`,
          canvasId: 'can-pv-3',
          wrapId: 'can-wrap-pv-3',
          solId: 'sol-pv-3',
          steps: [
            { num: 'Part (a)', text: '$10^2 = 10 \\times 10 = 100$.' },
            { num: 'Part (b)', text: '$10^5 = 10 \\times 10 \\times 10 \\times 10 \\times 10 = 100,000$.' },
            { num: 'Part (c)', text: '$10^6 = 10 \\times 10 \\times 10 \\times 10 \\times 10 \\times 10 = 1,000,000$.' }
          ],
          ans: '(a) 100 &nbsp;|&nbsp; (b) 100,000 &nbsp;|&nbsp; (c) 1,000,000'
        },
        {
          id: 'pv_try3_b',
          type: 'try',
          tag: 'Try It Yourself 3.2 • Matching Equivalent Values',
          accent: '#fdcb6e',
          q: `Find the equivalent value for each expression:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $1,257 \\times 10^2$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $89 \\times 10^4$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $\\text{one hundred} \\times 10^6$</div>`,
          canvasId: 'can-pv-3b',
          wrapId: 'can-wrap-pv-3b',
          solId: 'sol-pv-3b',
          steps: [
            { num: 'Item 1', text: '$1,257 \\times 100 = 125,700$.' },
            { num: 'Item 2', text: '$89 \\times 10,000 = 890,000$.' },
            { num: 'Item 3', text: '$100 \\times 1,000,000 = 100,000,000$ (1 hundred million).' }
          ],
          ans: '(1) 125,700 &nbsp;|&nbsp; (2) 890,000 &nbsp;|&nbsp; (3) 100,000,000 (1 hundred million)'
        }
      ]
    },

    // ========================================================================
    // IDEA 4: Multiplying Multi-Digit Numbers by Powers of 10 & Error Analysis
    // ========================================================================
    {
      id: 4,
      badge: '⚡',
      flashcardTitle: 'Idea 4: Multi-Digit Multiplication Patterns & Error Analysis',
      flashcardText: '<strong>Pattern Principle:</strong> When multiplying any whole number by $10^n$, the number of zeros in the product increases by $n$, shifting each digit $n$ places to the left.<br>• $7,451 \\times 10^1 = 74,510$<br>• $7,451 \\times 10^2 = 745,100$<br>• $7,451 \\times 10^3 = 7,451,000$<br>• <strong>Caution:</strong> Never multiply the base by the exponent ($10^3 \\ne 30$).',
      cards: [
        {
          id: 'pv_ex4_1',
          type: 'solved',
          tag: 'Solved Example 4.1 • Place-Value Shift with Powers of 10',
          accent: '#6c5ce7',
          q: `Explain the pattern and calculate:
              <div class="q-sub-item">$$254 \\times 10^4$$</div>
              Describe how each digit moves on the place-value chart.`,
          steps: [
            { num: 'Step 1: Evaluate the power of 10', text: '$10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$.' },
            { num: 'Step 2: Multiply by 254', text: '$254 \\times 10,000 = 2,540,000$.' },
            { num: 'Step 3: Place-Value Chart Pattern', text: 'Each digit moves 4 places to the left because we are multiplying the number by 10 four times.' }
          ],
          ans: '254 × 10⁴ = 2,540,000 (Every digit moves 4 places to the left).'
        },
        {
          id: 'pv_ex4_2',
          type: 'solved',
          tag: 'Solved Example 4.2 • Exponent Multiplication Patterns',
          accent: '#0984e3',
          q: `Find each product. Then explain the pattern:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $7,451 \\times 10$, &nbsp; $7,451 \\times 100$, &nbsp; $7,451 \\times 1,000$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $382 \\times 10^3$, &nbsp; $382 \\times 10^4$, &nbsp; $382 \\times 10^5$</div>`,
          steps: [
            { num: 'Set (a) Products', text: '$7,451 \\times 10 = 74,510$<br>$7,451 \\times 100 = 745,100$<br>$7,451 \\times 1,000 = 7,451,000$.<br><strong>Pattern:</strong> The number of zeros in the multiplier determines the number of zeros appended.' },
            { num: 'Set (b) Products', text: '$382 \\times 10^3 = 382,000$<br>$382 \\times 10^4 = 3,820,000$<br>$382 \\times 10^5 = 38,200,000$.<br><strong>Pattern:</strong> The exponent $n$ indicates the number of zeros added to 382.' }
          ],
          ans: '(a) 74,510; 745,100; 7,451,000 &nbsp;|&nbsp; (b) 382,000; 3,820,000; 38,200,000'
        },
        {
          id: 'pv_ex4_3',
          type: 'solved',
          tag: 'Solved Example 4.3 • Conceptual Proof: Jonah\'s Solution',
          accent: '#e17055',
          q: 'Jonah solves $674 \\times 10^4 = 6,740,000$. Does his answer make sense? Explain your mathematical reasoning.',
          steps: [
            { num: 'Step 1: Evaluate 10⁴', text: '$10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$.' },
            { num: 'Step 2: Multiply 674 by 10,000', text: '$674 \\times 10,000 = 6,740,000$.' },
            { num: 'Step 3: Conclusion', text: 'Yes, his answer makes complete sense. Multiplying by $10^4$ shifts the digits 4 places to the left, resulting in 4 zeros appended.' }
          ],
          ans: 'Yes, Jonah\'s answer makes sense: 674 × 10,000 = 6,740,000.'
        },
        {
          id: 'pv_try4',
          type: 'try',
          tag: 'Try It Yourself 4.1 • Critical Misconception: Lamiaa\'s Error',
          accent: '#00b894',
          q: 'Lamiaa wrote $10^3 = 3 \\times 10 = 30$. Is Lamiaa correct? If not, correct her answer and explain the fundamental error.',
          canvasId: 'can-pv-4',
          wrapId: 'can-wrap-pv-4',
          solId: 'sol-pv-4',
          steps: [
            { num: 'Evaluation', text: 'Lamiaa is <strong>incorrect</strong>.' },
            { num: 'Mathematical Reason', text: 'An exponent does not mean multiplying the base by the exponent. It means repeated multiplication of the base: $10^3 = 10 \\times 10 \\times 10 = 1,000$.' },
            { num: 'Correct Value', text: '$10^3 = 1,000$, not $30$.' }
          ],
          ans: 'Lamiaa is NOT correct. Correct answer: 10³ = 10 × 10 × 10 = 1,000.'
        },
        {
          id: 'pv_try4_b',
          type: 'try',
          tag: 'Try It Yourself 4.2 • Pattern Investigation: Zoey\'s Rule',
          accent: '#fdcb6e',
          q: 'Zoey says there is a clear pattern when comparing "$52 \\times 10^2$" and "$52 \\times 10^3$". Explain what she means mathematically.',
          canvasId: 'can-pv-4b',
          wrapId: 'can-wrap-pv-4b',
          solId: 'sol-pv-4b',
          steps: [
            { num: 'Calculate First Expression', text: '$52 \\times 10^2 = 52 \\times 100 = 5,200$ (2 zeros).' },
            { num: 'Calculate Second Expression', text: '$52 \\times 10^3 = 52 \\times 1,000 = 52,000$ (3 zeros).' },
            { num: 'Pattern Explanation', text: 'Each increase of 1 in the exponent multiplies the product by an additional factor of 10, moving digits 1 additional place to the left.' }
          ],
          ans: '52 × 10² = 5,200 (2 zeros) and 52 × 10³ = 52,000 (3 zeros). The exponent matches the number of zeros appended.'
        }
      ]
    },

    // ========================================================================
    // IDEA 5: Estimating Products using Rounding & Compatible Numbers
    // ========================================================================
    {
      id: 5,
      badge: '🎯',
      flashcardTitle: 'Idea 5: Product Estimation Protocols (Rounding vs Compatible Numbers)',
      flashcardText: '<strong>Estimation Protocol:</strong><br>• <strong>Strategy 1 (Rounding):</strong> Round both factors to their greatest place value (e.g. $85 \\times 41 \\to 90 \\times 40 = 3,600$).<br>• <strong>Strategy 2 (Compatible Numbers):</strong> Replace factors with friendly numbers close in value that multiply easily (e.g. $583 \\times 12 \\to 700 \\times 10 = 7,000$).',
      cards: [
        {
          id: 'pv_ex5_1',
          type: 'solved',
          tag: 'Solved Example 5.1 • Aviation Distance: Compatible Numbers',
          accent: '#6c5ce7',
          q: `An airplane can fly $583\\text{ kilometers}$ per hour. About how many kilometers can it fly in $12\\text{ hours}$?
              <div class="q-sub-item">Estimate the product using compatible numbers.</div>`,
          steps: [
            { num: 'Step 1: Choose compatible numbers', text: '$583$ is close to $600$ (or $700$). $12$ is close to $10$.' },
            { num: 'Step 2: Multiply estimated values', text: '$700 \\times 10 = 7,000\\text{ kilometers}$ (or $600 \\times 10 = 6,000\\text{ km}$).' },
            { num: 'Step 3: Conclusion', text: 'So, it can fly about $7,000\\text{ kilometers}$ in 12 hours.' }
          ],
          ans: 'About 7,000 kilometers.'
        },
        {
          id: 'pv_ex5_2',
          type: 'solved',
          tag: 'Solved Example 5.2 • Furniture Cost: Rounding Factors',
          accent: '#0984e3',
          q: `The cost of a table is $\\$85$. Estimate the cost of $41$ tables.
              <div class="q-sub-item">Estimate the product using rounding.</div>`,
          steps: [
            { num: 'Step 1: Round both factors', text: '$85$ rounds to $90$. $41$ rounds to $40$.' },
            { num: 'Step 2: Multiply rounded factors', text: 'Mental math: $9 \\times 4 = 36 \\implies 90 \\times 40 = 3,600$.' },
            { num: 'Step 3: Conclusion', text: 'The estimated cost of the 41 tables is about $\\$3,600$.' }
          ],
          ans: 'About $3,600.'
        },
        {
          id: 'pv_ex5_3',
          type: 'solved',
          tag: 'Solved Example 5.3 • Estimation by Rounding to Greatest Place',
          accent: '#e17055',
          q: `Round the factors to estimate each product:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $69 \\times 63$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $604 \\times 12$</div>
              <div class="q-sub-item"><span class="q-part-pill">(3)</span> $97\\text{ hundreds} \\times 5\\text{ tens}$</div>`,
          steps: [
            { num: 'Problem 1: 69 × 63', text: 'Round $69 \\to 70$, and $63 \\to 60$. Product: $70 \\times 60 = 4,200$.' },
            { num: 'Problem 2: 604 × 12', text: 'Round $604 \\to 600$, and $12 \\to 10$. Product: $600 \\times 10 = 6,000$.' },
            { num: 'Problem 3: 97 hundreds × 5 tens', text: '$97\\text{ hundreds} = 9,700 \\to 10,000$. $5\\text{ tens} = 50$. Product: $10,000 \\times 50 = 500,000$. (Or $9,700 \\times 50 = 485,000$).' }
          ],
          ans: '(1) 4,200 &nbsp;|&nbsp; (2) 6,000 &nbsp;|&nbsp; (3) 500,000 (or 485,000)'
        },
        {
          id: 'pv_try5',
          type: 'try',
          tag: 'Try It Yourself 5.1 • Compatible Numbers Estimation',
          accent: '#00b894',
          q: `Use compatible numbers to estimate each product:
              <div class="q-sub-item"><span class="q-part-pill">(a)</span> $6,524 \\times 24$</div>
              <div class="q-sub-item"><span class="q-part-pill">(b)</span> $42,609 \\times 48$</div>`,
          canvasId: 'can-pv-5',
          wrapId: 'can-wrap-pv-5',
          solId: 'sol-pv-5',
          steps: [
            { num: 'Estimate (a)', text: '$6,524 \\to 6,000$ (or $6,500$), and $24 \\to 20$.<br>$6,000 \\times 20 = 120,000$ (or $6,500 \\times 20 = 130,000$).' },
            { num: 'Estimate (b)', text: '$42,609 \\to 40,000$, and $48 \\to 50$.<br>$40,000 \\times 50 = 2,000,000$.' }
          ],
          ans: '(a) ≈ 120,000 (or 130,000) &nbsp;|&nbsp; (b) ≈ 2,000,000'
        },
        {
          id: 'pv_try5_b',
          type: 'try',
          tag: 'Try It Yourself 5.2 • Multi-Digit Compatible Estimation',
          accent: '#fdcb6e',
          q: `Estimate each product using compatible numbers:
              <div class="q-sub-item"><span class="q-part-pill">(1)</span> $9,358 \\times 69$</div>
              <div class="q-sub-item"><span class="q-part-pill">(2)</span> $8,241 \\times 92$</div>`,
          canvasId: 'can-pv-5b',
          wrapId: 'can-wrap-pv-5b',
          solId: 'sol-pv-5b',
          steps: [
            { num: 'Problem 1', text: 'Choose friendly numbers: $9,358 \\to 9,000$, and $69 \\to 70$ (or $60$).<br>$9,000 \\times 70 = 630,000$ (or $9,000 \\times 60 = 540,000$).' },
            { num: 'Problem 2', text: 'Choose friendly numbers: $8,241 \\to 8,000$, and $92 \\to 90$.<br>$8,000 \\times 90 = 720,000$.' }
          ],
          ans: '(1) ≈ 630,000 (or 540,000) &nbsp;|&nbsp; (2) ≈ 720,000'
        }
      ]
    }
  ],

  // 10 Comprehensive Exam MCQs
  mcqs: [
    {
      id: 1,
      q: 'Which expression represents $10 \\times 10 \\times 10 \\times 10$ in exponential form?',
      options: ['10 × 4', '10⁴', '4¹⁰', '40'],
      correct: 1,
      proof: '10 is multiplied by itself 4 times. In exponential notation, the base is 10 and the exponent is 4, which is written as $10^4$.'
    },
    {
      id: 2,
      q: 'What is the place value of the digit 6 in $562,347,089$?',
      options: ['Millions', 'Ten millions', 'Hundred thousands', 'Hundred millions'],
      correct: 1,
      proof: 'In $562,347,089$, the digit 2 is in millions, 6 is in ten millions, and 5 is in hundred millions.'
    },
    {
      id: 3,
      q: 'What is the product of $254 \\times 10^4$?',
      options: ['25,400', '254,000', '2,540,000', '25,400,000'],
      correct: 2,
      proof: '$10^4 = 10,000$. Then $254 \\times 10,000 = 2,540,000$ (digits shift 4 places left, appending 4 zeros).'
    },
    {
      id: 4,
      q: 'When dividing $412,973,000 \\div 100$, what is the quotient?',
      options: ['4,129,730', '41,297,300', '412,973', '41,297'],
      correct: 0,
      proof: 'Dividing by 100 moves every digit two places to the right on the place-value chart, removing two trailing zeros: $4,129,730$.'
    },
    {
      id: 5,
      q: 'Which of the following is equivalent to $\\text{one hundred} \\times 10^6$?',
      options: ['1 million', '10 million', '100 million', '1 billion'],
      correct: 2,
      proof: 'One hundred $= 100 = 10^2$. $10^2 \\times 10^6 = 10^8 = 100,000,000 = 1\\text{ hundred million}$.'
    },
    {
      id: 6,
      q: 'What is the value of the underlined digit in $37,628,40\\underline{9}$?',
      options: ['90', '900', '9', '9,000'],
      correct: 2,
      proof: 'The underlined digit 9 is in the ones place, so its value is $9$.'
    },
    {
      id: 7,
      q: 'Lamiaa claims that $10^3 = 30$. What is the correct value of $10^3$?',
      options: ['30', '300', '1,000', '10,000'],
      correct: 2,
      proof: '$10^3$ means $10 \\times 10 \\times 10 = 1,000$. An exponent represents repeated multiplication, not multiplying base by exponent.'
    },
    {
      id: 8,
      q: 'An airplane flies at $583\\text{ km/h}$. Estimate the total distance in $12\\text{ hours}$ using compatible numbers:',
      options: ['About 5,000 km', 'About 7,000 km', 'About 12,000 km', 'About 15,000 km'],
      correct: 1,
      proof: 'Using compatible numbers: $583 \\to 700$ (or $600$) and $12 \\to 10$. $700 \\times 10 = 7,000\\text{ kilometers}$.'
    },
    {
      id: 9,
      q: 'What is the estimated product of $85 \\times 41$ by rounding both factors to the nearest ten?',
      options: ['3,200', '3,400', '3,600', '4,000'],
      correct: 2,
      proof: '85 rounds to 90; 41 rounds to 40. Then $90 \\times 40 = 3,600$.'
    },
    {
      id: 10,
      q: 'What is $100,000 \\times 10$ expressed in exponential form?',
      options: ['10⁴', '10⁵', '10⁶', '10⁷'],
      correct: 2,
      proof: '$100,000 = 10^5$. Multiplying by $10$ gives $1,000,000 = 10^6$ (1 followed by 6 zeros).'
    }
  ],

  // 3 Timed Quiz Models (10 Marks Each)
  quizModels: [
    {
      modelId: 1,
      title: 'Assessment Model A: Standard Forms, Powers of 10 & Exponents',
      questions: [
        {
          id: 'q_m1_1',
          text: 'Write the number $39,072,468$ in word form.',
          points: 2,
          rubric: 'Full marks for writing: Thirty-nine million, seventy-two thousand, four hundred sixty-eight.'
        },
        {
          id: 'q_m1_2',
          text: 'Write the value of the underlined digit in $\\underline{4}09,265,312$.',
          points: 2,
          rubric: '400,000,000 (Four hundred million).'
        },
        {
          id: 'q_m1_3',
          text: 'Find the product: $5,432,719 \\times 10$.',
          points: 2,
          rubric: '54,327,190.'
        },
        {
          id: 'q_m1_4',
          text: 'Express $10,000,000$ in exponential form with base 10.',
          points: 2,
          rubric: '10⁷ (ten to the seventh power).'
        },
        {
          id: 'q_m1_5',
          text: 'Calculate the standard form of $64 \\times 10^4$.',
          points: 2,
          rubric: '640,000.'
        }
      ]
    },
    {
      modelId: 2,
      title: 'Assessment Model B: Base-10 Shifts & Product Patterns',
      questions: [
        {
          id: 'q_m2_1',
          text: 'Compute the quotient: $7,657,400 \\div 10$.',
          points: 2,
          rubric: '765,740.'
        },
        {
          id: 'q_m2_2',
          text: 'Write $9\\text{ hundred thousand} \\times 100$ in standard form.',
          points: 2,
          rubric: '90,000,000 (90 million).'
        },
        {
          id: 'q_m2_3',
          text: 'Evaluate: $382 \\times 10^4$.',
          points: 2,
          rubric: '3,820,000.'
        },
        {
          id: 'q_m2_4',
          text: 'Jonah wrote $674 \\times 10^4 = 6,740,000$. Is his answer correct? Explain why.',
          points: 2,
          rubric: 'Yes, because 10⁴ = 10,000 and 674 × 10,000 = 6,740,000.'
        },
        {
          id: 'q_m2_5',
          text: 'Estimate the product of $69 \\times 63$ using rounding.',
          points: 2,
          rubric: 'Round to 70 × 60 = 4,200.'
        }
      ]
    },
    {
      modelId: 3,
      title: 'Assessment Model C: Error Analysis & Product Estimation',
      questions: [
        {
          id: 'q_m3_1',
          text: 'Write the number $7,564,209$ in expanded form.',
          points: 2,
          rubric: '7,000,000 + 500,000 + 60,000 + 4,000 + 200 + 9.'
        },
        {
          id: 'q_m3_2',
          text: 'Find the quotient: $806,335,000 \\div 1,000$.',
          points: 2,
          rubric: '806,335.'
        },
        {
          id: 'q_m3_3',
          text: 'Correct Lamiaa\'s error: Explain why $10^3 \\ne 30$ and state the correct value.',
          points: 2,
          rubric: 'An exponent means repeated multiplication: 10 × 10 × 10 = 1,000.'
        },
        {
          id: 'q_m3_4',
          text: 'Estimate the total cost of 41 tables if each table costs $\\$85$.',
          points: 2,
          rubric: 'Round to 90 × 40 = $3,600.'
        },
        {
          id: 'q_m3_5',
          text: 'Use compatible numbers to estimate the product: $9,358 \\times 69$.',
          points: 2,
          rubric: '9,000 × 70 = 630,000 (or 9,000 × 60 = 540,000).'
        }
      ]
    }
  ],

  // 6. Dynamic Alternative Question Pools (Strictly from Uploaded 11 Pages)
  questionPools: {
    1: [
      {
        tag: 'Alternative Practice 1.A • Comparing Digit Values in Multi-Digit Numbers',
        q: `Rialto, California had a population of $99,171$.
            <div class="q-sub-item">
              How do the values of the two $9$s in the ten-thousands place and thousands place compare?
            </div>`,
        steps: [
          { num: 'Step 1: Identify Digit Values', text: 'The $9$ in the ten-thousands place has a value of $90,000$. The $9$ in the thousands place has a value of $9,000$.' },
          { num: 'Step 2: Compare Values', text: 'Since $90,000 = 10 \\times 9,000$, the $9$ in the ten-thousands place is $10$ times the value of the $9$ in the thousands place.' }
        ],
        ans: 'The $9$ in ten-thousands is $10$ times the value of the $9$ in thousands ($90,000 = 10 \\times 9,000$).'
      },
      {
        tag: 'Alternative Practice 1.B • Converting Expanded Form to Standard and Word Form',
        q: `Write the given number in standard form and word form:
            <div class="q-sub-item">
              $$700,000 + 40,000 + 3,000 + 200 + 80 + 9$$
            </div>`,
        steps: [
          { num: 'Step 1: Standard Form', text: 'Align by place value: $7$ hundred-thousands, $4$ ten-thousands, $3$ thousands, $2$ hundreds, $8$ tens, $9$ ones $= 743,289$.' },
          { num: 'Step 2: Word Form', text: 'Read period by period: "Seven hundred forty-three thousand, two hundred eighty-nine".' }
        ],
        ans: 'Standard: $743,289$ &nbsp;|&nbsp; Word: Seven hundred forty-three thousand, two hundred eighty-nine'
      },
      {
        tag: 'Alternative Practice 1.C • Expanded Form with Seven-Digit Numbers',
        q: `Write $5,248,319$ in expanded form:
            <div class="q-sub-item">
              Show the sum of the values of all digits in their respective places.
            </div>`,
        steps: [
          { num: 'Step 1: Decompose by Place Values', text: '$5$ millions $= 5,000,000$; $2$ hundred-thousands $= 200,000$; $4$ ten-thousands $= 40,000$; $8$ thousands $= 8,000$; $3$ hundreds $= 300$; $1$ ten $= 10$; $9$ ones $= 9$.' },
          { num: 'Step 2: Combine in Sum', text: '$5,000,000 + 200,000 + 40,000 + 8,000 + 300 + 10 + 9$.' }
        ],
        ans: '$5,000,000 + 200,000 + 40,000 + 8,000 + 300 + 10 + 9$'
      }
    ],
    2: [
      {
        tag: 'Alternative Practice 2.A • Word-Unit Place Value Equivalence',
        q: `Complete the place value equivalence:
            <div class="q-sub-item">
              <span class="q-part-pill">(a)</span> $60\\text{ thousands} = \\dots\\text{ hundreds}$
            </div>
            <div class="q-sub-item">
              <span class="q-part-pill">(b)</span> $300\\text{ tens} = \\dots\\text{ thousands}$
            </div>`,
        steps: [
          { num: 'Step 1: Convert (a)', text: '$60\\text{ thousands} = 60 \\times 1,000 = 60,000$. Divide by $100$: $60,000 \\div 100 = 600\\text{ hundreds}$.' },
          { num: 'Step 2: Convert (b)', text: '$300\\text{ tens} = 300 \\times 10 = 3,000$. Divide by $1,000$: $3,000 \\div 1,000 = 3\\text{ thousands}$.' }
        ],
        ans: '(a) $600\\text{ hundreds}$ &nbsp;|&nbsp; (b) $3\\text{ thousands}$'
      },
      {
        tag: 'Alternative Practice 2.B • Space Distance Multiplied by 10',
        q: `The distance from Earth to the Sun is approximately $93,000,000$ miles.
            <div class="q-sub-item">
              A space mission travels $10$ times this distance into the outer solar system. What is the total distance traveled?
            </div>`,
        steps: [
          { num: 'Step 1: Multiply by 10', text: '$93,000,000 \\times 10$. Each digit shifts one place to the left, increasing in value by a factor of 10.' },
          { num: 'Step 2: Compute Product', text: '$93 \\times 10 = 930$, so $93,000,000 \\times 10 = 930,000,000\\text{ miles}$.' }
        ],
        ans: '$930,000,000\\text{ miles}$ (Nine hundred thirty million miles)'
      },
      {
        tag: 'Alternative Practice 2.C • Division by 10 & Rightward Shifts',
        q: `Find the quotient and describe the digit shift:
            <div class="q-sub-item">
              $$4,500,000 \\div 10$$
            </div>`,
        steps: [
          { num: 'Step 1: Shift Principle', text: 'Dividing by $10$ shifts every digit one place to the right, reducing each digit\'s value to $\\frac{1}{10}$ of its original value.' },
          { num: 'Step 2: Calculate', text: '$4,500,000 \\div 10 = 450,000$.' }
        ],
        ans: '$450,000$ (Digits shift 1 place right, decreasing by a factor of 10)'
      }
    ],
    3: [
      {
        tag: 'Alternative Practice 3.A • Repeated Factors to Exponential Form',
        q: `Write each expression in exponential form and find its value:
            <div class="q-sub-item">
              <span class="q-part-pill">(a)</span> $10 \\times 10 \\times 10 \\times 10 \\times 10$
            </div>
            <div class="q-sub-item">
              <span class="q-part-pill">(b)</span> $10 \\times 10 \\times 10$
            </div>`,
        steps: [
          { num: 'Step 1: Part (a)', text: 'The base is $10$. It is multiplied by itself $5$ times. Form: $10^5 = 100,000$.' },
          { num: 'Step 2: Part (b)', text: 'The base is $10$. It is multiplied by itself $3$ times. Form: $10^3 = 1,000$.' }
        ],
        ans: '(a) $10^5 = 100,000$ &nbsp;|&nbsp; (b) $10^3 = 1,000$'
      },
      {
        tag: 'Alternative Practice 3.B • Error Analysis in Exponents',
        q: `Zoey wrote: "$10^4 = 40$".
            <div class="q-sub-item">
              Explain Zoey\'s mistake and write the correct standard form.
            </div>`,
        steps: [
          { num: 'Step 1: Identify the Error', text: 'Zoey multiplied the base by the exponent ($10 \\times 4 = 40$). An exponent does not mean multiplication by the exponent; it indicates repeated multiplication of the base.' },
          { num: 'Step 2: Find Correct Value', text: '$10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$.' }
        ],
        ans: 'Zoey multiplied base by exponent ($10 \\times 4 = 40$). The correct value is $10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$.'
      },
      {
        tag: 'Alternative Practice 3.C • Spacecraft Scientific Mass',
        q: `A satellite has a mass of $4 \\times 10^4\\text{ kg}$.
            <div class="q-sub-item">
              Write this mass in standard form and word form.
            </div>`,
        steps: [
          { num: 'Step 1: Evaluate Power of 10', text: '$10^4 = 10,000$.' },
          { num: 'Step 2: Multiply by Factor', text: '$4 \\times 10,000 = 40,000\\text{ kg}$.' }
        ],
        ans: 'Standard form: $40,000\\text{ kg}$ &nbsp;|&nbsp; Word form: Forty thousand kilograms'
      }
    ],
    4: [
      {
        tag: 'Alternative Practice 4.A • Multi-Digit Multiplication with Powers of 10',
        q: `Find the product for each expression:
            <div class="q-sub-item">
              <span class="q-part-pill">(a)</span> $34 \\times 10^2$
            </div>
            <div class="q-sub-item">
              <span class="q-part-pill">(b)</span> $18 \\times 10^4$
            </div>`,
        steps: [
          { num: 'Step 1: Part (a)', text: '$10^2 = 100$. Multiply $34 \\times 100 = 3,400$. (Append 2 zeros).' },
          { num: 'Step 2: Part (b)', text: '$10^4 = 10,000$. Multiply $18 \\times 10,000 = 180,000$. (Append 4 zeros).' }
        ],
        ans: '(a) $3,400$ &nbsp;|&nbsp; (b) $180,000$'
      },
      {
        tag: 'Alternative Practice 4.B • Missing Exponent Discovery',
        q: `Find the missing exponent $n$ to make the statement true:
            <div class="q-sub-item">
              $$6 \\times 10^n = 600,000$$
            </div>`,
        steps: [
          { num: 'Step 1: Count Zeros', text: 'In $600,000$, there are $5$ zeros following the non-zero digit $6$.' },
          { num: 'Step 2: Connect to Power of 10', text: '$600,000 = 6 \\times 100,000 = 6 \\times 10^5$. Therefore, $n = 5$.' }
        ],
        ans: '$n = 5$ (Since $6 \\times 10^5 = 600,000$)'
      },
      {
        tag: 'Alternative Practice 4.C • Comparing Numbers in Exponential Form',
        q: `Compare using $>$, $<$, or $=$:
            <div class="q-sub-item">
              $$52 \\times 10^3 \\quad \\bigcirc \\quad 5 \\times 10^4$$
            </div>`,
        steps: [
          { num: 'Step 1: Evaluate Left Side', text: '$52 \\times 10^3 = 52 \\times 1,000 = 52,000$.' },
          { num: 'Step 2: Evaluate Right Side', text: '$5 \\times 10^4 = 5 \\times 10,000 = 50,000$.' },
          { num: 'Step 3: Compare', text: 'Since $52,000 > 50,000$, $52 \\times 10^3 > 5 \\times 10^4$.' }
        ],
        ans: '$52 \\times 10^3 > 5 \\times 10^4$'
      }
    ],
    5: [
      {
        tag: 'Alternative Practice 5.A • Airplane Travel Distance Estimation',
        q: `An airplane flies at an average speed of $482$ miles per hour.
            <div class="q-sub-item">
              Estimate how far it travels in $19$ hours using rounding to the highest place value.
            </div>`,
        steps: [
          { num: 'Step 1: Round Factors', text: 'Round $482$ to nearest hundred: $500$. Round $19$ to nearest ten: $20$.' },
          { num: 'Step 2: Multiply Rounded Factors', text: '$500 \\times 20 = 10,000\\text{ miles}$.' }
        ],
        ans: 'Estimated distance: $10,000\\text{ miles}$ ($500 \\times 20 = 10,000$)'
      },
      {
        tag: 'Alternative Practice 5.B • Cafeteria Table Cost Estimation',
        q: `A school purchases $28$ cafeteria tables. Each table costs $\\$315$.
            <div class="q-sub-item">
              Estimate the total cost using compatible numbers.
            </div>`,
        steps: [
          { num: 'Step 1: Choose Compatible Numbers', text: 'Choose friendly numbers close to the actual values: $315 \\to 300$, and $28 \\to 30$.' },
          { num: 'Step 2: Compute Product', text: '$300 \\times 30 = \\$9,000$.' }
        ],
        ans: 'Estimated cost: $\\$9,000$ ($300 \\times 30 = 9,000$)'
      },
      {
        tag: 'Alternative Practice 5.C • Planetary Orbit Estimation',
        q: `Venus takes $225$ Earth days to complete one orbit around the Sun.
            <div class="q-sub-item">
              Estimate how many Earth days it takes Venus to complete $16$ full orbits using compatible numbers or rounding.
            </div>`,
        steps: [
          { num: 'Step 1: Method 1 (Rounding)', text: 'Round $225$ to $200$, and $16$ to $20$: $200 \\times 20 = 4,000\\text{ days}$.' },
          { num: 'Step 2: Method 2 (Compatible)', text: 'Notice $225 \\approx 250$ and $16$ is a multiple of $4$: $250 \\times 16 = 4,000\\text{ days}$.' }
        ],
        ans: 'Estimated time: $4,000\\text{ Earth days}$'
      }
    ]
  },

  // 4. MCQ Revision Bank (10 Curriculum Questions with Proofs)
  mcqs: [
    {
      id: 1,
      q: 'In the number $213,560,447$, what is the place value of the digit 1?',
      options: ['Hundred thousands', 'Millions', 'Ten millions', 'Hundred millions'],
      correct: 2,
      proof: 'In the millions period (213), 2 is hundred millions, 1 is ten millions, and 3 is millions. Thus, the place value is ten millions.'
    },
    {
      id: 2,
      q: 'Which of the following represents the number $7,564,209$ in expanded form?',
      options: [
        '$7,000,000 + 50,000 + 6,000 + 400 + 20 + 9$',
        '$7,000,000 + 500,000 + 60,000 + 4,000 + 200 + 9$',
        '$70,000,000 + 500,000 + 6,000 + 200 + 9$',
        '$7,000,000 + 564,000 + 209$'
      ],
      correct: 1,
      proof: 'Decomposing each digit by its positional place value: $7 \\times 1,000,000 + 5 \\times 100,000 + 6 \\times 10,000 + 4 \\times 1,000 + 2 \\times 100 + 9 = 7,000,000 + 500,000 + 60,000 + 4,000 + 200 + 9$.'
    },
    {
      id: 3,
      q: 'In the number $65,520$, the 5 in the thousands place is how many times the value of the 5 in the hundreds place?',
      options: ['1 time', '10 times', '100 times', '1,000 times'],
      correct: 1,
      proof: 'The 5 in the thousands place equals $5,000$. The 5 in the hundreds place equals $500$. Since $5,000 \\div 500 = 10$, it is $10$ times greater.'
    },
    {
      id: 4,
      q: 'What is the value of $806,335,000 \\div 1,000$?',
      options: ['$806,335$', '$8,063,350$', '$80,633.5$', '$806,335,000,000$'],
      correct: 0,
      proof: 'Dividing by $1,000$ shifts all digits 3 places to the right, canceling three terminal zeros: $806,335,000 \\div 1,000 = 806,335$.'
    },
    {
      id: 5,
      q: 'Which expression represents $10 \\times 10 \\times 10 \\times 10$ in exponential form?',
      options: ['$40$', '$10 \\times 4$', '$10^4$', '$4^{10}$'],
      correct: 2,
      proof: 'Repeated multiplication of the base $10$ four times is written as base $10$ with exponent $4$: $10^4$.'
    },
    {
      id: 6,
      q: 'What is the value of $7 \\times 10^3$?',
      options: ['$70$', '$700$', '$2,100$', '$7,000$'],
      correct: 3,
      proof: '$10^3 = 1,000$. Thus, $7 \\times 10^3 = 7 \\times 1,000 = 7,000$.'
    },
    {
      id: 7,
      q: 'Zoey wrote $10^4 = 40$. Which statement explains her error?',
      options: [
        'She should have added $10 + 4 = 14$.',
        'She multiplied the base 10 by exponent 4 instead of multiplying 10 by itself 4 times ($10,000$).',
        'She should have divided 10 by 4.',
        'There is no error; $10^4$ equals 40.'
      ],
      correct: 1,
      proof: 'An exponent signifies repeated multiplication ($10^4 = 10 \\times 10 \\times 10 \\times 10 = 10,000$), not multiplying base by power ($10 \\times 4$).'
    },
    {
      id: 8,
      q: 'What is the product of $52 \\times 10^3$?',
      options: ['$520$', '$5,200$', '$52,000$', '$520,000$'],
      correct: 2,
      proof: '$52 \\times 10^3 = 52 \\times 1,000 = 52,000$.'
    },
    {
      id: 9,
      q: 'Estimate the product of $69 \\times 63$ by rounding each factor to the nearest ten.',
      options: ['$3,600$', '$4,200$', '$4,500$', '$4,900$'],
      correct: 1,
      proof: 'Rounding $69 \\to 70$ and $63 \\to 60$. Mental math: $7 \\times 6 = 42 \\implies 70 \\times 60 = 4,200$.'
    },
    {
      id: 10,
      q: 'An airplane flies $482\\text{ miles per hour}$. Estimate how far it travels in $19\\text{ hours}$ using rounding.',
      options: ['$8,000\\text{ miles}$', '$9,000\\text{ miles}$', '$10,000\\text{ miles}$', '$12,000\\text{ miles}$'],
      correct: 2,
      proof: 'Round $482 \\to 500$ and $19 \\to 20$. Then $500 \\times 20 = 10,000\\text{ miles}$.'
    }
  ],

  // 5. Timed Quiz Assessments (3 Models • 30 Questions)
  quizModels: [
    {
      title: 'Timed Quiz - Model #1 (Place Value, Periods & Base-10 Shifts)',
      questions: [
        {
          q: '1. In $213,560,447$, which digit is in the hundred-thousands place?',
          options: ['5', '6', '1', '2'],
          correct: 0,
          proof: 'In the thousands period ($560$), the hundred-thousands digit is 5.'
        },
        {
          q: '2. What is the value of the digit 2 in $820,146,375$?',
          options: ['$2,000,000$', '$20,000,000$', '$200,000,000$', '$200,000$'],
          correct: 1,
          proof: 'Digit 2 is in the ten-millions place: $2 \\times 10,000,000 = 20,000,000$.'
        },
        {
          q: '3. When a number is multiplied by 10, each digit shifts:',
          options: ['1 place to the right', '1 place to the left', '2 places to the left', 'Does not change position'],
          correct: 1,
          proof: 'Multiplying by 10 increases the value tenfold, shifting each digit 1 place to the left.'
        },
        {
          q: '4. In $65,520$, the value of the 5 in thousands ($5,000$) compared to 5 in hundreds ($500$) is:',
          options: ['$10$ times greater', '$100$ times greater', '$\\frac{1}{10}$ of it', 'Equal'],
          correct: 0,
          proof: '$5,000 \\div 500 = 10$. It is 10 times greater.'
        },
        {
          q: '5. What is the standard form of $500,000,000 + 60,000,000 + 2,000,000 + 300,000 + 40,000 + 7,000 + 80 + 9$?',
          options: ['$562,347,890$', '$562,347,089$', '$526,347,089$', '$562,304,789$'],
          correct: 1,
          proof: 'Combining the place values gives $562,347,089$ (hundreds place is 0).'
        },
        {
          q: '6. What is the value of $720,345,860$ with the underlined digit 4 in $720,3\\underline{4}5,860$?',
          options: ['$4,000$', '$40,000$', '$400,000$', '$4,000,000$'],
          correct: 1,
          proof: 'Digit 4 is in the ten-thousands place, so its value is $40,000$.'
        },
        {
          q: '7. $806,335,000 \\div 1,000 = $',
          options: ['$806,335$', '$8,063,350$', '$80,633.5$', '$86,335$'],
          correct: 0,
          proof: 'Dividing by $10^3 = 1,000$ eliminates 3 trailing zeros, resulting in $806,335$.'
        },
        {
          q: '8. How many times greater is $10^5$ than $10^2$?',
          options: ['$10$ times', '$100$ times', '$1,000$ times', '$10,000$ times'],
          correct: 2,
          proof: '$10^5 \\div 10^2 = 10^{5-2} = 10^3 = 1,000$.'
        },
        {
          q: '9. Which number has a 7 with value $7,000,000$?',
          options: ['$27,150,000$', '$17,564,209$', '$75,000,000$', '$700,000,000$'],
          correct: 1,
          proof: 'In $17,564,209$, the digit 7 is in the millions place ($7 \\times 1,000,000 = 7,000,000$).'
        },
        {
          q: '10. In place value, moving 2 places to the right divides the digit value by:',
          options: ['$2$', '$20$', '$100$', '$1,000$'],
          correct: 2,
          proof: 'Each step to the right divides by 10. Two steps divide by $10 \\times 10 = 100$.'
        }
      ]
    },
    {
      title: 'Timed Quiz - Model #2 (Powers of 10 & Exponential Notation)',
      questions: [
        {
          q: '1. What is $10^5$ in standard form?',
          options: ['$50$', '$500$', '$10,000$', '$100,000$'],
          correct: 3,
          proof: '$10^5 = 1$ followed by 5 zeros $= 100,000$.'
        },
        {
          q: '2. Express $1,000,000$ as a power of 10:',
          options: ['$10^4$', '$10^5$', '$10^6$', '$10^7$'],
          correct: 2,
          proof: '$1,000,000$ has 6 zeros, which equals $10^6$.'
        },
        {
          q: '3. Find the product: $35 \\times 10^4$:',
          options: ['$350,000$', '$3,500,000$', '$35,000$', '$350$'],
          correct: 0,
          proof: '$35 \\times 10,000 = 350,000$.'
        },
        {
          q: '4. If $8 \\times 10^n = 8,000,000$, what is the value of $n$?',
          options: ['$4$', '$5$', '$6$', '$7$'],
          correct: 2,
          proof: '$8,000,000 = 8 \\times 10^6$, so $n = 6$.'
        },
        {
          q: '5. What is the value of $4 \\times 10^0$?',
          options: ['$0$', '$4$', '$40$', '$400$'],
          correct: 1,
          proof: 'Any non-zero number to power 0 equals 1: $10^0 = 1$, so $4 \\times 1 = 4$.'
        },
        {
          q: '6. Which comparison is correct?',
          options: [
            '$52 \\times 10^3 < 5 \\times 10^4$',
            '$52 \\times 10^3 > 5 \\times 10^4$',
            '$52 \\times 10^3 = 5 \\times 10^4$',
            '$52 \\times 10^2 > 52 \\times 10^3$'
          ],
          correct: 1,
          proof: '$52 \\times 10^3 = 52,000$, while $5 \\times 10^4 = 50,000$. Since $52,000 > 50,000$, the statement is correct.'
        },
        {
          q: '7. Evaluate: $10^2 \\times 10^3 = $',
          options: ['$10^5$', '$10^6$', '$10^1$', '$10^{23}$'],
          correct: 0,
          proof: 'Product of powers with same base: $10^2 \\times 10^3 = 10^{2+3} = 10^5$.'
        },
        {
          q: '8. Write $10 \\times 10 \\times 10$ with base and exponent:',
          options: ['Base $3$, exponent $10$', 'Base $10$, exponent $3$', 'Base $30$, exponent $1$', 'Base $10$, exponent $10$'],
          correct: 1,
          proof: 'The factor repeated is 10 (base), repeated 3 times (exponent): $10^3$.'
        },
        {
          q: '9. A spacecraft has mass $3 \\times 10^4\\text{ kg}$. In standard form, this is:',
          options: ['$3,000\\text{ kg}$', '$30,000\\text{ kg}$', '$300,000\\text{ kg}$', '$34\\text{ kg}$'],
          correct: 1,
          proof: '$3 \\times 10^4 = 3 \\times 10,000 = 30,000\\text{ kg}$.'
        },
        {
          q: '10. What is $(7 \\times 10^5) + (4 \\times 10^2)$?',
          options: ['$740,000$', '$700,400$', '$704,000$', '$70,400$'],
          correct: 1,
          proof: '$700,000 + 400 = 700,400$.'
        }
      ]
    },
    {
      title: 'Timed Quiz - Model #3 (Estimation, Rounding & Compatible Numbers)',
      questions: [
        {
          q: '1. Estimate $69 \\times 63$ using rounding to the nearest ten:',
          options: ['$3,600$', '$4,200$', '$4,500$', '$4,900$'],
          correct: 1,
          proof: '$69 \\to 70$ and $63 \\to 60$. $70 \\times 60 = 4,200$.'
        },
        {
          q: '2. Estimate $482 \\times 19$ by rounding each factor to its highest place value:',
          options: ['$8,000$', '$9,000$', '$10,000$', '$12,000$'],
          correct: 2,
          proof: '$482 \\to 500$, $19 \\to 20$. $500 \\times 20 = 10,000$.'
        },
        {
          q: '3. A table costs $\\$85$. What is the estimated cost of $41$ tables using rounding?',
          options: ['$\\$3,200$', '$\\$3,600$', '$\\$4,000$', '$\\$4,500$'],
          correct: 1,
          proof: '$85 \\to 90$, $41 \\to 40$. $90 \\times 40 = \\$3,600$.'
        },
        {
          q: '4. An airplane flies $583\\text{ km/h}$. Estimate distance in $12\\text{ hours}$ using compatible numbers:',
          options: ['$5,000\\text{ km}$', '$6,000\\text{ km}$', '$10,000\\text{ km}$', '$12,000\\text{ km}$'],
          correct: 1,
          proof: 'Compatible numbers: $600 \\times 10 = 6,000\\text{ km}$.'
        },
        {
          q: '5. Which pair of numbers are compatible for estimating $28 \\times 315$?',
          options: ['$20$ and $300$', '$30$ and $300$', '$25$ and $350$', '$10$ and $400$'],
          correct: 1,
          proof: '$28 \\approx 30$ and $315 \\approx 300$, yielding $30 \\times 300 = 9,000$.'
        },
        {
          q: '6. Rounding $492 \\times 22$ to the nearest ten gives:',
          options: ['$490 \\times 20 = 9,800$', '$500 \\times 20 = 10,000$', '$400 \\times 20 = 8,000$', '$500 \\times 30 = 15,000$'],
          correct: 0,
          proof: 'To nearest ten: 492 rounds to 490, 22 rounds to 20: $490 \\times 20 = 9,800$.'
        },
        {
          q: '7. Venus takes $225$ days per orbit. Estimate days for $16$ orbits using $250 \\times 16$:',
          options: ['$3,000\\text{ days}$', '$3,600\\text{ days}$', '$4,000\\text{ days}$', '$4,500\\text{ days}$'],
          correct: 2,
          proof: '$250 \\times 16 = 250 \\times 4 \\times 4 = 1,000 \\times 4 = 4,000\\text{ days}$.'
        },
        {
          q: '8. When estimating a product, why are compatible numbers used?',
          options: [
            'They always give the exact answer',
            'They make mental arithmetic quick and easy without paper',
            'They change multiplication into addition',
            'They are required by calculators'
          ],
          correct: 1,
          proof: 'Compatible numbers are friendly values close to the actual numbers that simplify mental calculation.'
        },
        {
          q: '9. Is an estimate of $500 \\times 20 = 10,000$ for $482 \\times 19$ an underestimate or overestimate?',
          options: [
            'Overestimate (both rounded up)',
            'Underestimate (both rounded down)',
            'Exact value',
            'Cannot be determined'
          ],
          correct: 0,
          proof: 'Since both $482 < 500$ and $19 < 20$, the estimated product $10,000$ is an overestimate.'
        },
        {
          q: '10. Estimate $91 \\times 38$ by rounding each factor to its greatest place value:',
          options: ['$2,700$', '$3,200$', '$3,600$', '$4,000$'],
          correct: 2,
          proof: '$91 \\to 90$ and $38 \\to 40$. $90 \\times 40 = 3,600$.'
        }
      ]
    }
  ]
};

