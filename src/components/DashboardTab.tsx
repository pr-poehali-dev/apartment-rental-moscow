import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface OwnerData {
  id: number;
  username: string;
  full_name: string;
  phone: string;
  telegram: string;
  created_at: string;
}

interface ObjectData {
  id: number;
  category: string;
  name: string;
  address: string;
  metro: string;
  area: number;
  rooms: number;
  price_per_hour: number;
  min_hours: number;
  image_url: string;
  telegram_contact: string;
  is_published: boolean;
  created_at: string;
  stats: {
    views: number;
    telegram_clicks: number;
    last_view_at: string | null;
    last_click_at: string | null;
  };
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  valid_from: string;
  valid_until: string | null;
}

export default function DashboardTab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/6cd51ceb-01dd-401b-a12d-f6a9c9b950bc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка авторизации');
        setLoading(false);
        return;
      }

      // Сохраняем токен и ID собственника
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('owner_id', data.owner_id);
      
      setIsLoggedIn(true);
      loadDashboardData(data.owner_id);
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (ownerId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/5071f10a-6b1d-4616-9940-450a32adcf7c?owner_id=${ownerId}`);
      const data = await response.json();

      if (response.ok) {
        setOwnerData(data.owner);
        setObjects(data.objects);
        setPromotions(data.promotions);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('owner_id');
    setIsLoggedIn(false);
    setOwnerData(null);
    setObjects([]);
    setPromotions([]);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const ownerId = localStorage.getItem('owner_id');
    
    if (token && ownerId) {
      setIsLoggedIn(true);
      loadDashboardData(parseInt(ownerId));
    }
  }, []);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      hotel: 'Отель',
      apartment: 'Апартамент',
      sauna: 'Сауна',
      conference: 'Конференц-зал'
    };
    return labels[category] || category;
  };

  if (!isLoggedIn) {
    return (
      <div className="animate-fade-in">
        <section className="max-w-[500px] mx-auto px-6 py-32">
          <Card className="p-8 border-0 shadow-lg rounded-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Личный кабинет</h2>
              <p className="text-muted-foreground">Войдите для доступа к статистике</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите логин"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    );
  }

  const totalViews = objects.reduce((sum, obj) => sum + obj.stats.views, 0);
  const totalClicks = objects.reduce((sum, obj) => sum + obj.stats.telegram_clicks, 0);
  const conversionRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              Личный кабинет
            </h2>
            {ownerData && (
              <p className="text-lg text-muted-foreground">
                {ownerData.full_name}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Eye" size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalViews}</div>
                <div className="text-sm text-muted-foreground">Всего просмотров</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="MessageCircle" size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalClicks}</div>
                <div className="text-sm text-muted-foreground">Переходов в Telegram</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold">{conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Конверсия</div>
              </div>
            </div>
          </Card>
        </div>

        {promotions.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Icon name="Gift" size={28} className="text-primary" />
              Акции и предложения
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6 border-2 border-primary/20 shadow-sm rounded-2xl bg-gradient-to-br from-primary/5 to-transparent">
                  <h4 className="text-lg font-bold mb-2">{promo.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
                  {promo.valid_until && (
                    <Badge variant="secondary" className="text-xs">
                      До {new Date(promo.valid_until).toLocaleDateString('ru-RU')}
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-6">Мои объекты</h3>
        {objects.length === 0 ? (
          <Card className="p-12 border-0 shadow-sm rounded-2xl text-center">
            <Icon name="Building" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              У вас пока нет добавленных объектов
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {objects.map((obj) => (
              <Card key={obj.id} className="p-6 border-0 shadow-sm rounded-2xl hover-lift">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {obj.image_url ? (
                      <img 
                        src={obj.image_url} 
                        alt={obj.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Building" size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">{obj.name}</h4>
                        <Badge variant="secondary" className="mb-2">{getCategoryLabel(obj.category)}</Badge>
                      </div>
                      <Badge 
                        variant={obj.is_published ? 'default' : 'secondary'} 
                        className="rounded-full"
                      >
                        {obj.is_published ? 'Опубликовано' : 'Не опубликовано'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {obj.address} {obj.metro && `• ${obj.metro}`}
                    </p>
                    <div className="flex gap-6 mb-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Eye" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">{obj.stats.views} просмотров</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">{obj.stats.telegram_clicks} переходов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {obj.stats.views > 0 
                            ? Math.round((obj.stats.telegram_clicks / obj.stats.views) * 100) 
                            : 0}% конверсия
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {obj.price_per_hour}₽/ч {obj.min_hours > 1 && `(от ${obj.min_hours}ч)`}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
