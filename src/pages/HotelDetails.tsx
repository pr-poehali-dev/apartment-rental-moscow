import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import HotelHeader from '@/components/hotel/HotelHeader';
import HotelInfo from '@/components/hotel/HotelInfo';
import RoomCard from '@/components/hotel/RoomCard';

const API_URL = 'https://functions.poehali.dev/29a1c7f3-8c8b-4b84-b43e-cf13a34c4a3a/hotels-api';

export default function HotelDetails() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<number, number>>({});
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const response = await fetch(`${API_URL}?entity=hotels&id=${hotelId}`);
        const data = await response.json();
        
        if (data && data.id) {
          const mappedHotel = {
            id: data.id,
            name: data.name,
            address: data.address,
            metro: data.metro,
            description: data.description,
            phone: data.owner_phone,
            rooms: (data.rooms || []).map((room: any) => ({
              id: room.id,
              name: room.name,
              images: room.images && room.images.length > 0 
                ? room.images 
                : ['https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg'],
              price: Number(room.price),
              area: Number(room.area),
              description: room.description || '',
              features: [
                { icon: 'Users', label: `До ${room.capacity} гостей` },
                { icon: 'Wifi', label: 'Wi-Fi' }
              ],
              amenities: room.amenities || [],
              telegram: data.owner_telegram || '',
              phone: data.owner_phone,
              minHours: 2
            }))
          };
          setHotel(mappedHotel);
        } else {
          setHotel(null);
        }
      } catch (error) {
        console.error('Failed to load hotel:', error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      loadHotel();
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Отель не найден</h2>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HotelHeader />

      <main className="pt-20 pb-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <HotelInfo hotel={hotel} />

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Доступные номера
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {hotel.rooms.map((room) => {
                const currentImageIndex = roomImageIndexes[room.id] || 0;
                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    currentImageIndex={currentImageIndex}
                    isSelected={selectedRoom === room.id}
                    onImageChange={(newIndex) => {
                      setRoomImageIndexes(prev => ({
                        ...prev,
                        [room.id]: newIndex
                      }));
                    }}
                    onSelect={() => setSelectedRoom(room.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>120 минут © 2026 • Почасовая аренда квартир</span>
          </div>
        </div>
      </footer>
    </div>
  );
}