/**
 * The whole menu — the single source of truth for cards, the dish modal,
 * the cart, WhatsApp messages and Google structured data.
 *
 * Items and prices: the restaurant's published menu on tailandi.company (read 2026-10-30).
 * Descriptions and ingredients: written for this redesign — owner should review the wording.
 *
 * To add a dish, add one object to `dishes`. To change a price, edit `price`
 * (or the `sizes` prices). `price: 0` shows «السعر عند الطلب».
 */

export type Category =
  | 'shawarma'
  | 'eastern'
  | 'grills'
  | 'sandwiches'
  | 'pizza'
  | 'fries'
  | 'salads'
  | 'desserts'
  | 'cold-drinks'
  | 'hot-drinks';

export type CategoryIcon = 'shawarma' | 'eastern' | 'grill' | 'sandwich' | 'pizza' | 'fries' | 'salad' | 'dessert' | 'cold' | 'hot';

export interface CategoryInfo {
  id: Category;
  nameAr: string;
  nameEn: string;
  icon: CategoryIcon;
  /** Optional note shown under the section title. */
  noteAr?: string;
  noteEn?: string;
}

export interface PriceOption {
  label: string;
  labelEn?: string;
  /** Size/variant: the full price. Extra: the added price (0 = free preference, e.g. "بدون بصل"). */
  price: number;
}

export interface Dish {
  id: string;
  category: Category;
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  /** In NIS (₪). For dishes with `sizes`, the starting (lowest) price. */
  price: number;
  sizes?: PriceOption[];
  extras?: PriceOption[];
  /** Your own photo, e.g. '/images/dishes/shawarma-souri.webp'. Leave out to use the demo photo. */
  image?: string;
  spiceLevel?: 0 | 1 | 2 | 3;
  vegetarian?: boolean;
  badge?: 'new' | 'popular' | 'chef';
  prepTimeMin?: number;
  calories?: number;
  ingredients?: string[];
  allergensAr?: string;
}

export const categories: CategoryInfo[] = [
  { id: 'shawarma', nameAr: 'الشاورما', nameEn: 'Shawarma', icon: 'shawarma' },
  {
    id: 'eastern',
    nameAr: 'الأكلات الشرقية',
    nameEn: 'Eastern Dishes',
    icon: 'eastern',
    noteAr: 'تُطلب الأصناف الشرقية قبل يوم من موعدها.',
    noteEn: 'Eastern dishes are ordered one day in advance.',
  },
  { id: 'grills', nameAr: 'المشاوي', nameEn: 'Grills', icon: 'grill' },
  { id: 'sandwiches', nameAr: 'سندويشات غربي', nameEn: 'Western Sandwiches', icon: 'sandwich' },
  { id: 'pizza', nameAr: 'البيتزا', nameEn: 'Pizza', icon: 'pizza' },
  { id: 'fries', nameAr: 'الشيبسي', nameEn: 'Fries', icon: 'fries' },
  { id: 'salads', nameAr: 'السلطات', nameEn: 'Salads', icon: 'salad' },
  { id: 'desserts', nameAr: 'الحلويات', nameEn: 'Desserts', icon: 'dessert' },
  { id: 'cold-drinks', nameAr: 'المشروبات الباردة', nameEn: 'Cold Drinks', icon: 'cold' },
  { id: 'hot-drinks', nameAr: 'المشروبات الساخنة', nameEn: 'Hot Drinks', icon: 'hot' },
];

/** Free order preferences reused across dishes (price 0 = no extra charge). */
const sandwichNotes: PriceOption[] = [
  { label: 'بدون بصل', labelEn: 'No onion', price: 0 },
  { label: 'بدون مخلل', labelEn: 'No pickles', price: 0 },
  { label: 'حار', labelEn: 'Make it spicy', price: 0 },
];
const coffeeNotes: PriceOption[] = [
  { label: 'بدون سكر', labelEn: 'No sugar', price: 0 },
  { label: 'سكر خفيف', labelEn: 'Light sugar', price: 0 },
  { label: 'سكر زيادة', labelEn: 'Extra sugar', price: 0 },
];

