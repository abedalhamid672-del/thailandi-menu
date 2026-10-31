# مطعم التايلندي — Menu website

A fast, Arabic-first (RTL) menu site for **مطعم التايلندي, Gaza**, built as a redesign proposal.
Visitors browse the full menu, open any dish for details, build an order and send it to the
restaurant on WhatsApp in one tap. An English toggle mirrors the whole layout to LTR.

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · lucide-react.
Static site, no backend. The home page is prerendered at build time, so text and menu paint before JavaScript loads.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, build, prerender → dist/
npm run preview    # serve dist/ locally
```

Node 20+ required.

---

## Edit the content

Everything a restaurant owner would change lives in `src/data/`. You never need to touch a component.

| What | File | Notes |
|---|---|---|
| Dishes, prices, sizes, descriptions | `src/data/menu.ts` | One object per dish |
| Phone, WhatsApp, address, map, hours, social links, About text | `src/data/site.ts` | Empty values are hidden on the site |
| Customer reviews | `src/data/reviews.ts` | Currently **placeholders**, see below |
| Interface text (Arabic + English) | `src/data/i18n.ts` | Buttons, headings, messages |
| Demo photos | `src/data/photos.ts` | Replace with real photos, see below |

### Change a price
In `src/data/menu.ts` find the dish and edit `price` (or the `price` inside `sizes`).
`price: 0` shows **«السعر عند الطلب»** and is left out of order totals.

### Add a dish
Add one object to the `dishes` array:

```ts
{
  id: 'chicken-tikka',              // unique, lowercase, used in links and photo file names
  category: 'grills',               // one of the categories at the top of menu.ts
  nameAr: 'دجاج تكا',
  nameEn: 'Chicken Tikka',
  descriptionAr: 'قطع دجاج متبّلة بالتكا ومشوية.',
  price: 35,
  // optional:
  sizes: [{ label: 'صغير', price: 30 }, { label: 'كبير', price: 40 }],
  extras: [{ label: 'بدون بصل', price: 0 }, { label: 'جبنة إضافية', price: 3 }],
  spiceLevel: 2,                    // 0–3 chili icons
  vegetarian: false,
  badge: 'popular',                 // 'popular' | 'chef' | 'new'
  prepTimeMin: 15,
  calories: 450,
  ingredients: ['دجاج', 'لبن', 'بهارات'],
  allergensAr: 'يحتوي على الحليب.',
  image: '/images/dishes/chicken-tikka.webp',
}
```

The card, details modal, search, filters, cart, WhatsApp message and Google structured data all update automatically.

### Contact details and hours
In `src/data/site.ts`:

- `phone` / `whatsapp`: `whatsapp` is international format, digits only (`972592830888`).
- `hours`: currently empty, so the site says «اتصلوا بنا لمعرفة أوقات الدوام». Fill it like this:
  ```ts
  hours: [
    { daysAr: 'يومياً', daysEn: 'Daily', opens: '11:00', closes: '23:30',
      schemaDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  ],
  ```
- `social.facebook` / `social.tiktok`: empty, so their icons are hidden. Paste the page URLs to show them.
- `mapsUrl` / `mapsEmbedUrl`: currently a search for the address. Replace with the exact pin from Google Maps → Share.
- `url`: the deployed domain, used for share links, canonical URL and Open Graph.

---

## Before showing it to the owners (things to confirm)

Nothing on the site is invented as fact, but these items need the owner's confirmation:

- [ ] **Prices and items**: copied from the restaurant's current site on 2026-10-30. Re-check for changes.
- [ ] **Descriptions and ingredients**: written for this proposal; the owner should correct the wording.
- [ ] **«الأكثر طلباً» badges** (سوري شاورما، فتة غزاوية، سماش برجر، كنافة آيس كريم، كريب دبي): a guess, marked `// TODO` in `menu.ts`.
- [ ] **«طبق البيت»** on وجبة التايلندي and مكس حلويات التايلندي.
- [ ] **Instagram**: the old site's button pointed to a broken `https://thailandi_gaza/`. The new site uses `instagram.com/thailandi_gaza`. Confirm it is their account.
- [ ] **Opening hours, Facebook, TikTok, exact map pin**: not published on the old site.
- [ ] **Hero trust badges** in `site.ts` (`heroBadgesAr`): keep only what the owner agrees with.
- [ ] **Reviews**: the three cards are visibly labelled «نص تجريبي». Replace them with real reviews (with permission) and set `sample: false`. Never publish invented reviews.
- [ ] **Photos**: all dish photos are stock images labelled «صورة توضيحية» in the dish modal. See the next section.

---

## Replace the photos

Demo photos come from Unsplash (free licence) through its CDN, which serves resized WebP/AVIF automatically.
They are **not** the restaurant's food. To use a real photo:

1. Save it as `public/images/dishes/<dish-id>.webp`, landscape 4:3, about 1200×900 px, under ~150 KB
   (squoosh.app or `npx sharp-cli` can convert and compress).
2. In `src/data/menu.ts`, add `image: '/images/dishes/<dish-id>.webp'` to that dish.

That dish then uses your photo, and the «صورة توضيحية» label disappears. A dish with no photo at all shows a branded latte card with the logo.

**Hero:** change `heroPhoto` (background) and `heroDishPhoto` (round plate, desktop) in `src/data/photos.ts`.

**Logo:** `public/logo.png` is the restaurant's original logo, unaltered. After replacing it, run `npm run icons`
to regenerate the favicon, the app icons, the small WebP versions and `og-image.jpg`.

| القسم | الطبق | id | Your photo goes to | Current demo |
|---|---|---|---|---|
| الشاورما | فرشوحة شاورما | `shawarma-farshouha` | `public/images/dishes/shawarma-farshouha.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600) |
| الشاورما | سوري شاورما | `shawarma-souri` | `public/images/dishes/shawarma-souri.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1719282431565-3b30bb7d2658?w=600) |
| الشاورما | صفيحة شاورما | `shawarma-safiha` | `public/images/dishes/shawarma-safiha.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1760888548893-bc2f7e09e972?w=600) |
| الشاورما | شاورما أساور | `shawarma-asawer` | `public/images/dishes/shawarma-asawer.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1719282431723-9d0f4370d4bc?w=600) |
| الأكلات الشرقية | دجاج + أرز | `chicken-rice` | `public/images/dishes/chicken-rice.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1603496987674-79600a000f55?w=600) |
| الأكلات الشرقية | طاجن باللحمة | `meat-tagine` | `public/images/dishes/meat-tagine.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1608500218987-0f2b3be34b47?w=600) |
| الأكلات الشرقية | فتة غزاوية | `fatteh-gazawiya` | `public/images/dishes/fatteh-gazawiya.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1777716003985-68fed08d0c7e?w=600) |
| الأكلات الشرقية | لحم مدخن | `smoked-meat` | `public/images/dishes/smoked-meat.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1785571903557-dce44dcf3eab?w=600) |
| المشاوي | وجبة مشاوي | `mashawi-meal` | `public/images/dishes/mashawi-meal.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600) |
| المشاوي | شيش طاووق | `shish-tawook` | `public/images/dishes/shish-tawook.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1777891258069-454e66f8bedc?w=600) |
| المشاوي | وجبة كباب | `kebab-meal` | `public/images/dishes/kebab-meal.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600) |
| المشاوي | وجبة مسحب | `mashab-meal` | `public/images/dishes/mashab-meal.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1764018292116-003fd7d1a0ba?w=600) |
| المشاوي | سبايسي | `spicy-meal` | `public/images/dishes/spicy-meal.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600) |
| المشاوي | وجبة التايلندي | `thailandi-meal` | `public/images/dishes/thailandi-meal.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1771285119318-b342c3ecc51c?w=600) |
| سندويشات غربي | تشيكن ستروغانوف | `chicken-stroganoff` | `public/images/dishes/chicken-stroganoff.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1700937244987-92488ab2ada5?w=600) |
| سندويشات غربي | تشيكن بيتزا | `chicken-pizza-sandwich` | `public/images/dishes/chicken-pizza-sandwich.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1709689155464-90d6ca1e9f62?w=600) |
| سندويشات غربي | فاهيتا دجاج | `chicken-fajita` | `public/images/dishes/chicken-fajita.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1752095809096-f09d22c466c5?w=600) |
| سندويشات غربي | دجاج بالذرة | `chicken-corn` | `public/images/dishes/chicken-corn.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1707750795395-f9a4cababde9?w=600) |
| سندويشات غربي | اسكالوب بانيه بالجبن | `escalope` | `public/images/dishes/escalope.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=600) |
| سندويشات غربي | فرايد تشيكن | `fried-chicken` | `public/images/dishes/fried-chicken.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600) |
| سندويشات غربي | اسكالوبيني | `escalopini` | `public/images/dishes/escalopini.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1560611588-163f295eb145?w=600) |
| سندويشات غربي | بيف برجر بالجبنة | `beef-burger` | `public/images/dishes/beef-burger.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600) |
| سندويشات غربي | سماش برجر | `smash-burger` | `public/images/dishes/smash-burger.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600) |
| سندويشات غربي | سوري زنجر | `souri-zinger` | `public/images/dishes/souri-zinger.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1760533536289-9e4106eaf62e?w=600) |
| سندويشات غربي | سوري مسحب | `souri-mashab` | `public/images/dishes/souri-mashab.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1715262346522-ef72f19f0170?w=600) |
| سندويشات غربي | سوري مسحب بالباربكيو | `souri-mashab-bbq` | `public/images/dishes/souri-mashab-bbq.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600) |
| سندويشات غربي | الفطيرة الذهبية | `golden-pie` | `public/images/dishes/golden-pie.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1753656681797-3234c89d6d4d?w=600) |
| البيتزا | بيتزا دجاج | `pizza-chicken` | `public/images/dishes/pizza-chicken.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600) |
| البيتزا | بيتزا لحمة | `pizza-meat` | `public/images/dishes/pizza-meat.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600) |
| البيتزا | بيتزا شاورما | `pizza-shawarma` | `public/images/dishes/pizza-shawarma.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600) |
| البيتزا | بيتزا بالذرة | `pizza-corn` | `public/images/dishes/pizza-corn.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1593504049359-74330189a345?w=600) |
| البيتزا | بيتزا بالخضار | `pizza-veggie` | `public/images/dishes/pizza-veggie.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1625401514458-6c8a5e7d55da?w=600) |
| البيتزا | بيتزا مارجريتا | `pizza-margherita` | `public/images/dishes/pizza-margherita.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600) |
| البيتزا | بيتزا بالتونة | `pizza-tuna` | `public/images/dishes/pizza-tuna.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1571207133905-e63101f15248?w=600) |
| البيتزا | كالزوني دجاج | `calzone-chicken` | `public/images/dishes/calzone-chicken.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1628824851008-ec3ab4b45527?w=600) |
| الشيبسي | صحن شيبسي | `fries` | `public/images/dishes/fries.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600) |
| السلطات | ذرة بالمايونيز | `corn-mayo` | `public/images/dishes/corn-mayo.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1634467524884-897d0af5e104?w=600) |
| السلطات | ملفوف | `cabbage` | `public/images/dishes/cabbage.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1537784969314-05a37106f68e?w=600) |
| السلطات | تركية | `turkish-salad` | `public/images/dishes/turkish-salad.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1656853834420-51980b12a920?w=600) |
| السلطات | حمص | `hummus` | `public/images/dishes/hummus.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=600) |
| السلطات | بيكانتي | `picante` | `public/images/dishes/picante.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1615810227931-4d9f62fd02aa?w=600) |
| السلطات | متومة | `mtawmeh` | `public/images/dishes/mtawmeh.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1612192666307-8dbd0c8a535a?w=600) |
| السلطات | بقدونسية | `baqdounsieh` | `public/images/dishes/baqdounsieh.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1702650657375-934239d8b472?w=600) |
| السلطات | درام كندية | `canadian-dram` | `public/images/dishes/canadian-dram.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1676300186673-615bcc8d5d68?w=600) |
| السلطات | ملفوف أبيض | `white-cabbage` | `public/images/dishes/white-cabbage.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1573403707491-38a4ea19edc1?w=600) |
| السلطات | سلطة خضار | `vegetable-salad` | `public/images/dishes/vegetable-salad.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600) |
| السلطات | سلطة غزاوية | `gaza-salad` | `public/images/dishes/gaza-salad.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1769481614068-47cfb4d1f125?w=600) |
| السلطات | بابا غنوج | `baba-ghanouj` | `public/images/dishes/baba-ghanouj.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1697126248475-a537cc5cce28?w=600) |
| السلطات | سلطة روسية | `russian-salad` | `public/images/dishes/russian-salad.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1667657682263-86e924b34fd9?w=600) |
| الحلويات | كريب | `crepe` | `public/images/dishes/crepe.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600) |
| الحلويات | وافل | `waffle` | `public/images/dishes/waffle.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600) |
| الحلويات | لقيمات | `luqaimat` | `public/images/dishes/luqaimat.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1763004818721-e5868ca1b32b?w=600) |
| الحلويات | مكس حلويات التايلندي | `thailandi-dessert-mix` | `public/images/dishes/thailandi-dessert-mix.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1766734974600-b6ea9a40a03a?w=600) |
| الحلويات | تشيز كيك | `cheesecake` | `public/images/dishes/cheesecake.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600) |
| الحلويات | باونتي كيك | `bounty-cake` | `public/images/dishes/bounty-cake.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600) |
| الحلويات | حلا البستاشيو | `pistachio-dessert` | `public/images/dishes/pistachio-dessert.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1482930172332-2293d7138235?w=600) |
| الحلويات | حلا اللوتس | `lotus-dessert` | `public/images/dishes/lotus-dessert.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1690650235793-c71d48550a59?w=600) |
| الحلويات | كنافة آيس كريم | `kunafa-icecream` | `public/images/dishes/kunafa-icecream.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=600) |
| الحلويات | كريب فوتتشيني | `crepe-fettuccine` | `public/images/dishes/crepe-fettuccine.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1734056650036-7002ede7b8f8?w=600) |
| الحلويات | بامبيلا | `bambella` | `public/images/dishes/bambella.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1656057205408-4a0a62cf2dfb?w=600) |
| الحلويات | كريب دبي | `crepe-dubai` | `public/images/dishes/crepe-dubai.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1772985763762-c079e16deab8?w=600) |
| الحلويات | بلاك فورست | `black-forest` | `public/images/dishes/black-forest.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600) |
| المشروبات الباردة | كوكاكولا بأنواعها | `soft-drinks` | `public/images/dishes/soft-drinks.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1773188243488-702914547143?w=600) |
| المشروبات الباردة | عصائر طبيعية | `fresh-juice` | `public/images/dishes/fresh-juice.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600) |
| المشروبات الباردة | ميلك شيك | `milkshake` | `public/images/dishes/milkshake.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600) |
| المشروبات الباردة | آيس كريم | `ice-cream` | `public/images/dishes/ice-cream.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1562790879-dfde82829db0?w=600) |
| المشروبات الباردة | أفوكادو بالمكسرات | `avocado-nuts` | `public/images/dishes/avocado-nuts.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1630252595285-3bbcb51378d8?w=600) |
| المشروبات الباردة | آيس لاتيه | `iced-latte` | `public/images/dishes/iced-latte.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600) |
| المشروبات الباردة | آيس موكا | `iced-mocha` | `public/images/dishes/iced-mocha.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600) |
| المشروبات الباردة | آيس سبانيش لاتيه | `iced-spanish-latte` | `public/images/dishes/iced-spanish-latte.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=600) |
| المشروبات الباردة | مياه | `water` | `public/images/dishes/water.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1616118132534-381148898bb4?w=600) |
| المشروبات الساخنة | قهوة تركي | `turkish-coffee` | `public/images/dishes/turkish-coffee.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1774529233247-d3f34ed11994?w=600) |
| المشروبات الساخنة | قهوة إسبريسو | `espresso` | `public/images/dishes/espresso.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600) |
| المشروبات الساخنة | شاي | `tea` | `public/images/dishes/tea.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600) |
| المشروبات الساخنة | نسكافيه | `nescafe` | `public/images/dishes/nescafe.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600) |
| المشروبات الساخنة | كابتشينو | `cappuccino` | `public/images/dishes/cappuccino.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600) |
| المشروبات الساخنة | نوتيلا كافيه | `nutella-cafe` | `public/images/dishes/nutella-cafe.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600) |
| المشروبات الساخنة | هوت شوكليت | `hot-chocolate` | `public/images/dishes/hot-chocolate.webp` | [صورة تجريبية](https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600) |

---

## Deploy

The output is a static `dist/` folder.

- **Vercel**: import the repo. Build command `npm run build`, output directory `dist` (auto-detected for Vite). `vercel.json` adds long caching for hashed assets.
- **Cloudflare**: `npm run deploy` (builds, then `wrangler deploy` using `wrangler.jsonc`; run `npx wrangler login` once).
- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_headers` adds the same caching.
- **Any static host**: upload `dist/`. Unknown URLs should serve `dist/404.html`.

