/* ==========================================================================
   WEEKLY ASSESSMENTS DATA REPOSITORY
   Educator: Mr Ahmed Abd El-Motaal (Math Teacher & Content Creator)
   Curriculum: Mathematics (Prep / Primary / Middle School)
   Assessments Included:
   - Week 2: Proportion & Scale Drawing (Group A, Group B, Group C)
   - Week 3: Sets, Operations & Venn Diagrams (Group A, Group B, Group C)
   - Week 4: Operations in Integers (Z) & Absolute Value (Group A, Group B, Group C)
   - Week 5: Operations in Rational Numbers (Q) & Inverses (Group A, Group B, Group C)
   ========================================================================== */

const WEEKS_DATA = {
  // ========================================================================
  // WEEK 2: PROPORTION & REAL-WORLD APPLICATIONS
  // ========================================================================
  week2: {
    id: 'week2',
    title: 'Week 2: Proportion & Scale Drawing',
    stageName: 'Weekly Assessment – Week 2 (Proportion)',
    groupA: {
      id: 'groupA',
      title: 'Group (A)',
      badgeName: 'Group (A) • Week 2 Assessment',
      questions: [
        {
          id: 'W2_A1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Find the value of b',
          prompt: '1) If \\(\\frac{15}{b} = \\frac{10}{60}\\), what is the value of \\(b\\) ?',
          options: [
            { key: 'a', text: '90', isCorrect: true },
            { key: 'b', text: '30', isCorrect: false },
            { key: 'c', text: '60', isCorrect: false },
            { key: 'd', text: '120', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Write down the proportion:</strong></div>
            <div class="sol-math">\\[\\frac{15}{b} = \\frac{10}{60}\\]</div>
            <div class="sol-step"><strong>Step 2: Cross multiplication:</strong></div>
            <div class="sol-math">\\[10 \\times b = 15 \\times 60\\]</div>
            <div class="sol-math">\\[10b = 900\\]</div>
            <div class="sol-step"><strong>Step 3: Solve for \\(b\\):</strong></div>
            <div class="sol-math">\\[b = \\frac{900}{10} = 90\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(a) 90</strong></div>
          `
        },
        {
          id: 'W2_A2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Drawing Scale',
          prompt: '2) If the drawing length is \\(3\\text{ cm}\\) and the real length is \\(18\\text{ meters}\\), then the drawing scale is...............',
          options: [
            { key: 'a', text: '1:60', isCorrect: false },
            { key: 'b', text: '1:600', isCorrect: true },
            { key: 'c', text: '1:6', isCorrect: false },
            { key: 'd', text: '1:6,000', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Convert units to the same unit (centimeters):</strong></div>
            <div class="sol-math">\\[\\text{Real length} = 18\\text{ m} = 18 \\times 100\\text{ cm} = 1,800\\text{ cm}\\]</div>
            <div class="sol-step"><strong>Step 2: Apply the drawing scale ratio:</strong></div>
            <div class="sol-math">\\[\\text{Drawing Scale} = \\frac{\\text{Drawing Length}}{\\text{Real Length}} = \\frac{3\\text{ cm}}{1,800\\text{ cm}}\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify by dividing both terms by 3:</strong></div>
            <div class="sol-math">\\[\\frac{3 \\div 3}{1,800 \\div 3} = \\frac{1}{600} = 1:600\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 1:600</strong></div>
          `
        },
        {
          id: 'W2_A3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Proportion Word Problem (Pens)',
          prompt: '1) Jalal bought 10 pens for \\(70\\text{ L.E}\\). How many pens of the same type can he buy with \\(119\\text{ L.E}\\)?',
          modelSolution: `
            <div class="sol-step"><strong>Method 1: Unit Rate (Price of 1 pen)</strong></div>
            <div class="sol-math">\\[\\text{Price of 1 pen} = \\frac{70}{10} = 7\\text{ L.E}\\]</div>
            <div class="sol-step"><strong>Number of pens that can be bought with 119 L.E:</strong></div>
            <div class="sol-math">\\[\\text{Number of pens} = \\frac{119}{7} = 17\\text{ pens}\\]</div>
            <div class="sol-divider">OR</div>
            <div class="sol-step"><strong>Method 2: Direct Proportion</strong></div>
            <div class="sol-math">\\[\\frac{\\text{Pens}}{\\text{Price}} \\Rightarrow \\frac{10}{70} = \\frac{x}{119}\\]</div>
            <div class="sol-math">\\[x = \\frac{10 \\times 119}{70} = \\frac{1,190}{70} = 17\\text{ pens}\\]</div>
            <div class="sol-highlight">He can buy <strong>17 pens</strong>.</div>
          `
        },
        {
          id: 'W2_A4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Percentage & Profit Problem (Meal)',
          prompt: '2) A meal costs \\(180\\text{ L.E}\\) and a \\(15\\%\\) profit is added to the cost of the meal. What is the selling price of the meal?',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate the amount of profit:</strong></div>
            <div class="sol-math">\\[\\text{Profit} = 180 \\times 15\\% = 180 \\times \\frac{15}{100} = 27\\text{ L.E}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate the selling price:</strong></div>
            <div class="sol-math">\\[\\text{Selling Price} = \\text{Cost} + \\text{Profit} = 180 + 27 = 207\\text{ L.E}\\]</div>
            <div class="sol-step"><em>Alternative single-step method:</em> \\[180 \\times 115\\% = 180 \\times 1.15 = 207\\text{ L.E}\\]</div>
            <div class="sol-highlight">The selling price of the meal is <strong>207 L.E</strong>.</div>
          `
        },
        {
          id: 'W2_A5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Ratio Distribution (3600 L.E)',
          prompt: '3) A man wanted to distribute \\(3,600\\text{ L.E}\\) between two people in a ratio of \\(3:2\\). What would be the share of each person?',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Find the sum of parts in the ratio:</strong></div>
            <div class="sol-math">\\[\\text{Sum of parts} = 3 + 2 = 5\\text{ parts}\\]</div>
            <div class="sol-step"><strong>Step 2: Find the value of one part:</strong></div>
            <div class="sol-math">\\[\\text{Value of 1 part} = \\frac{3,600}{5} = 720\\text{ L.E}\\]</div>
            <div class="sol-step"><strong>Step 3: Calculate the share of each person:</strong></div>
            <div class="sol-math">\\[\\text{First person's share} = 3 \\times 720 = 2,160\\text{ L.E}\\]</div>
            <div class="sol-math">\\[\\text{Second person's share} = 2 \\times 720 = 1,440\\text{ L.E}\\]</div>
            <div class="sol-step"><em>Verification:</em> \\(2,160 + 1,440 = 3,600\\text{ L.E}\\) \\(\\checkmark\\)</div>
            <div class="sol-highlight">1st Person = <strong>2,160 L.E</strong> &nbsp;|&nbsp; 2nd Person = <strong>1,440 L.E</strong></div>
          `
        }
      ]
    },
    groupB: {
      id: 'groupB',
      title: 'Group (B)',
      badgeName: 'Group (B) • Week 2 Assessment',
      questions: [
        {
          id: 'W2_B1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Find the value of y',
          prompt: '1) If \\(\\frac{15}{y} = \\frac{3}{4}\\), find the value of \\(y\\) .',
          options: [
            { key: 'a', text: '100', isCorrect: false },
            { key: 'b', text: '20', isCorrect: true },
            { key: 'c', text: '60', isCorrect: false },
            { key: 'd', text: '75', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Write down the proportion:</strong></div>
            <div class="sol-math">\\[\\frac{15}{y} = \\frac{3}{4}\\]</div>
            <div class="sol-step"><strong>Step 2: Cross multiplication:</strong></div>
            <div class="sol-math">\\[3 \\times y = 15 \\times 4\\]</div>
            <div class="sol-math">\\[3y = 60\\]</div>
            <div class="sol-step"><strong>Step 3: Solve for \\(y\\):</strong></div>
            <div class="sol-math">\\[y = \\frac{60}{3} = 20\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 20</strong></div>
          `
        },
        {
          id: 'W2_B2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Drawing Scale',
          prompt: '2) If the length in a drawing is \\(2\\text{ cm}\\) and the real length is \\(6\\text{ meters}\\), then the drawing scale is......',
          options: [
            { key: 'a', text: '1:3', isCorrect: false },
            { key: 'b', text: '1:300', isCorrect: true },
            { key: 'c', text: '1:3,000', isCorrect: false },
            { key: 'd', text: '1:30', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Convert meters to centimeters:</strong></div>
            <div class="sol-math">\\[\\text{Real length} = 6\\text{ m} = 6 \\times 100\\text{ cm} = 600\\text{ cm}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate the drawing scale:</strong></div>
            <div class="sol-math">\\[\\text{Drawing Scale} = \\frac{\\text{Drawing Length}}{\\text{Real Length}} = \\frac{2\\text{ cm}}{600\\text{ cm}}\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify by dividing both by 2:</strong></div>
            <div class="sol-math">\\[\\frac{2 \\div 2}{600 \\div 2} = \\frac{1}{300} = 1:300\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 1:300</strong></div>
          `
        },
        {
          id: 'W2_B3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Ratio Distribution (1080 EGP)',
          prompt: '1) If an amount of \\(1,080\\text{ EGP}\\) is divided between two people in a ratio of \\(7:5\\), what is the share of each person?',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Find the total number of parts:</strong></div>
            <div class="sol-math">\\[\\text{Total parts} = 7 + 5 = 12\\text{ parts}\\]</div>
            <div class="sol-step"><strong>Step 2: Find the value of 1 part:</strong></div>
            <div class="sol-math">\\[\\text{Value of 1 part} = \\frac{1,080}{12} = 90\\text{ EGP}\\]</div>
            <div class="sol-step"><strong>Step 3: Calculate each person's share:</strong></div>
            <div class="sol-math">\\[\\text{1st person's share} = 7 \\times 90 = 630\\text{ EGP}\\]</div>
            <div class="sol-math">\\[\\text{2nd person's share} = 5 \\times 90 = 450\\text{ EGP}\\]</div>
            <div class="sol-step"><em>Check:</em> \\(630 + 450 = 1,080\\text{ EGP}\\) \\(\\checkmark\\)</div>
            <div class="sol-highlight">1st Share = <strong>630 EGP</strong> &nbsp;|&nbsp; 2nd Share = <strong>450 EGP</strong></div>
          `
        },
        {
          id: 'W2_B4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Weight Proportion (Earth & Moon)',
          prompt: '2) An object weighs \\(120\\text{ Newtons}\\) on Earth. If you know that its weight on the moon is \\(20\\text{ Newtons}\\), what would be the weight of another object on the moon if its weight on Earth is \\(90\\text{ Newtons}\\)?',
          modelSolution: `
            <div class="sol-step"><strong>Method 1: Direct Proportion</strong></div>
            <div class="sol-math">\\[\\frac{\\text{Moon Weight}}{\\text{Earth Weight}} \\Rightarrow \\frac{20}{120} = \\frac{W_{\\text{moon}}}{90}\\]</div>
            <div class="sol-step"><strong>Cross Multiplication:</strong></div>
            <div class="sol-math">\\[W_{\\text{moon}} = \\frac{20 \\times 90}{120} = \\frac{1,800}{120} = 15\\text{ Newtons}\\]</div>
            <div class="sol-divider">OR</div>
            <div class="sol-step"><strong>Method 2: Ratio of Lunar Gravity</strong></div>
            <div class="sol-math">\\[\\text{Gravity Ratio} = \\frac{20}{120} = \\frac{1}{6}\\]</div>
            <div class="sol-math">\\[\\text{Weight on Moon} = 90 \\times \\frac{1}{6} = 15\\text{ Newtons}\\]</div>
            <div class="sol-highlight">Weight on the moon = <strong>15 Newtons</strong>.</div>
          `
        },
        {
          id: 'W2_B5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Selling Price with Profit (Goods)',
          prompt: '3) A man bought goods for \\(3,000\\text{ EGP}\\) and sold them for a profit of \\(10\\%\\). What is the selling price after adding the profit?',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate the profit value:</strong></div>
            <div class="sol-math">\\[\\text{Profit} = 3,000 \\times 10\\% = 3,000 \\times \\frac{10}{100} = 300\\text{ EGP}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate the selling price:</strong></div>
            <div class="sol-math">\\[\\text{Selling Price} = \\text{Cost} + \\text{Profit} = 3,000 + 300 = 3,300\\text{ EGP}\\]</div>
            <div class="sol-step"><em>Direct 110% method:</em> \\[3,000 \\times 1.10 = 3,300\\text{ EGP}\\]</div>
            <div class="sol-highlight">The selling price is <strong>3,300 EGP</strong>.</div>
          `
        }
      ]
    },
    groupC: {
      id: 'groupC',
      title: 'Group (C)',
      badgeName: 'Group (C) • Week 2 Assessment',
      questions: [
        {
          id: 'W2_C1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Find the value of a',
          prompt: '1) Find the value of \\(a\\) if \\(\\frac{6}{a} = \\frac{3}{5}\\).',
          options: [
            { key: 'a', text: '9', isCorrect: false },
            { key: 'b', text: '30', isCorrect: false },
            { key: 'c', text: '12', isCorrect: false },
            { key: 'd', text: '10', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Write down the proportion:</strong></div>
            <div class="sol-math">\\[\\frac{6}{a} = \\frac{3}{5}\\]</div>
            <div class="sol-step"><strong>Step 2: Cross multiplication:</strong></div>
            <div class="sol-math">\\[3 \\times a = 6 \\times 5\\]</div>
            <div class="sol-math">\\[3a = 30\\]</div>
            <div class="sol-step"><strong>Step 3: Solve for \\(a\\):</strong></div>
            <div class="sol-math">\\[a = \\frac{30}{3} = 10\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) 10</strong></div>
          `
        },
        {
          id: 'W2_C2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Real Length from Scale',
          prompt: '2) If the drawing scale is \\(1:1,000\\) and the length in the drawing is \\(2.5\\text{ cm}\\), what is the real length?',
          options: [
            { key: 'a', text: '0.25 m', isCorrect: false },
            { key: 'b', text: '25 m', isCorrect: true },
            { key: 'c', text: '2.5 m', isCorrect: false },
            { key: 'd', text: '250 m', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Use drawing scale ratio:</strong></div>
            <div class="sol-math">\\[\\frac{\\text{Drawing Length}}{\\text{Real Length}} = \\frac{1}{1,000}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate real length in centimeters:</strong></div>
            <div class="sol-math">\\[\\text{Real Length} = 2.5 \\times 1,000 = 2,500\\text{ cm}\\]</div>
            <div class="sol-step"><strong>Step 3: Convert centimeters to meters:</strong></div>
            <div class="sol-math">\\[\\text{Real Length in meters} = \\frac{2,500}{100} = 25\\text{ meters}\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 25 m</strong></div>
          `
        },
        {
          id: 'W2_C3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Land Area Division (36 acres)',
          prompt: '1) A piece of land with an area of \\(36\\text{ acres}\\) was divided between two people in a ratio of \\(7:2\\). What is the share of each person?',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Find the sum of the ratio parts:</strong></div>
            <div class="sol-math">\\[\\text{Sum of parts} = 7 + 2 = 9\\text{ parts}\\]</div>
            <div class="sol-step"><strong>Step 2: Find the value of 1 part:</strong></div>
            <div class="sol-math">\\[\\text{Value of 1 part} = \\frac{36}{9} = 4\\text{ acres}\\]</div>
            <div class="sol-step"><strong>Step 3: Calculate each person's share:</strong></div>
            <div class="sol-math">\\[\\text{First person's share} = 7 \\times 4 = 28\\text{ acres}\\]</div>
            <div class="sol-math">\\[\\text{Second person's share} = 2 \\times 4 = 8\\text{ acres}\\]</div>
            <div class="sol-step"><em>Check:</em> \\(28 + 8 = 36\\text{ acres}\\) \\(\\checkmark\\)</div>
            <div class="sol-highlight">1st Share = <strong>28 acres</strong> &nbsp;|&nbsp; 2nd Share = <strong>8 acres</strong></div>
          `
        },
        {
          id: 'W2_C4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Factory Workers & Cloth Proportion',
          prompt: '2) In a factory, 10 workers produce \\(300\\text{ pieces}\\) of cloth. How many workers are needed to produce \\(630\\text{ pieces}\\)?',
          modelSolution: `
            <div class="sol-step"><strong>Method 1: Direct Proportion</strong></div>
            <div class="sol-math">\\[\\frac{\\text{Workers}}{\\text{Pieces}} \\Rightarrow \\frac{10}{300} = \\frac{W}{630}\\]</div>
            <div class="sol-step"><strong>Cross Multiply:</strong></div>
            <div class="sol-math">\\[W = \\frac{10 \\times 630}{300} = \\frac{6,300}{300} = 21\\text{ workers}\\]</div>
            <div class="sol-divider">OR</div>
            <div class="sol-step"><strong>Method 2: Rate of 1 Worker</strong></div>
            <div class="sol-math">\\[\\text{1 worker produces} = \\frac{300}{10} = 30\\text{ pieces}\\]</div>
            <div class="sol-math">\\[\\text{Workers needed} = \\frac{630}{30} = 21\\text{ workers}\\]</div>
            <div class="sol-highlight">Number of workers needed = <strong>21 workers</strong>.</div>
          `
        },
        {
          id: 'W2_C5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Car Profit (300,000 EGP)',
          prompt: '3) Khaled bought a car for \\(300,000\\text{ EGP}\\) and then sold it for a \\(5\\%\\) profit on the purchase price. Calculate the selling price of the car.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate the profit on the car:</strong></div>
            <div class="sol-math">\\[\\text{Profit} = 300,000 \\times 5\\% = 300,000 \\times \\frac{5}{100} = 15,000\\text{ EGP}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate the selling price:</strong></div>
            <div class="sol-math">\\[\\text{Selling Price} = \\text{Cost} + \\text{Profit} = 300,000 + 15,000 = 315,000\\text{ EGP}\\]</div>
            <div class="sol-step"><em>Direct calculation:</em> \\[300,000 \\times 1.05 = 315,000\\text{ EGP}\\]</div>
            <div class="sol-highlight">The selling price of the car is <strong>315,000 EGP</strong>.</div>
          `
        }
      ]
    }
  },

  // ========================================================================
  // WEEK 3: SETS, OPERATIONS & VENN DIAGRAMS
  // ========================================================================
  week3: {
    id: 'week3',
    title: 'Week 3: Sets & Operations',
    stageName: 'Weekly Assessment – Week 3 (Sets & Venn Diagrams)',
    groupA: {
      id: 'groupA',
      title: 'Group (A)',
      badgeName: 'Group (A) • Week 3 Assessment',
      questions: [
        {
          id: 'W3_A1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Belonging to a Set',
          prompt: '1) If \\(x \\in \\{8, 2, 5\\}\\) then the value of \\(x\\) cannot be equal to:',
          options: [
            { key: 'a', text: '3', isCorrect: true },
            { key: 'b', text: '5', isCorrect: false },
            { key: 'c', text: '8', isCorrect: false },
            { key: 'd', text: '2', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Concept: Belonging to a Set (\\(\\in\\))</strong></div>
            <div class="sol-step">If \\(x \\in \\{8, 2, 5\\}\\), this means that \\(x\\) must be one of the elements belonging to the set:</div>
            <div class="sol-math">\\[x = 8 \\quad \\text{or} \\quad x = 2 \\quad \\text{or} \\quad x = 5\\]</div>
            <div class="sol-step">Checking the given options:</div>
            <div class="sol-step">• <strong>5</strong> is in the set \\(\\checkmark\\)</div>
            <div class="sol-step">• <strong>8</strong> is in the set \\(\\checkmark\\)</div>
            <div class="sol-step">• <strong>2</strong> is in the set \\(\\checkmark\\)</div>
            <div class="sol-step">• <strong>3</strong> is <em>NOT</em> in the set (\\(3 \\notin \\{8, 2, 5\\}\\))</div>
            <div class="sol-highlight">Therefore, \\(x\\) cannot be equal to <strong>(a) 3</strong></div>
          `
        },
        {
          id: 'W3_A2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Equal Sets',
          prompt: '2) If \\(\\{1, 3, x\\} = \\{7, 1, y\\}\\) what is the value of \\(x - y\\) ?',
          options: [
            { key: 'a', text: '4', isCorrect: true },
            { key: 'b', text: '7', isCorrect: false },
            { key: 'c', text: '3', isCorrect: false },
            { key: 'd', text: '10', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Understand Equal Sets</strong></div>
            <div class="sol-step">Two sets are equal if and only if they contain the exact same elements:</div>
            <div class="sol-math">\\[\\{1, 3, x\\} = \\{7, 1, y\\}\\]</div>
            <div class="sol-step"><strong>Step 2: Match corresponding elements:</strong></div>
            <div class="sol-step">The element \\(1\\) is common to both sets. Therefore:</div>
            <div class="sol-math">\\[\\{3, x\\} = \\{7, y\\}\\]</div>
            <div class="sol-step">Since \\(3 \\ne 7\\), it must be that \\(y = 3\\) and \\(x = 7\\).</div>
            <div class="sol-step"><strong>Step 3: Calculate \\(x - y\\):</strong></div>
            <div class="sol-math">\\[x - y = 7 - 3 = 4\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(a) 4</strong></div>
          `
        },
        {
          id: 'W3_A3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Venn Diagram Operations',
          prompt: `
            1) Use the opposite Venn diagram to find:
            <div style="margin: 0.6rem 0; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B\\) &emsp;&emsp; (2) \\(A \\cup B\\)
            </div>
            <div class="venn-diagram-container" style="display:flex; justify-content:center; margin:1rem 0;">
              <svg width="340" height="200" viewBox="0 0 340 200" style="background:#f8faff; border-radius:16px; border:1.5px solid #dce4f2; box-shadow:0 4px 14px rgba(0,0,0,0.05); max-width:100%;">
                <ellipse cx="130" cy="105" rx="85" ry="75" fill="rgba(108, 92, 231, 0.12)" stroke="#6c5ce7" stroke-width="2.5" />
                <ellipse cx="210" cy="105" rx="85" ry="75" fill="rgba(0, 184, 148, 0.12)" stroke="#00b894" stroke-width="2.5" />
                <text x="70" y="38" font-family="'Cairo', sans-serif" font-size="20" font-weight="800" fill="#6c5ce7">B</text>
                <text x="265" y="38" font-family="'Cairo', sans-serif" font-size="20" font-weight="800" fill="#00b894">A</text>
                <circle cx="100" cy="70" r="3" fill="#2d3436"/><text x="108" y="75" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">9</text>
                <circle cx="85" cy="115" r="3" fill="#2d3436"/><text x="93" y="120" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">7</text>
                <circle cx="110" cy="150" r="3" fill="#2d3436"/><text x="118" y="155" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">5</text>
                <circle cx="166" cy="105" r="3.5" fill="#d63031"/><text x="174" y="110" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#d63031">1</text>
                <circle cx="245" cy="90" r="3" fill="#2d3436"/><text x="253" y="95" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">2</text>
                <circle cx="230" cy="140" r="3" fill="#2d3436"/><text x="238" y="145" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">4</text>
              </svg>
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>Reading elements from the Venn diagram:</strong></div>
            <div class="sol-step">• Elements of set \\(B = \\{1, 5, 7, 9\\}\\)</div>
            <div class="sol-step">• Elements of set \\(A = \\{1, 2, 4\\}\\)</div>
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B\\):</strong> (common elements in the overlap)</div>
            <div class="sol-math">\\[A \\cap B = \\{1\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B\\):</strong> (all elements in \\(A\\) and \\(B\\) without repetition)</div>
            <div class="sol-math">\\[A \\cup B = \\{1, 2, 4, 5, 7, 9\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B = \\mathbf{\\{1\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B = \\mathbf{\\{1, 2, 4, 5, 7, 9\\}}\\)</div>
          `
        },
        {
          id: 'W3_A4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Subsets of a Set',
          prompt: '2) Write all the subsets from the set \\(\\{3, 9\\}\\)',
          modelSolution: `
            <div class="sol-step"><strong>Rule: Subsets of a Finite Set</strong></div>
            <div class="sol-step">For a set with \\(n\\) elements, the total number of subsets is \\(2^n\\).</div>
            <div class="sol-step">Here, \\(n = 2\\), so the number of subsets is \\(2^2 = 4\\).</div>
            <div class="sol-step"><strong>Listing all subsets:</strong></div>
            <div class="sol-step">1. The empty set: \\(\\phi\\) (or \\(\\{\\}\\))</div>
            <div class="sol-step">2. Subsets containing 1 element: \\(\\{3\\}\\), \\(\\{9\\}\\)</div>
            <div class="sol-step">3. The set itself (containing 2 elements): \\(\\{3, 9\\}\\)</div>
            <div class="sol-highlight">All subsets are: <strong>\\(\\phi\\) , \\(\\{3\\}\\) , \\(\\{9\\}\\) , \\(\\{3, 9\\}\\)</strong></div>
          `
        },
        {
          id: 'W3_A5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations on Three Sets',
          prompt: `
            3) If \\(A = \\{1, 7, 9\\}\\), \\(B = \\{4, 2, 7\\}\\) and \\(C = \\{1, 7\\}\\). Find:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B \\cap C\\) &emsp;&emsp; (2) \\(A \\cup B \\cup C\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>Given Sets:</strong></div>
            <div class="sol-math">\\[A = \\{1, 7, 9\\}, \\quad B = \\{2, 4, 7\\}, \\quad C = \\{1, 7\\}\\]</div>
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B \\cap C\\):</strong></div>
            <div class="sol-step">Find the element(s) that belong to all three sets simultaneously:</div>
            <div class="sol-step">• \\(7 \\in A\\), \\(7 \\in B\\), and \\(7 \\in C\\) \\(\\implies 7\\) is common to all three.</div>
            <div class="sol-step">• \\(1\\) is in \\(A\\) and \\(C\\), but \\(1 \\notin B\\).</div>
            <div class="sol-math">\\[A \\cap B \\cap C = \\{7\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B \\cup C\\):</strong></div>
            <div class="sol-step">Collect all elements from \\(A\\), \\(B\\), and \\(C\\) without repeating:</div>
            <div class="sol-math">\\[A \\cup B \\cup C = \\{1, 2, 4, 7, 9\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B \\cap C = \\mathbf{\\{7\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B \\cup C = \\mathbf{\\{1, 2, 4, 7, 9\\}}\\)</div>
          `
        }
      ]
    },
    groupB: {
      id: 'groupB',
      title: 'Group (B)',
      badgeName: 'Group (B) • Week 3 Assessment',
      questions: [
        {
          id: 'W3_B1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Not Belonging to a Set',
          prompt: '1) If \\(x \\notin \\{1, 3, 4\\}\\) then the value of \\(x\\) can be equal to:',
          options: [
            { key: 'a', text: '3', isCorrect: false },
            { key: 'b', text: '5', isCorrect: true },
            { key: 'c', text: '4', isCorrect: false },
            { key: 'd', text: '1', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Concept: Not Belonging (\\(\\notin\\))</strong></div>
            <div class="sol-step">\\(x \\notin \\{1, 3, 4\\}\\) means \\(x\\) is <em>NOT</em> an element of the set \\(\\{1, 3, 4\\}\\).</div>
            <div class="sol-step">Checking the options:</div>
            <div class="sol-step">• <strong>3</strong> belongs to the set (\\(3 \\in \\{1, 3, 4\\}\\))</div>
            <div class="sol-step">• <strong>4</strong> belongs to the set (\\(4 \\in \\{1, 3, 4\\}\\))</div>
            <div class="sol-step">• <strong>1</strong> belongs to the set (\\(1 \\in \\{1, 3, 4\\}\\))</div>
            <div class="sol-step">• <strong>5</strong> does NOT belong to the set (\\(5 \\notin \\{1, 3, 4\\}\\))</div>
            <div class="sol-highlight">Therefore, \\(x\\) can be equal to <strong>(b) 5</strong></div>
          `
        },
        {
          id: 'W3_B2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Equal Sets with Four Elements',
          prompt: '2) If \\(\\{6, 3, x, 7\\} = \\{3, 5, y, 6\\}\\) what is the value of \\(y - x\\) ?',
          options: [
            { key: 'a', text: '5', isCorrect: false },
            { key: 'b', text: '2', isCorrect: true },
            { key: 'c', text: '7', isCorrect: false },
            { key: 'd', text: '12', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Compare the elements of both sets:</strong></div>
            <div class="sol-math">\\[\\{6, 3, x, 7\\} = \\{3, 5, y, 6\\}\\]</div>
            <div class="sol-step">Elements \\(3\\) and \\(6\\) are present in both sets.</div>
            <div class="sol-step"><strong>Step 2: Equate the remaining elements:</strong></div>
            <div class="sol-math">\\[\\{x, 7\\} = \\{5, y\\}\\]</div>
            <div class="sol-step">Since \\(7 \\ne 5\\), we deduce:</div>
            <div class="sol-math">\\[y = 7 \\quad \\text{and} \\quad x = 5\\]</div>
            <div class="sol-step"><strong>Step 3: Calculate \\(y - x\\):</strong></div>
            <div class="sol-math">\\[y - x = 7 - 5 = 2\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 2</strong></div>
          `
        },
        {
          id: 'W3_B3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Venn Diagram Operations',
          prompt: `
            1) Use the opposite Venn diagram to find:
            <div style="margin: 0.6rem 0; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B\\) &emsp;&emsp; (2) \\(A \\cup B\\)
            </div>
            <div class="venn-diagram-container" style="display:flex; justify-content:center; margin:1rem 0;">
              <svg width="340" height="200" viewBox="0 0 340 200" style="background:#f8faff; border-radius:16px; border:1.5px solid #dce4f2; box-shadow:0 4px 14px rgba(0,0,0,0.05); max-width:100%;">
                <ellipse cx="130" cy="105" rx="85" ry="75" fill="rgba(108, 92, 231, 0.12)" stroke="#6c5ce7" stroke-width="2.5" />
                <ellipse cx="210" cy="105" rx="85" ry="75" fill="rgba(0, 184, 148, 0.12)" stroke="#00b894" stroke-width="2.5" />
                <text x="70" y="38" font-family="'Cairo', sans-serif" font-size="20" font-weight="800" fill="#6c5ce7">B</text>
                <text x="265" y="38" font-family="'Cairo', sans-serif" font-size="20" font-weight="800" fill="#00b894">A</text>
                <circle cx="95" cy="85" r="3" fill="#2d3436"/><text x="103" y="90" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">10</text>
                <circle cx="90" cy="135" r="3" fill="#2d3436"/><text x="98" y="140" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">12</text>
                <circle cx="165" cy="105" r="3.5" fill="#d63031"/><text x="173" y="110" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#d63031">15</text>
                <circle cx="240" cy="85" r="3" fill="#2d3436"/><text x="248" y="90" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">7</text>
                <circle cx="235" cy="135" r="3" fill="#2d3436"/><text x="243" y="140" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#2d3436">11</text>
              </svg>
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>Reading elements from the Venn diagram:</strong></div>
            <div class="sol-step">• Elements of set \\(B = \\{10, 12, 15\\}\\)</div>
            <div class="sol-step">• Elements of set \\(A = \\{7, 11, 15\\}\\)</div>
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B\\):</strong></div>
            <div class="sol-math">\\[A \\cap B = \\{15\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B\\):</strong></div>
            <div class="sol-math">\\[A \\cup B = \\{7, 10, 11, 12, 15\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B = \\mathbf{\\{15\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B = \\mathbf{\\{7, 10, 11, 12, 15\\}}\\)</div>
          `
        },
        {
          id: 'W3_B4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Subsets of a Set',
          prompt: '2) Write all the subsets from the set \\(\\{1, 8\\}\\)',
          modelSolution: `
            <div class="sol-step"><strong>Rule: Number of Subsets</strong></div>
            <div class="sol-step">The set has \\(2\\) elements, so total subsets = \\(2^2 = 4\\).</div>
            <div class="sol-step"><strong>Listing all subsets:</strong></div>
            <div class="sol-step">1. Empty set: \\(\\phi\\)</div>
            <div class="sol-step">2. Single-element subsets: \\(\\{1\\}\\), \\(\\{8\\}\\)</div>
            <div class="sol-step">3. Two-element subset (the set itself): \\(\\{1, 8\\}\\)</div>
            <div class="sol-highlight">All subsets are: <strong>\\(\\phi\\) , \\(\\{1\\}\\) , \\(\\{8\\}\\) , \\(\\{1, 8\\}\\)</strong></div>
          `
        },
        {
          id: 'W3_B5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations on Three Sets',
          prompt: `
            3) If \\(A = \\{1, 5, 8\\}\\), \\(B = \\{4, 5, 7\\}\\) and \\(C = \\{1, 5\\}\\). Find:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B \\cap C\\) &emsp;&emsp; (2) \\(A \\cup B \\cup C\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>Given Sets:</strong></div>
            <div class="sol-math">\\[A = \\{1, 5, 8\\}, \\quad B = \\{4, 5, 7\\}, \\quad C = \\{1, 5\\}\\]</div>
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B \\cap C\\):</strong></div>
            <div class="sol-step">Common to all three sets:</div>
            <div class="sol-step">• \\(5 \\in A\\), \\(5 \\in B\\), and \\(5 \\in C\\) \\(\\implies 5\\) is common.</div>
            <div class="sol-step">• \\(1 \\in A\\) and \\(1 \\in C\\), but \\(1 \\notin B\\).</div>
            <div class="sol-math">\\[A \\cap B \\cap C = \\{5\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B \\cup C\\):</strong></div>
            <div class="sol-math">\\[A \\cup B \\cup C = \\{1, 4, 5, 7, 8\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B \\cap C = \\mathbf{\\{5\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B \\cup C = \\mathbf{\\{1, 4, 5, 7, 8\\}}\\)</div>
          `
        }
      ]
    },
    groupC: {
      id: 'groupC',
      title: 'Group (C)',
      badgeName: 'Group (C) • Week 3 Assessment',
      questions: [
        {
          id: 'W3_C1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Belonging with Algebraic Expression',
          prompt: '1) If \\(7 \\in \\{x + 2, 3, 4\\}\\) then \\(x = \\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '4', isCorrect: false },
            { key: 'b', text: '5', isCorrect: true },
            { key: 'c', text: '7', isCorrect: false },
            { key: 'd', text: '2', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Set membership condition:</strong></div>
            <div class="sol-step">Since \\(7 \\in \\{x + 2, 3, 4\\}\\), \\(7\\) must equal one of the elements.</div>
            <div class="sol-step">Since \\(7 \\ne 3\\) and \\(7 \\ne 4\\), we have:</div>
            <div class="sol-math">\\[x + 2 = 7\\]</div>
            <div class="sol-step"><strong>Step 2: Solve for \\(x\\):</strong></div>
            <div class="sol-math">\\[x = 7 - 2 = 5\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) 5</strong></div>
          `
        },
        {
          id: 'W3_C2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Equal Sets (Sum of Unknowns)',
          prompt: '2) If \\(\\{6, 3, a, 7\\} = \\{3, 5, b, 6\\}\\). What is the value of \\(a + b\\) ?',
          options: [
            { key: 'a', text: '2', isCorrect: false },
            { key: 'b', text: '10', isCorrect: false },
            { key: 'c', text: '8', isCorrect: false },
            { key: 'd', text: '12', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Match common elements:</strong></div>
            <div class="sol-math">\\[\\{6, 3, a, 7\\} = \\{3, 5, b, 6\\}\\]</div>
            <div class="sol-step">Elements \\(3\\) and \\(6\\) cancel out from both sets:</div>
            <div class="sol-math">\\[\\{a, 7\\} = \\{5, b\\}\\]</div>
            <div class="sol-step">Since \\(7 \\ne 5\\), we must have \\(b = 7\\) and \\(a = 5\\).</div>
            <div class="sol-step"><strong>Step 2: Calculate \\(a + b\\):</strong></div>
            <div class="sol-math">\\[a + b = 5 + 7 = 12\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) 12</strong></div>
          `
        },
        {
          id: 'W3_C3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Set Intersection and Union',
          prompt: `
            1) If \\(A = \\{8, 6, 7\\}\\) and \\(B = \\{1, 8, 3, 2\\}\\). Find:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B\\) &emsp;&emsp; (2) \\(A \\cup B\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B\\):</strong></div>
            <div class="sol-step">Elements that belong to both \\(A\\) and \\(B\\):</div>
            <div class="sol-step">• Only the element \\(8\\) is in both sets.</div>
            <div class="sol-math">\\[A \\cap B = \\{8\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B\\):</strong></div>
            <div class="sol-step">All elements from \\(A\\) and \\(B\\) written in order without repetition:</div>
            <div class="sol-math">\\[A \\cup B = \\{1, 2, 3, 6, 7, 8\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B = \\mathbf{\\{8\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B = \\mathbf{\\{1, 2, 3, 6, 7, 8\\}}\\)</div>
          `
        },
        {
          id: 'W3_C4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Subsets of a Set',
          prompt: '2) Write all the subsets from the set \\(\\{3, 6\\}\\)',
          modelSolution: `
            <div class="sol-step"><strong>Rule: Subsets Calculation</strong></div>
            <div class="sol-step">Total number of subsets = \\(2^2 = 4\\).</div>
            <div class="sol-step"><strong>The subsets are:</strong></div>
            <div class="sol-step">1. The empty set: \\(\\phi\\)</div>
            <div class="sol-step">2. Subsets of 1 element: \\(\\{3\\}\\), \\(\\{6\\}\\)</div>
            <div class="sol-step">3. Subset of 2 elements: \\(\\{3, 6\\}\\)</div>
            <div class="sol-highlight">All subsets are: <strong>\\(\\phi\\) , \\(\\{3\\}\\) , \\(\\{6\\}\\) , \\(\\{3, 6\\}\\)</strong></div>
          `
        },
        {
          id: 'W3_C5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations on Three Sets',
          prompt: `
            3) If \\(A = \\{7, 9, 8\\}\\), \\(B = \\{4, 5, 7\\}\\) and \\(C = \\{1, 7, 8\\}\\). Find:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(A \\cap B \\cap C\\) &emsp;&emsp; (2) \\(A \\cup B \\cup C\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>Given Sets:</strong></div>
            <div class="sol-math">\\[A = \\{7, 8, 9\\}, \\quad B = \\{4, 5, 7\\}, \\quad C = \\{1, 7, 8\\}\\]</div>
            <div class="sol-step"><strong>(1) Intersection \\(A \\cap B \\cap C\\):</strong></div>
            <div class="sol-step">• Element \\(7\\) is present in \\(A\\), in \\(B\\), and in \\(C\\).</div>
            <div class="sol-step">• Element \\(8\\) is in \\(A\\) and \\(C\\), but not in \\(B\\).</div>
            <div class="sol-math">\\[A \\cap B \\cap C = \\{7\\}\\]</div>
            <div class="sol-step"><strong>(2) Union \\(A \\cup B \\cup C\\):</strong></div>
            <div class="sol-step">Combining all distinct elements:</div>
            <div class="sol-math">\\[A \\cup B \\cup C = \\{1, 4, 5, 7, 8, 9\\}\\]</div>
            <div class="sol-highlight">(1) \\(A \\cap B \\cap C = \\mathbf{\\{7\\}}\\) &nbsp;|&nbsp; (2) \\(A \\cup B \\cup C = \\mathbf{\\{1, 4, 5, 7, 8, 9\\}}\\)</div>
          `
        }
      ]
    }
  },

  // ========================================================================
  // WEEK 4: OPERATIONS IN INTEGERS (Z) & ABSOLUTE VALUE
  // ========================================================================
  week4: {
    id: 'week4',
    title: 'Week 4: Operations in Integers (Z) & Absolute Value',
    stageName: 'Weekly Assessment – Week 4 (Integers Z)',
    groupA: {
      id: 'groupA',
      title: 'Group (A)',
      badgeName: 'Group (A) • Week 4 Assessment',
      questions: [
        {
          id: 'W4_A1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Integers',
          prompt: '1) \\(-5 - (-3) = \\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(2\\)', isCorrect: false },
            { key: 'b', text: '\\(-8\\)', isCorrect: false },
            { key: 'c', text: '\\(8\\)', isCorrect: false },
            { key: 'd', text: '\\(-2\\)', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Rule for subtracting negative numbers:</strong></div>
            <div class="sol-step">Subtracting a negative number is equivalent to adding its opposite:</div>
            <div class="sol-math">\\[-(-3) = +3\\]</div>
            <div class="sol-step"><strong>Step 2: Rewrite the expression:</strong></div>
            <div class="sol-math">\\[-5 - (-3) = -5 + 3\\]</div>
            <div class="sol-step"><strong>Step 3: Add integers with different signs:</strong></div>
            <div class="sol-step">Subtract the absolute values \\((5 - 3 = 2)\\) and take the sign of the number with greater absolute value \\((-5)\\):</div>
            <div class="sol-math">\\[-5 + 3 = -2\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) -2</strong></div>
          `
        },
        {
          id: 'W4_A2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Absolute Value & Multiplication',
          prompt: '2) If \\(a = |-2|\\) , \\(b = -5\\) . What is the value of \\(ab\\) ?',
          options: [
            { key: 'a', text: '\\(10\\)', isCorrect: false },
            { key: 'b', text: '\\(7\\)', isCorrect: false },
            { key: 'c', text: '\\(-10\\)', isCorrect: true },
            { key: 'd', text: '\\(-7\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate the absolute value:</strong></div>
            <div class="sol-step">The absolute value of a negative number is positive:</div>
            <div class="sol-math">\\[a = |-2| = 2\\]</div>
            <div class="sol-step"><strong>Step 2: Multiply \\(a \\times b\\):</strong></div>
            <div class="sol-math">\\[ab = 2 \\times (-5) = -10\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(c) -10</strong></div>
          `
        },
        {
          id: 'W4_A3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Z',
          prompt: '1) Use the addition properties in \\(\\mathbb{Z}\\) to find the result of: \\((-10) + 2 + 10\\)',
          modelSolution: `
            <div class="sol-step"><strong>Given Expression:</strong></div>
            <div class="sol-math">\\[(-10) + 2 + 10\\]</div>
            <div class="sol-step"><strong>Step 1: Commutative Property:</strong></div>
            <div class="sol-math">\\[= (-10) + 10 + 2 \\quad \\text{(Commutative Property)}\\]</div>
            <div class="sol-step"><strong>Step 2: Associative Property:</strong></div>
            <div class="sol-math">\\[= [(-10) + 10] + 2 \\quad \\text{(Associative Property)}\\]</div>
            <div class="sol-step"><strong>Step 3: Additive Inverse Property:</strong></div>
            <div class="sol-step">The sum of an integer and its additive inverse is 0:</div>
            <div class="sol-math">\\[= 0 + 2 \\quad \\text{(Additive Inverse Property)}\\]</div>
            <div class="sol-step"><strong>Step 4: Additive Identity Property:</strong></div>
            <div class="sol-math">\\[= 2 \\quad \\text{(Additive Identity Property)}\\]</div>
            <div class="sol-highlight">The final result is <strong>2</strong></div>
          `
        },
        {
          id: 'W4_A4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution & Order of Operations',
          prompt: '2) If \\(a = 3\\), \\(b = 8\\), \\(c = -7\\). Find in simplest form the value of the expression: \\((2a + b) \\div c\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Substitute the given values:</strong></div>
            <div class="sol-math">\\[(2a + b) \\div c = (2(3) + 8) \\div (-7)\\]</div>
            <div class="sol-step"><strong>Step 2: Perform operations inside parentheses first:</strong></div>
            <div class="sol-math">\\[2 \\times 3 = 6 \\implies 6 + 8 = 14\\]</div>
            <div class="sol-step"><strong>Step 3: Perform division:</strong></div>
            <div class="sol-math">\\[14 \\div (-7) = -2\\]</div>
            <div class="sol-highlight">The simplest form is <strong>-2</strong></div>
          `
        },
        {
          id: 'W4_A5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations with Absolute Values & Division',
          prompt: `
            3) If \\(a = 10\\), \\(b = -5\\). Find the result of:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(|ab|\\) &emsp;&emsp; (2) \\(|b + a|\\) &emsp;&emsp; (3) \\(15 \\div b\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>(1) Find \\(|ab|\\):</strong></div>
            <div class="sol-math">\\[ab = 10 \\times (-5) = -50\\]</div>
            <div class="sol-math">\\[|ab| = |-50| = 50\\]</div>
            <div class="sol-step"><strong>(2) Find \\(|b + a|\\):</strong></div>
            <div class="sol-math">\\[b + a = -5 + 10 = 5\\]</div>
            <div class="sol-math">\\[|b + a| = |5| = 5\\]</div>
            <div class="sol-step"><strong>(3) Find \\(15 \\div b\\):</strong></div>
            <div class="sol-math">\\[15 \\div (-5) = -3\\]</div>
            <div class="sol-highlight">(1) \\(|ab| = \\mathbf{50}\\) &nbsp;|&nbsp; (2) \\(|b + a| = \\mathbf{5}\\) &nbsp;|&nbsp; (3) \\(15 \\div b = \\mathbf{-3}\\)</div>
          `
        }
      ]
    },
    groupB: {
      id: 'groupB',
      title: 'Group (B)',
      badgeName: 'Group (B) • Week 4 Assessment',
      questions: [
        {
          id: 'W4_B1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Integers',
          prompt: '1) \\(-7 - (-1) = \\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(8\\)', isCorrect: false },
            { key: 'b', text: '\\(-8\\)', isCorrect: false },
            { key: 'c', text: '\\(6\\)', isCorrect: false },
            { key: 'd', text: '\\(-6\\)', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Simplify subtracting a negative:</strong></div>
            <div class="sol-math">\\[-7 - (-1) = -7 + 1\\]</div>
            <div class="sol-step"><strong>Step 2: Add integers with different signs:</strong></div>
            <div class="sol-step">Subtract magnitudes \\(7 - 1 = 6\\) with negative sign:</div>
            <div class="sol-math">\\[-7 + 1 = -6\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) -6</strong></div>
          `
        },
        {
          id: 'W4_B2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Absolute Value & Multiplication',
          prompt: '2) If \\(a = |-4|\\) , \\(b = -3\\) . What is the value of \\(ab\\) ?',
          options: [
            { key: 'a', text: '\\(12\\)', isCorrect: false },
            { key: 'b', text: '\\(7\\)', isCorrect: false },
            { key: 'c', text: '\\(-12\\)', isCorrect: true },
            { key: 'd', text: '\\(-7\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Find the value of \\(a\\):</strong></div>
            <div class="sol-math">\\[a = |-4| = 4\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate product \\(ab\\):</strong></div>
            <div class="sol-math">\\[ab = 4 \\times (-3) = -12\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(c) -12</strong></div>
          `
        },
        {
          id: 'W4_B3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Z',
          prompt: '1) Use the addition properties in \\(\\mathbb{Z}\\) to find the result of: \\((-25) + 1 + 25\\)',
          modelSolution: `
            <div class="sol-step"><strong>Given Expression:</strong></div>
            <div class="sol-math">\\[(-25) + 1 + 25\\]</div>
            <div class="sol-step"><strong>Step 1: Commutative Property:</strong></div>
            <div class="sol-math">\\[= (-25) + 25 + 1 \\quad \\text{(Commutative Property)}\\]</div>
            <div class="sol-step"><strong>Step 2: Associative Property:</strong></div>
            <div class="sol-math">\\[= [(-25) + 25] + 1 \\quad \\text{(Associative Property)}\\]</div>
            <div class="sol-step"><strong>Step 3: Additive Inverse Property:</strong></div>
            <div class="sol-math">\\[= 0 + 1 \\quad \\text{(Additive Inverse Property)}\\]</div>
            <div class="sol-step"><strong>Step 4: Additive Identity Property:</strong></div>
            <div class="sol-math">\\[= 1 \\quad \\text{(Additive Identity Property)}\\]</div>
            <div class="sol-highlight">The final result is <strong>1</strong></div>
          `
        },
        {
          id: 'W4_B4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution & Order of Operations',
          prompt: '2) If \\(a = 2\\), \\(b = 5\\), \\(c = -2\\). Find in simplest form the value of the expression: \\((a + 2b) \\div c\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Substitute the given values:</strong></div>
            <div class="sol-math">\\[(a + 2b) \\div c = (2 + 2(5)) \\div (-2)\\]</div>
            <div class="sol-step"><strong>Step 2: Evaluate operations in parentheses:</strong></div>
            <div class="sol-math">\\[2(5) = 10 \\implies 2 + 10 = 12\\]</div>
            <div class="sol-step"><strong>Step 3: Perform division:</strong></div>
            <div class="sol-math">\\[12 \\div (-2) = -6\\]</div>
            <div class="sol-highlight">The simplest form is <strong>-6</strong></div>
          `
        },
        {
          id: 'W4_B5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations with Absolute Values & Division',
          prompt: `
            3) If \\(a = 15\\), \\(b = -2\\). Find the result of:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(|ab|\\) &emsp;&emsp; (2) \\(|b + a|\\) &emsp;&emsp; (3) \\(12 \\div b\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>(1) Find \\(|ab|\\):</strong></div>
            <div class="sol-math">\\[ab = 15 \\times (-2) = -30\\]</div>
            <div class="sol-math">\\[|ab| = |-30| = 30\\]</div>
            <div class="sol-step"><strong>(2) Find \\(|b + a|\\):</strong></div>
            <div class="sol-math">\\[b + a = -2 + 15 = 13\\]</div>
            <div class="sol-math">\\[|b + a| = |13| = 13\\]</div>
            <div class="sol-step"><strong>(3) Find \\(12 \\div b\\):</strong></div>
            <div class="sol-math">\\[12 \\div (-2) = -6\\]</div>
            <div class="sol-highlight">(1) \\(|ab| = \\mathbf{30}\\) &nbsp;|&nbsp; (2) \\(|b + a| = \\mathbf{13}\\) &nbsp;|&nbsp; (3) \\(12 \\div b = \\mathbf{-6}\\)</div>
          `
        }
      ]
    },
    groupC: {
      id: 'groupC',
      title: 'Group (C)',
      badgeName: 'Group (C) • Week 4 Assessment',
      questions: [
        {
          id: 'W4_C1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Integers',
          prompt: '1) \\(-6 - (-1) = \\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(5\\)', isCorrect: false },
            { key: 'b', text: '\\(-5\\)', isCorrect: true },
            { key: 'c', text: '\\(7\\)', isCorrect: false },
            { key: 'd', text: '\\(-7\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Simplify subtracting a negative:</strong></div>
            <div class="sol-math">\\[-6 - (-1) = -6 + 1\\]</div>
            <div class="sol-step"><strong>Step 2: Add integers:</strong></div>
            <div class="sol-math">\\[-6 + 1 = -5\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) -5</strong></div>
          `
        },
        {
          id: 'W4_C2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Absolute Value & Multiplication',
          prompt: '2) If \\(a = |-9|\\) , \\(b = -1\\) . What is the value of \\(ab\\) ?',
          options: [
            { key: 'a', text: '\\(10\\)', isCorrect: false },
            { key: 'b', text: '\\(9\\)', isCorrect: false },
            { key: 'c', text: '\\(-9\\)', isCorrect: true },
            { key: 'd', text: '\\(-10\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Evaluate absolute value:</strong></div>
            <div class="sol-math">\\[a = |-9| = 9\\]</div>
            <div class="sol-step"><strong>Step 2: Multiply \\(a \\times b\\):</strong></div>
            <div class="sol-math">\\[ab = 9 \\times (-1) = -9\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(c) -9</strong></div>
          `
        },
        {
          id: 'W4_C3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Z',
          prompt: '1) Use the addition properties in \\(\\mathbb{Z}\\) to find the result of: \\((-17) + 3 + 17\\)',
          modelSolution: `
            <div class="sol-step"><strong>Given Expression:</strong></div>
            <div class="sol-math">\\[(-17) + 3 + 17\\]</div>
            <div class="sol-step"><strong>Step 1: Commutative Property:</strong></div>
            <div class="sol-math">\\[= (-17) + 17 + 3 \\quad \\text{(Commutative Property)}\\]</div>
            <div class="sol-step"><strong>Step 2: Associative Property:</strong></div>
            <div class="sol-math">\\[= [(-17) + 17] + 3 \\quad \\text{(Associative Property)}\\]</div>
            <div class="sol-step"><strong>Step 3: Additive Inverse Property:</strong></div>
            <div class="sol-math">\\[= 0 + 3 \\quad \\text{(Additive Inverse Property)}\\]</div>
            <div class="sol-step"><strong>Step 4: Additive Identity Property:</strong></div>
            <div class="sol-math">\\[= 3 \\quad \\text{(Additive Identity Property)}\\]</div>
            <div class="sol-highlight">The final result is <strong>3</strong></div>
          `
        },
        {
          id: 'W4_C4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution & Order of Operations',
          prompt: '2) If \\(a = 1\\), \\(b = 7\\), \\(c = -3\\). Find in simplest form the value of the expression: \\((5a + b) \\div c\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Substitute the given values:</strong></div>
            <div class="sol-math">\\[(5a + b) \\div c = (5(1) + 7) \\div (-3)\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate inside parentheses:</strong></div>
            <div class="sol-math">\\[5(1) + 7 = 5 + 7 = 12\\]</div>
            <div class="sol-step"><strong>Step 3: Perform division:</strong></div>
            <div class="sol-math">\\[12 \\div (-3) = -4\\]</div>
            <div class="sol-highlight">The simplest form is <strong>-4</strong></div>
          `
        },
        {
          id: 'W4_C5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Operations with Absolute Values & Division',
          prompt: `
            3) If \\(a = 12\\), \\(b = -4\\). Find the result of:
            <div style="margin-top: 0.6rem; font-size: 1.15rem; font-weight: 700;">
              (1) \\(|ab|\\) &emsp;&emsp; (2) \\(|a + b|\\) &emsp;&emsp; (3) \\(24 \\div b\\)
            </div>
          `,
          modelSolution: `
            <div class="sol-step"><strong>(1) Find \\(|ab|\\):</strong></div>
            <div class="sol-math">\\[ab = 12 \\times (-4) = -48\\]</div>
            <div class="sol-math">\\[|ab| = |-48| = 48\\]</div>
            <div class="sol-step"><strong>(2) Find \\(|a + b|\\):</strong></div>
            <div class="sol-math">\\[a + b = 12 + (-4) = 8\\]</div>
            <div class="sol-math">\\[|a + b| = |8| = 8\\]</div>
            <div class="sol-step"><strong>(3) Find \\(24 \\div b\\):</strong></div>
            <div class="sol-math">\\[24 \\div (-4) = -6\\]</div>
            <div class="sol-highlight">(1) \\(|ab| = \\mathbf{48}\\) &nbsp;|&nbsp; (2) \\(|a + b| = \\mathbf{8}\\) &nbsp;|&nbsp; (3) \\(24 \\div b = \\mathbf{-6}\\)</div>
          `
        }
      ]
    }
  },

  // ========================================================================
  // WEEK 5: OPERATIONS IN RATIONAL NUMBERS (Q) & INVERSES
  // ========================================================================
  week5: {
    id: 'week5',
    title: 'Week 5: Operations in Rational Numbers (Q) & Inverses',
    stageName: 'Weekly Assessment – Week 5 (Rational Numbers Q)',
    groupA: {
      id: 'groupA',
      title: 'Group (A)',
      badgeName: 'Group (A) • Week 5 Assessment',
      questions: [
        {
          id: 'W5_A1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Rational Numbers',
          prompt: '1) The result of subtracting \\(\\frac{3}{5}\\) from \\(\\frac{7}{10}\\) equal to \\(\\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(\\frac{4}{5}\\)', isCorrect: false },
            { key: 'b', text: '\\(\\frac{1}{5}\\)', isCorrect: false },
            { key: 'c', text: '\\(\\frac{1}{10}\\)', isCorrect: true },
            { key: 'd', text: '\\(-\\frac{4}{5}\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Set up the subtraction:</strong></div>
            <div class="sol-step">"Subtracting \\(A\\) from \\(B\\)" means: \\(B - A\\):</div>
            <div class="sol-math">\\[\\frac{7}{10} - \\frac{3}{5}\\]</div>
            <div class="sol-step"><strong>Step 2: Unify denominators (common denominator 10):</strong></div>
            <div class="sol-math">\\[\\frac{3}{5} = \\frac{3 \\times 2}{5 \\times 2} = \\frac{6}{10}\\]</div>
            <div class="sol-step"><strong>Step 3: Subtract numerators:</strong></div>
            <div class="sol-math">\\[\\frac{7}{10} - \\frac{6}{10} = \\frac{7 - 6}{10} = \\frac{1}{10}\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(c) \\(\\frac{1}{10}\\)</strong></div>
          `
        },
        {
          id: 'W5_A2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Multiplicative Inverse of a Mixed Number',
          prompt: '2) What is the multiplicative inverse of \\(3\\frac{1}{2}\\) ?',
          options: [
            { key: 'a', text: '\\(\\frac{7}{2}\\)', isCorrect: false },
            { key: 'b', text: '\\(2\\frac{1}{3}\\)', isCorrect: false },
            { key: 'c', text: '\\(-\\frac{2}{7}\\)', isCorrect: false },
            { key: 'd', text: '\\(\\frac{2}{7}\\)', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Convert the mixed number into an improper fraction:</strong></div>
            <div class="sol-math">\\[3\\frac{1}{2} = \\frac{3 \\times 2 + 1}{2} = \\frac{7}{2}\\]</div>
            <div class="sol-step"><strong>Step 2: Find the multiplicative inverse (reciprocal):</strong></div>
            <div class="sol-step">Invert numerator and denominator:</div>
            <div class="sol-math">\\[\\text{Multiplicative Inverse of } \\frac{7}{2} = \\frac{2}{7}\\]</div>
            <div class="sol-step"><em>Check:</em> \\(\\frac{7}{2} \\times \\frac{2}{7} = 1\\) &check;</div>
            <div class="sol-highlight">The correct answer is <strong>(d) \\(\\frac{2}{7}\\)</strong></div>
          `
        },
        {
          id: 'W5_A3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Q',
          prompt: '1) Using properties of addition in \\(\\mathbb{Q}\\) to find the result of: \\(\\frac{1}{4} + \\frac{2}{10} + \\frac{-1}{4} + \\frac{-4}{10}\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Given Expression:</strong></div>
            <div class="sol-math">\\[\\frac{1}{4} + \\frac{2}{10} + \\frac{-1}{4} + \\frac{-4}{10}\\]</div>
            <div class="sol-step"><strong>Step 1: Commutative & Associative Properties:</strong></div>
            <div class="sol-step">Group fractions with common denominators:</div>
            <div class="sol-math">\\[= \\left(\\frac{1}{4} + \\frac{-1}{4}\right) + \\left(\\frac{2}{10} + \\frac{-4}{10}\right)\\]</div>
            <div class="sol-step"><strong>Step 2: Additive Inverse Property:</strong></div>
            <div class="sol-step">The sum of a number and its additive inverse is 0: \\(\\frac{1}{4} + \\frac{-1}{4} = 0\\):</div>
            <div class="sol-math">\\[= 0 + \\left(\\frac{2 + (-4)}{10}\right) = 0 + \\left(\\frac{-2}{10}\right)\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify to lowest terms:</strong></div>
            <div class="sol-math">\\[= \\frac{-2}{10} = \\frac{-2 \\div 2}{10 \\div 2} = -\\frac{1}{5}\\]</div>
            <div class="sol-highlight">The result in simplest form is <strong>\\(-\\frac{1}{5}\\)</strong></div>
          `
        },
        {
          id: 'W5_A4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution with Rational Numbers',
          prompt: '2) If \\(x = \\frac{-2}{4}\\), \\(y = \\frac{4}{9}\\), find the result of \\(2x + y\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Simplify \\(x\\):</strong></div>
            <div class="sol-math">\\[x = \\frac{-2}{4} = -\\frac{1}{2}\\]</div>
            <div class="sol-step"><strong>Step 2: Calculate \\(2x\\):</strong></div>
            <div class="sol-math">\\[2x = 2 \\times \\left(-\\frac{1}{2}\\right) = -1 = -\\frac{9}{9}\\]</div>
            <div class="sol-step"><strong>Step 3: Add \\(y = \\frac{4}{9}\\):</strong></div>
            <div class="sol-math">\\[2x + y = -1 + \\frac{4}{9} = \\frac{-9 + 4}{9} = -\\frac{5}{9}\\]</div>
            <div class="sol-highlight">The result in simplest form is <strong>\\(-\\frac{5}{9}\\)</strong></div>
          `
        },
        {
          id: 'W5_A5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Order of Operations with Rational Numbers',
          prompt: '3) Find in its simplest form the value of: \\(\\frac{4}{10} \\div \\left(\\frac{-1}{5} + \\frac{3}{5}\\right)\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Evaluate operation inside parentheses:</strong></div>
            <div class="sol-math">\\[\\frac{-1}{5} + \\frac{3}{5} = \\frac{-1 + 3}{5} = \\frac{2}{5}\\]</div>
            <div class="sol-step"><strong>Step 2: Simplify \\(\\frac{4}{10}\\):</strong></div>
            <div class="sol-math">\\[\\frac{4}{10} = \\frac{2}{5}\\]</div>
            <div class="sol-step"><strong>Step 3: Perform division (multiply by reciprocal):</strong></div>
            <div class="sol-math">\\[\\frac{2}{5} \\div \\frac{2}{5} = \\frac{2}{5} \\times \\frac{5}{2} = 1\\]</div>
            <div class="sol-highlight">The value in simplest form is <strong>1</strong></div>
          `
        }
      ]
    },
    groupB: {
      id: 'groupB',
      title: 'Group (B)',
      badgeName: 'Group (B) • Week 5 Assessment',
      questions: [
        {
          id: 'W5_B1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Rational Numbers',
          prompt: '1) The result of subtracting \\(\\frac{1}{4}\\) from \\(\\frac{3}{4}\\) equal to \\(\\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(\\frac{5}{4}\\)', isCorrect: false },
            { key: 'b', text: '\\(\\frac{1}{2}\\)', isCorrect: true },
            { key: 'c', text: '\\(\\frac{1}{4}\\)', isCorrect: false },
            { key: 'd', text: '\\(-\\frac{1}{2}\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Set up subtraction \\(B - A\\):</strong></div>
            <div class="sol-math">\\[\\frac{3}{4} - \\frac{1}{4}\\]</div>
            <div class="sol-step"><strong>Step 2: Subtract numerators with common denominator 4:</strong></div>
            <div class="sol-math">\\[\\frac{3 - 1}{4} = \\frac{2}{4}\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify by dividing by 2:</strong></div>
            <div class="sol-math">\\[\\frac{2 \\div 2}{4 \\div 2} = \\frac{1}{2}\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(b) \\(\\frac{1}{2}\\)</strong></div>
          `
        },
        {
          id: 'W5_B2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Multiplicative Inverse of a Mixed Number',
          prompt: '2) What is the multiplicative inverse of \\(4\\frac{1}{2}\\) ?',
          options: [
            { key: 'a', text: '\\(\\frac{9}{2}\\)', isCorrect: false },
            { key: 'b', text: '\\(2\\frac{1}{4}\\)', isCorrect: false },
            { key: 'c', text: '\\(-\\frac{2}{9}\\)', isCorrect: false },
            { key: 'd', text: '\\(\\frac{2}{9}\\)', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Convert mixed number into improper fraction:</strong></div>
            <div class="sol-math">\\[4\\frac{1}{2} = \\frac{4 \\times 2 + 1}{2} = \\frac{9}{2}\\]</div>
            <div class="sol-step"><strong>Step 2: Find reciprocal (swap numerator and denominator):</strong></div>
            <div class="sol-math">\\[\\text{Multiplicative Inverse of } \\frac{9}{2} = \\frac{2}{9}\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) \\(\\frac{2}{9}\\)</strong></div>
          `
        },
        {
          id: 'W5_B3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Q',
          prompt: '1) Using properties of addition in \\(\\mathbb{Q}\\) to find the result of: \\(\\frac{1}{3} + \\frac{2}{6} + \\frac{-1}{3} + \\frac{-4}{6}\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Commutative & Associative Properties:</strong></div>
            <div class="sol-step">Group fractions with matching denominators:</div>
            <div class="sol-math">\\[= \\left(\\frac{1}{3} + \\frac{-1}{3}\\right) + \\left(\\frac{2}{6} + \\frac{-4}{6}\\right)\\]</div>
            <div class="sol-step"><strong>Step 2: Additive Inverse Property:</strong></div>
            <div class="sol-math">\\[= 0 + \\left(\\frac{2 + (-4)}{6}\\right) = 0 + \\left(\\frac{-2}{6}\\right)\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify fraction to lowest terms:</strong></div>
            <div class="sol-math">\\[= \\frac{-2}{6} = \\frac{-2 \\div 2}{6 \\div 2} = -\\frac{1}{3}\\]</div>
            <div class="sol-highlight">The result in simplest form is <strong>\\(-\\frac{1}{3}\\)</strong></div>
          `
        },
        {
          id: 'W5_B4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution with Rational Numbers',
          prompt: '2) If \\(x = \\frac{-2}{5}\\), \\(y = \\frac{6}{5}\\), find the result of \\(3x + y\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate \\(3x\\):</strong></div>
            <div class="sol-math">\\[3x = 3 \\times \\left(\\frac{-2}{5}\\right) = \\frac{-6}{5}\\]</div>
            <div class="sol-step"><strong>Step 2: Add \\(y = \\frac{6}{5}\\):</strong></div>
            <div class="sol-math">\\[3x + y = \\frac{-6}{5} + \\frac{6}{5} = \\frac{-6 + 6}{5} = \\frac{0}{5} = 0\\]</div>
            <div class="sol-highlight">The result in simplest form is <strong>0</strong></div>
          `
        },
        {
          id: 'W5_B5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Order of Operations with Rational Numbers',
          prompt: '3) Find in its simplest form the value of: \\(\\left(\\frac{5}{7} + \\frac{1}{7}\\right) \\div \\frac{12}{14}\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate inside parentheses:</strong></div>
            <div class="sol-math">\\[\\frac{5}{7} + \\frac{1}{7} = \\frac{5 + 1}{7} = \\frac{6}{7}\\]</div>
            <div class="sol-step"><strong>Step 2: Simplify the divisor \\(\\frac{12}{14}\\):</strong></div>
            <div class="sol-math">\\[\\frac{12}{14} = \\frac{12 \\div 2}{14 \\div 2} = \\frac{6}{7}\\]</div>
            <div class="sol-step"><strong>Step 3: Perform division:</strong></div>
            <div class="sol-math">\\[\\frac{6}{7} \\div \\frac{6}{7} = 1\\]</div>
            <div class="sol-highlight">The value in simplest form is <strong>1</strong></div>
          `
        }
      ]
    },
    groupC: {
      id: 'groupC',
      title: 'Group (C)',
      badgeName: 'Group (C) • Week 5 Assessment',
      questions: [
        {
          id: 'W5_C1',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 1,
          title: 'Subtraction of Rational Numbers',
          prompt: '1) The result of subtracting \\(\\frac{1}{7}\\) from \\(\\frac{8}{7}\\) equal to \\(\\dots\\dots\\dots\\dots\\)',
          options: [
            { key: 'a', text: '\\(1\\)', isCorrect: true },
            { key: 'b', text: '\\(\\frac{9}{7}\\)', isCorrect: false },
            { key: 'c', text: '\\(-1\\)', isCorrect: false },
            { key: 'd', text: '\\(-\\frac{9}{7}\\)', isCorrect: false }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Set up subtraction \\(B - A\\):</strong></div>
            <div class="sol-math">\\[\\frac{8}{7} - \\frac{1}{7}\\]</div>
            <div class="sol-step"><strong>Step 2: Subtract numerators with common denominator 7:</strong></div>
            <div class="sol-math">\\[\\frac{8 - 1}{7} = \\frac{7}{7} = 1\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(a) 1</strong></div>
          `
        },
        {
          id: 'W5_C2',
          type: 'mcq',
          category: 'First: Choose the correct answer',
          questionNum: 2,
          title: 'Multiplicative Inverse of a Mixed Number',
          prompt: '2) What is the multiplicative inverse of \\(7\\frac{1}{2}\\) ?',
          options: [
            { key: 'a', text: '\\(\\frac{15}{2}\\)', isCorrect: false },
            { key: 'b', text: '\\(2\\frac{1}{7}\\)', isCorrect: false },
            { key: 'c', text: '\\(-\\frac{15}{7}\\)', isCorrect: false },
            { key: 'd', text: '\\(\\frac{2}{15}\\)', isCorrect: true }
          ],
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Convert mixed number into improper fraction:</strong></div>
            <div class="sol-math">\\[7\\frac{1}{2} = \\frac{7 \\times 2 + 1}{2} = \\frac{15}{2}\\]</div>
            <div class="sol-step"><strong>Step 2: Multiplicative inverse (reciprocal):</strong></div>
            <div class="sol-math">\\[\\text{Multiplicative Inverse of } \\frac{15}{2} = \\frac{2}{15}\\]</div>
            <div class="sol-highlight">The correct answer is <strong>(d) \\(\\frac{2}{15}\\)</strong></div>
          `
        },
        {
          id: 'W5_C3',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 3,
          title: 'Properties of Addition in Q',
          prompt: '1) Using properties of addition in \\(\\mathbb{Q}\\) to find: \\(\\frac{-4}{3} + \\frac{-1}{9} + \\frac{5}{3} + \\frac{1}{9}\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Commutative & Associative Properties:</strong></div>
            <div class="sol-step">Group terms with denominator 3 and denominator 9 together:</div>
            <div class="sol-math">\\[= \\left(\\frac{-4}{3} + \\frac{5}{3}\right) + \\left(\\frac{-1}{9} + \\frac{1}{9}\right)\\]</div>
            <div class="sol-step"><strong>Step 2: Additive Inverse Property:</strong></div>
            <div class="sol-step">Notice \\(\\frac{-1}{9} + \\frac{1}{9} = 0\\):</div>
            <div class="sol-math">\\[= \\left(\\frac{-4 + 5}{3}\right) + 0\\]</div>
            <div class="sol-step"><strong>Step 3: Additive Identity:</strong></div>
            <div class="sol-math">\\[= \\frac{1}{3} + 0 = \\frac{1}{3}\\]</div>
            <div class="sol-highlight">The result in simplest form is <strong>\\(\\frac{1}{3}\\)</strong></div>
          `
        },
        {
          id: 'W5_C4',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 4,
          title: 'Algebraic Substitution with Rational Numbers',
          prompt: '2) If \\(x = \\frac{-2}{7}\\), \\(y = \\frac{8}{7}\\), find the value of: \\(4x + y\\) in its simplest form.',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate \\(4x\\):</strong></div>
            <div class="sol-math">\\[4x = 4 \\times \\left(\\frac{-2}{7}\\right) = \\frac{-8}{7}\\]</div>
            <div class="sol-step"><strong>Step 2: Add \\(y = \\frac{8}{7}\\):</strong></div>
            <div class="sol-math">\\[4x + y = \\frac{-8}{7} + \\frac{8}{7} = \\frac{-8 + 8}{7} = \\frac{0}{7} = 0\\]</div>
            <div class="sol-highlight">The simplest form is <strong>0</strong></div>
          `
        },
        {
          id: 'W5_C5',
          type: 'problem',
          category: 'Second: Answer the following',
          questionNum: 5,
          title: 'Order of Operations with Rational Numbers',
          prompt: '3) Find in its simplest form the value of: \\(\\left(\\frac{3}{11} + \\frac{1}{11}\\right) \\div \\frac{4}{33}\\)',
          modelSolution: `
            <div class="sol-step"><strong>Step 1: Calculate operation inside parentheses:</strong></div>
            <div class="sol-math">\\[\\frac{3}{11} + \\frac{1}{11} = \\frac{3 + 1}{11} = \\frac{4}{11}\\]</div>
            <div class="sol-step"><strong>Step 2: Perform division (multiply by reciprocal):</strong></div>
            <div class="sol-math">\\[\\frac{4}{11} \\div \\frac{4}{33} = \\frac{4}{11} \\times \\frac{33}{4}\\]</div>
            <div class="sol-step"><strong>Step 3: Simplify by cross-cancelling:</strong></div>
            <div class="sol-math">\\[\\frac{4 \\div 4}{11} \\times \\frac{33}{4 \\div 4} = \\frac{33}{11} = 3\\]</div>
            <div class="sol-highlight">The value in simplest form is <strong>3</strong></div>
          `
        }
      ]
    }
  }
};
