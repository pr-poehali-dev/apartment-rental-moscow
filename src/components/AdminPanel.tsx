import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://functions.poehali.dev/49330ab6-db2f-4738-aaac-313eb821f419';

interface Owner {
  id: number;
  username: string;
  full_name: string;
  phone: string;
  telegram: string;
  is_active: boolean;
  created_at: string;
  objects_count: number;
}

interface ObjectItem {
  id: number;
  owner_id: number;
  category: string;
  name: string;
  address: string;
  metro: string;
  area: number;
  rooms: number;
  price_per_hour: number;
  min_hours: number;
  lat: number;
  lon: number;
  image_url: string;
  telegram_contact: string;
  is_published: boolean;
  created_at: string;
  owner_name: string;
  views: number;
  clicks: number;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('owners');
  
  // Owners
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    username: '',
    password: '',
    full_name: '',
    phone: '',
    telegram: ''
  });
  
  // Objects
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [objectModalOpen, setObjectModalOpen] = useState(false);
  const [objectForm, setObjectForm] = useState({
    owner_id: '',
    category: '',
    name: '',
    address: '',
    metro: '',
    area: '',
    rooms: '',
    price_per_hour: '',
    min_hours: '1',
    lat: '',
    lon: '',
    image_url: '',
    telegram_contact: '',
    is_published: false
  });
  
  // Promotions
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    title: '',
    description: '',
    valid_until: '',
    is_active: true
  });

  useEffect(() => {
    loadOwners();
    loadObjects();
    loadPromotions();
  }, []);

  const loadOwners = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_owners`);
      const data = await res.json();
      setOwners(data.owners || []);
    } catch (err) {
      console.error('Error loading owners:', err);
    }
  };

  const loadObjects = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_objects`);
      const data = await res.json();
      setObjects(data.objects || []);
    } catch (err) {
      console.error('Error loading objects:', err);
    }
  };

  const loadPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_promotions`);
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error('Error loading promotions:', err);
    }
  };

  const createOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}?action=create_owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerForm)
      });
      
      if (res.ok) {
        toast({ title: 'Собственник создан' });
        setOwnerModalOpen(false);
        setOwnerForm({ username: '', password: '', full_name: '', phone: '', telegram: '' });
        loadOwners();
      } else {
        const data = await res.json();
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  const toggleOwnerActive = async (ownerId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}?action=update_owner&id=${ownerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (res.ok) {
        toast({ title: 'Статус обновлён' });
        loadOwners();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const createObject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...objectForm,
        owner_id: parseInt(objectForm.owner_id),
        area: parseFloat(objectForm.area),
        rooms: parseInt(objectForm.rooms),
        price_per_hour: parseFloat(objectForm.price_per_hour),
        min_hours: parseInt(objectForm.min_hours),
        lat: parseFloat(objectForm.lat) || null,
        lon: parseFloat(objectForm.lon) || null
      };
      
      const res = await fetch(`${API_BASE}?action=create_object`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast({ title: 'Объект создан' });
        setObjectModalOpen(false);
        setObjectForm({
          owner_id: '',
          category: '',
          name: '',
          address: '',
          metro: '',
          area: '',
          rooms: '',
          price_per_hour: '',
          min_hours: '1',
          lat: '',
          lon: '',
          image_url: '',
          telegram_contact: '',
          is_published: false
        });
        loadObjects();
      } else {
        const data = await res.json();
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  const toggleObjectPublished = async (objectId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}?action=update_object&id=${objectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus })
      });
      
      if (res.ok) {
        toast({ title: 'Статус публикации обновлён' });
        loadObjects();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const createPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}?action=create_promotion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoForm)
      });
      
      if (res.ok) {
        toast({ title: 'Акция создана' });
        setPromoModalOpen(false);
        setPromoForm({ title: '', description: '', valid_until: '', is_active: true });
        loadPromotions();
      } else {
        const data = await res.json();
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  const togglePromoActive = async (promoId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}?action=update_promotion&id=${promoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (res.ok) {
        toast({ title: 'Статус акции обновлён' });
        loadPromotions();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      hotel: 'Отель',
      apartment: 'Апартамент',
      sauna: 'Сауна',
      conference: 'Конференц-зал'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="animate-fade-in">
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Админ-панель</h2>
          <p className="text-muted-foreground">Управление платформой 120 минут</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="owners">
              <Icon name="Users" size={18} className="mr-2" />
              Собственники
            </TabsTrigger>
            <TabsTrigger value="objects">
              <Icon name="Building" size={18} className="mr-2" />
              Объекты
            </TabsTrigger>
            <TabsTrigger value="promotions">
              <Icon name="Gift" size={18} className="mr-2" />
              Акции
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owners">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Собственники ({owners.length})</h3>
              <Button onClick={() => setOwnerModalOpen(true)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить собственника
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {owners.map((owner) => (
                <Card key={owner.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold">{owner.full_name}</h4>
                      <p className="text-sm text-muted-foreground">@{owner.username}</p>
                    </div>
                    <Badge variant={owner.is_active ? 'default' : 'secondary'}>
                      {owner.is_active ? 'Активен' : 'Заблокирован'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    {owner.phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={14} />
                        {owner.phone}
                      </div>
                    )}
                    {owner.telegram && (
                      <div className="flex items-center gap-2">
                        <Icon name="MessageCircle" size={14} />
                        {owner.telegram}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon name="Building" size={14} />
                      {owner.objects_count} объектов
                    </div>
                  </div>
                  <Button
                    variant={owner.is_active ? 'destructive' : 'default'}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleOwnerActive(owner.id, owner.is_active)}
                  >
                    {owner.is_active ? 'Заблокировать' : 'Разблокировать'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="objects">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Объекты ({objects.length})</h3>
              <Button onClick={() => setObjectModalOpen(true)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить объект
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {objects.map((obj) => (
                <Card key={obj.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {obj.image_url ? (
                        <img src={obj.image_url} alt={obj.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Building" size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-bold">{obj.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {obj.address} {obj.metro && `• ${obj.metro}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{getCategoryLabel(obj.category)}</Badge>
                          <Badge variant={obj.is_published ? 'default' : 'secondary'}>
                            {obj.is_published ? 'Опубликовано' : 'Черновик'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Собственник: {obj.owner_name}
                      </p>
                      <div className="flex gap-6 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Eye" size={14} />
                          {obj.views} просмотров
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MessageCircle" size={14} />
                          {obj.clicks} кликов
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="DollarSign" size={14} />
                          {obj.price_per_hour}₽/ч
                        </div>
                      </div>
                      <Button
                        variant={obj.is_published ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => toggleObjectPublished(obj.id, obj.is_published)}
                      >
                        {obj.is_published ? 'Снять с публикации' : 'Опубликовать'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotions">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Акции ({promotions.length})</h3>
              <Button onClick={() => setPromoModalOpen(true)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить акцию
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold">{promo.title}</h4>
                    <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                      {promo.is_active ? 'Активна' : 'Неактивна'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                  {promo.valid_until && (
                    <p className="text-xs text-muted-foreground mb-4">
                      До: {new Date(promo.valid_until).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  <Button
                    variant={promo.is_active ? 'destructive' : 'default'}
                    size="sm"
                    className="w-full"
                    onClick={() => togglePromoActive(promo.id, promo.is_active)}
                  >
                    {promo.is_active ? 'Деактивировать' : 'Активировать'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Owner Modal */}
        <Dialog open={ownerModalOpen} onOpenChange={setOwnerModalOpen}>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить собственника</DialogTitle>
            </DialogHeader>
            <form onSubmit={createOwner} className="space-y-4">
              <div>
                <Label>Логин *</Label>
                <Input
                  value={ownerForm.username}
                  onChange={(e) => setOwnerForm({ ...ownerForm, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Пароль *</Label>
                <Input
                  type="password"
                  value={ownerForm.password}
                  onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>ФИО *</Label>
                <Input
                  value={ownerForm.full_name}
                  onChange={(e) => setOwnerForm({ ...ownerForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input
                  value={ownerForm.phone}
                  onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Telegram</Label>
                <Input
                  value={ownerForm.telegram}
                  onChange={(e) => setOwnerForm({ ...ownerForm, telegram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOwnerModalOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">Создать</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Object Modal */}
        <Dialog open={objectModalOpen} onOpenChange={setObjectModalOpen}>
          <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить объект</DialogTitle>
            </DialogHeader>
            <form onSubmit={createObject} className="space-y-4">
              <div>
                <Label>Собственник *</Label>
                <Select value={objectForm.owner_id} onValueChange={(v) => setObjectForm({ ...objectForm, owner_id: v })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите собственника" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map(o => (
                      <SelectItem key={o.id} value={String(o.id)}>{o.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Категория *</Label>
                <Select value={objectForm.category} onValueChange={(v) => setObjectForm({ ...objectForm, category: v })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Отель</SelectItem>
                    <SelectItem value="apartment">Апартамент</SelectItem>
                    <SelectItem value="sauna">Сауна</SelectItem>
                    <SelectItem value="conference">Конференц-зал</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Название *</Label>
                <Input value={objectForm.name} onChange={(e) => setObjectForm({ ...objectForm, name: e.target.value })} required />
              </div>
              <div>
                <Label>Адрес *</Label>
                <Input value={objectForm.address} onChange={(e) => setObjectForm({ ...objectForm, address: e.target.value })} required />
              </div>
              <div>
                <Label>Метро</Label>
                <Input value={objectForm.metro} onChange={(e) => setObjectForm({ ...objectForm, metro: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Площадь (м²)</Label>
                  <Input type="number" value={objectForm.area} onChange={(e) => setObjectForm({ ...objectForm, area: e.target.value })} />
                </div>
                <div>
                  <Label>Комнат</Label>
                  <Input type="number" value={objectForm.rooms} onChange={(e) => setObjectForm({ ...objectForm, rooms: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Цена (₽/ч) *</Label>
                  <Input type="number" value={objectForm.price_per_hour} onChange={(e) => setObjectForm({ ...objectForm, price_per_hour: e.target.value })} required />
                </div>
                <div>
                  <Label>Мин. часов</Label>
                  <Input type="number" value={objectForm.min_hours} onChange={(e) => setObjectForm({ ...objectForm, min_hours: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>URL изображения</Label>
                <Input value={objectForm.image_url} onChange={(e) => setObjectForm({ ...objectForm, image_url: e.target.value })} />
              </div>
              <div>
                <Label>Telegram для связи</Label>
                <Input value={objectForm.telegram_contact} onChange={(e) => setObjectForm({ ...objectForm, telegram_contact: e.target.value })} placeholder="@username" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setObjectModalOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">Создать</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Promotion Modal */}
        <Dialog open={promoModalOpen} onOpenChange={setPromoModalOpen}>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить акцию</DialogTitle>
            </DialogHeader>
            <form onSubmit={createPromotion} className="space-y-4">
              <div>
                <Label>Заголовок *</Label>
                <Input value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} required />
              </div>
              <div>
                <Label>Описание *</Label>
                <Textarea value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} required rows={4} />
              </div>
              <div>
                <Label>Действует до</Label>
                <Input type="date" value={promoForm.valid_until} onChange={(e) => setPromoForm({ ...promoForm, valid_until: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setPromoModalOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">Создать</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
