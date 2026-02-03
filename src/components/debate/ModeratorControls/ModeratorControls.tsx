'use client';

import React, { useState } from 'react';
import styles from './ModeratorControls.module.css';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';

interface Debater {
  id: string;
  name: string;
  isActiveSpeaker: boolean;
  isMuted: boolean;
}

interface ModeratorControlsProps {
  debaters: Debater[];
  currentTurnTime: number; // seconds
  totalTurnTime: number; // seconds
  isPaused: boolean;
  isDebateEnded: boolean;
  onExtendTime: (seconds: number) => void;
  onSendWarning: (debaterId: string, message: string) => void;
  onCutMic: (debaterId: string) => void;
  onTogglePause: () => void;
  onEndDebate: () => void;
  onSwitchTurn: (debaterId: string) => void;
}

const warningMessages = [
  { id: 'time', label: 'Tempo esgotando', message: 'Seu tempo está acabando. Por favor, conclua.' },
  { id: 'topic', label: 'Fora do tema', message: 'Por favor, retorne ao tema principal do debate.' },
  { id: 'respect', label: 'Mantenha o respeito', message: 'Mantenha a civilidade e o respeito ao outro debatedor.' },
  { id: 'evidence', label: 'Falta de evidência', message: 'Por favor, apresente evidências para suas afirmações.' },
];

export function ModeratorControls({
  debaters,
  currentTurnTime,
  totalTurnTime,
  isPaused,
  isDebateEnded,
  onExtendTime,
  onSendWarning,
  onCutMic,
  onTogglePause,
  onEndDebate,
  onSwitchTurn,
}: ModeratorControlsProps) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [selectedDebaterForWarning, setSelectedDebaterForWarning] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = (currentTurnTime / totalTurnTime) * 100;
  const isLowTime = timePercentage <= 20;

  const handleSendWarning = (warning: typeof warningMessages[0]) => {
    if (selectedDebaterForWarning) {
      onSendWarning(selectedDebaterForWarning, warning.message);
      setSelectedDebaterForWarning(null);
    }
  };

  const activeDebater = debaters.find(d => d.isActiveSpeaker);

  return (
    <div className={styles.controls}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Controles do Moderador
        </h3>
      </header>

      {/* Turn Timer */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tempo do Turno</h4>
        <div className={styles.timerCard}>
          <div className={styles.timerDisplay}>
            <span className={`${styles.time} ${isLowTime ? styles.lowTime : ''}`}>
              {formatTime(currentTurnTime)}
            </span>
            <span className={styles.totalTime}>/ {formatTime(totalTurnTime)}</span>
          </div>
          <div className={styles.timerBar}>
            <div 
              className={`${styles.timerProgress} ${isLowTime ? styles.lowTime : ''}`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
          <div className={styles.timerActions}>
            <button 
              className={styles.extendButton}
              onClick={() => onExtendTime(30)}
            >
              +30s
            </button>
            <button 
              className={styles.extendButton}
              onClick={() => onExtendTime(60)}
            >
              +1min
            </button>
          </div>
        </div>
      </section>

      {/* Debaters Control */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Debatedores</h4>
        <div className={styles.debatersList}>
          {debaters.map(debater => (
            <div 
              key={debater.id} 
              className={`${styles.debaterCard} ${debater.isActiveSpeaker ? styles.active : ''}`}
            >
              <div className={styles.debaterInfo}>
                <span className={styles.debaterName}>{debater.name}</span>
                {debater.isActiveSpeaker && (
                  <span className={styles.speakingBadge}>Falando</span>
                )}
              </div>
              <div className={styles.debaterActions}>
                <button
                  className={styles.iconButton}
                  onClick={() => setSelectedDebaterForWarning(debater.id)}
                  title="Enviar aviso"
                  aria-label={`Enviar aviso para ${debater.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </button>
                <button
                  className={`${styles.iconButton} ${styles.danger}`}
                  onClick={() => onCutMic(debater.id)}
                  disabled={debater.isMuted}
                  title="Cortar microfone"
                  aria-label={`Cortar microfone de ${debater.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
                {!debater.isActiveSpeaker && (
                  <button
                    className={styles.iconButton}
                    onClick={() => onSwitchTurn(debater.id)}
                    title="Passar turno"
                    aria-label={`Passar turno para ${debater.name}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,10 20,15 15,20" />
                      <path d="M4 4v7a4 4 0 004 4h12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Debate Control */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Controle do Debate</h4>
        <div className={styles.debateActions}>
          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            onClick={onTogglePause}
            disabled={isDebateEnded}
            className={styles.fullWidth}
          >
            {isPaused ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Retomar Debate
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pausar Debate
              </>
            )}
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowEndConfirm(true)}
            disabled={isDebateEnded}
            className={styles.fullWidth}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
            Encerrar Debate
          </Button>
        </div>
      </section>

      {/* Warning Modal */}
      <Modal
        isOpen={selectedDebaterForWarning !== null}
        onClose={() => setSelectedDebaterForWarning(null)}
        title="Enviar Aviso"
      >
        <div className={styles.warningModal}>
          <p className={styles.warningDescription}>
            Escolha uma mensagem de aviso para enviar ao debatedor:
          </p>
          <div className={styles.warningList}>
            {warningMessages.map(warning => (
              <button
                key={warning.id}
                className={styles.warningButton}
                onClick={() => handleSendWarning(warning)}
              >
                <span className={styles.warningLabel}>{warning.label}</span>
                <span className={styles.warningMessage}>{warning.message}</span>
              </button>
            ))}
          </div>
          <div className={styles.modalActions}>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedDebaterForWarning(null)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* End Debate Confirmation */}
      <ConfirmModal
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={() => {
          onEndDebate();
          setShowEndConfirm(false);
        }}
        title="Encerrar Debate"
        message="Tem certeza que deseja encerrar o debate? Esta ação não pode ser desfeita."
        confirmText="Encerrar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
