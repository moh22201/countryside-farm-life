import { createFileRoute } from "@tanstack/react-router";
import quad from "@/assets/quad.png";
import cart from "@/assets/cart.png";
import chicken from "@/assets/chicken.png";
import cow from "@/assets/cow.png";
import sheep from "@/assets/sheep.png";
import battery from "@/assets/battery.png";
import mine from "@/assets/mine.png";
import miner from "@/assets/miner.png";

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
          <div className="absolute inset-[12%] anim-drive"><Img src={quad} alt="فلاحة" cls="anim-bump" /></div>
        </Card>
        <Card title="عامل بعربة بطاريات">
          <div className="absolute inset-[12%] anim-drive" style={{ animationDuration: "8s" }}><Img src={cart} alt="عامل" cls="anim-bump" /></div>
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
        {[["حظيرة دجاج", chicken], ["حظيرة أبقار", cow], ["حظيرة أغنام", sheep]].map(([t, s]) =>
          three.map((i) => (
            <Card key={t + i} title={`${t} ${i + 1}`}>
              <div className="absolute inset-[6%]" style={{ animation: `breathe 3s ease-in-out ${i * 0.5}s infinite`, transformOrigin: "bottom" }}>
                <Img src={s} alt={t} />
              </div>
            </Card>
          ))
        )}
      </div>

      <section className="mt-10 rounded-3xl bg-card p-4 shadow-lg">
        <h2 className="text-center font-display text-3xl text-foreground">منجم وآلة تنقيب و3 عمال</h2>
        <div className="relative mx-auto aspect-[4/3] max-w-3xl">
          <div className="iso-tile" />
          <div className="absolute inset-[5%] anim-shake"><Img src={mine} alt="منجم" /></div>
          {three.map((i) => (
            <div key={i} className="absolute w-[22%] bottom-[2%]" style={{ left: `${8 + i * 28}%` }}>
              <div className="anim-swing" style={{ animationDelay: `${i * 0.23}s` }}><Img src={miner} alt="عامل منجم" /></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
