'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import styles from './Tabs.module.css';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

export interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value,
  onChange,
  className = '',
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = (id: string) => {
    if (value === undefined) {
      setInternalValue(id);
    }
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`${styles.tabs} ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`${styles.tabsList} ${className}`} role="tablist">
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  children,
  value,
  disabled = false,
  className = '',
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export function TabsContent({ children, value, className = '' }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={`${styles.tabsContent} ${className}`}
    >
      {children}
    </div>
  );
}
