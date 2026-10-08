import React, { useState, useEffect, useMemo, useRef } from 'react';

// Постоянный адрес вашего облачного бэкенда на Render.com
const BACKEND_API_URL = 'https://meal-planner-api-8khx.onrender.com';
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
  ),
  CloudCheck: (props) => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13l2 2 4-4" />
    </svg>
  )
};

// Резервный локальный каталог на случай отсутствия связи или первого прогрева Render
const LOCAL_MASTER_RECIPES = [
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
      { id: 'ing_curd_5', name: 'Творог 5% в пачке', amountPerPerson: 180, unit: 'г', category: 'Молочные продукты' },
      { id: 'ing_eggs', name: 'Яйца куриные С1', amountPerPerson: 1, unit: 'шт', category: 'Яйца' },
      { id: 'ing_flour', name: 'Мука пшеничная / рисовая', amountPerPerson: 35, unit: 'г', category: 'Бакалея', isPantry: true },
      { id: 'ing_sour_cream', name: 'Сметана 15%', amountPerPerson: 40, unit: 'г', category: 'Молочные продукты' }
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
    title: 'Монастырская овсяная каша на воде с яблоком',
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
      { id: 'ing_oats', name: 'Овсяные хлопья длительной варки', amountPerPerson: 65, unit: 'г', category: 'Бакалея' },
      { id: 'ing_apples', name: 'Яблоки сезонные', amountPerPerson: 100, unit: 'г', category: 'Овощи и зелень' }
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
      }
    ]
  },
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
      { id: 'ing_beef_stew', name: 'Говядина духовая лоток', amountPerPerson: 130, unit: 'г', category: 'Мясо и птица' },
      { id: 'ing_beets', name: 'Свекла свежая мытая', amountPerPerson: 90, unit: 'г', category: 'Овощи и зелень' },
      { id: 'ing_cabbage', name: 'Капуста белокочанная', amountPerPerson: 80, unit: 'г', category: 'Овощи и зелень' },
      { id: 'ing_potatoes', name: 'Картофель отборный', amountPerPerson: 80, unit: 'г', category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', amountPerPerson: 10, unit: 'г', category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка прозрачного мясного бульона',
        instruction: 'Говядину нарежьте кусочками 2.5 см, залейте холодной водой, варите 25 минут на тихом огне.',
        durationSec: 1500,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Чистый прозрачный ароматный бульон.',
        chefTip: 'Снятие первой пены гарантирует кристальную прозрачность.'
      }
    ]
  }
];

const RETAIL_NETWORKS = [
  { id: 'budget', name: 'Магнит / Пятёрочка', tier: 'Бюджет', multiplier: 0.88, badge: 'Эконом' },
  { id: 'standard', name: 'Перекрёсток / Лента', tier: 'Стандарт', multiplier: 1.0, badge: 'Баланс' },
  { id: 'premium', name: 'ВкусВилл', tier: 'Премиум / ЗОЖ', multiplier: 1.28, badge: 'Премиум' }
];

