'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import type { DebateRoom, User, Debater } from '@/types';

// Mock data
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

const mockRoom: DebateRoom = {
  id: '1',
  theme: 'A consciência pode ser explicada pela neurociência?',
  description: 'Debate sobre os limites do materialismo na explicação da experiência subjetiva.',
  type: 'human-vs-human',
  format: 'spoken',
  status: 'ended',
  level: 'advanced',
  creatorId: '2',
  creator: mockUser,
  debaters: [
    { userId: '2', user: { ...mockUser, id: '2', displayName: 'João Santos' }, position: 'Materialismo', joinedAt: new Date(), turnsCount: 3, isActive: false },
    { userId: '3', user: { ...mockUser, id: '3', displayName: 'Ana Oliveira' }, position: 'Dualismo', joinedAt: new Date(), turnsCount: 3, isActive: false },
  ],
  audienceCount: 47,
  maxDebaters: 2,
  startedAt: new Date(Date.now() - 3600000),
  endedAt: new Date(),
  createdAt: new Date(Date.now() - 7200000),
  rules: { turnDuration: 180, allowAudienceQuestions: true, allowTranscription: true, moderatorCanMute: true },
  tags: ['Filosofia da Mente', 'Neurociência', 'Consciência'],
};

interface Evaluation {
  debaterId: string;
  clarity: number;
  coherence: number;
  precision: number;
  depth: number;
  notes: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EvaluatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [room] = useState<DebateRoom>(mockRoom);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(
    room.debaters.map((d) => ({
      debaterId: d.userId,
      clarity: 5,
      coherence: 5,
      precision: 5,
      depth: 5,
      notes: '',
    }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [currentDebaterIndex, setCurrentDebaterIndex] = useState(0);

  const currentDebater = room.debaters[currentDebaterIndex];
  const currentEvaluation = evaluations.find((e) => e.debaterId === currentDebater.userId);

  const updateEvaluation = (field: keyof Omit<Evaluation, 'debaterId'>, value: number | string) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.debaterId === currentDebater.userId ? { ...e, [field]: value } : e
      )
    );
  };

  const handleSubmit = () => {
    // Would submit to backend
    setSubmitted(true);
  };

  const criteriaLabels: Record<string, { label: string; description: string }> = {
    clarity: {
      label: 'Clareza',
      description: 'Quão claro e compreensível foi o debatedor?',
    },
    coherence: {
      label: 'Coerência',
      description: 'Os argumentos foram logicamente consistentes?',
    },
    precision: {
      label: 'Precisão',
      description: 'O uso de termos e conceitos foi preciso?',
    },
    depth: {
      label: 'Profundidade',
      description: 'Houve exploração aprofundada do tema?',
    },
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <Card className={styles.successCard}>
          <CardContent>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h2 className={styles.successTitle}>Avaliação Enviada!</h2>
              <p className={styles.successText}>
                Obrigado por contribuir com sua avaliação. Suas notas ajudam a manter a qualidade dos debates.
              </p>
              <div className={styles.successActions}>
                <Button variant="primary" onClick={() => router.push('/')}>
                  Voltar ao Início
                </Button>
                <Button variant="secondary" onClick={() => router.push('/historico')}>
                  Ver Histórico
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar
        </Button>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Avaliar Debate</h1>
          <p className={styles.debateTheme}>{room.theme}</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Debater Selector */}
        <div className={styles.debaterSelector}>
          {room.debaters.map((debater, index) => (
            <button
              key={debater.userId}
              className={`${styles.debaterTab} ${index === currentDebaterIndex ? styles.active : ''}`}
              onClick={() => setCurrentDebaterIndex(index)}
            >
              <Avatar
                src={debater.user.avatarUrl}
                name={debater.user.displayName}
                size="sm"
              />
              <div className={styles.debaterTabInfo}>
                <span className={styles.debaterTabName}>{debater.user.displayName}</span>
                <span className={styles.debaterTabPosition}>{debater.position}</span>
              </div>
              {evaluations.find((e) => e.debaterId === debater.userId && (e.clarity !== 5 || e.coherence !== 5 || e.precision !== 5 || e.depth !== 5)) && (
                <span className={styles.evaluatedMark}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Evaluation Card */}
        <Card className={styles.evaluationCard}>
          <CardHeader>
            <div className={styles.cardHeader}>
              <Avatar
                src={currentDebater.user.avatarUrl}
                name={currentDebater.user.displayName}
                size="lg"
              />
              <div className={styles.cardHeaderInfo}>
                <h2 className={styles.debaterName}>{currentDebater.user.displayName}</h2>
                <p className={styles.debaterPosition}>Posição: {currentDebater.position}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={styles.criteriaList}>
              {Object.entries(criteriaLabels).map(([key, { label, description }]) => (
                <div key={key} className={styles.criterionItem}>
                  <div className={styles.criterionInfo}>
                    <h4 className={styles.criterionLabel}>{label}</h4>
                    <p className={styles.criterionDescription}>{description}</p>
                  </div>
                  <div className={styles.ratingContainer}>
                    <div className={styles.ratingSlider}>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={currentEvaluation?.[key as keyof Omit<Evaluation, 'debaterId' | 'notes'>] || 5}
                        onChange={(e) =>
                          updateEvaluation(key as keyof Omit<Evaluation, 'debaterId'>, parseFloat(e.target.value))
                        }
                        className={styles.slider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                    <div className={styles.ratingValue}>
                      {currentEvaluation?.[key as keyof Omit<Evaluation, 'debaterId' | 'notes'>]?.toFixed(1) || '5.0'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className={styles.notesSection}>
              <label className={styles.notesLabel}>Comentários (opcional)</label>
              <textarea
                className={styles.notesInput}
                placeholder="Adicione observações sobre a performance do debatedor..."
                value={currentEvaluation?.notes || ''}
                onChange={(e) => updateEvaluation('notes', e.target.value)}
                rows={3}
                maxLength={500}
              />
              <span className={styles.charCount}>
                {currentEvaluation?.notes?.length || 0}/500
              </span>
            </div>

            {/* Average Score */}
            <div className={styles.averageScore}>
              <span className={styles.averageLabel}>Média do Debatedor</span>
              <span className={styles.averageValue}>
                {currentEvaluation
                  ? (
                      (currentEvaluation.clarity +
                        currentEvaluation.coherence +
                        currentEvaluation.precision +
                        currentEvaluation.depth) /
                      4
                    ).toFixed(1)
                  : '5.0'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className={styles.navigation}>
          {currentDebaterIndex > 0 && (
            <Button
              variant="secondary"
              onClick={() => setCurrentDebaterIndex(currentDebaterIndex - 1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              Debatedor Anterior
            </Button>
          )}
          
          <div className={styles.navSpacer} />
          
          {currentDebaterIndex < room.debaters.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentDebaterIndex(currentDebaterIndex + 1)}
            >
              Próximo Debatedor
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Enviar Avaliação
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
