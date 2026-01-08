import { Hotel } from '@/types/hotel';

export const hotelsData: Record<string, Hotel> = {
  '101': {
    id: 101,
    name: 'My loft Войковская',
    address: 'Старопетровский проезд, д. 1, стр. 1',
    metro: 'Войковская',
    description: 'Современные лофты в районе Войковская с почасовой арендой от 1500₽/час',

    rooms: [
      {
        id: 1,
        name: 'Стандарт',
        images: [
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-11.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-17.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-33.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-22.jpeg'
        ],
        price: 1500,
        area: 15,
        description: 'Комфортный номер с двуспальной кроватью, идеально подходит для краткосрочного отдыха',
        features: [
          { icon: 'BedDouble', label: 'Двусп. кровать' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чай, кофе, вода' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Платный паркинг 100₽/час', 'Оплата по ссылке', 'Бесконтактное заселение'],
        telegram: '@hotel_uyut_standard',
        minHours: 2
      },
      {
        id: 2,
        name: 'Стандарт Плюс',
        images: [
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-12.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-18.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-44.jpeg',
          'https://cdn.poehali.dev/files/image-06-01-26-02-10-37.jpeg'
        ],
        price: 1800,
        area: 18,
        description: 'Комфортный номер, который больше подходит для командировочных или 2х гостей не имеющих отношения к романтике, 2 Раздельные кровати',
        features: [
          { icon: 'BedSingle', label: '2 кровати' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чай, кофе, вода, мини-бар' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Платный паркинг 100₽/час', 'Оплата по ссылке', 'Бесконтактное заселение'],
        telegram: '@hotel_uyut_standard_plus',
        minHours: 2
      },
      {
        id: 3,
        name: 'Улучшенный',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/b61bc81d-ca45-463a-803d-9b1d1e5dc423.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c987b402-c893-43d0-883d-35c77f5fbbac.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg'
        ],
        price: 2000,
        area: 20,
        description: 'Просторный арпартамент с 3 окнами, идеально подходит для краткосрочного отдыха',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'Bath', label: 'Джакузи' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чай, кофе, вода, мини-бар' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Джакузи', 'Мини-бар', 'Свечи', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_uyut_romantic',
        minHours: 3
      },
      {
        id: 4,
        name: 'Полулюкс',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/54b80f43-a794-4e12-8f0f-776bee4c904a.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c987b402-c893-43d0-883d-35c77f5fbbac.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/0685b5f7-0b2a-4455-95ac-befcdc828e57.jpg'
        ],
        price: 2200,
        area: 20,
        description: 'Просторный номер повышенной комфортности с отдельной гостиной зоной',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'Sofa', label: 'Гостиная зона с диваном' },
          { icon: 'Bath', label: 'Джакузи' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Кофемашина, чай, вода, мини-бар' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Джакузи', 'Мини-бар', 'Гостиная зона', 'Кофемашина', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_uyut_junior',
        minHours: 3
      }
    ]
  },
  '102': {
    id: 102,
    name: 'Отель "Центральный"',
    address: 'Тверская, 10',
    metro: 'Тверская',
    description: 'Современный отель в центре Москвы с различными категориями номеров',
    rooms: [
      {
        id: 5,
        name: 'Стандарт',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/0685b5f7-0b2a-4455-95ac-befcdc828e57.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg'
        ],
        price: 4000,
        area: 22,
        description: 'Уютный стандартный номер с необходимыми удобствами',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чай, кофе, вода' }
        ],
        amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Душ', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_central_standard',
        minHours: 2
      },
      {
        id: 6,
        name: 'Бизнес',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/8d00905a-b305-437d-a9d7-9d5c1b0e782b.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/54b80f43-a794-4e12-8f0f-776bee4c904a.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/0685b5f7-0b2a-4455-95ac-befcdc828e57.jpg'
        ],
        price: 5000,
        area: 28,
        description: 'Номер для деловых встреч с рабочей зоной',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'Briefcase', label: 'Рабочий стол' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Кофемашина, чай, вода' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Рабочий стол', 'Кофемашина', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_central_business',
        minHours: 3
      },
      {
        id: 7,
        name: 'Люкс',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c987b402-c893-43d0-883d-35c77f5fbbac.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg'
        ],
        price: 7000,
        area: 40,
        description: 'Роскошный номер с панорамным видом на город',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'Bath', label: 'Ванна и джакузи' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Премиум туалетные принадлежности' },
          { icon: 'Coffee', label: 'Кофемашина, чай, вода, мини-бар' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Ванна', 'Джакузи', 'Мини-бар', 'Панорамные окна', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_central_lux',
        minHours: 4
      }
    ]
  },
  '103': {
    id: 103,
    name: 'Мини-отель "Москва"',
    address: 'Павелецкая пл., 2',
    metro: 'Павелецкая',
    description: 'Компактный мини-отель с доступными ценами и уютной атмосферой',
    rooms: [
      {
        id: 8,
        name: 'Эконом',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/43318afd-18f8-428f-bf3d-e139870f2f44.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg'
        ],
        price: 2500,
        area: 18,
        description: 'Бюджетный номер с базовыми удобствами',
        features: [
          { icon: 'BedSingle', label: 'Односпальная кровать' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Базовые туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чайник, чай, вода' }
        ],
        amenities: ['Wi-Fi', 'Телевизор', 'Душ', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_moscow_econom',
        minHours: 2
      },
      {
        id: 9,
        name: 'Комфорт',
        images: [
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/0685b5f7-0b2a-4455-95ac-befcdc828e57.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/54b80f43-a794-4e12-8f0f-776bee4c904a.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
          'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg'
        ],
        price: 3800,
        area: 24,
        description: 'Комфортный номер с улучшенной мебелью',
        features: [
          { icon: 'BedDouble', label: 'Двуспальная кровать' },
          { icon: 'ShowerHead', label: 'Душ' },
          { icon: 'Shirt', label: 'Вешалки для одежды' },
          { icon: 'Sparkles', label: 'Туалетные принадлежности' },
          { icon: 'Coffee', label: 'Чай, кофе, вода, холодильник' }
        ],
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Холодильник', 'Своя охраняемая парковка', 'Оплата картой', 'Лобби-бар'],
        telegram: '@hotel_moscow_comfort',
        minHours: 2
      }
    ]
  }
};