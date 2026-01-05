import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import HotelHeader from '@/components/hotel/HotelHeader';
import HotelInfo from '@/components/hotel/HotelInfo';
import RoomCard from '@/components/hotel/RoomCard';
import { hotelsData } from '@/data/hotelsData';

export default function HotelDetails() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<number, number>>({});

  const hotel = hotelId ? hotelsData[hotelId] : null;

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
