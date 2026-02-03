'use client';

import React from 'react';
import Link from 'next/link';
import styles from './RoomCard.module.css';
import { Card } from '@/components/ui/Card';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { LiveBadge, ScheduledBadge, EndedBadge, LevelBadge, DebateTypeBadge } from '@/components/ui/Badge';
import type { DebateRoom, DebateStatus } from '@/types';

export interface RoomCardProps {
  room: DebateRoom;
  variant?: 'default' | 'compact' | 'featured';
}

function StatusBadge({ status }: { status: DebateStatus }) {
  switch (status) {
    case 'live':
      return <LiveBadge />;
    case 'scheduled':
      return <ScheduledBadge />;
    case 'ended':
      return <EndedBadge />;
  }
}

function formatScheduledTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (hours > 0) {
    return `Em ${hours}h ${minutes}min`;
  }

  return `Em ${minutes} min`;
}

export function RoomCard({ room, variant = 'default' }: RoomCardProps) {
  const {
    id,
    theme,
    description,
    type,
    status,
    level,
    creator,
    debaters,
    audienceCount,
    scheduledAt,
  } = room;

  if (variant === 'compact') {
    return (
      <Link href={`/sala/${id}`} className={styles.cardLink}>
        <Card className={styles.compactCard} padding="sm">
          <div className={styles.compactHeader}>
            <StatusBadge status={status} />
            <DebateTypeBadge type={type} />
          </div>
          <h3 className={styles.compactTitle}>{theme}</h3>
          <div className={styles.compactMeta}>
            <span className={styles.participants}>
              {audienceCount} assistindo
            </span>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/sala/${id}`} className={styles.cardLink}>
        <Card className={styles.featuredCard} padding="lg">
          <div className={styles.featuredHeader}>
            <StatusBadge status={status} />
            <LevelBadge level={level} />
          </div>
          <h2 className={styles.featuredTitle}>{theme}</h2>
          <p className={styles.featuredDescription}>{description}</p>
          <div className={styles.featuredMeta}>
            <DebateTypeBadge type={type} />
            <div className={styles.featuredParticipants}>
              <AvatarGroup size="sm">
                {debaters.map((debater) => (
                  <Avatar
                    key={debater.userId}
                    src={debater.user.avatarUrl}
                    name={debater.user.displayName}
                  />
                ))}
              </AvatarGroup>
              <span className={styles.audienceCount}>
                {audienceCount > 0 && `+${audienceCount} assistindo`}
              </span>
            </div>
          </div>
          {status === 'scheduled' && scheduledAt && (
            <div className={styles.scheduledTime}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {formatScheduledTime(scheduledAt)}
            </div>
          )}
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/sala/${id}`} className={styles.cardLink}>
      <Card className={styles.card} padding="md">
        <div className={styles.cardHeader}>
          <StatusBadge status={status} />
          <LevelBadge level={level} />
        </div>
        
        <h3 className={styles.cardTitle}>{theme}</h3>
        
        {description && (
          <p className={styles.cardDescription}>{description}</p>
        )}
        
        <div className={styles.cardMeta}>
          <DebateTypeBadge type={type} />
        </div>
        
        <div className={styles.cardFooter}>
          <div className={styles.creator}>
            <Avatar
              src={creator.avatarUrl}
              name={creator.displayName}
              size="xs"
            />
            <span className={styles.creatorName}>{creator.displayName}</span>
          </div>
          
          <div className={styles.stats}>
            {debaters.length > 0 && (
              <span className={styles.stat}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                {debaters.length}
              </span>
            )}
            {audienceCount > 0 && (
              <span className={styles.stat}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {audienceCount}
              </span>
            )}
          </div>
        </div>
        
        {status === 'scheduled' && scheduledAt && (
          <div className={styles.scheduledTime}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {formatScheduledTime(scheduledAt)}
          </div>
        )}
      </Card>
    </Link>
  );
}
