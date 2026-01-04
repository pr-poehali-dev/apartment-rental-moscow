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
  heroImageIndex: number;
  heroImages: string[];
}

export default function RentTab({
  apartmentStats,
  searchQuery,
  setSearchQuery,
  trackView,
  trackTelegramClick,
  scrollY,
  heroTextIndex,
  heroTexts,
  heroImageIndex,
  heroImages
}: RentTabProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="animate-fade-in">
      <section ref={heroRef} className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        {heroImages.map((image, idx) => (
          <img 
            key={idx}
            src={image}
            alt={`Hero ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === heroImageIndex ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 text-center text-white px-6 max-w-5xl">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight transition-all duration-500 fade-slide-in"
            style={{ fontFamily: 'Syne, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: heroTexts[heroTextIndex] }}
          />
          <p className="text-xl md:text-2xl font-light mb-2 text-white/90 fade-slide-in" style={{ animationDelay: '0.2s' }}>
            №1 в почасовой аренде
          </p>
          <p className="text-lg md:text-xl font-light mb-8 text-white/80 fade-slide-in" style={{ animationDelay: '0.3s' }}>
            Без посредников / Без регистрации
          </p>
          <Button size="lg" className="hero-gradient text-white hover:opacity-90 rounded-full px-10 h-14 text-lg font-semibold shadow-2xl fade-slide-in" style={{ animationDelay: '0.4s' }}>
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
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl cursor-pointer group rounded-3xl bg-white transition-all duration-300 hover:-translate-y-2"
                onClick={() => trackView(apt.id)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative">
                  <img 
                    src={apt.image} 
                    alt={apt.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="hero-gradient text-white border-0 rounded-full font-bold text-base px-4 py-2 shadow-lg">
                      {apt.price}₽/ч
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>{apt.title}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Icon name="MapPin" size={14} className="text-purple-600" />
                      </div>
                      <span className="font-medium">{apt.metro}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="Home" size={14} className="text-blue-600" />
                      </div>
                      <span className="font-medium">{apt.area} м² • {apt.rooms} комн.</span>
                    </div>
                    <a 
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-primary hover:text-purple-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <Icon name="Navigation" size={14} className="text-purple-600" />
                      </div>
                      <span className="text-xs font-medium underline">{apt.address}</span>
                    </a>
                  </div>
                  <Button 
                    className="w-full rounded-full h-12 mt-2 hero-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackTelegramClick(apt.id);
                      window.open(`https://t.me/${apt.telegram.replace('@', '')}`, '_blank');
                    }}
                  >
                    <Icon name="MessageCircle" size={18} />
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