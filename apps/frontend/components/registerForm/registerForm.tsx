'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Une erreur est survenue lors de l'inscription",
        );
        return;
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <Card className="bg-white border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="space-y-1 pb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Créer un compte
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Entrez votre nom d&apos;utilisateur, votre email et votre mot de
              passe ci-dessous pour créer votre compte.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                Nom d&apos;utilisateur
              </Label>
              <Input
                className="bg-gray-200 text-black selection:bg-gray-300 selection:text-black border border-gray-600 dark:text-white dark:border-gray-700 dark:selection:bg-gray-700 dark:selection:text-white"
                id="username"
                type="text"
                required
                placeholder="John Doe"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                Adresse email
              </Label>
              <Input
                className="bg-gray-200 text-black selection:bg-gray-300 selection:text-black border border-gray-600 dark:text-white dark:border-gray-700 dark:selection:bg-gray-700 dark:selection:text-white"
                id="email"
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  Mot de passe
                </Label>
              </div>
              <Input
                className="bg-gray-200 text-black selection:bg-gray-300 selection:text-black border border-gray-600 dark:text-white dark:border-gray-700 dark:selection:bg-gray-700 dark:selection:text-white"
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="space-y-3 pt-4">
              <Button
                className="w-full cursor-pointer h-12 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleRegister}
              >
                S&apos;inscrire
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 hover:cursor-pointer bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white font-medium text-sm rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                S&apos;inscrire avec Google
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vous avez déjà un compte ?
          </p>
          <Link
            href="/sign-in"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
