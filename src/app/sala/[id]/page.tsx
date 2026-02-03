'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { DebateCenter } from '@/components/debate/DebateCenter';
import { ArgumentTimeline } from '@/components/debate/ArgumentTimeline';
import { DebateControls } from '@/components/debate/DebateControls';
import { AudiencePanel } from '@/components/debate/AudiencePanel';
import { ModeratorPanel } from '@/components/debate/ModeratorPanel';
import { Button } from '@/components/ui/Button';
import { LiveBadge, LevelBadge, DebateTypeBadge } from '@/components/ui/Badge';
import type { DebateRoom, DebateTurn, User, ParticipantRole, AudienceReaction, AudienceQuestion } from '@/types';

// Mock data
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'debater1',
  displayName: 'Maria Silva',
  createdAt: new Date(),
  titles: [],
  followedTopics: [],
  followedUsers: [],
  debateStats: { totalDebates: 12, hoursDebated: 8, topicsExplored: 5, averageClarity: 7.5, averageCoherence: 8.0, averagePrecision: 7.8, averageDepth: 7.2 },
};

const mockRoom: DebateRoom = {
  id: '1',
  theme: 'A consciência pode ser explicada pela neurociência?',
  description: 'Debate sobre os limites do materialismo na explicação da experiência subjetiva.',
  type: 'human-vs-human',
  format: 'spoken',
  status: 'live',
  level: 'advanced',
  creatorId: '2',
  creator: { ...mockUser, id: '2', displayName: 'João Santos', username: 'joao' },
  moderatorId: '4',
  moderator: { ...mockUser, id: '4', displayName: 'Paulo Moderador', username: 'paulo_mod' },
  debaters: [
    { userId: '2', user: { ...mockUser, id: '2', displayName: 'João Santos' }, position: 'Materialismo', joinedAt: new Date(), turnsCount: 3, isActive: true },
    { userId: '3', user: { ...mockUser, id: '3', displayName: 'Ana Oliveira' }, position: 'Dualismo', joinedAt: new Date(), turnsCount: 2, isActive: true },
  ],
  audienceCount: 47,
  maxDebaters: 2,
  startedAt: new Date(Date.now() - 1800000),
  createdAt: new Date(Date.now() - 3600000),
  rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
  tags: ['Filosofia da Mente', 'Neurociência', 'Consciência'],
};

const mockTurns: DebateTurn[] = [
  {
    id: '1',
    debateId: '1',
    speakerId: '2',
    speaker: { ...mockUser, id: '2', displayName: 'João Santos' },
    startedAt: new Date(Date.now() - 1500000),
    endedAt: new Date(Date.now() - 1320000),
    duration: 180,
    transcription: 'A neurociência tem feito avanços extraordinários na última década. Conseguimos mapear as correlações neurais da consciência com precisão cada vez maior. Cada estado mental corresponde a um estado cerebral identificável. Isso sugere fortemente que a consciência é um fenômeno emergente do cérebro físico.',
  },
  {
    id: '2',
    debateId: '1',
    speakerId: '3',
    speaker: { ...mockUser, id: '3', displayName: 'Ana Oliveira' },
    startedAt: new Date(Date.now() - 1200000),
    endedAt: new Date(Date.now() - 1020000),
    duration: 180,
    transcription: 'Correlação não implica identidade. O problema difícil da consciência permanece: por que existe experiência subjetiva? Por que não somos apenas processadores de informação sem qualquer "sentir"? A ciência pode explicar o "como" mas não o "por quê" da experiência consciente.',
  },
  {
    id: '3',
    debateId: '1',
    speakerId: '2',
    speaker: { ...mockUser, id: '2', displayName: 'João Santos' },
    startedAt: new Date(Date.now() - 900000),
    endedAt: new Date(Date.now() - 720000),
    duration: 180,
    transcription: 'O "problema difícil" é mal formulado. É um resquício de intuições dualistas pré-científicas. À medida que nossa ciência avança, esses mistérios se dissolvem. A consciência será explicada assim como a vida foi - não por um élan vital, mas por bioquímica.',
  },
];

