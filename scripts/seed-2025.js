const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── GATE MT 2025 — All Questions ────────────────────────────────────────────
const questionsData = [

  // ── SECTION 1: GENERAL APTITUDE ──────────────────────────────────────────

  {
    subject: "Engineering Physics",
    topic: "Verbal Ability",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Despite his initial hesitation, Rehman's ________ to contribute to the success of the project never wavered.\nSelect the most appropriate option to complete the above sentence.",
    options: [
      { id: "A", text: "ambivalence" },
      { id: "B", text: "satisfaction" },
      { id: "C", text: "resolve" },
      { id: "D", text: "revolve" }
    ],
    correct_options: ["C"],
    explanation: "The contextual contrast introduced by \"Despite his initial hesitation\" requires a word that implies firm determination or intentional commitment. \"Resolve\" serves as a noun meaning a firm determination to do something, which perfectly satisfies the semantic requirements of the sentence."
  },

  {
    subject: "Engineering Physics",
    topic: "Verbal Ability",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Bird : Nest :: Bee : ________\nSelect the correct option to complete the analogy.",
    options: [
      { id: "A", text: "Kennel" },
      { id: "B", text: "Hammock" },
      { id: "C", text: "Hive" },
      { id: "D", text: "Lair" }
    ],
    correct_options: ["C"],
    explanation: "This is a standard habitat analogy. A bird lives or builds a \"Nest\", and a bee naturally lives or builds a \"Hive\"."
  },

  {
    subject: "Engineering Mathematics",
    topic: "Functions",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "If $Pe^{x} = Qe^{-x}$ for all real values of $x$, which one of the following statements is true?",
    options: [
      { id: "A", text: "$P = Q = 0$" },
      { id: "B", text: "$P = Q = 1$" },
      { id: "C", text: "$P = 1$; $Q = -1$" },
      { id: "D", text: "$\\frac{P}{Q} = 0$" }
    ],
    correct_options: ["A"],
    explanation: "For the equation to hold true *for all real values of $x$*, we can test specific values.\nIf $x = 0$: $P(1) = Q(1) \\implies P = Q$.\nIf $x = 1$: $Pe = Qe^{-1} \\implies Pe = Pe^{-1}$.\nSince $e \\neq e^{-1}$, the only scalar that satisfies this as an identity for all $x$ is $P = 0$, which consequently means $Q = 0$. Thus, $P = Q = 0$."
  },

  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Let $p_{1}$ and $p_{2}$ denote two arbitrary prime numbers. Which one of the following statements is correct for all values of $p_{1}$ and $p_{2}$?",
    options: [
      { id: "A", text: "$p_{1} + p_{2}$ is not a prime number." },
      { id: "B", text: "$p_{1} p_{2}$ is not a prime number." },
      { id: "C", text: "$p_{1} + p_{2} + 1$ is a prime number." },
      { id: "D", text: "$p_{1} p_{2} + 1$ is a prime number." }
    ],
    correct_options: ["B"],
    explanation: "The product of any two prime numbers $p_{1}$ and $p_{2}$ will always yield a composite number because it possesses at minimum four distinct factors: $1$, $p_{1}$, $p_{2}$, and $p_{1}p_{2}$ itself. Hence, $p_{1}p_{2}$ can never be a prime number."
  },

  {
    subject: "Engineering Physics",
    topic: "Logical Inference",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Based only on the conversation below, identify the logically correct inference:\n\n\"Even if I had known that you were in the hospital, I would not have gone there to see you\", Ramya told Josephine.",
    options: [
      { id: "A", text: "Ramya knew that Josephine was in the hospital." },
      { id: "B", text: "Ramya did not know that Josephine was in the hospital." },
      { id: "C", text: "Ramya and Josephine were once close friends; but now, they are not." },
      { id: "D", text: "Josephine was in the hospital due to an injury to her leg." }
    ],
    correct_options: ["B"],
    explanation: "The phrase \"Even if I had known...\" utilizes a past counterfactual subjunctive conditional structure. This grammatical tense explicitly conveys that the underlying premise is false in reality — meaning Ramya did *not* know at that time that Josephine was in the hospital."
  },

  {
    subject: "Engineering Mathematics",
    topic: "Analytical Reasoning",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "If $IMAGE$ and $FIELD$ are coded as $FHBNJ$ and $EMFJG$ respectively then, which one among the given options is the most appropriate code for $BEACH$?",
    options: [
      { id: "A", text: "CEADP" },
      { id: "B", text: "IDBFC" },
      { id: "C", text: "JGIBC" },
      { id: "D", text: "IBCEC" }
    ],
    correct_options: ["D"],
    explanation: "By tracing the letter-shift pattern from the given coded words:\n$I \\rightarrow F$, $M \\rightarrow H$, $A \\rightarrow B$, $G \\rightarrow N$, $E \\rightarrow J$\nApplying the same shift array to $BEACH$:\n$B \\rightarrow I$, $E \\rightarrow B$, $A \\rightarrow C$, $C \\rightarrow E$, $H \\rightarrow C$\nThis uniquely maps to Option D: $IBCEC$."
  },

  {
    subject: "Engineering Mathematics",
    topic: "Coding and Logic Flow",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Which one of the following options is correct for the given data in the table?\n\n| Iteration ($i$) | 0 | 1 | 2 | 3 |\n|---|---|---|---|---|\n| **Input ($I$)** | 20 | -4 | 10 | 15 |\n| **Output ($X$)** | 20 | 16 | 26 | 41 |\n| **Output ($Y$)** | 20 | -80 | -800 | -12000 |",
    options: [
      { id: "A", text: "$X(i) = X(i-1) + I(i)$; $Y(i) = Y(i-1) \\cdot I(i)$; $i > 0$" },
      { id: "B", text: "$X(i) = X(i-1) \\cdot I(i)$; $Y(i) = Y(i-1) + I(i)$; $i > 0$" },
      { id: "C", text: "$X(i) = X(i-1) \\cdot I(i)$; $Y(i) = Y(i-1) \\cdot I(i)$; $i > 0$" },
      { id: "D", text: "$X(i) = X(i-1) + I(i)$; $Y(i) = Y(i-1) \\cdot I(i-1)$; $i > 0$" }
    ],
    correct_options: ["A"],
    explanation: "Testing Iteration 1 ($i=1$):\n- $X(1) = X(0) + I(1) = 20 + (-4) = 16$ ✓\n- $Y(1) = Y(0) \\times I(1) = 20 \\times (-4) = -80$ ✓\n\nTesting Iteration 2 ($i=2$):\n- $X(2) = X(1) + I(2) = 16 + 10 = 26$ ✓\n- $Y(2) = Y(1) \\times I(2) = -80 \\times 10 = -800$ ✓\n\nThis perfectly satisfies Option A."
  },

  // ── SECTION 2: METALLURGICAL ENGINEERING (CORE) ───────────────────────────

  {
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following matrices has eigenvalues 1 and 6?",
    options: [
      { id: "A", text: "$\\begin{bmatrix} 5 & -2 \\\\ -2 & 2 \\end{bmatrix}$" },
      { id: "B", text: "$\\begin{bmatrix} 3 & -1 \\\\ -2 & 2 \\end{bmatrix}$" },
      { id: "C", text: "$\\begin{bmatrix} 3 & -1 \\\\ -1 & 2 \\end{bmatrix}$" },
      { id: "D", text: "$\\begin{bmatrix} 2 & -1 \\\\ -1 & 3 \\end{bmatrix}$" }
    ],
    correct_options: ["A"],
    explanation: "Two key eigenvalue properties:\n1. $\\text{Trace (sum of eigenvalues)} = 1 + 6 = 7$\n2. $\\text{Determinant (product of eigenvalues)} = 1 \\times 6 = 6$\n\nFor Option A:\n- $\\text{Trace} = 5 + 2 = 7$ ✓\n- $\\text{Det} = (5)(2) - (-2)(-2) = 10 - 4 = 6$ ✓\n\nThus, Option A satisfies both criteria."
  },

  {
    subject: "Thermodynamics",
    topic: "Thermodynamic Potentials",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "For an isobaric process, the heat transferred is equal to the change in ________ of the system.",
    options: [
      { id: "A", text: "enthalpy" },
      { id: "B", text: "entropy" },
      { id: "C", text: "Helmholtz free energy" },
      { id: "D", text: "Gibbs free energy" }
    ],
    correct_options: ["A"],
    explanation: "By definition: $dH = dU + PdV + VdP$. From the First Law: $dQ = dU + PdV$.\nSubstituting: $dH = dQ + VdP$.\nUnder an isobaric process ($dP = 0$): $dH = dQ_p$.\nTherefore, heat transferred at constant pressure equals the change in enthalpy."
  },

  {
    subject: "Phase Transformations",
    topic: "Crystallographic Defects",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Match each crystal defect in Column I with the corresponding dimensional type in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Edge dislocation | 1. Zero-dimensional defect |\n| Q. Stacking fault | 2. One-dimensional defect |\n| R. Frenkel defect | 3. Two-dimensional defect |\n| S. Porosity | 4. Three-dimensional defect |",
    options: [
      { id: "A", text: "P-3, Q-4, R-2, S-1" },
      { id: "B", text: "P-3, Q-4, R-1, S-2" },
      { id: "C", text: "P-2, Q-3, R-1, S-4" },
      { id: "D", text: "P-2, Q-4, R-3, S-1" }
    ],
    correct_options: ["C"],
    explanation: "- **R. Frenkel defect** → Point defect (0-D) → R-1\n- **P. Edge dislocation** → Line defect (1-D) → P-2\n- **Q. Stacking fault** → Planar/surface defect (2-D) → Q-3\n- **S. Porosity** → Bulk volumetric void (3-D) → S-4\n\nThis mapping corresponds to Option C."
  },

  {
    subject: "Thermodynamics",
    topic: "Fluid Mechanics",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "At high temperatures, which one of the following empirical expressions correctly describes the variation of dynamic viscosity $\\mu$ of a Newtonian liquid with absolute temperature $T$? (Given: $A$ and $B$ are positive constants)",
    options: [
      { id: "A", text: "$\\mu = A + BT$" },
      { id: "B", text: "$\\mu = A \\exp\\left(-\\frac{B}{T}\\right)$" },
      { id: "C", text: "$\\mu = A \\exp(BT)$" },
      { id: "D", text: "$\\mu = A \\exp\\left(\\frac{B}{T}\\right)$" }
    ],
    correct_options: ["D"],
    explanation: "The temperature dependence of dynamic viscosity in liquid metals and slags follows an Arrhenius-type thermal activation model:\n\n$$\\mu = A \\exp\\left(\\frac{E_{\\mu}}{RT}\\right)$$\n\nwhere $E_{\\mu}$ is the activation energy for viscous flow. This matches the algebraic functional form of Option D."
  },

  {
    subject: "Thermodynamics",
    topic: "State Functions",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following is an intensive property?",
    options: [
      { id: "A", text: "Chemical potential" },
      { id: "B", text: "Volume" },
      { id: "C", text: "Mass" },
      { id: "D", text: "Entropy" }
    ],
    correct_options: ["A"],
    explanation: "An intensive property is independent of the size or amount of the system. Volume, mass, and total entropy all scale with the quantity of material (extensive properties). Chemical potential ($\\mu_i = \\partial G / \\partial n_i$) is a partial molar quantity and is therefore intensive."
  },

  {
    subject: "Ferrous Alloys",
    topic: "Extraction Process Flowsheets",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Hot metal from a blast furnace is treated with mill scale prior to oxygen steelmaking for ________.",
    options: [
      { id: "A", text: "dephosphorization" },
      { id: "B", text: "decarburization" },
      { id: "C", text: "desulphurization" },
      { id: "D", text: "desiliconization" }
    ],
    correct_options: ["D"],
    explanation: "Mill scale ($\\text{Fe}_2\\text{O}_3$/$\\text{Fe}_3\\text{O}_4$) acts as a solid oxidizing agent. Silicon has a much higher affinity for oxygen than carbon or iron at hot metal treatment temperatures, reacting preferentially to form silica slag:\n\n$$\\text{Si} + 2\\text{FeO} \\rightarrow \\text{SiO}_2 + 2\\text{Fe}$$\n\nThis operational pre-treatment step is called desiliconization."
  },

  {
    subject: "Characterisation Techniques",
    topic: "Optical Microscopy",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "In optical microscopy, which one of the following combinations of wavelength ($\\lambda$) and numerical aperture ($NA$) provides the best spatial resolution?",
    options: [
      { id: "A", text: "$\\lambda = 400\\text{ nm}$ and $NA = 1.0$" },
      { id: "B", text: "$\\lambda = 600\\text{ nm}$ and $NA = 1.2$" },
      { id: "C", text: "$\\lambda = 400\\text{ nm}$ and $NA = 1.2$" },
      { id: "D", text: "$\\lambda = 600\\text{ nm}$ and $NA = 1.0$" }
    ],
    correct_options: ["C"],
    explanation: "According to Abbe's resolution limit equation, the minimum resolvable distance $d$ is:\n\n$$d = \\frac{0.61\\lambda}{NA}$$\n\nTo attain the best (smallest) resolution limit $d$, we must **minimize $\\lambda$** and **maximize $NA$**. Hence, $\\lambda = 400\\text{ nm}$ and $NA = 1.2$ gives optimal resolution."
  },

  {
    subject: "Phase Transformations",
    topic: "Crystal Structure",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "The coordination number for an octahedral site in pure copper is ________.",
    options: [
      { id: "A", text: "4" },
      { id: "B", text: "6" },
      { id: "C", text: "8" },
      { id: "D", text: "12" }
    ],
    correct_options: ["B"],
    explanation: "Pure copper crystallizes in a face-centered cubic (FCC) structure. In any FCC lattice, an octahedral interstitial site is symmetrically surrounded by **6** nearest-neighbor host atoms, giving it a coordination number of 6."
  },

  {
    subject: "Thermodynamics",
    topic: "Solution Models",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Consider the following gas-phase reaction:\n\n$$2\\text{SO}_{2} + \\text{O}_{2} \\rightleftharpoons 2\\text{SO}_{3}$$\n\nIf the enthalpy of reaction is negative, which one of the following conditions promotes a higher equilibrium concentration of $\\text{SO}_{3}$?",
    options: [
      { id: "A", text: "Higher pressure and higher temperature" },
      { id: "B", text: "Higher pressure and lower temperature" },
      { id: "C", text: "Lower pressure and higher temperature" },
      { id: "D", text: "Lower pressure and lower temperature" }
    ],
    correct_options: ["B"],
    explanation: "Applying Le Chatelier's Principle:\n\n1. **Temperature:** Since the forward reaction is exothermic ($\\Delta H < 0$), lowering the temperature shifts equilibrium forward, favouring $\\text{SO}_3$ production.\n2. **Pressure:** The forward reaction reduces total gas moles ($3 \\rightarrow 2$ moles). Increasing pressure shifts the system towards fewer gas moles, promoting $\\text{SO}_3$.\n\nTherefore, higher pressure and lower temperature (Option B) is correct."
  },

  {
    subject: "Ferrous Alloys",
    topic: "Extraction Process Flowsheets",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following slag components is responsible for the oxidizing power of steelmaking slags?",
    options: [
      { id: "A", text: "$\\text{SiO}_2$" },
      { id: "B", text: "$\\text{CaO}$" },
      { id: "C", text: "$\\text{MgO}$" },
      { id: "D", text: "$\\text{FeO}$" }
    ],
    correct_options: ["D"],
    explanation: "Iron(II) oxide ($\\text{FeO}$) acts as the primary oxygen transfer carrier between steelmaking slags and the underlying liquid metal bath. Higher concentrations of $\\text{FeO}$ inside liquid slag directly increase its aggregate oxidizing capacity."
  },

  {
    subject: "Mechanical Properties",
    topic: "Grain Boundary Strengthening",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Two randomly oriented polycrystalline copper samples with average grain sizes of $10\\ \\mu\\text{m}$ (Sample A) and $100\\ \\mu\\text{m}$ (Sample B) were tested at room temperature. Let $E$ denote Young's modulus and $YS$ denote yield strength. Which one of the following statements is CORRECT?",
    options: [
      { id: "A", text: "$E_A > E_B$ and $YS_A > YS_B$" },
      { id: "B", text: "$E_A = E_B$ and $YS_A < YS_B$" },
      { id: "C", text: "$E_A > E_B$ and $YS_A = YS_B$" },
      { id: "D", text: "$E_A = E_B$ and $YS_A > YS_B$" }
    ],
    correct_options: ["D"],
    explanation: "**Young's Modulus ($E$):** An intrinsic, structure-insensitive elastic property; it does not change with grain size. Therefore $E_A = E_B$.\n\n**Yield Strength ($YS$):** Follows the Hall-Petch relationship:\n$$YS \\propto d^{-1/2}$$\nSmaller grain size (Sample A: $10\\ \\mu\\text{m}$) yields higher strength. Therefore $YS_A > YS_B$.\n\nOption D is correct."
  },

  {
    subject: "Casting",
    topic: "Gating Systems",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "In metal casting, which one of the following gating ratios (sprue : runner : gate area ratio) represents a non-pressurized gating system?",
    options: [
      { id: "A", text: "1 : 2 : 3" },
      { id: "B", text: "3 : 2 : 1" },
      { id: "C", text: "4 : 3 : 1" },
      { id: "D", text: "5 : 4 : 1" }
    ],
    correct_options: ["A"],
    explanation: "A **non-pressurized** gating system features an expanding cross-sectional flow path where the choke point is at the sprue base, and channel areas increase progressively:\n$$A_{\\text{sprue}} < A_{\\text{runner}} < A_{\\text{gate}}$$\nThis minimises turbulence and corresponds to ratio **1 : 2 : 3**.\n\nA pressurized system has a converging flow path (e.g., 3:2:1), where the gate is the choke."
  },

  {
    subject: "Phase Diagrams",
    topic: "Invariant Reactions",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "In the Fe-C system, the invariant reaction $\\text{Liquid} + \\delta \\rightleftharpoons \\gamma$ takes place at $1493^\\circ\\text{C}$. This type of reaction is called a:",
    options: [
      { id: "A", text: "eutectic" },
      { id: "B", text: "eutectoid" },
      { id: "C", text: "peritectic" },
      { id: "D", text: "monotectic" }
    ],
    correct_options: ["C"],
    explanation: "An invariant reaction where a **liquid phase** reacts with a **solid phase** upon cooling to form a **single new solid phase** ($\\text{Liquid} + \\alpha \\rightarrow \\beta$) is defined as a **peritectic reaction**.\n\n- Eutectic: one liquid → two solids\n- Eutectoid: one solid → two solids\n- Peritectic: liquid + solid → one solid ← (this question)"
  },

  {
    subject: "Extraction",
    topic: "Ores and Minerals",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Match the metallic elements in Column I with their primary ores in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Al | 1. Rutile |\n| Q. Fe | 2. Hematite |\n| R. Ti | 3. Chalcopyrite |\n| S. Cu | 4. Bauxite |",
    options: [
      { id: "A", text: "P-4, Q-2, R-3, S-1" },
      { id: "B", text: "P-2, Q-4, R-1, S-3" },
      { id: "C", text: "P-3, Q-1, R-4, S-2" },
      { id: "D", text: "P-4, Q-2, R-1, S-3" }
    ],
    correct_options: ["D"],
    explanation: "- **Al** → Bauxite (P-4)\n- **Fe** → Hematite ($\\text{Fe}_2\\text{O}_3$) (Q-2)\n- **Ti** → Rutile ($\\text{TiO}_2$) (R-1)\n- **Cu** → Chalcopyrite ($\\text{CuFeS}_2$) (S-3)\n\nThis matches Option D."
  },

  {
    subject: "Engineering Mathematics",
    topic: "Complex Analysis",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 1,
    negative_marks: 0,
    question_text: "Which of the following functions is/are expandable using a Maclaurin series?",
    options: [
      { id: "A", text: "$\\ln(1+z)$" },
      { id: "B", text: "$\\ln z$" },
      { id: "C", text: "$\\frac{1}{z^2}$" },
      { id: "D", text: "$\\exp(z)$" }
    ],
    correct_options: ["A", "D"],
    explanation: "A function can be expanded into a Maclaurin series if and only if it is **analytic (infinitely differentiable) at $z = 0$**.\n\n- $\\ln z$ and $\\frac{1}{z^2}$ are **undefined** at $z = 0$ → cannot be expanded.\n- $\\ln(1+z)$ evaluates to $0$ at $z=0$ and all derivatives exist → **expandable** (A ✓)\n- $\\exp(z)$ evaluates to $1$ at $z=0$ and all derivatives exist → **expandable** (D ✓)"
  },

  {
    subject: "Mechanical Properties",
    topic: "Dislocation Theory",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 1,
    negative_marks: 0,
    question_text: "With reference to edge and screw dislocations, which of the following statements is/are CORRECT?",
    options: [
      { id: "A", text: "Both edge and screw dislocations can leave the slip plane by climb." },
      { id: "B", text: "The Burgers vector of a screw dislocation is parallel to its line vector." },
      { id: "C", text: "Both edge and screw dislocations can leave the slip plane by cross-slip." },
      { id: "D", text: "The strain energy per unit length of an edge dislocation is higher than that of a screw dislocation." }
    ],
    correct_options: ["B", "D"],
    explanation: "**B — Correct:** By fundamental definition, a screw dislocation has its line vector **parallel** to its Burgers vector.\n\n**D — Correct:** Edge dislocation energy contains an additional Poisson's ratio term:\n$$E_{\\text{edge}} = \\frac{Gb^2}{4\\pi(1-\\nu)} > E_{\\text{screw}} = \\frac{Gb^2}{4\\pi}$$\n\n**A — Incorrect:** Climb is restricted exclusively to **edge** dislocations (requires vacancy diffusion).\n\n**C — Incorrect:** Cross-slip is restricted exclusively to **screw** dislocations."
  },

  {
    subject: "Ferrous Alloys",
    topic: "Blast Furnace Operations",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0,
    question_text: "Which of the following conditions is/are favorable for producing low-silicon hot metal in blast furnace ironmaking?",
    options: [
      { id: "A", text: "Reduced raceway adiabatic flame temperature (RAFT)" },
      { id: "B", text: "Oxygen-enriched blast" },
      { id: "C", text: "Lime injection through tuyeres" },
      { id: "D", text: "Increased hearth temperature" }
    ],
    correct_options: ["A", "C"],
    explanation: "Silicon transfer to hot metal occurs via:\n$$\\text{SiO}_2 + 2\\text{C} \\rightarrow \\text{Si} + 2\\text{CO}$$\nThis is a highly endothermic reaction driven by high temperatures.\n\n**A ✓:** Reducing RAFT lowers raceway temperatures, suppressing Si pickup.\n**C ✓:** Lime ($\\text{CaO}$) injection ties up free $\\text{SiO}_2$, lowering its activity and suppressing the reaction.\n**B & D:** Both increase temperature, which would *promote* silicon reduction — unfavorable for low-Si hot metal."
  },

  {
    subject: "Non-Ferrous Alloys",
    topic: "Age Hardening",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0,
    question_text: "Which of the following statements is/are CORRECT with respect to the initial stage of GP zone formation in a precipitation hardenable $\\text{Al} - 4.5\\text{ wt.\\% Cu}$ alloy?",
    options: [
      { id: "A", text: "GP zones are Cu-rich clusters." },
      { id: "B", text: "GP zones are $\\text{CuAl}_2$ precipitates." },
      { id: "C", text: "GP zones are incoherent with the matrix." },
      { id: "D", text: "GP zones are coherent with the matrix." }
    ],
    correct_options: ["A", "D"],
    explanation: "During the **initial stage** of aging in Al-4.5 wt.% Cu:\n\n**A ✓:** GP zones are ultra-thin, disk-shaped **copper-rich** atomic clusters (not yet the equilibrium $\\theta$ phase).\n\n**D ✓:** GP zones maintain full **coherency** with the FCC aluminium matrix — the copper atoms replace Al positions with minimal lattice distortion.\n\n**B ✗:** $\\text{CuAl}_2$ ($\\theta$ phase) forms at a later, more advanced stage of precipitation.\n\n**C ✗:** Incoherency develops at later stages ($\\theta'$ or $\\theta$), not during GP zone formation."
  },

  {
    subject: "Casting",
    topic: "Non-Destructive Testing",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0,
    question_text: "Which of the following techniques can be used to detect an internal defect in a metal casting?",
    options: [
      { id: "A", text: "Ultrasonic inspection" },
      { id: "B", text: "Liquid (or dye) penetrant inspection" },
      { id: "C", text: "Gamma-ray radiography" },
      { id: "D", text: "X-ray radiography" }
    ],
    correct_options: ["A", "C", "D"],
    explanation: "**A ✓:** Ultrasonic waves can penetrate bulk metal and detect internal voids, cracks and inclusions via echo signals.\n\n**C ✓:** Gamma-ray radiography uses penetrating radiation to reveal internal flaws via differential absorption.\n\n**D ✓:** X-ray radiography similarly reveals internal defects through differential absorption imaging.\n\n**B ✗:** Dye penetrant inspection is strictly a **surface method** — it can only detect defects that break the outer surface."
  },

  {
    subject: "Thermodynamics",
    topic: "Ellingham Diagram",
    q_type: "MSQ",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 1,
    negative_marks: 0,
    question_text: "The standard Gibbs free energies of formation of some solid oxides per mole of $\\text{O}_2$ at 1000 K are given below:\n\n$$\\text{SiO}_2: -728\\text{ kJ}, \\quad \\text{TiO}_2: -737\\text{ kJ}, \\quad \\text{VO}: -712\\text{ kJ}, \\quad \\text{MnO}: -624\\text{ kJ}$$\n\nRegarding the thermodynamic feasibility of oxide reduction, which of the following statements is/are CORRECT under standard conditions at 1000 K?",
    options: [
      { id: "A", text: "Si can reduce $\\text{TiO}_{2}$" },
      { id: "B", text: "Mn can reduce VO." },
      { id: "C", text: "Ti can reduce MnO." },
      { id: "D", text: "V can reduce $\\text{SiO}_{2}$." }
    ],
    correct_options: ["C"],
    explanation: "On the Ellingham diagram, a metal can reduce any oxide that is **less stable** (higher/less negative $\\Delta G^\\circ_f$).\n\nOrdering from most stable to least stable:\n$$\\text{TiO}_2(-737) > \\text{SiO}_2(-728) > \\text{VO}(-712) > \\text{MnO}(-624\\text{ kJ})$$\n\n**C ✓:** Ti (most stable oxide, $-737$ kJ) can reduce any oxide above it, including $\\text{MnO}$ ($-624$ kJ).\n\n**A ✗:** Si ($-728$) cannot reduce $\\text{TiO}_2$ ($-737$) — TiO₂ is more stable.\n**B ✗:** Mn ($-624$) cannot reduce VO ($-712$) — VO is more stable.\n**D ✗:** V ($-712$) cannot reduce $\\text{SiO}_2$ ($-728$) — SiO₂ is more stable."
  },

  {
    subject: "Thermodynamics",
    topic: "Fluid Mechanics",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Consider a fully developed, steady, one-dimensional, laminar flow of a Newtonian liquid through a pipe. The maximum velocity in the pipe is proportional to which of the following quantities? (Given: $\\Delta P$ is the pressure difference across the length, $\\mu$ is dynamic viscosity, $R$ is pipe radius, and $L$ is pipe length)",
    options: [
      { id: "A", text: "$\\Delta P$" },
      { id: "B", text: "$1/R^2$" },
      { id: "C", text: "$1/\\mu$" },
      { id: "D", text: "$1/L$" }
    ],
    correct_options: ["A"],
    explanation: "According to the Hagen-Poiseuille equation for steady laminar pipe flow, the maximum centreline velocity is:\n\n$$v_{\\text{max}} = \\frac{\\Delta P \\cdot R^2}{4\\mu L}$$\n\nThis shows that $v_{\\text{max}}$ is **linearly proportional to $\\Delta P$**.\n\n(Note: It is also proportional to $R^2$, $1/\\mu$, and $1/L$, but among the options listed, $\\Delta P$ is the correct answer since all options are individually correct proportionalities and only one can be selected.)"
  },

  {
    subject: "Mechanical Properties",
    topic: "Stress Analysis",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0,
    question_text: "The hydrostatic stress for the stress tensor provided below is ________ MPa (answer as an integer):\n\n$$\\sigma_{ij} = \\begin{bmatrix} 150 & 0 & 100 \\\\ 0 & -100 & 0 \\\\ 100 & 0 & 250 \\end{bmatrix}$$",
    options: null,
    correct_options: ["100-100"],
    explanation: "Hydrostatic stress ($\\sigma_m$) is the mean of the principal diagonal (trace) of the stress tensor:\n\n$$\\sigma_m = \\frac{\\sigma_{xx} + \\sigma_{yy} + \\sigma_{zz}}{3} = \\frac{150 + (-100) + 250}{3} = \\frac{300}{3} = 100\\text{ MPa}$$"
  },

  {
    subject: "Thermodynamics",
    topic: "Dimensional Analysis",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0,
    question_text: "For an application where the Reynolds number is to be kept constant, a liquid with a density of $1\\text{ g cm}^{-3}$ and viscosity $0.01$ Poise results in a characteristic speed of $1\\text{ cm s}^{-1}$. If this liquid is replaced by another with a density of $1.25\\text{ g cm}^{-3}$ and viscosity of $0.015$ Poise, the characteristic velocity will be ________ $\\text{cm s}^{-1}$ (rounded off to one decimal place). Assume the characteristic length of the flow to be the same in both cases.",
    options: null,
    correct_options: ["1.2-1.2"],
    explanation: "Reynolds number: $Re = \\frac{\\rho v D}{\\mu}$. Since $Re$ and characteristic length $D$ are kept constant:\n\n$$\\frac{\\rho_1 v_1}{\\mu_1} = \\frac{\\rho_2 v_2}{\\mu_2}$$\n\n$$\\frac{1 \\times 1}{0.01} = \\frac{1.25 \\times v_2}{0.015}$$\n\n$$100 = \\frac{1.25 \\times v_2}{0.015} \\implies v_2 = \\frac{100 \\times 0.015}{1.25} = \\frac{1.5}{1.25} = 1.2\\text{ cm s}^{-1}$$"
  },

  {
    subject: "Thermodynamics",
    topic: "Chemical Equilibrium",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0,
    question_text: "Consider the gas phase reaction: $\\text{CO} + \\frac{1}{2}\\text{O}_{2} \\rightleftharpoons \\text{CO}_{2}$. At equilibrium for a particular temperature, the partial pressures of $\\text{CO}$, $\\text{O}_{2}$, and $\\text{CO}_{2}$ are found to be $10^{-6}\\text{ atm}$, $10^{-6}\\text{ atm}$, and $16\\text{ atm}$, respectively. The equilibrium constant for the reaction is ________ $\\times 10^{10}$ (rounded off to one decimal place).",
    options: null,
    correct_options: ["1.6-1.6"],
    explanation: "The equilibrium constant expression:\n\n$$K_{\\text{eq}} = \\frac{p_{\\text{CO}_2}}{p_{\\text{CO}} \\cdot (p_{\\text{O}_2})^{1/2}}$$\n\nSubstituting:\n\n$$K_{\\text{eq}} = \\frac{16}{10^{-6} \\times (10^{-6})^{1/2}} = \\frac{16}{10^{-6} \\times 10^{-3}} = \\frac{16}{10^{-9}} = 16 \\times 10^9 = 1.6 \\times 10^{10}$$"
  },

  {
    subject: "Engineering Mathematics",
    topic: "Statistics",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0,
    question_text: "A linear regression model was fitted to a set of $(x, y)$ data. The total sum of squares and sum of squares of error are 1200 and 120, respectively. The coefficient of determination ($R^2$) of the fit is ________ (rounded off to one decimal place).",
    options: null,
    correct_options: ["0.9-0.9"],
    explanation: "The coefficient of determination:\n\n$$R^2 = 1 - \\frac{SSE}{SST} = 1 - \\frac{120}{1200} = 1 - 0.1 = 0.9$$"
  },

  {
    subject: "Engineering Mathematics",
    topic: "Differential Equations",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 2,
    negative_marks: 0.66,
    question_text: "For two continuous functions $M(x,y)$ and $N(x,y)$, the relation $M\\,dx + N\\,dy = 0$ describes an exact differential equation if:",
    options: [
      { id: "A", text: "$\\frac{\\partial M}{\\partial x} = \\frac{\\partial N}{\\partial y}$" },
      { id: "B", text: "$\\frac{\\partial M}{\\partial x} = -\\frac{\\partial N}{\\partial y}$" },
      { id: "C", text: "$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$" },
      { id: "D", text: "$\\frac{\\partial M}{\\partial y} = -\\frac{\\partial N}{\\partial x}$" }
    ],
    correct_options: ["C"],
    explanation: "According to **Euler's reciprocity criterion**, a differential equation $Mdx + Ndy = 0$ is exact if and only if:\n\n$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$\n\nThis ensures the existence of a potential function $F(x,y)$ such that $dF = Mdx + Ndy = 0$."
  },

  {
    subject: "Ferrous Alloys",
    topic: "Steelmaking Processes",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Match the steel plant equipment and processes in Column I with their associated technical attribute in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Corex | 1. Melter-gasifier |\n| Q. Electric Arc Furnace | 2. Natural gas reformer |\n| R. Midrex | 3. Electromagnetic stirrer |\n| S. Continuous Casting | 4. Hot heel |",
    options: [
      { id: "A", text: "P-1, Q-4, R-2, S-3" },
      { id: "B", text: "P-1, Q-4, R-3, S-2" },
      { id: "C", text: "P-2, Q-4, R-1, S-3" },
      { id: "D", text: "P-1, Q-3, R-2, S-4" }
    ],
    correct_options: ["A"],
    explanation: "- **P. Corex** → Uses a **melter-gasifier** vessel for smelting reduction (P-1)\n- **Q. EAF** → Retains a **hot heel** (residual liquid metal) to accelerate scrap melting (Q-4)\n- **R. Midrex** → Uses a **natural gas reformer** to produce DRI reducing gas (R-2)\n- **S. Continuous Casting** → Uses **electromagnetic stirrers** to control solidification and grain morphology (S-3)\n\nThis gives Option A."
  },

  {
    subject: "Thermodynamics",
    topic: "Heat Transfer",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "The radiative heat flux $\\dot{q}$ at a hot surface at a temperature $T_s$ can be expressed as:\n\n$$\\dot{q} = A \\cdot f(T_s, T_\\infty)(T_s - T_\\infty)$$\n\nwhere $A$ is a constant and $T_\\infty$ is the temperature of the surroundings (temperatures in Kelvin). The function $f(T_s, T_\\infty)$ is given by:",
    options: [
      { id: "A", text: "$(T_s + T_\\infty)^2(T_s - T_\\infty)$" },
      { id: "B", text: "$(T_s^2 + T_\\infty^2)(T_s + T_\\infty)$" },
      { id: "C", text: "$(T_s^2 - T_\\infty^2)(T_s + T_\\infty)$" },
      { id: "D", text: "$(T_s - T_\\infty)^2(T_s + T_\\infty)$" }
    ],
    correct_options: ["B"],
    explanation: "From the Stefan-Boltzmann law, net radiative heat flux:\n\n$$\\dot{q} \\propto (T_s^4 - T_\\infty^4)$$\n\nFactoring using difference of squares twice:\n\n$$(T_s^4 - T_\\infty^4) = (T_s^2 - T_\\infty^2)(T_s^2 + T_\\infty^2) = (T_s - T_\\infty)(T_s + T_\\infty)(T_s^2 + T_\\infty^2)$$\n\nComparing to the form $A \\cdot f(T_s, T_\\infty) \\cdot (T_s - T_\\infty)$:\n\n$$f(T_s, T_\\infty) = (T_s + T_\\infty)(T_s^2 + T_\\infty^2)$$\n\nThis matches Option B."
  },

  {
    subject: "Mechanical Properties",
    topic: "Mechanical Testing",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Match the mechanical engineering phenomena in Column I with their typical visual/experimental observations in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Dynamic strain aging | 1. Grain boundary sliding |\n| Q. Recrystallization | 2. Decrease in yield stress with a reversal of loading direction |\n| R. Bauschinger effect | 3. Decrease in dislocation density |\n| S. Superplasticity | 4. Serrations in stress-strain curve |",
    options: [
      { id: "A", text: "P-4, Q-1, R-2, S-3" },
      { id: "B", text: "P-4, Q-3, R-2, S-1" },
      { id: "C", text: "P-3, Q-4, R-2, S-1" },
      { id: "D", text: "P-1, Q-4, R-2, S-3" }
    ],
    correct_options: ["B"],
    explanation: "- **P. Dynamic strain aging** → Causes serrated/jerky **Portevin-Le Chatelier effect** in stress-strain curve (P-4)\n- **Q. Recrystallization** → Forms new strain-free grains, drastically reducing **dislocation density** (Q-3)\n- **R. Bauschinger effect** → A decrease in compressive yield stress after prior tensile plastic deformation, i.e., **decrease in yield stress upon load reversal** (R-2)\n- **S. Superplasticity** → Achieves extreme elongations via **grain boundary sliding** (S-1)\n\nOption B."
  },

  {
    subject: "Mechanical Properties",
    topic: "Diffusion",
    q_type: "MCQ",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "The following are the activation energies for the diffusion of carbon and iron at 773 K in polycrystalline BCC iron:\n\n- $P$ = Activation energy for lattice diffusion of carbon in BCC iron\n- $Q$ = Activation energy for lattice diffusion of iron in BCC iron\n- $R$ = Activation energy for grain boundary diffusion of iron in BCC iron\n\nSelect the correct structural ranking of these activation energies:",
    options: [
      { id: "A", text: "$R < P < Q$" },
      { id: "B", text: "$R < Q < P$" },
      { id: "C", text: "$Q < P < R$" },
      { id: "D", text: "$P < R < Q$" }
    ],
    correct_options: ["D"],
    explanation: "1. **Carbon (interstitial):** Carbon atoms diffuse via interstitial hops in Fe, requiring much less energy than substitutional vacancy-mediated diffusion → $P$ (smallest)\n\n2. **Grain boundary diffusion of Fe:** Grain boundaries are disordered regions with lower atomic packing, allowing easier atom movement than perfect bulk crystal → $R$ < bulk lattice diffusion of Fe → $R < Q$\n\n3. **Lattice (bulk) diffusion of Fe:** Requires the most energy since it involves vacancy formation and migration through a perfect crystal lattice → $Q$ (largest)\n\nRanking: $P < R < Q$ → **Option D**"
  },

  {
    subject: "Engineering Mathematics",
    topic: "Vector Calculus",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0,
    question_text: "For a two-dimensional scalar field described by $T(x,y) = \\frac{1}{3}xy(x+y)$, the magnitude of its gradient at the point $(1,1)$ is ________ (rounded off to two decimal places).",
    options: null,
    correct_options: ["1.41-1.42"],
    explanation: "Expand: $T(x,y) = \\frac{1}{3}x^2y + \\frac{1}{3}xy^2$\n\nPartial derivatives:\n$$\\frac{\\partial T}{\\partial x} = \\frac{2}{3}xy + \\frac{1}{3}y^2 \\xrightarrow{(1,1)} \\frac{2}{3} + \\frac{1}{3} = 1$$\n\n$$\\frac{\\partial T}{\\partial y} = \\frac{1}{3}x^2 + \\frac{2}{3}xy \\xrightarrow{(1,1)} \\frac{1}{3} + \\frac{2}{3} = 1$$\n\nGradient at $(1,1)$: $\\nabla T = \\hat{i} + \\hat{j}$\n\nMagnitude: $|\\nabla T| = \\sqrt{1^2 + 1^2} = \\sqrt{2} \\approx 1.414$"
  },

  {
    subject: "Phase Transformations",
    topic: "X-Ray Diffraction",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0,
    question_text: "X-ray diffraction using monochromatic radiation of wavelength 0.154 nm is performed on powder samples of metal A (with FCC crystal structure) and metal B (with BCC crystal structure). If the first peak in both cases occurs at a Bragg angle $\\theta = 20^\\circ$, then the value of the ratio $\\frac{\\text{lattice parameter of metal A}}{\\text{lattice parameter of metal B}}$ is ________ (rounded off to two decimal places).",
    options: null,
    correct_options: ["1.22-1.23"],
    explanation: "Since both metals give the first peak at the same $\\theta$ using the same $\\lambda$, the interplanar spacings must be equal ($d_A = d_B$).\n\n**FCC (Metal A):** First allowed peak is $\\{111\\}$:\n$$d_A = \\frac{a_A}{\\sqrt{1^2+1^2+1^2}} = \\frac{a_A}{\\sqrt{3}}$$\n\n**BCC (Metal B):** First allowed peak is $\\{110\\}$:\n$$d_B = \\frac{a_B}{\\sqrt{1^2+1^2+0^2}} = \\frac{a_B}{\\sqrt{2}}$$\n\nSetting $d_A = d_B$:\n$$\\frac{a_A}{\\sqrt{3}} = \\frac{a_B}{\\sqrt{2}} \\implies \\frac{a_A}{a_B} = \\frac{\\sqrt{3}}{\\sqrt{2}} = \\sqrt{1.5} \\approx 1.2247$$"
  },

  {
    subject: "Engineering Mathematics",
    topic: "Limits",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 2,
    negative_marks: 0,
    question_text: "The value of $\\lim_{x \\rightarrow 0} \\frac{6(x - \\sin x)}{x^3}$ is ________ (answer as an integer).",
    options: null,
    correct_options: ["1-1"],
    explanation: "Using Taylor series expansion: $\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots$\n\n$$\\lim_{x \\rightarrow 0} \\frac{6\\left(x - \\left(x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots\\right)\\right)}{x^3}$$\n\n$$= \\lim_{x \\rightarrow 0} \\frac{6 \\cdot \\frac{x^3}{6} - \\frac{6x^5}{120} + \\cdots}{x^3} = \\lim_{x \\rightarrow 0} \\left(1 - \\frac{x^2}{20} + \\cdots\\right) = 1$$"
  },

  {
    subject: "Electrochemistry and Corrosion",
    topic: "Electrochemical Cells",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0,
    question_text: "Consider the following cell reaction: $\\text{Mg} + \\text{Cd}^{2+} \\rightleftharpoons \\text{Mg}^{2+} + \\text{Cd}$. The standard Gibbs free energy change for the reaction is ________ kJ (rounded off to an integer).\n\n(Given: Standard oxidation potentials are $E^\\circ_{\\text{Mg/Mg}^{2+}} = 2.37\\text{ V}$, $E^\\circ_{\\text{Cd/Cd}^{2+}} = 0.403\\text{ V}$, Faraday's constant $= 96500\\text{ C mol}^{-1}$)",
    options: null,
    correct_options: ["-380--379"],
    explanation: "Cell EMF:\n$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{ox, Mg}} - E^\\circ_{\\text{ox, Cd}} = 2.37 - 0.403 = 1.967\\text{ V}$$\n\n(Note: Cd is reduced, so its oxidation potential is reversed to reduction: $E^\\circ_{\\text{red, Cd}} = -(-0.403) = +0.403\\text{ V}$... using oxidation potentials directly: $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{ox,anode}} + E^\\circ_{\\text{red,cathode}}$ = $2.37 - 0.403 = 1.967$ V)\n\nElectrons transferred: $n = 2$\n\n$$\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}} = -2 \\times 96500 \\times 1.967 = -379{,}631\\text{ J} \\approx -380\\text{ kJ}$$"
  },

  {
    subject: "Electronic and Magnetic Properties",
    topic: "Semiconductor Physics",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0,
    question_text: "An intrinsic semiconductor has an electrical conductivity of $100\\ \\Omega^{-1}\\text{m}^{-1}$ at 300 K and $300\\ \\Omega^{-1}\\text{m}^{-1}$ at 500 K. The band gap of the semiconductor is ________ eV (rounded off to two decimal places).\n\n(Given: Boltzmann constant $k_B = 8.6 \\times 10^{-5}\\text{ eV K}^{-1}$)",
    options: null,
    correct_options: ["0.13-0.15"],
    explanation: "Intrinsic conductivity model: $\\sigma = \\sigma_o \\exp\\left(-\\frac{E_g}{2k_B T}\\right)$\n\nTaking ratio:\n$$\\frac{\\sigma_2}{\\sigma_1} = 3 = \\exp\\left(\\frac{E_g}{2k_B}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right)$$\n\n$$\\ln 3 = \\frac{E_g}{2 \\times 8.6 \\times 10^{-5}} \\left(\\frac{1}{300} - \\frac{1}{500}\\right) = \\frac{E_g}{1.72 \\times 10^{-4}} \\times \\frac{200}{150000}$$\n\n$$1.0986 = \\frac{E_g \\times 1.333 \\times 10^{-3}}{1.72 \\times 10^{-4}} = E_g \\times 7.75$$\n\n$$E_g = \\frac{1.0986}{7.75} \\approx 0.1417\\text{ eV} \\approx 0.14\\text{ eV}$$"
  },

  {
    subject: "Mechanical Properties",
    topic: "Fracture Mechanics",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 2,
    negative_marks: 0,
    question_text: "For a component fabricated from alloy A with plane strain fracture toughness $K_{\\text{Ic}} = 50\\text{ MPa m}^{1/2}$, fracture was observed at a crack length of 0.4 mm under a tensile service stress $\\sigma$. If the same component is instead fabricated from alloy B with $K_{\\text{Ic}} = 75\\text{ MPa m}^{1/2}$, the critical crack length at which failure will occur under the identical tensile stress $\\sigma$ is ________ mm (rounded off to one decimal place).",
    options: null,
    correct_options: ["0.9-0.9"],
    explanation: "Using $K_{\\text{Ic}} = Y\\sigma\\sqrt{\\pi a}$, since $Y$ and $\\sigma$ are identical for both components:\n\n$$\\frac{K_{\\text{Ic,A}}}{\\sqrt{a_A}} = \\frac{K_{\\text{Ic,B}}}{\\sqrt{a_B}}$$\n\n$$\\frac{50}{\\sqrt{0.4}} = \\frac{75}{\\sqrt{a_B}}$$\n\n$$\\sqrt{\\frac{a_B}{0.4}} = \\frac{75}{50} = 1.5 \\implies a_B = 0.4 \\times 1.5^2 = 0.4 \\times 2.25 = 0.9\\text{ mm}$$"
  },

  {
    subject: "Thermodynamics",
    topic: "Heat Transfer",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Easy",
    marks: 2,
    negative_marks: 0,
    question_text: "Temperatures at two sides of a 0.4 m thick copper plate are $1000^\\circ\\text{C}$ and $500^\\circ\\text{C}$. Assuming steady-state, one-dimensional conductive heat transfer through the wall, the magnitude of the heat flux through the wall is ________ $\\times 10^5\\text{ W m}^{-2}$ (answer as an integer).\n\n(Given: Thermal conductivity of copper is $400\\text{ W m}^{-1}\\text{K}^{-1}$)",
    options: null,
    correct_options: ["5-5"],
    explanation: "From Fourier's Law of heat conduction:\n\n$$q = k \\frac{\\Delta T}{\\Delta x} = 400 \\times \\frac{1000 - 500}{0.4} = 400 \\times 1250 = 500{,}000\\text{ W/m}^2 = 5 \\times 10^5\\text{ W m}^{-2}$$"
  },

  {
    subject: "Mechanical Properties",
    topic: "Creep",
    q_type: "NAT",
    pyq_year: 2025,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0,
    question_text: "In polycrystalline Ni, Nabarro-Herring diffusion creep was found to be the rate-controlling mechanism at a certain temperature. At that temperature, if the steady-state strain rate is $10^{-8}\\text{ s}^{-1}$ at a stress of 10 MPa, the steady-state strain rate of $10^{-9}\\text{ s}^{-1}$ will be obtained at a stress value of ________ MPa (answer as an integer).",
    options: null,
    correct_options: ["1-1"],
    explanation: "For Nabarro-Herring creep, the steady-state strain rate scales **linearly** with applied stress ($\\dot{\\varepsilon} \\propto \\sigma^1$).\n\nDropping the strain rate by a factor of 10 ($10^{-8} \\rightarrow 10^{-9}$) requires the stress to also drop by a factor of 10:\n\n$$\\sigma_2 = \\frac{10\\text{ MPa}}{10} = 1\\text{ MPa}$$"
  }
];

