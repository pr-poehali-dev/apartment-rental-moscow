import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const API_URL = 'https://functions.poehali.dev/1961571b-26cd-4f80-9709-45455d336430';

interface Owner {
  id: number;
  name: string;
  phone?: string;
  telegram?: string;
}

interface Room {
  id: number;
  name: string;
  price: number;
  area: number;
  description?: string;
  min_hours?: number;
  is_published: boolean;
  is_archived: boolean;
  images?: string[];
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  metro: string;
  description?: string;
  phone?: string;
  telegram?: string;
  owner_id?: number;
  owner_name?: string;
  is_published: boolean;
  is_archived: boolean;
  rooms: Room[];
}

interface ImageUpload {
  file: File;
  preview: string;
}

export default function Admin() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showNewHotelDialog, setShowNewHotelDialog] = useState(false);
  const [showNewRoomDialog, setShowNewRoomDialog] = useState(false);
  const [showNewOwnerDialog, setShowNewOwnerDialog] = useState(false);
  
  const [hotelForm, setHotelForm] = useState({
    name: '',
    address: '',
    metro: '',
    description: '',
    phone: '',
    telegram: '',
    owner_id: '',
    category: 'hotels'
  });

  const [ownerForm, setOwnerForm] = useState({
    name: '',
    phone: '',
    telegram: ''
  });

  const [roomForm, setRoomForm] = useState({
    name: '',
    price: '',
    area: '',
    description: '',
    min_hours: '2'
  });

  const [roomImages, setRoomImages] = useState<ImageUpload[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHotels();
    loadOwners();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await fetch(`${API_URL}?entity=hotels`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список отелей',
        variant: 'destructive'
      });
    }
  };

  const loadOwners = async () => {
    try {
      const response = await fetch(`${API_URL}?entity=owners`);
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error('Failed to load owners:', error);
    }
  };

  const createOwner = async () => {
    if (!ownerForm.name) {
      toast({ title: 'Ошибка', description: 'Введите имя владельца', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?entity=owners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerForm)
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Владелец добавлен' });
        setShowNewOwnerDialog(false);
        setOwnerForm({ name: '', phone: '', telegram: '' });
        loadOwners();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать владельца', variant: 'destructive' });
    }
  };

  const createHotel = async () => {
    if (!hotelForm.name || !hotelForm.address || !hotelForm.metro) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?entity=hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...hotelForm,
          owner_id: hotelForm.owner_id ? parseInt(hotelForm.owner_id) : null
        })
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Отель создан' });
        setShowNewHotelDialog(false);
        setHotelForm({ name: '', address: '', metro: '', description: '', phone: '', telegram: '', owner_id: '', category: 'hotels' });
        loadHotels();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать отель', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateHotel = async (hotel: Hotel) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?entity=hotels&id=${hotel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hotel.name,
          address: hotel.address,
          metro: hotel.metro,
          description: hotel.description,
          phone: hotel.phone,
          telegram: hotel.telegram,
          owner_id: hotel.owner_id,
          category: hotel.category || 'hotels'
        })
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Изменения сохранены' });
        loadHotels();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить отель', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (hotel: Hotel) => {
    try {
      await fetch(`${API_URL}?entity=hotels&id=${hotel.id}&action=publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !hotel.is_published })
      });
      toast({ title: hotel.is_published ? 'Снято с публикации' : 'Опубликовано' });
      loadHotels();
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const toggleArchive = async (hotel: Hotel) => {
    try {
      await fetch(`${API_URL}?entity=hotels&id=${hotel.id}&action=archive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !hotel.is_archived })
      });
      toast({ title: hotel.is_archived ? 'Восстановлено' : 'Перенесено в архив' });
      loadHotels();
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const uploadImage = async (image: ImageUpload): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const response = await fetch('https://functions.poehali.dev/1f01a2cb-8661-4f11-b90a-dae6dcb16df0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64, fileName: image.file.name })
          });
          const data = await response.json();
          if (data.url) {
            resolve(data.url);
          } else {
            reject(new Error('No URL in response'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(image.file);
    });
  };

  const createRoom = async () => {
    if (!selectedHotel || !roomForm.name || !roomForm.price || !roomForm.area) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const img of roomImages) {
        const url = await uploadImage(img);
        uploadedUrls.push(url);
      }

      const response = await fetch(`${API_URL}?entity=rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: selectedHotel.id,
          name: roomForm.name,
          price: parseInt(roomForm.price),
          area: parseInt(roomForm.area),
          description: roomForm.description,
          min_hours: parseInt(roomForm.min_hours),
          images: uploadedUrls
        })
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Номер создан' });
        setShowNewRoomDialog(false);
        setRoomForm({ name: '', price: '', area: '', description: '', min_hours: '2' });
        setRoomImages([]);
        loadHotels();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать номер', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (room: Room) => {
    setLoading(true);
    try {
      const uploadedUrls: string[] = room.images || [];
      
      for (const img of roomImages) {
        const url = await uploadImage(img);
        uploadedUrls.push(url);
      }

      const response = await fetch(`${API_URL}?entity=rooms&id=${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: room.name,
          price: room.price,
          area: room.area,
          description: room.description,
          min_hours: room.min_hours,
          images: uploadedUrls
        })
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Номер обновлён' });
        setEditingRoom(null);
        setRoomImages([]);
        loadHotels();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить номер', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleRoomArchive = async (room: Room) => {
    try {
      await fetch(`${API_URL}?entity=rooms&id=${room.id}&action=archive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !room.is_archived })
      });
      toast({ title: room.is_archived ? 'Номер восстановлен' : 'Номер в архиве' });
      loadHotels();
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const deleteRoom = async (roomId: number) => {
    if (!confirm('Удалить номер навсегда?')) return;

    try {
      await fetch(`${API_URL}?entity=rooms&id=${roomId}`, { method: 'DELETE' });
      toast({ title: 'Номер удалён' });
      loadHotels();
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push({ file, preview: URL.createObjectURL(file) });
      }
    }
    setRoomImages([...roomImages, ...newImages]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Управление объектами</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewOwnerDialog(true)} variant="outline">
              <Icon name="UserPlus" size={18} className="mr-2" />
              Владелец
            </Button>
            <Button onClick={() => setShowNewHotelDialog(true)}>
              <Icon name="Plus" size={18} className="mr-2" />
              Новый объект
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {hotels.map(hotel => (
            <Card key={hotel.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{hotel.name}</h2>
                  <p className="text-gray-600">{hotel.address}</p>
                  <p className="text-sm text-gray-500">Метро: {hotel.metro}</p>
                  {hotel.owner_name && <p className="text-sm text-blue-600">Владелец: {hotel.owner_name}</p>}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={hotel.is_published ? 'default' : 'outline'}
                    onClick={() => togglePublish(hotel)}
                  >
                    {hotel.is_published ? '✓ Опубликован' : 'Не опубликован'}
                  </Button>
                  <Button
                    size="sm"
                    variant={hotel.is_archived ? 'secondary' : 'outline'}
                    onClick={() => toggleArchive(hotel)}
                  >
                    <Icon name={hotel.is_archived ? 'ArchiveRestore' : 'Archive'} size={16} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedHotel(hotel)}>
                    <Icon name="Edit" size={16} />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <Button size="sm" onClick={() => { setSelectedHotel(hotel); setShowNewRoomDialog(true); }}>
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить номер
                </Button>
              </div>

              {hotel.rooms && hotel.rooms.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Номера:</h3>
                  {hotel.rooms.map(room => (
                    <div key={room.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-gray-600">{room.price} ₽/час • {room.area} м²</p>
                        {room.is_archived && <span className="text-xs text-red-600">Архив</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingRoom(room)}>
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleRoomArchive(room)}>
                          <Icon name={room.is_archived ? 'ArchiveRestore' : 'Archive'} size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteRoom(room.id)}>
                          <Icon name="Trash" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        <Dialog open={showNewOwnerDialog} onOpenChange={setShowNewOwnerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый владелец</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Имя *</Label>
                <Input value={ownerForm.name} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input value={ownerForm.phone} onChange={e => setOwnerForm({...ownerForm, phone: e.target.value})} />
              </div>
              <div>
                <Label>Telegram</Label>
                <Input value={ownerForm.telegram} onChange={e => setOwnerForm({...ownerForm, telegram: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createOwner} disabled={loading}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showNewHotelDialog} onOpenChange={setShowNewHotelDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новый объект</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Название *</Label>
                <Input value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} />
              </div>
              <div>
                <Label>Адрес *</Label>
                <Input value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} />
              </div>
              <div>
                <Label>Метро *</Label>
                <Input value={hotelForm.metro} onChange={e => setHotelForm({...hotelForm, metro: e.target.value})} />
              </div>
              <div>
                <Label>Владелец</Label>
                <Select value={hotelForm.owner_id} onValueChange={value => setHotelForm({...hotelForm, owner_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите владельца" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Телефон</Label>
                  <Input value={hotelForm.phone} onChange={e => setHotelForm({...hotelForm, phone: e.target.value})} />
                </div>
                <div>
                  <Label>Telegram</Label>
                  <Input value={hotelForm.telegram} onChange={e => setHotelForm({...hotelForm, telegram: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createHotel} disabled={loading}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showNewRoomDialog} onOpenChange={setShowNewRoomDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новый номер</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Название *</Label>
                <Input value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Цена (₽/час) *</Label>
                  <Input type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} />
                </div>
                <div>
                  <Label>Площадь (м²) *</Label>
                  <Input type="number" value={roomForm.area} onChange={e => setRoomForm({...roomForm, area: e.target.value})} />
                </div>
                <div>
                  <Label>Мин. часов</Label>
                  <Input type="number" value={roomForm.min_hours} onChange={e => setRoomForm({...roomForm, min_hours: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea value={roomForm.description} onChange={e => setRoomForm({...roomForm, description: e.target.value})} />
              </div>
              <div>
                <Label>Фотографии</Label>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="room-images" />
                <label htmlFor="room-images">
                  <Button type="button" variant="outline" asChild>
                    <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                  </Button>
                </label>
                {roomImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {roomImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.preview} className="w-full h-20 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => setRoomImages(roomImages.filter((_, i) => i !== idx))}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createRoom} disabled={loading}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {editingRoom && (
          <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать номер</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <Label>Название</Label>
                  <Input value={editingRoom.name} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Цена (₽/час)</Label>
                    <Input type="number" value={editingRoom.price} onChange={e => setEditingRoom({...editingRoom, price: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Площадь (м²)</Label>
                    <Input type="number" value={editingRoom.area} onChange={e => setEditingRoom({...editingRoom, area: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Мин. часов</Label>
                    <Input type="number" value={editingRoom.min_hours || 2} onChange={e => setEditingRoom({...editingRoom, min_hours: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})} />
                </div>
                <div>
                  <Label>Добавить фото</Label>
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="edit-room-images" />
                  <label htmlFor="edit-room-images">
                    <Button type="button" variant="outline" asChild>
                      <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                    </Button>
                  </label>
                  {roomImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {roomImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img.preview} className="w-full h-20 object-cover rounded" />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => setRoomImages(roomImages.filter((_, i) => i !== idx))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => updateRoom(editingRoom)} disabled={loading}>Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {selectedHotel && !showNewRoomDialog && (
          <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать объект</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <Label>Название</Label>
                  <Input value={selectedHotel.name} onChange={e => setSelectedHotel({...selectedHotel, name: e.target.value})} />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input value={selectedHotel.address} onChange={e => setSelectedHotel({...selectedHotel, address: e.target.value})} />
                </div>
                <div>
                  <Label>Метро</Label>
                  <Input value={selectedHotel.metro} onChange={e => setSelectedHotel({...selectedHotel, metro: e.target.value})} />
                </div>
                <div>
                  <Label>Владелец</Label>
                  <Select value={selectedHotel.owner_id?.toString() || ''} onValueChange={value => setSelectedHotel({...selectedHotel, owner_id: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите владельца" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map(owner => (
                        <SelectItem key={owner.id} value={owner.id.toString()}>{owner.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea value={selectedHotel.description || ''} onChange={e => setSelectedHotel({...selectedHotel, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Телефон</Label>
                    <Input value={selectedHotel.phone || ''} onChange={e => setSelectedHotel({...selectedHotel, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label>Telegram</Label>
                    <Input value={selectedHotel.telegram || ''} onChange={e => setSelectedHotel({...selectedHotel, telegram: e.target.value})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => updateHotel(selectedHotel)} disabled={loading}>Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
