'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { RoomCreationData, DebateFormat, DebateType, DebateLevel } from '@/types';

interface StepProps {
  data: RoomCreationData;
  updateData: (data: Partial<RoomCreationData>) => void;
  errors: Record<string, string>;
}

const STEPS = [
  { id: 1, title: 'Tema', description: 'Qual será o tema central do debate?' },
  { id: 2, title: 'Descrição', description: 'Descreva brevemente o debate' },
  { id: 3, title: 'Formato', description: 'Como será a comunicação?' },
  { id: 4, title: 'Modo', description: 'Contra quem você debaterá?' },
  { id: 5, title: 'Revisão', description: 'Revise antes de criar' },
];

function ThemeStep({ data, updateData, errors }: StepProps) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Defina o tema do debate</h2>
        <p className={styles.stepDescription}>
          Um bom tema é específico o suficiente para gerar posições claras,
          mas amplo o suficiente para permitir profundidade argumentativa.
        </p>
      </div>

      <div className={styles.formField}>
        <Input
          label="Tema do debate"
          value={data.theme}
          onChange={(e) => updateData({ theme: e.target.value })}
          error={errors.theme}
          placeholder="Ex: A consciência pode ser explicada pela neurociência?"
        />
        <p className={styles.fieldHint}>
          Formule como uma pergunta ou afirmação que permita posicionamentos opostos.
        </p>
      </div>

      <div className={styles.examplesSection}>
        <h4 className={styles.examplesTitle}>Exemplos de bons temas:</h4>
        <ul className={styles.examplesList}>
          <li>O livre-arbítrio é compatível com o determinismo?</li>
          <li>A democracia direta é preferível à representativa?</li>
          <li>A inteligência artificial pode ser consciente?</li>
        </ul>
      </div>
    </div>
  );
}

