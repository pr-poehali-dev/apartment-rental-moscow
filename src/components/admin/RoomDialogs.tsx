import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Room, ImageUpload } from '@/types/admin';

interface RoomDialogsProps {
  showNewRoomDialog: boolean;
  setShowNewRoomDialog: (show: boolean) => void;
  roomForm: {
    name: string;
    price: string;
    area: string;
    description: string;
    min_hours: string;
  };
  setRoomForm: (form: {
    name: string;
    price: string;
    area: string;
    description: string;
    min_hours: string;
  }) => void;
  createRoom: () => void;
  editingRoom: Room | null;
  setEditingRoom: (room: Room | null) => void;
  updateRoom: (room: Room) => void;
  roomImages: ImageUpload[];
  setRoomImages: (images: ImageUpload[]) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export default function RoomDialogs({
  showNewRoomDialog,
  setShowNewRoomDialog,
  roomForm,
  setRoomForm,
  createRoom,
  editingRoom,
  setEditingRoom,
  updateRoom,
  roomImages,
  setRoomImages,
  handleImageSelect,
  loading
}: RoomDialogsProps) {
  return (
    <>
      <Dialog open={showNewRoomDialog} onOpenChange={setShowNewRoomDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Новый номер</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label>Название *</Label>
              <Input value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Цена (₽/час) *</Label>
                <Input type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} />
              </div>
              <div>
                <Label>Площадь (м²) *</Label>
                <Input type="number" value={roomForm.area} onChange={e => setRoomForm({...roomForm, area: e.target.value})} />
              </div>
              <div>
                <Label>Мин. часов</Label>
                <Input type="number" value={roomForm.min_hours} onChange={e => setRoomForm({...roomForm, min_hours: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea value={roomForm.description} onChange={e => setRoomForm({...roomForm, description: e.target.value})} />
            </div>
            <div>
              <Label>Фотографии</Label>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="room-images" />
              <label htmlFor="room-images">
                <Button type="button" variant="outline" asChild>
                  <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                </Button>
              </label>
              {roomImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {roomImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img.preview} className="w-full h-20 object-cover rounded" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => setRoomImages(roomImages.filter((_, i) => i !== idx))}
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
            <Button onClick={createRoom} disabled={loading}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingRoom && (
        <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать номер</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Название</Label>
                <Input value={editingRoom.name} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Цена (₽/час)</Label>
                  <Input type="number" value={editingRoom.price} onChange={e => setEditingRoom({...editingRoom, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <Label>Площадь (м²)</Label>
                  <Input type="number" value={editingRoom.area} onChange={e => setEditingRoom({...editingRoom, area: parseInt(e.target.value)})} />
                </div>
                <div>
                  <Label>Мин. часов</Label>
                  <Input type="number" value={editingRoom.min_hours || 2} onChange={e => setEditingRoom({...editingRoom, min_hours: parseInt(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})} />
              </div>
              <div>
                <Label>Добавить фото</Label>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="edit-room-images" />
                <label htmlFor="edit-room-images">
                  <Button type="button" variant="outline" asChild>
                    <span><Icon name="Upload" size={16} className="mr-2" />Выбрать фото</span>
                  </Button>
                </label>
                {roomImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {roomImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.preview} className="w-full h-20 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => setRoomImages(roomImages.filter((_, i) => i !== idx))}
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
              <Button onClick={() => updateRoom(editingRoom)} disabled={loading}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
