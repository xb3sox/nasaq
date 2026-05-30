"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { Zap, Check, ArrowRight } from "lucide-react";
import { FEATURES, HOW_IT_WORKS, PRICING, STATS, CLINICS, TESTIMONIAL } from "./content";
import { LandingSection } from "@/components/landing";

export function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans landing-dark landing-mesh"
      dir="rtl"
    >
      {/* Nav */}
      <nav className="border-b border-border/40 bg-[var(--landing-bg)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => scrollToSection("hero")}
          >
            <Zap className="w-5 h-5 text-primary" />
            {BRAND.name}
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="default"
              className="rounded-full px-6 hover:scale-[1.02] transition-transform btn-glow"
              onClick={() => scrollToSection("pricing")}
            >
              احجز ديمو
            </Button>
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* Hero */}
        <LandingSection
          id="hero"
          maxWidth="6xl"
          padded={false}
          className="py-24 lg:py-40 relative"
          background="transparent"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes hero-pulse {
              0%, 100% { opacity: 0.05; transform: scale(1); }
              50% { opacity: 0.15; transform: scale(1.05); }
            }
            .animate-hero-pulse {
              animation: hero-pulse 8s ease-in-out infinite;
            }
          `}} />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
            {/* Text & Stats Pane (Right in RTL) */}
            <div className="flex-1 space-y-10 relative w-full">
              {/* Subtle animated gradient pulse behind headline */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[var(--landing-accent-soft)] to-transparent blur-[100px] animate-hero-pulse pointer-events-none rounded-full" />
              
              <div className="space-y-8 relative">
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-medium tracking-tight text-balance leading-none">
                  <span className="text-glow">{BRAND.nameAr}</span> ينظم العيادة.
                </h1>
                <p className="text-xl text-[var(--landing-text-secondary)] max-w-2xl leading-relaxed text-balance">
                  نظام ذكي يدير العملاء، الحجوزات، التذكيرات، والتقارير عبر واتساب، لتركز على رعاية مرضاك.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-lg btn-glow transition-transform hover:scale-105 duration-300"
                    onClick={() => scrollToSection("pricing")}
                  >
                    ابدأ الآن
                  </Button>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 pt-8 border-t border-[var(--landing-border)]">
                {STATS.map((stat, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col gap-1 px-4 sm:px-6 
                      ${i % 2 === 1 ? "border-s border-[var(--landing-border)]" : ""} 
                      ${i > 0 && i % 2 === 0 ? "lg:border-s lg:border-[var(--landing-border)]" : ""}
                    `}
                  >
                    <span className="text-3xl font-bold tracking-tight text-[var(--landing-text-primary)]">{stat.value}</span>
                    <span className="text-sm text-[var(--landing-text-muted)]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Mockup Pane (Left in RTL) */}
            <div className="flex-1 w-full max-w-md lg:max-w-none relative">
              <div className="bg-[var(--landing-surface)] border border-[var(--landing-border)] rounded-2xl overflow-hidden shadow-2xl reveal">
                {/* WhatsApp Header */}
                <div className="bg-[var(--landing-surface-raised)] border-b border-[var(--landing-border)] px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--whatsapp)]/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[var(--whatsapp)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--landing-text-primary)]">المساعد الذكي - نسق</div>
                    <div className="text-xs text-[var(--landing-text-muted)]">متصل الآن</div>
                  </div>
                </div>
                
                {/* Chat Body */}
                <div className="p-4 space-y-4 bg-gradient-to-b from-[var(--landing-bg)] to-[var(--landing-surface)] relative min-h-[300px]">
                  <div className="flex justify-start w-full" dir="ltr">
                    <div className="bg-[var(--landing-surface-raised)] border border-[var(--landing-border)] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-right ml-auto" dir="rtl">
                      <p className="text-sm text-[var(--landing-text-primary)]">مرحباً! أود حجز موعد لتنظيف الأسنان.</p>
                      <span className="text-[10px] text-[var(--landing-text-muted)] mt-1 block text-end">10:00 ص</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end w-full" dir="ltr">
                    <div className="bg-[var(--landing-accent-soft)] border border-[var(--landing-accent-glow)] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-right mr-auto" dir="rtl">
                      <p className="text-sm text-[var(--landing-text-primary)]">أهلاً بك في عيادتنا! يسعدني مساعدتك. أقرب موعد متاح هو غداً الساعة 4:00 عصراً. هل يناسبك؟</p>
                      <span className="text-[10px] text-[var(--landing-text-muted)] mt-1 block text-end">10:01 ص</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-start w-full" dir="ltr">
                    <div className="bg-[var(--landing-surface-raised)] border border-[var(--landing-border)] rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-right ml-auto" dir="rtl">
                      <p className="text-sm text-[var(--landing-text-primary)]">نعم ممتاز، أرجو تأكيد الحجز.</p>
                      <span className="text-[10px] text-[var(--landing-text-muted)] mt-1 block text-end">10:02 ص</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end w-full" dir="ltr">
                    <div className="bg-[var(--landing-accent-soft)] border border-[var(--landing-accent-glow)] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-right mr-auto" dir="rtl">
                      <p className="text-sm text-[var(--landing-text-primary)]">تم تأكيد الموعد غداً الساعة 4:00 عصراً بنجاح! سيصلك تذكير قبل الموعد. نتمنى لك يوماً سعيداً.</p>
                      <span className="text-[10px] text-[var(--landing-text-muted)] mt-1 block text-end">10:02 ص</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative glow behind mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--landing-accent)] opacity-[0.03] blur-[100px] pointer-events-none -z-10" />
            </div>
          </div>
        </LandingSection>

        {/* How it works */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent reveal">
          <div className="py-12">
            <h2 className="text-sm font-medium text-muted-foreground mb-8">كيف يعمل؟</h2>
            <div className="flex flex-wrap gap-4 text-xl sm:text-2xl font-medium text-foreground">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span>
                    <span className="text-muted-foreground me-2">{i + 1}.</span>
                    {step}
                  </span>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-180" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </LandingSection>

        {/* Features */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent reveal">
          <div className="py-16 sm:py-24">
            <h2 className="text-sm font-medium text-muted-foreground mb-12">المميزات</h2>
            <ul className="space-y-6 max-w-3xl">
              {FEATURES.map((f, i) => (
                <li
                  key={i}
                  className="text-2xl sm:text-4xl font-medium tracking-tight text-foreground text-balance reveal transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(129,140,248,0.5)]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </LandingSection>

        {/* Logo marquee */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent reveal">
          <div className="py-24 border-y border-border/50">
            <p className="text-sm text-muted-foreground text-center mb-12">موثوق من قبل العيادات الرائدة</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
              {CLINICS.map((clinic, i) => (
                <div key={i} className="text-2xl font-bold tracking-tighter">{clinic}</div>
              ))}
            </div>
          </div>
        </LandingSection>

        {/* Pricing */}
        <LandingSection id="pricing" maxWidth="6xl" background="transparent" className="section-accent">
          <div className="py-16 sm:py-24">
            <h2 className="text-sm font-medium text-muted-foreground mb-12 text-center">الأسعار</h2>
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {PRICING.map((p, i) => (
                <div
                  key={p.name}
                  className="space-y-8 bg-card border border-border/50 p-8 rounded-[2rem] hover:-translate-y-[2px] hover:shadow-2xl transition-all duration-300 reveal flex flex-col"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight mb-2">{p.name}</h3>
                    <div className="text-muted-foreground">
                      <p>إعداد: {p.setup}</p>
                      <p>اشتراك: {p.monthly}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-foreground">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-full h-12 mt-auto hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    اختيار
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </LandingSection>

        {/* Testimonial */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent reveal">
          <div className="py-20 sm:py-24 border-y border-border/10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
               <p className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-snug">
                  &quot;{TESTIMONIAL.quote}&quot;
               </p>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                     {TESTIMONIAL.author.charAt(0)}
                  </div>
                  <div className="font-medium text-lg">{TESTIMONIAL.author}</div>
                  <div className="text-sm text-muted-foreground">{TESTIMONIAL.clinic}</div>
               </div>
            </div>
          </div>
        </LandingSection>

        {/* CTA */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent reveal">
          <div className="py-20 sm:py-32 flex flex-col items-center text-center gap-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              جاهز للبدء؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              انضم للعيادات الرائدة التي تستخدم {BRAND.nameAr} لتبسيط عملياتها وزيادة حجوزاتها.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-lg btn-glow hover:scale-[1.02] transition-transform"
              onClick={() => scrollToSection("pricing")}
            >
              احجز ديمو
            </Button>
          </div>
        </LandingSection>

        {/* Footer */}
        <footer className="section-accent">
          <LandingSection maxWidth="6xl" padded={false}>
            <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} {BRAND.footer}
              </p>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                لوحة التحكم
              </Link>
            </div>
          </LandingSection>
        </footer>
      </main>
    </div>
  );
}
