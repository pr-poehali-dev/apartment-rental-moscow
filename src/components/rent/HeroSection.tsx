import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  heroImageIndex: number;
  heroImages: string[];
  heroTextIndex: number;
  heroTexts: string[];
  temperature: number | null;
  weatherCode: number | null;
  getWeatherIcon: (code: number | null) => string;
  onCategoryClick?: (category: 'hotels' | 'apartments' | 'saunas' | 'conference') => void;
}

export default function HeroSection({
  heroImageIndex,
  heroImages,
  heroTextIndex,
  heroTexts,
  temperature,
  weatherCode,
  getWeatherIcon,
  onCategoryClick
}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'hotels' as const, label: 'Отели', icon: 'Building2' },
    { id: 'apartments' as const, label: 'Апартаменты', icon: 'Home' },
    { id: 'saunas' as const, label: 'Сауны', icon: 'Waves' },
    { id: 'conference' as const, label: 'Конференц-залы', icon: 'Presentation' },
  ];

  return (
    <section ref={heroRef} className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      {heroImages.map((image, idx) => (
        <img 
          key={idx}
          src={image}
          alt={`Hero ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${
            idx === heroImageIndex ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
        <div className="space-y-8">
          <h1 
            key={heroTextIndex}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight animate-fade-in drop-shadow-lg"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {heroTexts[heroTextIndex]}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="lg"
                onClick={() => onCategoryClick?.(category.id)}
                className="bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm px-6 py-6 text-base sm:text-lg"
              >
                <Icon name={category.icon} size={20} className="mr-2" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}