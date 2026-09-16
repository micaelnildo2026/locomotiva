export interface LocomotivePart {
  id: string;
  name: string;
  technicalName: string;
  category: 'propulsao' | 'chassis' | 'frenagem' | 'seguranca' | 'cabine' | 'abastecimento';
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  engineeringPrinciples: string;
  structuralAnalysis?: string;
  fluidDynamics?: string;
  joinvilleDataJustification?: string;
  references?: string;
  dimensions: string;
  materials: string;
  freecadWorkbench: string;
  freecadOperation: string;
  explodedOffset: [number, number, number]; // [x, y, z] for 3d exploded view
  importanceRating: number; // 1-5
  maintenanceInterval: string;
}

export interface LocomotivePhysicsState {
  regulatorPercent: number;     // 0 - 100%
  reverserPercent: number;      // -100% to +100% (corte Walschaerts)
  boilerPressureBar: number;    // 0 - 18 bar (ideal 14 bar)
  waterLevelPercent: number;    // 0 - 100%
  trainBrakeBar: number;        // Westinghouse line (0 - 5 bar)
  locoBrakeBar: number;         // Independent brake
  currentSpeedKmh: number;      // km/h
  tractiveEffortKn: number;     // kN de força de tração
  powerOutputHp: number;        // Potência atual em HP
  wheelAdhesionStatus: 'normal' | 'slipping' | 'sanded';
  coalKg: number;               // Combustível restante
  waterLiters: number;          // Água restante
  trackGradientPercent: number; // Inclinação da rampa (-3% a +3%)
  sandApplied: boolean;
}

export interface CharacterDialogChoice {
  text: string;
  nextDialogId?: string;
  actionReward?: string;
  acceptedMissionId?: string;
}

export interface CharacterDialog {
  id: string;
  speaker: string;
  text: string;
  characterMood: 'feliz' | 'atenta' | 'tecnica' | 'entusiasmada' | 'reflexiva';
  choices: CharacterDialogChoice[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  archetype: 'Terceira Idade' | 'Pessoa com Deficiência (PCD)' | 'Jovem Universitário' | 'Maquinista Instrutor';
  age: number;
  avatarColor: string;
  avatarIcon: string;
  biography: string;
  accessibilityNeeds: string[];
  feedbackForCity: string;
  initialDialogId: string;
  dialogs: Record<string, CharacterDialog>;
}

export interface Mission {
  id: string;
  title: string;
  giver: string;
  description: string;
  targetStationId: string;
  objective: string;
  scoreBonus: number;
  completed: boolean;
  requirements: {
    maxComfortJolt: number; // For Dona Helena (suavidade)
    alignToleranceMeters: number; // For Tiago (parada no vão zero)
    targetArrivalTimeSeconds: number; // For Beatriz (pontualidade)
    maxBoilerPressureBar: number; // For Mestre Rodolfo
  };
}

export interface CityStation {
  id: string;
  name: string;
  zone: string;
  line: 'vlt_passageiros' | 'ferrovia_cargas' | 'intermodal';
  distanceKm: number;
  accessibilityFeatures: string[];
  elderlyFeatures: string[];
  studentFeatures: string[];
  urbanIntegration: string;
  xPosition: number; // coordinate for map
  yPosition: number;
}

export type ActiveTab = 
  | 'game'
  | 'model3d'
  | 'physics'
  | 'encyclopedia'
  | 'urbanism'
  | 'network'
  | 'characters'
  | 'freecad'
  | 'unreal'
  | 'references'
  | 'legal';
