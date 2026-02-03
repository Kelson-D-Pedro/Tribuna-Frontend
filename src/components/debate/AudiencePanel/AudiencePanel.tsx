'use client';

import React, { useState } from 'react';
import styles from './AudiencePanel.module.css';
import { Avatar } from '@/components/ui/Avatar';
import type { AudienceReaction, AudienceQuestion, ParticipantRole } from '@/types';

interface AudiencePanelProps {
  audienceCount: number;
  reactions: AudienceReaction[];
  questions: AudienceQuestion[];
  userRole: ParticipantRole;
  onReact?: (type: AudienceReaction['type']) => void;
  onSubmitQuestion?: (question: string) => void;
}

const reactionIcons: Record<AudienceReaction['type'], { icon: React.ReactNode; label: string }> = {
  agreement: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
      </svg>
    ),
    label: 'Concordo',
  },
  disagreement: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
      </svg>
    ),
    label: 'Discordo',
  },
  doubt: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: 'Dúvida',
  },
};

export function AudiencePanel({
  audienceCount,
  reactions,
  questions,
  userRole,
  onReact,
  onSubmitQuestion,
}: AudiencePanelProps) {
  const [questionText, setQuestionText] = useState('');
  const [activeTab, setActiveTab] = useState<'reactions' | 'questions'>('reactions');

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim() && onSubmitQuestion) {
      onSubmitQuestion(questionText.trim());
      setQuestionText('');
    }
  };

  const isParticipant = userRole === 'audience' || userRole === 'debater';

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          Audiência
          <span className={styles.count}>{audienceCount}</span>
        </h3>
      </header>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'reactions' ? styles.active : ''}`}
          onClick={() => setActiveTab('reactions')}
        >
          Reações
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'questions' ? styles.active : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Perguntas
          {questions.length > 0 && (
            <span className={styles.badge}>{questions.length}</span>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {/* Reactions Tab */}
        {activeTab === 'reactions' && (
          <div className={styles.reactionsSection}>
            <p className={styles.sectionDescription}>
              Reaja em tempo real ao debate
            </p>

            <div className={styles.reactionsGrid}>
              {Object.entries(reactionIcons).map(([type, { icon, label }]) => {
                const reaction = reactions.find(r => r.type === type);
                return (
                  <button
                    key={type}
                    className={styles.reactionButton}
                    onClick={() => onReact?.(type as AudienceReaction['type'])}
                    disabled={!isParticipant}
                    aria-label={label}
                  >
                    <span className={styles.reactionIcon}>{icon}</span>
                    <span className={styles.reactionLabel}>{label}</span>
                    <span className={styles.reactionCount}>
                      {reaction?.count || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Aggregated Reactions Bar */}
            <div className={styles.aggregateSection}>
              <h4 className={styles.aggregateTitle}>Sentimento da audiência</h4>
              <div className={styles.aggregateBar}>
                {reactions.map(reaction => {
                  const total = reactions.reduce((sum, r) => sum + r.count, 0);
                  const percentage = total > 0 ? (reaction.count / total) * 100 : 0;
                  return (
                    <div
                      key={reaction.type}
                      className={`${styles.aggregateSegment} ${styles[reaction.type]}`}
                      style={{ width: `${percentage}%` }}
                      title={`${reactionIcons[reaction.type].label}: ${Math.round(percentage)}%`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className={styles.questionsSection}>
            {/* Submit Question Form */}
            {isParticipant && (
              <form className={styles.questionForm} onSubmit={handleSubmitQuestion}>
                <textarea
                  className={styles.questionInput}
                  placeholder="Faça uma pergunta ao moderador..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  maxLength={280}
                  rows={2}
                />
                <div className={styles.questionFormFooter}>
                  <span className={styles.charCount}>
                    {questionText.length}/280
                  </span>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!questionText.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </form>
            )}

            {/* Question List */}
            <div className={styles.questionsList}>
              {questions.length === 0 ? (
                <p className={styles.emptyState}>
                  Nenhuma pergunta ainda. Seja o primeiro!
                </p>
              ) : (
                questions.filter(q => q.isApproved).map((question) => (
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
                    {question.isAnswered && (
                      <span className={styles.answeredBadge}>Respondida</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
