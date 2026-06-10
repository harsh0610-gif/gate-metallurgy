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

// ─── GATE MT 2024 — All Questions ────────────────────────────────────────────
const questionsData = [
  // ── SECTION 1: GENERAL APTITUDE ──────────────────────────────────────────
  {
    subject: "Engineering Physics",
    topic: "Verbal Ability",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "If '→' denotes increasing order of intensity, then the meaning of the words [dry → arid → parched] is analogous to [diet → fast → ________]. Which one of the given options is appropriate to fill the blank?",
    options: [
      { id: "A", text: "starve" },
      { id: "B", text: "reject" },
      { id: "C", text: "feast" },
      { id: "D", text: "deny" }
    ],
    correct_options: ["A"],
    explanation: "The sequence dry → arid → parched represents increasing intensity of dryness. Similarly, diet → fast represents increasing food restriction. The next highest intensity step is \"starve,\" meaning to suffer severely from lack of food, completing the analogy perfectly."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "If two distinct non-zero real variables $x$ and $y$ are such that $(x + y)$ is proportional to $(x - y)$, then the value of $x/y$:",
    options: [
      { id: "A", text: "depends on $xy$" },
      { id: "B", text: "depends only on $x$ and not on $y$" },
      { id: "C", text: "depends only on $y$ and not on $x$" },
      { id: "D", text: "is a constant" }
    ],
    correct_options: ["D"],
    explanation: "If $(x + y) = k(x - y)$ for some constant $k$, then $x/y = -(1 + k)/(1 - k)$, which is purely a function of $k$. Since $k$ is a fixed proportionality constant, $x/y$ is always a constant regardless of the individual values of $x$ and $y$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Consider the following sample of numbers: 9, 18, 11, 14, 15, 17, 10, 69, 11, 13. The median of the sample is:",
    options: [
      { id: "A", text: "13.5" },
      { id: "B", text: "14" },
      { id: "C", text: "11" },
      { id: "D", text: "18.7" }
    ],
    correct_options: ["A"],
    explanation: "Arranging in ascending order: 9, 10, 11, 11, 13, 14, 15, 17, 18, 69. With 10 values, the median is the average of the 5th and 6th values = $(13 + 14)/2 = 13.5$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "The number of coins of ₹1, ₹5, and ₹10 denominations that a person has are in the ratio $5:3:13$. Of the total amount, the percentage of money in ₹5 coins is:",
    options: [
      { id: "A", text: "21%" },
      { id: "B", text: "14 2/7%" },
      { id: "C", text: "10%" },
      { id: "D", text: "30%" }
    ],
    correct_options: ["C"],
    explanation: "Let coins be $5x$, $3x$, $13x$. Total value = $5x(1) + 3x(5) + 13x(10) = 5x + 15x + 130x = 150x$. Value in ₹5 coins = $15x$. Percentage = $(15x/150x) \\times 100 = 10\\%$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 1,
    negative_marks: 0.33,
    question_text: "For positive non-zero real variables $p$ and $q$, if $\\log(p^2 + q^2) = \\log p + \\log q + 2 \\log 3$, then the value of $(p^4 + q^4)/(p^2q^2)$ is:",
    options: [
      { id: "A", text: "79" },
      { id: "B", text: "81" },
      { id: "C", text: "9" },
      { id: "D", text: "83" }
    ],
    correct_options: ["A"],
    explanation: "$\\log(p^2 + q^2) = \\log(9pq)$, so $p^2 + q^2 = 9pq$. Now $(p^4 + q^4)/(p^2q^2) = (p^2/q^2) + (q^2/p^2) = [(p^2 + q^2)^2 - 2p^2q^2]/(p^2q^2) = (9pq)^2/(p^2q^2) - 2 = 81 - 2 = 79$."
  },
  {
    subject: "Engineering Physics",
    topic: "Verbal Ability",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "In the given text, the blanks are numbered (i)−(iv). Select the best match for all the blanks. \"Steve was advised to keep his head __(i)__ before heading __(ii)__ to bat; for, while he had a head __(iii)__ batting, he could only do so with a cool head __(iv)__ his shoulders.\"",
    options: [
      { id: "A", text: "(i) down, (ii) down, (iii) on, (iv) for" },
      { id: "B", text: "(i) on, (ii) down, (iii) for, (iv) on" },
      { id: "C", text: "(i) down, (ii) out, (iii) for, (iv) on" },
      { id: "D", text: "(i) on, (ii) out, (iii) on, (iv) for" }
    ],
    correct_options: ["C"],
    explanation: "\"Keep his head down\" means stay focused. \"Heading out to bat\" means going out to play. \"A head for batting\" means natural aptitude. \"Cool head on his shoulders\" means composure. Option C maps all four idioms correctly."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Spatial Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "A rectangular paper sheet of dimensions 54 cm × 4 cm is taken. The two longer edges of the sheet are joined together to create a cylindrical tube. A cube whose surface area is equal to the area of the sheet is also taken. Then, the ratio of the volume of the cylindrical tube to the volume of the cube is:",
    options: [
      { id: "A", text: "$1/\\pi$" },
      { id: "B", text: "$2/\\pi$" },
      { id: "C", text: "$3/\\pi$" },
      { id: "D", text: "$4/\\pi$" }
    ],
    correct_options: ["A"],
    explanation: "Joining the two longer edges (54 cm) means the shorter edge (4 cm) becomes the circumference. So circumference = 4 cm, radius $r = 4/(2\\pi) = 2/\\pi$, height $h = 54$ cm. Volume of cylinder = $\\pi r^2 h = \\pi(2/\\pi)^2(54) = 216/\\pi$ cm³. Sheet area = $54 \\times 4 = 216$ cm². Cube surface area = $6a^2 = 216 \\implies a = 6$ cm. Volume of cube = $6^3 = 216$ cm³. Ratio = $(216/\\pi)/216 = 1/\\pi$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Quantitative Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "The energy contribution of different macronutrients to a typical 2,000 kcal diet is: Carbohydrates 35%, Proteins 20%, Unsaturated fat 20%, Saturated fat 20%, and Trans fat 5%. The energy density (kcal/g) of each macronutrient is given in the table:\n\n| Macronutrient | Energy Density (kcal/g) |\n|---|---|\n| Carbohydrates | 4 |\n| Proteins | 4 |\n| Unsaturated fat | 9 |\n| Saturated fat | 9 |\n| Trans fat | 9 |\n\nThe total fat (all three types: Unsaturated, Saturated, Trans fat) this person consumes, in grams, is:",
    options: [
      { id: "A", text: "44.4" },
      { id: "B", text: "77.8" },
      { id: "C", text: "100" },
      { id: "D", text: "3,600" }
    ],
    correct_options: ["C"],
    explanation: "Total fat percentage = Unsaturated fat (20%) + Saturated fat (20%) + Trans fat (5%) = 45%. Energy from fat = $0.45 \\times 2000 = 900$ kcal. All three fat types have energy density 9 kcal/g. Total fat in grams = $900/9 = 100$ g."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Spatial Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "A rectangular paper of 20 cm × 8 cm is folded 3 times. Each fold is made along the line of symmetry, which is perpendicular to its long edge. The perimeter of the final folded sheet (in cm) is:",
    options: [
      { id: "A", text: "18" },
      { id: "B", text: "24" },
      { id: "C", text: "20" },
      { id: "D", text: "21" }
    ],
    correct_options: ["D"],
    explanation: "Each fold is perpendicular to the long edge (20 cm), so the length halves each time while width (8 cm) stays constant. After 3 folds: length = $20/(2^3) = 20/8 = 2.5$ cm, width = 8 cm. Perimeter = $2(2.5 + 8) = 2(10.5) = 21$ cm."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Spatial Aptitude",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Consider an asymmetric arrangement of squares along a horizontal line AB. The least number of squares to be added to the figure to make AB a line of symmetry is:",
    options: [
      { id: "A", text: "6" },
      { id: "B", text: "4" },
      { id: "C", text: "5" },
      { id: "D", text: "7" }
    ],
    correct_options: ["C"],
    explanation: "By inspecting the figure symmetry, squares exist below line AB on the right side that have no mirror counterpart on the left side. Adding 5 squares to the appropriate positions on the left side creates perfect bilateral symmetry about line AB."
  },

  // ── SECTION 2: METALLURGICAL ENGINEERING (CORE) ───────────────────────────
  {
    subject: "Engineering Mathematics",
    topic: "Probability and Statistics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "If $X_1$ and $X_2$ are independent normally distributed random variables with means $\\mu_1$ and $\\mu_2$, and variances $\\rho_1$ and $\\rho_2$ respectively, then the combination $X = X_1 + X_2$ has mean $\\mu$ and variance $\\rho$ such that:",
    options: [
      { id: "A", text: "$\\mu = \\mu_1 + \\mu_2$ and $\\rho = \\rho_1 + \\rho_2$" },
      { id: "B", text: "$\\mu^2 = \\mu_1^2 + \\mu_2^2$ and $\\rho = \\rho_1 + \\rho_2$" },
      { id: "C", text: "$\\mu = \\mu_1 + \\mu_2$ and $\\rho^2 = \\rho_1^2 + \\rho_2^2$" },
      { id: "D", text: "$\\mu^2 = \\mu_1^2 + \\mu_2^2$ and $\\rho^2 = \\rho_1^2 + \\rho_2^2$" }
    ],
    correct_options: ["A"],
    explanation: "For independent random variables, the mean of the sum equals the sum of the individual means: $\\mu = \\mu_1 + \\mu_2$. The variance of the sum of independent variables equals the sum of the individual variances: $\\rho = \\rho_1 + \\rho_2$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Calculus",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following is the Taylor-series expansion of $\\ln\\left(\frac{1+x}{1-x}\\right)$ about the origin for $|x| < 1$? $x$ is a real number.",
    options: [
      { id: "A", text: "$x - x^2/2 + x^3/3 - \\cdots$" },
      { id: "B", text: "$2(x - x^2/2 + x^3/3 - \\cdots)$" },
      { id: "C", text: "$x + x^3/3 + x^5/5 + \\cdots$" },
      { id: "D", text: "$2(x + x^3/3 + x^5/5 + \\cdots)$" }
    ],
    correct_options: ["D"],
    explanation: "$\\ln\\left(\\frac{1+x}{1-x}\\right) = \\ln(1+x) - \\ln(1-x)$. Using standard Taylor series: $\\ln(1+x) = x - x^2/2 + x^3/3 - \\cdots$ and $\\ln(1-x) = -x - x^2/2 - x^3/3 - \\cdots$. Subtracting: the even terms cancel and odd terms double, giving $2(x + x^3/3 + x^5/5 + \\cdots)$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Probability and Statistics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Consider normal (Gaussian) distributions $a$, $b$, and $c$, where curve $a$ is the tallest and narrowest, $b$ is intermediate, and $c$ is the shortest and widest, with all peaks located at positive positions along the x-axis. $\\sigma_p$ and $\\mu_p$ are the standard deviation and mean of distribution $p$ respectively, and the means are positive. Which one of the following deductions is correct?",
    options: [
      { id: "A", text: "$\\sigma_a < \\sigma_b < \\sigma_c$" },
      { id: "B", text: "$\\sigma_a > \\sigma_b > \\sigma_c$" },
      { id: "C", text: "$\\mu_a = \\mu_b = \\mu_c$" },
      { id: "D", text: "$\\mu_a > \\mu_b > \\mu_c$" }
    ],
    correct_options: ["A"],
    explanation: "A taller and narrower Gaussian curve corresponds to a smaller standard deviation, while a shorter and wider curve corresponds to a larger standard deviation. From the distribution shapes, curve $a$ is tallest and narrowest (smallest $\\sigma$) and curve $c$ is flattest and widest (largest $\\sigma$), giving $\\sigma_a < \\sigma_b < \\sigma_c$."
  },
  {
    subject: "Thermodynamics",
    topic: "Solutions and Mixtures",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "If in an A-B solid solution, the activity and mole fraction of A are given by $a_A$ and $X_A$ respectively, then the activity coefficient of A is given by:",
    options: [
      { id: "A", text: "$a_A / X_A$" },
      { id: "B", text: "$X_A / a_A$" },
      { id: "C", text: "$a_A \\times X_A$" },
      { id: "D", text: "$a_A \\times X_A^2$" }
    ],
    correct_options: ["A"],
    explanation: "By definition, activity $a_A = \\gamma_A \\times X_A$, where $\\gamma_A$ is the activity coefficient of A. Rearranging gives $\\gamma_A = a_A / X_A$."
  },
  {
    subject: "Thermodynamics",
    topic: "Heat Transfer",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Two rods of different metals of equal lengths $L/2$, diameter $d$ ($d \\ll L$), and constant thermal conductivities $k_1$ and $k_2$ (with $k_1 > k_2$) are connected perfectly. The left and right ends are maintained at $T_1$ and $T_2$ ($T_1 > T_2$). Which option correctly describes the steady-state temperature distribution?",
    options: [
      { id: "A", text: "Steeper slope in $k_1$ section, shallower slope in $k_2$ section" },
      { id: "B", text: "Steeper slope in $k_2$ section, shallower slope in $k_1$ section" },
      { id: "C", text: "Equal slopes in both sections" },
      { id: "D", text: "Curved non-linear profile" }
    ],
    correct_options: ["B"],
    explanation: "At steady state, heat flux $q = k_1(\\Delta T_1)/(L/2) = k_2(\\Delta T_2)/(L/2)$ must be equal throughout. Since $k_1 > k_2$, we get $\\Delta T_1 < \\Delta T_2$. The rod with lower conductivity ($k_2$) must have a steeper temperature gradient to maintain the same heat flux. So the $k_2$ section has a steeper slope."
  },
  {
    subject: "Mechanical Properties",
    topic: "Dislocation Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Match the laws listed in Column I with the corresponding material properties listed in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Hooke's law | 1. Thermal conductivity |\n| Q. Fick's law | 2. Young's modulus |\n| R. Fourier's law | 3. Permeability |\n| S. Darcy's law | 4. Diffusivity |",
    options: [
      { id: "A", text: "P–2, Q–1, R–4, S–3" },
      { id: "B", text: "P–4, Q–3, R–1, S–2" },
      { id: "C", text: "P–2, Q–4, R–1, S–3" },
      { id: "D", text: "P–4, Q–3, R–2, S–1" }
    ],
    correct_options: ["C"],
    explanation: "Hooke's law relates stress to strain via Young's modulus (P–2). Fick's law governs diffusion via diffusivity (Q–4). Fourier's law governs heat conduction via thermal conductivity (R–1). Darcy's law governs fluid flow through porous media via permeability (S–3)."
  },
  {
    subject: "Non-Ferrous Alloys",
    topic: "Copper, Titanium, and Nickel Alloys",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Wet high intensity magnetic separators (WHIMS) are used to concentrate:",
    options: [
      { id: "A", text: "fine ($< 75\\ \\mu\\text{m}$) paramagnetic minerals" },
      { id: "B", text: "coarse ($> 75\\ \\mu\\text{m}$) ferromagnetic minerals" },
      { id: "C", text: "coarse ($> 75\\ \\mu\\text{m}$) paramagnetic minerals" },
      { id: "D", text: "fine ($< 75\\ \\mu\\text{m}$) ferromagnetic minerals" }
    ],
    correct_options: ["A"],
    explanation: "WHIMS are specifically designed to process fine-grained ($< 75\\ \\mu\\text{m}$) weakly magnetic (paramagnetic) minerals that cannot be effectively separated by conventional low-intensity magnetic separators."
  },
  {
    subject: "Non-Ferrous Alloys",
    topic: "Copper, Titanium, and Nickel Alloys",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following reagents is NOT used in froth flotation process?",
    options: [
      { id: "A", text: "Lixiviants" },
      { id: "B", text: "Collectors" },
      { id: "C", text: "Activators" },
      { id: "D", text: "Depressants" }
    ],
    correct_options: ["A"],
    explanation: "Lixiviants are chemical leaching agents used in hydrometallurgical leaching processes (such as heap leaching) to dissolve metals from ores. They have no role in froth flotation."
  },
  {
    subject: "Ferrous Alloys",
    topic: "Ironmaking Metallurgy",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following reactions is the Boudouard's reaction? Given: (s): solid, (l): liquid, (g): gas",
    options: [
      { id: "A", text: "$\\text{C(s)} + \\text{H}_2\\text{O(l)} \\rightarrow \\text{H}_2\\text{g} + \\text{CO(g)}$" },
      { id: "B", text: "$\\text{C(s)} + \\text{O}_2\\text{(g)} \\rightarrow \\text{CO}_2\\text{(g)}$" },
      { id: "C", text: "$\\text{C(s)} + \\text{CO}_2\\text{(g)} \\rightarrow 2\\text{CO(g)}$" },
      { id: "D", text: "$2\\text{C(s)} + \\text{O}_2\\text{(g)} \\rightarrow 2\\text{CO(g)}$" }
    ],
    correct_options: ["C"],
    explanation: "The Boudouard reaction is the equilibrium reaction between carbon dioxide and carbon (coke) producing carbon monoxide: $\\text{C(s)} + \\text{CO}_2\\text{(g)} \\rightarrow 2\\text{CO(g)}$."
  },
  {
    subject: "Non-Ferrous Alloys",
    topic: "Copper, Titanium, and Nickel Alloys",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following processes is NOT related to the extraction and refining of titanium from ilmenite ore?",
    options: [
      { id: "A", text: "Pidgeon's process" },
      { id: "B", text: "Sorel process" },
      { id: "C", text: "Van Arkel process" },
      { id: "D", text: "Kroll's process" }
    ],
    correct_options: ["B"],
    explanation: "Kroll's process is the primary industrial route. Van Arkel process is used for refining. Pidgeon's process is for magnesium. Sorel process is related to cement production, making it completely unrelated to titanium metallurgy."
  },
  {
    subject: "Non-Ferrous Alloys",
    topic: "Aluminium Alloys",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following is the correct statement about the industrial production of aluminium from pure dry alumina by Hall-Héroult electrolytic reduction?",
    options: [
      { id: "A", text: "Cell is operated at a high voltage (220 to 240 V) with a very low current density" },
      { id: "B", text: "Cell is operated at a low voltage (5 to 7 V) with a very low current density" },
      { id: "C", text: "Cell is operated at a high voltage (220 to 240 V) with a very high current density" },
      { id: "D", text: "Cell is operated at a low voltage (5 to 7 V) with a very high current density" }
    ],
    correct_options: ["D"],
    explanation: "The Hall-Héroult cell operates at a low cell voltage of 4 to 6 V (typically quoted as 5 to 7 V range) but requires extremely high current densities and total currents."
  },
  {
    subject: "Phase Transformations",
    topic: "Nucleation and Growth",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following options represents the variation of the rate of nucleation of solid from a pure liquid metal as a function of undercooling ($\\Delta T = T_m - T$, where $T_m$ and $T$ are the freezing temperature and the liquid temperature respectively)?",
    options: [
      { id: "A", text: "Bell-shaped curve — rises then falls with increasing undercooling" },
      { id: "B", text: "U-shaped curve — falls then rises with increasing undercooling" },
      { id: "C", text: "Monotonically decreasing with increasing undercooling" },
      { id: "D", text: "Monotonically increasing with increasing undercooling" }
    ],
    correct_options: ["A"],
    explanation: "The nucleation rate depends on two factors: thermodynamic driving force (increases with undercooling) and atomic mobility (decreases as temperature drops). The net result is a bell-shaped curve with a maximum at intermediate undercooling."
  },
  {
    subject: "Phase Transformations",
    topic: "Solid State Transformations",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following crystal structure changes occurs during the transformation of mild steel from austenite to martensite?",
    options: [
      { id: "A", text: "Face centered cubic to body centered cubic" },
      { id: "B", text: "Face centered cubic to body centered tetragonal" },
      { id: "C", text: "Body centered cubic to body centered tetragonal" },
      { id: "D", text: "Body centered tetragonal to face centered cubic" }
    ],
    correct_options: ["B"],
    explanation: "Austenite in steel has a face centered cubic (FCC) crystal structure. Martensite forms by a diffusionless shear transformation trapped in a body centered tetragonal (BCT) structure."
  },
  {
    subject: "Mechanical Properties",
    topic: "Dislocation Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 1,
    negative_marks: 0.33,
    question_text: "A circular dislocation loop has a Burgers vector $\\mathbf{b}$ pointing horizontally to the right. Identify the nature of the dislocation segments at locations $p$ (on the right at 3 o'clock position), $q$ (at upper right at 1-2 o'clock position), and $r$ (at the top at 12 o'clock position).",
    options: [
      { id: "A", text: "$p$: pure edge, $q$: mixed, $r$: pure screw" },
      { id: "B", text: "$p$: pure edge, $q$: pure screw, $r$: pure edge" },
      { id: "C", text: "$p$: pure screw, $q$: mixed, $r$: pure screw" },
      { id: "D", text: "$p$: pure screw, $q$: pure edge, $r$: pure screw" }
    ],
    correct_options: ["D"],
    explanation: "The angle between the dislocation line tangent and the Burgers vector $\\mathbf{b}$ determines its character. At $p$ (vertical line tangent, horizontal $\\mathbf{b}$, $90^\\circ$), it is pure screw. At $q$, it is mixed. At $r$ (horizontal line tangent, horizontal $\\mathbf{b}$, $0^\\circ/180^\\circ$), it is pure edge."
  },
  {
    subject: "Mechanical Properties",
    topic: "Dislocation Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Match the concepts listed in Column I with the phenomena listed in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Peierls-Nabarro stress | 1. Yield point phenomenon |\n| Q. Cottrell's atmosphere | 2. Fatigue |\n| R. Paris law | 3. Dislocation glide |\n| S. Considère's criterion | 4. Onset of necking |",
    options: [
      { id: "A", text: "P–1, Q–2, R–3, S–4" },
      { id: "B", text: "P–4, Q–1, R–2, S–3" },
      { id: "C", text: "P–3, Q–1, R–2, S–4" },
      { id: "D", text: "P–3, Q–4, R–2, S–1" }
    ],
    correct_options: ["C"],
    explanation: "Peierls-Nabarro stress resists dislocation glide (P–3). Cottrell's atmosphere segregates to dislocations causing yield point phenomenon (Q–1). Paris law describes fatigue crack propagation (R–2). Considère's criterion defines onset of necking (S–4)."
  },
  {
    subject: "Casting",
    topic: "Casting Defects and Quality Control",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Match the defects listed in Column I with the associated manufacturing processes listed in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Misrun | 1. Extrusion |\n| Q. Earing | 2. Rolling |\n| R. Alligatoring | 3. Casting |\n| S. Chevron cracking | 4. Deep drawing |",
    options: [
      { id: "A", text: "P–3, Q–1, R–2, S–4" },
      { id: "B", text: "P–3, Q–4, R–2, S–1" },
      { id: "C", text: "P–2, Q–4, R–3, S–1" },
      { id: "D", text: "P–1, Q–3, R–2, S–4" }
    ],
    correct_options: ["B"],
    explanation: "Misrun is a casting defect (P–3). Earing is a deep drawing defect (Q–4). Alligatoring is a rolling defect (R–2). Chevron cracking occurs during extrusion in the core (S–1)."
  },
  {
    subject: "Phase Transformations",
    topic: "Sintering Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.33,
    question_text: "Which one of the following processes is NOT involved in the sintering of a green compact of ceramic powders? Assume that sintering is performed without application of external pressure.",
    options: [
      { id: "A", text: "Pore shrinkage" },
      { id: "B", text: "Dynamic recrystallization" },
      { id: "C", text: "Lattice diffusion" },
      { id: "D", text: "Grain boundary diffusion" }
    ],
    correct_options: ["B"],
    explanation: "Sintering involves pore shrinkage, lattice diffusion, and grain boundary diffusion. Dynamic recrystallization requires simultaneous plastic deformation, which does not occur during pressureless sintering."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "Which of the following statements is/are correct for a square matrix A with real number entries? $A^T$ denotes the transpose of A and $A^{-1}$ denotes the inverse of A.",
    options: [
      { id: "A", text: "A is symmetric if $A^T = -A$" },
      { id: "B", text: "A is skew-symmetric if $A^T = -A$" },
      { id: "C", text: "If A is orthogonal, then $A^T = A^{-1}$" },
      { id: "D", text: "If A is orthogonal, then its determinant is zero" }
    ],
    correct_options: ["B", "C"],
    explanation: "A matrix where $A^T = -A$ is by definition skew-symmetric. For an orthogonal matrix, the defining property is $A^T A = I \\implies $A^T = A^{-1}$. An orthogonal matrix has determinant $\\pm 1$, never zero."
  },
  {
    subject: "Thermodynamics",
    topic: "Thermodynamic Potentials",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.00,
    question_text: "Which of the following is/are criterion/criteria for equilibrium of an isolated system held at constant temperature and constant pressure?",
    options: [
      { id: "A", text: "Entropy maximization" },
      { id: "B", text: "Entropy minimization" },
      { id: "C", text: "Maximization of Gibbs free energy" },
      { id: "D", text: "Minimization of Gibbs free energy" }
    ],
    correct_options: ["D"],
    explanation: "For a system at constant temperature and constant pressure, the Gibbs free energy G is the relevant thermodynamic potential. At equilibrium, G reaches its minimum value ($dG = 0, d^2G > 0$)."
  },
  {
    subject: "Phase Transformations",
    topic: "X-Ray Diffraction",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "Which of the following $(h\\ k\\ l)$ reflections is/are allowed in an X-ray diffraction pattern of a crystal with face centered cubic lattice?",
    options: [
      { id: "A", text: "$(0\\ 0\\ 1)$" },
      { id: "B", text: "$(0\\ 1\\ 1)$" },
      { id: "C", text: "$(1\\ 1\\ 1)$" },
      { id: "D", text: "$(0\\ 0\\ 2)$" }
    ],
    correct_options: ["C", "D"],
    explanation: "For an FCC lattice, the systematic absence rule states that reflections are only allowed when $h, k, l$ are all odd or all even. $(1\\ 1\\ 1)$ is all odd, $(0\\ 0\\ 2)$ is all even."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Calculus",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Easy",
    marks: 1,
    negative_marks: 0.00,
    question_text: "The divergence of the vector field $\\mathbf{V} = x^2y \\hat{i} + y^3z \\hat{j} + z^4 \\hat{k}$ at the point $(1,1,1)$ is ________. (Round off to the nearest integer)",
    options: null,
    correct_options: ["9-9"],
    explanation: "Divergence $\\nabla \\cdot \\mathbf{V} = \\partial(x^2y)/\\partial x + \\partial(y^3z)/\\partial y + \\partial(z^4)/\\partial z = 2xy + 3y^2z + 4z^3$. At point $(1,1,1)$: $2(1)(1) + 3(1)^2(1) + 4(1)^3 = 2 + 3 + 4 = 9$."
  },
  {
    subject: "Engineering Physics",
    topic: "Core Physics Concepts",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "The pair-interaction energy between two atoms is given by $U = -1.6/r^6 + 51.2/r^{12}$, where $U$ is the interaction energy in eV and $r$ is the interatomic distance in Å. The equilibrium bond-length between the atoms is ________ Å. (Round off to the nearest integer)",
    options: null,
    correct_options: ["2-2"],
    explanation: "At equilibrium, $dU/dr = 0$. $dU/dr = 9.6/r^7 - 614.4/r^{13} = 0 \\implies 9.6/r^7 = 614.4/r^{13} \\implies r^6 = 614.4/9.6 = 64$. Therefore $r = 64^{1/6} = 2$ Å."
  },
  {
    subject: "Phase Transformations",
    topic: "Nucleation and Growth",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "For a solid embryo sitting on a flat mould wall surrounded by liquid, the wetting angle $\\theta$ is governed by Young's equation. If $\\gamma_{\\text{liquid-mould}} = 0.35$ J/m², $\\gamma_{\\text{solid-mould}} = 0.02$ J/m², and $\\gamma_{\\text{liquid-solid}} = 0.40$ J/m², then the wetting angle $\\theta$ is ________ degrees. (Round off to one decimal place).",
    options: null,
    correct_options: ["34.4-34.4"],
    explanation: "Using Young's equation: $\\gamma_{\\text{liquid-mould}} = \\gamma_{\\text{solid-mould}} + \\gamma_{\\text{liquid-solid}} \\times \\cos \\theta \\implies \\cos \\theta = (0.35 - 0.02)/0.40 = 0.825 \\implies \\theta = \\arccos(0.825) \\approx 34.4^\\circ$."
  },
  {
    subject: "Mechanical Properties",
    topic: "Advanced Plasticity",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "A single crystal is oriented such that the normal to the slip plane makes an angle of $60^\\circ$ with the tensile axis. If the slip direction makes an angle of $45^\\circ$ with respect to the tensile axis and the critical resolved shear stress for slip is 2 MPa, then the tensile stress at which plastic deformation commences is ________ MPa. (Round off to one decimal place)",
    options: null,
    correct_options: ["5.7-5.7"],
    explanation: "Using Schmid's law: $\\tau_{\\text{CRSS}} = \\sigma \\times \\cos \\phi \\times \\cos \\lambda \\implies \\sigma = 2 / (\\cos 60^\\circ \\times \\cos 45^\\circ) = 2 / (0.5 \\times 0.7071) \\approx 5.7$ MPa."
  },
  {
    subject: "Casting",
    topic: "Forging, Extrusion, and Drawing",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 1,
    negative_marks: 0.00,
    question_text: "The extrusion force required to extrude an aluminum rod of cross-sectional area of 150 mm² to cross-sectional area of 50 mm² is ________ N. (Round off to the nearest integer). Assume that the extrusion constant, which accounts for the flow stress, strain hardening, friction and inhomogeneous deformation, is equal to 2 MPa.",
    options: null,
    correct_options: ["330-330"],
    explanation: "Extrusion force $F = k \\times A_0 \\times \\ln(A_0/A_f)$, where $k = 2$ MPa = 2 N/mm², $A_0 = 150$ mm², $A_f = 50$ mm². $F = 2 \\times 150 \\times \\ln(150/50) = 300 \\times \\ln(3) \\approx 329.6$ N $\\approx 330$ N."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "If $\\begin{bmatrix}1 & 2 \\\\ 8 & 1\\end{bmatrix}\\begin{bmatrix}x \\\\ y\\end{bmatrix} = \\lambda\\begin{bmatrix}x \\\\ y\\end{bmatrix}$, where $x, y$ are not identically zero, then the values of $\\lambda$ are:",
    options: [
      { id: "A", text: "5, −3" },
      { id: "B", text: "4, −4" },
      { id: "C", text: "3, −5" },
      { id: "D", text: "5, −4" }
    ],
    correct_options: ["A"],
    explanation: "Characteristic equation: $\\det\\begin{bmatrix}1-\\lambda & 2 \\\\ 8 & 1-\\lambda\\end{bmatrix} = 0 \\implies (1-\\lambda)^2 - 16 = 0 \\implies 1 - 2\\lambda + \\lambda^2 - 16 = 0 \\implies \\lambda^2 - 2\\lambda - 15 = 0 \\implies (\\lambda - 5)(\\lambda + 3) = 0 \\implies \\lambda = 5, -3$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Differential Equations",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "If $dy/dx = 4xy$, $y(0) = 1$, then:",
    options: [
      { id: "A", text: "$y = 2x^2 + 1$" },
      { id: "B", text: "$y = 2e^{2x^2} - 1$" },
      { id: "C", text: "$y = 2e^{x^2} - 1$" },
      { id: "D", text: "$y = e^{2x^2}$" }
    ],
    correct_options: ["D"],
    explanation: "Separating variables: $dy/y = 4x\\ dx \\implies \\ln y = 2x^2 + C$. Applying initial condition $y(0) = 1 \\implies \\ln(1) = C \\implies C = 0 \\implies y = e^{2x^2}$."
  },
  {
    subject: "Thermodynamics",
    topic: "Heat Transfer",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "A slender, long solid cylindrical metal rod of thermal conductivity $k$, length $L$ and diameter $d$ ($d \\ll L$) has its right end in contact with an infinite liquid heat sink. At steady-state, the temperatures of the right end and the heat sink are $T_2$ and $T_0$. The convection heat transfer coefficient between the liquid heat sink and the right end of the rod is $h$. What is the temperature of the left end $T_1$ at steady-state?",
    options: [
      { id: "A", text: "$T_1 = T_2 + (T_2 - T_0)(hL/k)$" },
      { id: "B", text: "$T_1 = T_2 - (T_2 - T_0)(hL/k)$" },
      { id: "C", text: "$T_1 = T_2 - (T_2 - T_0)(k/hL)$" },
      { id: "D", text: "$T_1 = T_2 + (T_2 - T_0)(k/hL)$" }
    ],
    correct_options: ["A"],
    explanation: "At steady state, the conductive heat flux through the rod equals the convective heat flux at the right end. $q = k(T_1 - T_2)/L = h(T_2 - T_0) \\implies T_1 - T_2 = hL(T_2 - T_0)/k \\implies T_1 = T_2 + (T_2 - T_0)(hL/k)$."
  },
  {
    subject: "Thermodynamics",
    topic: "Dimensional Analysis",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Match the dimensionless numbers listed in Column I with their applications to transport phenomena listed in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Reynolds number | 1. Momentum and mass transfer |\n| Q. Schmidt number | 2. Momentum and heat transfer |\n| R. Prandtl number | 3. Convective and conductive heat transfer |\n| S. Biot number | 4. Laminar to turbulent flow |\n\nOptions:",
    options: [
      { id: "A", text: "P–4, Q–1, R–3, S–2" },
      { id: "B", text: "P–3, Q–2, R–4, S–1" },
      { id: "C", text: "P–4, Q–1, R–2, S–3" },
      { id: "D", text: "P–2, Q–3, R–1, S–4" }
    ],
    correct_options: ["C"],
    explanation: "Reynolds number governs transition from laminar to turbulent flow (P–4). Schmidt number relates momentum and mass transfer (Q–1). Prandtl number relates momentum and heat transfer (R–2). Biot number is the ratio of internal thermal resistance to boundary layer thermal resistance (convective and conductive heat transfer) (S–3)."
  },
  {
    subject: "Phase Transformations",
    topic: "Crystal Structure and Lattice Parameters",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "In a cubic lattice, what is the ratio of interplanar spacings of the $(100)$, $(110)$ and $(111)$ planes?",
    options: [
      { id: "A", text: "$1 : 0.32 : 0.71$" },
      { id: "B", text: "$1 : 0.71 : 0.58$" },
      { id: "C", text: "$1 : 0.58 : 0.71$" },
      { id: "D", text: "$1 : 0.58 : 0.32$" }
    ],
    correct_options: ["B"],
    explanation: "For a cubic lattice, $d_{hkl} = a/\\sqrt{h^2 + k^2 + l^2}$. $d_{100} = a$. $d_{110} = a/\\sqrt{2} \\approx 0.707a$. $d_{111} = a/\\sqrt{3} \\approx 0.577a$. Ratio = $1 : 0.71 : 0.58$."
  },
  {
    subject: "Phase Transformations",
    topic: "Nucleation and Growth",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Constitutional undercooling occurs ahead of the solid-liquid interface where the actual liquid temperature drops below the liquidus temperature. If solute B is rejected from the solidifying solid, then the solute concentration just ahead of the solid-liquid interface (in the constitutional undercooling zone X) will be:",
    options: [
      { id: "A", text: "less than the average composition of the initial liquid phase" },
      { id: "B", text: "greater than the average composition of the initial liquid phase" },
      { id: "C", text: "same as the average composition of the initial liquid phase" },
      { id: "D", text: "independent of the average composition of the initial liquid phase" }
    ],
    correct_options: ["B"],
    explanation: "Constitutional undercooling occurs ahead of the solid-liquid interface because solute B is rejected from the solidifying solid and accumulates in the liquid immediately ahead of the interface. Thus, this region has a solute concentration greater than the average initial liquid composition."
  },
  {
    subject: "Electrochemistry and Corrosion",
    topic: "Corrosion Types and Prevention",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Consider microstructures of a quenched steel tempered at three temperatures $T_1 < T_2 < T_3$ for a fixed time. The cementite particles (average radii $r_1 < r_2 < r_3$, volume fractions $V_1 < V_2 = V_3$) are dispersed in a ferrite matrix. If cementite is more noble than ferrite, which microstructure will have the highest corrosion rate when exposed to a 3.5 wt.% NaCl solution?",
    options: [
      { id: "A", text: "Microstructure at $T_1$" },
      { id: "B", text: "Microstructure at $T_2$" },
      { id: "C", text: "Microstructure at $T_3$" },
      { id: "D", text: "Independent of microstructure" }
    ],
    correct_options: ["A"],
    explanation: "When cementite is more noble (cathodic) than ferrite (anodic), a galvanic couple forms. The corrosion rate is highest when the cathode-to-anode area ratio is largest. At $T_1$, cementite particles are smallest and most numerous, giving the largest total interfacial area and highest corrosion rate."
  },
  {
    subject: "Mechanical Properties",
    topic: "Stress and Strain States",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "An isotropic metallic cuboid block has a coefficient of linear thermal expansion $\\alpha$, Young's modulus $E$ and Poisson's ratio $\\nu$. The dimensions are $a, b, c$ in X, Y, Z directions. It is rigidly constrained against expansion in the X direction but free in Y and Z. It is heated so that temperature increases by $\\Delta T$. What is the CHANGE in the dimension of the cuboid in the Y direction?",
    options: [
      { id: "A", text: "$b(1 - \\nu)\\alpha\\Delta T$" },
      { id: "B", text: "$b(1 + \\nu)\\alpha\\Delta T$" },
      { id: "C", text: "$b\\alpha\\Delta T$" },
      { id: "D", text: "$b(1 + \\alpha)\\Delta T$" }
    ],
    correct_options: ["B"],
    explanation: "Free thermal strain in Y = $\\alpha\\Delta T$. The constraint in X generates a compressive stress $\\sigma_x = -E\\alpha\\Delta T$. The strain in Y due to this stress (via Poisson's effect) = $-\\nu(\\sigma_x/E) = \\nu\\alpha\\Delta T$. Total strain in Y = $\\alpha\\Delta T(1 + \\nu)$. Change in Y dimension = $b(1 + \\nu)\\alpha\\Delta T$."
  },
  {
    subject: "Phase Transformations",
    topic: "Crystallographic Defects",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "Match the entries in Column I with the stacking sequences of the close-packed planes listed in Column II:\n\n| Column I | Column II |\n|---|---|\n| P. Face centered cubic (FCC) structure | 1. ABCABABC |\n| Q. Intrinsic stacking fault in FCC | 2. ABABABAB |\n| R. Across an annealing twin boundary in FCC | 3. ABCABCABC |\n| S. Hexagonal close-packed structure | 4. ABCABCACBACBA |",
    options: [
      { id: "A", text: "P–1, Q–3, R–4, S–2" },
      { id: "B", text: "P–2, Q–3, R–1, S–4" },
      { id: "C", text: "P–3, Q–1, R–4, S–2" },
      { id: "D", text: "P–2, Q–4, R–1, S–3" }
    ],
    correct_options: ["C"],
    explanation: "Perfect FCC stacking is ABCABCABC (P–3). Intrinsic stacking fault removes one plane, giving ABCABABC (Q–1). Across twin boundary, the stacking reverses: ABCABCACBACBA (R–4). HCP structure is ABABAB (S–2)."
  },
  {
    subject: "Mechanical Properties",
    topic: "Fracture Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Hard",
    marks: 2,
    negative_marks: 0.66,
    question_text: "According to Griffith's criterion for the growth of a crack of length $a$ in a brittle isotropic infinitely large plate, the magnitude of total strain energy released is $\\Delta$SE (convex parabolic shape $\\propto a^2$) and the total surface energy is $\\Gamma_s$ (linear function $\\propto a$). At the critical crack length $a_c$ where the crack starts growing, which relationship holds?",
    options: [
      { id: "A", text: "The $\\Delta$SE curve is concave and crosses the $\\Gamma_s$ line before $a_c$" },
      { id: "B", text: "The $\\Delta$SE curve is concave and intersects $\\Gamma_s$ at $a_c$" },
      { id: "C", text: "The $\\Delta$SE curve is convex and runs above the $\\Gamma_s$ line throughout" },
      { id: "D", text: "The $\\Delta$SE curve is convex, and its tangent at $a_c$ is parallel to the $\\Gamma_s$ line" }
    ],
    correct_options: ["D"],
    explanation: "For a Griffith crack, $\\Delta\\text{SE} \\propto a^2$ (convex upward parabolic shape) and $\\Gamma_s = 4a\\gamma$ (linear). The critical crack length $a_c$ is defined by the energy balance where $d(\\Delta\\text{SE})/da = d(\\Gamma_s)/da$, meaning the tangent to the $\\Delta\\text{SE}$ curve is parallel to the $\\Gamma_s$ line. This corresponds to Option D."
  },
  {
    subject: "Casting",
    topic: "Rolling Mechanics",
    q_type: "MCQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.66,
    question_text: "For rolling of slabs, determine the correctness or otherwise of the following Assertion [a] and Reason [r].\nAssertion [a]: Grooves are made on the surface of the rolls parallel to their roll axes to achieve large thickness reduction in a short time.\nReason [r]: Given $\\mu$ is the coefficient of friction between the rolls and the slab, and $\\alpha$ is the angle of bite between the entrance plane and the centreline of the rolls, unaided entry of slab in the rolls can take place only if $\\mu < \\tan \\alpha$.",
    options: [
      { id: "A", text: "Both [a] and [r] are true, and [r] is the correct reason of [a]" },
      { id: "B", text: "Both [a] and [r] are true, but [r] is not the correct reason of [a]" },
      { id: "C", text: "Both [a] and [r] are false" },
      { id: "D", text: "[a] is true, but [r] is false" }
    ],
    correct_options: ["D"],
    explanation: "Assertion [a] is true — grooves increase friction, allowing larger drafts. Reason [r] is false — the correct condition for unaided entry is $\\mu \\ge \\tan \\alpha$ (friction must be greater than or equal to $\\tan \\alpha$, not less than)."
  },
  {
    subject: "Ferrous Alloys",
    topic: "Ironmaking Metallurgy",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "Which of the following statements is/are correct?",
    options: [
      { id: "A", text: "Ultimate analysis of coal involves determination of moisture, volatile matter, fixed carbon and ash" },
      { id: "B", text: "Reduction of wustite in blast furnace occurs at the lower part of the stack" },
      { id: "C", text: "Roasting involves reduction of sulfide ores to pure metals" },
      { id: "D", text: "White metal (impure $\\text{Cu}_2\\text{S}$) is produced by oxidizing Fe and S during smelting of Cu-Fe matte" }
    ],
    correct_options: ["B", "D"],
    explanation: "Proximate analysis (not ultimate) determines moisture, volatile matter, fixed carbon, and ash. Wustite reduction by CO occurs in the lower stack/upper bosh (B). Roasting converts sulfide ores to oxide form, not pure metals. White metal ($\\text{Cu}_2\\text{S}$) is indeed produced by oxidizing Fe and S from matte (D)."
  },
  {
    subject: "Mechanical Properties",
    topic: "Creep",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A creep test of a pure polycrystalline metal is performed in tension and the creep strain rate is observed to decrease during the primary stage. The creep mechanism is later determined to be dislocation-climb-controlled. The observed decrease in creep strain rate is/are due to:",
    options: [
      { id: "A", text: "an increase in dislocation density" },
      { id: "B", text: "grain growth" },
      { id: "C", text: "a decrease in the dislocation density" },
      { id: "D", text: "an increase in the cross-sectional area of the sample" }
    ],
    correct_options: ["A"],
    explanation: "During primary creep under dislocation climb, dislocations accumulate and their density increases. The higher dislocation density leads to work hardening which impedes further dislocation motion, causing the creep rate to decrease."
  },
  {
    subject: "Casting",
    topic: "Fusion Welding",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "Which of the following statements is/are correct for joining processes?",
    options: [
      { id: "A", text: "In case of soldering and brazing, the filler material has a melting point lower than that of the metals joined" },
      { id: "B", text: "In tungsten inert gas welding, tungsten is the filler material" },
      { id: "C", text: "Friction welding is a solid-state joining process" },
      { id: "D", text: "The following reaction is associated with thermit welding: $\\text{C}_2\\text{H}_2\\text{(g)} + 5/2\\ \\text{O}_2\\text{(g)} \\rightarrow 2\\text{CO}_2\\text{(g)} + \\text{H}_2\\text{O(g)} + \\text{Heat}$" }
    ],
    correct_options: ["A", "C"],
    explanation: "In soldering/brazing, only the filler melts (lower melting point) (A). In TIG, tungsten is a non-consumable electrode, not the filler. Friction welding is a solid-state process (C). The reaction in D describes acetylene combustion, not thermit welding."
  },
  {
    subject: "Casting",
    topic: "Casting Defects and Quality Control",
    q_type: "MSQ",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "Which of the following statements is/are correct for non-destructive testing?",
    options: [
      { id: "A", text: "Liquid dye penetration technique can be utilized for detecting surface cracks" },
      { id: "B", text: "In radiographic examination, internal cracks cannot be detected" },
      { id: "C", text: "Eddy current-based techniques can be used for detecting sub-surface defects in pure alumina at room temperature" },
      { id: "D", text: "Ultrasonic inspection is unsuitable for inspecting sub-surface defects in high damping capacity material (e.g., cast iron)" }
    ],
    correct_options: ["A", "D"],
    explanation: "Liquid dye penetrant detects surface defects (A). Radiography can detect internal cracks. Eddy current requires electrical conductivity (alumina is an insulator at room temp). Cast iron attenuates/damps ultrasonic waves rapidly, making ultrasonic inspection unsuitable (D)."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Probability and Statistics",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "The following data is obtained from an experiment:\n\n| $x$ | 1 | 2 | 3 |\n|---|---|---|---|\n| $y$ | 8 | 15 | 19 |\n\nIf the data is fit using the straight line $y = mx + c$ using the least-squares method, then the value of $m$ is ________. (Round off to one decimal place)",
    options: null,
    correct_options: ["5.5-5.5"],
    explanation: "Using least squares formulas: $\\sum x = 6$, $\\sum y = 42$, $\\sum x^2 = 14$, $\\sum xy = 95$, $n = 3$. Mean of $x = 2$, mean of $y = 14$. $m = \\frac{n\\sum xy - \\sum x \\sum y}{n\\sum x^2 - (\\sum x)^2} = \\frac{3(95) - 6(42)}{3(14) - 36} = \\frac{285 - 252}{42 - 36} = \\frac{33}{6} = 5.5$."
  },
  {
    subject: "Engineering Mathematics",
    topic: "Calculus",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "The value of the integral $\\int_{0}^{1} x e^{-x} dx$ is ________. (Round off to two decimal places)",
    options: null,
    correct_options: ["0.26-0.26"],
    explanation: "Integrating by parts: $\\int x e^{-x} dx = -xe^{-x} - e^{-x} = -e^{-x}(x+1)$. Evaluating from 0 to 1 gives $[-e^{-1}(2)] - [-e^0(1)] = 1 - 2/e \\approx 1 - 2/2.7183 = 0.264 \\approx 0.26$."
  },
  {
    subject: "Phase Transformations",
    topic: "Nucleation and Growth",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "The equilibrium vacancy concentration in element A at 500 K is ________ $\\times 10^{-4}$. (Round off to one decimal place).\n\nGiven: Enthalpy of vacancy formation is 0.5 eV, Entropy of vacancy formation is $3k_B$, Boltzmann constant $k_B$ is $8.62 \\times 10^{-5}$ eV K⁻¹.",
    options: null,
    correct_options: ["1.8-1.8"],
    explanation: "Vacancy concentration $X_v = \\exp(\\Delta S_f/k_B) \\exp(-\\Delta H_f / k_B T) = \\exp(3) \\times \\exp(-0.5 / (8.62 \\times 10^{-5} \\times 500)) \\approx 20.0855 \\times \\exp(-0.5 / 0.0431) \\approx 20.0855 \\times \\exp(-11.6009) \\approx 20.0855 \\times 9.1576 \\times 10^{-6} \\approx 1.84 \\times 10^{-4}$."
  },
  {
    subject: "Mechanical Properties",
    topic: "Advanced Plasticity",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A component undergoes cyclic loading under a mean stress of 100 MPa. If the ultimate tensile strength of the material is 1000 MPa and the fatigue limit under fully reversed loading is 250 MPa, then the fatigue limit (stress amplitude in MPa) under the given mean stress, according to the Goodman relationship, is ________. (Round off to the nearest integer)",
    options: null,
    correct_options: ["225-225"],
    explanation: "Goodman relation: $\\sigma_a / \\sigma_e + \\sigma_m / \\sigma_{uts} = 1 \\implies \\sigma_a / 250 + 100 / 1000 = 1 \\implies \\sigma_a / 250 + 0.1 = 1 \\implies \\sigma_a / 250 = 0.9 \\implies \\sigma_a = 225$ MPa."
  },
  {
    subject: "Phase Transformations",
    topic: "Solid State Transformations",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "In a gas carburization process at a constant temperature, the carbon concentration of 0.8 wt.% was achieved at a depth of 0.3 mm from the surface after 1 hour. The time required (in hours) to achieve the same carbon concentration of 0.8 wt.% at a depth of 0.6 mm from the surface is ________. (Round off to the nearest integer)",
    options: null,
    correct_options: ["4-4"],
    explanation: "The penetration depth $x$ is proportional to $\\sqrt{t}$ under constant temperature: $x_1/\\sqrt{t_1} = x_2/\\sqrt{t_2} \\implies 0.3/\\sqrt{1} = 0.6/\\sqrt{t_2} \\implies \\sqrt{t_2} = 2 \\implies t_2 = 4$ hours."
  },
  {
    subject: "Thermodynamics",
    topic: "Solutions and Mixtures",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "An ideal solution is formed by mixing 10 g of A and 50 g of B at 673 K. The molar free energy of mixing is ________ kJ/mol. (Round off to one decimal place).\n\nGiven: Atomic weight of A is 40 g/mol, Atomic weight of B is 60 g/mol, Universal gas constant R is 8.314 J/(mol K).",
    options: null,
    correct_options: ["-3.0--3.0"],
    explanation: "Moles of A = $10/40 = 0.25$ mol, Moles of B = $50/60 = 0.833$ mol. Total moles = $1.083$ mol. Mole fractions: $X_A = 0.25/1.083 \\approx 0.231$, $X_B \\approx 0.769$. $\\Delta G_{\\text{mix}} = RT(X_A\\ln X_A + X_B\\ln X_B) = 8.314 \\times 673 \\times (0.231\\ln 0.231 + 0.769\\ln 0.769) \\approx -3.0$ kJ/mol."
  },
  {
    subject: "Electrochemistry and Corrosion",
    topic: "Corrosion Types and Prevention",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "The cupric ion ($Cu^{2+}$) concentration in the electrolyte (at 298 K) required to make the potential of pure copper equal to 0.17 V is ________ $\\times 10^{-6}$ gram-mol/litre. (Round off to two decimal places).\n\nGiven: Standard reduction potential of $Cu^{2+}/Cu$ is 0.34 V, Gas constant R is 8.314 J/(mol K), Faraday's constant F is 96500 C/mol.",
    options: null,
    correct_options: ["1.8-1.8"],
    explanation: "Reduction: $Cu^{2+} + 2e^- \\rightarrow Cu$. Nernst Equation: $E = E^\\circ + \\frac{RT}{nF} \\ln[Cu^{2+}] \\implies 0.17 = 0.34 + \\frac{8.314 \\times 298}{2 \\times 96500} \\ln[Cu^{2+}] \\implies \\ln[Cu^{2+}] = -13.25 \\implies [Cu^{2+}] \\approx 1.76 \\times 10^{-6}$ M."
  },
  {
    subject: "Phase Transformations",
    topic: "Solid State Transformations",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A non-porous spherical $\\text{Fe}_2\\text{O}_3$ particle of initial radius $5 \\times 10^{-2}$ m is reduced by $\\text{H}_2$. Under the given conditions, the reduction process is controlled by the chemical reaction at the interface. If the reaction rate constant is $5 \\times 10^{-5}$ m/s, the radius of the unreacted $\\text{Fe}_2\\text{O}_3$ core after 600 s is ________ $\\times 10^{-2}$ m. (Round off to the nearest integer)",
    options: null,
    correct_options: ["2-2"],
    explanation: "For SCM with interface reaction control: $r = r_0 - kt$. Given $r_0 = 5 \\times 10^{-2}$ m, $k = 5 \\times 10^{-5}$ m/s, $t = 600$ s. $r = 5 \\times 10^{-2} - 5 \\times 10^{-5} \\times 600 = 5 \\times 10^{-2} - 3 \\times 10^{-2} = 2 \\times 10^{-2}$ m."
  },
  {
    subject: "Thermodynamics",
    topic: "Heat Transfer",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A long metallic cylindrical rod of radius 0.1 mm is placed in a vacuum and carries an electric current of 0.3 A. The rod loses heat to the ambient (at 300 K) only via radiation. If the electrical resistivity of the rod is $10^{-8}\\ \\Omega$ m, the steady-state temperature of the rod is ________ K. (Round off to the nearest integer).\n\nGiven: Stefan-Boltzmann constant is $5.67 \\times 10^{-8}$ W m⁻² K⁻⁴.",
    options: null,
    correct_options: ["307-307"],
    explanation: "At steady state: $P_{\\text{in}} = P_{\\text{out}} \\implies \\frac{I^2 \\rho_e L}{\\pi r^2} = \\sigma (2\\pi r L) (T^4 - T_0^4) \\implies T^4 - T_0^4 = \\frac{I^2 \\rho_e}{2\\pi^2 r^3 \\sigma} \\approx 8.044 \\times 10^8$. $T^4 = (300)^4 + 8.044 \\times 10^8 = 89.044 \\times 10^8 \\implies T \\approx 307.2$ K."
  },
  {
    subject: "Non-Ferrous Alloys",
    topic: "Extraction Process Flowsheets",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "1000 kg of a sphalerite concentrate containing 60 wt.% ZnS is completely roasted using pure oxygen. The stoichiometric mass of oxygen required is ________ kg. (Round off to one decimal place).\n\nGiven: Atomic weights of Zn is 65 g/mol, S is 32 g/mol, O is 16 g/mol.",
    options: null,
    correct_options: ["296.9-296.9"],
    explanation: "Roasting reaction: $2\\text{ZnS} + 3\\text{O}_2 \\rightarrow 2\\text{ZnO} + 2\\text{SO}_2$. Mass of ZnS = $0.60 \\times 1000 = 600$ kg. Molar mass of ZnS = $65 + 32 = 97$ g/mol. Moles of ZnS = $600000 / 97 \\approx 6185.57$ mol. Stoichiometric moles of $\\text{O}_2$ required = $1.5 \\times 6185.57 \\approx 9278.35$ mol. Mass of $\\text{O}_2$ = $9278.35 \\times 32 = 296907.2$ g $\\approx 296.9$ kg."
  },
  {
    subject: "Phase Diagrams",
    topic: "Invariant Reactions",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "800 grams of A–B alloy containing 20 wt.% B is held at temperature $T_1$. If at temperature $T_1$ the solubility limit of B in the $\\alpha$ phase is 10 wt.% B and the $\\beta$ phase contains 90 wt.% B, then the weight of B dissolved in $\\alpha$ at that temperature is ______ grams. (Round off to the nearest integer).",
    options: null,
    correct_options: ["70-70"],
    explanation: "At $T_1$, $C_\\alpha = 10\\%$ B, $C_\\beta = 90\\%$ B. Lever rule for fraction of $\\alpha$: $f_\\alpha = (90 - 20)/(90 - 10) = 70/80 = 0.875$. Total mass of $\\alpha$ phase = $0.875 \\times 800 = 700$ grams. Mass of B dissolved in $\\alpha$ phase = $0.10 \\times 700 = 70$ grams."
  },
  {
    subject: "Electrochemistry and Corrosion",
    topic: "Corrosion Types and Prevention",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A mild steel pipeline is cathodically protected by connecting it to a Zinc sacrificial anode. If the average current density is 10 mA/m², then the quantity of Zinc consumed per square meter of the pipeline per year is ________ grams. (Round off to the nearest integer).\n\nGiven: Atomic weight of Zn is 65 g/mol, Faraday's constant is 96500 C/mol, 1 year = 365 days.",
    options: null,
    correct_options: ["106-106"],
    explanation: "Current density $i = 10$ mA/m² = $0.01$ A/m². Time $t = 365 \\times 24 \\times 3600 \\approx 3.1536 \\times 10^7$ s. Total charge $Q = i \\times t = 3.1536 \\times 10^5$ C/m². Mass of Zn = $\\frac{Q \\times M}{n \\times F} = \\frac{3.1536 \\times 10^5 \\times 65}{2 \\times 96500} \\approx 106.2$ grams."
  },
  {
    subject: "Mechanical Properties",
    topic: "Fracture Mechanics",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "A large rectangular component is undergoing fully-reversed cyclic loading. The component is known to grow the dominant fatigue crack from the outer surface. If the stress amplitude is 100 MPa and the critical stress intensity factor ($K_{IC}$) of the material is 50 MPa m^(1/2), then the crack length at which the component will fail catastrophically is ________ mm. (Round off to one decimal place).\n\nGiven: The geometric factor $\\alpha$ for this loading condition is 1.12.",
    options: null,
    correct_options: ["63.5-63.5"],
    explanation: "$K_{IC} = \\alpha \\sigma_a \\sqrt{\\pi a} \\implies 50 = 1.12 \\times 100 \\times \\sqrt{\\pi a} \\implies \\sqrt{\\pi a} = 50 / 112 \\approx 0.4464 \\implies \\pi a \\approx 0.1993 \\implies a \\approx 0.06346$ m $\\approx 63.5$ mm."
  },
  {
    subject: "Casting",
    topic: "Gating Systems",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "In a casting process, for a simple vertical gating system with a gate of cross-sectional area 2 cm² and sprue height of 10 cm, the filling time for a mould cavity of dimensions 40 cm × 20 cm × 10 cm is ________ s. (Round off to one decimal place).\n\nGiven: Acceleration due to gravity (g) is 980 cm/s².",
    options: null,
    correct_options: ["28.6-28.6"],
    explanation: "Mould volume $V = 40 \\times 20 \\times 10 = 8000$ cm³. Velocity $v = \\sqrt{2gh} = \\sqrt{2 \\times 980 \\times 10} = 140$ cm/s. Flow rate $Q = A_g \\times v = 2 \\times 140 = 280$ cm³/s. Filling time $t = V/Q = 8000/280 \\approx 28.57$ s $\\approx 28.6$ s."
  },
  {
    subject: "Casting",
    topic: "Fusion Welding",
    q_type: "NAT",
    pyq_year: 2024,
    difficulty: "Medium",
    marks: 2,
    negative_marks: 0.00,
    question_text: "In an arc welding process, the current is 200 A, the voltage is 20 V, and the heat transfer efficiency is 0.9. If the weld cross-sectional area is 2 mm² and the actual heat input per unit volume is 200 J/mm³, then the velocity of welding is ________ mm/s. (Round off to the nearest integer)",
    options: null,
    correct_options: ["9-9"],
    explanation: "Effective Power $P_{\\text{eff}} = \\eta \\times V \\times I = 0.9 \\times 20 \\times 200 = 3600$ J/s. Heat input per unit volume $Q_v = \\frac{P_{\\text{eff}}}{v \\times A} \\implies 200 = \\frac{3600}{v \\times 2} \\implies 400v = 3600 \\implies v = 9$ mm/s."
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
  console.log(`📝 Processing ${questionsData.length} GATE MT 2024 questions...\n`);

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
  console.log('  GATE MT 2024 Seeding Complete!');
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
