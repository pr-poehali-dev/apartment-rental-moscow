import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Hotel } from '@/types/hotel';

interface HotelInfoProps {
  hotel: Hotel;
}

export default function HotelInfo({ hotel }: HotelInfoProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-4">
        {hotel.id === 101 && (
          <img 
            src="https://cdn.poehali.dev/files/IMG_5196.jpg" 
            alt="My loft logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        )}
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
          {hotel.name}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          <span>{hotel.address}</span>
        </div>
        <Badge variant="secondary" className="rounded-full">
          <Icon name="Train" size={14} className="mr-1" />
          {hotel.metro}
        </Badge>
      </div>
      <p className="text-lg text-muted-foreground max-w-3xl">
        {hotel.description}
      </p>
    </div>
  );
}