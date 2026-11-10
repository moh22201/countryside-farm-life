# سجل الأصول الرسومية

المجلد: `src/assets/`

هذه الأصول موجودة حالياً في المستودع. صفحة المعرض في `src/routes/index.tsx` تستورد مجموعة منها لعرضها. ملف اللعبة المستقل `public/qaryati.html` لا يستورد هذه الصور حالياً؛ رسومات منشآته وأيقوناته تُرسم داخلياً على Canvas.

## قائمة الأصول
- `battery.png` — بطارية كهربائية
- `cart.png` — عربة نقل
- `chicken.png` — دجاجة
- `chicken-empty.png` — حظيرة دجاج فارغة
- `cow.png` — بقرة
- `cow-empty.png` — حظيرة أبقار فارغة
- `cow1.png` — بقرة متحركة/بديلة
- `delivery-truck.png` — شاحنة توصيل
- `fabric-plant.png` — مصنع أقمشة
- `forklift.png` — رافعة شوكية
- `freight-pier.png` — رصيف شحن
- `hen.png` — دجاجة/دجاجة حظيرة
- `iron-mine.png` — منجم حديد
- `lumber-mill.png` — مصنع أخشاب
- `mine.png` — منجم
- `miner.png` — عامل منجم
- `miner-cart.png` — عامل بعربة منجم
- `miner-shovel.png` — عامل بمِجرفة
- `nuclear.png` — محطة طاقة نووية
- `power-plant.png` — محطة كهرباء
- `quad.png` — جرار/مركبة رباعية
- `sheep.png` — خروف
- `sheep-empty.png` — حظيرة أغنام فارغة
- `sheep1.png` — خروف متحرك/بديل
- `steel-mill.png` — مصنع فولاذ
- `trade-depot.png` — مركز تجارة بري
- `trade-pier.png` — رصيف تجارة بحري

## قاعدة الاستخدام
قبل ربط أي أصل باللعبة، نتحقق بصرياً من الصورة واسمها، ثم نربطه بالمنشأة أو الكائن الصحيح. لا نستبدل الرسومات الحالية تلقائياً ولا نحذف أي أصل.
