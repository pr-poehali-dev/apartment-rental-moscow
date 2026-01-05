import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Hotel } from '@/types/hotel';

interface HotelInfoProps {
  hotel: Hotel;
}

export default function HotelInfo({ hotel }: HotelInfoProps) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
        {hotel.name}
      </h1>
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
