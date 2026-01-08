import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ImageUpload {
  file: File;
  preview: string;
  uploaded?: string;
}

export default function Admin() {
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelMetro, setHotelMetro] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');
  const [hotelTelegram, setHotelTelegram] = useState('');
  
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomArea, setRoomArea] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomMinHours, setRoomMinHours] = useState('2');
  const [roomImages, setRoomImages] = useState<ImageUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
    }
    setRoomImages([...roomImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...roomImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setRoomImages(newImages);
  };

  const uploadImage = async (image: ImageUpload): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const response = await fetch('https://functions.poehali.dev/1f01a2cb-8661-4f11-b90a-dae6dcb16df0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64,
              fileName: image.file.name
            })
          });
          
          const data = await response.json();
          if (data.url) {
            resolve(data.url);
          } else {
            reject(new Error('No URL in response'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(image.file);
    });
  };

  const handleSubmit = async () => {
    if (!hotelName || !hotelAddress || !hotelMetro) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля отеля',
        variant: 'destructive'
      });
      return;
    }

    if (!roomName || !roomPrice || !roomArea) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля номера',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    
    try {
      // Загружаем все изображения
      const uploadedUrls: string[] = [];
      for (const img of roomImages) {
        const url = await uploadImage(img);
        uploadedUrls.push(url);
      }

      const hotelData = {
        hotel: {
          name: hotelName,
          address: hotelAddress,
          metro: hotelMetro,
          description: hotelDescription,
          phone: hotelPhone,
          telegram: hotelTelegram
        },
        room: {
          name: roomName,
          price: parseInt(roomPrice),
          area: parseInt(roomArea),
          description: roomDescription,
          minHours: parseInt(roomMinHours),
          images: uploadedUrls
        }
      };

      toast({
        title: 'Данные подготовлены',
        description: 'Скопируйте JSON ниже и отправьте разработчику',
      });

      console.log('Hotel Data:', JSON.stringify(hotelData, null, 2));
      navigator.clipboard.writeText(JSON.stringify(hotelData, null, 2));
      
      toast({
        title: 'Скопировано!',
        description: 'JSON с данными скопирован в буфер обмена',
      });
      
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить изображения',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Админ-панель</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Информация об отеле</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Название отеля *</Label>
              <Input value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
            </div>
            
            <div>
              <Label>Адрес *</Label>
              <Input value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
            </div>
            
            <div>
              <Label>Метро *</Label>
              <Input value={hotelMetro} onChange={(e) => setHotelMetro(e.target.value)} />
            </div>
            
            <div>
              <Label>Описание</Label>
              <Textarea value={hotelDescription} onChange={(e) => setHotelDescription(e.target.value)} rows={3} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Телефон</Label>
                <Input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} placeholder="+79852118808" />
              </div>
              
              <div>
                <Label>Telegram</Label>
                <Input value={hotelTelegram} onChange={(e) => setHotelTelegram(e.target.value)} placeholder="@DmitryKelm" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Категория номера</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Название номера *</Label>
              <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Стандарт" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Цена (₽/час) *</Label>
                <Input type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} />
              </div>
              
              <div>
                <Label>Площадь (м²) *</Label>
                <Input type="number" value={roomArea} onChange={(e) => setRoomArea(e.target.value)} />
              </div>
              
              <div>
                <Label>Мин. часов</Label>
                <Input type="number" value={roomMinHours} onChange={(e) => setRoomMinHours(e.target.value)} />
              </div>
            </div>
            
            <div>
              <Label>Описание номера</Label>
              <Textarea value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)} rows={3} />
            </div>
            
            <div>
              <Label>Фотографии номера</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Icon name="Upload" size={18} className="mr-2" />
                      Выбрать фото
                    </span>
                  </Button>
                </label>
              </div>
              
              {roomImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {roomImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full h-14 text-lg"
          size="lg"
        >
          {uploading ? 'Загрузка...' : 'Сохранить и скопировать JSON'}
        </Button>
      </div>
    </div>
  );
}
