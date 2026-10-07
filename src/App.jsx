import React, { useState, useEffect, useMemo, useRef } from 'react';

const FALLBACK_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';

// Безопасный доступ к Telegram WebApp SDK
const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Виброотклик (Haptic Feedback) для смартфонов
const triggerHaptic = (type = 'light') => {
  const tg = getTelegramWebApp();
  if (tg && tg.HapticFeedback) {
    try {
      if (type === 'success' || type === 'error' || type === 'warning') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Игнорируем на устройствах без вибромотора
    }
  }
};

const Icons = {
  Calendar: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Users: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ShoppingBag: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Utensils: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 11v11" />
      <path d="M5 2v4a3 3 0 0 0 3 3h1v13" />
    </svg>
  ),
  Refresh: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Check: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Play: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Pause: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  RotateCcw: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  Close: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Sparkles: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  ),
  Leaf: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Send: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Timer: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  ),
  Flame: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.975 7.975 0 010 11.314z" />
    </svg>
  ),
  ZoomIn: (props) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
};

const MASTER_RECIPES = [
  // ===================== ЗАВТРАКИ =====================
  {
    id: 'rec_curd_pancakes',
    title: 'Пышные сырники из фермерского творога',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 20,
    calories: 380,
    proteins: 31,
    fats: 14,
    carbs: 32,
    tags: ['Завтрак', 'Творог', 'С молочкой'],
    equipment: ['Сковорода 26 см', 'Лопатка', 'Стакан'],
    isBatchable: true,
    batchLabel: 'Хранение 48ч',
    chainRole: 'initiator',
    linkedIngredient: 'ing_curd_5',
    baseIngredients: [
      { id: 'ing_curd_5', name: 'Творог 5% в пачке', gramsPerPerson: 180, category: 'Молочные продукты' },
      { id: 'ing_eggs', name: 'Яйца куриные С1', gramsPerPerson: 50, category: 'Яйца' },
      { id: 'ing_flour', name: 'Мука пшеничная / рисовая', gramsPerPerson: 35, category: 'Бакалея', isPantry: true },
      { id: 'ing_sour_cream', name: 'Сметана 15%', gramsPerPerson: 40, category: 'Молочные продукты' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Замес творожной основы',
        instruction: 'Творог разомните вилкой, добавьте яйцо, соль, сахар и муку. Сформируйте шарики и подкрутите перевернутым стаканом.',
        durationSec: 300,
        visualMarker: 'Плотные ровные ресторанные шайбочки с высокими бортиками.',
        chefTip: 'Вращение стаканом делает сырники идеально круглыми.'
      },
      {
        stepNumber: 2,
        title: 'Обжарка до золотистости',
        instruction: 'Жарьте на умеренном огне по 3.5 минуты с каждой стороны под крышкой.',
        durationSec: 420,
        heat: 'Средне-слабый огонь (5 из 9)',
        visualMarker: 'Золотистая корочка, сырник упруго пружинит.',
        chefTip: 'Не делайте сильный огонь, чтобы середина пропеклась.'
      }
    ]
  },
  {
    id: 'rec_oatmeal_water_berries',
    title: 'Монастырская овсяная каша на воде с яблоком и медом',
    imageUrl: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 12,
    calories: 270,
    proteins: 8,
    fats: 4,
    carbs: 52,
    tags: ['Завтрак', 'Без лактозы', 'Постное', 'Злаки'],
    equipment: ['Сотейник', 'Ложка'],
    isBatchable: false,
    batchLabel: 'Без лактозы',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_oats', name: 'Овсяные хлопья длительной варки', gramsPerPerson: 65, category: 'Бакалея' },
      { id: 'ing_apples', name: 'Яблоки сезонные', gramsPerPerson: 100, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка овсянки на воде',
        instruction: 'В сотейник налейте 220 мл воды со щепоткой соли, доведите до кипения. Всыпьте хлопья, варите 9 минут на тихом огне.',
        durationSec: 540,
        heat: 'Тихий огонь (2 из 9)',
        visualMarker: 'Хлопья стали нежными и бархатистыми.',
        chefTip: 'Варка на воде раскрывает природный ореховый вкус овса.'
      },
      {
        stepNumber: 2,
        title: 'Подача с хрустящими яблоками',
        instruction: 'Яблоко нарежьте тонкими пластинками и выложите на теплую кашу.',
        durationSec: 120,
        visualMarker: 'Сочные контрастные слайсы фруктов поверх каши.',
        chefTip: '100% безлактозный завтрак для энергии.'
      }
    ]
  },
  {
    id: 'rec_millet_pumpkin_porridge',
    title: 'Традиционная пшенная каша с печеной тыквой на воде',
    imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 22,
    calories: 310,
    proteins: 9,
    fats: 5,
    carbs: 58,
    tags: ['Завтрак', 'Без лактозы', 'Русская кухня'],
    equipment: ['Кастрюля с толстым дном'],
    isBatchable: true,
    batchLabel: 'Каша на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_millet',
    baseIngredients: [
      { id: 'ing_millet', name: 'Пшено шлифованное золотистое', gramsPerPerson: 70, category: 'Бакалея' },
      { id: 'ing_pumpkin', name: 'Тыква свежая кубиком', gramsPerPerson: 100, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Промывка пшена и томление с тыквой',
        instruction: 'Пшено ошпарьте кипятком, залейте 250 мл воды. Добавьте тыкву мелкими кубиками и варите под крышкой 18 минут.',
        durationSec: 1080,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Крупа стала рассыпчатой, тыква растушилась в мягкое пюре.',
        chefTip: 'Ошпаривание кипятком убирает характерную горчинку пшена.'
      }
    ]
  },
  {
    id: 'rec_omelette',
    title: 'Пышный домашний омлет с томатами и свежим укропом',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 14,
    calories: 270,
    proteins: 21,
    fats: 16,
    carbs: 10,
    tags: ['Завтрак', 'Без лактозы', 'Без глютена', 'Высокий белок'],
    equipment: ['Сковорода с крышкой', 'Венчик'],
    isBatchable: false,
    batchLabel: 'Без лактозы',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_eggs', name: 'Яйца куриные С1 (2 шт)', gramsPerPerson: 100, category: 'Яйца' },
      { id: 'ing_tomatoes', name: 'Томаты свежие спелые', gramsPerPerson: 80, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Взбивание яиц со специями',
        instruction: 'Яйца взбейте вилкой с солью и 2 ст. л. холодной воды для пышности (без капли молока!).',
        durationSec: 120,
        visualMarker: 'Однородная масса с пузырьками воздуха.',
        chefTip: 'Вода испаряется паром и делает омлет воздушным без лактозы.'
      },
      {
        stepNumber: 2,
        title: 'Томление под крышкой',
        instruction: 'Томаты нарежьте кружками, припустите на сковороде 1 минуту, залейте яйцами, посыпьте укропом и накройте крышкой на 5 минут.',
        durationSec: 300,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Омлет пышно поднялся, поверхность стала матовой.',
        chefTip: 'Не открывайте крышку во время томления.'
      }
    ]
  },
  {
    id: 'rec_potato_draniki',
    title: 'Хрустящие картофельные драники по-домашнему',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 20,
    calories: 340,
    proteins: 10,
    fats: 12,
    carbs: 46,
    tags: ['Завтрак', 'Без лактозы', 'Русская кухня'],
    equipment: ['Терка', 'Сковорода 26 см'],
    isBatchable: false,
    batchLabel: 'Без лактозы',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 220, category: 'Овощи и зелень' },
      { id: 'ing_eggs', name: 'Яйца куриные С1 (1 шт)', gramsPerPerson: 50, category: 'Яйца' },
      { id: 'ing_flour', name: 'Мука пшеничная в/с', gramsPerPerson: 20, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Натирание и отжим картофеля',
        instruction: 'Натрите картофель на средней терке и слегка отожмите сок. Смешайте с яйцом, мукой и солью.',
        durationSec: 300,
        visualMarker: 'Вязкая картофельная масса без лишней лужи сока.',
        chefTip: 'Отжим гарантирует аппетитный хруст.'
      },
      {
        stepNumber: 2,
        title: 'Обжаривание оладий',
        instruction: 'Выкладывайте ложкой на прогретую сковороду. Жарьте по 3-4 минуты с каждой стороны до золотистой корочки.',
        durationSec: 420,
        heat: 'Средний огонь (6 из 9)',
        visualMarker: 'Хрустящая янтарная корочка по краям.',
        chefTip: 'Сытный традиционный завтрак без капли молочных продуктов.'
      }
    ]
  },
  {
    id: 'rec_shakshuka',
    title: 'Шакшука по-домашнему со спелыми томатами и зеленью',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 18,
    calories: 310,
    proteins: 19,
    fats: 17,
    carbs: 16,
    tags: ['Завтрак', 'Без лактозы', 'Без глютена'],
    equipment: ['Сковорода с крышкой', 'Лопатка'],
    isBatchable: false,
    batchLabel: 'Без лактозы',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_eggs', name: 'Яйца куриные С1 (2 шт)', gramsPerPerson: 100, category: 'Яйца' },
      { id: 'ing_tomatoes', name: 'Томаты свежие спелые', gramsPerPerson: 130, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежая зелень', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Тушение томатного соуса',
        instruction: 'Томаты мелко нарежьте кубиком, тушите на сковороде 5 минут со щепоткой соли до состояния густого соуса.',
        durationSec: 300,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Соус загустел и начал лениво булькать.',
        chefTip: 'Естественный томатный сок дает приятную кислинку.'
      },
      {
        stepNumber: 2,
        title: 'Запекание яиц',
        instruction: 'Сделайте углубления, разбейте туда яйца, накройте крышкой на 4 минуты до схватывания белка.',
        durationSec: 240,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Белок матово-белый, желток жидкий и кремовый.',
        chefTip: '100% безлактозный ресторанный завтрак.'
      }
    ]
  },

  // ===================== ПЕРВЫЕ БЛЮДА (СУПЫ) =====================
  {
    id: 'rec_borscht_classic',
    title: 'Классический домашний борщ со свеклой и говядиной',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Средняя',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 45,
    calories: 360,
    proteins: 29,
    fats: 11,
    carbs: 34,
    tags: ['Суп', 'Русская кухня', 'Сытное', 'Говядина'],
    equipment: ['Кастрюля 3 л', 'Терка', 'Доска'],
    isBatchable: true,
    batchLabel: 'Борщ на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_beef_stew',
    baseIngredients: [
      { id: 'ing_beef_stew', name: 'Говядина духовая лоток', gramsPerPerson: 130, category: 'Мясо и птица' },
      { id: 'ing_beets', name: 'Свекла свежая мытая', gramsPerPerson: 90, category: 'Овощи и зелень' },
      { id: 'ing_cabbage', name: 'Капуста белокочанная', gramsPerPerson: 80, category: 'Овощи и зелень' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 80, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка прозрачного мясного бульона',
        instruction: 'Говядину нарежьте кусочками 2.5 см, залейте холодной водой, доведите до кипения и снимите пену. Варите 25 минут на тихом огне.',
        durationSec: 1500,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Чистый прозрачный ароматный бульон.',
        chefTip: 'Снятие первой пены гарантирует кристальную прозрачность.'
      },
      {
        stepNumber: 2,
        title: 'Закладка корнеплодов и капусты',
        instruction: 'Добавьте картофель кубиком, нашинкованную капусту и натертую свеклу. Варите 15 минут.',
        durationSec: 900,
        heat: 'Слабый огонь (4 из 9)',
        visualMarker: 'Борщ приобретает рубиновый благородный цвет.',
        chefTip: 'На второй день борщ становится вдвое насыщеннее!'
      }
    ]
  },
  {
    id: 'rec_shchi_fresh_cabbage',
    title: 'Традиционные русские щи из свежей капусты с цыпленком',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 30,
    calories: 290,
    proteins: 28,
    fats: 7,
    carbs: 26,
    tags: ['Суп', 'Русская кухня', 'Птица', 'Без лактозы'],
    equipment: ['Кастрюля 2.5 л', 'Нож шефа'],
    isBatchable: true,
    batchLabel: 'Щи на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_chicken_breast',
    baseIngredients: [
      { id: 'ing_chicken_breast', name: 'Филе цыпленка охлажденное', gramsPerPerson: 120, category: 'Мясо и птица' },
      { id: 'ing_cabbage', name: 'Капуста свежая соломкой', gramsPerPerson: 120, category: 'Овощи и зелень' },
      { id: 'ing_potatoes', name: 'Картофель кубиком', gramsPerPerson: 90, category: 'Овощи и зелень' },
      { id: 'ing_carrots', name: 'Морковь мытая', gramsPerPerson: 50, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка легкого куриного бульона',
        instruction: 'Куриное филе нарежьте кубиком, опустите в 1.3 л воды, доведите до кипения, снимите пену и варите 10 минут.',
        durationSec: 600,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Светлый чистый золотистый бульон.',
        chefTip: 'Куриное филе варится быстрее говядины.'
      },
      {
        stepNumber: 2,
        title: 'Закладка капусты и картофеля',
        instruction: 'Всыпьте тонко нашинкованную капусту, картофель и натертую морковь. Варите 14 минут под крышкой.',
        durationSec: 840,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Капуста стала прозрачной и мягкой, но сохраняет легкую текстуру.',
        chefTip: 'Традиционное легкое обеденное блюдо.'
      }
    ]
  },
  {
    id: 'rec_ukha_cod',
    title: 'Поморская уха из мурманской трески с картофелем',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 25,
    calories: 280,
    proteins: 31,
    fats: 5,
    carbs: 25,
    tags: ['Суп', 'Рыба', 'Русская кухня', 'Без лактозы'],
    equipment: ['Кастрюля 2.5 л', 'Шумовка'],
    isBatchable: true,
    batchLabel: 'Рыбный суп',
    chainRole: 'initiator',
    linkedIngredient: 'ing_cod_fillet',
    baseIngredients: [
      { id: 'ing_cod_fillet', name: 'Филе трески охлажденное', gramsPerPerson: 160, category: 'Рыба и морепродукты' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 110, category: 'Овощи и зелень' },
      { id: 'ing_carrots', name: 'Морковь кружочками', gramsPerPerson: 50, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка овощной основы',
        instruction: 'В 1.2 л воды опустите нарезанный картофель и морковь, варите 10 минут почти до готовности.',
        durationSec: 600,
        heat: 'Средний огонь (6 из 9)',
        visualMarker: 'Корнеплоды легко протыкаются ножом.',
        chefTip: 'Рыба варится всего 6-8 минут, поэтому овощи закладываются первыми.'
      },
      {
        stepNumber: 2,
        title: 'Закладка трески и укропа',
        instruction: 'Опустите крупные кусочки трески (3х3 см), убавьте огонь до минимума и томите 7 минут. Всыпьте укроп.',
        durationSec: 420,
        heat: 'Слабый огонь (2 из 9)',
        visualMarker: 'Рыба распадается на белые перламутровые лепестки.',
        chefTip: 'Не допускайте бурного кипения, чтобы треска не развалилась в кашу.'
      }
    ]
  },
  {
    id: 'rec_meatball_soup',
    title: 'Домашний суп с мясными фрикадельками и картофелем',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 25,
    calories: 330,
    proteins: 28,
    fats: 10,
    carbs: 31,
    tags: ['Суп', 'Сытное', 'Говядина', 'Без лактозы'],
    equipment: ['Кастрюля 2.5 л', 'Доска'],
    isBatchable: true,
    batchLabel: 'Суп на 2 дня',
    chainRole: 'consumer',
    linkedIngredient: 'ing_beef_mince',
    baseIngredients: [
      { id: 'ing_beef_mince', name: 'Фарш говяжий (остаток лотка)', gramsPerPerson: 120, category: 'Мясо и птица' },
      { id: 'ing_potatoes', name: 'Картофель кубиком', gramsPerPerson: 90, category: 'Овощи и зелень' },
      { id: 'ing_carrots', name: 'Морковь натертая', gramsPerPerson: 40, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Формовка и варка фрикаделек',
        instruction: 'Скатайте из фарша шарики размером с грецкий орех. Опустите в кипящую воду (1.2 л), варите 5 минут, снимая пенку.',
        durationSec: 360,
        heat: 'Средний огонь (6 из 9)',
        visualMarker: 'Фрикадельки всплыли на поверхность.',
        chefTip: 'Смочите руки холодной водой — фарш не будет липнуть к ладоням.'
      },
      {
        stepNumber: 2,
        title: 'Добавление картофеля и зелени',
        instruction: 'Добавьте картофель и морковь, варите 12 минут. Посолите, всыпьте укроп и выключите плиту.',
        durationSec: 720,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Прозрачный наваристый суп с сочными мясными шариками.',
        chefTip: 'Лоток говяжьего фарша полностью использован без остатка.'
      }
    ]
  },
  {
    id: 'rec_turkey_soup',
    title: 'Суп-лапша с индейкой (Zero-Waste утилизация)',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 25,
    calories: 340,
    proteins: 32,
    fats: 8,
    carbs: 35,
    tags: ['Суп', 'Zero-Waste', 'Птица', 'Без лактозы'],
    equipment: ['Кастрюля 2.5 л', 'Шумовка', 'Нож'],
    isBatchable: false,
    batchLabel: 'Цепочка утилизации',
    chainRole: 'consumer',
    linkedIngredient: 'ing_turkey_breast',
    baseIngredients: [
      { id: 'ing_turkey_breast', name: 'Филе индейки (остаток лотка)', gramsPerPerson: 120, category: 'Мясо и птица' },
      { id: 'ing_noodles', name: 'Яичная лапша', gramsPerPerson: 60, category: 'Бакалея' },
      { id: 'ing_carrots', name: 'Морковь фермерская', gramsPerPerson: 50, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка прозрачного бульона',
        instruction: 'Оставшуюся часть филе нарежьте соломкой, залейте водой, доведите до кипения и варите 10 минут на среднем огне.',
        durationSec: 600,
        heat: 'Средний огонь (4 из 9)',
        visualMarker: 'Золотистый прозрачный бульон.',
        chefTip: 'Нарезка соломкой ускоряет варку.'
      },
      {
        stepNumber: 2,
        title: 'Закладка моркови и лапши',
        instruction: 'Добавьте соломку моркови и лапшу. Варите 5 минут, снимите с огня и посыпьте укропом.',
        durationSec: 360,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Лапша мягкая, но упругая.',
        chefTip: 'Лоток птицы израсходован полностью.'
      }
    ]
  },
  {
    id: 'rec_lentil_soup',
    title: 'Нежный суп из красной чечевицы с морковью',
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 20,
    calories: 290,
    proteins: 19,
    fats: 5,
    carbs: 42,
    tags: ['Суп', 'Постное', 'Без мяса', 'Без лактозы'],
    equipment: ['Кастрюля 2 л', 'Блендер'],
    isBatchable: true,
    batchLabel: 'Быстрый суп',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_lentils', name: 'Чечевица красная', gramsPerPerson: 70, category: 'Бакалея' },
      { id: 'ing_carrots', name: 'Морковь мытая', gramsPerPerson: 60, category: 'Овощи и зелень' },
      { id: 'ing_potatoes', name: 'Картофель', gramsPerPerson: 70, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка чечевицы с овощами',
        instruction: 'Картофель и морковь нарежьте ломтиками. Залейте вместе с чечевицей 800 мл воды, варите 15 минут до мягкости.',
        durationSec: 900,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Чечевица полностью разварилась.',
        chefTip: 'Красная чечевица варится быстрее всех бобовых.'
      }
    ]
  },

  // ===================== ВТОРЫЕ БЛЮДА (ОБЕД 2-е) =====================
  {
    id: 'rec_cutlets_mashed_potatoes',
    title: 'Домашние мясные котлеты с картофелем',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 30,
    calories: 460,
    proteins: 36,
    fats: 16,
    carbs: 42,
    tags: ['Обед', 'Говядина', 'Русская кухня', 'Без лактозы'],
    equipment: ['Сковорода с крышкой', 'Кастрюля'],
    isBatchable: true,
    batchLabel: 'Котлеты на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_beef_mince',
    baseIngredients: [
      { id: 'ing_beef_mince', name: 'Фарш говяжий охлажденный', gramsPerPerson: 160, category: 'Мясо и птица' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 180, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Формовка и обжарка котлет',
        instruction: 'Фарш посолите, поперчите, отбейте об ладони и сформируйте котлеты. Обжарьте на сковороде по 4 минуты с каждой стороны.',
        durationSec: 480,
        heat: 'Средний огонь (6 из 9)',
        visualMarker: 'Плотная румяная корочка с обеих сторон.',
        chefTip: 'Отбивание фарша делает котлеты сочными без добавления хлеба.'
      },
      {
        stepNumber: 2,
        title: 'Варка картофеля',
        instruction: 'Картофель отварите в подсоленной воде 18 минут. Подавайте с сочными горячими котлетами и укропом.',
        durationSec: 1080,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Картофель рассыпчатый и мягкий.',
        chefTip: 'Классическое сытное русское второе блюдо.'
      }
    ]
  },
  {
    id: 'rec_buckwheat_merchant_chicken',
    title: 'Гречка по-купечески с кусочками филе цыпленка',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 25,
    calories: 410,
    proteins: 38,
    fats: 9,
    carbs: 45,
    tags: ['Обед', 'Птица', 'Русская кухня', 'Без лактозы', 'Без глютена'],
    equipment: ['Глубокая сковорода или сотейник'],
    isBatchable: true,
    batchLabel: 'Блюдо на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_chicken_breast',
    baseIngredients: [
      { id: 'ing_chicken_breast', name: 'Филе цыпленка кубиком', gramsPerPerson: 160, category: 'Мясо и птица' },
      { id: 'ing_buckwheat', name: 'Гречневая крупа ядрица', gramsPerPerson: 75, category: 'Бакалея' },
      { id: 'ing_carrots', name: 'Морковь соломкой', gramsPerPerson: 50, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Обжаривание курицы и моркови',
        instruction: 'Кусочки цыпленка обжарьте с морковью 4 минуты на сильном огне до побеления мяса.',
        durationSec: 240,
        heat: 'Сильный огонь (7 из 9)',
        visualMarker: 'Мясо подрумянилось со всех сторон.',
        chefTip: 'Быстрая обжарка запечатывает сок.'
      },
      {
        stepNumber: 2,
        title: 'Томление гречки в соке',
        instruction: 'Всыпьте промытую гречку, залейте 160 мл горячей воды, посолите. Накройте крышкой и томите 16 минут на тихом огне.',
        durationSec: 960,
        heat: 'Тихий огонь (2 из 9)',
        visualMarker: 'Вода полностью впиталась, гречка стала рассыпчатой и ароматной.',
        chefTip: 'Гречка пропитывается мясным соком без добавления жира.'
      }
    ]
  },
  {
    id: 'rec_wok_rice',
    title: 'Жареный рис «Wok Style» со сквозным гарниром и яйцом',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 15,
    calories: 420,
    proteins: 16,
    fats: 11,
    carbs: 64,
    tags: ['Обед', 'Сквозной гарнир', 'Быстро', 'Без лактозы'],
    equipment: ['Сковорода или вок', 'Лопатка'],
    isBatchable: false,
    batchLabel: 'Сквозной рис',
    chainRole: 'consumer',
    linkedIngredient: 'ing_rice',
    baseIngredients: [
      { id: 'ing_rice', name: 'Отварной рис (вчерашняя заготовка)', gramsPerPerson: 150, category: 'Бакалея', isSharedSide: true },
      { id: 'ing_eggs', name: 'Яйца куриные С1', gramsPerPerson: 50, category: 'Яйца' },
      { id: 'ing_carrots', name: 'Морковь соломкой', gramsPerPerson: 40, category: 'Овощи и зелень' },
      { id: 'ing_soya', name: 'Соевый соус', gramsPerPerson: 15, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Обжарка яйца и риса',
        instruction: 'На раскаленной сковороде быстро обжарьте яйцо, всыпьте вчерашний рис и морковь. Жарьте 3 минуты, влейте ложку соевого соуса.',
        durationSec: 240,
        heat: 'Сильный огонь (7 из 9)',
        visualMarker: 'Аппетитное потрескивание зерен и ровный карамельный цвет.',
        chefTip: 'Сквозной рис из холодильника сэкономил 25 минут варки!'
      }
    ]
  },
  {
    id: 'rec_tuna_pasta',
    title: 'Паста с тунцом, томатами и свежей зеленью',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 18,
    calories: 410,
    proteins: 34,
    fats: 8,
    carbs: 48,
    tags: ['Рыба', 'Паста', 'Быстро', 'Без лактозы'],
    equipment: ['Кастрюля 2.5 л', 'Сковорода'],
    isBatchable: false,
    batchLabel: 'Быстрый обед',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_canned_tuna', name: 'Тунец в с/с (банка)', gramsPerPerson: 120, category: 'Рыба и морепродукты' },
      { id: 'ing_pasta_penne', name: 'Паста пенне', gramsPerPerson: 75, category: 'Бакалея' },
      { id: 'ing_tomatoes', name: 'Томаты свежие', gramsPerPerson: 80, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежая зелень', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка пасты и сборка соуса',
        instruction: 'Сварите пенне 9 минут аль-денте. На сковороде прогрейте томаты кубиком 2 минуты, добавьте тунца и перемешайте с пастой.',
        durationSec: 540,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Соус равномерно обволакивает пасту.',
        chefTip: 'Чистый тунцовый белок без лишнего жира.'
      }
    ]
  },

  // ===================== УЖИНЫ =====================
  {
    id: 'rec_turkey_dinner',
    title: 'Запеченное филе индейки с травами и рисом',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 35,
    calories: 410,
    proteins: 46,
    fats: 12,
    carbs: 28,
    tags: ['Птица', 'Высокий белок', 'Без лактозы'],
    equipment: ['Форма для запекания', 'Кастрюля 2 л', 'Доска'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_turkey_breast',
    baseIngredients: [
      { id: 'ing_turkey_breast', name: 'Филе грудки индейки', gramsPerPerson: 180, category: 'Мясо и птица' },
      { id: 'ing_rice', name: 'Рис жасмин (отварной)', gramsPerPerson: 80, category: 'Бакалея', isSharedSide: true },
      { id: 'ing_broccoli', name: 'Брокколи свежая', gramsPerPerson: 120, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка риса с запасом на завтра',
        instruction: 'Сварите двойную порцию риса под крышкой 12 минут. Половину отложите в контейнер на завтрашний обед!',
        durationSec: 720,
        heat: 'Слабый огонь (2 из 9)',
        visualMarker: 'Вода впиталась, рис рассыпчатый.',
        chefTip: 'Сквозной рис сэкономит полчаса завтра.'
      },
      {
        stepNumber: 2,
        title: 'Запекание индейки и брокколи',
        instruction: 'Филе натрите солью и специями, запекайте с брокколи при 190°C 22 минуты.',
        durationSec: 1320,
        heat: 'Духовка 190°C',
        visualMarker: 'Сок прозрачный, мясо нежное и сочное.',
        chefTip: 'Дайте мясу отдохнуть 4 минуты перед нарезкой.'
      }
    ]
  },
  {
    id: 'rec_chicken_fillet',
    title: 'Запеченное филе цыпленка с картофелем по-деревенски',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 35,
    calories: 430,
    proteins: 44,
    fats: 13,
    carbs: 34,
    tags: ['Птица', 'Без лактозы', 'Без глютена'],
    equipment: ['Противень', 'Пергамент'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_chicken_breast',
    baseIngredients: [
      { id: 'ing_chicken_breast', name: 'Филе цыпленка охлажденное', gramsPerPerson: 190, category: 'Мясо и птица' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 180, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Запекание цыпленка и картофеля',
        instruction: 'Картофель нарежьте дольками, мясо — стейками. Посыпьте солью и паприкой. Запекайте 25 минут при 200°C.',
        durationSec: 1500,
        heat: 'Духовка 200°C',
        visualMarker: 'Румяные дольки картофеля и сочное мясо.',
        chefTip: 'Вторая часть филе пойдет на легкий суп.'
      }
    ]
  },
  {
    id: 'rec_baked_cod',
    title: 'Филе мурманской трески с картофелем и укропом',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 28,
    calories: 340,
    proteins: 36,
    fats: 6,
    carbs: 32,
    tags: ['Рыба', 'Легкое', 'Без мяса', 'Без лактозы'],
    equipment: ['Форма для запекания'],
    isBatchable: true,
    batchLabel: 'Рыбный день',
    chainRole: 'initiator',
    linkedIngredient: 'ing_cod_fillet',
    baseIngredients: [
      { id: 'ing_cod_fillet', name: 'Филе трески охлажденное', gramsPerPerson: 180, category: 'Рыба и морепродукты' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 160, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Запекание рыбы',
        instruction: 'Выложите треску и тонкие ломтики картофеля в форму, посыпьте укропом. Запекайте 20 минут при 180°C.',
        durationSec: 1200,
        heat: 'Духовка 180°C',
        visualMarker: 'Мякоть рыбы расслаивается вилкой на сочные лепестки.',
        chefTip: 'Диетическая белая рыба богата фосфором.'
      }
    ]
  },
  {
    id: 'rec_stewed_cabbage_beef',
    title: 'Тушеная капуста с говядиной по-русски',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 35,
    calories: 370,
    proteins: 35,
    fats: 14,
    carbs: 22,
    tags: ['Ужин', 'Говядина', 'Русская кухня', 'Без лактозы'],
    equipment: ['Сотейник с крышкой'],
    isBatchable: true,
    batchLabel: 'Рагу на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_beef_stew',
    baseIngredients: [
      { id: 'ing_beef_stew', name: 'Говядина отборная', gramsPerPerson: 160, category: 'Мясо и птица' },
      { id: 'ing_cabbage', name: 'Капуста белокочанная', gramsPerPerson: 180, category: 'Овощи и зелень' },
      { id: 'ing_carrots', name: 'Морковь фермерская', gramsPerPerson: 50, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Томление мяса и капусты',
        instruction: 'Мясо нарежьте брусочками, обжарьте 5 минут. Добавьте нашинкованную капусту, морковь, 60 мл воды и тушите 25 минут под крышкой.',
        durationSec: 1500,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Капуста стала карамельно-нежной, мясо мягкое.',
        chefTip: 'Сытный низкоуглеводный традиционный ужин.'
      }
    ]
  },

  // ===================== ПЕРЕКУСЫ =====================
  {
    id: 'rec_curd_parfait',
    title: 'Творожно-ягодный десертный парфе',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'snack',
    courseType: 'snack',
    prepTimeMin: 10,
    calories: 220,
    proteins: 18,
    fats: 4,
    carbs: 26,
    tags: ['Перекус', 'Творог', 'Zero-Waste'],
    equipment: ['Блендер', 'Стакан'],
    isBatchable: false,
    batchLabel: 'Остаток творога',
    chainRole: 'consumer',
    linkedIngredient: 'ing_curd_5',
    baseIngredients: [
      { id: 'ing_curd_5', name: 'Творог 5% (остаток пачки)', gramsPerPerson: 90, category: 'Молочные продукты' },
      { id: 'ing_berries', name: 'Ягоды свежие/мороженые', gramsPerPerson: 60, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Взбивание творожного суфле',
        instruction: 'Взбейте блендером творог с 1 ст. л. теплой воды до консистенции крема, выложите слоями с ягодами.',
        durationSec: 180,
        visualMarker: 'Нежные контрастные белые и рубиновые слои.',
        chefTip: 'Пачка творога израсходована до последнего грамма.'
      }
    ]
  },
  {
    id: 'rec_baked_apple',
    title: 'Печеное яблоко с корицей и капелькой меда',
    imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'snack',
    courseType: 'snack',
    prepTimeMin: 15,
    calories: 140,
    proteins: 2,
    fats: 1,
    carbs: 32,
    tags: ['Перекус', 'Постное', 'Без лактозы', 'Без глютена'],
    equipment: ['Форма для запекания'],
    isBatchable: false,
    batchLabel: 'Легкий десерт',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_apples', name: 'Яблоки сезонные', gramsPerPerson: 160, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Запекание яблока',
        instruction: 'Удалите семенную коробочку, запекайте 12 минут при 180°C.',
        durationSec: 240,
        visualMarker: 'Мякоть мягкая и источает яблочно-медовый аромат.',
        chefTip: 'Натуральный десерт с пектином.'
      }
    ]
  }
];

