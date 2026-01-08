import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Room } from '@/types/hotel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';

interface RoomCardProps {
  room: Room;
  currentImageIndex: number;
  isSelected: boolean;
  onImageChange: (newIndex: number) => void;
  onSelect: () => void;
}

export default function RoomCard({ room, currentImageIndex, isSelected, onImageChange, onSelect }: RoomCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  };

  return (
    <>
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col h-full ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="relative h-64 group">
        <img
          src={room.images[currentImageIndex]}
          alt={room.name}
          className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(currentImageIndex);
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(currentImageIndex);
          }}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="Просмотр фото"
        >
          <Icon name="Expand" size={20} />
        </button>
        {room.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(currentImageIndex === 0 ? room.images.length - 1 : currentImageIndex - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageChange((currentImageIndex + 1) % room.images.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {room.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4">
          <Badge className="hero-gradient text-white border-0 rounded-full font-bold text-lg px-4 py-2 shadow-lg">
            {room.price}₽/ч
          </Badge>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          {room.name}
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {room.features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center cursor-help transition-colors">
                <Icon name={feature.icon as any} size={20} className="text-purple-600" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {feature.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Maximize" size={16} />
            <span>{room.area} м²</span>
          </div>
          <span className="text-red-600 font-semibold">от {room.minHours}ч</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.map((amenity, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>

        <Button
          className="w-full rounded-full mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://t.me/${room.telegram.replace('@', '')}`, '_blank');
          }}
        >
          <Icon name="MessageCircle" size={18} className="mr-2" />
          Забронировать в Telegram
        </Button>
      </div>
    </Card>

    <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-[95vh] flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-50 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
          
          <img
            src={room.images[lightboxIndex]}
            alt={`${room.name} - фото ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          
          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <Icon name="ChevronRight" size={32} />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {lightboxIndex + 1} / {room.images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}