'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { User, AuthState, ToastMessage, DebateRoom, AudioState } from '@/types';

// ============================================
// AUTH CONTEXT
// ============================================

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authInitialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return authInitialState;
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
        createdAt: new Date(),
        titles: [],
        followedTopics: [],
        followedUsers: [],
        debateStats: {
          totalDebates: 0,
          hoursDebated: 0,
          topicsExplored: 0,
          averageClarity: 0,
          averageCoherence: 0,
          averagePrecision: 0,
          averageDepth: 0,
        },
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Falha ao entrar. Verifique suas credenciais.' });
    }
  };

  const register = async (email: string, password: string, username: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email,
        username,
        displayName: username,
        createdAt: new Date(),
        titles: [],
        followedTopics: [],
        followedUsers: [],
        debateStats: {
          totalDebates: 0,
          hoursDebated: 0,
          topicsExplored: 0,
          averageClarity: 0,
          averageCoherence: 0,
          averagePrecision: 0,
          averageDepth: 0,
        },
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Falha ao criar conta. Tente novamente.' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================
// TOAST CONTEXT
// ============================================

interface ToastState {
  toasts: ToastMessage[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string };

const toastInitialState: ToastState = {
  toasts: [],
};

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, toastInitialState);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });

    // Auto remove after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================
// DEBATE ROOM CONTEXT
// ============================================

interface DebateRoomState {
  currentRoom: DebateRoom | null;
  isConnected: boolean;
  audioState: AudioState;
  activeSpeakerId: string | null;
  isRequestingTurn: boolean;
}

type DebateRoomAction =
  | { type: 'JOIN_ROOM'; payload: DebateRoom }
  | { type: 'LEAVE_ROOM' }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_AUDIO_STATE'; payload: Partial<AudioState> }
  | { type: 'SET_ACTIVE_SPEAKER'; payload: string | null }
  | { type: 'REQUEST_TURN'; payload: boolean }
  | { type: 'UPDATE_ROOM'; payload: Partial<DebateRoom> };

const debateRoomInitialState: DebateRoomState = {
  currentRoom: null,
  isConnected: false,
  audioState: {
    isMuted: true,
    isSpeaking: false,
    volume: 100,
    latency: 0,
    quality: 'good',
  },
  activeSpeakerId: null,
  isRequestingTurn: false,
};

function debateRoomReducer(state: DebateRoomState, action: DebateRoomAction): DebateRoomState {
  switch (action.type) {
    case 'JOIN_ROOM':
      return { ...state, currentRoom: action.payload, isConnected: true };
    case 'LEAVE_ROOM':
      return debateRoomInitialState;
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_AUDIO_STATE':
      return { ...state, audioState: { ...state.audioState, ...action.payload } };
    case 'SET_ACTIVE_SPEAKER':
      return { ...state, activeSpeakerId: action.payload };
    case 'REQUEST_TURN':
      return { ...state, isRequestingTurn: action.payload };
    case 'UPDATE_ROOM':
      return {
        ...state,
        currentRoom: state.currentRoom ? { ...state.currentRoom, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface DebateRoomContextType extends DebateRoomState {
  joinRoom: (room: DebateRoom) => void;
  leaveRoom: () => void;
  toggleMute: () => void;
  requestTurn: () => void;
  cancelTurnRequest: () => void;
  setVolume: (volume: number) => void;
}

const DebateRoomContext = createContext<DebateRoomContextType | undefined>(undefined);

export function DebateRoomProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(debateRoomReducer, debateRoomInitialState);

  const joinRoom = (room: DebateRoom) => {
    dispatch({ type: 'JOIN_ROOM', payload: room });
  };

  const leaveRoom = () => {
    dispatch({ type: 'LEAVE_ROOM' });
  };

  const toggleMute = () => {
    dispatch({
      type: 'SET_AUDIO_STATE',
      payload: { isMuted: !state.audioState.isMuted },
    });
  };

  const requestTurn = () => {
    dispatch({ type: 'REQUEST_TURN', payload: true });
  };

  const cancelTurnRequest = () => {
    dispatch({ type: 'REQUEST_TURN', payload: false });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_AUDIO_STATE', payload: { volume } });
  };

  return (
    <DebateRoomContext.Provider
      value={{
        ...state,
        joinRoom,
        leaveRoom,
        toggleMute,
        requestTurn,
        cancelTurnRequest,
        setVolume,
      }}
    >
      {children}
    </DebateRoomContext.Provider>
  );
}

export function useDebateRoom() {
  const context = useContext(DebateRoomContext);
  if (context === undefined) {
    throw new Error('useDebateRoom must be used within a DebateRoomProvider');
  }
  return context;
}

// ============================================
// COMBINED PROVIDER
// ============================================

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <DebateRoomProvider>{children}</DebateRoomProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