const PANTRY_ID_MAP = {
  ing_oil: 'pantry_oil',
  ing_flour: 'pantry_flour',
  ing_sugar: 'pantry_sugar',
  ing_soya: 'pantry_soya',
  ing_salt: 'pantry_salt',
  ing_pepper: 'pantry_pepper',
  ing_butter: 'pantry_butter',
  ing_garlic: 'pantry_garlic',
  ing_spices: 'pantry_spices'
};

const FACTORY_PACKS = {
  ing_turkey_breast: { name: 'Филе индейки охл.', packWeight: 800, unit: 'г', storageDays: 3, category: 'Мясо и птица', isByWeight: false },
  ing_chicken_breast: { name: 'Филе цыпленка охл.', packWeight: 850, unit: 'г', storageDays: 4, category: 'Мясо и птица', isByWeight: false },
  ing_beef_stew: { name: 'Говядина лоток', packWeight: 700, unit: 'г', storageDays: 4, category: 'Мясо и птица', isByWeight: false },
  ing_beef_mince: { name: 'Фарш говяжий охлажденный', packWeight: 400, unit: 'г', storageDays: 3, category: 'Мясо и птица', isByWeight: false },
  ing_cod_fillet: { name: 'Филе трески охл./зам.', packWeight: 600, unit: 'г', storageDays: 3, category: 'Рыба и морепродукты', isByWeight: false },
  ing_canned_tuna: { name: 'Тунец в с/с банка', packWeight: 185, unit: 'г', storageDays: 360, category: 'Рыба и морепродукты', isByWeight: false },
  ing_curd_5: { name: 'Творог 5% пачка', packWeight: 360, unit: 'г', storageDays: 4, category: 'Молочные продукты', isByWeight: false },
  // Яйца - строго отдельная категория "Яйца", не молочка!
  ing_eggs: { name: 'Яйца куриные С1 десяток', packWeight: 10, unit: 'шт', storageDays: 25, category: 'Яйца', isByWeight: false },
  ing_milk: { name: 'Молоко 2.5% бутылка', packWeight: 930, unit: 'мл', storageDays: 6, category: 'Молочные продукты', isByWeight: false },
  ing_sour_cream: { name: 'Сметана 15% стакан', packWeight: 300, unit: 'г', storageDays: 10, category: 'Молочные продукты', isByWeight: false },
  ing_rice: { name: 'Рис Жасмин упаковка', packWeight: 800, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_buckwheat: { name: 'Гречневая крупа ядрица', packWeight: 800, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_millet: { name: 'Пшено шлифованное пачка', packWeight: 800, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_lentils: { name: 'Чечевица красная пачка', packWeight: 450, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_pasta_penne: { name: 'Паста пенне пачка', packWeight: 450, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_noodles: { name: 'Лапша яичная пачка', packWeight: 400, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_oats: { name: 'Овсяные хлопья коробка', packWeight: 500, unit: 'г', storageDays: 180, category: 'Бакалея', isByWeight: false },
  ing_oil: { name: 'Масло растительное / оливковое', packWeight: 800, unit: 'мл', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_flour: { name: 'Мука пшеничная в/с', packWeight: 1000, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_sugar: { name: 'Сахар-песок пачка', packWeight: 1000, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_soya: { name: 'Соус соевый классический', packWeight: 250, unit: 'мл', storageDays: 180, category: 'Бакалея', isByWeight: false },
  ing_cabbage: { name: 'Капуста белокочанная (развес)', packWeight: 1000, unit: 'г', storageDays: 20, category: 'Овощи и зелень', isByWeight: true },
  ing_beets: { name: 'Свекла свежая (развес)', packWeight: 1000, unit: 'г', storageDays: 25, category: 'Овощи и зелень', isByWeight: true },
  ing_broccoli: { name: 'Брокколи свежая (развес)', packWeight: 1000, unit: 'г', storageDays: 5, category: 'Овощи и зелень', isByWeight: true },
  ing_potatoes: { name: 'Картофель (на развес)', packWeight: 1000, unit: 'г', storageDays: 30, category: 'Овощи и зелень', isByWeight: true },
  ing_carrots: { name: 'Морковь мытая (на развес)', packWeight: 1000, unit: 'г', storageDays: 20, category: 'Овощи и зелень', isByWeight: true },
  ing_tomatoes: { name: 'Томаты свежие (на развес)', packWeight: 1000, unit: 'г', storageDays: 7, category: 'Овощи и зелень', isByWeight: true },
  ing_pumpkin: { name: 'Тыква свежая (на развес)', packWeight: 1000, unit: 'г', storageDays: 30, category: 'Овощи и зелень', isByWeight: true },
  ing_apples: { name: 'Яблоки сезонные (на развес)', packWeight: 1000, unit: 'г', storageDays: 14, category: 'Овощи и зелень', isByWeight: true },
  ing_dill: { name: 'Укроп пучок', packWeight: 70, unit: 'г', storageDays: 6, category: 'Овощи и зелень', isByWeight: false },
  ing_berries: { name: 'Ягоды шоковой заморозки', packWeight: 300, unit: 'г', storageDays: 180, category: 'Овощи и зелень', isByWeight: false }
};

const RETAIL_NETWORKS = [
  {
    id: 'budget',
    name: 'Магнит / Пятёрочка',
    tier: 'Бюджет',
    color: 'amber',
    multiplier: 0.88,
    badge: 'Эконом'
  },
  {
    id: 'standard',
    name: 'Перекрёсток / Лента',
    tier: 'Стандарт',
    color: 'emerald',
    multiplier: 1.0,
    badge: 'Баланс'
  },
  {
    id: 'premium',
    name: 'ВкусВилл',
    tier: 'Премиум / ЗОЖ',
    color: 'teal',
    multiplier: 1.28,
    badge: 'Премиум'
  }
];

const BASE_ITEM_PRICES = {
  ing_turkey_breast: 440,
  ing_chicken_breast: 380,
  ing_beef_stew: 590,
  ing_beef_mince: 275,
  ing_cod_fillet: 430,
  ing_canned_tuna: 180,
  ing_curd_5: 145,
  ing_eggs: 125,
  ing_milk: 88,
  ing_sour_cream: 95,
  ing_rice: 135,
  ing_buckwheat: 98,
  ing_millet: 85,
  ing_lentils: 115,
  ing_pasta_penne: 95,
  ing_noodles: 110,
  ing_oats: 92,
  ing_oil: 130,
  ing_flour: 85,
  ing_sugar: 75,
  ing_soya: 115,
  ing_cabbage: 42,
  ing_beets: 45,
  ing_broccoli: 290,
  ing_potatoes: 58,
  ing_carrots: 49,
  ing_tomatoes: 230,
  ing_pumpkin: 89,
  ing_apples: 125,
  ing_dill: 55,
  ing_berries: 195
};

const CITY_COEFFICIENTS = {
  SPB: { name: 'Санкт-Петербург (Пилот)', factor: 1.0 },
  MSK: { name: 'Москва', factor: 1.08 },
  NN: { name: 'Нижний Новгород', factor: 0.94 }
};

const DEFAULT_PANTRY_ITEMS = [
  { id: 'pantry_oil', name: 'Растительное / Оливковое масло', checked: true },
  { id: 'pantry_salt', name: 'Соль поваренная', checked: true },
  { id: 'pantry_pepper', name: 'Черный молотый перец', checked: true },
  { id: 'pantry_butter', name: 'Сливочное масло 82.5%', checked: true },
  { id: 'pantry_garlic', name: 'Чеснок свежий / сушеный', checked: true },
  { id: 'pantry_sugar', name: 'Сахар / подсластитель', checked: true },
  { id: 'pantry_flour', name: 'Мука пшеничная / рисовая', checked: true },
  { id: 'pantry_soya', name: 'Соевый соус', checked: true },
  { id: 'pantry_spices', name: 'Базовые сухие специи и травы', checked: true }
];

function isDishAllowed(recipe, exclusionsList) {
  if (!recipe || !exclusionsList || exclusionsList.length === 0) return true;

  for (const excl of exclusionsList) {
    const raw = excl.toLowerCase().replace('без ', '').trim();
    if (!raw) continue;

    // ЛАКТОЗА (молоко, творог, сыр, сметана, сливки). Яйца НЕ содержат лактозу!
    if (raw.includes('лактоз')) {
      const lactoseKeywords = ['молок', 'творог', 'сметан', 'сыр', 'сливочн', 'сливк', 'йогурт', 'кефир'];
      const hasLactose = recipe.baseIngredients.some(i => {
        const name = i.name.toLowerCase();
        // Защита яиц от ложного срабатывания
        if (name.includes('яйц') || i.id === 'ing_eggs' || i.category === 'Яйца') return false;
        if (i.category === 'Молочные продукты') return true;
        return lactoseKeywords.some(kw => name.includes(kw));
      });
      if (hasLactose || recipe.title.toLowerCase().includes('творог') || recipe.title.toLowerCase().includes('сырник')) {
        return false;
      }
    }
    // Свинина
    else if (raw.includes('свинин')) {
      if (recipe.title.toLowerCase().includes('свинин')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('свинин'))) return false;
    }
    // Говядина
    else if (raw.includes('говяд')) {
      if (recipe.title.toLowerCase().includes('говяд') || recipe.title.toLowerCase().includes('строганов') || recipe.title.toLowerCase().includes('котлет')) {
        if (recipe.baseIngredients.some(i => i.id.includes('beef') || i.name.toLowerCase().includes('говяд'))) return false;
      }
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('говяд') || i.id.includes('beef'))) return false;
    }
    // Индейка
    else if (raw.includes('индейк')) {
      if (recipe.title.toLowerCase().includes('индейк')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('индейк') || i.id.includes('turkey'))) return false;
    }
    // Курица / Цыпленок
    else if (raw.includes('куриц') || raw.includes('цыплен')) {
      if (recipe.title.toLowerCase().includes('куриц') || recipe.title.toLowerCase().includes('цыплен')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('цыплен') || i.name.toLowerCase().includes('куриц') || i.id.includes('chicken'))) return false;
    }
    // Рыба
    else if (raw.includes('рыб') || raw.includes('треск') || raw.includes('тунец') || raw.includes('уха')) {
      if (recipe.title.toLowerCase().includes('треск') || recipe.title.toLowerCase().includes('тунец') || recipe.title.toLowerCase().includes('рыб') || recipe.title.toLowerCase().includes('уха')) return false;
      if (recipe.baseIngredients.some(i => i.category === 'Рыба и морепродукты')) return false;
    }
    // Печень
    else if (raw.includes('печен')) {
      if (recipe.title.toLowerCase().includes('печен')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('печен'))) return false;
    }
    // Грибы
    else if (raw.includes('гриб') || raw.includes('шампиньон')) {
      if (recipe.title.toLowerCase().includes('гриб') || recipe.title.toLowerCase().includes('шампиньон')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('гриб') || i.name.toLowerCase().includes('шампиньон'))) return false;
    }
    // Лук
    else if (raw.includes('лук')) {
      if (recipe.title.toLowerCase().includes('лук')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('лук'))) return false;
    }
    // Чеснок
    else if (raw.includes('чеснок')) {
      if (recipe.title.toLowerCase().includes('чеснок')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('чеснок'))) return false;
    }
    // Гречка
    else if (raw.includes('гречк')) {
      if (recipe.title.toLowerCase().includes('гречк')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('гречк'))) return false;
    }
    // Кускус
    else if (raw.includes('кускус')) {
      if (recipe.title.toLowerCase().includes('кускус')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('кускус'))) return false;
    }
    // Болгарский перец
    else if (raw.includes('болгарск') || raw.includes('перец')) {
      if (recipe.title.toLowerCase().includes('болгарск') || recipe.title.toLowerCase().includes('сладкий перец')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('болгарск') || i.name.toLowerCase().includes('сладкий перец'))) return false;
    }
    // Глютен
    else if (raw.includes('глютен')) {
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('мука') || i.name.toLowerCase().includes('лапша') || i.name.toLowerCase().includes('паста') || i.name.toLowerCase().includes('пенне'))) return false;
    }
    // Пользовательские ограничения
    else {
      if (recipe.title.toLowerCase().includes(raw)) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes(raw))) return false;
    }
  }
  return true;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('planner');
  const [city, setCity] = useState('SPB');
  const [daysCount, setDaysCount] = useState(5);
  const [peopleCount, setPeopleCount] = useState(2);
  const [mealTypes, setMealTypes] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: false
  });
  
  const [lunchMode, setLunchMode] = useState('both');
  // Исправление 1: Никаких авто-выбранных исключений при старте!
  const [exclusions, setExclusions] = useState([]);
  const [customExclusion, setCustomExclusion] = useState('');
  const [pantryList, setPantryList] = useState(DEFAULT_PANTRY_ITEMS);
  const [batchCookingEnabled, setBatchCookingEnabled] = useState(true);
  const [weightedProduceEnabled, setWeightedProduceEnabled] = useState(true);

  const [menuDays, setMenuDays] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeCookingRecipe, setActiveCookingRecipe] = useState(null);
  const [swapModalState, setSwapModalState] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeStoreTier, setActiveStoreTier] = useState('standard');
  const [toastMessage, setToastMessage] = useState(null);
  const [checkedBasketItems, setCheckedBasketItems] = useState({});

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
      try {
        tg.enableClosingConfirmation();
      } catch (e) {
        // Поддерживается в Telegram WebApp 6.2+
      }
    }
  }, []);

  // Синхронизация нативной кнопки Telegram "Назад" с активными модальными окнами
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg || !tg.BackButton) return;

    if (activeCookingRecipe || swapModalState || lightboxImage) {
      tg.BackButton.show();
      const handleBack = () => {
        triggerHaptic('light');
        if (lightboxImage) setLightboxImage(null);
        else if (activeCookingRecipe) setActiveCookingRecipe(null);
        else if (swapModalState) setSwapModalState(null);
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton.offClick(handleBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [activeCookingRecipe, swapModalState, lightboxImage]);

  // Исправление 3: Надежный сброс скролла на самый верх при смене вкладок
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [currentTab]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const generateZeroWasteMenu = (shouldSwitchTab = false) => {
    const generated = [];
    const allowedRecipes = MASTER_RECIPES.filter(r => isDishAllowed(r, exclusions));

    const getRecipesFor = (mType, cType, isFirstDay = false) => {
      // 1. Строгий поиск по приему пищи, подтипу и цепочке утилизации
      let filtered = allowedRecipes.filter(r => {
        if (r.mealType !== mType) return false;
        if (cType && r.courseType !== cType) return false;
        if (isFirstDay && r.chainRole === 'consumer') return false;
        return true;
      });

      // 2. Если для обеда не найден подтип (суп или второе), берем любое разрешенное блюдо обеда
      if (filtered.length === 0 && cType) {
        filtered = allowedRecipes.filter(r => {
          if (r.mealType !== mType) return false;
          if (isFirstDay && r.chainRole === 'consumer') return false;
          return true;
        });
      }

      // 3. Если блюд мало, снимаем ограничение первого дня, но СТРОГО в рамках allowedRecipes!
      if (filtered.length === 0) {
        filtered = allowedRecipes.filter(r => r.mealType === mType);
      }

      // 4. Если категория пуста (экстремальные фильтры), берем любое безопасное блюдо из разрешенных
      if (filtered.length === 0) {
        filtered = allowedRecipes;
      }

      return filtered;
    };

    const bList = getRecipesFor('breakfast', null, false);
    const soups = getRecipesFor('lunch', 'soup', false);
    const mains = getRecipesFor('lunch', 'main', false);
    const dList = getRecipesFor('dinner', 'main', false);
    const sList = getRecipesFor('snack', null, false);

    const bListDay1 = getRecipesFor('breakfast', null, true);
    const soupsDay1 = getRecipesFor('lunch', 'soup', true);
    const mainsDay1 = getRecipesFor('lunch', 'main', true);
    const dListDay1 = getRecipesFor('dinner', 'main', true);
    
    for (let day = 1; day <= daysCount; day++) {
      const isDay1 = day === 1;
      const dayMeals = {};
      
      const currentB = isDay1 && bListDay1.length > 0 ? bListDay1 : bList;
      const currentSoups = isDay1 && soupsDay1.length > 0 ? soupsDay1 : soups;
      const currentMains = isDay1 && mainsDay1.length > 0 ? mainsDay1 : mains;
      const currentD = isDay1 && dListDay1.length > 0 ? dListDay1 : dList;

      if (mealTypes.breakfast && currentB.length > 0) {
        dayMeals.breakfast = currentB[(day - 1) % currentB.length];
      }

      if (mealTypes.lunch) {
        if (lunchMode === 'first_only' && currentSoups.length > 0) {
          dayMeals.lunch_soup = currentSoups[(day - 1) % currentSoups.length];
        } else if (lunchMode === 'second_only' && currentMains.length > 0) {
          dayMeals.lunch_main = currentMains[(day - 1) % currentMains.length];
        } else if (lunchMode === 'both') {
          if (currentSoups.length > 0) dayMeals.lunch_soup = currentSoups[(day - 1) % currentSoups.length];
          if (currentMains.length > 0) dayMeals.lunch_main = currentMains[(day - 1) % currentMains.length];
        }
      }

      if (mealTypes.dinner && currentD.length > 0) {
        dayMeals.dinner = currentD[(day - 1) % currentD.length];
      }

      if (mealTypes.snack && sList.length > 0) {
        dayMeals.snack = sList[(day - 1) % sList.length];
      }

      generated.push({
        dayNumber: day,
        meals: dayMeals
      });
    }

    setMenuDays(generated);
    setActiveDayIndex(0);

    if (shouldSwitchTab) {
      triggerHaptic('success');
      setCurrentTab('menu');
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      }, 50);
      showToast('✨ Сбалансированное меню сформировано!');
    }
  };

  useEffect(() => {
    generateZeroWasteMenu(false);
  }, [lunchMode, daysCount, peopleCount, exclusions, mealTypes]);

  const basketAnalysis = useMemo(() => {
    const rawDemand = {};

    menuDays.forEach((dayObj) => {
      Object.values(dayObj.meals).forEach((recipe) => {
        if (!recipe) return;
        recipe.baseIngredients.forEach((ing) => {
          if (ing.isPantry) {
            const mappedPantryId = PANTRY_ID_MAP[ing.id];
            if (mappedPantryId) {
              const pantryRecord = pantryList.find(p => p.id === mappedPantryId);
              if (pantryRecord && pantryRecord.checked) {
                return;
              }
            }
          }
          const grams = ing.gramsPerPerson * peopleCount;
          rawDemand[ing.id] = (rawDemand[ing.id] || 0) + grams;
        });
      });
    });

    const packedItems = [];
    const cityFactor = CITY_COEFFICIENTS[city]?.factor || 1.0;

    Object.entries(rawDemand).forEach(([ingId, requiredGrams]) => {
      const packInfo = FACTORY_PACKS[ingId] || {
        name: ingId,
        packWeight: 500,
        unit: 'г',
        storageDays: 5,
        category: 'Бакалея',
        isByWeight: false
      };

      const isWeighted = weightedProduceEnabled && !!packInfo.isByWeight;
      let packCount = 1;
      let totalBought = 0;
      let leftover = 0;
      let basePriceTotal = 0;
      const basePrice = BASE_ITEM_PRICES[ingId] || 120;

      if (isWeighted) {
        totalBought = Math.ceil(requiredGrams / 50) * 50;
        leftover = Math.max(0, totalBought - Math.round(requiredGrams));
        packCount = 1;
        basePriceTotal = (basePrice * totalBought) / 1000;
      } else {
        packCount = Math.ceil(requiredGrams / packInfo.packWeight);
        totalBought = packCount * packInfo.packWeight;
        leftover = totalBought - requiredGrams;
        basePriceTotal = basePrice * packCount;
      }

      packedItems.push({
        id: ingId,
        name: packInfo.name,
        category: packInfo.category,
        unit: packInfo.unit,
        packWeight: packInfo.packWeight,
        requiredGrams: Math.round(requiredGrams),
        packCount,
        totalBought,
        leftover: Math.round(leftover),
        storageDays: packInfo.storageDays,
        basePriceTotal: Math.round(basePriceTotal),
        isWeighted
      });
    });

    const storeTotals = {};
    RETAIL_NETWORKS.forEach((store) => {
      const sum = packedItems.reduce((acc, item) => {
        return acc + item.basePriceTotal * store.multiplier * cityFactor;
      }, 0);
      storeTotals[store.id] = Math.round(sum);
    });

    return { rawDemand, packedItems, storeTotals };
  }, [menuDays, peopleCount, city, pantryList, weightedProduceEnabled]);

  const handleSwapRecipe = (dayIndex, mealKey, newRecipe) => {
    triggerHaptic('medium');
    const updated = [...menuDays];
    updated[dayIndex].meals[mealKey] = newRecipe;
    setMenuDays(updated);
    setSwapModalState(null);
    showToast(`Блюдо заменено на «${newRecipe.title}»`);
  };

  const handleSmartAutoSwap = (dayIndex, mealKey) => {
    triggerHaptic('light');
    const current = menuDays[dayIndex].meals[mealKey];
    const isFirstDay = dayIndex === 0;
    const targetMealType = mealKey.startsWith('lunch') ? 'lunch' : mealKey;
    const targetCourse = mealKey === 'lunch_soup' ? 'soup' : mealKey === 'lunch_main' ? 'main' : null;

    const candidates = MASTER_RECIPES.filter(r => {
      if (r.id === current.id) return false;
      if (isFirstDay && r.chainRole === 'consumer') return false;
      if (!isDishAllowed(r, exclusions)) return false;
      if (targetMealType === 'lunch') {
        if (r.mealType !== 'lunch') return false;
        if (targetCourse && r.courseType !== targetCourse) return false;
        return true;
      }
      return r.mealType === targetMealType;
    });

    if (candidates.length > 0) {
      handleSwapRecipe(dayIndex, mealKey, candidates[0]);
    } else {
      triggerHaptic('warning');
      showToast('Нет подходящих замен с учетом текущих исключений');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white font-sans antialiased">
      <div className="w-full max-w-md bg-slate-900/90 min-h-screen flex flex-col border-x border-slate-800 shadow-2xl relative pb-20">
        
        {/* Верхняя шапка Telegram */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Icons.Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Zero-Waste Meal Planner
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  TMA
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {CITY_COEFFICIENTS[city]?.name} • {daysCount} дн. • {peopleCount} чел.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <select
              value={city}
              onChange={(e) => {
                triggerHaptic('light');
                setCity(e.target.value);
              }}
              aria-label="Выбор города"
              className="bg-slate-800 text-[11px] text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none font-medium cursor-pointer"
            >
              <option value="SPB">СПб</option>
              <option value="MSK">МСК</option>
              <option value="NN">НН</option>
            </select>
          </div>
        </header>

        {/* Всплывающее уведомление (Toast) */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-emerald-400/30 transition-all flex items-center gap-2">
            <Icons.Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Навигация по вкладкам и основной скролл-контейнер */}
        <main ref={scrollContainerRef} className="flex-1 pb-24 overflow-y-auto">
          {currentTab === 'planner' && (
            <PlannerView
              daysCount={daysCount}
              setDaysCount={setDaysCount}
              peopleCount={peopleCount}
              setPeopleCount={setPeopleCount}
              mealTypes={mealTypes}
              setMealTypes={setMealTypes}
              lunchMode={lunchMode}
              setLunchMode={setLunchMode}
              exclusions={exclusions}
              setExclusions={setExclusions}
              customExclusion={customExclusion}
              setCustomExclusion={setCustomExclusion}
              pantryList={pantryList}
              setPantryList={setPantryList}
              batchCookingEnabled={batchCookingEnabled}
              setBatchCookingEnabled={setBatchCookingEnabled}
              weightedProduceEnabled={weightedProduceEnabled}
              setWeightedProduceEnabled={setWeightedProduceEnabled}
              onGenerate={() => generateZeroWasteMenu(true)}
            />
          )}

          {currentTab === 'menu' && (
            <MenuView
              menuDays={menuDays}
              activeDayIndex={activeDayIndex}
              setActiveDayIndex={setActiveDayIndex}
              peopleCount={peopleCount}
              onOpenImage={(url, title) => setLightboxImage({ url, title })}
              onCookRecipe={(recipe) => {
                triggerHaptic('light');
                setActiveCookingRecipe(recipe);
              }}
              onInitiateSwap={(dayIndex, mealKey, recipe) => {
                triggerHaptic('light');
                setSwapModalState({ dayIndex, mealKey, recipe });
              }}
              onSmartAutoSwap={handleSmartAutoSwap}
              onGoToBasket={() => {
                triggerHaptic('light');
                setCurrentTab('basket');
              }}
            />
          )}

          {currentTab === 'basket' && (
            <BasketView
              packedItems={basketAnalysis.packedItems}
              storeTotals={basketAnalysis.storeTotals}
              activeStoreTier={activeStoreTier}
              setActiveStoreTier={setActiveStoreTier}
              checkedBasketItems={checkedBasketItems}
              setCheckedBasketItems={setCheckedBasketItems}
              peopleCount={peopleCount}
              daysCount={daysCount}
              city={city}
              showToast={showToast}
            />
          )}
        </main>

        {/* Модальное окно полноразмерного просмотра фото (Lightbox) */}
        {lightboxImage && (
          <ImageLightboxModal
            imageObj={lightboxImage}
            onClose={() => setLightboxImage(null)}
          />
        )}

        {/* Полноэкранный режим приготовления */}
        {activeCookingRecipe && (
          <CookingModal
            recipe={activeCookingRecipe}
            peopleCount={peopleCount}
            onClose={() => {
              triggerHaptic('light');
              setActiveCookingRecipe(null);
            }}
          />
        )}

        {/* Модальное окно замены блюда */}
        {swapModalState && (
          <SwapRecipeModal
            swapData={swapModalState}
            exclusions={exclusions}
            onClose={() => {
              triggerHaptic('light');
              setSwapModalState(null);
            }}
            onSelectRecipe={(recipe) => handleSwapRecipe(swapModalState.dayIndex, swapModalState.mealKey, recipe)}
          />
        )}

        {/* Нижняя панель навигации */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-2 flex items-center justify-around pointer-events-auto shadow-2xl">
            <button
              onClick={() => {
                triggerHaptic('light');
                setCurrentTab('planner');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                currentTab === 'planner' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.Calendar className="w-5 h-5" />
              <span className="text-[10px]">План</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setCurrentTab('menu');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                currentTab === 'menu' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.Utensils className="w-5 h-5" />
              <span className="text-[10px]">Меню</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setCurrentTab('basket');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                currentTab === 'basket' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.ShoppingBag className="w-5 h-5" />
              <span className="text-[10px]">Корзины</span>
              {basketAnalysis.packedItems.length > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-500 text-slate-950 font-black rounded-full text-[9px] flex items-center justify-center">
                  {basketAnalysis.packedItems.length}
                </span>
              )}
            </button>
          </div>
        </nav>

      </div>
    </div>
  );
}

function PlannerView({
  daysCount,
  setDaysCount,
  peopleCount,
  setPeopleCount,
  mealTypes,
  setMealTypes,
  lunchMode,
  setLunchMode,
  exclusions,
  setExclusions,
  customExclusion,
  setCustomExclusion,
  pantryList,
  setPantryList,
  batchCookingEnabled,
  setBatchCookingEnabled,
  weightedProduceEnabled,
  setWeightedProduceEnabled,
  onGenerate
}) {
  const commonExclusionChips = [
    'Без индейки',
    'Без курицы',
    'Без говядины',
    'Без рыбы',
    'Без печени',
    'Без грибов',
    'Без лука',
    'Без чеснока',
    'Без гречки',
    'Без кускуса',
    'Без болгарского перца',
    'Без свинины',
    'Без глютена',
    'Без лактозы'
  ];

  // Исправление 2: Объединяем стандартные и пользовательские исключения
  const allDisplayedChips = useMemo(() => {
    const list = [...commonExclusionChips];
    exclusions.forEach(ex => {
      if (!list.includes(ex)) {
        list.push(ex);
      }
    });
    return list;
  }, [exclusions]);

  const toggleExclusion = (tag) => {
    triggerHaptic('light');
    if (exclusions.includes(tag)) {
      setExclusions(exclusions.filter(t => t !== tag));
    } else {
      setExclusions([...exclusions, tag]);
    }
  };

  const removeExclusion = (tag, e) => {
    e.stopPropagation();
    triggerHaptic('light');
    setExclusions(exclusions.filter(t => t !== tag));
  };

  const addCustomExclusion = (e) => {
    e.preventDefault();
    if (!customExclusion.trim()) return;
    triggerHaptic('light');
    const cleaned = customExclusion.trim();
    const formatted = cleaned.toLowerCase().startsWith('без ')
      ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      : `Без ${cleaned.toLowerCase()}`;
    
    if (!exclusions.includes(formatted)) {
      setExclusions([...exclusions, formatted]);
    }
    setCustomExclusion('');
  };

  const togglePantry = (id) => {
    triggerHaptic('light');
    setPantryList(
      pantryList.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="p-4 space-y-5">
      {/* Баннер */}
      <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Обучающие рецепты с фото
          </span>
          <span className="text-[11px] text-slate-400 font-mono">100% Zero-Waste</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1">
          Меню с наглядными фото блюд
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Каждое блюдо снабжено аппетитными иллюстрациями и подробными пошаговыми инструкциями: температура плиты, размеры нарезки и маркеры готовности.
        </p>
      </div>

      {/* Селекторы дней и количества людей */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Период</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{daysCount} дн.</span>
          </div>
          <input
            type="range"
            min="1"
            max="14"
            value={daysCount}
            onChange={(e) => {
              triggerHaptic('light');
              setDaysCount(Number(e.target.value));
            }}
            aria-label="Период планирования в днях"
            className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1 день</span>
            <span>7 дн.</span>
            <span>14 дн.</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Персоны</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{peopleCount} чел.</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setPeopleCount(Math.max(1, peopleCount - 1));
              }}
              className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all text-xs"
            >
              -
            </button>
            <span className="text-xs font-bold font-mono text-slate-200">{peopleCount}</span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setPeopleCount(Math.min(10, peopleCount + 1));
              }}
              className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-500 active:scale-95 transition-all text-xs"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Выбор приемов пищи */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Приемы пищи в день
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'breakfast', label: 'Завтрак', time: '08:00 - 10:00' },
            { key: 'lunch', label: 'Обед', time: '13:00 - 15:00' },
            { key: 'dinner', label: 'Ужин', time: '19:00 - 21:00' },
            { key: 'snack', label: 'Перекус', time: '16:00 - 17:00' }
          ].map(m => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setMealTypes({ ...mealTypes, [m.key]: !mealTypes[m.key] });
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                mealTypes[m.key]
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <p className="text-xs font-semibold">{m.label}</p>
                <p className="text-[10px] text-slate-400">{m.time}</p>
              </div>
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                mealTypes[m.key] ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
              }`}>
                {mealTypes[m.key] && <Icons.Check className="w-3 h-3" />}
              </div>
            </button>
          ))}
        </div>

        {/* Формат обеда */}
        {mealTypes.lunch && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span>🍲</span> Формат обеда:
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">
                {lunchMode === 'first_only' ? 'Только 1-е' : lunchMode === 'second_only' ? 'Только 2-е' : '1-е и 2-е (Суп + Второе)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'first_only', label: 'Только 1-е', desc: 'Суп / бульон', icon: '🥣' },
                { id: 'second_only', label: 'Только 2-е', desc: 'Основное блюдо', icon: '🍛' },
                { id: 'both', label: '1-е и 2-е', desc: 'Суп + второе', icon: '🍲' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setLunchMode(opt.id);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                    lunchMode === opt.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold ring-1 ring-emerald-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs block">{opt.icon}</span>
                  <span className="text-[11px] block mt-0.5 leading-tight">{opt.label}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 opacity-80">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Исключения (Исправление 2: Наглядное отображение добавленных) */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Исключения и аллергены
          </label>
          {exclusions.length > 0 && (
            <span className="text-[10px] text-rose-400 font-mono font-semibold">
              Выбрано: {exclusions.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allDisplayedChips.map(tag => {
            const isSelected = exclusions.includes(tag);
            const isCustom = !commonExclusionChips.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleExclusion(tag)}
                className={`text-xs px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 font-semibold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tag}</span>
                {isCustom ? (
                  <span
                    onClick={(e) => removeExclusion(tag, e)}
                    className="text-rose-400 font-bold hover:text-white px-1 ml-0.5 bg-rose-900/30 rounded"
                    title="Удалить свое исключение"
                  >
                    ✕
                  </span>
                ) : (
                  isSelected && <span className="text-rose-400">✕</span>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={addCustomExclusion} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customExclusion}
            onChange={(e) => setCustomExclusion(e.target.value)}
            placeholder="Свой запрет (напр. кинза, майонез)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 font-medium"
          >
            Добавить
          </button>
        </form>
      </div>

      {/* Готовка на 2 дня */}
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0 pr-1">
          <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>🥘</span> Готовить на 2 дня (Batch Cooking)
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Супы и рагу готовятся сразу на 2 приема, сквозной рис на завтра
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setBatchCookingEnabled(!batchCookingEnabled);
          }}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
            batchCookingEnabled ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            batchCookingEnabled ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Весовые овощи */}
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0 pr-1">
          <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>⚖️</span> Овощи и фрукты на развес
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Взвешивание точного веса картофеля, моркови и яблок без принудительной покупки сеток
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setWeightedProduceEnabled(!weightedProduceEnabled);
          }}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
            weightedProduceEnabled ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            weightedProduceEnabled ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Кладовая (Pantry) */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Домашний склад (Pantry)
            </label>
            <p className="text-[10px] text-slate-400">
              Отметьте то, что есть дома — исключим из чека в магазине
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-bold">
            {pantryList.filter(p => p.checked).length}/{pantryList.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {pantryList.map(item => (
            <div
              key={item.id}
              onClick={() => togglePantry(item.id)}
              className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                item.checked
                  ? 'bg-slate-950 border-emerald-900/50 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
              }`}
            >
              <span>{item.name}</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                item.checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
              }`}>
                {item.checked && <Icons.Check className="w-3 h-3" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка формирования меню */}
      <button
        type="button"
        onClick={onGenerate}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Icons.Sparkles className="w-5 h-5" />
        <span>Сформировать меню с фотографиями</span>
      </button>
    </div>
  );
}

