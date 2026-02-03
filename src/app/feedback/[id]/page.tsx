'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import type { DebateFeedback, EvaluationCriteria, DebateTurn, User } from '@/types';

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

const mockFeedback: DebateFeedback = {
  id: '1',
  debateId: '1',
  userId: '2',
  summary: 'Debate intenso sobre a natureza da consciência. Ambos os debatedores demonstraram conhecimento profundo do tema, embora com abordagens metodológicas distintas. O debatedor materialista apresentou argumentos baseados em evidências empíricas, enquanto a perspectiva dualista focou em argumentos conceituais e fenomenológicos.',
  evaluation: {
    clarity: { score: 8.2, previousScore: 7.5, change: 0.7, feedback: 'Excelente articulação de conceitos complexos. Suas explicações sobre correlações neurais foram particularmente claras.' },
    coherence: { score: 7.8, previousScore: 8.0, change: -0.2, feedback: 'Boa estrutura argumentativa, mas houve um momento de descontinuidade ao responder sobre o problema difícil.' },
    precision: { score: 8.5, previousScore: 7.8, change: 0.7, feedback: 'Uso preciso de terminologia técnica. Referências a estudos específicos fortaleceram seus argumentos.' },
    depth: { score: 7.5, previousScore: 7.2, change: 0.3, feedback: 'Bom aprofundamento em neurociência, mas poderia explorar mais as implicações filosóficas.' },
    overall: 8.0,
  },
  aiComments: 'Você demonstrou forte domínio do materialismo eliminativo e reducionista. Sugestão: explore mais os argumentos de Thomas Nagel sobre subjetividade e Daniel Dennett sobre heterofenomenologia para fortalecer sua posição.',
  titleProgress: {
    domain: 'Filosofia da Mente',
    currentTitle: 'Praticante',
    nextTitle: 'Especialista',
    progressPercentage: 72,
    pointsEarned: 72,
    pointsToNext: 28,
  },
  createdAt: new Date(),
};

