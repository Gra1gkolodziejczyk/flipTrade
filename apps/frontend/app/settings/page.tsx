'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Mail,
  UserCheck,
  Calendar,
  Wallet,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import SettingUserForm from '@/components/settings/settingUserForm';

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

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteAccount = async () => {
    if (!user || !token || deleteConfirmation !== 'SUPPRIMER') return;

    setIsLoading(true);
    try {
      await apiRequest(`user/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Compte supprimé avec succès');
      logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Callback pour la mise à jour de l'utilisateur
  const handleUserUpdate = () => {
    // Forcer un rechargement ou mettre à jour l'état si nécessaire
    // Le contexte d'authentification sera mis à jour automatiquement
    // grâce à la mise à jour du localStorage dans le composant SettingUserForm
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const userInitials =
    `${user.username?.charAt(0) || ''}${
      (user as unknown as { firstname: string }).firstname?.charAt(0) || ''
    }`.toUpperCase() || user.email.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres du compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et préférences de compte
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.username}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Solde:</span>
                <Badge variant="secondary">{user.balance.toFixed(2)} €</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Membre depuis:
                </span>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Statut:</span>
                <Badge variant="default">Actif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de modification - Utilisation du composant séparé */}
        {token && (
          <SettingUserForm
            user={user}
            token={token}
            onUserUpdate={handleUserUpdate}
          />
        )}

        {/* Zone de danger */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Zone de danger
            </CardTitle>
            <CardDescription>
              Actions irréversibles concernant votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer mon compte
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. Toutes vos données, trades et
                    statistiques seront définitivement supprimés.
                  </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                  <label className="text-sm font-medium">
                    Tapez <span className="font-bold">SUPPRIMER</span> pour
                    confirmer :
                  </label>
                  <Input
                    value={deleteConfirmation}
                    onChange={e => setDeleteConfirmation(e.target.value)}
                    placeholder="SUPPRIMER"
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setDeleteConfirmation('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'SUPPRIMER' || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      'Supprimer définitivement'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
