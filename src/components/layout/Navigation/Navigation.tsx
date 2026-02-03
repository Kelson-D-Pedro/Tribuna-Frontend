'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Descoberta',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    href: '/salas',
    label: 'Salas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: '/debater',
    label: 'Debater',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
        <polygon points="10,8 16,12 10,16" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/historico',
    label: 'Histórico',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
  {
    href: '/perfil',
    label: 'Perfil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function Navigation() {
  const pathname = usePathname();

  // Don't show navigation on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className={styles.nav} role="navigation" aria-label="Navegação principal">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Tribuna - Página inicial">
          <span className={styles.logoMark}>T</span>
          <span className={styles.logoText}>ribuna</span>
        </Link>

        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
