'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import type { User, UserTitle } from '@/types';

// Mock user data
const mockUser: User = {
  id: '2',
  email: 'joao.santos@example.com',
  username: 'joao_santos',
  displayName: 'João Santos',
  bio: 'Entusiasta de filosofia da mente e neurociência. Buscando entender a consciência através do debate racional.',
  avatarUrl: undefined,
  createdAt: new Date(Date.now() - 86400000 * 180), // 6 months ago
  titles: [
    { id: '1', domain: 'Filosofia da Mente', title: 'Praticante', level: 'practitioner', earnedAt: new Date(Date.now() - 86400000 * 30) },
    { id: '2', domain: 'Inteligência Artificial', title: 'Aprendiz', level: 'apprentice', earnedAt: new Date(Date.now() - 86400000 * 60) },
    { id: '3', domain: 'Ética', title: 'Novato', level: 'novice', earnedAt: new Date(Date.now() - 86400000 * 90) },
  ],
  followedTopics: ['Filosofia da Mente', 'Neurociência', 'Inteligência Artificial', 'Ética', 'Epistemologia'],
  followedUsers: ['3', '4', '5'],
  debateStats: {
    totalDebates: 12,
    hoursDebated: 8.5,
    topicsExplored: 5,
    averageClarity: 7.8,
    averageCoherence: 8.2,
    averagePrecision: 7.5,
    averageDepth: 7.9,
  },
};

const levelColors: Record<string, string> = {
  novice: '#94a3b8',
  apprentice: '#22c55e',
  practitioner: '#3b82f6',
  expert: '#a855f7',
  master: '#f59e0b',
};

const levelLabels: Record<string, string> = {
  novice: 'Novato',
  apprentice: 'Aprendiz',
  practitioner: 'Praticante',
  expert: 'Especialista',
  master: 'Mestre',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user] = useState<User>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio || '');

  const memberSince = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(user.createdAt);

  const handleSaveBio = () => {
    // Would save to backend
    setIsEditing(false);
  };

  const overallScore = (
    (user.debateStats.averageClarity +
      user.debateStats.averageCoherence +
      user.debateStats.averagePrecision +
      user.debateStats.averageDepth) / 4
  ).toFixed(1);

  return (
    <div className={styles.page}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <Avatar
            name={user.displayName}
            src={user.avatarUrl}
            size="xl"
          />
          <div className={styles.profileText}>
            <h1 className={styles.displayName}>{user.displayName}</h1>
            <p className={styles.username}>@{user.username}</p>
            <p className={styles.memberSince}>Membro desde {memberSince}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.push('/perfil/editar')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar Perfil
        </Button>
      </div>

      {/* Bio Section */}
      <Card className={styles.bioCard}>
        <CardHeader>
          <div className={styles.bioHeader}>
            <h2 className={styles.sectionTitle}>Sobre</h2>
            {!isEditing && (
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className={styles.bioEdit}>
              <textarea
                className={styles.bioInput}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Escreva uma breve descrição sobre você..."
                rows={4}
                maxLength={500}
              />
              <div className={styles.bioActions}>
                <span className={styles.charCount}>{editedBio.length}/500</span>
                <div className={styles.bioButtons}>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveBio}>
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.bioText}>
              {user.bio || 'Nenhuma descrição ainda. Clique para adicionar.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className={styles.statsOverview}>
        <Card className={styles.overallScoreCard}>
          <CardContent>
            <div className={styles.overallScore}>
              <span className={styles.scoreValue}>{overallScore}</span>
              <span className={styles.scoreLabel}>Pontuação Média</span>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.stat}>
              <span className={styles.statValue}>{user.debateStats.totalDebates}</span>
              <span className={styles.statLabel}>Debates</span>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.stat}>
              <span className={styles.statValue}>{user.debateStats.hoursDebated}h</span>
              <span className={styles.statLabel}>Horas</span>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.stat}>
              <span className={styles.statValue}>{user.debateStats.topicsExplored}</span>
              <span className={styles.statLabel}>Tópicos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="titles" className={styles.tabsContainer}>
        <TabsList>
          <TabsTrigger value="titles">Títulos</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="topics">Tópicos</TabsTrigger>
        </TabsList>

        {/* Titles Tab */}
        <TabsContent value="titles">
          <div className={styles.titlesGrid}>
            {user.titles.map((title) => (
              <Card 
                key={title.id} 
                className={styles.titleCard}
                style={{ '--level-color': levelColors[title.level] } as React.CSSProperties}
              >
                <CardContent>
                  <div className={styles.titleBadge} style={{ backgroundColor: levelColors[title.level] }}>
                    {levelLabels[title.level]}
                  </div>
                  <h3 className={styles.titleDomain}>{title.domain}</h3>
                  <p className={styles.titleEarned}>
                    Conquistado em {new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(title.earnedAt)}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Empty slots for more titles */}
            <Card className={styles.titleCardEmpty}>
              <CardContent>
                <div className={styles.emptyTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>Novo domínio</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <h3 className={styles.sectionTitle}>Critérios de Avaliação</h3>
            </CardHeader>
            <CardContent>
              <div className={styles.criteriaList}>
                {[
                  { key: 'clarity', label: 'Clareza', value: user.debateStats.averageClarity },
                  { key: 'coherence', label: 'Coerência', value: user.debateStats.averageCoherence },
                  { key: 'precision', label: 'Precisão', value: user.debateStats.averagePrecision },
                  { key: 'depth', label: 'Profundidade', value: user.debateStats.averageDepth },
                ].map((criterion) => (
                  <div key={criterion.key} className={styles.criterionRow}>
                    <span className={styles.criterionLabel}>{criterion.label}</span>
                    <div className={styles.criterionBar}>
                      <div 
                        className={styles.criterionFill}
                        style={{ width: `${criterion.value * 10}%` }}
                      />
                    </div>
                    <span className={styles.criterionValue}>{criterion.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <h3 className={styles.sectionTitle}>Tópicos que Sigo</h3>
            </CardHeader>
            <CardContent>
              <div className={styles.topicsList}>
                {user.followedTopics.map((topic) => (
                  <span key={topic} className={styles.topicTag}>
                    {topic}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="sm" className={styles.addTopicButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Adicionar tópico
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Button variant="primary" onClick={() => router.push('/debater')}>
          Criar Novo Debate
        </Button>
        <Button variant="secondary" onClick={() => router.push('/historico')}>
          Ver Histórico
        </Button>
      </div>
    </div>
  );
}
