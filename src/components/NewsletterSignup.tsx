'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          frequency,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setEmail('');
        setTags('');
      } else {
        setError(data.error || 'Erro ao cadastrar email');
      }
  } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Cadastro realizado!
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Você receberá um email de confirmação em breve.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-green-600 hover:text-green-500 text-sm underline"
        >
          Cadastrar outro email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          📧 Receba vagas por email
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Seja notificado sobre novas oportunidades remotas que combinam com seu perfil
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tecnologias de interesse (opcional)
          </label>
          <Input
            type="text"
            placeholder="React, Python, Node.js..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Separe por vírgulas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequência
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="weekly"
                checked={frequency === 'weekly'}
                onChange={(e) => setFrequency(e.target.value as 'weekly')}
                className="mr-2"
              />
              <span className="text-sm">Semanal</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="daily"
                checked={frequency === 'daily'}
                onChange={(e) => setFrequency(e.target.value as 'daily')}
                className="mr-2"
              />
              <span className="text-sm">Diário</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? '⏳ Cadastrando...' : '📧 Receber Alertas'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Você pode cancelar a qualquer momento. Sem spam, prometemos! 🚫📩
      </p>
    </div>
  );
}
