import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Room, ImageUpload } from '@/types/admin';
import { AMENITIES } from '@/types/admin';

interface RoomsManagerProps {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
  propertyType: string;
}

export default function RoomsManager({ rooms, onChange, propertyType }: RoomsManagerProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: '',
      type: propertyType === 'hotel' ? 'Стандарт' : 'Квартира',
      price: 0,
      capacity: 1,
      area: 0,
      amenities: [],
      photos: [],
      description: '',
      isPublished: false,
      isArchived: false,
    };
    setEditingRoom(newRoom);
    setIsCreating(true);
  };

  const handleSaveRoom = (room: Room) => {
    if (isCreating) {
      onChange([...rooms, room]);
    } else {
      onChange(rooms.map((r) => (r.id === room.id ? room : r)));
    }
    setEditingRoom(null);
    setIsCreating(false);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Удалить номер/апартамент?')) {
      onChange(rooms.filter((r) => r.id !== id));
    }
  };

  const handleTogglePublish = (id: string) => {
    onChange(
      rooms.map((r) => (r.id === id ? { ...r, isPublished: !r.isPublished } : r))
    );
  };

  const handleToggleArchive = (id: string) => {
    onChange(
      rooms.map((r) => (r.id === id ? { ...r, isArchived: !r.isArchived } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {propertyType === 'hotel' ? 'Номера' : 'Апартаменты'}
        </h3>
        <Button onClick={handleAddRoom}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить
        </Button>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="Inbox" size={32} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {propertyType === 'hotel' ? 'Номера не добавлены' : 'Апартаменты не добавлены'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{room.name || 'Без названия'}</h4>
                    <p className="text-sm text-muted-foreground">{room.type}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={room.isPublished ? 'default' : 'secondary'}>
                        {room.isPublished ? 'Опубликовано' : 'Черновик'}
                      </Badge>
                      {room.isArchived && <Badge variant="outline">Архив</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingRoom(room)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePublish(room.id)}
                    >
                      <Icon name={room.isPublished ? 'EyeOff' : 'Eye'} size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleArchive(room.id)}
                    >
                      <Icon name="Archive" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Цена:</span>
                    <p className="font-medium">{room.price} ₽</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Вместимость:</span>
                    <p className="font-medium">{room.capacity} чел.</p>
                  </div>
                  {room.area && (
                    <div>
                      <span className="text-muted-foreground">Площадь:</span>
                      <p className="font-medium">{room.area} м²</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Фото:</span>
                    <p className="font-medium">{room.photos.length} шт</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingRoom && (
        <RoomFormDialog
          room={editingRoom}
          propertyType={propertyType}
          onSave={handleSaveRoom}
          onCancel={() => {
            setEditingRoom(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

interface RoomFormDialogProps {
  room: Room;
  propertyType: string;
  onSave: (room: Room) => void;
  onCancel: () => void;
}

function RoomFormDialog({ room, propertyType, onSave, onCancel }: RoomFormDialogProps) {
  const [formData, setFormData] = useState(room);
  const [photos, setPhotos] = useState<ImageUpload[]>([]);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: ImageUpload[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push({ file, preview: reader.result as string });
        if (newPhotos.length === files.length) {
          setPhotos([...photos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter((id) => id !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля');
      return;
    }
    onSave({
      ...formData,
      photos: [...formData.photos, ...photos.map((p) => p.preview)],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <h3 className="text-xl font-bold">
            {room.id && room.name
              ? `Редактирование: ${room.name}`
              : `Добавление ${propertyType === 'hotel' ? 'номера' : 'апартамента'}`}
          </h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="roomName">Название *</Label>
              <Input
                id="roomName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Стандарт 2-местный"
                required
              />
            </div>

            <div>
              <Label htmlFor="roomType">Тип</Label>
              <Input
                id="roomType"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Стандарт, Люкс, Апартамент..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Цена (₽/час) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Вместимость *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="area">Площадь (м²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) =>
                  setFormData({ ...formData, area: Number(e.target.value) || undefined })
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Удобства</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {AMENITIES.map((amenity) => (
                  <Button
                    key={amenity.id}
                    type="button"
                    variant={formData.amenities.includes(amenity.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAmenity(amenity.id)}
                    className="justify-start"
                  >
                    {amenity.icon && <Icon name={amenity.icon} size={14} className="mr-2" />}
                    {amenity.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Фотографии</Label>
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => photosInputRef.current?.click()}
                className="w-full mt-2"
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Добавить фото
              </Button>
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() => removePhoto(index)}
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
