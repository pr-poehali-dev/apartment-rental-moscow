import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://functions.poehali.dev/49330ab6-db2f-4738-aaac-313eb821f419';

interface Owner {
  id: number;
  username: string;
  full_name: string;
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

interface ObjectsTabProps {
  objects: ObjectItem[];
  owners: Owner[];
  onReload: () => void;
}

export default function ObjectsTab({ objects, owners, onReload }: ObjectsTabProps) {
  const { toast } = useToast();
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
        onReload();
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
        onReload();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Объекты недвижимости</h2>
        <Button onClick={() => setObjectModalOpen(true)}>
          <Icon name="Plus" className="mr-2" size={16} />
          Добавить объект
        </Button>
      </div>

      <div className="grid gap-4">
        {objects.map(obj => (
          <Card key={obj.id} className="p-4">
            <div className="flex gap-4">
              {obj.image_url && (
                <img
                  src={obj.image_url}
                  alt={obj.name}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{obj.name}</h3>
                      <Badge variant={obj.is_published ? 'default' : 'secondary'}>
                        {obj.is_published ? 'Опубликован' : 'Черновик'}
                      </Badge>
                      <Badge variant="outline">{obj.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Собственник: {obj.owner_name}
                    </p>
                  </div>
                  <Button
                    variant={obj.is_published ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleObjectPublished(obj.id, obj.is_published)}
                  >
                    {obj.is_published ? 'Снять с публикации' : 'Опубликовать'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} />
                    <span>{obj.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Train" size={14} />
                    <span>{obj.metro}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Maximize" size={14} />
                    <span>{obj.area} м²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Door" size={14} />
                    <span>{obj.rooms} комн.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="DollarSign" size={14} />
                    <span>{obj.price_per_hour} ₽/час (мин. {obj.min_hours}ч)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={14} />
                    <span>{obj.telegram_contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Eye" size={14} />
                    <span>Просмотры: {obj.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MousePointer" size={14} />
                    <span>Клики: {obj.clicks}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={objectModalOpen} onOpenChange={setObjectModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Новый объект</DialogTitle>
          </DialogHeader>
          <form onSubmit={createObject} className="space-y-4">
            <div>
              <Label>Собственник</Label>
              <Select value={objectForm.owner_id} onValueChange={v => setObjectForm({ ...objectForm, owner_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите собственника" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map(owner => (
                    <SelectItem key={owner.id} value={owner.id.toString()}>
                      {owner.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Категория</Label>
              <Select value={objectForm.category} onValueChange={v => setObjectForm({ ...objectForm, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="квартира">Квартира</SelectItem>
                  <SelectItem value="апартаменты">Апартаменты</SelectItem>
                  <SelectItem value="лофт">Лофт</SelectItem>
                  <SelectItem value="студия">Студия</SelectItem>
                  <SelectItem value="отель">Отель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Название</Label>
              <Input
                required
                value={objectForm.name}
                onChange={e => setObjectForm({ ...objectForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Адрес</Label>
              <Input
                required
                value={objectForm.address}
                onChange={e => setObjectForm({ ...objectForm, address: e.target.value })}
              />
            </div>

            <div>
              <Label>Метро</Label>
              <Input
                required
                value={objectForm.metro}
                onChange={e => setObjectForm({ ...objectForm, metro: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Площадь (м²)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={objectForm.area}
                  onChange={e => setObjectForm({ ...objectForm, area: e.target.value })}
                />
              </div>
              <div>
                <Label>Комнаты</Label>
                <Input
                  type="number"
                  required
                  value={objectForm.rooms}
                  onChange={e => setObjectForm({ ...objectForm, rooms: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Цена (₽/час)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={objectForm.price_per_hour}
                  onChange={e => setObjectForm({ ...objectForm, price_per_hour: e.target.value })}
                />
              </div>
              <div>
                <Label>Минимум часов</Label>
                <Input
                  type="number"
                  required
                  value={objectForm.min_hours}
                  onChange={e => setObjectForm({ ...objectForm, min_hours: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Широта (lat)</Label>
                <Input
                  type="number"
                  step="0.0000001"
                  value={objectForm.lat}
                  onChange={e => setObjectForm({ ...objectForm, lat: e.target.value })}
                />
              </div>
              <div>
                <Label>Долгота (lon)</Label>
                <Input
                  type="number"
                  step="0.0000001"
                  value={objectForm.lon}
                  onChange={e => setObjectForm({ ...objectForm, lon: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>URL изображения</Label>
              <Input
                type="url"
                value={objectForm.image_url}
                onChange={e => setObjectForm({ ...objectForm, image_url: e.target.value })}
              />
            </div>

            <div>
              <Label>Telegram контакт</Label>
              <Input
                required
                placeholder="@username"
                value={objectForm.telegram_contact}
                onChange={e => setObjectForm({ ...objectForm, telegram_contact: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={objectForm.is_published}
                onChange={e => setObjectForm({ ...objectForm, is_published: e.target.checked })}
              />
              <Label htmlFor="is_published">Опубликовать сразу</Label>
            </div>

            <Button type="submit" className="w-full">Создать объект</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
