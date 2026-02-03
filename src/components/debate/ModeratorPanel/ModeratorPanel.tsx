'use client';

import React, { useState } from 'react';
import styles from './ModeratorPanel.module.css';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { DebateRoom, AudienceQuestion } from '@/types';

interface ModeratorPanelProps {
  room: DebateRoom;
  questions: AudienceQuestion[];
  onApproveQuestion?: (questionId: string) => void;
  onRejectQuestion?: (questionId: string) => void;
  onPauseDebate?: () => void;
  onResumeDebate?: () => void;
  onEndDebate?: () => void;
}

export function ModeratorPanel({
  room,
  questions,
  onApproveQuestion,
  onRejectQuestion,
  onPauseDebate,
  onResumeDebate,
  onEndDebate,
}: ModeratorPanelProps) {
  const [activeTab, setActiveTab] = useState<'debaters' | 'questions'>('debaters');
  const [isPaused, setIsPaused] = useState(false);

  const pendingQuestions = questions.filter(q => !q.isApproved && !q.isAnswered);
  const approvedQuestions = questions.filter(q => q.isApproved && !q.isAnswered);

  const handlePauseToggle = () => {
    if (isPaused) {
      onResumeDebate?.();
    } else {
      onPauseDebate?.();
    }
    setIsPaused(!isPaused);
  };

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Painel do Moderador
        </h3>
      </header>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Button
          variant={isPaused ? 'primary' : 'secondary'}
          size="sm"
          onClick={handlePauseToggle}
          className={styles.actionButton}
        >
          {isPaused ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Retomar
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pausar
            </>
          )}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onEndDebate}
          className={styles.actionButton}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
          Encerrar
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'debaters' ? styles.active : ''}`}
          onClick={() => setActiveTab('debaters')}
        >
          Debatedores
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'questions' ? styles.active : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Perguntas
          {pendingQuestions.length > 0 && (
            <span className={styles.badge}>{pendingQuestions.length}</span>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {/* Debaters Tab */}
        {activeTab === 'debaters' && (
          <div className={styles.debatersSection}>
            {room.debaters.map((debater) => (
              <div key={debater.userId} className={styles.debaterCard}>
                <div className={styles.debaterInfo}>
                  <Avatar
                    src={debater.user.avatarUrl}
                    name={debater.user.displayName}
                    size="sm"
                  />
                  <div className={styles.debaterDetails}>
                    <span className={styles.debaterName}>
                      {debater.user.displayName}
                    </span>
                    <span className={styles.debaterPosition}>
                      {debater.position}
                    </span>
                  </div>
                </div>
                <div className={styles.debaterActions}>
                  <button
                    className={styles.iconButton}
                    title="Avisar debatedor"
                    aria-label={`Avisar ${debater.user.displayName}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.iconButton} ${styles.danger}`}
                    title="Silenciar debatedor"
                    aria-label={`Silenciar ${debater.user.displayName}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Audience Stats */}
            <div className={styles.statsCard}>
              <h4 className={styles.statsTitle}>Estatísticas</h4>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Audiência</span>
                  <span className={styles.statValue}>{room.audienceCount}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Turnos</span>
                  <span className={styles.statValue}>
                    {room.debaters.reduce((sum, d) => sum + d.turnsCount, 0)}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Perguntas</span>
                  <span className={styles.statValue}>{questions.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className={styles.questionsSection}>
            {/* Pending Questions */}
            {pendingQuestions.length > 0 && (
              <div className={styles.questionGroup}>
                <h4 className={styles.questionGroupTitle}>
                  Pendentes ({pendingQuestions.length})
                </h4>
                {pendingQuestions.map((question) => (
                  <div key={question.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <Avatar
                        src={question.user.avatarUrl}
                        name={question.user.displayName}
                        size="xs"
                      />
                      <span className={styles.questionAuthor}>
                        {question.user.displayName}
                      </span>
                    </div>
                    <p className={styles.questionText}>{question.question}</p>
                    <div className={styles.questionActions}>
                      <button
                        className={`${styles.questionButton} ${styles.approve}`}
                        onClick={() => onApproveQuestion?.(question.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Aprovar
                      </button>
                      <button
                        className={`${styles.questionButton} ${styles.reject}`}
                        onClick={() => onRejectQuestion?.(question.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved Questions */}
            {approvedQuestions.length > 0 && (
              <div className={styles.questionGroup}>
                <h4 className={styles.questionGroupTitle}>
                  Aprovadas ({approvedQuestions.length})
                </h4>
                {approvedQuestions.map((question) => (
                  <div key={question.id} className={`${styles.questionCard} ${styles.approved}`}>
                    <div className={styles.questionHeader}>
                      <Avatar
                        src={question.user.avatarUrl}
                        name={question.user.displayName}
                        size="xs"
                      />
                      <span className={styles.questionAuthor}>
                        {question.user.displayName}
                      </span>
                    </div>
                    <p className={styles.questionText}>{question.question}</p>
                  </div>
                ))}
              </div>
            )}

            {pendingQuestions.length === 0 && approvedQuestions.length === 0 && (
              <p className={styles.emptyState}>
                Nenhuma pergunta da audiência ainda.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
