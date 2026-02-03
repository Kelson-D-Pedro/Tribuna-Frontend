'use client';

import React from 'react';
import styles from './DebateCenter.module.css';
import { Avatar } from '@/components/ui/Avatar';
import type { DebateRoom, Debater, ParticipantRole } from '@/types';

interface DebateCenterProps {
  room: DebateRoom;
  activeSpeakerId: string | null;
  currentDebater?: Debater;
  turnTimeRemaining: number;
  isSpeaking: boolean;
  userRole: ParticipantRole;
  currentUserId: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function DebateCenter({
  room,
  activeSpeakerId,
  currentDebater,
  turnTimeRemaining,
  isSpeaking,
  userRole,
  currentUserId,
}: DebateCenterProps) {
  const isLowTime = turnTimeRemaining < 30;
  const isCriticalTime = turnTimeRemaining < 10;

  return (
    <div className={styles.center}>
      {/* Debaters Display */}
      <div className={styles.debatersArea}>
        {room.debaters.map((debater) => {
          const isActive = debater.userId === activeSpeakerId;
          const isCurrentUser = debater.userId === currentUserId;

          return (
            <div
              key={debater.userId}
              className={`${styles.debaterCard} ${isActive ? styles.active : ''} ${isCurrentUser ? styles.self : ''}`}
            >
              <div className={styles.debaterAvatarWrapper}>
                <Avatar
                  src={debater.user.avatarUrl}
                  name={debater.user.displayName}
                  size="xl"
                  status={isActive ? 'speaking' : 'online'}
                />
                {isActive && (
                  <div className={styles.speakingRing}>
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray="301.59"
                        strokeDashoffset={301.59 * (1 - turnTimeRemaining / room.rules.turnDuration)}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className={styles.debaterInfo}>
                <h3 className={styles.debaterName}>
                  {debater.user.displayName}
                  {isCurrentUser && <span className={styles.youBadge}>você</span>}
                </h3>
                <p className={styles.debaterPosition}>{debater.position}</p>
              </div>

              {isActive && (
                <div className={styles.activeBadge}>
                  <span className={styles.speakingDot} />
                  Falando
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timer */}
      {activeSpeakerId && (
        <div className={`${styles.timer} ${isLowTime ? styles.warning : ''} ${isCriticalTime ? styles.critical : ''}`}>
          <div className={styles.timerLabel}>Tempo restante</div>
          <div className={styles.timerValue}>{formatTime(turnTimeRemaining)}</div>
          {isCriticalTime && (
            <div className={styles.timerWarning}>
              Prepare-se para concluir
            </div>
          )}
        </div>
      )}

      {/* Speaking Indicator for Current User */}
      {isSpeaking && (
        <div className={styles.speakingIndicator}>
          <div className={styles.waveform}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className={styles.speakingText}>Você está falando</span>
        </div>
      )}

      {/* Moderator Presence */}
      {room.moderator && (
        <div className={styles.moderatorPresence}>
          <Avatar
            src={room.moderator.avatarUrl}
            name={room.moderator.displayName}
            size="sm"
          />
          <span className={styles.moderatorLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Moderador: {room.moderator.displayName}
          </span>
        </div>
      )}

      {/* Transcription Area */}
      {room.format === 'spoken-text' && currentDebater && (
        <div className={styles.transcriptionArea}>
          <div className={styles.transcriptionHeader}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            Transcrição em tempo real
          </div>
          <div className={styles.transcriptionContent}>
            <p className={styles.transcriptionText}>
              Aguardando fala...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
