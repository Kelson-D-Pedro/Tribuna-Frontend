'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AppContext';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.authLogo}>
            <span className={styles.logoMark}>T</span>
            <span>ribuna</span>
          </Link>
          <h1 className={styles.authTitle}>Entrar</h1>
          <p className={styles.authSubtitle}>
            Debater, aprender, evoluir.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
          />

          <div className={styles.forgotPassword}>
            <Link href="/auth/recuperar-senha">Esqueceu a senha?</Link>
          </div>

          <Button
            type="submit"
            isFullWidth
            isLoading={isLoading}
            size="lg"
          >
            Entrar
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Não tem uma conta?{' '}
            <Link href="/auth/registrar">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
