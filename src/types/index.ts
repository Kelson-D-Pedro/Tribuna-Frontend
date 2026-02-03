/* ============================================
   TRIBUNA - TypeScript Types
   ============================================ */

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  titles: UserTitle[];
  followedTopics: string[];
  followedUsers: string[];
  debateStats: UserDebateStats;
}

export interface UserTitle {
  id: string;
  domain: string;
  title: string;
  level: 'novice' | 'apprentice' | 'practitioner' | 'expert' | 'master';
  earnedAt: Date;
}

export interface UserDebateStats {
  totalDebates: number;
  hoursDebated: number;
  topicsExplored: number;
  averageClarity: number;
  averageCoherence: number;
  averagePrecision: number;
  averageDepth: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// DEBATE ROOM
// ============================================

export type DebateType = 'human-vs-human' | 'human-vs-ai';
export type DebateFormat = 'spoken' | 'spoken-text';
export type DebateStatus = 'live' | 'scheduled' | 'ended';
export type DebateLevel = 'beginner' | 'intermediate' | 'advanced';
export type ParticipantRole = 'debater' | 'moderator' | 'audience';

export interface DebateRoom {
  id: string;
  theme: string;
  description: string;
  type: DebateType;
  format: DebateFormat;
  status: DebateStatus;
  level: DebateLevel;
  creatorId: string;
  creator: User;
  moderatorId?: string;
  moderator?: User;
  debaters: Debater[];
  audienceCount: number;
  maxDebaters: number;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  rules: DebateRules;
  tags: string[];
}

export interface DebateRules {
  turnDuration: number; // seconds
  maxTurns?: number;
  allowAudienceQuestions: boolean;
  allowTranscription: boolean;
  moderatorCanMute: boolean;
}

export interface Debater {
  userId: string;
  user: User;
  position: string;
  joinedAt: Date;
  turnsCount: number;
  isActive: boolean;
}

export interface DebateTurn {
  id: string;
  debateId: string;
  speakerId: string;
  speaker: User;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  transcription?: string;
  highlights?: SemanticHighlight[];
}

export interface SemanticHighlight {
  id: string;
  text: string;
  type: 'claim' | 'evidence' | 'counter-argument' | 'concession' | 'question';
  startIndex: number;
  endIndex: number;
}

// ============================================
// AUDIENCE INTERACTIONS
// ============================================

export type AudienceReactionType = 'agreement' | 'doubt' | 'disagreement';

export interface AudienceReaction {
  type: AudienceReactionType;
  count: number;
  percentage: number;
}

export interface AudienceQuestion {
  id: string;
  userId: string;
  user: User;
  question: string;
  submittedAt: Date;
  isApproved: boolean;
  isAnswered: boolean;
}

export interface AudienceVote {
  clarity: number;       // 1-5
  consistency: number;   // 1-5
  impact: number;        // 1-5
}

// ============================================
// MODERATION
// ============================================

export type ModeratorAction = 
  | 'mute-debater'
  | 'unmute-debater'
  | 'topic-warning'
  | 'time-warning'
  | 'pause-debate'
  | 'resume-debate'
  | 'end-debate'
  | 'mute-audience'
  | 'approve-question'
  | 'reject-question';

export interface ModerationLog {
  id: string;
  debateId: string;
  moderatorId: string;
  action: ModeratorAction;
  targetUserId?: string;
  reason?: string;
  timestamp: Date;
}

// ============================================
// FEEDBACK & EVALUATION
// ============================================

export interface DebateFeedback {
  id: string;
  debateId: string;
  userId: string;
  summary: string;
  evaluation: EvaluationCriteria;
  aiComments?: string;
  titleProgress?: TitleProgress;
  createdAt: Date;
}

export interface EvaluationCriteria {
  clarity: CriterionScore;
  coherence: CriterionScore;
  precision: CriterionScore;
  depth: CriterionScore;
  overall: number;
}

export interface CriterionScore {
  score: number;        // 1-10
  previousScore: number;
  change: number;
  feedback: string;
}

export interface TitleProgress {
  domain: string;
  currentTitle: string;
  nextTitle: string;
  progressPercentage: number;
  pointsEarned: number;
  pointsToNext: number;
}

// ============================================
// JURY/EVALUATOR
// ============================================

export interface JuryEvaluation {
  id: string;
  debateId: string;
  evaluatorId: string;
  evaluator: User;
  debaterId: string;
  criteria: EvaluationCriteria;
  markedExcerpts: MarkedExcerpt[];
  analyticalComments: string;
  createdAt: Date;
}

export interface MarkedExcerpt {
  id: string;
  turnId: string;
  text: string;
  startTime: number;
  endTime: number;
  type: 'strength' | 'weakness' | 'notable';
  comment: string;
}

// ============================================
// HISTORY & ARCHIVE
// ============================================

export interface DebateHistoryItem {
  id: string;
  debate: DebateRoom;
  role: ParticipantRole;
  participatedAt: Date;
  feedback?: DebateFeedback;
  recording?: DebateRecording;
}

export interface DebateRecording {
  id: string;
  debateId: string;
  audioUrl: string;
  transcriptionUrl?: string;
  duration: number;
  createdAt: Date;
}

// ============================================
// ROOM CREATION
// ============================================

export interface RoomCreationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface RoomCreationData {
  theme: string;
  description: string;
  format: DebateFormat;
  type: DebateType;
  level: DebateLevel;
  rules: Partial<DebateRules>;
  scheduledAt?: Date;
  tags: string[];
}

// ============================================
// UI STATE
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

// ============================================
// AUDIO/WEBRTC
// ============================================

export interface AudioState {
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number;
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface WebRTCPeer {
  odId: string;
  odState: RTCPeerConnectionState;
  isConnected: boolean;
}