After deploying, set `site.url` in `src/data/site.ts` to the real domain and redeploy, so share links and previews point to it.

---

## How it works

```
src/
  data/          menu.ts · site.ts · i18n.ts · reviews.ts · photos.ts   ← content
  components/    Navbar, Hero, CategoryNav, MenuToolbar, MenuSection, DishCard,
                 DishModal (lazy-loaded), PopularCarousel, About, Reviews, Contact,
                 Footer, Cart (bar + drawer), FloatingWhatsApp, NotFound, ui/*
  hooks/         useLocale (AR/EN + RTL/LTR), useCart (localStorage), useDialog (focus trap,
                 Esc, scroll lock), useViewport (media query, scroll state, scroll spy)
  lib/           whatsapp.ts (order message builder), pricing.ts, search.ts (Arabic-aware),
                 images.ts, seo.ts (JSON-LD), storage.ts
  entry-server.tsx + scripts/prerender.mjs   ← build-time prerender of the home page
```

- **Ordering**: every card has a one-tap WhatsApp button. The dish modal adds size, options, quantity and a live total.
  The cart (saved in the browser) composes one Arabic WhatsApp message with every item, quantities, options, total and optional name/notes.
- **Shareable dishes**: `/?dish=<id>` opens a dish directly. The browser Back button closes it.
- **Search** ignores Arabic spelling variants (أ/ا/إ, ة/ه, ى/ي, diacritics), so «شاورمه» finds «شاورما».
- **SEO**: Arabic title and description, Open Graph and Twitter cards, canonical URL, and a `Restaurant` + `Menu`
  JSON-LD generated from `menu.ts` and `site.ts` at build time.
- **Accessibility**: focus-trapped dialogs with Escape and focus return, a skip link, `aria-pressed` filters, labelled controls,
  touch targets of at least 44 px, and `prefers-reduced-motion` respected.
- **Performance**: prerendered HTML, self-hosted preloaded Arabic fonts, a lazy dish modal, lazy images with srcset,
  `content-visibility` on off-screen menu sections, and later sections rendered in a non-blocking React transition.
- **Print**: printing the page gives a clean text menu without photos or buttons.

## Lighthouse (local, 2026-10-30)

Production build served by `vite preview` on a Windows dev machine, Lighthouse 12.8, simulated throttling.

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile (3 runs) | 76 · 84 · 92 | 100 | 100 | 100 |
| Desktop | 94–95 | 100 | 100 | 100 |

Mobile performance varied run to run on this machine. The remaining cost is the ~135 KB (gzip) JavaScript bundle
(React DOM is about half of it) competing with first paint on simulated slow 4G. Measure again on the real host
with PageSpeed Insights after deploying.

---

Created by Engineer Abdel Hamid Al-Khatib; WhatsApp number: +972597183082
