'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { EndedBadge, LevelBadge, DebateTypeBadge } from '@/components/ui/Badge';
import type { DebateRoom, User } from '@/types';

// Mock user
const mockUser: User = {
  id: '2',
  email: 'user@example.com',
  username: 'joao',
  displayName: 'João Santos',
  createdAt: new Date(),
  titles: [],
  followedTopics: [],
  followedUsers: [],
  debateStats: { totalDebates: 12, hoursDebated: 8, topicsExplored: 5, averageClarity: 7.5, averageCoherence: 8.0, averagePrecision: 7.8, averageDepth: 7.2 },
};

// Mock debate history
const mockDebates: (DebateRoom & { userScore?: number })[] = [
  {
    id: '1',
    theme: 'A consciência pode ser explicada pela neurociência?',
    description: 'Debate sobre os limites do materialismo na explicação da experiência subjetiva.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'ended',
    level: 'advanced',
    creatorId: '3',
    creator: mockUser,
    debaters: [
      { userId: '2', user: mockUser, position: 'Materialismo', joinedAt: new Date(), turnsCount: 3, isActive: false },
      { userId: '3', user: { ...mockUser, id: '3', displayName: 'Ana Oliveira' }, position: 'Dualismo', joinedAt: new Date(), turnsCount: 3, isActive: false },
    ],
    audienceCount: 47,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 86400000 * 2),
    endedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
    createdAt: new Date(Date.now() - 86400000 * 2),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Filosofia da Mente', 'Neurociência'],
    userScore: 8.0,
  },
  {
    id: '2',
    theme: 'Inteligência Artificial pode ser criativa?',
    description: 'Exploração do conceito de criatividade e sua aplicabilidade a sistemas artificiais.',
    type: 'human-vs-ai',
    format: 'spoken',
    status: 'ended',
    level: 'intermediate',
    creatorId: '2',
    creator: mockUser,
    debaters: [
      { userId: '2', user: mockUser, position: 'A favor', joinedAt: new Date(), turnsCount: 4, isActive: false },
    ],
    audienceCount: 32,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 86400000 * 5),
    endedAt: new Date(Date.now() - 86400000 * 5 + 2400000),
    createdAt: new Date(Date.now() - 86400000 * 5),
    rules: { turnDuration: 180, allowAudienceQuestions: false, allowTranscription: true, moderatorCanMute: true },
    tags: ['Inteligência Artificial', 'Criatividade'],
    userScore: 7.5,
  },
  {
    id: '3',
    theme: 'O livre-arbítrio é uma ilusão?',
    description: 'Debate sobre determinismo e a natureza da vontade humana.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'ended',
    level: 'advanced',
    creatorId: '4',
    creator: { ...mockUser, id: '4', displayName: 'Paulo Moderador' },
    debaters: [
      { userId: '2', user: mockUser, position: 'Determinismo', joinedAt: new Date(), turnsCount: 5, isActive: false },
      { userId: '5', user: { ...mockUser, id: '5', displayName: 'Roberto Lima' }, position: 'Libertarismo', joinedAt: new Date(), turnsCount: 5, isActive: false },
    ],
    audienceCount: 89,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 86400000 * 10),
    endedAt: new Date(Date.now() - 86400000 * 10 + 4200000),
    createdAt: new Date(Date.now() - 86400000 * 10),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Filosofia', 'Livre-arbítrio', 'Determinismo'],
    userScore: 8.5,
  },
];

