import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Hotel, Room } from '@/types/admin';

interface HotelCardProps {
  hotel: Hotel;
  onTogglePublish: (hotel: Hotel) => void;
  onToggleArchive: (hotel: Hotel) => void;
  onEdit: (hotel: Hotel) => void;
  onAddRoom: (hotel: Hotel) => void;
  onEditRoom: (room: Room) => void;
  onToggleRoomArchive: (room: Room) => void;
  onDeleteRoom: (roomId: number) => void;
}

export default function HotelCard({
  hotel,
  onTogglePublish,
  onToggleArchive,
  onEdit,
  onAddRoom,
  onEditRoom,
  onToggleRoomArchive,
  onDeleteRoom
}: HotelCardProps) {
  return (
    <Card className="p-6">
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
            onClick={() => onTogglePublish(hotel)}
          >
            {hotel.is_published ? '✓ Опубликован' : 'Не опубликован'}
          </Button>
          <Button
            size="sm"
            variant={hotel.is_archived ? 'secondary' : 'outline'}
            onClick={() => onToggleArchive(hotel)}
          >
            <Icon name={hotel.is_archived ? 'ArchiveRestore' : 'Archive'} size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(hotel)}>
            <Icon name="Edit" size={16} />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Button size="sm" onClick={() => onAddRoom(hotel)}>
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
                <Button size="sm" variant="outline" onClick={() => onEditRoom(room)}>
                  <Icon name="Edit" size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onToggleRoomArchive(room)}>
                  <Icon name={room.is_archived ? 'ArchiveRestore' : 'Archive'} size={14} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDeleteRoom(room.id)}>
                  <Icon name="Trash" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
