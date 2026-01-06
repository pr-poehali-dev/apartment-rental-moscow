import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface OwnerBriefModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OwnerBriefModal({ open, onClose }: OwnerBriefModalProps) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    address: '',
    objectsCount: '',
    website: '',
    phone: '',
    telegram: '',
    ownerName: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем сообщение для отправки в Telegram
    const message = `
🏢 Новая заявка на размещение

📋 Категория: ${formData.category}
🏠 Наименование: ${formData.name}
📍 Адрес: ${formData.address}
🔢 Количество объектов: ${formData.objectsCount}
${formData.website ? `🌐 Сайт: ${formData.website}` : ''}
📞 Телефон: ${formData.phone}
${formData.telegram ? `💬 Telegram: ${formData.telegram}` : ''}
👤 Имя собственника: ${formData.ownerName}
    `.trim();

    console.log('Отправка брифа:', message);
    setIsSubmitted(true);
    
    // Через 2 секунды закрываем модалку и сбрасываем форму
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        category: '',
        name: '',
        address: '',
        objectsCount: '',
        website: '',
        phone: '',
        telegram: '',
        ownerName: ''
      });
    }, 2000);
  };

  const categoryOptions = [
    { value: 'hotel', label: 'Отель' },
    { value: 'apartment', label: 'Апартамент' },
    { value: 'sauna', label: 'Сауна' },
    { value: 'conference', label: 'Конференц-зал' }
  ];

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Icon name="Check" size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground">
              Мы свяжемся с вами в ближайшее время
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Заявка на размещение</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              Категория <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Наименование <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Например: Апартаменты на Арбате"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Адрес <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Улица, дом"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectsCount">
              Количество объектов <span className="text-red-500">*</span>
            </Label>
            <Input
              id="objectsCount"
              type="number"
              min="1"
              placeholder="1"
              value={formData.objectsCount}
              onChange={(e) => setFormData({ ...formData, objectsCount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              Ссылка на сайт (необязательно)
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">
              Telegram канал/username (необязательно)
            </Label>
            <Input
              id="telegram"
              placeholder="@username"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">
              Имя собственника <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ownerName"
              placeholder="Иван Иванов"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Отправить заявку
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
