import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, MessageCircle, BarChart3, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b">
        <div className="text-2xl font-bold text-blue-600">Clinic AI OS</div>
        <div className="hidden md:flex space-x-6 space-x-reverse text-gray-600">
          <Link href="#features" className="hover:text-blue-600 transition">المميزات</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition">الأسعار</Link>
          <Link href="#faq" className="hover:text-blue-600 transition">الأسئلة الشائعة</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            تسجيل الدخول
          </Link>
          <Link href="#demo" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white">
            احجز ديمو
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
          الجيل الجديد من إدارة العيادات
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          نظام AI للعيادات <br className="hidden md:block" /> 
          يرد على الواتساب، يحجز المواعيد، <br className="hidden md:block" /> 
          ويقلل ضغط الاستقبال
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          خلال 7 أيام نجهز لك نظام ذكي يدير العملاء، الحجوزات، التذكيرات، والتقارير من لوحة واحدة. نظام مصمم خصيصاً للعيادات في المملكة العربية السعودية.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full">
            احجز ديمو مجاني
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2">
            شاهد طريقة العمل
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">كل ما تحتاجه عيادتك في مكان واحد</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">واتساب ذكي (Meta Cloud API)</h3>
              <p className="text-gray-600 leading-relaxed">
                ردود آلية ذكية على استفسارات المرضى، واقتراح مواعيد بناءً على توفر الأطباء، مع إمكانية التدخل البشري في أي وقت.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">إدارة حجوزات متكاملة</h3>
              <p className="text-gray-600 leading-relaxed">
                جدول مواعيد مرن، ربط تلقائي مع المواعيد القادمة من الواتساب، وتذكيرات آلية لتقليل نسبة التغيب (No-shows).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">تقارير وإيرادات</h3>
              <p className="text-gray-600 leading-relaxed">
                لوحة قيادة توضح الإيرادات، أداء الأطباء، ومعدل تحويل المحادثات إلى حجوزات لاتخاذ قرارات تعتمد على البيانات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">باقات تناسب حجم عيادتك</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="border rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">الأساسية</h3>
              <div className="text-gray-500 mb-6">للاطباء المستقلين والعيادات الصغيرة</div>
              <div className="mb-6">
                <span className="text-4xl font-bold">1,500</span>
                <span className="text-gray-500"> ر.س / شهرياً</span>
              </div>
              <div className="text-sm font-semibold text-gray-500 mb-8">+ 7,000 ر.س لمرة واحدة (رسوم التأسيس)</div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {["واتساب ذكي بحدود المحادثات", "لوحة الحجوزات", "إدارة العملاء CRM الأساسية", "تذكيرات المواعيد"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">اختر الباقة</Button>
            </div>

            {/* Pro */}
            <div className="border-2 border-blue-600 rounded-3xl p-8 flex flex-col relative bg-blue-50/30 shadow-lg">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                الأكثر طلباً
              </div>
              <h3 className="text-2xl font-bold mb-2">المتقدمة</h3>
              <div className="text-gray-500 mb-6">للعيادات المتنامية والمراكز الطبية</div>
              <div className="mb-6">
                <span className="text-4xl font-bold">3,000</span>
                <span className="text-gray-500"> ر.س / شهرياً</span>
              </div>
              <div className="text-sm font-semibold text-gray-500 mb-8">+ 12,000 ر.س لمرة واحدة (رسوم التأسيس)</div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {["كل مميزات الأساسية", "تقارير متقدمة", "أتمتة المتابعة (Follow-ups)", "تعدد الموظفين والأطباء", "تحويل المحادثات للموظف (Handoff)"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">اختر الباقة</Button>
            </div>

            {/* Premium */}
            <div className="border rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">الاحترافية</h3>
              <div className="text-gray-500 mb-6">للمجمعات الطبية متعددة الفروع</div>
              <div className="mb-6">
                <span className="text-4xl font-bold">5,000</span>
                <span className="text-gray-500"> ر.س / شهرياً</span>
              </div>
              <div className="text-sm font-semibold text-gray-500 mb-8">+ 20,000 ر.س لمرة واحدة (رسوم التأسيس)</div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {["كل مميزات المتقدمة", "تعدد الفروع", "تدفقات عمل (Workflows) مخصصة", "تحليلات متقدمة", "دعم فني كونسيرج"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">تواصل معنا</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Clinic AI OS</p>
          <p className="mt-2 text-sm">صنع للعيادات في المملكة العربية السعودية 🇸🇦</p>
        </div>
      </footer>
    </div>
  );
}