const CITY_COEFFICIENTS = {
  SPB: { name: 'Санкт-Петербург', factor: 1.0 },
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

// Функция адаптации DTO рецепта из бэкенда в формат React
function normalizeBackendRecipe(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    title: dto.title,
    imageUrl: dto.image_url || dto.imageUrl || FALLBACK_FOOD_IMG,
    difficulty: dto.difficulty || 'Легко',
    mealType: dto.meal_type || dto.mealType,
    courseType: dto.course_type || dto.courseType,
    prepTimeMin: dto.prep_time_min || dto.prepTimeMin || 25,
    calories: dto.calories || 350,
    proteins: dto.proteins || 20,
    fats: dto.fats || 10,
    carbs: dto.carbs || 35,
    tags: dto.tags || [],
    equipment: dto.equipment || [],
    isBatchable: dto.is_batchable ?? dto.isBatchable ?? false,
    batchLabel: dto.batch_label || dto.batchLabel || null,
    chainRole: dto.chain_role || dto.chainRole || 'independent',
    baseIngredients: (dto.base_ingredients || dto.baseIngredients || []).map(ing => ({
      id: ing.id,
      name: ing.name,
      amountPerPerson: ing.amount_per_person ?? ing.amountPerPerson ?? 100,
      unit: ing.unit || 'г',
      category: ing.category || 'Бакалея',
      isPantry: ing.is_pantry ?? ing.isPantry ?? false
    })),
    detailedSteps: (dto.steps || dto.detailedSteps || []).map(st => ({
      stepNumber: st.step_number ?? st.stepNumber ?? 1,
      title: st.title,
      instruction: st.instruction,
      durationSec: st.duration_sec ?? st.durationSec ?? 180,
      heat: st.heat_level || st.heat,
      visualMarker: st.visual_marker || st.visualMarker,
      chefTip: st.chef_tip || st.chefTip
    }))
  };
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
  
  // Состояния облачного бэкенда
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
      try {
        tg.enableClosingConfirmation();
      } catch (e) {}
    }

    // Проверяем доступность бэкенда при старте
    fetch(`${BACKEND_API_URL}/api/health`, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'ok') {
          setApiOnline(true);
        }
      })
      .catch(() => setApiOnline(false));
  }, []);

  // Синхронизация кнопки "Назад" в Telegram
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
      return () => tg.BackButton.offClick(handleBack);
    } else {
      tg.BackButton.hide();
    }
  }, [activeCookingRecipe, swapModalState, lightboxImage]);

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
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Генерация меню через FastAPI облако на Render
  const generateMenuFromBackend = async (shouldSwitchTab = false) => {
    setIsLoadingApi(true);
    triggerHaptic('medium');

    const requestPayload = {
      city: city,
      days_count: daysCount,
      people_count: peopleCount,
      lunch_mode: lunchMode,
      meal_types: mealTypes,
      exclusions: exclusions,
      batch_cooking_enabled: batchCookingEnabled,
      weighted_produce_enabled: weightedProduceEnabled,
      pantry_list: pantryList
    };

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/menu/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      // Нормализуем полученные блюда из базы данных
      const normalizedDays = (data.days || []).map(day => {
        const normalizedMeals = {};
        Object.entries(day.meals || {}).forEach(([mKey, rData]) => {
          normalizedMeals[mKey] = normalizeBackendRecipe(rData);
        });
        return {
          dayNumber: day.day_number || day.dayNumber,
          meals: normalizedMeals
        };
      });

      setMenuDays(normalizedDays);
      setActiveDayIndex(0);
      setApiOnline(true);

      if (shouldSwitchTab) {
        triggerHaptic('success');
        setCurrentTab('menu');
        showToast('✨ Меню загружено из базы данных Render!');
      }
    } catch (err) {
      console.warn('Облачный сервер не ответил, применяем локальную базу:', err);
      setApiOnline(false);
      // Локальная генерация меню в качестве надежного fallback
      fallbackLocalGenerate(shouldSwitchTab);
      if (shouldSwitchTab) {
        showToast('⚡ Сервер Render просыпается, открыто локальное меню');
      }
    } finally {
      setIsLoadingApi(false);
    }
  };

  const fallbackLocalGenerate = (shouldSwitchTab) => {
    const generated = [];
    for (let day = 1; day <= daysCount; day++) {
      const dayMeals = {};
      if (mealTypes.breakfast) dayMeals.breakfast = LOCAL_MASTER_RECIPES[0];
      if (mealTypes.lunch) dayMeals.lunch_soup = LOCAL_MASTER_RECIPES[2];
      if (mealTypes.dinner) dayMeals.dinner = LOCAL_MASTER_RECIPES[1];
      generated.push({ dayNumber: day, meals: dayMeals });
    }
    setMenuDays(generated);
    setActiveDayIndex(0);
    if (shouldSwitchTab) {
      setCurrentTab('menu');
    }
  };

  useEffect(() => {
    generateMenuFromBackend(false);
  }, [lunchMode, daysCount, peopleCount, exclusions, mealTypes, city]);

  // Расчет корзины покупок
  const basketAnalysis = useMemo(() => {
    const rawDemand = {};

    menuDays.forEach((dayObj) => {
      Object.values(dayObj.meals).forEach((recipe) => {
        if (!recipe) return;
        (recipe.baseIngredients || []).forEach((ing) => {
          if (ing.isPantry) {
            const pantryRecord = pantryList.find(p => p.id === ing.id || p.name.includes(ing.name));
            if (pantryRecord && pantryRecord.checked) return;
          }
          const amount = ing.amountPerPerson * peopleCount;
          rawDemand[ing.id] = (rawDemand[ing.id] || 0) + amount;
        });
      });
    });

    const packedItems = [];
    const cityFactor = CITY_COEFFICIENTS[city]?.factor || 1.0;

    Object.entries(rawDemand).forEach(([ingId, requiredAmount]) => {
      const isWeighted = weightedProduceEnabled && ingId.includes('potatoes') || ingId.includes('carrots') || ingId.includes('cabbage');
      const packWeight = ingId === 'ing_eggs' ? 10 : 800;
      const unit = ingId === 'ing_eggs' ? 'шт' : 'г';
      const basePrice = 120;

      let packCount = 1;
      let totalBought = 0;
      let leftover = 0;
      let basePriceTotal = 0;

      if (isWeighted) {
        totalBought = Math.ceil(requiredAmount / 50) * 50;
        leftover = Math.max(0, totalBought - Math.round(requiredAmount));
        packCount = 1;
        basePriceTotal = (basePrice * totalBought) / 1000;
      } else {
        packCount = Math.ceil(requiredAmount / packWeight);
        totalBought = packCount * packWeight;
        leftover = totalBought - requiredAmount;
        basePriceTotal = basePrice * packCount;
      }

      packedItems.push({
        id: ingId,
        name: ingId.replace('ing_', '').replace('_', ' '),
        category: 'Продукты',
        unit: unit,
        packWeight: packWeight,
        requiredGrams: Math.round(requiredAmount),
        packCount,
        totalBought,
        leftover: Math.round(leftover),
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white font-sans antialiased">
      <div className="w-full max-w-md bg-slate-900/90 min-h-screen flex flex-col border-x border-slate-800 shadow-2xl relative pb-20">
        
        {/* Верхняя шапка */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Icons.Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Zero-Waste Planner
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  apiOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <Icons.CloudCheck className="w-3 h-3" />
                  {apiOnline ? 'Render 24/7' : 'Связь...'}
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {CITY_COEFFICIENTS[city]?.name} • {daysCount} дн. • {peopleCount} чел.
              </p>
            </div>
          </div>
          
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
        </header>

        {/* Уведомление Toast */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-emerald-400/30 transition-all flex items-center gap-2">
            <Icons.Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Экран загрузки облачного сервера */}
        {isLoadingApi && (
          <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-center gap-2 text-xs text-emerald-300 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Обращение к облачному бэкенду на Render...</span>
          </div>
        )}

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
              isLoadingApi={isLoadingApi}
              onGenerate={() => generateMenuFromBackend(true)}
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

        {lightboxImage && (
          <ImageLightboxModal imageObj={lightboxImage} onClose={() => setLightboxImage(null)} />
        )}

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

        {swapModalState && (
          <SwapRecipeModal
            swapData={swapModalState}
            onClose={() => {
              triggerHaptic('light');
              setSwapModalState(null);
            }}
            onSelectRecipe={(recipe) => handleSwapRecipe(swapModalState.dayIndex, swapModalState.mealKey, recipe)}
          />
        )}

        {/* Нижняя навигация */}
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
  isLoadingApi,
  onGenerate
}) {
  const commonExclusionChips = [
    'Без индейки', 'Без курицы', 'Без говядины', 'Без рыбы',
    'Без грибов', 'Без лука', 'Без чеснока', 'Без гречки',
    'Без свинины', 'Без глютена', 'Без лактозы'
  ];

  const allDisplayedChips = useMemo(() => {
    const list = [...commonExclusionChips];
    exclusions.forEach(ex => {
      if (!list.includes(ex)) list.push(ex);
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
    setPantryList(pantryList.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="p-4 space-y-5">
      <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Облачный бэкенд FastAPI
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Render.com</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1">
          Меню из удаленной базы данных
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Рецепты, граммовки и расчет корзин поступают с облачного сервера $24/7$ без необходимости держать ноутбук включенным.
        </p>
      </div>

      {/* Дни и люди */}
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
              className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 text-xs"
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
              className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-500 text-xs"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Приемы пищи */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Приемы пищи
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

        {mealTypes.lunch && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">🍲 Формат обеда:</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">
                {lunchMode === 'first_only' ? 'Только 1-е' : lunchMode === 'second_only' ? 'Только 2-е' : '1-е и 2-е'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'first_only', label: 'Только 1-е', desc: 'Суп', icon: '🥣' },
                { id: 'second_only', label: 'Только 2-е', desc: 'Второе', icon: '🍛' },
                { id: 'both', label: '1-е и 2-е', desc: 'Комплекс', icon: '🍲' }
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
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs block">{opt.icon}</span>
                  <span className="text-[11px] block mt-0.5">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Исключения */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Исключения и аллергены
        </label>
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
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span>{tag}</span>
                {isCustom ? (
                  <span onClick={(e) => removeExclusion(tag, e)} className="text-rose-400 font-bold ml-0.5">✕</span>
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
            placeholder="Свой запрет (напр. кинза)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 font-medium"
          >
            Добавить
          </button>
        </form>
      </div>

      {/* Опции Batch Cooking & Развес */}
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-200">🥘 Готовить на 2 дня (Batch Cooking)</p>
          <p className="text-[11px] text-slate-400">Супы готовятся сразу на 2 приема</p>
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
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${batchCookingEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-200">⚖️ Овощи на развес</p>
          <p className="text-[11px] text-slate-400">Точный вес картофеля и моркови</p>
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
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${weightedProduceEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Домашний склад */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Домашний склад (Pantry)
        </label>
        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {pantryList.map(item => (
            <div
              key={item.id}
              onClick={() => togglePantry(item.id)}
              className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                item.checked ? 'bg-slate-950 border-emerald-900/50 text-slate-200' : 'bg-slate-950/40 border-slate-800 text-slate-400'
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

      <button
        type="button"
        disabled={isLoadingApi}
        onClick={onGenerate}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Icons.Sparkles className="w-5 h-5" />
        <span>{isLoadingApi ? 'Запрос к серверу Render...' : 'Сформировать меню (через облако)'}</span>
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
  onGoToBasket
}) {
  const currentDay = menuDays[activeDayIndex] || menuDays[0];

  const dayTotals = useMemo(() => {
    if (!currentDay) return { cal: 0, p: 0, f: 0, c: 0 };
    return Object.values(currentDay.meals).reduce(
      (acc, r) => {
        if (!r) return acc;
        return {
          cal: acc.cal + (r.calories || 0),
          p: acc.p + (r.proteins || 0),
          f: acc.f + (r.fats || 0),
          c: acc.c + (r.carbs || 0)
        };
      },
      { cal: 0, p: 0, f: 0, c: 0 }
    );
  }, [currentDay]);

  const mealLabels = {
    breakfast: { title: 'Завтрак', icon: '☀️' },
    lunch: { title: 'Обед', icon: '🍲' },
    lunch_soup: { title: 'Обед — Суп', icon: '🥣' },
    lunch_main: { title: 'Обед — Второе', icon: '🍛' },
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
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[10px] block opacity-80 uppercase tracking-wider">День</span>
              <span className="text-sm font-bold font-mono">{day.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* КБЖУ дня */}
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
          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
        >
          <Icons.ShoppingBag className="w-3.5 h-3.5" />
          <span>К покупкам</span>
        </button>
      </div>

      {/* Карточки блюд */}
      <div className="space-y-4">
        {currentDay && Object.entries(currentDay.meals).map(([mealKey, recipe]) => {
          if (!recipe) return null;
          const labelInfo = mealLabels[mealKey] || { title: 'Прием пищи', icon: '🍽️' };

          return (
            <div
              key={mealKey}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-md group"
            >
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
                  <span className="text-[11px] font-bold text-white bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                    <span>{labelInfo.icon}</span> {labelInfo.title}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {recipe.batchLabel && (
                      <span className="text-[10px] bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded-lg">
                        {recipe.batchLabel}
                      </span>
                    )}
                    <span className="p-1 rounded-lg bg-slate-900/80 text-slate-200">
                      <Icons.ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 text-emerald-400 font-semibold">
                    {recipe.difficulty}
                  </span>
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                    ⏱ {recipe.prepTimeMin} мин • {recipe.calories} ккал
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                    <span>Б:{recipe.proteins}г Ж:{recipe.fats}г У:{recipe.carbs}г</span>
                    {recipe.detailedSteps && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">{recipe.detailedSteps.length} шага</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">
                    Ингредиенты на {peopleCount} чел:
                  </span>
                  <p className="line-clamp-2 text-slate-300">
                    {(recipe.baseIngredients || []).map(ing => {
                      const qty = ing.amountPerPerson * peopleCount;
                      return `${ing.name} (${qty} ${ing.unit || 'г'})`;
                    }).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onCookRecipe(recipe)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Icons.Play className="w-3.5 h-3.5 fill-current" />
                    <span>Готовить</span>
                  </button>

                  <button
                    onClick={() => onInitiateSwap(activeDayIndex, mealKey, recipe)}
                    className="bg-slate-800 text-slate-300 py-2 px-3 rounded-xl border border-slate-700 text-xs font-medium"
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
        showToast('🚀 Список отправлен в чат Telegram!');
        return;
      } catch (err) {}
    }

    const lines = [
      `🛒 Корзина Zero-Waste (${daysCount} дн., ${peopleCount} чел.):`,
      `Магазин: ${selectedStore?.name} (~${storePrice} ₽)\n`
    ];
    packedItems.forEach((item) => {
      lines.push(`▫️ ${item.name} — ${item.totalBought}${item.unit}`);
    });

    try {
      navigator.clipboard?.writeText(lines.join('\n'));
      triggerHaptic('success');
      showToast('📋 Скопировано в буфер обмена!');
    } catch {
      showToast('Список покупок сформирован');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 3 сети */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3 варианта супермаркетов
          </span>
          <span className="text-[10px] text-slate-400">{CITY_COEFFICIENTS[city]?.name}</span>
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
                    : 'bg-slate-900 border-slate-800 text-slate-400'
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

      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">
            Выбрано: <strong className="text-white">{RETAIL_NETWORKS.find(s => s.id === activeStoreTier)?.name}</strong>
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            {packedItems.length} позиций в чеке
          </span>
        </div>
        
        <button
          onClick={exportBasket}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Icons.Send className="w-3.5 h-3.5" />
          <span>В Telegram</span>
        </button>
      </div>

      {/* Список товаров */}
      <div className="space-y-1.5">
        {packedItems.map((item) => {
          const checked = checkedBasketItems[item.id];
          const isZeroWaste = item.leftover === 0;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                checked
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400 line-through'
                  : 'bg-slate-900/80 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                  checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                }`}>
                  {checked && <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate capitalize">{item.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    Нужно: {item.requiredGrams}{item.unit} • Покупка: <span className="font-mono text-emerald-400 font-bold">{item.totalBought}{item.unit}</span>
                  </p>
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shrink-0 ${
                isZeroWaste ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {isZeroWaste ? '0 остатка ✨' : `Запас: ${item.leftover}${item.unit}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CookingModal({ recipe, peopleCount, onClose }) {
  const steps = recipe.detailedSteps || [{ title: 'Готовка', instruction: 'Следуйте рецепту', durationSec: 180 }];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Icons.Utensils className="w-4 h-4" />
          Режим готовки • {peopleCount} персоны
        </span>
        <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-300">
          <Icons.Close className="w-5 h-5" />
        </button>
      </div>

      <div className="py-4 space-y-4 max-w-md mx-auto w-full">
        <h2 className="text-base font-bold text-white">{recipe.title}</h2>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase">Шаг {currentStepIndex + 1} из {steps.length}</h4>
          <h3 className="text-sm font-bold text-white">{currentStep.title}</h3>
          <p className="text-xs text-slate-200 leading-relaxed">{currentStep.instruction}</p>
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(c => Math.max(0, c - 1))}
            className="flex-1 bg-slate-800 disabled:opacity-40 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
          >
            Назад
          </button>
          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex(c => Math.min(steps.length - 1, c + 1))}
            className="flex-1 bg-emerald-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-semibold"
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageLightboxModal({ imageObj, onClose }) {
  if (!imageObj) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 text-white">
          <Icons.Close className="w-5 h-5" />
        </button>
        <img src={imageObj.url} alt={imageObj.title} className="w-full h-72 object-cover" />
        <div className="p-4">
          <h3 className="text-base font-bold text-white leading-snug">{imageObj.title}</h3>
        </div>
      </div>
    </div>
  );
}

function SwapRecipeModal({ swapData, onClose, onSelectRecipe }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">Замена блюда</h3>
          <button onClick={onClose} className="p-1 text-slate-400">✕</button>
        </div>
        <p className="text-xs text-slate-300">Выберите подходящее блюдо из базы данных</p>
        <button onClick={onClose} className="w-full bg-slate-800 text-slate-300 py-2 rounded-xl text-xs">
          Закрыть
        </button>
      </div>
    </div>
  );
}
