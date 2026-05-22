import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { Check, MessageCircle, Calendar, BarChart3, Bell, Users, Bot, Zap } from "lucide-react";

export const FEATURES = [
  { icon: MessageCircle, title: "واتساب ذكي", desc: "يرد على العملاء تلقائياً بالعربية على مدار الساعة" },
  { icon: Calendar, title: "حجوزات آلية", desc: "يحجز المواعيد مباشرة من المحادثة بدون تدخل بشري" },
  { icon: Bell, title: "تذكيرات تلقائية", desc: "يرسل تذكيرات قبل الموعد ومتابعة بعد الزيارة" },
  { icon: BarChart3, title: "تقارير لحظية", desc: "إيرادات، تحويل، لا تحضر — كل شيء في لوحة واحدة" },
  { icon: Users, title: "CRM متكامل", desc: "سجل كامل لكل عميل: مواعيد، فواتير، محادثات" },
  { icon: Bot, title: "AI متخصص للعيادات", desc: "مدرّب على لغة وأسلوب عيادات الرياض" },
];

export const PRICING = [
  { name: "أساسي", setup: "7,000 ر.س", monthly: "1,500 ر.س/شهر", features: ["ردود واتساب AI", "لوحة الحجوزات", "CRM أساسي", "التذكيرات"], highlight: false },
  { name: "احترافي", setup: "12,000 ر.س", monthly: "3,000 ر.س/شهر", features: ["كل ما في الأساسي", "التقارير التفصيلية", "أتمتة المتابعة", "تعدد الموظفين", "تحويل بشري"], highlight: true },
  { name: "متميز", setup: "20,000 ر.س", monthly: "5,000 ر.س/شهر", features: ["كل ما في الاحترافي", "تعدد الفروع", "سير عمل مخصصة", "تحليلات متقدمة", "دعم أولوي"], highlight: false },
];

export const FAQS = [
  { q: "كيف يتصل النظام بواتساب؟", a: "نستخدم WhatsApp Business Cloud API الرسمي من Meta. الإعداد يستغرق أقل من يوم." },
  { q: "هل الذكاء الاصطناعي يفهم العربية؟", a: "نعم، النظام مدرّب على اللغة العربية السعودية ويتعامل مع العامية بكفاءة." },
  { q: "هل يمكن للموظف التدخل في أي وقت؟", a: "بالطبع. يمكن للموظف الاستيلاء على أي محادثة بنقرة واحدة." },
  { q: "ما مدة إعداد النظام؟", a: "خلال 7 أيام من توقيع العقد يكون النظام جاهزاً بالكامل." },
];

export default function RootPage() {
  return <LandingContent />;
}

export function LandingContent() {
  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      {/* Nav */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg">{BRAND.name}</div>
          <div className="flex gap-3">
            <Link href="/dashboard"><Button variant="outline">لوحة التحكم</Button></Link>
            <Button variant="default" className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">احجز ديمو مجاني</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-fade-slide-up">
          <Zap className="w-4 h-4" /> نظام ذكاء اصطناعي مخصص للعيادات السعودية
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight animate-fade-slide-up animate-delay-1">
          {BRAND.nameAr} ينظم واتساب العيادة،<br />
          <span className="text-primary">يحجز المواعيد</span>، ويقلل ضغط الاستقبال
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-slide-up animate-delay-2">
          خلال 7 أيام نجهز لك نظام ذكي يدير العملاء، الحجوزات، التذكيرات، والتقارير من لوحة واحدة.
        </p>
        <div className="flex gap-4 justify-center flex-wrap animate-fade-slide-up animate-delay-3">
          <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">احجز ديمو مجاني</Button>
          <Link href="/dashboard"><Button size="lg" variant="outline" className="px-8 py-6 text-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">جرب النظام الآن</Button></Link>
        </div>
        <div className="flex gap-6 justify-center text-sm text-muted-foreground flex-wrap animate-fade-slide-up animate-delay-4">
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />إعداد خلال 7 أيام</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />بدون تقنيين</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />دعم باللغة العربية</span>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold animate-fade-slide-up">مشكلة كل عيادة في الرياض</h2>
          <div className="grid md:grid-cols-3 gap-6 text-right">
            {[
              { title: "🌊 غرق في واتساب", desc: "موظف الاستقبال يقضي 70% من وقته يجاوب نفس الأسئلة مراراً" },
              { title: "📅 حجوزات فائتة", desc: "عملاء يسألون عن الأسعار والمواعيد ثم يختفون لعدم متابعتهم" },
              { title: "📊 لا رؤية واضحة", desc: "بدون بيانات يصعب معرفة ما يعمل وما لا يعمل في العيادة" },
            ].map((p, i) => (
              <Card key={p.title} className={`text-right card-hover-lift animate-fade-slide-up animate-delay-${i + 1}`}>
                <CardContent className="p-6 space-y-2">
                  <div className="text-2xl">{p.title.split(" ")[0]}</div>
                  <div className="font-semibold">{p.title.slice(2)}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold animate-fade-slide-up">كل ما تحتاجه في مكان واحد</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Card key={f.title} className={`card-hover-lift animate-fade-slide-up animate-delay-${(i % 6) + 1}`}>
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-semibold">{f.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold animate-fade-slide-up">الأسعار</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PRICING.map((p, i) => (
              <Card key={p.name} className={`${p.highlight ? "pricing-highlight border-primary shadow-xl ring-2 ring-primary/20" : "shadow-sm"} card-hover-lift animate-fade-slide-up animate-delay-${(i % 3) + 1}`}>
                <CardContent className="p-8 space-y-6">
                  {p.highlight && <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full w-fit font-semibold">الأكثر شيوعاً</div>}
                  <div>
                    <div className="text-xl font-bold">{p.name}</div>
                    <div className="text-3xl font-extrabold mt-2">{p.setup}</div>
                    <div className="text-muted-foreground text-sm">إعداد + {p.monthly}</div>
                  </div>
                  <ul className="space-y-3">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full shadow-sm hover:shadow-md transition-all duration-200" variant={p.highlight ? "default" : "outline"}>احجز ديمو</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold animate-fade-slide-up">أسئلة شائعة</h2></div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Card key={faq.q} className={`animate-fade-slide-up animate-delay-${(i % 4) + 1}`}>
              <CardContent className="p-6">
                <div className="font-semibold mb-2">{faq.q}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-bold animate-fade-slide-up">ابدأ الآن وجرب النظام مجاناً</h2>
          <p className="text-primary-foreground/80 text-lg animate-fade-slide-up animate-delay-1">لا تحتاج بطاقة ائتمانية. ديمو مباشر في أقل من 5 دقائق.</p>
          <Button size="lg" variant="secondary" className="px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 animate-fade-slide-up animate-delay-2">احجز ديمو مجاني الآن</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto px-6">© 2026 {BRAND.footer}</div>
      </footer>
    </div>
  );
}
