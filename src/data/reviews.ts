/**
 * PLACEHOLDER reviews. They are shown with a visible «نص تجريبي» label.
 * Replace each one with a real customer review (with permission) and set
 * `sample: false` — the label then disappears. Never publish invented reviews as real.
 */
export interface Review {
  name: string;
  textAr: string;
  textEn: string;
  rating: 1 | 2 | 3 | 4 | 5;
  sample: boolean;
}

export const reviews: Review[] = [
  {
    name: 'اسم العميل',
    textAr: 'هنا يُكتب تقييم حقيقي من أحد الزبائن عن الطعام أو الخدمة — يُنسخ من تعليقات صفحة المطعم بعد إذن صاحبه.',
    textEn: 'A real customer review about the food or service goes here — copied from the restaurant’s page with the author’s permission.',
    rating: 5,
    sample: true,
  },
  {
    name: 'اسم العميل',
    textAr: 'تقييم حقيقي ثانٍ — يُفضَّل أن يذكر طبقاً محدداً من المنيو ليشجّع الزوار على تجربته.',
    textEn: 'A second real review — ideally mentioning a specific dish from the menu to encourage visitors to try it.',
    rating: 5,
    sample: true,
  },
  {
    name: 'اسم العميل',
    textAr: 'تقييم حقيقي ثالث — مثلاً عن سرعة الطلب عبر واتساب أو تجربة الجلوس في المطعم.',
    textEn: 'A third real review — for example about ordering on WhatsApp or dining in.',
    rating: 5,
    sample: true,
  },
];
