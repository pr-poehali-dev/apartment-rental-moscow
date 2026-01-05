import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function HotelHeader() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <Icon name="ArrowLeft" size={20} />
          Назад
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/ce30d053-d4f9-4cf6-9987-524223dff568.jpg"
            alt="120 минут"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <h1 
            className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer" 
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            onClick={() => navigate('/')}
          >
            120 минут
          </h1>
        </div>
      </div>
    </nav>
  );
}