export const dishes: Dish[] = [
  // ───────────── الشاورما ─────────────
  {
    id: 'shawarma-farshouha',
    category: 'shawarma',
    nameAr: 'فرشوحة شاورما',
    nameEn: 'Shawarma Farshouha',
    descriptionAr: 'خبز فرشوحة محمّص محشو بشاورما الدجاج المتبّلة مع الثومية والمخلل والبطاطا.',
    descriptionEn: 'Toasted farshouha bread stuffed with spiced chicken shawarma, garlic sauce, pickles and fries.',
    price: 25,
    sizes: [
      { label: 'عادي', labelEn: 'Regular', price: 25 },
      { label: 'دبل', labelEn: 'Double', price: 27 },
      { label: 'دبل دبل', labelEn: 'Double double', price: 30 },
      { label: 'دبل لحمة', labelEn: 'Double meat', price: 30 },
    ],
    extras: sandwichNotes,
    ingredients: ['شاورما دجاج', 'خبز فرشوحة', 'ثومية', 'مخلل', 'بطاطا'],
  },
  {
    id: 'shawarma-souri',
    category: 'shawarma',
    nameAr: 'سوري شاورما',
    nameEn: 'Syrian Shawarma',
    descriptionAr: 'شاورما على الطريقة السورية ملفوفة بخبز رقيق ومقطّعة، تُقدّم مع الثومية والبطاطا.',
    descriptionEn: 'Syrian-style shawarma rolled in thin bread and sliced, served with garlic sauce and fries.',
    price: 35,
    badge: 'popular', // TODO: owner confirms best-sellers
    extras: sandwichNotes,
    ingredients: ['شاورما دجاج', 'خبز صاج', 'ثومية', 'مخلل', 'بطاطا'],
  },
  {
    id: 'shawarma-safiha',
    category: 'shawarma',
    nameAr: 'صفيحة شاورما',
    nameEn: 'Shawarma Platter',
    descriptionAr: 'صينية شاورما سخية مع البطاطا والثومية والمخللات والخبز — مثالية للمشاركة.',
    descriptionEn: 'A generous shawarma platter with fries, garlic sauce, pickles and bread — made for sharing.',
    price: 40,
    extras: sandwichNotes,
    ingredients: ['شاورما دجاج', 'بطاطا', 'ثومية', 'مخللات', 'خبز'],
  },
  {
    id: 'shawarma-asawer',
    category: 'shawarma',
    nameAr: 'شاورما أساور',
    nameEn: 'Shawarma Bracelets',
    descriptionAr: 'لفائف شاورما صغيرة مقرمشة مقطّعة كالأساور، مع صوص الثومية.',
    descriptionEn: 'Crispy mini shawarma rolls cut into rings, served with garlic sauce.',
    price: 40,
    extras: sandwichNotes,
    ingredients: ['شاورما دجاج', 'خبز', 'جبنة', 'ثومية'],
  },

  // ───────────── الأكلات الشرقية ─────────────
  {
    id: 'chicken-rice',
    category: 'eastern',
    nameAr: 'دجاج + أرز',
    nameEn: 'Chicken & Rice',
    descriptionAr: 'دجاج متبّل ومحمّر على طبق أرز بالبهارات الشرقية والمكسرات.',
    descriptionEn: 'Spiced roasted chicken on a bed of eastern-spiced rice with nuts.',
    price: 80,
    ingredients: ['دجاج', 'أرز', 'بهارات شرقية', 'مكسرات'],
  },
  {
    id: 'meat-tagine',
    category: 'eastern',
    nameAr: 'طاجن باللحمة',
    nameEn: 'Meat Tagine',
    descriptionAr: 'كيلو لحمة مطهوّة ببطء مع الخضار في الطاجن حتى تذوب في الفم.',
    descriptionEn: 'A kilo of meat slow-cooked with vegetables in a clay tagine.',
    price: 150,
    ingredients: ['كيلو لحمة', 'بطاطا', 'بندورة', 'بصل', 'فلفل'],
  },
  {
    id: 'fatteh-gazawiya',
    category: 'eastern',
    nameAr: 'فتة غزاوية',
    nameEn: 'Gazan Fatteh',
    descriptionAr: 'طبق غزة الأصيل: خبز مقرمش وأرز ومرق، تعلوه قطع الدجاج أو اللحمة والمكسرات.',
    descriptionEn: 'The Gaza classic: crisp bread, rice and broth topped with chicken or meat and nuts.',
    price: 150,
    sizes: [
      { label: 'بالدجاج', labelEn: 'With chicken', price: 150 },
      { label: 'باللحمة', labelEn: 'With meat', price: 150 },
    ],
    badge: 'popular', // TODO: owner confirms best-sellers
    ingredients: ['خبز محمّص', 'أرز', 'مرق', 'دجاج أو لحمة', 'مكسرات'],
  },
  {
    id: 'smoked-meat',
    category: 'eastern',
    nameAr: 'لحم مدخن',
    nameEn: 'Smoked Meat',
    descriptionAr: 'كيلو لحم مدخّن طري بنكهة عميقة، يُقدّم مع الأرز.',
    descriptionEn: 'A kilo of tender, deeply flavoured smoked meat served with rice.',
    price: 150,
    ingredients: ['كيلو لحم مدخن', 'أرز', 'بهارات'],
  },

  // ───────────── المشاوي ─────────────
  {
    id: 'mashawi-meal',
    category: 'grills',
    nameAr: 'وجبة مشاوي',
    nameEn: 'Mixed Grill Meal',
    descriptionAr: 'تشكيلة مشاوي مع البطاطا والسلطات والخبز.',
    descriptionEn: 'An assortment of grilled meats with fries, salads and bread.',
    price: 40,
    ingredients: ['مشاوي مشكلة', 'بطاطا', 'سلطات', 'خبز'],
  },
  {
    id: 'shish-tawook',
    category: 'grills',
    nameAr: 'شيش طاووق',
    nameEn: 'Shish Tawook',
    descriptionAr: 'أسياخ صدر دجاج متبّلة باللبن والليمون والثوم، مشوية حتى الذهبي.',
    descriptionEn: 'Chicken breast skewers marinated in yogurt, lemon and garlic, grilled golden.',
    price: 35,
    ingredients: ['صدر دجاج', 'لبن', 'ليمون', 'ثوم', 'بطاطا'],
  },
  {
    id: 'kebab-meal',
    category: 'grills',
    nameAr: 'وجبة كباب',
    nameEn: 'Kebab Meal',
    descriptionAr: 'كباب لحم مفروم بالبقدونس والبصل مشوي على الأسياخ، مع البطاطا والسلطة.',
    descriptionEn: 'Minced meat kebab with parsley and onion, grilled on skewers, with fries and salad.',
    price: 30,
    ingredients: ['لحم مفروم', 'بقدونس', 'بصل', 'بطاطا', 'سلطة'],
  },
  {
    id: 'mashab-meal',
    category: 'grills',
    nameAr: 'وجبة مسحب',
    nameEn: 'Mashab Meal',
    descriptionAr: 'قطع دجاج مسحب مقرمشة من الخارج وطرية من الداخل، مع البطاطا والصوصات.',
    descriptionEn: 'Crispy-outside, tender-inside chicken strips with fries and dips.',
    price: 45,
    ingredients: ['دجاج مسحب', 'بطاطا', 'ثومية', 'كاتشب'],
  },
  {
    id: 'spicy-meal',
    category: 'grills',
    nameAr: 'سبايسي',
    nameEn: 'Spicy Meal',
    descriptionAr: 'دجاج بتتبيلة حارة جريئة لعشّاق الحار، مع البطاطا والصوص.',
    descriptionEn: 'Chicken in a bold hot marinade for spice lovers, with fries and sauce.',
    price: 35,
    spiceLevel: 3,
    ingredients: ['دجاج', 'تتبيلة حارة', 'بطاطا', 'صوص'],
  },
  {
    id: 'thailandi-meal',
    category: 'grills',
    nameAr: 'وجبة التايلندي',
    nameEn: 'Thailandi Signature Meal',
    descriptionAr: 'وجبة البيت التي تحمل اسم المطعم — اسألنا عن مكوّنات اليوم.',
    descriptionEn: 'The house meal named after the restaurant — ask us what goes in it today.',
    price: 35,
    badge: 'chef',
    ingredients: ['دجاج', 'بطاطا', 'صوص التايلندي', 'سلطة'],
  },

  // ───────────── سندويشات غربي ─────────────
  {
    id: 'chicken-stroganoff',
    category: 'sandwiches',
    nameAr: 'تشيكن ستروغانوف',
    nameEn: 'Chicken Stroganoff',
    descriptionAr: 'شرائح دجاج بصوص الكريمة والفطر في خبز طري.',
    descriptionEn: 'Chicken strips in a creamy mushroom sauce on soft bread.',
    price: 27,
    extras: sandwichNotes,
    ingredients: ['دجاج', 'كريمة', 'فطر', 'خبز'],
  },
  {
    id: 'chicken-pizza-sandwich',
    category: 'sandwiches',
    nameAr: 'تشيكن بيتزا',
    nameEn: 'Chicken Pizza Sandwich',
    descriptionAr: 'دجاج بصوص البيتزا والجبنة الذائبة والزيتون.',
    descriptionEn: 'Chicken with pizza sauce, melted cheese and olives.',
    price: 27,
    extras: sandwichNotes,
    ingredients: ['دجاج', 'صوص بيتزا', 'جبنة موزاريلا', 'زيتون'],
  },
  {
    id: 'chicken-fajita',
    category: 'sandwiches',
    nameAr: 'فاهيتا دجاج',
    nameEn: 'Chicken Fajita',
    descriptionAr: 'دجاج متبّل بالفلفل الملوّن والبصل على الطريقة المكسيكية.',
    descriptionEn: 'Seasoned chicken with peppers and onions, Mexican style.',
    price: 27,
    spiceLevel: 1,
    extras: sandwichNotes,
    ingredients: ['دجاج', 'فلفل ملوّن', 'بصل', 'جبنة'],
  },
  {
    id: 'chicken-corn',
    category: 'sandwiches',
    nameAr: 'دجاج بالذرة',
    nameEn: 'Chicken & Corn',
    descriptionAr: 'دجاج مع الذرة الحلوة والمايونيز والجبنة.',
    descriptionEn: 'Chicken with sweet corn, mayo and cheese.',
    price: 27,
    extras: sandwichNotes,
    ingredients: ['دجاج', 'ذرة', 'مايونيز', 'جبنة'],
  },
  {
    id: 'escalope',
    category: 'sandwiches',
    nameAr: 'اسكالوب بانيه بالجبن',
    nameEn: 'Cheese Escalope',
    descriptionAr: 'صدر دجاج بانيه مقرمش مع الجبنة الذائبة والخس.',
    descriptionEn: 'Crispy breaded chicken breast with melted cheese and lettuce.',
    price: 27,
    extras: sandwichNotes,
    ingredients: ['صدر دجاج بانيه', 'جبنة', 'خس', 'مايونيز'],
  },
  {
    id: 'fried-chicken',
    category: 'sandwiches',
    nameAr: 'فرايد تشيكن',
    nameEn: 'Fried Chicken',
    descriptionAr: 'دجاج مقلي مقرمش بالبهارات مع الخس والصوص.',
    descriptionEn: 'Crunchy spiced fried chicken with lettuce and sauce.',
    price: 30,
    extras: sandwichNotes,
    ingredients: ['دجاج مقلي', 'خس', 'صوص'],
  },
  {
    id: 'escalopini',
    category: 'sandwiches',
    nameAr: 'اسكالوبيني',
    nameEn: 'Escalopini',
    descriptionAr: 'شرائح دجاج رقيقة بصوص الكريمة والفطر.',
    descriptionEn: 'Thin chicken escalopes in a creamy mushroom sauce.',
    price: 30,
    extras: sandwichNotes,
    ingredients: ['دجاج', 'كريمة', 'فطر', 'جبنة'],
  },
  {
    id: 'beef-burger',
    category: 'sandwiches',
    nameAr: 'بيف برجر بالجبنة',
    nameEn: 'Beef Cheeseburger',
    descriptionAr: 'قطعة لحم مشوية مع شريحة جبنة شيدر والخس والبندورة.',
    descriptionEn: 'Grilled beef patty with cheddar, lettuce and tomato.',
    price: 27,
    extras: sandwichNotes,
    ingredients: ['لحم بقري', 'جبنة شيدر', 'خس', 'بندورة', 'خبز برجر'],
  },
  {
    id: 'smash-burger',
    category: 'sandwiches',
    nameAr: 'سماش برجر',
    nameEn: 'Smash Burger',
    descriptionAr: 'برجر مضغوط على الصاج بحواف مقرمشة، جبنة ذائبة وصوص خاص.',
    descriptionEn: 'Griddle-smashed patties with crispy edges, melted cheese and special sauce.',
    price: 45,
    badge: 'popular', // TODO: owner confirms best-sellers
    extras: sandwichNotes,
    ingredients: ['لحم بقري', 'جبنة شيدر', 'بصل', 'مخلل', 'صوص خاص'],
  },
  {
    id: 'souri-zinger',
    category: 'sandwiches',
    nameAr: 'سوري زنجر',
    nameEn: 'Syrian Zinger',
    descriptionAr: 'دجاج زنجر حار ومقرمش ملفوف بالطريقة السورية ومقطّع.',
    descriptionEn: 'Hot, crispy zinger chicken rolled Syrian-style and sliced.',
    price: 35,
    spiceLevel: 2,
    extras: sandwichNotes,
    ingredients: ['دجاج زنجر', 'خبز صاج', 'ثومية', 'مخلل'],
  },
  {
    id: 'souri-mashab',
    category: 'sandwiches',
    nameAr: 'سوري مسحب',
    nameEn: 'Syrian Mashab',
    descriptionAr: 'دجاج مسحب مقرمش ملفوف بالخبز ومقطّع مع الثومية.',
    descriptionEn: 'Crispy chicken strips rolled in bread and sliced, with garlic sauce.',
    price: 40,
    extras: sandwichNotes,
    ingredients: ['دجاج مسحب', 'خبز صاج', 'ثومية', 'مخلل'],
  },
  {
    id: 'souri-mashab-bbq',
    category: 'sandwiches',
    nameAr: 'سوري مسحب بالباربكيو',
    nameEn: 'Syrian Mashab BBQ',
    descriptionAr: 'سوري مسحب بلمسة صوص الباربكيو المدخّن.',
    descriptionEn: 'Syrian mashab with a smoky barbecue sauce twist.',
    price: 40,
    extras: sandwichNotes,
    ingredients: ['دجاج مسحب', 'صوص باربكيو', 'خبز صاج', 'جبنة'],
  },
  {
    id: 'golden-pie',
    category: 'sandwiches',
    nameAr: 'الفطيرة الذهبية',
    nameEn: 'The Golden Pie',
    descriptionAr: 'فطيرة مخبوزة بلون ذهبي، محشوة بالدجاج والجبنة.',
    descriptionEn: 'A golden-baked pie filled with chicken and cheese.',
    price: 35,
    ingredients: ['عجينة', 'دجاج', 'جبنة موزاريلا'],
  },

  // ───────────── البيتزا ─────────────
  {
    id: 'pizza-chicken',
    category: 'pizza',
    nameAr: 'بيتزا دجاج',
    nameEn: 'Chicken Pizza',
    descriptionAr: 'قطع دجاج متبّلة مع الفلفل والفطر والموزاريلا. حجم وسط.',
    descriptionEn: 'Seasoned chicken, peppers, mushrooms and mozzarella. Medium.',
    price: 30,
    sizes: [{ label: 'وسط', labelEn: 'Medium', price: 30 }],
    ingredients: ['دجاج', 'فلفل', 'فطر', 'موزاريلا', 'صوص بيتزا'],
  },
  {
    id: 'pizza-meat',
    category: 'pizza',
    nameAr: 'بيتزا لحمة',
    nameEn: 'Meat Pizza',
    descriptionAr: 'لحم مفروم متبّل مع البصل والفلفل والموزاريلا. حجم وسط.',
    descriptionEn: 'Seasoned minced meat, onion, peppers and mozzarella. Medium.',
    price: 30,
    sizes: [{ label: 'وسط', labelEn: 'Medium', price: 30 }],
    ingredients: ['لحم مفروم', 'بصل', 'فلفل', 'موزاريلا'],
  },
  {
    id: 'pizza-shawarma',
    category: 'pizza',
    nameAr: 'بيتزا شاورما',
    nameEn: 'Shawarma Pizza',
    descriptionAr: 'شاورما الدجاج على البيتزا مع الثومية والمخلل. حجم وسط.',
    descriptionEn: 'Chicken shawarma pizza with garlic sauce and pickles. Medium.',
    price: 30,
    sizes: [{ label: 'وسط', labelEn: 'Medium', price: 30 }],
    ingredients: ['شاورما دجاج', 'موزاريلا', 'ثومية', 'مخلل'],
  },
  {
    id: 'pizza-corn',
    category: 'pizza',
    nameAr: 'بيتزا بالذرة',
    nameEn: 'Corn Pizza',
    descriptionAr: 'ذرة حلوة على صوص البندورة والموزاريلا.',
    descriptionEn: 'Sweet corn on tomato sauce and mozzarella.',
    price: 20,
    vegetarian: true,
    ingredients: ['ذرة', 'موزاريلا', 'صوص بيتزا'],
  },
  {
    id: 'pizza-veggie',
    category: 'pizza',
    nameAr: 'بيتزا بالخضار',
    nameEn: 'Veggie Pizza',
    descriptionAr: 'فلفل ملوّن وزيتون وفطر وبصل على قاعدة مقرمشة.',
    descriptionEn: 'Bell peppers, olives, mushrooms and onion on a crisp base.',
    price: 25,
    vegetarian: true,
    ingredients: ['فلفل', 'زيتون', 'فطر', 'بصل', 'موزاريلا'],
  },
  {
    id: 'pizza-margherita',
    category: 'pizza',
    nameAr: 'بيتزا مارجريتا',
    nameEn: 'Margherita',
    descriptionAr: 'الكلاسيكية: صوص بندورة وموزاريلا وريحان.',
    descriptionEn: 'The classic: tomato sauce, mozzarella and basil.',
    price: 20,
    vegetarian: true,
    ingredients: ['صوص بندورة', 'موزاريلا', 'ريحان'],
  },
  {
    id: 'pizza-tuna',
    category: 'pizza',
    nameAr: 'بيتزا بالتونة',
    nameEn: 'Tuna Pizza',
    descriptionAr: 'تونة مع البصل والزيتون والموزاريلا.',
    descriptionEn: 'Tuna with onion, olives and mozzarella.',
    price: 27,
    ingredients: ['تونة', 'بصل', 'زيتون', 'موزاريلا'],
    allergensAr: 'تحتوي على السمك.',
  },
  {
    id: 'calzone-chicken',
    category: 'pizza',
    nameAr: 'كالزوني دجاج',
    nameEn: 'Chicken Calzone',
    descriptionAr: 'عجينة بيتزا مطويّة ومحشوة بالدجاج والجبنة والخضار.',
    descriptionEn: 'Folded pizza dough filled with chicken, cheese and vegetables.',
    price: 35,
    ingredients: ['عجينة', 'دجاج', 'موزاريلا', 'فلفل', 'فطر'],
  },

  // ───────────── الشيبسي ─────────────
  {
    id: 'fries',
    category: 'fries',
    nameAr: 'صحن شيبسي',
    nameEn: 'Fries Plate',
    descriptionAr: 'بطاطا مقلية ذهبية ومقرمشة، تُقدّم مع الكاتشب.',
    descriptionEn: 'Golden, crispy French fries served with ketchup.',
    price: 5,
    sizes: [
      { label: 'صغير', labelEn: 'Small', price: 5 },
      { label: 'كبير', labelEn: 'Large', price: 10 },
    ],
    vegetarian: true,
    ingredients: ['بطاطا', 'ملح', 'كاتشب'],
  },

  // ───────────── السلطات ─────────────
  { id: 'corn-mayo', category: 'salads', nameAr: 'ذرة بالمايونيز', nameEn: 'Corn & Mayo', descriptionAr: 'ذرة حلوة بالمايونيز الكريمي.', descriptionEn: 'Sweet corn in creamy mayo.', price: 10, vegetarian: true, ingredients: ['ذرة', 'مايونيز'], allergensAr: 'تحتوي على البيض.' },
  { id: 'cabbage', category: 'salads', nameAr: 'ملفوف', nameEn: 'Cabbage Salad', descriptionAr: 'ملفوف مقطّع ناعم بالليمون وزيت الزيتون.', descriptionEn: 'Finely shredded cabbage with lemon and olive oil.', price: 10, vegetarian: true, ingredients: ['ملفوف', 'ليمون', 'زيت زيتون'] },
  { id: 'turkish-salad', category: 'salads', nameAr: 'تركية', nameEn: 'Turkish Salad', descriptionAr: 'بندورة وفلفل وبصل مفرومة ناعماً بدبس الرمان.', descriptionEn: 'Finely chopped tomato, pepper and onion with pomegranate molasses.', price: 10, vegetarian: true, spiceLevel: 1, ingredients: ['بندورة', 'فلفل', 'بصل', 'دبس رمان'] },
  { id: 'hummus', category: 'salads', nameAr: 'حمص', nameEn: 'Hummus', descriptionAr: 'حمص ناعم بالطحينة والليمون وزيت الزيتون.', descriptionEn: 'Smooth hummus with tahini, lemon and olive oil.', price: 10, vegetarian: true, ingredients: ['حمص', 'طحينة', 'ليمون', 'زيت زيتون'], allergensAr: 'يحتوي على السمسم.' },
  { id: 'picante', category: 'salads', nameAr: 'بيكانتي', nameEn: 'Picante', descriptionAr: 'صلصة حارة منعشة بالبندورة والفلفل.', descriptionEn: 'A fresh, hot tomato and chili salsa.', price: 10, vegetarian: true, spiceLevel: 3, ingredients: ['بندورة', 'فلفل حار', 'ثوم'] },
  { id: 'mtawmeh', category: 'salads', nameAr: 'متومة', nameEn: 'Garlic Dip', descriptionAr: 'صوص الثوم الكريمي الأبيض.', descriptionEn: 'Creamy white garlic dip.', price: 10, vegetarian: true, ingredients: ['ثوم', 'زيت', 'ليمون'] },
  { id: 'baqdounsieh', category: 'salads', nameAr: 'بقدونسية', nameEn: 'Parsley Tahini', descriptionAr: 'طحينة بالبقدونس والليمون.', descriptionEn: 'Tahini with parsley and lemon.', price: 10, vegetarian: true, ingredients: ['طحينة', 'بقدونس', 'ليمون'], allergensAr: 'تحتوي على السمسم.' },
  { id: 'canadian-dram', category: 'salads', nameAr: 'درام كندية', nameEn: 'Canadian Dram', descriptionAr: 'سلطة الدرام الكندية على طريقة التايلندي.', descriptionEn: 'Canadian dram salad, Thailandi style.', price: 10, vegetarian: true },
  { id: 'white-cabbage', category: 'salads', nameAr: 'ملفوف أبيض', nameEn: 'White Coleslaw', descriptionAr: 'ملفوف أبيض بالصوص الكريمي.', descriptionEn: 'White cabbage in a creamy dressing.', price: 10, vegetarian: true, ingredients: ['ملفوف', 'مايونيز', 'جزر'] },
  { id: 'vegetable-salad', category: 'salads', nameAr: 'سلطة خضار', nameEn: 'Garden Salad', descriptionAr: 'خضار طازجة مقطّعة: خيار وبندورة وخس وجزر.', descriptionEn: 'Fresh chopped cucumber, tomato, lettuce and carrot.', price: 15, vegetarian: true, ingredients: ['خيار', 'بندورة', 'خس', 'جزر'] },
  { id: 'gaza-salad', category: 'salads', nameAr: 'سلطة غزاوية', nameEn: 'Gazan Salad', descriptionAr: 'سلطة غزة الحارة: بندورة وشبت وفلفل حار وليمون وزيت زيتون.', descriptionEn: "Gaza's spicy salad: tomato, dill, hot pepper, lemon and olive oil.", price: 15, vegetarian: true, spiceLevel: 3, ingredients: ['بندورة', 'شبت', 'فلفل حار', 'ليمون', 'زيت زيتون'] },
  { id: 'baba-ghanouj', category: 'salads', nameAr: 'بابا غنوج', nameEn: 'Baba Ghanoush', descriptionAr: 'باذنجان مشوي مدخّن بالطحينة والليمون.', descriptionEn: 'Smoky roasted eggplant with tahini and lemon.', price: 10, vegetarian: true, ingredients: ['باذنجان مشوي', 'طحينة', 'ليمون', 'ثوم'], allergensAr: 'يحتوي على السمسم.' },
  { id: 'russian-salad', category: 'salads', nameAr: 'سلطة روسية', nameEn: 'Russian Salad', descriptionAr: 'بطاطا وجزر وبازيلاء ومخلل بالمايونيز.', descriptionEn: 'Potato, carrot, peas and pickles in mayo.', price: 10, vegetarian: true, ingredients: ['بطاطا', 'جزر', 'بازيلاء', 'مايونيز'], allergensAr: 'تحتوي على البيض.' },

  // ───────────── الحلويات ─────────────
  {
    id: 'crepe',
    category: 'desserts',
    nameAr: 'كريب',
    nameEn: 'Crêpe',
    descriptionAr: 'كريب رقيق دافئ بالشوكولاتة، كلاسيك أو اسبيشل بالإضافات.',
    descriptionEn: 'Warm, thin crêpe with chocolate — classic or loaded special.',
    price: 28,
    sizes: [
      { label: 'كلاسيك', labelEn: 'Classic', price: 28 },
      { label: 'اسبيشل', labelEn: 'Special', price: 30 },
    ],
    vegetarian: true,
    ingredients: ['عجينة كريب', 'شوكولاتة', 'فواكه'],
    allergensAr: 'يحتوي على الحليب والبيض والقمح.',
  },
  {
    id: 'waffle',
    category: 'desserts',
    nameAr: 'وافل',
    nameEn: 'Waffle',
    descriptionAr: 'وافل ذهبي مقرمش بالشوكولاتة، كلاسيك أو اسبيشل.',
    descriptionEn: 'Crisp golden waffle with chocolate — classic or special.',
    price: 30,
    sizes: [
      { label: 'كلاسيك', labelEn: 'Classic', price: 30 },
      { label: 'اسبيشل', labelEn: 'Special', price: 35 },
    ],
    vegetarian: true,
    ingredients: ['وافل', 'شوكولاتة', 'فواكه'],
    allergensAr: 'يحتوي على الحليب والبيض والقمح.',
  },
  {
    id: 'luqaimat',
    category: 'desserts',
    nameAr: 'لقيمات',
    nameEn: 'Luqaimat',
    descriptionAr: 'كرات عجين مقلية مقرمشة بالقطر أو الشوكولاتة.',
    descriptionEn: 'Crispy fried dough bites with syrup or chocolate.',
    price: 30,
    sizes: [
      { label: 'كلاسيك', labelEn: 'Classic', price: 30 },
      { label: 'اسبيشل', labelEn: 'Special', price: 35 },
    ],
    vegetarian: true,
    ingredients: ['عجين', 'قطر', 'شوكولاتة', 'سمسم'],
  },
  {
    id: 'thailandi-dessert-mix',
    category: 'desserts',
    nameAr: 'مكس حلويات التايلندي',
    nameEn: 'Thailandi Dessert Mix',
    descriptionAr: 'تشكيلة من حلويات البيت على طبق واحد — للمشاركة مع العائلة.',
    descriptionEn: 'A mix of house desserts on one platter — made for sharing.',
    price: 50,
    badge: 'chef',
    vegetarian: true,
  },
  { id: 'cheesecake', category: 'desserts', nameAr: 'تشيز كيك', nameEn: 'Cheesecake', descriptionAr: 'تشيز كيك كريمي على قاعدة بسكويت.', descriptionEn: 'Creamy cheesecake on a biscuit base.', price: 20, vegetarian: true, allergensAr: 'يحتوي على الحليب والقمح.' },
  { id: 'bounty-cake', category: 'desserts', nameAr: 'باونتي كيك', nameEn: 'Bounty Cake', descriptionAr: 'كيك الشوكولاتة بجوز الهند.', descriptionEn: 'Chocolate and coconut cake.', price: 20, vegetarian: true },
  { id: 'pistachio-dessert', category: 'desserts', nameAr: 'حلا البستاشيو', nameEn: 'Pistachio Dessert', descriptionAr: 'حلا كريمي بنكهة الفستق الحلبي.', descriptionEn: 'Creamy pistachio dessert.', price: 20, vegetarian: true, allergensAr: 'يحتوي على المكسرات.' },
  { id: 'lotus-dessert', category: 'desserts', nameAr: 'حلا اللوتس', nameEn: 'Lotus Dessert', descriptionAr: 'طبقات كريمة وبسكويت اللوتس.', descriptionEn: 'Layers of cream and Lotus biscuit.', price: 20, vegetarian: true },
  { id: 'kunafa-icecream', category: 'desserts', nameAr: 'كنافة آيس كريم', nameEn: 'Kunafa Ice Cream', descriptionAr: 'كنافة مقرمشة مع آيس كريم بارد — حار وبارد في لقمة.', descriptionEn: 'Crispy kunafa with cold ice cream — hot and cold in one bite.', price: 25, vegetarian: true, badge: 'popular' /* TODO: owner confirms best-sellers */ },
  { id: 'crepe-fettuccine', category: 'desserts', nameAr: 'كريب فوتتشيني', nameEn: 'Crêpe Fettuccine', descriptionAr: 'كريب مقطّع شرائط كالفوتتشيني مغمور بالشوكولاتة.', descriptionEn: 'Crêpe cut into ribbons and drenched in chocolate.', price: 28, vegetarian: true },
  { id: 'bambella', category: 'desserts', nameAr: 'بامبيلا', nameEn: 'Bambella', descriptionAr: 'حلى البامبيلا بصوص الشوكولاتة.', descriptionEn: 'Bambella with chocolate sauce.', price: 30, vegetarian: true },
  { id: 'crepe-dubai', category: 'desserts', nameAr: 'كريب دبي', nameEn: 'Dubai Crêpe', descriptionAr: 'كريب بشوكولاتة دبي: فستق حلبي وكنافة مقرمشة.', descriptionEn: 'Dubai-chocolate crêpe with pistachio and crispy kunafa.', price: 40, vegetarian: true, badge: 'popular', /* TODO: owner confirms best-sellers */ allergensAr: 'يحتوي على المكسرات والحليب.' },
  { id: 'black-forest', category: 'desserts', nameAr: 'بلاك فورست', nameEn: 'Black Forest', descriptionAr: 'كيك الشوكولاتة بالكريمة والكرز.', descriptionEn: 'Chocolate cake with cream and cherries.', price: 20, vegetarian: true },

  // ───────────── المشروبات الباردة ─────────────
  { id: 'soft-drinks', category: 'cold-drinks', nameAr: 'كوكاكولا بأنواعها', nameEn: 'Soft Drinks', descriptionAr: 'مشروبات غازية مبرّدة بأنواعها.', descriptionEn: 'Chilled soft drinks, all flavours.', price: 5, extras: [{ label: 'كولا', labelEn: 'Cola', price: 0 }, { label: 'زيرو', labelEn: 'Zero', price: 0 }, { label: 'سبرايت', labelEn: 'Sprite', price: 0 }, { label: 'فانتا', labelEn: 'Fanta', price: 0 }] },
  { id: 'fresh-juice', category: 'cold-drinks', nameAr: 'عصائر طبيعية', nameEn: 'Fresh Juice', descriptionAr: 'عصير فواكه طبيعي ومنعش.', descriptionEn: 'Refreshing natural fruit juice.', price: 20, vegetarian: true },
  { id: 'milkshake', category: 'cold-drinks', nameAr: 'ميلك شيك', nameEn: 'Milkshake', descriptionAr: 'ميلك شيك كثيف بنكهات متعددة.', descriptionEn: 'Thick milkshake in several flavours.', price: 25, vegetarian: true, extras: [{ label: 'شوكولاتة', labelEn: 'Chocolate', price: 0 }, { label: 'فانيلا', labelEn: 'Vanilla', price: 0 }, { label: 'فراولة', labelEn: 'Strawberry', price: 0 }, { label: 'لوتس', labelEn: 'Lotus', price: 0 }] },
  { id: 'ice-cream', category: 'cold-drinks', nameAr: 'آيس كريم', nameEn: 'Ice Cream', descriptionAr: 'كاسة آيس كريم بنكهات مختارة.', descriptionEn: 'A cup of ice cream in your choice of flavours.', price: 20, vegetarian: true },
  { id: 'avocado-nuts', category: 'cold-drinks', nameAr: 'أفوكادو بالمكسرات', nameEn: 'Avocado with Nuts', descriptionAr: 'كوكتيل أفوكادو كريمي مع المكسرات والعسل.', descriptionEn: 'Creamy avocado cocktail with nuts and honey.', price: 25, vegetarian: true, allergensAr: 'يحتوي على المكسرات.' },
  { id: 'iced-latte', category: 'cold-drinks', nameAr: 'آيس لاتيه', nameEn: 'Iced Latte', descriptionAr: 'إسبريسو مع حليب بارد ومكعبات ثلج.', descriptionEn: 'Espresso over cold milk and ice.', price: 20, vegetarian: true, extras: coffeeNotes },
  { id: 'iced-mocha', category: 'cold-drinks', nameAr: 'آيس موكا', nameEn: 'Iced Mocha', descriptionAr: 'إسبريسو بالشوكولاتة والحليب البارد.', descriptionEn: 'Espresso with chocolate and cold milk.', price: 20, vegetarian: true, extras: coffeeNotes },
  { id: 'iced-spanish-latte', category: 'cold-drinks', nameAr: 'آيس سبانيش لاتيه', nameEn: 'Iced Spanish Latte', descriptionAr: 'لاتيه بارد بالحليب المكثّف المحلّى.', descriptionEn: 'Iced latte sweetened with condensed milk.', price: 25, vegetarian: true },
  {
    id: 'water',
    category: 'cold-drinks',
    nameAr: 'مياه',
    nameEn: 'Water',
    descriptionAr: 'مياه معدنية مبرّدة.',
    descriptionEn: 'Chilled mineral water.',
    price: 3,
    sizes: [
      { label: 'صغيرة', labelEn: 'Small', price: 3 },
      { label: 'كبيرة', labelEn: 'Large', price: 8 },
    ],
  },

  // ───────────── المشروبات الساخنة ─────────────
  { id: 'turkish-coffee', category: 'hot-drinks', nameAr: 'قهوة تركي', nameEn: 'Turkish Coffee', descriptionAr: 'قهوة تركية بالهيل مع وجه كثيف.', descriptionEn: 'Turkish coffee with cardamom and a rich foam.', price: 5, extras: coffeeNotes },
  { id: 'espresso', category: 'hot-drinks', nameAr: 'قهوة إسبريسو', nameEn: 'Espresso', descriptionAr: 'شوت إسبريسو مركّز.', descriptionEn: 'A concentrated espresso shot.', price: 7, extras: coffeeNotes },
  { id: 'tea', category: 'hot-drinks', nameAr: 'شاي', nameEn: 'Tea', descriptionAr: 'شاي ساخن مع النعناع أو الميرمية حسب الطلب.', descriptionEn: 'Hot tea with mint or sage on request.', price: 4, extras: [{ label: 'بالنعناع', labelEn: 'With mint', price: 0 }, { label: 'بالميرمية', labelEn: 'With sage', price: 0 }, ...coffeeNotes] },
  { id: 'nescafe', category: 'hot-drinks', nameAr: 'نسكافيه', nameEn: 'Nescafé', descriptionAr: 'نسكافيه بالحليب، كريمي ودافئ.', descriptionEn: 'Creamy, warm Nescafé with milk.', price: 8, extras: coffeeNotes },
  { id: 'cappuccino', category: 'hot-drinks', nameAr: 'كابتشينو', nameEn: 'Cappuccino', descriptionAr: 'إسبريسو مع حليب مبخّر ورغوة غنية.', descriptionEn: 'Espresso with steamed milk and rich foam.', price: 8, extras: coffeeNotes },
  { id: 'nutella-cafe', category: 'hot-drinks', nameAr: 'نوتيلا كافيه', nameEn: 'Nutella Café', descriptionAr: 'قهوة بالحليب ونوتيلا الشوكولاتة والبندق.', descriptionEn: 'Milky coffee with Nutella.', price: 15, allergensAr: 'يحتوي على البندق والحليب.' },
  { id: 'hot-chocolate', category: 'hot-drinks', nameAr: 'هوت شوكليت', nameEn: 'Hot Chocolate', descriptionAr: 'شوكولاتة ساخنة كثيفة.', descriptionEn: 'Thick hot chocolate.', price: 15, vegetarian: true },
];

export const dishById = new Map(dishes.map((d) => [d.id, d]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));
