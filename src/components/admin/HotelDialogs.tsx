import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Hotel, Owner, ImageUpload } from '@/types/admin';

interface HotelDialogsProps {
  showNewOwnerDialog: boolean;
  setShowNewOwnerDialog: (show: boolean) => void;
  ownerForm: {
    name: string;
    phone: string;
    telegram: string;
  };
  setOwnerForm: (form: { name: string; phone: string; telegram: string }) => void;
  createOwner: () => void;
  showNewHotelDialog: boolean;
  setShowNewHotelDialog: (show: boolean) => void;
  hotelForm: {
    name: string;
    address: string;
    metro: string;
    description: string;
    phone: string;
    telegram: string;
    owner_id: string;
    category: string;
  };
  setHotelForm: (form: {
    name: string;
    address: string;
    metro: string;
    description: string;
    phone: string;
    telegram: string;
    owner_id: string;
    category: string;
  }) => void;
  createHotel: () => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
  updateHotel: (hotel: Hotel) => void;
  showNewRoomDialog: boolean;
  owners: Owner[];
  loading: boolean;
  hotelImages: ImageUpload[];
  setHotelImages: (images: ImageUpload[]) => void;
  handleHotelImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HotelDialogs({
  showNewOwnerDialog,
  setShowNewOwnerDialog,
  ownerForm,
  setOwnerForm,
  createOwner,
  showNewHotelDialog,
  setShowNewHotelDialog,
  hotelForm,
  setHotelForm,
  createHotel,
  selectedHotel,
  setSelectedHotel,
  updateHotel,
  showNewRoomDialog,
  owners,
  loading,
  hotelImages,
  setHotelImages,
  handleHotelImageSelect
}: HotelDialogsProps) {
  return (
    <>
      <Dialog open={showNewOwnerDialog} onOpenChange={setShowNewOwnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый владелец</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Имя *</Label>
              <Input value={ownerForm.name} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input value={ownerForm.phone} onChange={e => setOwnerForm({...ownerForm, phone: e.target.value})} />
            </div>
            <div>
              <Label>Telegram</Label>
              <Input value={ownerForm.telegram} onChange={e => setOwnerForm({...ownerForm, telegram: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createOwner} disabled={loading}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewHotelDialog} onOpenChange={setShowNewHotelDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Новый объект</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label>Название *</Label>
              <Input value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} />
            </div>
            <div>
              <Label>Адрес *</Label>
              <Input value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} />
            </div>
            <div>
              <Label>Метро *</Label>
              <Input value={hotelForm.metro} onChange={e => setHotelForm({...hotelForm, metro: e.target.value})} />
            </div>
            <div>
              <Label>Владелец</Label>
              <Select value={hotelForm.owner_id} onValueChange={value => setHotelForm({...hotelForm, owner_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите владельца" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map(owner => (
                    <SelectItem key={owner.id} value={owner.id.toString()}>{owner.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Телефон</Label>
                <Input value={hotelForm.phone} onChange={e => setHotelForm({...hotelForm, phone: e.target.value})} />
              </div>
              <div>
                <Label>Telegram</Label>
                <Input value={hotelForm.telegram} onChange={e => setHotelForm({...hotelForm, telegram: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Фотографии объекта</Label>
              <input type="file" accept="image/*" multiple onChange={handleHotelImageSelect} className="hidden" id="hotel-images-new" />
              <label htmlFor="hotel-images-new">
                <Button type="button" variant="outline" asChild>
                  <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                </Button>
              </label>
              {hotelImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {hotelImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img.preview} className="w-full h-20 object-cover rounded" alt="" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => setHotelImages(hotelImages.filter((_, i) => i !== idx))}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createHotel} disabled={loading}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedHotel && !showNewRoomDialog && (
        <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать объект</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Название</Label>
                <Input value={selectedHotel.name} onChange={e => setSelectedHotel({...selectedHotel, name: e.target.value})} />
              </div>
              <div>
                <Label>Адрес</Label>
                <Input value={selectedHotel.address} onChange={e => setSelectedHotel({...selectedHotel, address: e.target.value})} />
              </div>
              <div>
                <Label>Метро</Label>
                <Input value={selectedHotel.metro} onChange={e => setSelectedHotel({...selectedHotel, metro: e.target.value})} />
              </div>
              <div>
                <Label>Владелец</Label>
                <Select value={selectedHotel.owner_id?.toString() || ''} onValueChange={value => setSelectedHotel({...selectedHotel, owner_id: value ? parseInt(value) : undefined})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите владельца" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без владельца</SelectItem>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea value={selectedHotel.description || ''} onChange={e => setSelectedHotel({...selectedHotel, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Телефон</Label>
                  <Input value={selectedHotel.phone || ''} onChange={e => setSelectedHotel({...selectedHotel, phone: e.target.value})} />
                </div>
                <div>
                  <Label>Telegram</Label>
                  <Input value={selectedHotel.telegram || ''} onChange={e => setSelectedHotel({...selectedHotel, telegram: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Добавить фото объекта</Label>
                <input type="file" accept="image/*" multiple onChange={handleHotelImageSelect} className="hidden" id="hotel-images-edit" />
                <label htmlFor="hotel-images-edit">
                  <Button type="button" variant="outline" asChild>
                    <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                  </Button>
                </label>
                {hotelImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {hotelImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.preview} className="w-full h-20 object-cover rounded" alt="" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => setHotelImages(hotelImages.filter((_, i) => i !== idx))}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => updateHotel(selectedHotel)} disabled={loading}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}