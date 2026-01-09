import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { User, Property, PropertyType, PropertyStatus } from '@/types/admin';
import PropertyForm from './PropertyForm';

const API_URL = 'https://functions.poehali.dev/8eb079f0-28eb-4577-ad8b-d039599cff88';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  hotel: 'Отель',
  apartment: 'Апартаменты',
  sauna: 'Сауна',
  conference: 'Конференц-зал',
};

const PROPERTY_TYPE_ICONS: Record<PropertyType, string> = {
  hotel: 'Building2',
  apartment: 'Home',
  sauna: 'Waves',
  conference: 'Presentation',
};

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'all'>('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setProperties(data.map((p: any) => ({
        id: String(p.id),
        type: p.type,
        status: p.status,
        name: p.name,
        description: p.description || '',
        address: p.address,
        metro: p.metro || '',
        price: p.price ? Number(p.price) : 0,
        rating: p.rating ? Number(p.rating) : 0,
        owner: {
          name: p.owner_name,
          phone: p.owner_phone,
          telegram: p.owner_telegram || '',
        },
        mainPhoto: p.main_photo || '',
        photos: p.photos || [],
        amenities: p.amenities || [],
        rooms: [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        createdBy: p.created_by || '',
      })));
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (user.role !== 'admin') {
      alert('Только администратор может удалять объекты');
      return;
    }
    if (confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        await loadProperties();
      } catch (error) {
        console.error('Failed to delete property:', error);
        alert('Ошибка при удалении объекта');
      }
    }
  };

  const handleArchive = async (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (!property) return;

    try {
      const newStatus = property.status === 'archived' ? 'active' : 'archived';
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, id: Number(id), status: newStatus }),
      });
      await loadProperties();
    } catch (error) {
      console.error('Failed to archive property:', error);
      alert('Ошибка при архивировании объекта');
    }
  };

  const handlePublish = async (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (!property) return;

    try {
      const newStatus = property.status === 'active' ? 'draft' : 'active';
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, id: Number(id), status: newStatus }),
      });
      await loadProperties();
    } catch (error) {
      console.error('Failed to publish property:', error);
      alert('Ошибка при публикации объекта');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
            <p className="text-sm text-muted-foreground">
              {user.name} • {user.role === 'admin' ? '👑 Администратор' : '👤 Сотрудник'}
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Поиск по названию или адресу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать объект
              </Button>
            </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
          >
            Все типы
          </Button>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
            <Button
              key={key}
              size="sm"
              variant={filterType === key ? 'default' : 'outline'}
              onClick={() => setFilterType(key as PropertyType)}
            >
              <Icon name={PROPERTY_TYPE_ICONS[key as PropertyType]} size={14} className="mr-1" />
              {label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            Все статусы
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
          >
            Опубликованные
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('draft')}
          >
            Черновики
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'archived' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('archived')}
          >
            Архив
          </Button>
        </div>

        {filteredProperties.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Inbox" size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Объекты не найдены</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Начните с создания первого объекта
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать объект
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {property.mainPhoto ? (
                  <img
                    src={property.mainPhoto}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name={PROPERTY_TYPE_ICONS[property.type]} size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status === 'active' ? 'Опубликовано' : property.status === 'draft' ? 'Черновик' : 'Архив'}
                  </Badge>
                  <Badge variant="outline" className="bg-white/90">
                    {PROPERTY_TYPE_LABELS[property.type]}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {property.address}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {property.owner.name}
                  </span>
                  {property.rooms.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Icon name="DoorOpen" size={14} />
                      {property.rooms.length} номеров
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingProperty(property)}
                  >
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublish(property.id)}
                  >
                    <Icon name={property.status === 'active' ? 'EyeOff' : 'Eye'} size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(property.id)}
                  >
                    <Icon name={property.status === 'archived' ? 'Archive' : 'ArchiveRestore'} size={14} />
                  </Button>
                  {user.role === 'admin' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
          </>
        )}
      </main>

      {(isCreating || editingProperty) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 max-h-[85vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-6">
                {isCreating ? 'Создание объекта' : 'Редактирование объекта'}
              </h2>
              <PropertyForm
                property={editingProperty}
                onSave={async (property) => {
                  try {
                    if (isCreating) {
                      await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...property,
                          createdBy: user.email,
                        }),
                      });
                    } else if (editingProperty) {
                      await fetch(API_URL, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.dumps({
                          ...property,
                          id: Number(editingProperty.id),
                        }),
                      });
                    }
                    await loadProperties();
                    setIsCreating(false);
                    setEditingProperty(null);
                  } catch (error) {
                    console.error('Failed to save property:', error);
                    alert('Ошибка при сохранении объекта');
                  }
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingProperty(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}