function DescriptionStep({ data, updateData, errors }: StepProps) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Descreva o debate</h2>
        <p className={styles.stepDescription}>
          Uma boa descrição ajuda participantes a entenderem o escopo 
          e as expectativas do debate.
        </p>
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Descrição</label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Descreva o contexto, as posições esperadas e o que você espera explorar neste debate..."
          rows={4}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
        <p className={styles.fieldHint}>
          Máximo 500 caracteres. Seja claro e objetivo.
        </p>
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Tags (opcional)</label>
        <Input
          value={data.tags.join(', ')}
          onChange={(e) => updateData({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
          placeholder="Ex: Filosofia, Ética, Política"
        />
        <p className={styles.fieldHint}>
          Separe as tags por vírgulas. Ajudam outros a encontrar seu debate.
        </p>
      </div>
    </div>
  );
}

function FormatStep({ data, updateData }: StepProps) {
  const formats: { value: DebateFormat; title: string; description: string }[] = [
    {
      value: 'spoken',
      title: 'Falado',
      description: 'Comunicação exclusivamente por voz. Ideal para debates fluidos e naturais.',
    },
    {
      value: 'spoken-text',
      title: 'Falado + Texto',
      description: 'Voz principal com suporte a texto. Permite referências e citações escritas.',
    },
  ];

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Escolha o formato</h2>
        <p className={styles.stepDescription}>
          O formato determina como os debatedores se comunicarão durante a sessão.
        </p>
      </div>

      <div className={styles.optionsGrid}>
        {formats.map((format) => (
          <button
            key={format.value}
            className={`${styles.optionCard} ${data.format === format.value ? styles.selected : ''}`}
            onClick={() => updateData({ format: format.value })}
          >
            <div className={styles.optionIcon}>
              {format.value === 'spoken' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <rect x="2" y="18" width="20" height="4" rx="1" />
                </svg>
              )}
            </div>
            <h3 className={styles.optionTitle}>{format.title}</h3>
            <p className={styles.optionDescription}>{format.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModeStep({ data, updateData }: StepProps) {
  const modes: { value: DebateType; title: string; description: string }[] = [
    {
      value: 'human-vs-human',
      title: 'Humano vs Humano',
      description: 'Debate clássico entre dois participantes humanos. Requer que outro debatedor entre na sala.',
    },
    {
      value: 'human-vs-ai',
      title: 'Humano vs IA',
      description: 'Debate contra uma inteligência artificial. Ideal para praticar argumentação ou explorar temas sozinho.',
    },
  ];

  const levels: { value: DebateLevel; title: string; description: string }[] = [
    { value: 'beginner', title: 'Iniciante', description: 'Para quem está começando a debater' },
    { value: 'intermediate', title: 'Intermediário', description: 'Conhecimento básico do tema' },
    { value: 'advanced', title: 'Avançado', description: 'Domínio do tema e técnicas de debate' },
  ];

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Escolha o modo de debate</h2>
        <p className={styles.stepDescription}>
          Defina contra quem você debaterá e o nível esperado dos participantes.
        </p>
      </div>

      <div className={styles.sectionLabel}>Oponente</div>
      <div className={styles.optionsGrid}>
        {modes.map((mode) => (
          <button
            key={mode.value}
            className={`${styles.optionCard} ${data.type === mode.value ? styles.selected : ''}`}
            onClick={() => updateData({ type: mode.value })}
          >
            <div className={styles.optionIcon}>
              {mode.value === 'human-vs-human' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <line x1="3" y1="20" x2="21" y2="20" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              )}
            </div>
            <h3 className={styles.optionTitle}>{mode.title}</h3>
            <p className={styles.optionDescription}>{mode.description}</p>
          </button>
        ))}
      </div>

      <div className={styles.sectionLabel}>Nível</div>
      <div className={styles.levelOptions}>
        {levels.map((level) => (
          <button
            key={level.value}
            className={`${styles.levelButton} ${data.level === level.value ? styles.selected : ''}`}
            onClick={() => updateData({ level: level.value })}
          >
            <span className={styles.levelTitle}>{level.title}</span>
            <span className={styles.levelDescription}>{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({ data }: StepProps) {
  const formatLabels: Record<DebateFormat, string> = {
    'spoken': 'Falado',
    'spoken-text': 'Falado + Texto',
  };

  const typeLabels: Record<DebateType, string> = {
    'human-vs-human': 'Humano vs Humano',
    'human-vs-ai': 'Humano vs IA',
  };

  const levelLabels: Record<DebateLevel, string> = {
    'beginner': 'Iniciante',
    'intermediate': 'Intermediário',
    'advanced': 'Avançado',
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Revisão final</h2>
        <p className={styles.stepDescription}>
          Confira as informações antes de criar a sala. 
          Após a criação, você não poderá alterar o tema.
        </p>
      </div>

      <Card padding="lg" className={styles.reviewCard}>
        <div className={styles.reviewSection}>
          <h4 className={styles.reviewLabel}>Tema</h4>
          <p className={styles.reviewValue}>{data.theme}</p>
        </div>

        <div className={styles.reviewSection}>
          <h4 className={styles.reviewLabel}>Descrição</h4>
          <p className={styles.reviewValue}>{data.description || 'Nenhuma descrição'}</p>
        </div>

        <div className={styles.reviewGrid}>
          <div className={styles.reviewSection}>
            <h4 className={styles.reviewLabel}>Formato</h4>
            <p className={styles.reviewValue}>{formatLabels[data.format]}</p>
          </div>

          <div className={styles.reviewSection}>
            <h4 className={styles.reviewLabel}>Modo</h4>
            <p className={styles.reviewValue}>{typeLabels[data.type]}</p>
          </div>

          <div className={styles.reviewSection}>
            <h4 className={styles.reviewLabel}>Nível</h4>
            <p className={styles.reviewValue}>{levelLabels[data.level]}</p>
          </div>
        </div>

        {data.tags.length > 0 && (
          <div className={styles.reviewSection}>
            <h4 className={styles.reviewLabel}>Tags</h4>
            <div className={styles.tagsList}>
              {data.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className={styles.rulesSection}>
        <h4 className={styles.rulesTitle}>Regras do debate</h4>
        <ul className={styles.rulesList}>
          <li>Turnos de 3 minutos por debatedor</li>
          <li>Respeite o tempo de fala do oponente</li>
          <li>Mantenha-se no tema proposto</li>
          <li>Argumentos devem ser racionais e respeitosos</li>
          <li>A audiência pode enviar perguntas moderadas</li>
        </ul>
      </div>
    </div>
  );
}

export default function CreateRoomPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<RoomCreationData>({
    theme: '',
    description: '',
    format: 'spoken',
    type: 'human-vs-human',
    level: 'intermediate',
    rules: {
      turnDuration: 180,
      allowAudienceQuestions: true,
      allowTranscription: true,
      moderatorCanMute: true,
    },
    tags: [],
  });

  const updateData = (data: Partial<RoomCreationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    Object.keys(data).forEach((key) => delete clearedErrors[key]);
    setErrors(clearedErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.theme.trim()) {
          newErrors.theme = 'O tema é obrigatório';
        } else if (formData.theme.length < 10) {
          newErrors.theme = 'O tema deve ter pelo menos 10 caracteres';
        }
        break;
      case 2:
        if (formData.description && formData.description.length > 500) {
          newErrors.description = 'A descrição deve ter no máximo 500 caracteres';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // TODO: API call to create room
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/sala/new-room-id');
    } catch (error) {
      setErrors({ submit: 'Erro ao criar sala. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps: StepProps = { data: formData, updateData, errors };

    switch (currentStep) {
      case 1:
        return <ThemeStep {...stepProps} />;
      case 2:
        return <DescriptionStep {...stepProps} />;
      case 3:
        return <FormatStep {...stepProps} />;
      case 4:
        return <ModeStep {...stepProps} />;
      case 5:
        return <ReviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Progress */}
        <div className={styles.progress}>
          <div className={styles.progressSteps}>
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.progressStep} ${
                  currentStep > step.id ? styles.completed : ''
                } ${currentStep === step.id ? styles.active : ''}`}
              >
                <div className={styles.progressNumber}>{step.id}</div>
                <span className={styles.progressLabel}>{step.title}</span>
              </div>
            ))}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className={styles.stepContainer}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={goToPrevStep} disabled={isSubmitting}>
              Voltar
            </Button>
          )}
          <div className={styles.navigationSpacer} />
          {currentStep < STEPS.length ? (
            <Button onClick={goToNextStep}>
              Continuar
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Criar Sala
            </Button>
          )}
        </div>

        {errors.submit && (
          <div className={styles.submitError} role="alert">
            {errors.submit}
          </div>
        )}
      </div>
    </div>
  );
}