// Mock watched debates
const mockWatched: DebateRoom[] = [
  {
    id: '4',
    theme: 'Criptomoedas são o futuro do dinheiro?',
    description: 'Análise crítica do papel das criptomoedas no sistema financeiro global.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'ended',
    level: 'intermediate',
    creatorId: '6',
    creator: { ...mockUser, id: '6', displayName: 'Marina Costa' },
    debaters: [
      { userId: '6', user: { ...mockUser, id: '6', displayName: 'Marina Costa' }, position: 'A favor', joinedAt: new Date(), turnsCount: 4, isActive: false },
      { userId: '7', user: { ...mockUser, id: '7', displayName: 'Carlos Mendes' }, position: 'Contra', joinedAt: new Date(), turnsCount: 4, isActive: false },
    ],
    audienceCount: 156,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 86400000 * 3),
    endedAt: new Date(Date.now() - 86400000 * 3 + 3000000),
    createdAt: new Date(Date.now() - 86400000 * 3),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Economia', 'Criptomoedas', 'Finanças'],
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const [debates] = useState(mockDebates);
  const [watched] = useState(mockWatched);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}min`;
    }
    return `${minutes}min`;
  };

  const stats = {
    totalDebates: debates.length,
    totalHours: debates.reduce((acc, d) => {
      if (d.startedAt && d.endedAt) {
        return acc + (d.endedAt.getTime() - d.startedAt.getTime()) / 3600000;
      }
      return acc;
    }, 0),
    averageScore: debates.reduce((acc, d) => acc + (d.userScore || 0), 0) / debates.length,
    topicsExplored: new Set(debates.flatMap(d => d.tags)).size,
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Histórico</h1>
        <p className={styles.pageDescription}>
          Revise seus debates passados e acompanhe sua evolução
        </p>
      </header>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statValue}>{stats.totalDebates}</div>
            <div className={styles.statLabel}>Debates Realizados</div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statValue}>{stats.totalHours.toFixed(1)}h</div>
            <div className={styles.statLabel}>Horas Debatendo</div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statValue}>{stats.averageScore.toFixed(1)}</div>
            <div className={styles.statLabel}>Média de Avaliação</div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statValue}>{stats.topicsExplored}</div>
            <div className={styles.statLabel}>Tópicos Explorados</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="participated" className={styles.tabsContainer}>
        <TabsList>
          <TabsTrigger value="participated">Participei ({debates.length})</TabsTrigger>
          <TabsTrigger value="watched">Assisti ({watched.length})</TabsTrigger>
        </TabsList>

        {/* Participated Debates */}
        <TabsContent value="participated">
          <div className={styles.debatesList}>
            {debates.map((debate) => (
              <Card 
                key={debate.id} 
                className={styles.debateCard}
                onClick={() => router.push(`/feedback/${debate.id}`)}
              >
                <CardContent>
                  <div className={styles.debateHeader}>
                    <div className={styles.debateBadges}>
                      <EndedBadge />
                      <LevelBadge level={debate.level} />
                      <DebateTypeBadge type={debate.type} />
                    </div>
                    {debate.userScore && (
                      <div className={styles.scoreTag}>
                        <span className={styles.scoreIcon}>⭐</span>
                        {debate.userScore.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <h3 className={styles.debateTheme}>{debate.theme}</h3>

                  <div className={styles.debateMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {debate.endedAt && formatDate(debate.endedAt)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {debate.startedAt && debate.endedAt && formatDuration(debate.startedAt, debate.endedAt)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      {debate.audienceCount} espectadores
                    </span>
                  </div>

                  <div className={styles.debateFooter}>
                    <div className={styles.debaters}>
                      {debate.debaters.map((debater) => (
                        <span key={debater.userId} className={styles.debater}>
                          {debater.user.displayName}
                          <span className={styles.position}>({debater.position})</span>
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Feedback
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Watched Debates */}
        <TabsContent value="watched">
          <div className={styles.debatesList}>
            {watched.map((debate) => (
              <Card 
                key={debate.id} 
                className={styles.debateCard}
                onClick={() => router.push(`/sala/${debate.id}`)}
              >
                <CardContent>
                  <div className={styles.debateHeader}>
                    <div className={styles.debateBadges}>
                      <EndedBadge />
                      <LevelBadge level={debate.level} />
                      <DebateTypeBadge type={debate.type} />
                    </div>
                  </div>

                  <h3 className={styles.debateTheme}>{debate.theme}</h3>

                  <div className={styles.debateMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {debate.endedAt && formatDate(debate.endedAt)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      {debate.audienceCount} espectadores
                    </span>
                  </div>

                  <div className={styles.debateFooter}>
                    <div className={styles.debaters}>
                      {debate.debaters.map((debater) => (
                        <span key={debater.userId} className={styles.debater}>
                          {debater.user.displayName}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      Rever Debate
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
