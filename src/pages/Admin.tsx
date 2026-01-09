import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_URL, Hotel, Owner, Room, ImageUpload } from '@/types/admin';
import HotelCard from '@/components/admin/HotelCard';
import HotelDialogs from '@/components/admin/HotelDialogs';
import RoomDialogs from '@/components/admin/RoomDialogs';

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

  const handleAddRoom = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowNewRoomDialog(true);
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
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onTogglePublish={togglePublish}
              onToggleArchive={toggleArchive}
              onEdit={setSelectedHotel}
              onAddRoom={handleAddRoom}
              onEditRoom={setEditingRoom}
              onToggleRoomArchive={toggleRoomArchive}
              onDeleteRoom={deleteRoom}
            />
          ))}
        </div>

        <HotelDialogs
          showNewOwnerDialog={showNewOwnerDialog}
          setShowNewOwnerDialog={setShowNewOwnerDialog}
          ownerForm={ownerForm}
          setOwnerForm={setOwnerForm}
          createOwner={createOwner}
          showNewHotelDialog={showNewHotelDialog}
          setShowNewHotelDialog={setShowNewHotelDialog}
          hotelForm={hotelForm}
          setHotelForm={setHotelForm}
          createHotel={createHotel}
          selectedHotel={selectedHotel}
          setSelectedHotel={setSelectedHotel}
          updateHotel={updateHotel}
          showNewRoomDialog={showNewRoomDialog}
          owners={owners}
          loading={loading}
        />

        <RoomDialogs
          showNewRoomDialog={showNewRoomDialog}
          setShowNewRoomDialog={setShowNewRoomDialog}
          roomForm={roomForm}
          setRoomForm={setRoomForm}
          createRoom={createRoom}
          editingRoom={editingRoom}
          setEditingRoom={setEditingRoom}
          updateRoom={updateRoom}
          roomImages={roomImages}
          setRoomImages={setRoomImages}
          handleImageSelect={handleImageSelect}
          loading={loading}
        />
      </div>
    </div>
  );
}
