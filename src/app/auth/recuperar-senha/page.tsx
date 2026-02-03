'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../login/auth.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (!email) {
      setError('E-mail é obrigatório');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('E-mail inválido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      setError('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>
              <span className={styles.logoMark}>T</span>
              <span>ribuna</span>
            </Link>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h1 className={styles.authTitle}>E-mail enviado</h1>
            <p className={styles.authSubtitle}>
              Se existe uma conta com o e-mail <strong>{email}</strong>, 
              você receberá instruções para redefinir sua senha.
            </p>
          </div>

          <div className={styles.authFooter}>
            <p>
              <Link href="/auth/login">Voltar para login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.authLogo}>
            <span className={styles.logoMark}>T</span>
            <span>ribuna</span>
          </Link>
          <h1 className={styles.authTitle}>Recuperar senha</h1>
          <p className={styles.authSubtitle}>
            Informe seu e-mail para receber instruções de recuperação.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isLoading}
          />

          <Button
            type="submit"
            isFullWidth
            isLoading={isLoading}
            size="lg"
          >
            Enviar instruções
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Lembrou a senha?{' '}
            <Link href="/auth/login">Voltar para login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