function MenuView({
  menuDays,
  activeDayIndex,
  setActiveDayIndex,
  peopleCount,
  onOpenImage,
  onCookRecipe,
  onInitiateSwap,
  onSmartAutoSwap,
  onGoToBasket
}) {
  const currentDay = menuDays[activeDayIndex] || menuDays[0];

  const dayTotals = useMemo(() => {
    if (!currentDay) return { cal: 0, p: 0, f: 0, c: 0 };
    return Object.values(currentDay.meals).reduce(
      (acc, r) => {
        if (!r) return acc;
        return {
          cal: acc.cal + r.calories,
          p: acc.p + r.proteins,
          f: acc.f + r.fats,
          c: acc.c + r.carbs
        };
      },
      { cal: 0, p: 0, f: 0, c: 0 }
    );
  }, [currentDay]);

  const mealLabels = {
    breakfast: { title: 'Завтрак', icon: '☀️' },
    lunch: { title: 'Обед', icon: '🍲' },
    lunch_soup: { title: 'Обед — 1-е блюдо (Суп)', icon: '🥣' },
    lunch_main: { title: 'Обед — 2-е блюдо', icon: '🍛' },
    dinner: { title: 'Ужин', icon: '🌙' },
    snack: { title: 'Перекус', icon: '🍎' }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Карусель дней */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {menuDays.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                triggerHaptic('light');
                setActiveDayIndex(idx);
              }}
              className={`flex-shrink-0 px-3.5 py-2 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-md shadow-emerald-900/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] block opacity-80 uppercase tracking-wider">День</span>
              <span className="text-sm font-bold font-mono">{day.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* КБЖУ за день */}
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Итого за день (на 1 персону)
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            <div>
              <span className="text-base font-black text-white font-mono block leading-none">
                {dayTotals.cal}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">ккал</span>
            </div>
            
            <div className="flex flex-col text-[11px] font-mono leading-tight pl-2 border-l border-slate-800">
              <span className="text-emerald-400">Б: {dayTotals.p}г</span>
              <span className="text-amber-400">Ж: {dayTotals.f}г</span>
              <span className="text-sky-400">У: {dayTotals.c}г</span>
            </div>
          </div>
        </div>

        <button
          onClick={onGoToBasket}
          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors shadow-sm"
        >
          <Icons.ShoppingBag className="w-3.5 h-3.5" />
          <span>К покупкам</span>
        </button>
      </div>

      {/* Карточки блюд с фото */}
      <div className="space-y-4">
        {currentDay && Object.entries(currentDay.meals).map(([mealKey, recipe]) => {
          if (!recipe) return null;
          const labelInfo = mealLabels[mealKey] || { title: 'Прием пищи', icon: '🍽️' };

          return (
            <div
              key={mealKey}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all shadow-md group"
            >
              {/* Фото блюда с возможностью клика для увеличения */}
              <div
                onClick={() => onOpenImage(recipe.imageUrl, recipe.title)}
                className="relative h-44 w-full overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_FOOD_IMG;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-sm">
                    <span>{labelInfo.icon}</span> {labelInfo.title}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {recipe.batchLabel && (
                      <span className="text-[10px] bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm">
                        {recipe.batchLabel}
                      </span>
                    )}
                    <span className="p-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200">
                      <Icons.ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-700 text-emerald-400 font-semibold">
                    {recipe.difficulty || 'Для новичков'}
                  </span>
                  <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                    ⏱ {recipe.prepTimeMin} мин • {recipe.calories} ккал
                  </span>
                </div>
              </div>

              {/* Описание блюда */}
              <div className="p-3.5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-300">Б:{recipe.proteins}г Ж:{recipe.fats}г У:{recipe.carbs}г</span>
                    {recipe.detailedSteps && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">{recipe.detailedSteps.length} подробных шага</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">
                    Ингредиенты на {peopleCount} чел:
                  </span>
                  <p className="line-clamp-2 text-slate-300">
                    {recipe.baseIngredients.map(ing => (
                      `${ing.name} (${ing.gramsPerPerson * peopleCount}г)`
                    )).join(', ')}
                  </p>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onCookRecipe(recipe)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
                  >
                    <Icons.Play className="w-3.5 h-3.5 fill-current" />
                    <span>Готовить по шагам</span>
                  </button>

                  <button
                    onClick={() => onSmartAutoSwap(activeDayIndex, mealKey)}
                    title="Быстрая Zero-Waste замена"
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-400 p-2 rounded-xl border border-slate-700 text-xs transition-colors"
                  >
                    <Icons.Refresh className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onInitiateSwap(activeDayIndex, mealKey, recipe)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-2.5 rounded-xl border border-slate-700 text-xs font-medium transition-colors"
                  >
                    Замена
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BasketView({
  packedItems,
  storeTotals,
  activeStoreTier,
  setActiveStoreTier,
  checkedBasketItems,
  setCheckedBasketItems,
  peopleCount,
  daysCount,
  city,
  showToast
}) {
  const toggleItem = (id) => {
    triggerHaptic('light');
    setCheckedBasketItems({
      ...checkedBasketItems,
      [id]: !checkedBasketItems[id]
    });
  };

  const exportBasket = () => {
    triggerHaptic('medium');
    const tg = getTelegramWebApp();
    const selectedStore = RETAIL_NETWORKS.find(s => s.id === activeStoreTier);
    const storePrice = storeTotals[activeStoreTier] || 0;

    const payload = {
      action: 'basket_export',
      city: CITY_COEFFICIENTS[city]?.name || city,
      store: selectedStore?.name,
      totalPrice: storePrice,
      days: daysCount,
      people: peopleCount,
      items: packedItems.map(item => ({
        name: item.name,
        category: item.category,
        totalBought: item.totalBought,
        unit: item.unit,
        packCount: item.packCount,
        requiredGrams: item.requiredGrams,
        leftover: item.leftover,
        isWeighted: item.isWeighted,
        isChecked: !!checkedBasketItems[item.id]
      }))
    };

    if (tg && typeof tg.sendData === 'function') {
      try {
        tg.sendData(JSON.stringify(payload));
        triggerHaptic('success');
        showToast('🚀 Список передан Telegram-боту!');
        return;
      } catch (err) {
        // Fallback в буфер обмена
      }
    }

    const lines = [
      `🛒 Корзина Zero-Waste (${daysCount} дн., ${peopleCount} чел., ${CITY_COEFFICIENTS[city]?.name}):`,
      `Магазин: ${selectedStore?.name}`,
      `Ориентировочная сумма: ~${storePrice} ₽\n`,
      'Товары в корзине:'
    ];

    packedItems.forEach((item) => {
      const status = checkedBasketItems[item.id] ? '✅' : '▫️';
      if (item.isWeighted) {
        lines.push(`${status} ⚖️ ${item.name} — ${item.totalBought}${item.unit} (на развес) [нужно: ${item.requiredGrams}${item.unit}]`);
      } else {
        lines.push(`${status} 📦 ${item.name} — ${item.packCount} уп. (${item.totalBought}${item.unit}) [нужно: ${item.requiredGrams}${item.unit}]`);
      }
    });

    lines.push('\nСоздано в Zero-Waste Meal Planner TMA');

    try {
      document.execCommand('copy');
      navigator.clipboard?.writeText(lines.join('\n'));
      triggerHaptic('success');
      showToast('📋 Список скопирован в буфер для Telegram!');
    } catch {
      showToast('Список покупок сформирован');
    }
  };

  const categories = useMemo(() => {
    const map = {};
    packedItems.forEach(item => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [packedItems]);

  return (
    <div className="p-4 space-y-4">
      {/* 3 сети */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Сравнение 3 вариантов сетей
          </span>
          <span className="text-[10px] text-slate-400">Цены {CITY_COEFFICIENTS[city]?.name}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {RETAIL_NETWORKS.map((store) => {
            const isSelected = activeStoreTier === store.id;
            const price = storeTotals[store.id] || 0;

            return (
              <button
                key={store.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveStoreTier(store.id);
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-semibold text-emerald-400 block">{store.badge}</span>
                <span className="text-xs font-bold block truncate mt-0.5 text-white">{store.name}</span>
                <span className="text-sm font-black font-mono block mt-1 text-emerald-400">
                  {price} ₽
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Экспорт корзины */}
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">
            Выбрано: <strong className="text-white">{RETAIL_NETWORKS.find(s => s.id === activeStoreTier)?.name}</strong>
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            {packedItems.length} позиций в корзине
          </span>
        </div>
        
        <button
          onClick={exportBasket}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shadow-emerald-900/40"
        >
          <Icons.Send className="w-3.5 h-3.5" />
          <span>В Telegram</span>
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(categories).map(([categoryName, items]) => (
          <div key={categoryName} className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {categoryName}
            </h4>

            <div className="space-y-1.5">
              {items.map((item) => {
                const checked = checkedBasketItems[item.id];
                const isZeroWaste = item.leftover === 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      checked
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 line-through'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                        checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {checked && <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold flex items-center gap-1.5 truncate">
                          <span className="truncate">{item.name}</span>
                          {item.isWeighted && (
                            <span className="text-[9px] bg-teal-500/15 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-500/30 shrink-0">
                              Развес
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Нужно: <span className="font-mono text-slate-300">{item.requiredGrams} {item.unit}</span> • {item.isWeighted ? (
                            <>Взвесить: <span className="font-mono text-emerald-400 font-bold">{item.totalBought} {item.unit}</span></>
                          ) : (
                            <>Покупка: <span className="font-mono text-emerald-400 font-bold">{item.packCount} уп. ({item.totalBought} {item.unit})</span></>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap inline-block ${
                        item.isWeighted
                          ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                          : isZeroWaste
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.isWeighted ? 'Точный вес ⚖️' : isZeroWaste ? 'Остаток: 0г ✨' : `Запас: ${item.leftover}${item.unit}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CookingModal({ recipe, peopleCount, onClose }) {
  const steps = recipe.detailedSteps || [
    {
      stepNumber: 1,
      title: 'Приготовление блюда',
      instruction: 'Следуйте указаниям в рецепте и подготовьте необходимые ингредиенты.',
      durationSec: 180,
      visualMarker: 'Следите за готовностью согласно рецепту',
      chefTip: null
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const [stepTimer, setStepTimer] = useState(currentStep.durationSec || 180);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setStepTimer(currentStep.durationSec || 180);
    setTimerRunning(false);
  }, [currentStepIndex]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setStepTimer(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            triggerHaptic('success');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Icons.Utensils className="w-4 h-4" />
          Режим готовки • {peopleCount} персоны
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <Icons.Close className="w-5 h-5" />
        </button>
      </div>

      <div className="py-4 space-y-4 max-w-md mx-auto w-full">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-44 bg-slate-950">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMG;
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-md">
              {recipe.difficulty || 'Для новичков'}
            </span>
            <h2 className="text-base font-bold text-white mt-1 leading-tight">{recipe.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-mono">
              <span>{recipe.calories} ккал / порция</span>
              <span>•</span>
              <span>Б: {recipe.proteins}г</span>
              <span>Ж: {recipe.fats}г</span>
              <span>У: {recipe.carbs}г</span>
            </div>
          </div>
        </div>

        {recipe.equipment && recipe.equipment.length > 0 && (
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              🍳 Необходимый инвентарь:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recipe.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ингредиенты на стол ({peopleCount} чел.):
          </h3>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {recipe.baseIngredients.map(ing => (
              <div key={ing.id} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                <span className="text-slate-200">{ing.name}</span>
                <span className="font-mono font-bold text-emerald-400">
                  {ing.gramsPerPerson * peopleCount} г
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Шаг {currentStepIndex + 1} из {steps.length}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {currentStep.title}
              </h4>
            </div>

            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-1.5 rounded-full ${
                    i === currentStepIndex ? 'bg-emerald-400' : i < currentStepIndex ? 'bg-emerald-800' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentStep.heat && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium">
              <Icons.Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Режим нагрева: {currentStep.heat}</span>
            </div>
          )}

          <p className="text-sm text-slate-100 leading-relaxed font-medium">
            {currentStep.instruction}
          </p>

          {currentStep.visualMarker && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <span className="text-sm">👀</span>
              <div>
                <strong className="text-white block font-semibold">Как понять, что всё сделано правильно:</strong>
                <span>{currentStep.visualMarker}</span>
              </div>
            </div>
          )}

          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Timer className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Таймер текущего шага
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {formatTime(stepTimer)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setTimerRunning(!timerRunning);
                }}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition-all shadow-md"
              >
                {timerRunning ? <Icons.Pause className="w-4 h-4 fill-current" /> : <Icons.Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setTimerRunning(false);
                  setStepTimer(currentStep.durationSec || 180);
                }}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <Icons.RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {currentStep.chefTip && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300 flex items-start gap-2">
              <span>💡</span>
              <span><strong>Совет шефа:</strong> {currentStep.chefTip}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => {
                triggerHaptic('light');
                setCurrentStepIndex(c => Math.max(0, c - 1));
              }}
              className="flex-1 bg-slate-800 disabled:opacity-40 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
            >
              Назад
            </button>
            <button
              disabled={currentStepIndex === steps.length - 1}
              onClick={() => {
                triggerHaptic('light');
                setCurrentStepIndex(c => Math.min(steps.length - 1, c + 1));
              }}
              className="flex-1 bg-emerald-600 disabled:opacity-40 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-semibold"
            >
              Следующий шаг
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageLightboxModal({ imageObj, onClose }) {
  if (!imageObj) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800"
        >
          <Icons.Close className="w-5 h-5" />
        </button>

        <img
          src={imageObj.url}
          alt={imageObj.title}
          className="w-full h-72 object-cover"
        />

        <div className="p-4">
          <h3 className="text-base font-bold text-white leading-snug">
            {imageObj.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Нажмите в любом месте или на крестик, чтобы закрыть просмотр
          </p>
        </div>
      </div>
    </div>
  );
}

function SwapRecipeModal({ swapData, exclusions, onClose, onSelectRecipe }) {
  const { mealKey, recipe: currentRecipe, dayIndex } = swapData;
  const isFirstDay = dayIndex === 0;
  const targetMealType = mealKey.startsWith('lunch') ? 'lunch' : mealKey;
  const targetCourse = mealKey === 'lunch_soup' ? 'soup' : mealKey === 'lunch_main' ? 'main' : null;

  const alternatives = MASTER_RECIPES.filter(r => {
    if (r.id === currentRecipe.id) return false;
    if (isFirstDay && r.chainRole === 'consumer') return false;
    if (targetMealType === 'lunch') {
      if (r.mealType !== 'lunch') return false;
      if (targetCourse && r.courseType !== targetCourse) return false;
      return true;
    }
    return r.mealType === targetMealType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Выбор блюда на замену</h3>
            <p className="text-[11px] text-slate-400">С фотографиями и контролем ваших ограничений</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <img
            src={currentRecipe.imageUrl}
            alt={currentRecipe.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMG;
            }}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Текущее блюдо:</span>
            <p className="font-semibold text-slate-200 mt-0.5">{currentRecipe.title}</p>
          </div>
        </div>

        <div className="space-y-2">
          {alternatives.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Нет других альтернатив для этого приема пищи</p>
          ) : (
            alternatives.map((alt, i) => {
              const isSafe = isDishAllowed(alt, exclusions);
              return (
                <div
                  key={alt.id}
                  onClick={() => onSelectRecipe(alt)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSafe
                      ? 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/50'
                      : 'bg-rose-950/20 border-rose-900/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={alt.imageUrl}
                    alt={alt.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_FOOD_IMG;
                    }}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{alt.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                        isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isSafe ? 'Zero-Waste' : 'Исключения'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>⏱ {alt.prepTimeMin} мин</span>
                      <span>•</span>
                      <span>{alt.calories} ккал</span>
                      <span>•</span>
                      <span className="text-slate-300">Б: {alt.proteins}г</span>
                    </div>

                    {i === 0 && isSafe && (
                      <p className="text-[9px] text-emerald-400">
                        ✨ Рекомендуется: без изменения закупок
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-700 transition-colors"
        >
          Отмена
        </button>

      </div>
    </div>
  );
}
