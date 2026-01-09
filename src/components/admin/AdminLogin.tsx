import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { User } from '@/types/admin';

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const DEMO_USERS: Record<string, { id: string; name: string; email: string; role: 'admin' | 'employee'; password: string }> = {
  'hab-agent@mail.ru': { id: '1', name: 'Главный администратор', email: 'hab-agent@mail.ru', role: 'admin', password: '3Dyzaape29938172' },
  'hab-employee@mail.ru': { id: '2', name: 'Сотрудник', email: 'hab-employee@mail.ru', role: 'employee', password: '29938172' },
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = DEMO_USERS[email];
    
    if (user && password === user.password) {
      onLogin(user);
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="ShieldCheck" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Личный кабинет</CardTitle>
          <CardDescription>Вход для администраторов и сотрудников</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="hab-agent@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Войти
            </Button>

            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg space-y-1">
              <p className="font-medium">Доступы:</p>
              <p>👑 Админ: hab-agent@mail.ru / 3Dyzaape29938172</p>
              <p>👤 Сотрудник: hab-employee@mail.ru / 29938172</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}