const mockTurns: DebateTurn[] = [
  {
    id: '1',
    debateId: '1',
    speakerId: '2',
    speaker: mockUser,
    startedAt: new Date(),
    duration: 180,
    transcription: 'A neurociência tem feito avanços extraordinários na última década. Conseguimos mapear as correlações neurais da consciência com precisão cada vez maior. Cada estado mental corresponde a um estado cerebral identificável.',
    highlights: [
      { id: 'h1', text: 'correlações neurais da consciência', type: 'claim', startIndex: 0, endIndex: 50 },
      { id: 'h2', text: 'estado mental corresponde a um estado cerebral', type: 'evidence', startIndex: 51, endIndex: 100 },
    ],
  },
  {
    id: '3',
    debateId: '1',
    speakerId: '2',
    speaker: mockUser,
    startedAt: new Date(),
    duration: 180,
    transcription: 'O "problema difícil" é mal formulado. É um resquício de intuições dualistas pré-científicas. À medida que nossa ciência avança, esses mistérios se dissolvem.',
    highlights: [
      { id: 'h3', text: 'problema difícil é mal formulado', type: 'counter-argument', startIndex: 0, endIndex: 40 },
    ],
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FeedbackPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [feedback] = useState<DebateFeedback>(mockFeedback);
  const [turns] = useState<DebateTurn[]>(mockTurns);

  const getScoreColor = (score: number) => {
    if (score >= 8) return styles.scoreHigh;
    if (score >= 6) return styles.scoreMedium;
    return styles.scoreLow;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <span className={styles.changePositive}>+{change.toFixed(1)}</span>;
    if (change < 0) return <span className={styles.changeNegative}>{change.toFixed(1)}</span>;
    return <span className={styles.changeNeutral}>0</span>;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar
        </Button>
        <h1 className={styles.pageTitle}>Feedback do Debate</h1>
      </header>

      <div className={styles.content}>
        {/* Summary Section */}
        <Card className={styles.summaryCard}>
          <CardHeader>
            <h2 className={styles.sectionTitle}>Resumo do Debate</h2>
          </CardHeader>
          <CardContent>
            <p className={styles.summary}>{feedback.summary}</p>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card className={styles.overallCard}>
          <CardContent>
            <div className={styles.overallScore}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreValue}>{feedback.evaluation.overall.toFixed(1)}</span>
                <span className={styles.scoreLabel}>Avaliação Geral</span>
              </div>
              <div className={styles.overallInfo}>
                <p className={styles.overallText}>
                  Sua performance neste debate foi <strong>acima da média</strong>. 
                  Continue desenvolvendo suas habilidades argumentativas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="criteria" className={styles.tabsContainer}>
          <TabsList>
            <TabsTrigger value="criteria">Critérios</TabsTrigger>
            <TabsTrigger value="transcription">Transcrição</TabsTrigger>
            <TabsTrigger value="progress">Progressão</TabsTrigger>
          </TabsList>

          {/* Criteria Tab */}
          <TabsContent value="criteria">
            <div className={styles.criteriaGrid}>
              {Object.entries(feedback.evaluation).map(([key, value]) => {
                if (key === 'overall' || typeof value !== 'object') return null;
                const criterion = value as { score: number; previousScore: number; change: number; feedback: string };
                const labels: Record<string, string> = {
                  clarity: 'Clareza',
                  coherence: 'Coerência',
                  precision: 'Precisão',
                  depth: 'Profundidade',
                };
                return (
                  <Card key={key} className={styles.criterionCard}>
                    <CardContent>
                      <div className={styles.criterionHeader}>
                        <h3 className={styles.criterionName}>{labels[key]}</h3>
                        <div className={styles.criterionScore}>
                          <span className={`${styles.score} ${getScoreColor(criterion.score)}`}>
                            {criterion.score.toFixed(1)}
                          </span>
                          {getChangeIndicator(criterion.change)}
                        </div>
                      </div>
                      <p className={styles.criterionFeedback}>{criterion.feedback}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Comments */}
            {feedback.aiComments && (
              <Card className={styles.aiCard}>
                <CardHeader>
                  <div className={styles.aiHeader}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a2 2 0 110 4h-1.17a3 3 0 01-2.83 2H6a3 3 0 01-2.83-2H2a2 2 0 110-4h1a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2z" />
                    </svg>
                    <h3 className={styles.aiTitle}>Sugestão da IA</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={styles.aiComment}>{feedback.aiComments}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transcription Tab */}
          <TabsContent value="transcription">
            <Card>
              <CardHeader>
                <h3 className={styles.sectionTitle}>Seus Turnos</h3>
              </CardHeader>
              <CardContent>
                <div className={styles.turnsList}>
                  {turns.map((turn, index) => (
                    <div key={turn.id} className={styles.turnCard}>
                      <div className={styles.turnHeader}>
                        <span className={styles.turnNumber}>Turno {index + 1}</span>
                        <span className={styles.turnDuration}>
                          {Math.floor(turn.duration / 60)}:{(turn.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <p className={styles.turnText}>{turn.transcription}</p>
                      {turn.highlights && turn.highlights.length > 0 && (
                        <div className={styles.highlights}>
                          <span className={styles.highlightsLabel}>Destaques:</span>
                          {turn.highlights.map((h) => (
                            <span key={h.id} className={`${styles.highlight} ${styles[h.type]}`}>
                              {h.type === 'claim' && '📌'}
                              {h.type === 'evidence' && '📊'}
                              {h.type === 'counter-argument' && '⚔️'}
                              {h.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            {feedback.titleProgress && (
              <Card>
                <CardHeader>
                  <h3 className={styles.sectionTitle}>Progressão de Título</h3>
                </CardHeader>
                <CardContent>
                  <div className={styles.progressSection}>
                    <div className={styles.domainInfo}>
                      <span className={styles.domainLabel}>Domínio</span>
                      <span className={styles.domainName}>{feedback.titleProgress.domain}</span>
                    </div>
                    
                    <div className={styles.levelInfo}>
                      <span className={styles.levelLabel}>Nível Atual</span>
                      <span className={styles.levelBadge}>
                        {feedback.titleProgress.currentTitle}
                      </span>
                    </div>

                    <div className={styles.progressBar}>
                      <div className={styles.progressTrack}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${feedback.titleProgress.progressPercentage}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {feedback.titleProgress.progressPercentage}% para o próximo nível
                      </span>
                    </div>

                    <p className={styles.progressHint}>
                      Faltam <strong>{feedback.titleProgress.pointsToNext} pontos</strong> para alcançar o próximo nível.
                      Continue participando de debates sobre este tema!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Comparison */}
            <Card className={styles.statsCard}>
              <CardHeader>
                <h3 className={styles.sectionTitle}>Evolução dos Seus Critérios</h3>
              </CardHeader>
              <CardContent>
                <div className={styles.statsChart}>
                  {Object.entries(feedback.evaluation).map(([key, value]) => {
                    if (key === 'overall' || typeof value !== 'object') return null;
                    const criterion = value as { score: number; previousScore: number; change: number };
                    const labels: Record<string, string> = {
                      clarity: 'Clareza',
                      coherence: 'Coerência',
                      precision: 'Precisão',
                      depth: 'Profundidade',
                    };
                    return (
                      <div key={key} className={styles.statRow}>
                        <span className={styles.statLabel}>{labels[key]}</span>
                        <div className={styles.statBar}>
                          <div 
                            className={styles.statPrevious}
                            style={{ width: `${criterion.previousScore * 10}%` }}
                          />
                          <div 
                            className={styles.statCurrent}
                            style={{ width: `${criterion.score * 10}%` }}
                          />
                        </div>
                        <span className={styles.statValue}>{criterion.score.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.legend}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--color-ink-300)' }} />
                    Anterior
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--color-accent-primary)' }} />
                    Atual
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => router.push(`/sala/${resolvedParams.id}`)}>
            Ver Debate Completo
          </Button>
          <Button variant="primary" onClick={() => router.push('/historico')}>
            Ver Histórico
          </Button>
        </div>
      </div>
    </div>
  );
}
