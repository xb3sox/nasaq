-- seed_demo.sql
-- Demo data for Nasaq MVP (Riyadh clinic)

BEGIN;

-- Insert clinic
INSERT INTO clinics (id, name, slug, address, phone, timezone, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'عيادة النور الطبيّة',
  'alnoor-clinic',
  'Riyadh, Al Malqa',
  '+966500000001',
  'Asia/Riyadh',
  '{"currency":"SAR"}'
) ON CONFLICT (id) DO NOTHING;

-- Insert profiles (owner + receptionist)
INSERT INTO profiles (id, full_name, email, role, clinic_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Basem Owner', 'owner@alnoor.com', 'owner', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'Sara Reception', 'sara@alnoor.com', 'receptionist', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Insert branches
INSERT INTO branches (id, clinic_id, name, address, phone, working_hours)
VALUES
 ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','الفرع الرئيسي','Al Malqa, Riyadh','+966500000002','{"mon":[{"start":"09:00","end":"17:00"}],"tue":[],"wed":[],"thu":[],"fri":[],"sat":[],"sun":[]}')
ON CONFLICT (id) DO NOTHING;

-- Insert services
INSERT INTO services (id, clinic_id, name, code, duration_minutes, price, description)
VALUES
  ('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','استشارة عامة','CONS_GEN',30,150,'استشارة عامة مع الطبيب'),
  ('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','تنظيف أسنان','DENT_CLEAN',45,250,'تنظيف شامل للأسنان'),
  ('30000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','قسطرة جلدية','DERM_PROC',60,400,'إجراء بسيط للجلد'),
  ('30000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','فحص دوري','CHECKUP',20,100,'فحص دوري سريع')
ON CONFLICT (id) DO NOTHING;

-- Insert staff (3 doctors)
INSERT INTO staff (id, clinic_id, name, email, phone, title)
VALUES
  ('40000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','د. نواف الحسين','nawaf@alnoor.com','+966500000010','استشاري طب عام'),
  ('40000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','د. ريم السيف','reem@alnoor.com','+966500000011','طبيبة أسنان'),
  ('40000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','د. علي الزهراني','ali@alnoor.com','+966500000012','طبيب جلدية')
ON CONFLICT (id) DO NOTHING;

-- Insert customers (20) - Arabic names + Saudi phone formats
INSERT INTO customers (clinic_id, name, phone, whatsapp, email, gender, date_of_birth, tags, lead_status, source)
VALUES
('00000000-0000-0000-0000-000000000001','محمد السالم','+966500001001','+966500001001','m.salem@example.com','male','1990-03-12',ARRAY['new'], 'new', 'whatsapp'),
('00000000-0000-0000-0000-000000000001','سارة العامري','+966500001002','+966500001002','s.amri@example.com','female','1988-07-21',ARRAY['vip'],'contacted','instagram'),
('00000000-0000-0000-0000-000000000001','فهد الحربي','+966500001003','+966500001003','f.harbi@example.com','male','1985-01-05',ARRAY[],'booked','referral'),
('00000000-0000-0000-0000-000000000001','ريم القحطاني','+966500001004','+966500001004','r.qahtani@example.com','female','1992-11-11',ARRAY[],'new','website'),
('00000000-0000-0000-0000-000000000001','نورة الفيفي','+966500001005','+966500001005','n.faifi@example.com','female','1995-05-02',ARRAY[],'new','whatsapp'),
('00000000-0000-0000-0000-000000000001','خالد الغامدي','+966500001006','+966500001006','k.ghamdi@example.com','male','1980-12-30',ARRAY[],'booked','whatsapp'),
('00000000-0000-0000-0000-000000000001','علي الشمري','+966500001007','+966500001007','a.shammari@example.com','male','1979-04-17',ARRAY[],'completed','referral'),
('00000000-0000-0000-0000-000000000001','ماجدة حسين','+966500001008','+966500001008','m.hussain@example.com','female','1991-09-09',ARRAY[],'no_show','whatsapp'),
('00000000-0000-0000-0000-000000000001','يوسف عمر','+966500001009','+966500001009','y.omar@example.com','male','1996-06-06',ARRAY[],'lost','instagram'),
('00000000-0000-0000-0000-000000000001','هند السالم','+966500001010','+966500001010','h.salem@example.com','female','1993-02-02',ARRAY[],'new','website'),
('00000000-0000-0000-0000-000000000001','عبدالله فواز','+966500001011','+966500001011','a.fawaz@example.com','male','1982-08-08',ARRAY[],'new','whatsapp'),
('00000000-0000-0000-0000-000000000001','لينا منصور','+966500001012','+966500001012','l.mansour@example.com','female','1994-10-10',ARRAY[],'new','instagram'),
('00000000-0000-0000-0000-000000000001','راشد الدولي','+966500001013','+966500001013','r.adawli@example.com','male','1975-12-12',ARRAY[],'new','referral'),
('00000000-0000-0000-0000-000000000001','سعيد الجبري','+966500001014','+966500001014','s.jabri@example.com','male','1987-03-03',ARRAY[],'new','whatsapp'),
('00000000-0000-0000-0000-000000000001','نجلاء حمود','+966500001015','+966500001015','n.hamoud@example.com','female','1989-04-04',ARRAY[],'new','website'),
('00000000-0000-0000-0000-000000000001','رامي العتيبي','+966500001016','+966500001016','r.otaibi@example.com','male','1998-05-05',ARRAY[],'new','whatsapp'),
('00000000-0000-0000-0000-000000000001','مها البكري','+966500001017','+966500001017','m.bakri@example.com','female','1997-06-06',ARRAY[],'new','instagram'),
('00000000-0000-0000-0000-000000000001','زياد الناصر','+966500001018','+966500001018','z.nasser@example.com','male','1986-07-07',ARRAY[],'new','website'),
('00000000-0000-0000-0000-000000000001','أمل السعيد','+966500001019','+966500001019','a.saeed@example.com','female','1995-08-08',ARRAY[],'new','referral'),
('00000000-0000-0000-0000-000000000001','باسل كريم','+966500001020','+966500001020','b.kareem@example.com','male','1990-09-09',ARRAY[],'new','whatsapp')
ON CONFLICT (clinic_id, phone) DO NOTHING;

-- Insert conversations (10 mock)
INSERT INTO conversations (clinic_id, customer_id, channel, external_id, last_message, tags)
SELECT '00000000-0000-0000-0000-000000000001', c.id, 'whatsapp', md5(c.phone), 'مرحبا، أريد حجز موعد', ARRAY['booking']
FROM customers c
LIMIT 10;

-- Insert messages for those conversations (simple)
INSERT INTO messages (conversation_id, customer_id, direction, body)
SELECT conv.id, conv.customer_id, 'inbound', 'مرحبا، أريد حجز موعد' FROM conversations conv LIMIT 10;

-- Insert 30 bookings (some confirmed, some no-shows)
INSERT INTO bookings (clinic_id, branch_id, customer_id, service_id, doctor_id, start_at, end_at, status, payment_status)
SELECT
 '00000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000001',
 c.id,
 (ARRAY['30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000004'])[floor(random()*4)+1]::uuid,
 (ARRAY['40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003'])[floor(random()*3)+1]::uuid,
 now() + (floor(random()*15)-7) * interval '1 day' + (floor(random()*8)+9) * interval '1 hour',
 null,
 (ARRAY['confirmed','pending','cancelled','no_show'])[floor(random()*4)+1]::booking_status,
 (ARRAY['paid','unpaid','partially_paid'])[floor(random()*3)+1]::payment_status
FROM customers c
CROSS JOIN generate_series(1,2) gs
LIMIT 30;

-- Insert sample invoices for some bookings
INSERT INTO invoices (clinic_id, customer_id, booking_id, subtotal, discount, tax, total, payment_status, metadata)
SELECT b.clinic_id, b.customer_id, b.id, 200, 0, 15, 215, 'paid', '{"source":"seed"}'
FROM bookings b
WHERE b.status = 'completed'
LIMIT 5;

COMMIT;
