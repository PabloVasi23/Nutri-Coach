
export enum EvidenceLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export enum UserGoal {
  MUSCLE_GAIN = 'Muscle Gain',
  FAT_LOSS = 'Fat Loss',
  ENDURANCE = 'Endurance',
  GENERAL_HEALTH = 'General Health'
}

export enum DietStyle {
  CARNIVORE = 'Carnívoro',
  VEGETARIAN = 'Vegetariano',
  VEGAN = 'Vegano',
  BALANCED = 'Equilibrado'
}

export enum ArgentineRegion {
  PAMPA = 'Región Pampeana',
  NORTE = 'Norte Argentino',
  CUYO = 'Cuyo',
  PATAGONIA = 'Patagonia'
}

export enum Language {
  EN = 'English',
  ES = 'Español',
  PT = 'Português'
}

export interface RecommendedExercise {
  name: string;
  reason: string;
  sets: string;
  focus: string;
}

export interface DietPlanDay {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  regionalNotes: string;
}

export interface PhysiqueAnalysis {
  assessment: string;
  estimatedBodyFat: string;
  strengths: string[];
  focusAreas: string[];
  beginnerTips: string;
  aestheticExercises: RecommendedExercise[];
  postureCorrection: string;
  suggestedDiet: DietPlanDay;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  goal: UserGoal;
  sport: string;
  restrictions: string[];
  language: Language;
  dietStyle: DietStyle;
  region: ArgentineRegion;
  avatarImages: string[];
  physiqueAnalysis?: PhysiqueAnalysis;
}

export interface SupplementAdvice {
  name: string;
  howToTake: string;
  isSmartForYou: boolean;
  logic: string;
}

export interface SupplementScanResult {
  supplements: SupplementAdvice[];
  overallWarning: string;
}

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  timing: string;
  mechanism: string;
  evidenceLevel: EvidenceLevel;
}

export type View = 'landing' | 'quick_scan' | 'user_home' | 'onboarding' | 'admin_dashboard' | 'admin_verification' | 'calculators' | 'chat';
