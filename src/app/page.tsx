'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters, FilterStatus, FilterType, FilterLevel, SortOption } from '@/components/rooms/RoomFilters';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import type { DebateRoom, User } from '@/types';

// Mock data for demonstration
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'debater1',
  displayName: 'Maria Silva',
  createdAt: new Date(),
  titles: [],
  followedTopics: ['Filosofia', 'Ética', 'Política'],
  followedUsers: [],
  debateStats: {
    totalDebates: 12,
    hoursDebated: 8,
    topicsExplored: 5,
    averageClarity: 7.5,
    averageCoherence: 8.0,
    averagePrecision: 7.8,
    averageDepth: 7.2,
  },
};

const mockRooms: DebateRoom[] = [
  {
    id: '1',
    theme: 'A consciência pode ser explicada pela neurociência?',
    description: 'Debate sobre os limites do materialismo na explicação da experiência subjetiva.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'live',
    level: 'advanced',
    creatorId: '2',
    creator: { ...mockUser, id: '2', displayName: 'João Santos', username: 'joao' },
    debaters: [
      { userId: '2', user: { ...mockUser, id: '2', displayName: 'João Santos' }, position: 'Materialismo', joinedAt: new Date(), turnsCount: 5, isActive: true },
      { userId: '3', user: { ...mockUser, id: '3', displayName: 'Ana Oliveira' }, position: 'Dualismo', joinedAt: new Date(), turnsCount: 4, isActive: true },
    ],
    audienceCount: 47,
    maxDebaters: 2,
    createdAt: new Date(),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Filosofia da Mente', 'Neurociência', 'Consciência'],
  },
  {
    id: '2',
    theme: 'O utilitarismo é a melhor teoria ética?',
    description: 'Uma análise crítica do utilitarismo frente a outras teorias éticas como deontologia e ética das virtudes.',
    type: 'human-vs-ai',
    format: 'spoken-text',
    status: 'scheduled',
    level: 'intermediate',
    creatorId: '4',
    creator: { ...mockUser, id: '4', displayName: 'Carlos Mendes', username: 'carlos' },
    debaters: [
      { userId: '4', user: { ...mockUser, id: '4', displayName: 'Carlos Mendes' }, position: 'Pró-Utilitarismo', joinedAt: new Date(), turnsCount: 0, isActive: true },
    ],
    audienceCount: 12,
    maxDebaters: 2,
    scheduledAt: new Date(Date.now() + 3600000),
    createdAt: new Date(),
    rules: { turnDuration: 120, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Ética', 'Filosofia Moral', 'Utilitarismo'],
  },
  {
    id: '3',
    theme: 'Democracia direta vs representativa no século XXI',
    description: 'Com as novas tecnologias, a democracia direta tornou-se viável? Quais os riscos?',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'live',
    level: 'beginner',
    creatorId: '5',
    creator: { ...mockUser, id: '5', displayName: 'Lucia Fernandes', username: 'lucia' },
    debaters: [
      { userId: '5', user: { ...mockUser, id: '5', displayName: 'Lucia Fernandes' }, position: 'Democracia Direta', joinedAt: new Date(), turnsCount: 3, isActive: true },
      { userId: '6', user: { ...mockUser, id: '6', displayName: 'Pedro Alves' }, position: 'Democracia Representativa', joinedAt: new Date(), turnsCount: 3, isActive: true },
    ],
    audienceCount: 89,
    maxDebaters: 2,
    createdAt: new Date(),
    rules: { turnDuration: 150, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Política', 'Democracia', 'Tecnologia'],
  },
  {
    id: '4',
    theme: 'Inteligência artificial pode ser criativa?',
    description: 'Explorando os limites da criatividade computacional e suas implicações filosóficas.',
    type: 'human-vs-ai',
    format: 'spoken',
    status: 'ended',
    level: 'intermediate',
    creatorId: '7',
    creator: { ...mockUser, id: '7', displayName: 'Roberto Lima', username: 'roberto' },
    debaters: [
      { userId: '7', user: { ...mockUser, id: '7', displayName: 'Roberto Lima' }, position: 'Contra', joinedAt: new Date(), turnsCount: 8, isActive: false },
    ],
    audienceCount: 156,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 7200000),
    endedAt: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 86400000),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['IA', 'Criatividade', 'Filosofia'],
  },
];

export default function HomePage() {
  const [filters, setFilters] = useState({
    status: 'all' as FilterStatus,
    type: 'all' as FilterType,
    level: 'all' as FilterLevel,
    sortBy: 'popular' as SortOption,
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredRooms = mockRooms.filter((room) => {
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    if (filters.level !== 'all' && room.level !== filters.level) return false;
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popular':
        return b.audienceCount - a.audienceCount;
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'starting-soon':
        if (a.scheduledAt && b.scheduledAt) {
          return a.scheduledAt.getTime() - b.scheduledAt.getTime();
        }
        return a.scheduledAt ? -1 : 1;
      default:
        return 0;
    }
  });

  const liveRooms = mockRooms.filter((r) => r.status === 'live');
  const featuredRoom = liveRooms.length > 0 ? liveRooms[0] : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Descoberta</h1>
            <p className={styles.subtitle}>
              Encontre debates que expandem sua perspectiva
            </p>
          </div>
          <Link href="/debater">
            <Button size="lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Criar Sala
            </Button>
          </Link>
        </header>

        {featuredRoom && (
          <section className={styles.featured} aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="sr-only">Debate em destaque</h2>
            <RoomCard room={featuredRoom} variant="featured" />
          </section>
        )}

        <Tabs defaultValue="discover">
          <TabsList>
            <TabsTrigger value="discover">Descobrir</TabsTrigger>
            <TabsTrigger value="following">Seguindo</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <section className={styles.filtersSection}>
              <RoomFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </section>

            <section className={styles.roomsSection} aria-labelledby="rooms-heading">
              <h2 id="rooms-heading" className="sr-only">Lista de salas</h2>
              
              {sortedRooms.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                    </svg>
                  </div>
                  <h3>Nenhuma sala encontrada</h3>
                  <p>Ajuste os filtros ou crie uma nova sala para começar um debate.</p>
                  <Link href="/debater">
                    <Button>Criar Sala</Button>
                  </Link>
                </div>
              ) : (
                <div className={styles.roomsGrid}>
                  {sortedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="following">
            <section className={styles.followingSection}>
              <div className={styles.topicsSection}>
                <h3 className={styles.sectionTitle}>Temas que você segue</h3>
                <div className={styles.topicsList}>
                  {mockUser.followedTopics.map((topic) => (
                    <span key={topic} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))}
                  <button className={styles.addTopicButton}>
                    + Adicionar tema
                  </button>
                </div>
              </div>

              <div className={styles.roomsGrid}>
                {mockRooms
                  .filter((room) => 
                    room.tags.some((tag) => mockUser.followedTopics.includes(tag))
                  )
                  .map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="invites">
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="8" width="18" height="12" rx="2" />
                  <path d="M3 10l9 6 9-6" />
                </svg>
              </div>
              <h3>Nenhum convite pendente</h3>
              <p>Quando alguém te convidar para um debate, aparecerá aqui.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
