'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters } from '@/components/rooms/RoomFilters';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import type { DebateRoom, DebateStatus, DebateType, DebateLevel, User } from '@/types';

// Mock user
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'user1',
  displayName: 'Usuário Teste',
  createdAt: new Date(),
  titles: [],
  followedTopics: [],
  followedUsers: [],
  debateStats: { totalDebates: 0, hoursDebated: 0, topicsExplored: 0, averageClarity: 0, averageCoherence: 0, averagePrecision: 0, averageDepth: 0 },
};

// Mock rooms data
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
    creator: { ...mockUser, id: '2', displayName: 'João Santos' },
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
  },
  {
    id: '2',
    theme: 'Inteligência Artificial pode ser criativa?',
    description: 'Exploração do conceito de criatividade e sua aplicabilidade a sistemas artificiais.',
    type: 'human-vs-ai',
    format: 'spoken',
    status: 'live',
    level: 'intermediate',
    creatorId: '4',
    creator: { ...mockUser, id: '4', displayName: 'Carlos Lima' },
    debaters: [
      { userId: '4', user: { ...mockUser, id: '4', displayName: 'Carlos Lima' }, position: 'A favor', joinedAt: new Date(), turnsCount: 2, isActive: true },
    ],
    audienceCount: 32,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 900000),
    createdAt: new Date(Date.now() - 1800000),
    rules: { turnDuration: 120, allowAudienceQuestions: false, allowTranscription: true, moderatorCanMute: true },
    tags: ['Inteligência Artificial', 'Criatividade', 'Filosofia'],
  },
  {
    id: '3',
    theme: 'O livre-arbítrio é uma ilusão?',
    description: 'Debate sobre determinismo e a natureza da vontade humana.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'scheduled',
    level: 'advanced',
    creatorId: '5',
    creator: { ...mockUser, id: '5', displayName: 'Roberto Silva' },
    debaters: [
      { userId: '5', user: { ...mockUser, id: '5', displayName: 'Roberto Silva' }, position: 'Determinismo', joinedAt: new Date(), turnsCount: 0, isActive: false },
    ],
    audienceCount: 0,
    maxDebaters: 2,
    scheduledAt: new Date(Date.now() + 7200000),
    createdAt: new Date(Date.now() - 86400000),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Filosofia', 'Livre-arbítrio', 'Determinismo'],
  },
  {
    id: '4',
    theme: 'Criptomoedas são o futuro do dinheiro?',
    description: 'Análise crítica do papel das criptomoedas no sistema financeiro global.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'scheduled',
    level: 'intermediate',
    creatorId: '6',
    creator: { ...mockUser, id: '6', displayName: 'Marina Costa' },
    debaters: [],
    audienceCount: 0,
    maxDebaters: 2,
    scheduledAt: new Date(Date.now() + 86400000),
    createdAt: new Date(Date.now() - 172800000),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Economia', 'Criptomoedas', 'Finanças'],
  },
  {
    id: '5',
    theme: 'A educação tradicional está obsoleta?',
    description: 'Reflexão sobre os modelos educacionais e sua adaptação ao século XXI.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'live',
    level: 'beginner',
    creatorId: '7',
    creator: { ...mockUser, id: '7', displayName: 'Paula Martins' },
    debaters: [
      { userId: '7', user: { ...mockUser, id: '7', displayName: 'Paula Martins' }, position: 'A favor', joinedAt: new Date(), turnsCount: 1, isActive: true },
      { userId: '8', user: { ...mockUser, id: '8', displayName: 'Lucas Souza' }, position: 'Contra', joinedAt: new Date(), turnsCount: 1, isActive: true },
    ],
    audienceCount: 23,
    maxDebaters: 2,
    startedAt: new Date(Date.now() - 600000),
    createdAt: new Date(Date.now() - 1200000),
    rules: { turnDuration: 120, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Educação', 'Tecnologia', 'Sociedade'],
  },
  {
    id: '6',
    theme: 'Veganismo é uma obrigação moral?',
    description: 'Discussão ética sobre o consumo de produtos de origem animal.',
    type: 'human-vs-human',
    format: 'spoken',
    status: 'scheduled',
    level: 'intermediate',
    creatorId: '9',
    creator: { ...mockUser, id: '9', displayName: 'Fernanda Lima' },
    debaters: [
      { userId: '9', user: { ...mockUser, id: '9', displayName: 'Fernanda Lima' }, position: 'A favor', joinedAt: new Date(), turnsCount: 0, isActive: false },
    ],
    audienceCount: 0,
    maxDebaters: 2,
    scheduledAt: new Date(Date.now() + 10800000),
    createdAt: new Date(Date.now() - 43200000),
    rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
    tags: ['Ética', 'Meio Ambiente', 'Alimentação'],
  },
];

export default function SalasPage() {
  const [filters, setFilters] = useState({
    status: 'all' as DebateStatus | 'all',
    type: 'all' as DebateType | 'all',
    level: 'all' as DebateLevel | 'all',
    sortBy: 'recent' as 'recent' | 'popular' | 'starting-soon',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = mockRooms.filter(room => {
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    if (filters.level !== 'all' && room.level !== filters.level) return false;
    if (searchQuery && !room.theme.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (filters.sortBy === 'popular') {
      return b.audienceCount - a.audienceCount;
    } else if (filters.sortBy === 'starting-soon') {
      const aTime = a.scheduledAt?.getTime() || a.startedAt?.getTime() || 0;
      const bTime = b.scheduledAt?.getTime() || b.startedAt?.getTime() || 0;
      return aTime - bTime;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const liveRooms = sortedRooms.filter(r => r.status === 'live');
  const scheduledRooms = sortedRooms.filter(r => r.status === 'scheduled');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Salas de Debate</h1>
          <p className={styles.pageDescription}>
            Explore debates ao vivo, agende participações e acompanhe discussões de seu interesse.
          </p>
        </div>
        <Button variant="primary" onClick={() => window.location.href = '/debater'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Criar Sala
        </Button>
      </header>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por tema ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Filters */}
      <RoomFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
      />

      {/* Rooms List */}
      <Tabs defaultValue="all" className={styles.tabsContainer}>
        <TabsList>
          <TabsTrigger value="all">Todas ({sortedRooms.length})</TabsTrigger>
          <TabsTrigger value="live">Ao Vivo ({liveRooms.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Agendadas ({scheduledRooms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {sortedRooms.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>Nenhuma sala encontrada</h3>
              <p>Tente ajustar os filtros ou criar uma nova sala.</p>
              <Button variant="primary" onClick={() => window.location.href = '/debater'}>
                Criar Sala
              </Button>
            </div>
          ) : (
            <div className={styles.roomsGrid}>
              {sortedRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="live">
          {liveRooms.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14" />
              </svg>
              <h3>Nenhum debate ao vivo</h3>
              <p>Não há debates acontecendo agora. Seja o primeiro a iniciar!</p>
              <Button variant="primary" onClick={() => window.location.href = '/debater'}>
                Iniciar Debate
              </Button>
            </div>
          ) : (
            <div className={styles.roomsGrid}>
              {liveRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          {scheduledRooms.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>Nenhum debate agendado</h3>
              <p>Agende um debate para começar a construir sua audiência.</p>
              <Button variant="primary" onClick={() => window.location.href = '/debater'}>
                Agendar Debate
              </Button>
            </div>
          ) : (
            <div className={styles.roomsGrid}>
              {scheduledRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
