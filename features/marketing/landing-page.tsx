"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { Zap, Check, ArrowRight } from "lucide-react";
import { FEATURES, HOW_IT_WORKS, PRICING } from "./content";
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
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <Zap className="w-5 h-5 text-primary" />
            {BRAND.name}
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="default"
              className="rounded-full px-6"
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
          className="py-32 lg:py-48"
          background="transparent"
        >
          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-medium tracking-tight text-balance leading-none">
              <span className="text-glow">{BRAND.nameAr}</span> ينظم العيادة.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
              نظام ذكي يدير العملاء، الحجوزات، التذكيرات، والتقارير عبر واتساب، لتركز على رعاية مرضاك.
            </p>
            <div className="pt-8">
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-lg"
                onClick={() => scrollToSection("pricing")}
              >
                ابدأ الآن
              </Button>
            </div>
          </div>
        </LandingSection>

        {/* How it works */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent">
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
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent">
          <div className="py-24">
            <h2 className="text-sm font-medium text-muted-foreground mb-12">المميزات</h2>
            <ul className="space-y-6 max-w-3xl">
              {FEATURES.map((f, i) => (
                <li key={i} className="text-2xl sm:text-4xl font-medium tracking-tight text-foreground text-balance">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </LandingSection>

        {/* Pricing */}
        <LandingSection id="pricing" maxWidth="6xl" background="transparent" className="section-accent">
          <div className="py-24">
            <h2 className="text-sm font-medium text-muted-foreground mb-12">الأسعار</h2>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
              {PRICING.map((p) => (
                <div key={p.name} className="space-y-8">
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
                        <Check className="w-4 h-4 text-muted-foreground" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-full h-12">
                    اختيار
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </LandingSection>

        {/* CTA */}
        <LandingSection maxWidth="6xl" background="transparent" className="section-accent">
          <div className="py-32 flex flex-col items-start gap-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              جاهز للبدء؟
            </h2>
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-lg"
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