// ─── Main Seeding Function ────────────────────────────────────────────────────
async function seed() {
  console.log('🔍 Fetching existing subjects and topics...');
  const { data: extSubjects, error: sErr } = await supabase.from('subjects').select('id, name');
  if (sErr) throw sErr;

  const subjectsMap = {};
  extSubjects.forEach(s => {
    subjectsMap[s.name.toLowerCase()] = s.id;
  });

  const { data: extTopics, error: tErr } = await supabase.from('topics').select('id, subject_id, name');
  if (tErr) throw tErr;

  const topicsMap = {};
  extTopics.forEach(t => {
    topicsMap[`${t.subject_id}:${t.name.toLowerCase()}`] = t.id;
  });

  console.log(`✅ Loaded ${extSubjects.length} subjects and ${extTopics.length} topics.`);
  console.log(`📝 Processing ${questionsData.length} GATE MT 2025 questions...\n`);

  let newSubjectsCreated = 0;
  let newTopicsCreated = 0;
  let questionsInserted = 0;
  let questionsSkipped = 0;

  for (const q of questionsData) {
    const subName = q.subject;
    const subNameLower = subName.toLowerCase();

    // 1. Ensure subject exists
    let subId = subjectsMap[subNameLower];
    if (!subId) {
      console.log(`  ➕ Creating subject: "${subName}"...`);
      const { data: newSub, error: subCreateErr } = await supabase
        .from('subjects')
        .insert({ name: subName, slug: slugify(subName) })
        .select('id')
        .single();

      if (subCreateErr) {
        console.error(`  ❌ Failed to create subject "${subName}":`, subCreateErr.message);
        continue;
      }
      subId = newSub.id;
      subjectsMap[subNameLower] = subId;
      newSubjectsCreated++;
    }

    // 2. Ensure topic exists
    const topName = q.topic;
    const topNameLower = topName.toLowerCase();
    const topicKey = `${subId}:${topNameLower}`;
    let topId = topicsMap[topicKey];

    if (!topId) {
      console.log(`  ➕ Creating topic: "${topName}" under "${subName}"...`);
      const { data: newTop, error: topCreateErr } = await supabase
        .from('topics')
        .insert({ subject_id: subId, name: topName, slug: slugify(topName) })
        .select('id')
        .single();

      if (topCreateErr) {
        console.error(`  ❌ Failed to create topic "${topName}":`, topCreateErr.message);
        continue;
      }
      topId = newTop.id;
      topicsMap[topicKey] = topId;
      newTopicsCreated++;
    }

    // 3. Check for duplicates
    const { data: dupCheck, error: dupErr } = await supabase
      .from('questions')
      .select('id')
      .eq('question_text', q.question_text.trim())
      .eq('pyq_year', q.pyq_year)
      .limit(1);

    if (dupErr) {
      console.error('  ⚠️  Error checking duplicate:', dupErr.message);
      continue;
    }

    if (dupCheck && dupCheck.length > 0) {
      questionsSkipped++;
      continue;
    }

    // 4. Insert question
    const payload = {
      subject_id: subId,
      topic_id: topId,
      q_type: q.q_type,
      pyq_year: q.pyq_year,
      is_pyq: true,
      difficulty: q.difficulty,
      marks: q.marks,
      negative_marks: q.negative_marks,
      question_text: q.question_text.trim(),
      options: q.options,
      correct_options: q.correct_options,
      explanation: q.explanation.trim(),
      is_premium: false
    };

    const { error: insErr } = await supabase.from('questions').insert(payload);
    if (insErr) {
      console.error(`  ❌ Error inserting: "${q.question_text.substring(0, 50)}..."`, insErr.message);
    } else {
      questionsInserted++;
      console.log(`  ✅ [${q.q_type}][${q.difficulty}] ${q.subject} — ${q.topic} (${q.pyq_year})`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  GATE MT 2025 Seeding Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  New subjects created  : ${newSubjectsCreated}`);
  console.log(`  New topics created    : ${newTopicsCreated}`);
  console.log(`  Questions inserted    : ${questionsInserted}`);
  console.log(`  Questions skipped     : ${questionsSkipped} (duplicates)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seed().catch(err => {
  console.error('❌ Seeding script failed:', err);
  process.exit(1);
});
