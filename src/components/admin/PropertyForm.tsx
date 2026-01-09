import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Property, PropertyType, ImageUpload, PropertyOwner, Room } from '@/types/admin';
import { AMENITIES } from '@/types/admin';
import RoomsManager from './RoomsManager';

interface PropertyFormProps {
  property?: Property | null;
  onSave: (property: Partial<Property>) => void;
  onCancel: () => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'hotel', label: 'Отель' },
  { value: 'apartment', label: 'Апартаменты' },
  { value: 'sauna', label: 'Сауна' },
  { value: 'conference', label: 'Конференц-зал' },
];

export default function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    type: property?.type || 'hotel' as PropertyType,
    name: property?.name || '',
    description: property?.description || '',
    address: property?.address || '',
    metro: property?.metro || '',
    price: property?.price || 0,
  });

  const [owner, setOwner] = useState<PropertyOwner>(
    property?.owner || { name: '', phone: '', telegram: '' }
  );

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || []
  );

  const [rooms, setRooms] = useState<Room[]>(property?.rooms || []);

  const [mainPhoto, setMainPhoto] = useState<ImageUpload | null>(null);
  const [photos, setPhotos] = useState<ImageUpload[]>([]);
  const mainPhotoInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handleMainPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainPhoto({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !owner.name || !owner.phone) {
      alert('Заполните все обязательные поля');
      return;
    }

    const propertyData: Partial<Property> = {
      ...formData,
      owner,
      amenities: selectedAmenities,
      mainPhoto: mainPhoto?.preview || property?.mainPhoto || '',
      photos: photos.map((p) => p.preview),
      rooms,
      status: property?.status || 'draft',
      createdAt: property?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: property?.createdBy || 'current-user',
    };

    onSave(propertyData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Тип объекта *</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
            className="w-full mt-1 px-3 py-2 border rounded-md"
            required
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="name">Название *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Например: Отель 'Золотой ключик'"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Подробное описание объекта..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="address">Адрес *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="ул. Примерная, д. 123"
            required
          />
        </div>

        <div>
          <Label htmlFor="metro">Метро</Label>
          <Input
            id="metro"
            value={formData.metro}
            onChange={(e) => setFormData({ ...formData, metro: e.target.value })}
            placeholder="Станция метро"
          />
        </div>

        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Контакты собственника *</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerName">Имя *</Label>
            <Input
              id="ownerName"
              value={owner.name}
              onChange={(e) => setOwner({ ...owner, name: e.target.value })}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <Label htmlFor="ownerPhone">Телефон *</Label>
            <Input
              id="ownerPhone"
              value={owner.phone}
              onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
              placeholder="+7 (900) 123-45-67"
              required
            />
          </div>

          <div>
            <Label htmlFor="ownerTelegram">Telegram</Label>
            <Input
              id="ownerTelegram"
              value={owner.telegram}
              onChange={(e) => setOwner({ ...owner, telegram: e.target.value })}
              placeholder="@username"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Главное фото</h3>
        <input
          ref={mainPhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleMainPhotoChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => mainPhotoInputRef.current?.click()}
          className="w-full"
        >
          <Icon name="Upload" size={16} className="mr-2" />
          Загрузить главное фото
        </Button>
        {(mainPhoto || property?.mainPhoto) && (
          <div className="mt-4 relative">
            <img
              src={mainPhoto?.preview || property?.mainPhoto}
              alt="Main"
              className="w-full h-48 object-cover rounded-lg"
            />
            {mainPhoto && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => setMainPhoto(null)}
              >
                <Icon name="X" size={14} />
              </Button>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Дополнительные фото</h3>
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
          className="w-full"
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
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Удобства и характеристики</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map((amenity) => (
            <Button
              key={amenity.id}
              type="button"
              variant={selectedAmenities.includes(amenity.id) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleAmenity(amenity.id)}
              className="justify-start"
            >
              {amenity.icon && <Icon name={amenity.icon} size={14} className="mr-2" />}
              {amenity.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <RoomsManager
          rooms={rooms}
          onChange={setRooms}
          propertyType={formData.type}
        />
      </Card>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}