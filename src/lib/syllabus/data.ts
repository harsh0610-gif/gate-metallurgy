export interface SyllabusSubject {
  name: string;
  topics: string[];
}

export const GATE_MT_SYLLABUS: SyllabusSubject[] = [
  {
    name: "Engineering Mathematics",
    topics: [
      "Linear Algebra",
      "Calculus",
      "Differential Equations",
      "Complex Variables",
      "Probability and Statistics",
      "Numerical Methods",
    ],
  },
  {
    name: "Thermodynamics",
    topics: [
      "Laws of Thermodynamics",
      "Phase Equilibria",
      "Thermodynamic Potentials",
      "Solutions and Mixtures",
    ],
  },
  {
    name: "Phase Transformations",
    topics: [
      "Solidification",
      "Solid State Transformations",
      "TTT and CCT Diagrams",
      "Nucleation and Growth",
    ],
  },
  {
    name: "Mechanical Properties",
    topics: [
      "Stress and Strain",
      "Elastic and Plastic Deformation",
      "Hardness",
      "Fatigue",
      "Creep",
      "Fracture Mechanics",
    ],
  },
  {
    name: "Electrochemistry and Corrosion",
    topics: [
      "Electrochemical Cells",
      "Corrosion Types",
      "Corrosion Prevention",
    ],
  },
  {
    name: "Manufacturing",
    topics: ["Casting", "Forming", "Welding", "Powder Metallurgy"],
  },
  {
    name: "Extractive Metallurgy",
    topics: ["Pyrometallurgy", "Hydrometallurgy", "Electrometallurgy"],
  },
  {
    name: "Structure of Materials",
    topics: ["Crystal Structure", "Defects", "Diffusion", "Phase Diagrams"],
  },
];

export const SYLLABUS_STORAGE_KEY = "gate-mt-syllabus-progress";

export function topicKey(subjectName: string, topicName: string) {
  return `${subjectName}::${topicName}`;
}

export function getTotalTopicCount() {
  return GATE_MT_SYLLABUS.reduce((sum, subject) => sum + subject.topics.length, 0);
}
