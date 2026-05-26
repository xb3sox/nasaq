"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { Check, MessageCircle, Calendar, BarChart3, Bell, Users, Bot, Zap, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: MessageCircle, title: "واتساب ذكي", desc: "يرد على العملاء تلقائياً بالعربية على مدار الساعة" },
  { icon: Calendar, title: "حجوزات آلية", desc: "يحجز المواعيد مباشرة من المحادثة بدون تدخل بشري" },
  { icon: Bell, title: "تذكيرات تلقائية", desc: "يرسل تذكيرات قبل الموعد ومتابعة بعد الزيارة" },
  { icon: BarChart3, title: "تقارير لحظية", desc: "إيرادات، تحويل، لا تحضر — كل شيء في لوحة واحدة" },
  { icon: Users, title: "CRM متكامل", desc: "سجل كامل لكل عميل: مواعيد، فواتير، محادثات" },
  { icon: Bot, title: "AI متخصص للعيادات", desc: "مدرّب على لغة وأسلوب عيادات الرياض" },
];

const PRICING = [
  { name: "أساسي", setup: "7,000 ر.س", monthly: "1,500 ر.س/شهر", features: ["ردود واتساب AI", "لوحة الحجوزات", "CRM أساسي", "التذكيرات"], highlight: false },
  { name: "احترافي", setup: "12,000 ر.س", monthly: "3,000 ر.س/شهر", features: ["كل ما في الأساسي", "التقارير التفصيلية", "أتمتة المتابعة", "تعدد الموظفين", "تحويل بشري"], highlight: true },
  { name: "متميز", setup: "20,000 ر.س", monthly: "5,000 ر.س/شهر", features: ["كل ما في الاحترافي", "تعدد الفروع", "سير عمل مخصصة", "تحليلات متقدمة", "دعم أولوي"], highlight: false },
];

const FAQS = [
  { q: "كيف يتصل النظام بواتساب؟", a: "نستخدم WhatsApp Business Cloud API الرسمي من Meta. الإعداد يستغرق أقل من يوم." },
  { q: "هل الذكاء الاصطناعي يفهم العربية؟", a: "نعم، النظام مدرّب على اللغة العربية السعودية ويتعامل مع العامية بكفاءة." },
  { q: "هل يمكن للموظف التدخل في أي وقت؟", a: "بالطبع. يمكن للموظف الاستيلاء على أي محادثة بنقرة واحدة." },
  { q: "ما مدة إعداد النظام؟", a: "خلال 7 أيام من توقيع العقد يكون النظام جاهزاً بالكامل." },
];

