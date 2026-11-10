import { createFileRoute } from "@tanstack/react-router";
import quad from "@/assets/quad.png";
import cart from "@/assets/cart.png";
import chicken from "@/assets/chicken.png";
import cow from "@/assets/cow.png";
import sheep from "@/assets/sheep.png";
import battery from "@/assets/battery.png";
import mine from "@/assets/mine.png";
import miner from "@/assets/miner.png";
import chickenEmpty from "@/assets/chicken-empty.png";
import cowEmpty from "@/assets/cow-empty.png";
import sheepEmpty from "@/assets/sheep-empty.png";
import hen from "@/assets/hen.png";
import cow1 from "@/assets/cow1.png";
import sheep1 from "@/assets/sheep1.png";
import minerCart from "@/assets/miner-cart.png";
import minerShovel from "@/assets/miner-shovel.png";

const Wheel = ({ x, y, d, speed = 0.6 }: { x: number; y: number; d: number; speed?: number }) => (
  <span className="wheel" style={{ left: `${x}%`, top: `${y}%`, width: `${d}%`, height: `${d}%` }}>
    <i style={{ animationDuration: `${speed}s` }} />
  </span>
);
type Animal = { src: string; x: number; y: number; w: number; dx: string; dy: string; t: number };
const pens: { title: string; bg: string; animals: Animal[] }[] = [
  { title: "حظيرة دجاج (3 دجاجات)", bg: chickenEmpty, animals: [
    { src: hen, x: 30, y: 55, w: 14, dx: "60%", dy: "40%", t: 6 },
    { src: hen, x: 45, y: 62, w: 14, dx: "-50%", dy: "50%", t: 7 },
    { src: hen, x: 55, y: 48, w: 13, dx: "70%", dy: "-20%", t: 5 } ] },
  { title: "حظيرة أبقار (3 أبقار)", bg: cowEmpty, animals: [
    { src: cow1, x: 40, y: 55, w: 20, dx: "80%", dy: "30%", t: 10 },
    { src: cow1, x: 60, y: 50, w: 20, dx: "-40%", dy: "50%", t: 12 },
    { src: cow1, x: 52, y: 66, w: 20, dx: "60%", dy: "-30%", t: 9 } ] },
  { title: "حظيرة أغنام (3 خراف)", bg: sheepEmpty, animals: [
    { src: sheep1, x: 22, y: 45, w: 18, dx: "90%", dy: "40%", t: 9 },
    { src: sheep1, x: 45, y: 58, w: 18, dx: "-60%", dy: "30%", t: 8 },
    { src: sheep1, x: 55, y: 42, w: 17, dx: "50%", dy: "60%", t: 10 } ] },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أصول متحركة أيزومترية 2.5D — مزرعة ومنجم" },
      { name: "description", content: "مجموعة أصول متحركة بأسلوب أيزومتري 2.5D: فلاحة، حظائر، بطاريات ومنجم." },
      { property: "og:title", content: "أصول متحركة أيزومترية 2.5D" },
      { property: "og:description", content: "فلاحة بدراجة رباعية، حظائر دجاج وأبقار وأغنام، بطاريات ومنجم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const Img = ({ src, cls = "", alt }: { src: string; cls?: string; alt: string }) => (
  <img src={src} alt={alt} width={1024} height={1024} loading="lazy" className={`relative w-full h-full object-contain ${cls}`} />
);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <div className="iso-tile" />
        {children}
      </div>
      <h3 className="mt-2 text-center font-display text-2xl text-foreground">{title}</h3>
    </div>
  );
}

function Index() {
  const three = [0, 1, 2];
  return (
    <main dir="rtl" className="min-h-screen px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-center font-display text-5xl text-primary">أصول متحركة أيزومترية 2.5D</h1>
      <p className="text-center text-muted-foreground mt-2">مزرعة • طاقة • منجم</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="فلاحة بدراجة رباعية">
          <div className="absolute inset-[12%]"><Img src={quad} alt="فلاحة" />
            <Wheel x={20.5} y={62} d={21} /><Wheel x={52.5} y={80} d={23} /><Wheel x={82.5} y={69} d={20} />
          </div>
        </Card>
        <Card title="عامل بعربة بطاريات">
          <div className="absolute inset-[12%]"><Img src={cart} alt="عامل" />
            <img src={cart} alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain anim-jiggle" style={{ clipPath: "inset(37% 19% 23% 42%)" }} />
            <Wheel x={41} y={78} d={9} speed={0.5} /><Wheel x={61.5} y={90} d={10} speed={0.5} /><Wheel x={80.5} y={81.5} d={8} speed={0.5} />
          </div>
        </Card>
        <Card title="بطاريات كهربائية">
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-6">
            {three.map((i) => (
              <div key={i} className="w-1/3" style={{ animationDelay: `${i * 0.4}s` }}>
                <Img src={battery} alt="بطارية" cls="anim-glow" />
              </div>
            ))}
          </div>
        </Card>
        {pens.map((p) => (
          <Card key={p.title} title={p.title}>
            <div className="absolute inset-[6%]">
              <Img src={p.bg} alt={p.title} />
              {p.animals.map((a, i) => (
                <div key={i} className="absolute" style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%` }}>
                  <div className="anim-wander" style={{ ["--dx" as string]: a.dx, ["--dy" as string]: a.dy, ["--t" as string]: `${a.t}s`, animationDelay: `${-i * 2}s` }}>
                    <div className="anim-step"><Img src={a.src} alt="" /></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-10 rounded-3xl bg-card p-4 shadow-lg">
        <h2 className="text-center font-display text-3xl text-foreground">منجم وآلة تنقيب و3 عمال</h2>
        <div className="relative mx-auto aspect-[4/3] max-w-3xl">
          <div className="iso-tile" />
          <div className="absolute inset-[5%]"><Img src={mine} alt="منجم" />
            <div className="absolute left-[60%] top-[55%] w-[8%] anim-shake" />
            {[0, 1, 2].map((i) => <span key={i} className="dust" style={{ left: "58%", top: "62%", animationDelay: `${i * 0.5}s`, ["--dx" as string]: `${(i - 1) * 20}px` }} />)}
          </div>
          {/* عامل عند الآلة */}
          <div className="absolute w-[18%] left-[42%] top-[50%]">
            <div className="anim-swing"><Img src={miner} alt="عامل عند الآلة" /></div>
            {[0, 1].map((i) => <span key={i} className="dust" style={{ left: "10%", bottom: "0", width: "50%", animationDelay: `${i * 0.35}s`, animationDuration: ".7s", ["--dx" as string]: `${i ? 12 : -12}px` }} />)}
          </div>
          {/* عامل يجر العربة */}
          <div className="absolute w-[20%] right-[2%] bottom-[0%] anim-push">
            <div className="anim-step"><Img src={minerCart} alt="عامل يجر عربة" /></div>
          </div>
          {/* عامل يجمع المستخرج */}
          <div className="absolute w-[20%] left-[2%] bottom-[2%]">
            <div className="anim-scoop"><Img src={minerShovel} alt="عامل يجمع الخام" /></div>
            <span className="dust" style={{ left: "45%", bottom: "5%", width: "40%", ["--dx" as string]: "10px" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
