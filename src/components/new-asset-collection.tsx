import farmer from '@/assets/farmer.png';
import animalWorker from '@/assets/animal-worker.png';
import factoryWorker from '@/assets/factory-worker.png';
import constructionWorker from '@/assets/construction-worker.png';
import transportWorker from '@/assets/transport-worker.png';
import tractor from '@/assets/farm-tractor.png';
import trailer from '@/assets/tractor-trailer.png';
import woodStorage from '@/assets/wood-storage.png';
import grainSilo from '@/assets/grain-silo.png';
import goodsStorage from '@/assets/goods-storage.png';
import generalDepot from '@/assets/general-depot.png';
import foodStorage from '@/assets/food-storage.png';
import fuelStorage from '@/assets/fuel-storage.png';
import bakery from '@/assets/bakery.png';
import grainMill from '@/assets/grain-mill.png';
import feedFactory from '@/assets/feed-factory.png';
import cakeFactory from '@/assets/cake-factory.png';
import candyFactory from '@/assets/candy-factory.png';
import chocolateFactory from '@/assets/chocolate-factory.png';
import winery from '@/assets/winery.png';
import cafe from '@/assets/cafe.png';
import duckHouse from '@/assets/duck-house.png';
import feedTrough from '@/assets/feed-trough.png';
import watering from '@/assets/auto-watering.png';
import fuelBarrel from '@/assets/fuel-barrel.png';

type Asset = {
  title: string;
  src: string;
  motion?: string;
  steam?: [number, number];
  detail?: { clip: string; motion: string };
  effect?: 'water' | 'pond' | 'grain' | 'light';
};

const assets: Asset[] = [
  { title: 'الفلاح', src: farmer, detail: { clip: 'polygon(26% 36%, 53% 40%, 81% 77%, 62% 83%, 26% 50%)', motion: 'asset-tool' } },
  { title: 'عامل الحيوانات', src: animalWorker, detail: { clip: 'inset(43% 48% 33% 25%)', motion: 'asset-tool' } },
  { title: 'عامل المصانع', src: factoryWorker, detail: { clip: 'inset(38% 58% 37% 23%)', motion: 'asset-tool' } },
  { title: 'عامل البناء', src: constructionWorker, detail: { clip: 'inset(22% 15% 47% 63%)', motion: 'asset-tool' } },
  { title: 'عامل النقل والمساعدة', src: transportWorker, motion: 'asset-transport' },
  { title: 'الجرار الزراعي مع سائقه', src: tractor, motion: 'asset-transport' },
  { title: 'مقطورة الجرار', src: trailer, motion: 'asset-transport' },
  { title: 'مخزن الخشب', src: woodStorage, effect: 'light' },
  { title: 'صومعة الحبوب', src: grainSilo, effect: 'grain' },
  { title: 'مخزن البضائع', src: goodsStorage, effect: 'light' },
  { title: 'المستودع العام', src: generalDepot, effect: 'light' },
  { title: 'مخزن المنتجات الغذائية', src: foodStorage, effect: 'light' },
  { title: 'مخزن الوقود', src: fuelStorage, effect: 'light' },
  { title: 'المخبزة', src: bakery, steam: [69, 6] },
  { title: 'طاحونة الحبوب', src: grainMill, detail: { clip: 'polygon(17% 6%, 63% 20%, 55% 58%, 13% 45%)', motion: 'asset-sails' } },
  { title: 'مصنع الأعلاف', src: feedFactory, steam: [76, 5] },
  { title: 'مصنع الكعك', src: cakeFactory, steam: [82, 7] },
  { title: 'مصنع الحلوى', src: candyFactory, steam: [78, 10] },
  { title: 'مصنع الشوكولاتة', src: chocolateFactory, steam: [77, 6] },
  { title: 'مصنع النبيذ', src: winery, effect: 'light' },
  { title: 'المقهى', src: cafe, steam: [44, 8] },
  { title: 'منزل البط', src: duckHouse, effect: 'pond' },
  { title: 'حوض الأعلاف', src: feedTrough, effect: 'grain' },
  { title: 'مربع الماء لري حقل واحد تلقائياً', src: watering, effect: 'water' },
  { title: 'برميل الوقود', src: fuelBarrel, effect: 'light' },
];

export function NewAssetCollection() {
  return (
    <section className="mt-10" aria-labelledby="new-assets-heading">
      <h2 id="new-assets-heading" className="text-center font-display text-3xl text-primary">عمال ومنشآت القرية</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.title} className="rounded-3xl bg-card p-4 shadow-lg">
            <div className="relative aspect-square overflow-hidden">
              <div className="iso-tile" />
              <div className={`absolute inset-[8%] ${asset.motion ?? ''}`}>
                <img src={asset.src} alt={asset.title} width={1024} height={1024} loading="lazy" className="h-full w-full object-contain" />
                {asset.detail && (
                  <div className={`absolute inset-0 ${asset.detail.motion}`}>
                    <img src={asset.src} alt="" aria-hidden width={1024} height={1024} loading="lazy" className="h-full w-full object-contain" style={{ clipPath: asset.detail.clip }} />
                  </div>
                )}
                {asset.steam && [0, 1, 2].map((i) => (
                  <span key={i} aria-hidden className="asset-steam" style={{ left: `${asset.steam?.[0]}%`, top: `${asset.steam?.[1]}%`, animationDelay: `${-i}s` }} />
                ))}
                {asset.effect === 'light' && <span aria-hidden className="asset-light" />}
                {asset.effect === 'grain' && [0, 1, 2].map((i) => <span key={i} aria-hidden className="asset-grain" style={{ left: `${57 + i * 3}%`, animationDelay: `${-i * .4}s` }} />)}
                {asset.effect === 'pond' && <><span aria-hidden className="asset-ripple asset-ripple-first" /><span aria-hidden className="asset-ripple asset-ripple-second" /></>}
                {asset.effect === 'water' && <div aria-hidden className="asset-sprinkler">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} style={{ rotate: `${i * 60}deg`, animationDelay: `${-i * .2}s` }} />)}</div>}
              </div>
            </div>
            <h3 className="mt-2 text-center font-display text-2xl text-foreground">{asset.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}