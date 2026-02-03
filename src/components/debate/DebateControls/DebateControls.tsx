'use client';

import React from 'react';
import styles from './DebateControls.module.css';
import { Button } from '@/components/ui/Button';
import type { ParticipantRole } from '@/types';

interface DebateControlsProps {
  userRole: ParticipantRole;
  isMuted: boolean;
  isSpeaking: boolean;
  isActiveSpeaker: boolean;
  isRequestingTurn: boolean;
  onToggleMute: () => void;
  onRequestTurn: () => void;
  onLeaveRoom: () => void;
}

export function DebateControls({
  userRole,
  isMuted,
  isSpeaking,
  isActiveSpeaker,
  isRequestingTurn,
  onToggleMute,
  onRequestTurn,
  onLeaveRoom,
}: DebateControlsProps) {
  const isDebater = userRole === 'debater';
  const isModerator = userRole === 'moderator';

  return (
    <div className={styles.controls}>
      <div className={styles.controlsInner}>
        {/* Left: Audio Controls */}
        <div className={styles.leftControls}>
          {isDebater && (
            <>
              <button
                className={`${styles.audioButton} ${!isMuted ? styles.active : ''}`}
                onClick={onToggleMute}
                disabled={!isActiveSpeaker}
                aria-label={isMuted ? 'Ativar microfone' : 'Desativar microfone'}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>

              {!isActiveSpeaker && (
                <button
                  className={`${styles.requestButton} ${isRequestingTurn ? styles.requesting : ''}`}
                  onClick={onRequestTurn}
                  aria-label={isRequestingTurn ? 'Cancelar pedido de turno' : 'Pedir turno para falar'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 10h-4V6" />
                    <path d="M14 10l7.586-7.586a2 2 0 012.828 0v0a2 2 0 010 2.828L14 10z" />
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <span>{isRequestingTurn ? 'Solicitando...' : 'Pedir turno'}</span>
                </button>
              )}
            </>
          )}

          {isModerator && (
            <div className={styles.moderatorControls}>
              <button className={styles.modButton} aria-label="Avisar tempo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>Aviso</span>
              </button>
              <button className={styles.modButton} aria-label="Pausar debate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pausar</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Status */}
        <div className={styles.centerStatus}>
          {isSpeaking && isActiveSpeaker && (
            <div className={styles.speakingStatus}>
              <div className={styles.waveform}>
                <span />
                <span />
                <span />
              </div>
              <span>Falando</span>
            </div>
          )}
          {isRequestingTurn && (
            <div className={styles.waitingStatus}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span>Aguardando turno...</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className={styles.rightControls}>
          <button 
            className={styles.settingsButton}
            aria-label="Configurações de áudio"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>

          <Button 
            variant="danger" 
            size="sm"
            onClick={onLeaveRoom}
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
