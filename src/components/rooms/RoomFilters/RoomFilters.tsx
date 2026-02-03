'use client';

import React from 'react';
import styles from './RoomFilters.module.css';
import { Button } from '@/components/ui/Button';

export type FilterStatus = 'all' | 'live' | 'scheduled' | 'ended';
export type FilterType = 'all' | 'human-vs-human' | 'human-vs-ai';
export type FilterLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';
export type SortOption = 'popular' | 'recent' | 'starting-soon';

export interface FiltersState {
  status: FilterStatus;
  type: FilterType;
  level: FilterLevel;
  sortBy: SortOption;
}

export interface RoomFiltersProps {
  filters: FiltersState;
  onFilterChange: (key: keyof FiltersState, value: string) => void;
}

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'live', label: 'Ao vivo' },
  { value: 'scheduled', label: 'Agendadas' },
  { value: 'ended', label: 'Encerradas' },
];

const typeOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'human-vs-human', label: 'Humano vs Humano' },
  { value: 'human-vs-ai', label: 'Humano vs IA' },
];

const levelOptions: { value: FilterLevel; label: string }[] = [
  { value: 'all', label: 'Todos os níveis' },
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Populares' },
  { value: 'recent', label: 'Recentes' },
  { value: 'starting-soon', label: 'Começando em breve' },
];

export function RoomFilters({
  filters,
  onFilterChange,
}: RoomFiltersProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.type !== 'all' || filters.level !== 'all';

  const handleClearFilters = () => {
    onFilterChange('status', 'all');
    onFilterChange('type', 'all');
    onFilterChange('level', 'all');
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <div className={styles.filterOptions}>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.filterButton} ${filters.status === option.value ? styles.active : ''}`}
              onClick={() => onFilterChange('status', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Tipo</label>
        <select
          className={styles.filterSelect}
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value as FilterType)}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Nível</label>
        <select
          className={styles.filterSelect}
          value={filters.level}
          onChange={(e) => onFilterChange('level', e.target.value as FilterLevel)}
        >
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Ordenar por</label>
        <select
          className={styles.filterSelect}
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value as SortOption)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
