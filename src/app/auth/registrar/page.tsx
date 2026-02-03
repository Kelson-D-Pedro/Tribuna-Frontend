'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/auth.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AppContext';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Use apenas letras, números e underline';
    }

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(email, password, username);
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
          <h1 className={styles.authTitle}>Criar conta</h1>
          <p className={styles.authSubtitle}>
            Junte-se a uma comunidade de aprendizado intelectual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <Input
            label="Nome de usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            placeholder="seu_usuario"
            autoComplete="username"
            disabled={isLoading}
            hint="Letras, números e underline apenas"
          />

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
            autoComplete="new-password"
            disabled={isLoading}
            hint="Mínimo 8 caracteres"
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            isFullWidth
            isLoading={isLoading}
            size="lg"
          >
            Criar conta
          </Button>

          <p className={styles.termsText}>
            Ao criar uma conta, você concorda em participar de debates 
            construtivos e respeitosos.
          </p>
        </form>

        <div className={styles.authFooter}>
          <p>
            Já tem uma conta?{' '}
            <Link href="/auth/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