function FaqAccordion({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b last:border-0 border-border/50">
      <button 
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-start transition-all hover:text-primary"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function RootPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary" dir="rtl">
      {/* Nav */}
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            {BRAND.name}
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors me-4">لوحة التحكم</Link>
            <Button variant="default" className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-full px-6" onClick={() => scrollToSection('pricing')}>احجز ديمو مجاني</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="max-w-6xl mx-auto px-6 py-20 lg:py-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-start z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-fade-slide-up border border-primary/20">
              <Zap className="w-4 h-4" /> نظام ذكاء اصطناعي مخصص للعيادات السعودية
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight animate-fade-slide-up animate-delay-1 text-foreground">
              {BRAND.nameAr} ينظم واتساب العيادة،<br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400">يحجز المواعيد</span>، ويقلل ضغط الاستقبال
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-slide-up animate-delay-2">
              خلال 7 أيام نجهز لك نظام ذكي يدير العملاء، الحجوزات، التذكيرات، والتقارير من لوحة واحدة، لتركز على رعاية مرضاك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-slide-up animate-delay-3">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200" onClick={() => scrollToSection('pricing')}>احجز ديمو مجاني</Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 hover:bg-muted transition-all duration-200 w-full sm:w-auto">جرب النظام الآن</Button>
              </Link>
            </div>
            <div className="flex gap-6 justify-center lg:justify-start text-sm font-medium text-muted-foreground flex-wrap animate-fade-slide-up animate-delay-4">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />إعداد خلال 7 أيام</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />بدون تقنيين</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />دعم باللغة العربية</span>
            </div>
          </div>
          
          <div className="relative animate-fade-slide-up animate-delay-2 mx-auto lg:mx-0 w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-teal-400/20 rounded-3xl blur-3xl -z-10 transform translate-x-4 translate-y-4"></div>
            <Card className="border-border/50 shadow-2xl overflow-hidden rounded-3xl bg-card/80 backdrop-blur-xl">
              <div className="bg-muted px-4 py-3 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">المساعد الذكي - نسق</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 block"></span> متصل الآن</div>
                </div>
              </div>
              <div className="p-4 space-y-4 bg-[url('/bg-pattern.svg')] bg-opacity-5">
                <div className="flex gap-2 w-full max-w-[85%] me-auto">
                  <div className="bg-muted p-3 rounded-2xl rounded-tr-sm text-sm text-foreground">
                    السلام عليكم، بكم تنظيف الأسنان؟ وهل في موعد اليوم؟
                  </div>
                </div>
                <div className="flex gap-2 w-full max-w-[85%] ms-auto justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tl-sm text-sm shadow-md">
                    وعليكم السلام! سعر تنظيف الأسنان 250 ريال.<br/><br/>نعم، يوجد موعد متاح اليوم الساعة 4:00 مساءً مع د. ريم. هل أؤكد لك الحجز؟
                  </div>
                </div>
                <div className="flex gap-2 w-full max-w-[85%] me-auto">
                  <div className="bg-muted p-3 rounded-2xl rounded-tr-sm text-sm text-foreground">
                    ايوه تمام أكديه
                  </div>
                </div>
                <div className="flex gap-2 w-full max-w-[85%] ms-auto justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tl-sm text-sm shadow-md">
                    تم تأكيد حجزك بنجاح ✅<br/>الموعد: اليوم الساعة 4:00 مساءً.<br/>سنرسل لك تذكيراً قبل الموعد. نتمنى لك دوام الصحة!
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold animate-fade-slide-up tracking-tight">كيف يعمل النظام؟</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">ثلاث خطوات بسيطة لأتمتة عيادتك بالكامل.</p>
          </div>
          
          <div className="relative grid md:grid-cols-3 gap-12">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 inset-x-20 h-0.5 bg-border -z-10"></div>
            
            {[
              { num: "1", title: "العميل يرسل واتساب", desc: "يستقبل النظام استفسارات العملاء على رقم الواتساب الرسمي للعيادة.", icon: MessageCircle },
              { num: "2", title: "الذكاء الاصطناعي يفهم ويرد", desc: "يحلل الـ AI الطلب ويرد بالإجابة أو يعرض المواعيد المتاحة فوراً.", icon: Bot },
              { num: "3", title: "الحجز يتأكد والتذكير يُرسل", desc: "يُسجل الحجز في لوحة التحكم وتُجدول رسائل التذكير آلياً.", icon: Calendar }
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-card border shadow-sm flex items-center justify-center z-10 text-primary font-bold text-xl relative group transition-transform hover:scale-110 duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-3 -start-3 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs shadow-md">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold animate-fade-slide-up tracking-tight">التحديات التي نواجهها في العيادات</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">نحن نفهم معاناتك اليومية مع إدارة المواعيد والردود.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "غرق في واتساب", desc: "موظف الاستقبال يقضي 70% من وقته يجاوب نفس الأسئلة مراراً", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "حجوزات فائتة", desc: "عملاء يسألون عن الأسعار والمواعيد ثم يختفون لعدم متابعتهم", icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
              { title: "لا رؤية واضحة", desc: "بدون بيانات يصعب معرفة ما يعمل وما لا يعمل في العيادة", icon: BarChart3, color: "text-rose-500", bg: "bg-rose-500/10" },
            ].map((p) => (
              <Card key={p.title} className="text-start border-none bg-muted/40 shadow-none hover:bg-muted/80 transition-colors duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.bg}`}>
                    <p.icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold animate-fade-slide-up tracking-tight">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">منصة متكاملة تدير كل تفاصيل علاقتك مع المراجعين.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-background">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold animate-fade-slide-up tracking-tight">باقات تناسب نمو عيادتك</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">اختر الباقة المناسبة لك، ويمكنك الترقية في أي وقت.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start lg:px-12">
            {PRICING.map((p) => (
              <Card key={p.name} className={`relative transition-all duration-300 ${p.highlight ? "border-primary shadow-2xl scale-105 z-10" : "border-border/50 shadow-sm hover:shadow-md mt-0 md:mt-4"}`}>
                {p.highlight && (
                  <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                    <span className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">الأكثر شيوعاً</span>
                  </div>
                )}
                <CardContent className="p-8 space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold">{p.setup}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">إعداد لمرة واحدة</p>
                    <p className="font-medium text-foreground mt-1">+ {p.monthly}</p>
                  </div>
                  <div className="w-full h-px bg-border/60"></div>
                  <ul className="space-y-4">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full rounded-full h-12 text-md shadow-sm hover:shadow-md transition-all duration-200" variant={p.highlight ? "default" : "outline"}>
                    اختر الباقة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold animate-fade-slide-up tracking-tight">الأسئلة الشائعة</h2>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-2 shadow-sm">
          {FAQS.map((faq, i) => (
            <div key={i} className="px-4">
              <FaqAccordion 
                q={faq.q} 
                a={faq.a} 
                isOpen={openFaq === i} 
                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0"></div>
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10 z-0"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-primary-foreground tracking-tight">مستعد لتغيير طريقة عمل عيادتك؟</h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto leading-relaxed">
            لا تحتاج لبطاقة ائتمانية. شاهد النظام وهو يعمل بشكل حي في أقل من 5 دقائق.
          </p>
          <div className="flex justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-16 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 gap-2">
                ابدأ الآن <ArrowRight className="w-5 h-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="font-bold text-xl text-primary flex items-center gap-2">
                <Zap className="w-5 h-5" /> {BRAND.name}
              </div>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                النظام الذكي الأول في المملكة لإدارة العيادات عبر الواتساب. مصمم خصيصاً ليناسب احتياجات العيادات السعودية.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">روابط سريعة</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-primary transition-colors">الرئيسية</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">الأسعار</button></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">لوحة التحكم</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">قانوني</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} {BRAND.footer}</p>
            <div className="flex gap-4">
              {/* Social icons can go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