const mockReactions: AudienceReaction[] = [
  { type: 'agreement', count: 23, percentage: 49 },
  { type: 'doubt', count: 12, percentage: 26 },
  { type: 'disagreement', count: 12, percentage: 25 },
];

const mockQuestions: AudienceQuestion[] = [
  {
    id: '1',
    userId: '10',
    user: { ...mockUser, id: '10', displayName: 'Carlos Mendes' },
    question: 'Como o materialismo explica a intencionalidade - o fato de pensamentos serem "sobre" algo?',
    submittedAt: new Date(Date.now() - 600000),
    isApproved: true,
    isAnswered: false,
  },
  {
    id: '2',
    userId: '11',
    user: { ...mockUser, id: '11', displayName: 'Laura Santos' },
    question: 'Existem experimentos que poderiam falsificar o materialismo da consciência?',
    submittedAt: new Date(Date.now() - 300000),
    isApproved: true,
    isAnswered: false,
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DebateRoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [room] = useState<DebateRoom>(mockRoom);
  const [turns] = useState<DebateTurn[]>(mockTurns);
  const [reactions] = useState<AudienceReaction[]>(mockReactions);
  const [questions] = useState<AudienceQuestion[]>(mockQuestions);
  
  // Current user role (would come from auth context in real app)
  const [userRole] = useState<ParticipantRole>('debater');
  const [currentUserId] = useState('2'); // João Santos
  
  // Audio/speaking state
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>('2');
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(120);
  const [isRequestingTurn, setIsRequestingTurn] = useState(false);
  
  // Sidebar state
  const [showAudience, setShowAudience] = useState(false);

  // Timer simulation
  useEffect(() => {
    if (activeSpeakerId && turnTimeRemaining > 0) {
      const timer = setInterval(() => {
        setTurnTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeSpeakerId, turnTimeRemaining]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleRequestTurn = () => {
    setIsRequestingTurn(!isRequestingTurn);
  };

  const handleLeaveRoom = () => {
    router.push('/');
  };

  const isActiveSpeaker = activeSpeakerId === currentUserId;
  const currentDebater = room.debaters.find((d) => d.userId === activeSpeakerId);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </Button>
          <div className={styles.roomInfo}>
            <div className={styles.roomBadges}>
              <LiveBadge />
              <LevelBadge level={room.level} />
              <DebateTypeBadge type={room.type} />
            </div>
            <h1 className={styles.roomTheme}>{room.theme}</h1>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.audienceToggle}
            onClick={() => setShowAudience(!showAudience)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span>{room.audienceCount}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Sidebar - Argument Timeline */}
        <aside className={styles.sidebar}>
          <ArgumentTimeline 
            turns={turns}
            activeSpeakerId={activeSpeakerId}
            currentUserId={currentUserId}
          />
        </aside>

        {/* Center - Debate Zone */}
        <main className={styles.main}>
          <DebateCenter
            room={room}
            activeSpeakerId={activeSpeakerId}
            currentDebater={currentDebater}
            turnTimeRemaining={turnTimeRemaining}
            isSpeaking={isSpeaking && isActiveSpeaker}
            userRole={userRole}
            currentUserId={currentUserId}
          />

          {/* Controls */}
          <DebateControls
            userRole={userRole}
            isMuted={isMuted}
            isSpeaking={isSpeaking}
            isActiveSpeaker={isActiveSpeaker}
            isRequestingTurn={isRequestingTurn}
            onToggleMute={handleToggleMute}
            onRequestTurn={handleRequestTurn}
            onLeaveRoom={handleLeaveRoom}
          />
        </main>

        {/* Right Sidebar - Audience/Moderator */}
        <aside className={`${styles.rightSidebar} ${showAudience ? styles.show : ''}`}>
          {userRole === 'moderator' ? (
            <ModeratorPanel
              room={room}
              questions={questions}
            />
          ) : (
            <AudiencePanel
              reactions={reactions}
              questions={questions}
              audienceCount={room.audienceCount}
              userRole={userRole}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
