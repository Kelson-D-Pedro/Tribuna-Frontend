'use client';

import React, { useState } from 'react';
import styles from './ArgumentTimeline.module.css';
import { Avatar } from '@/components/ui/Avatar';
import type { DebateTurn } from '@/types';

interface ArgumentTimelineProps {
  turns: DebateTurn[];
  activeSpeakerId: string | null;
  currentUserId: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function ArgumentTimeline({
  turns,
  activeSpeakerId,
  currentUserId,
}: ArgumentTimelineProps) {
  const [expandedTurn, setExpandedTurn] = useState<string | null>(null);

  const toggleExpand = (turnId: string) => {
    setExpandedTurn(expandedTurn === turnId ? null : turnId);
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <h2 className={styles.title}>Linha de Argumentação</h2>
        <span className={styles.turnCount}>{turns.length} turnos</span>
      </div>

      <div className={styles.turns}>
        {turns.map((turn, index) => {
          const isExpanded = expandedTurn === turn.id;
          const isSelf = turn.speakerId === currentUserId;

          return (
            <div
              key={turn.id}
              className={`${styles.turn} ${isSelf ? styles.self : ''}`}
            >
              <div className={styles.turnConnector}>
                <div className={styles.turnDot} />
                {index < turns.length - 1 && <div className={styles.turnLine} />}
              </div>

              <div className={styles.turnContent}>
                <button
                  className={styles.turnHeader}
                  onClick={() => toggleExpand(turn.id)}
                  aria-expanded={isExpanded}
                >
                  <Avatar
                    src={turn.speaker.avatarUrl}
                    name={turn.speaker.displayName}
                    size="sm"
                  />
                  <div className={styles.turnMeta}>
                    <span className={styles.speakerName}>
                      {turn.speaker.displayName}
                      {isSelf && <span className={styles.selfBadge}>você</span>}
                    </span>
                    <span className={styles.turnTime}>
                      {formatTime(turn.startedAt)} • {formatDuration(turn.duration)}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </button>

                {isExpanded && turn.transcription && (
                  <div className={styles.turnTranscription}>
                    <p>{turn.transcription}</p>
                    {turn.highlights && turn.highlights.length > 0 && (
                      <div className={styles.highlights}>
                        <span className={styles.highlightsLabel}>Destaques:</span>
                        {turn.highlights.map((highlight) => (
                          <span
                            key={highlight.id}
                            className={`${styles.highlight} ${styles[highlight.type]}`}
                          >
                            {highlight.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Active Speaking Indicator */}
        {activeSpeakerId && (
          <div className={`${styles.turn} ${styles.active}`}>
            <div className={styles.turnConnector}>
              <div className={`${styles.turnDot} ${styles.activeDot}`} />
            </div>
            <div className={styles.turnContent}>
              <div className={styles.activeIndicator}>
                <div className={styles.activeWave}>
                  <span />
                  <span />
                  <span />
                </div>
                <span>Turno em andamento...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
