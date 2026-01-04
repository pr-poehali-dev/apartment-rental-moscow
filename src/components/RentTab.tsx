import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Apartment {
  id: number;
  title: string;
  image: string;
  price: number;
  metro: string;
  address: string;
  area: number;
  rooms: number;
  telegram: string;
  views: number;
  telegramClicks: number;
}

interface RentTabProps {
  apartmentStats: Apartment[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  trackView: (id: number) => void;
  trackTelegramClick: (id: number) => void;
  scrollY: number;
  heroTextIndex: number;
  heroTexts: string[];
}

export default function RentTab({
  apartmentStats,
  searchQuery,
  setSearchQuery,
  trackView,
  trackTelegramClick,
  scrollY,
  heroTextIndex,
  heroTexts
}: RentTabProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="animate-fade-in">
      <section ref={heroRef} className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        <img 
          src="https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div className="relative z-10 text-center text-white px-6">
          <h2 
            className={`font-bold mb-6 tracking-tight uppercase transition-opacity duration-500 whitespace-nowrap ${heroTextIndex === 1 ? 'text-2xl md:text-4xl' : 'text-4xl md:text-6xl'}`}
            dangerouslySetInnerHTML={{ __html: heroTexts[heroTextIndex] }}
          />
          <p className="text-xl md:text-2xl font-light mb-8 text-white/90 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            Без посредников / Без регистрации
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-8 h-12 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
            Смотреть квартиры
          </Button>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="mb-12">
          <Input
            type="search"
            placeholder="Найти квартиру по адресу или метро"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-2xl mx-auto h-12 rounded-full border-gray-300 px-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartmentStats.map((apt) => {
            const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`Москва, ${apt.address}`)}`;
            return (
              <Card 
                key={apt.id} 
                className="overflow-hidden border-0 shadow-sm hover-lift cursor-pointer group rounded-2xl"
                onClick={() => trackView(apt.id)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src={apt.image} 
                    alt={apt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold tracking-tight">{apt.title}</h3>
                    <Badge variant="secondary" className="rounded-full font-semibold">
                      {apt.price}₽/ч
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} />
                      <span>{apt.metro}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Home" size={16} />
                      <span>{apt.area} м² • {apt.rooms} комн.</span>
                    </div>
                    <a 
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon name="Navigation" size={16} />
                      <span className="text-xs">{apt.address}</span>
                    </a>
                  </div>
                  <Button 
                    className="w-full rounded-full h-10 mt-4"
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackTelegramClick(apt.id);
                      window.open(`https://t.me/${apt.telegram.replace('@', '')}`, '_blank');
                    }}
                  >
                    <Icon name="MessageCircle" size={16} />
                    Заявка в Telegram
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Как это работает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'Search', title: 'Выбираете', desc: 'Смотрите квартиры с фото и описанием' },
              { icon: 'MessageCircle', title: 'Связываетесь', desc: 'Пишете собственнику в Telegram' },
              { icon: 'Key', title: 'Заселяетесь', desc: 'Договариваетесь и въезжаете' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center">
                  <Icon name={step.icon as any} size={28} className="text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
