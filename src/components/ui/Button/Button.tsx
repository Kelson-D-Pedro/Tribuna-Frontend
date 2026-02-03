'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      isFullWidth ? styles.fullWidth : '',
      isLoading ? styles.loading : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className={styles.spinnerIcon}>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="12"
              />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {!isLoading && rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
