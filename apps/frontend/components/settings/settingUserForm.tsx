'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Save, Loader2 } from 'lucide-react';

// Schéma de validation pour le formulaire
const userSettingsSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères"),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
});

type UserSettingsForm = z.infer<typeof userSettingsSchema>;

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  firstname?: string;
  lastname?: string;
}

interface SettingUserFormProps {
  user: User;
  token: string;
  onUserUpdate?: (updatedUser: User) => void;
}

// Fonction utilitaire pour faire des appels API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${API_BASE_URL}/${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

export default function SettingUserForm({
  user,
  token,
  onUserUpdate,
}: SettingUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      avatar: '',
    },
  });

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || '',
        username: user.username || '',
        firstname: (user as unknown as { firstname: string }).firstname || '',
        lastname: (user as unknown as { lastname: string }).lastname || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, form]);

  // Fonction pour sauvegarder les modifications
  const onSubmit = async (data: UserSettingsForm) => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const updatedUser = await apiRequest(`user/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Mettre à jour l'utilisateur dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fliptrade_user', JSON.stringify(updatedUser));
      }

      // Callback pour notifier le parent de la mise à jour
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations personnelles
        </CardTitle>
        <CardDescription>
          Modifiez vos informations personnelles ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'utilisateur" {...field} />
                  </FormControl>
                  <FormDescription>
                    Votre nom d&apos;utilisateur doit être unique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Votre adresse email doit être unique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar (URL)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemple.com/avatar.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL de votre image de profil (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-black dark:text-white" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
