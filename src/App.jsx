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
  )
};

const MASTER_RECIPES = [
  {
    id: 'rec_turkey_dinner',
    title: 'Запеченное филе индейки с травами и рисом',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко (для новичка)',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 35,
    calories: 410,
    proteins: 46,
    fats: 12,
    carbs: 28,
    tags: ['Птица', 'Высокий белок'],
    equipment: ['Форма для запекания / противень', 'Кастрюля 1.5–2 л', 'Разделочная доска', 'Бумажные полотенца'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_turkey_breast',
    baseIngredients: [
      { id: 'ing_turkey_breast', name: 'Филе грудки индейки', gramsPerPerson: 180, category: 'Мясо и птица' },
      { id: 'ing_rice', name: 'Рис жасмин (отварной)', gramsPerPerson: 80, category: 'Бакалея', isSharedSide: true },
      { id: 'ing_broccoli', name: 'Брокколи свежая', gramsPerPerson: 120, category: 'Овощи и зелень' },
      { id: 'ing_oil', name: 'Оливковое / Растительное масло', gramsPerPerson: 10, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Подготовка и просушка птицы',
        instruction: 'Промойте филе индейки под холодной проточной водой и обязательно насухо промокните бумажными полотенцами с обеих сторон. Сделайте острым ножом неглубокие косые надрезы (глубиной 3–4 мм) по диагонали.',
        durationSec: 180,
        heat: null,
        visualMarker: 'Сухая поверхность мяса гарантирует запекание с золотистой корочкой, а не варку в собственном соку.',
        chefTip: 'Надрезы помогут маслу и специям проникнуть глубже в плотное волокно индейки.'
      },
      {
        stepNumber: 2,
        title: 'Маринование и разогрев духовки',
        instruction: 'Включите духовку на 190°C (режим «Верх-низ» или конвекция). Натрите филе 1 ст. л. масла, щепоткой соли, молотым перцем и сушеными травами. Оставьте на доске на 5 минут при комнатной температуре.',
        durationSec: 300,
        heat: 'Духовка 190°C',
        visualMarker: 'Мясо должно слегка заблестеть от тонкого масляного слоя без излишних лужиц.',
        chefTip: 'Никогда не ставьте холодное мясо из холодильника в духовку — дайте ему постоять пару минут.'
      },
      {
        stepNumber: 3,
        title: 'Сквозная варка риса на два дня',
        instruction: 'В кастрюле промойте рис до прозрачной воды. Залейте холодной водой в пропорции 1:1.8 (на 160 г риса — около 300 мл воды). Доведите до кипения на сильном огне, убавьте до минимального (2 из 9), накройте плотной крышкой и варите ровно 12 минут, не открывая крышку.',
        durationSec: 720,
        heat: 'Сначала сильный (9), затем тихий (2)',
        visualMarker: 'Вся вода впитается, на поверхности риса появятся характерные кратеры-паровые отверстия.',
        chefTip: 'Сваренную половину риса мы уберем в контейнер на завтрашний обед вок-стиль!'
      },
      {
        stepNumber: 4,
        title: 'Запекание индейки и брокколи',
        instruction: 'Выложите филе и соцветия брокколи в форму. Запекайте 22–25 минут. Выньте и дайте отдохнуть 4 минуты на доске перед нарезкой, чтобы сок распределился внутри.',
        durationSec: 1500,
        heat: 'Духовка 190°C',
        visualMarker: 'Проткните филе ножом в центре: выделяющийся сок должен быть кристально прозрачным, без розового оттенка.',
        chefTip: 'Если разрезать мясо сразу из духовки, сок вытечет на доску и филе станет сухим.'
      }
    ],
    chefTip: 'Сваренная двойная порция риса сэкономит 20 минут готовки на следующий день!'
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
    tags: ['Суп', 'Zero-Waste'],
    equipment: ['Кастрюля 2.5–3 л', 'Шумовка', 'Нож для овощей', 'Разделочная доска'],
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
        title: 'Нарезка остатка индейки',
        instruction: 'Оставшуюся часть филе из открытого лотка нарежьте аккуратной тонкой соломкой или кубиками размером 1.5х1.5 см. Это позволит мясу свариться очень быстро и остаться нежным.',
        durationSec: 180,
        heat: null,
        visualMarker: 'Кусочки одинакового калибра сварятся одновременно без переваривания.',
        chefTip: 'Режьте поперек мышечных волокон, чтобы кусочки буквально таяли во рту.'
      },
      {
        stepNumber: 2,
        title: 'Варка прозрачного бульона',
        instruction: 'В кастрюле доведите до кипения 1.2–1.4 л чистой холодной воды. Опустите кусочки индейки. Когда вода закипит повторно, уменьшите огонь до умеренного (5 из 9) и снимите шумовкой пену.',
        durationSec: 600,
        heat: 'Средний кипящий огонь (5 из 9)',
        visualMarker: 'Бульон должен быть прозрачным с мелкими масляными янтарными каплями.',
        chefTip: 'Не допускайте бурного бурления, иначе бульон станет мутным.'
      },
      {
        stepNumber: 3,
        title: 'Закладка моркови и лапши',
        instruction: 'Морковь нарежьте тонкими кружочками или мелкой соломкой (толщиной 2 мм). Опустите морковь в бульон, через 3 минуты добавьте яичную лапшу. Варите 5-6 минут при легком подрагивании поверхности.',
        durationSec: 360,
        heat: 'Средне-слабый огонь (4 из 9)',
        visualMarker: 'Лапша увеличится в объеме и станет мягкой, но сохранит приятную упругость аль-денте.',
        chefTip: 'Яичная лапша варится быстрее обычной пасты, не передержите ее.'
      },
      {
        stepNumber: 4,
        title: 'Финальная подача с зеленью',
        instruction: 'Снимите кастрюлю с конфорки. Мелко нарубите свежий укроп и добавьте в кастрюлю. Накройте крышкой на 2 минуты, чтобы зелень раскрыла аромат.',
        durationSec: 120,
        heat: 'Без нагрева',
        visualMarker: 'Яркий свежий зеленый цвет укропа на поверхности золотистого супа.',
        chefTip: 'Свежую зелень лучше не кипятить, чтобы сохранить витамин C и яркий цвет.'
      }
    ],
    chefTip: 'Так вы расходуете упаковку индейки без остатка.'
  },
  {
    id: 'rec_chicken_fillet',
    title: 'Запеченное филе цыпленка с картофелем по-деревенски',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко (для новичка)',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 35,
    calories: 430,
    proteins: 44,
    fats: 13,
    carbs: 34,
    tags: ['Птица', 'Без индейки', 'Без грибов'],
    equipment: ['Широкий противень', 'Пергаментная бумага', 'Большая миска', 'Нож шефа'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_chicken_breast',
    baseIngredients: [
      { id: 'ing_chicken_breast', name: 'Филе цыпленка охлажденное', gramsPerPerson: 190, category: 'Мясо и птица' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 180, category: 'Овощи и зелень' },
      { id: 'ing_oil', name: 'Оливковое / Растительное масло', gramsPerPerson: 10, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Нарезка картофеля дольками',
        instruction: 'Картофель хорошо вымойте щеткой (кожуру можно оставить для деревенского стиля). Разрежьте каждую картофелину вдоль пополам, затем каждую половинку на 3–4 продольные дольки. Обсушите полотенцем.',
        durationSec: 240,
        heat: null,
        visualMarker: 'Дольки одинакового размера (толщиной примерно 2 см в широкой части).',
        chefTip: 'Лишняя влага на картофеле помешает образованию хрустящей корочки.'
      },
      {
        stepNumber: 2,
        title: 'Пряное перемешивание на противне',
        instruction: 'Выложите картофель в миску, добавьте 1 ч. л. растительного масла, щепотку соли и паприку. Перемешайте руками, чтобы каждая долька покрылась масляным слоем. Распределите по застеленному пергаментом противню срезом вниз.',
        durationSec: 180,
        heat: 'Духовка 200°C',
        visualMarker: 'Картофель лежит свободно в один слой, дольки не нагромождены друг на друга.',
        chefTip: 'Свободное пространство между дольками позволяет горячему воздуху циркулировать.'
      },
      {
        stepNumber: 3,
        title: 'Подготовка и выкладка курицы',
        instruction: 'Филе цыпленка разрежьте вдоль на два плоских стейка. Натрите солью, каплей масла и выложите на тот же противень рядом с картофелем.',
        durationSec: 180,
        heat: 'Духовка 200°C',
        visualMarker: 'Ровные стейки толщиной около 1.5–2 см.',
        chefTip: 'Если запекать на одном противне, соки цыпленка пропитают картофель снизу.'
      },
      {
        stepNumber: 4,
        title: 'Запекание до хрустящей корочки',
        instruction: 'Отправьте противень в середину разогретой до 200°C духовки на 25 минут. Проверьте картофель зубочисткой — она должна легко входить в мякоть.',
        durationSec: 1500,
        heat: 'Духовка 200°C',
        visualMarker: 'У картофеля золотисто-румяные уголки, у курицы матовая белая серединка без красноты.',
        chefTip: 'Готовность цыпленка проверяется надрезом по центру самого толстого куска.'
      }
    ],
    chefTip: 'Отличная альтернатива индейке, покрывающая суточную норму белка.'
  },
  {
    id: 'rec_chicken_soup',
    title: 'Легкий куриный суп с рисом и зеленью',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 25,
    calories: 310,
    proteins: 29,
    fats: 7,
    carbs: 33,
    tags: ['Суп', 'Без индейки', 'Без глютена'],
    equipment: ['Кастрюля 2.5 л', 'Тёрка крупная', 'Лопатка / шумовка'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'consumer',
    linkedIngredient: 'ing_chicken_breast',
    baseIngredients: [
      { id: 'ing_chicken_breast', name: 'Филе цыпленка (кубиком)', gramsPerPerson: 110, category: 'Мясо и птица' },
      { id: 'ing_rice', name: 'Рис жасмин', gramsPerPerson: 40, category: 'Бакалея' },
      { id: 'ing_carrots', name: 'Морковь фермерская', gramsPerPerson: 50, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежий укроп', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Нарезка филе и закладка в воду',
        instruction: 'Филе нарежьте кубиками размером 1.5 см. Опустите в кастрюлю с 1.2 л холодной воды, поставьте на сильный огонь до закипания.',
        durationSec: 300,
        heat: 'Сильный огонь (8 из 9)',
        visualMarker: 'Появление белой пены на поверхности воды при закипании.',
        chefTip: 'Снятие первой пены гарантирует кристально чистый суп.'
      },
      {
        stepNumber: 2,
        title: 'Ввод риса и моркови',
        instruction: 'Снимите пену шумовкой. Всыпьте промытый рис и натертую на крупной терке морковь. Убавьте огонь до тихого бульканья (3 из 9).',
        durationSec: 240,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Морковь окрасит бульон в мягкий теплый соломенно-желтый цвет.',
        chefTip: 'Мы не зажариваем морковь на масле — сохраняем легкость и полезность.'
      },
      {
        stepNumber: 3,
        title: 'Томление до мягкости риса',
        instruction: 'Варите под неплотно прикрытой крышкой 14 минут. Рис должен полностью свариться, но не развариться в кашу.',
        durationSec: 840,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Зерна риса увеличились втрое и мягко опускаются на дно при помешивании.',
        chefTip: 'Не перемешивайте суп слишком часто, чтобы не ломать рисовые зерна.'
      },
      {
        stepNumber: 4,
        title: 'Зелень и финальный настой',
        instruction: 'Добавьте щепотку соли, молотый перец и мелко нарезанный свежий укроп. Выключите нагрев и дайте супу постоять 5 минут перед подачей.',
        durationSec: 300,
        heat: 'Выключено',
        visualMarker: 'Свежий укропный аромат заполнит кухню.',
        chefTip: 'На второй день этот суп станет еще вкуснее благодаря рису.'
      }
    ],
    chefTip: 'Чистый прозрачный бульон без зажарок.'
  },
  {
    id: 'rec_lentil_soup',
    title: 'Нежный крем-суп из красной чечевицы',
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 20,
    calories: 290,
    proteins: 19,
    fats: 5,
    carbs: 42,
    tags: ['Суп', 'Постное', 'Без мяса', 'Без лука'],
    equipment: ['Кастрюля 2 л', 'Погружной блендер', 'Лопатка'],
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
        title: 'Быстрая нарезка овощей',
        instruction: 'Картофель и морковь очистите и нарежьте произвольными небольшими ломтиками толщиной 1 см. Поскольку мы будем взбивать суп блендером, форма нарезки не имеет значения.',
        durationSec: 180,
        heat: null,
        visualMarker: 'Ломтики одного размера, чтобы сварились одновременно.',
        chefTip: 'Красная чечевица разваривается быстрее всех бобовых — всего за 15 минут!'
      },
      {
        stepNumber: 2,
        title: 'Варка чечевицы и овощей',
        instruction: 'Промойте чечевицу в ситечке. Поместите чечевицу, картофель и морковь в кастрюлю, залейте 800 мл воды. Доведите до кипения и варите 15 минут на среднем огне.',
        durationSec: 900,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Красная чечевица посветлеет до желтого цвета и начнет распадаться на нежные хлопья.',
        chefTip: 'Солить лучше в самом конце, иначе чечевица будет вариться чуть дольше.'
      },
      {
        stepNumber: 3,
        title: 'Пюрирование блендером',
        instruction: 'Снимите кастрюлю с плиты. Погружным блендером пробейте суп на высокой скорости 1–2 минуты до абсолютно гладкой шелковистой текстуры. Посолите по вкусу.',
        durationSec: 120,
        heat: 'Выключено',
        visualMarker: 'Однородный бархатный крем теплого персикового оттенка без крупинок.',
        chefTip: 'Если суп покажется слишком густым, добавьте 50 мл кипятка и перемешайте.'
      }
    ],
    chefTip: 'Богат растительным белком и железом.'
  },
  {
    id: 'rec_beef_soup',
    title: 'Наваристый суп с говядиной и картофелем',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Средняя',
    mealType: 'lunch',
    courseType: 'soup',
    prepTimeMin: 40,
    calories: 360,
    proteins: 31,
    fats: 11,
    carbs: 34,
    tags: ['Суп', 'Сытное', 'Без лука', 'Без грибов'],
    equipment: ['Кастрюля 3 л с крышкой', 'Шумовка', 'Острый нож'],
    isBatchable: true,
    batchLabel: 'Суп на 2 дня',
    chainRole: 'consumer',
    linkedIngredient: 'ing_beef_stew',
    baseIngredients: [
      { id: 'ing_beef_stew', name: 'Говядина отборная', gramsPerPerson: 120, category: 'Мясо и птица' },
      { id: 'ing_potatoes', name: 'Картофель кубиком', gramsPerPerson: 90, category: 'Овощи и зелень' },
      { id: 'ing_carrots', name: 'Морковь', gramsPerPerson: 50, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Укроп', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка мясного бульона',
        instruction: 'Говядину нарежьте кусочками 2х2 см. Залейте холодной водой (1.5 л), доведите до кипения. Тщательно снимите пену шумовкой, убавьте огонь до медленного (3 из 9) и варите 25 минут.',
        durationSec: 1500,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Мясо потемнеет и станет мягким при прокалывании вилкой.',
        chefTip: 'Варка мяса в холодной воде отдает максимум вкуса именно в бульон.'
      },
      {
        stepNumber: 2,
        title: 'Добавление картофеля и моркови',
        instruction: 'Картофель нарежьте аккуратным кубиком, морковь — полукружиями. Опустите в бульон, добавьте соль и лавровый лист (если есть в Pantry). Варите 15 минут.',
        durationSec: 900,
        heat: 'Средний огонь (4 из 9)',
        visualMarker: 'Кубики картофеля легко разминаются ложкой о край кастрюли.',
        chefTip: 'Говяжий бульон получается насыщенным без необходимости обжаривать овощи в масле.'
      },
      {
        stepNumber: 3,
        title: 'Подача с рубленой зеленью',
        instruction: 'Посыпьте свежим нарезанным укропом, выключите огонь и дайте настояться 5 минут.',
        durationSec: 300,
        heat: 'Выключено',
        visualMarker: 'Аппетитный пар и насыщенный аромат классического домашнего супа.',
        chefTip: 'Этот суп отлично хранится до 72 часов в холодильнике.'
      }
    ],
    chefTip: 'Ароматный бульон без лука и резких специй.'
  },
  {
    id: 'rec_curd_pancakes',
    title: 'Пышные сырники из фермерского творога',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко (для новичка)',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 20,
    calories: 380,
    proteins: 31,
    fats: 14,
    carbs: 32,
    tags: ['Завтрак', 'Творог'],
    equipment: ['Антипригарная сковорода 24–28 см', 'Широкая лопатка', 'Глубокая миска', 'Обычный стакан для формовки'],
    isBatchable: true,
    batchLabel: 'Хранение 48ч',
    chainRole: 'initiator',
    linkedIngredient: 'ing_curd_5',
    baseIngredients: [
      { id: 'ing_curd_5', name: 'Творог 5% в пачке', gramsPerPerson: 180, category: 'Молочные продукты' },
      { id: 'ing_eggs', name: 'Яйца куриные С1', gramsPerPerson: 50, category: 'Молочные продукты' },
      { id: 'ing_flour', name: 'Мука пшеничная / рисовая', gramsPerPerson: 35, category: 'Бакалея', isPantry: true },
      { id: 'ing_sour_cream', name: 'Сметана 15%', gramsPerPerson: 40, category: 'Молочные продукты' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Замес творожной основы',
        instruction: 'Выложите творог в миску, тщательно разомните вилкой до исчезновения крупных комочков. Вбейте яйцо, добавьте щепотку соли, 1 ч. л. сахара из запасов и муку. Перемешайте до густой липкой массы.',
        durationSec: 180,
        heat: null,
        visualMarker: 'Масса должна собираться в единый ком и держать форму на ложке.',
        chefTip: 'Если творог влажный, промокните его слегка бумажным полотенцем — сырники не поплывут на сковороде!'
      },
      {
        stepNumber: 2,
        title: 'Секретная формовка идеальных шайб',
        instruction: 'Присыпьте разделочную доску щепоткой муки. Скатайте из теста шарики размером с мячик для пинг-понга. Накройте каждый шарик перевернутым стаканом и сделайте 5–6 круговых вращательных движений по доске.',
        durationSec: 240,
        heat: null,
        visualMarker: 'Получаются идеально ровные, круглые ресторанные шайбочки с высокими ровными бортиками.',
        chefTip: 'Метод вращения стаканом формирует идеальные сырники за 5 секунд без пачканья рук.'
      },
      {
        stepNumber: 3,
        title: 'Обжарка до золотистости',
        instruction: 'Разогрейте сковороду на умеренном огне (5 из 9) с 1 ч. л. масла. Выложите сырники на расстоянии 2 см друг от друга. Жарьте ровно 3.5 минуты, затем аккуратно переверните широкой лопаткой и жарьте еще 3 минуты под крышкой.',
        durationSec: 420,
        heat: 'Средне-слабый огонь (5 из 9)',
        visualMarker: 'Плотная матовая румяная корочка снизу, при нажатии пальцем сырник приятно пружинит.',
        chefTip: 'Не делайте сильный огонь, иначе корочка сгорит, а середина останется сырой.'
      },
      {
        stepNumber: 4,
        title: 'Подача с прохладной сметаной',
        instruction: 'Переложите готовые сырники на тарелку, полейте ложкой прохладной сметаны.',
        durationSec: 60,
        heat: 'Выключено',
        visualMarker: 'Аппетитный контраст теплого пышного сырника и густой холодной сметаны.',
        chefTip: 'Остаток пачки творога пойдет на вечерний десертный парфе без отходов.'
      }
    ],
    chefTip: 'Вторая половина пачки пойдет на парфе или перекус.'
  },
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
    tags: ['Перекус', 'Легкое', 'Zero-Waste'],
    equipment: ['Блендер или венчик', 'Стеклянный стакан / бокал', 'Чайная ложка'],
    isBatchable: false,
    batchLabel: 'Остаток творога',
    chainRole: 'consumer',
    linkedIngredient: 'ing_curd_5',
    baseIngredients: [
      { id: 'ing_curd_5', name: 'Творог 5% (остаток пачки)', gramsPerPerson: 90, category: 'Молочные продукты' },
      { id: 'ing_berries', name: 'Ягоды свежие/мороженые', gramsPerPerson: 60, category: 'Овощи и зелень' },
      { id: 'ing_sugar', name: 'Сахар / подсластитель', gramsPerPerson: 15, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Взбивание нежного творожного мусса',
        instruction: 'Оставшуюся половину пачки творога переложите в чашу. Добавьте 1 ст. л. теплой воды или молока и мед/сахар. Взбейте блендером 45 секунд до кремовой текстуры суфле.',
        durationSec: 120,
        heat: null,
        visualMarker: 'Гладкая блестящая текстура без зернистости, похожая на сливочный крем.',
        chefTip: 'Капля жидкости помогает сухому творогу мгновенно превратиться в нежнейший десерт.'
      },
      {
        stepNumber: 2,
        title: 'Послойная ресторанная сборка',
        instruction: 'В прозрачный стакан выложите слой ягод, затем слой творожного крема, повторите еще раз. Верх украсьте цельными ягодами.',
        durationSec: 120,
        heat: null,
        visualMarker: 'Красивые контрастные полосы белого крема и ярких рубиновых ягод.',
        chefTip: 'Идеальный белковый перекус за 5 минут без включения плиты.'
      }
    ],
    chefTip: 'Ни один грамм открытого творога не пропадет.'
  },
  {
    id: 'rec_wok_rice',
    title: 'Жареный рис «Wok Style» со сквозным гарниром',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко (для новичка)',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 15,
    calories: 420,
    proteins: 14,
    fats: 11,
    carbs: 64,
    tags: ['Обед', 'Сквозной гарнир', 'Быстро'],
    equipment: ['Широкая сковорода или вок', 'Деревянная лопатка', 'Миска для яйца'],
    isBatchable: false,
    batchLabel: 'Сквозной рис',
    chainRole: 'consumer',
    linkedIngredient: 'ing_rice',
    baseIngredients: [
      { id: 'ing_rice', name: 'Отварной рис (вчерашняя заготовка)', gramsPerPerson: 150, category: 'Бакалея', isSharedSide: true },
      { id: 'ing_eggs', name: 'Яйца куриные С1', gramsPerPerson: 50, category: 'Молочные продукты' },
      { id: 'ing_carrots', name: 'Морковь соломкой', gramsPerPerson: 40, category: 'Овощи и зелень' },
      { id: 'ing_soya', name: 'Соевый соус', gramsPerPerson: 15, category: 'Бакалея', isPantry: true }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Подготовка вчерашнего риса',
        instruction: 'Достаньте из холодильника отваренный ранее рис. Разомните его пальцами или вилкой прямо в контейнере, чтобы рисинки легко отделялись друг от друга.',
        durationSec: 60,
        heat: null,
        visualMarker: 'Холодные рассыпчатые зерна без слипшихся плотных комков.',
        chefTip: 'Секрет азиатских поваров: только холодный вчерашний рис дает идеальную рассыпчатость в воке.'
      },
      {
        stepNumber: 2,
        title: 'Обжарка яичного скрэмбла и моркови',
        instruction: 'Раскалите сковороду на сильном огне (7 из 9) с 1 ст. л. масла. Вылейте яйцо, интенсивно помешивая лопаткой 30 секунд. Сдвиньте яйцо к краю, всыпьте тонко нарезанную соломкой морковь и жарьте еще 1 минуту.',
        durationSec: 120,
        heat: 'Сильный огонь (7 из 9)',
        visualMarker: 'Яйцо превратилось в нежные золотистые кусочки, морковь слегка заблестела.',
        chefTip: 'Высокая температура не дает овощам тушиться, сохраняя приятный хруст.'
      },
      {
        stepNumber: 3,
        title: 'Обжарка риса с соевым соусом',
        instruction: 'Всыпьте рис к яйцу и моркови. Жарьте, непрерывно помешивая лопаткой, 2.5 минуты. Полейте по краю сковороды 1 ст. л. соевого соуса, быстро перемешайте до ровного цвета.',
        durationSec: 180,
        heat: 'Сильный огонь (7 из 9)',
        visualMarker: 'Характерное потрескивание риса на раскаленной сковороде и карамельный цвет.',
        chefTip: 'Лить соевый соус на раскаленный край сковороды, а не прямо на рис — так соус карамелизуется и дает дымный аромат вока.'
      }
    ],
    chefTip: 'Холодный рис из холодильника в воке получается максимально рассыпчатым!'
  },
  {
    id: 'rec_beef_pasta',
    title: 'Паста пенне с говяжьим фаршем и томатами',
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Легко (для новичка)',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 22,
    calories: 460,
    proteins: 36,
    fats: 15,
    carbs: 45,
    tags: ['Паста', 'Говядина', 'Без лука', 'Без грибов'],
    equipment: ['Кастрюля для пасты 2.5 л', 'Глубокая сковорода сотейник', 'Деревянная лопатка'],
    isBatchable: true,
    batchLabel: 'Сытный обед',
    chainRole: 'initiator',
    linkedIngredient: 'ing_beef_mince',
    baseIngredients: [
      { id: 'ing_beef_mince', name: 'Фарш из говядины охлажденный', gramsPerPerson: 140, category: 'Мясо и птица' },
      { id: 'ing_pasta_penne', name: 'Паста пенне твердых сортов', gramsPerPerson: 75, category: 'Бакалея' },
      { id: 'ing_tomatoes', name: 'Томаты свежие спелые', gramsPerPerson: 80, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка пасты аль денте',
        instruction: 'Вскипятите 2 л подсоленной воды. Всыпьте пенне и варите на 1 минуту меньше, чем указано на упаковке (обычно ровно 9 минут). Обязательно сохраните полстакана крахмальной воды от пасты перед сливом.',
        durationSec: 540,
        heat: 'Сильный огонь (8 из 9)',
        visualMarker: 'Паста упругая при надкусывании, сохраняет твердую сердцевину.',
        chefTip: 'Крахмальная вода от пасты — главный секрет шефов для получения шелковистого ресторанного соуса.'
      },
      {
        stepNumber: 2,
        title: 'Обжаривание говяжьего фарша',
        instruction: 'Разогрейте сотейник на среднем огне (6 из 9). Выложите фарш, разбивая комочки лопаткой. Обжаривайте 5 минут, пока мясо полностью не поменяет цвет с розового на серо-коричневый.',
        durationSec: 300,
        heat: 'Средне-сильный огонь (6 из 9)',
        visualMarker: 'Выделившийся мясной сок испаряется, фарш начинает аппетитно подрумяниваться.',
        chefTip: 'Разбивайте фарш ребром деревянной лопатки, чтобы частицы были мелкими и однородными.'
      },
      {
        stepNumber: 3,
        title: 'Ввод томатов и объединение соуса',
        instruction: 'Томаты нарежьте мелким кубиком и отправьте к мясу. Тушите 4 минуты. Влейте 3 ст. л. воды от варки пасты, добавьте отваренные пенне и энергично перемешивайте 1 минуту.',
        durationSec: 300,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Соус полностью обволакивает каждую трубочку пенне плотной глянцевой пленкой.',
        chefTip: 'Блюдо не содержит лука и чеснока, но благодаря спелым томатам имеет глубокий насыщенный вкус.'
      }
    ],
    chefTip: 'Сытное итальянское блюдо без лука и чеснока.'
  },
  {
    id: 'rec_oatmeal',
    title: 'Овсяная каша на молоке с яблоком и корицей',
    imageUrl: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 12,
    calories: 310,
    proteins: 11,
    fats: 7,
    carbs: 51,
    tags: ['Завтрак', 'Злаки'],
    equipment: ['Небольшой сотейник с толстым дном', 'Венчик или ложка', 'Нож'],
    isBatchable: false,
    batchLabel: 'Базовый завтрак',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_oats', name: 'Овсяные хлопья длительной варки', gramsPerPerson: 60, category: 'Бакалея' },
      { id: 'ing_milk', name: 'Молоко пастеризованное 2.5%', gramsPerPerson: 200, category: 'Молочные продукты' },
      { id: 'ing_apples', name: 'Яблоки сезонные', gramsPerPerson: 90, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Прогрев молока с овсянкой',
        instruction: 'В сотейник налейте молоко и 50 мл воды, добавьте щепотку соли. Доведите почти до закипания, всыпьте овсяные хлопья. Убавьте огонь до минимума (2 из 9).',
        durationSec: 180,
        heat: 'Слабый огонь (2 из 9)',
        visualMarker: 'Мелкие пузырьки по краям сотейника без бурного выкипания молока.',
        chefTip: 'Щепотка соли обязательна даже для сладкой каши — она усиливает сливочный вкус.'
      },
      {
        stepNumber: 2,
        title: 'Томление до кремовой текстуры',
        instruction: 'Варите 8 минут, периодически помешивая со дна сотейника. Хлопья длительной варки сохранят форму и структуру.',
        durationSec: 480,
        heat: 'Слабый огонь (2 из 9)',
        visualMarker: 'Каша станет густой и кремовой, лениво опадая с ложки.',
        chefTip: 'Хлопья «Монастырские» или «Геркулес» дают долгое насыщение без резких скачков сахара.'
      },
      {
        stepNumber: 3,
        title: 'Подача со свежими дольками яблока',
        instruction: 'Переложите кашу в миску. Яблоко нарежьте тонкими лепестками или соломкой и разложите веером сверху.',
        durationSec: 120,
        heat: 'Выключено',
        visualMarker: 'Теплая каша и хрустящие прохладные дольки кисло-сладкого яблока.',
        chefTip: 'Свежее яблоко дает приятный контраст хруста с нежной кашей.'
      }
    ],
    chefTip: 'Сложные углеводы обеспечивают энергию на 4-5 часов.'
  },
  {
    id: 'rec_omelette',
    title: 'Пышный омлет с томатами и зеленью',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'breakfast',
    courseType: 'breakfast',
    prepTimeMin: 15,
    calories: 280,
    proteins: 20,
    fats: 16,
    carbs: 12,
    tags: ['Завтрак', 'Без глютена', 'Без лактозы'],
    equipment: ['Сковорода 20–24 см с прозрачной крышкой', 'Вилка или венчик', 'Лопатка'],
    isBatchable: false,
    batchLabel: 'Быстрый белок',
    chainRole: 'independent',
    baseIngredients: [
      { id: 'ing_eggs', name: 'Яйца куриные С1 (2 шт)', gramsPerPerson: 100, category: 'Молочные продукты' },
      { id: 'ing_tomatoes', name: 'Томаты свежие', gramsPerPerson: 70, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Укроп свежий', gramsPerPerson: 10, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Взбивание яичной смеси',
        instruction: 'Разбейте яйца в миску, добавьте щепотку соли. Взбейте вилкой энергичными движениями в течение 40 секунд до появления легкой пены.',
        durationSec: 60,
        heat: null,
        visualMarker: 'Белок и желток полностью соединились в однородную текучую желтую массу.',
        chefTip: 'Не нужно взбивать миксером — вилки достаточно, чтобы омлет не стал резиновым.'
      },
      {
        stepNumber: 2,
        title: 'Подрумянивание томатов',
        instruction: 'Томаты нарежьте кружками толщиной 5 мм. Смажьте сковороду каплей масла, выложите томаты и прогрейте на умеренном огне (5 из 9) по 1 минуте с каждой стороны.',
        durationSec: 120,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Томаты стали мягче и пустили сладкий сок на дно сковороды.',
        chefTip: 'Предварительный прогрев томатов убирает избыточную водянистость.'
      },
      {
        stepNumber: 3,
        title: 'Заливка и томление под крышкой',
        instruction: 'Залейте томаты яйцами, посыпьте рубленым укропом. Сразу накройте плотной крышкой, убавьте огонь до тихого (3 из 9) и готовьте 5–6 минут, не открывая крышку.',
        durationSec: 360,
        heat: 'Слабый огонь (3 из 9)',
        visualMarker: 'Верх омлета стал матовым и сухим, омлет пышно поднялся.',
        chefTip: 'Пар под крышкой равномерно пропекает яйца сверху без необходимости переворачивать омлет.'
      }
    ],
    chefTip: 'Легкий высокобелковый завтрак без глютена.'
  },
  {
    id: 'rec_beef_stroganoff',
    title: 'Томленая говядина по-строгановски с пюре',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Средняя',
    mealType: 'dinner',
    courseType: 'main',
    prepTimeMin: 45,
    calories: 490,
    proteins: 38,
    fats: 22,
    carbs: 34,
    tags: ['Мясо', 'Сытное'],
    equipment: ['Тяжелая сковорода сотейник с крышкой', 'Кастрюля для картофеля', 'Толкушка для пюре'],
    isBatchable: true,
    batchLabel: 'Готовка на 2 дня',
    chainRole: 'initiator',
    linkedIngredient: 'ing_beef_stew',
    baseIngredients: [
      { id: 'ing_beef_stew', name: 'Говядина духовая лоток', gramsPerPerson: 180, category: 'Мясо и птица' },
      { id: 'ing_mushrooms', name: 'Шампиньоны свежие', gramsPerPerson: 70, category: 'Овощи и зелень' },
      { id: 'ing_sour_cream', name: 'Сметана 15%', gramsPerPerson: 40, category: 'Молочные продукты' },
      { id: 'ing_potatoes', name: 'Картофель отборный', gramsPerPerson: 180, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Правильная нарезка брусочками',
        instruction: 'Говядину обсушите полотенцем. Нарежьте поперек волокон на пластины толщиной 1 см, а затем на тонкие продолговатые брусочки длиной 4–5 см.',
        durationSec: 300,
        heat: null,
        visualMarker: 'Тонкие аккуратные мясные полоски одинакового размера.',
        chefTip: 'Нарезка строго поперек волокон — единственный способ получить мягкую нежную говядину.'
      },
      {
        stepNumber: 2,
        title: 'Быстрая обжарка на сильном огне',
        instruction: 'Раскалите сотейник с 1 ст. л. масла на максимальном огне (8 из 9). Выложите мясо в один слой и быстро обжарьте 3 минуты, помешивая.',
        durationSec: 180,
        heat: 'Максимальный огонь (8 из 9)',
        visualMarker: 'Мясо быстро «запечаталось» румяной корочкой со всех сторон.',
        chefTip: 'Не тушите на слабом огне, иначе мясо выделит весь сок и станет сухим.'
      },
      {
        stepNumber: 3,
        title: 'Томление со сметаной и грибами',
        instruction: 'Добавьте нарезанные пластинками шампиньоны, сметану и 70 мл горячей воды. Накройте крышкой, убавьте огонь до минимального (2 из 9) и томите 25 минут.',
        durationSec: 1500,
        heat: 'Тихий огонь (2 из 9)',
        visualMarker: 'Густой сливочно-коричневый соус и тающее во рту мясо.',
        chefTip: 'Длительное томление в сметанном соусе делает говядину невероятно мягкой.'
      },
      {
        stepNumber: 4,
        title: 'Приготовление воздушного картофельного пюре',
        instruction: 'Отварите очищенный картофель в подсоленной воде 20 минут. Слейте воду, разомните толкушкой со сливочным маслом из Pantry.',
        durationSec: 1200,
        heat: 'Средний огонь (5 из 9)',
        visualMarker: 'Пюре воздушное, без комков, держит форму на тарелке.',
        chefTip: 'Подавайте томленую говядину прямо поверх горячего пюре.'
      }
    ],
    chefTip: 'На второй день томленая говядина становится еще насыщеннее!'
  },
  {
    id: 'rec_buckwheat_mushrooms',
    title: 'Гречневая каша с грибами и травами',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    difficulty: 'Очень легко',
    mealType: 'lunch',
    courseType: 'main',
    prepTimeMin: 20,
    calories: 330,
    proteins: 12,
    fats: 8,
    carbs: 52,
    tags: ['Обед', 'Гречка', 'Zero-Waste'],
    equipment: ['Кастрюля с толстым дном', 'Сковорода для грибов', 'Лопатка'],
    isBatchable: false,
    batchLabel: 'Остаток грибов',
    chainRole: 'consumer',
    linkedIngredient: 'ing_mushrooms',
    baseIngredients: [
      { id: 'ing_buckwheat', name: 'Гречневая крупа ядрица', gramsPerPerson: 70, category: 'Бакалея' },
      { id: 'ing_mushrooms', name: 'Шампиньоны (остаток лотка)', gramsPerPerson: 70, category: 'Овощи и зелень' },
      { id: 'ing_dill', name: 'Свежая зелень', gramsPerPerson: 15, category: 'Овощи и зелень' }
    ],
    detailedSteps: [
      {
        stepNumber: 1,
        title: 'Варка рассыпчатой гречки',
        instruction: 'Промойте гречку. Залейте холодной водой в пропорции 1:2 (на 140 г гречки — 280 мл воды), добавьте соль. Доведите до кипения, плотно накройте крышкой и варите на тихом огне (3 из 9) 15 минут.',
        durationSec: 900,
        heat: 'Тихий огонь (3 из 9)',
        visualMarker: 'Вода полностью впиталась, крупинки раскрылись и рассыпаются.',
        chefTip: 'Не открывайте крышку во время варки, чтобы пар равномерно прогрел крупу.'
      },
      {
        stepNumber: 2,
        title: 'Обжарка оставшихся шампиньонов',
        instruction: 'Оставшуюся часть лотка грибов нарежьте четвертинками. Обжарьте на сухой раскаленной сковороде 2 минуты, затем добавьте 1 ч. л. масла и жарьте еще 3 минуты до румяности.',
        durationSec: 300,
        heat: 'Средне-сильный огонь (6 из 9)',
        visualMarker: 'Грибы приобрели золотистую корочку и характерный ореховый аромат.',
        chefTip: 'Обжарка сначала на сухой сковороде позволяет грибам быстро испарить лишнюю влагу.'
      },
      {
        stepNumber: 3,
        title: 'Смешивание и подача',
        instruction: 'Переложите обжаренные грибы в горячую гречневую кашу, добавьте рубленую зелень и аккуратно перемешайте.',
        durationSec: 120,
        heat: 'Выключено',
        visualMarker: 'Глянцевые румяные грибы на фоне рассыпчатой гречневой крупы.',
        chefTip: 'Лоток грибов израсходован полностью без остатков в холодильнике!'
      }
    ],
    chefTip: 'Идеальная утилизация открытого лотка шампиньонов.'
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
  ing_curd_5: { name: 'Творог 5% пачка', packWeight: 360, unit: 'г', storageDays: 4, category: 'Молочные продукты', isByWeight: false },
  ing_eggs: { name: 'Яйца куриные С1 десяток', packWeight: 10, unit: 'шт', storageDays: 25, category: 'Молочные продукты', isByWeight: false },
  ing_milk: { name: 'Молоко 2.5% бутылка', packWeight: 930, unit: 'мл', storageDays: 6, category: 'Молочные продукты', isByWeight: false },
  ing_sour_cream: { name: 'Сметана 15% стакан', packWeight: 300, unit: 'г', storageDays: 10, category: 'Молочные продукты', isByWeight: false },
  ing_rice: { name: 'Рис Жасмин упаковка', packWeight: 800, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_buckwheat: { name: 'Гречневая крупа ядрица', packWeight: 800, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_lentils: { name: 'Чечевица красная пачка', packWeight: 450, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_pasta_penne: { name: 'Паста пенне пачка', packWeight: 450, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_noodles: { name: 'Лапша яичная пачка', packWeight: 400, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_oats: { name: 'Овсяные хлопья коробка', packWeight: 500, unit: 'г', storageDays: 180, category: 'Бакалея', isByWeight: false },
  ing_oil: { name: 'Масло растительное / оливковое', packWeight: 800, unit: 'мл', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_flour: { name: 'Мука пшеничная в/с', packWeight: 1000, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_sugar: { name: 'Сахар-песок пачка', packWeight: 1000, unit: 'г', storageDays: 360, category: 'Бакалея', isByWeight: false },
  ing_soya: { name: 'Соус соевый классический', packWeight: 250, unit: 'мл', storageDays: 180, category: 'Бакалея', isByWeight: false },
  ing_broccoli: { name: 'Брокколи свежая (развес)', packWeight: 1000, unit: 'г', storageDays: 5, category: 'Овощи и зелень', isByWeight: true },
  ing_mushrooms: { name: 'Шампиньоны лоток', packWeight: 400, unit: 'г', storageDays: 5, category: 'Овощи и зелень', isByWeight: false },
  ing_potatoes: { name: 'Картофель (на развес)', packWeight: 1000, unit: 'г', storageDays: 30, category: 'Овощи и зелень', isByWeight: true },
  ing_carrots: { name: 'Морковь мытая (на развес)', packWeight: 1000, unit: 'г', storageDays: 20, category: 'Овощи и зелень', isByWeight: true },
  ing_tomatoes: { name: 'Томаты свежие (на развес)', packWeight: 1000, unit: 'г', storageDays: 7, category: 'Овощи и зелень', isByWeight: true },
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
    badge: 'Эконом',
    description: 'Оптимально для базовой корзины и сезонных овощей'
  },
  {
    id: 'standard',
    name: 'Перекрёсток / Лента',
    tier: 'Стандарт',
    color: 'emerald',
    multiplier: 1.0,
    badge: 'Баланс',
    description: 'Широкий выбор охлажденного мяса и свежей зелени'
  },
  {
    id: 'premium',
    name: 'ВкусВилл',
    tier: 'Премиум / ЗОЖ',
    color: 'teal',
    multiplier: 1.28,
    badge: 'Премиум',
    description: 'Короткие сроки годности, чистый состав без консервантов'
  }
];

const BASE_ITEM_PRICES = {
  ing_turkey_breast: 440,
  ing_chicken_breast: 380,
  ing_beef_stew: 590,
  ing_beef_mince: 275,
  ing_curd_5: 145,
  ing_eggs: 125,
  ing_milk: 88,
  ing_sour_cream: 95,
  ing_rice: 135,
  ing_buckwheat: 98,
  ing_lentils: 115,
  ing_pasta_penne: 95,
  ing_noodles: 110,
  ing_oats: 92,
  ing_oil: 130,
  ing_flour: 85,
  ing_sugar: 75,
  ing_soya: 115,
  ing_broccoli: 290,
  ing_mushrooms: 140,
  ing_potatoes: 58,
  ing_carrots: 49,
  ing_tomatoes: 230,
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

    if (raw.includes('индейк')) {
      if (recipe.title.toLowerCase().includes('индейк')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('индейк'))) return false;
    } else if (raw.includes('печен')) {
      if (recipe.title.toLowerCase().includes('печен')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('печен'))) return false;
    } else if (raw.includes('гриб')) {
      if (recipe.title.toLowerCase().includes('гриб') || recipe.title.toLowerCase().includes('шампиньон')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('гриб') || i.name.toLowerCase().includes('шампиньон'))) return false;
    } else if (raw.includes('лук')) {
      if (recipe.title.toLowerCase().includes('лук')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('лук'))) return false;
    } else if (raw.includes('чеснок')) {
      if (recipe.title.toLowerCase().includes('чеснок')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('чеснок'))) return false;
    } else if (raw.includes('гречк')) {
      if (recipe.title.toLowerCase().includes('гречк')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('гречк'))) return false;
    } else if (raw.includes('кускус')) {
      if (recipe.title.toLowerCase().includes('кускус')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('кускус'))) return false;
    } else if (raw.includes('болгарск') || raw.includes('перец')) {
      if (recipe.title.toLowerCase().includes('болгарск') || recipe.title.toLowerCase().includes('сладкий перец')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('болгарск') || i.name.toLowerCase().includes('сладкий перец'))) return false;
    } else if (raw.includes('свинин')) {
      if (recipe.title.toLowerCase().includes('свинин')) return false;
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('свинин'))) return false;
    } else if (raw.includes('глютен')) {
      if (recipe.baseIngredients.some(i => i.name.toLowerCase().includes('мука') || i.name.toLowerCase().includes('лапша') || i.name.toLowerCase().includes('паста'))) return false;
    } else if (raw.includes('лактоз')) {
      if (recipe.baseIngredients.some(i => i.category === 'Молочные продукты')) return false;
    } else {
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
  const [exclusions, setExclusions] = useState(['Без свинины']);
  const [customExclusion, setCustomExclusion] = useState('');
  const [pantryList, setPantryList] = useState(DEFAULT_PANTRY_ITEMS);
  const [batchCookingEnabled, setBatchCookingEnabled] = useState(true);
  const [weightedProduceEnabled, setWeightedProduceEnabled] = useState(true);

  const [menuDays, setMenuDays] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeCookingRecipe, setActiveCookingRecipe] = useState(null);
  const [swapModalState, setSwapModalState] = useState(null);
  const [activeStoreTier, setActiveStoreTier] = useState('standard');
  const [toastMessage, setToastMessage] = useState(null);
  const [checkedBasketItems, setCheckedBasketItems] = useState({});

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

    if (activeCookingRecipe || swapModalState) {
      tg.BackButton.show();
      const handleBack = () => {
        triggerHaptic('light');
        if (activeCookingRecipe) setActiveCookingRecipe(null);
        if (swapModalState) setSwapModalState(null);
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton.offClick(handleBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [activeCookingRecipe, swapModalState]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const generateZeroWasteMenu = (shouldSwitchTab = false) => {
    const generated = [];
    const allowedRecipes = MASTER_RECIPES.filter(r => isDishAllowed(r, exclusions));

    const getRecipesFor = (mType, cType) => {
      let filtered = allowedRecipes.filter(r => {
        if (r.mealType !== mType) return false;
        if (cType && r.courseType !== cType) return false;
        return true;
      });
      if (filtered.length === 0) {
        filtered = allowedRecipes.filter(r => r.mealType === mType);
        if (filtered.length === 0) {
          filtered = MASTER_RECIPES.filter(r => r.mealType === mType && (!cType || r.courseType === cType));
        }
      }
      return filtered;
    };

    const bList = getRecipesFor('breakfast');
    const soups = getRecipesFor('lunch', 'soup');
    const mains = getRecipesFor('lunch', 'main');
    const dList = getRecipesFor('dinner', 'main');
    const sList = getRecipesFor('snack');
    
    for (let day = 1; day <= daysCount; day++) {
      const dayMeals = {};
      
      if (mealTypes.breakfast && bList.length > 0) {
        dayMeals.breakfast = bList[(day - 1) % bList.length];
      }

      if (mealTypes.lunch) {
        if (lunchMode === 'first_only' && soups.length > 0) {
          dayMeals.lunch_soup = soups[(day - 1) % soups.length];
        } else if (lunchMode === 'second_only' && mains.length > 0) {
          dayMeals.lunch_main = mains[(day - 1) % mains.length];
        } else if (lunchMode === 'both') {
          if (soups.length > 0) dayMeals.lunch_soup = soups[(day - 1) % soups.length];
          if (mains.length > 0) dayMeals.lunch_main = mains[(day - 1) % mains.length];
        }
      }

      if (mealTypes.dinner && dList.length > 0) {
        dayMeals.dinner = dList[(day - 1) % dList.length];
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
    const targetMealType = mealKey.startsWith('lunch') ? 'lunch' : mealKey;
    const targetCourse = mealKey === 'lunch_soup' ? 'soup' : mealKey === 'lunch_main' ? 'main' : null;

    const candidates = MASTER_RECIPES.filter(r => {
      if (r.id === current.id) return false;
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

        {/* Навигация по вкладкам */}
        <main className="flex-1 pb-24 overflow-y-auto">
          {currentTab === 'planner' && (
            <PlannerView
              city={city}
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
  city,
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

  const toggleExclusion = (tag) => {
    triggerHaptic('light');
    if (exclusions.includes(tag)) {
      setExclusions(exclusions.filter(t => t !== tag));
    } else {
      setExclusions([...exclusions, tag]);
    }
  };

  const addCustomExclusion = (e) => {
    e.preventDefault();
    if (!customExclusion.trim()) return;
    triggerHaptic('light');
    const formatted = customExclusion.trim().toLowerCase().startsWith('без ')
      ? customExclusion.trim()
      : `Без ${customExclusion.trim()}`;
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
          Каждое блюдо снабжено аппетитными иллюстрациями и подробными пошаговыми инструкциями: температура плиты, размеры нарезки и органолептические маркеры готовности для начинающих.
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

      {/* Исключения */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Исключения и аллергены
        </label>
        <div className="flex flex-wrap gap-1.5">
          {commonExclusionChips.map(tag => {
            const isSelected = exclusions.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleExclusion(tag)}
                className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag} {isSelected && '✕'}
              </button>
            );
          })}
        </div>

        <form onSubmit={addCustomExclusion} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customExclusion}
            onChange={(e) => setCustomExclusion(e.target.value)}
            placeholder="Свой запрет (напр. без кинзы)"
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
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
        <div>
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
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            batchCookingEnabled ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            batchCookingEnabled ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Весовые овощи */}
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
        <div>
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
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            weightedProduceEnabled ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            weightedProduceEnabled ? 'translate-x-6' : 'translate-x-0'
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
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-300">
            Итого за день (на 1 персону)
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-white font-mono">{dayTotals.cal} ккал</span>
            <span className="text-[11px] text-slate-400 font-mono">
              Б: {dayTotals.p}г • Ж: {dayTotals.f}г • У: {dayTotals.c}г
            </span>
          </div>
        </div>
        <button
          onClick={onGoToBasket}
          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5"
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
              {/* Фото блюда */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
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
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      checked
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 line-through'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {checked && <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.isWeighted && (
                            <span className="text-[9px] bg-teal-500/15 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-500/30">
                              Развес
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Нужно: <span className="font-mono text-slate-300">{item.requiredGrams} {item.unit}</span> • {item.isWeighted ? (
                            <>Взвесить: <span className="font-mono text-emerald-400 font-bold">{item.totalBought} {item.unit}</span></>
                          ) : (
                            <>Покупка: <span className="font-mono text-emerald-400 font-bold">{item.packCount} уп. ({item.totalBought} {item.unit})</span></>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
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

function SwapRecipeModal({ swapData, exclusions, onClose, onSelectRecipe }) {
  const { mealKey, recipe: currentRecipe } = swapData;
  const targetMealType = mealKey.startsWith('lunch') ? 'lunch' : mealKey;
  const targetCourse = mealKey === 'lunch_soup' ? 'soup' : mealKey === 'lunch_main' ? 'main' : null;

  const alternatives = MASTER_RECIPES.filter(r => {
    if (r.id === currentRecipe.id) return false;
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
