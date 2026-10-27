# 🎬 KINOMAN - Kinolar Portali & Ideal Admin Panel

O'zbek tilidagi zamonaviy, tezkor va professional kinolar portali hamda to'liq boshqaruvga ega **Admin Paneli** (Dashboard, CRUD amallari, Sidebar, SQL va Supabase integratsiyasi).

---

## 🚀 Texnologiyalar
- **Frontend**: React 19, TypeScript, Vite
- **Stillar**: Tailwind CSS (Dark Cinematic UI, Glassmorphism, Responsive)
- **Ikonkalar**: Lucide React
- **Ma'lumotlar Bazasi**: PostgreSQL (Supabase) + Avtomatik LocalStorage Mock kesh
- **SQL DDL**: Tayyor `supabase_schema.sql` fayli

---

## ⚡ Asosiy Imkoniyatlar

### 1. 🌐 Foydalanuvchilar Sayti (Client)
- **Katta Premyera Banneri**: Mashhur kinolar karuseli, treylerlarni tomosha qilish (YouTube / Video Player), tafsilotlar.
- **Jonli Qidiruv**: Film nomi, asl inglizcha nomi, aktyorlar va rejissyor bo'yicha tezkor qidiruv.
- **Janrlar va Saralash**: Janrlar bo'yicha filtrlash (Jangari, Komediya, Drama, Fantastika, O'zbek kinosi va h.k.), IMDb reytingi, yangiligi yoki ommabopligi bo'yicha saralash.
- **Kino Kartochkasi & Modal**: Sifat ko'rsatkichlari (4K HDR, Full HD), yosh chegarasi, reyting, sevimlilarga saqlash.
- **Sharhlar Tizimi**: Har bir filmga sharh va 1-10 reyting qoldirish imkoniyati.
- **Sevimlilar (Watchlist)**: Yoqqan filmlarni xatcho'p qilib saqlash va boshqarish.

### 2. 🛡️ Ideal Admin Panel
- **Sidebar**:
  - 📊 **Dashboard**: Kinolar soni, ko'rishlar, o'rtacha reyting, janrlar taqsimoti diagrammasi, so'nggi qo'shilgan kinolar.
  - 🎬 **Kinolar Ro'yxati**: Barcha kinolar jadvali, qidiruv, janr bo'yicha filter, tahrirlash va o'chirish.
  - ➕ **Yangi Kino Qo'shish**: Nomi, tavsifi, yili, davomiyligi, rejissyor, aktyorlar, poster & fon rasmi (jonli preview bilan), YouTube treyler havolasi, premyera belgisi.
  - ✏️ **Tahrirlash**: Barcha maydonlarni istalgan vaqtda yangilash.
  - 🗑️ **O'chirish**: Tasdiqlash modali bilan xavfsiz o'chirish.
  - 📂 **Janrlar Boshqaruvi**: Yangi janrlar qo'shish va mavjudlarini boshqarish.
  - ⚡ **Supabase & SQL**: Ulanishni tekshirish, kalitlarni saqlash, 1-klikda SQL kodni nusxalash va mavjud barcha filmlarni Supabase-ga sinxronlash (yuklash).

---

## 🛠️ Loyihani Ishga Tushirish

1. **Paketlarni o'rnatish** (allaqachon bajarilgan):
   ```bash
   npm install
   ```

2. **Dasturni ishga tushirish (Dev server)**:
   ```bash
   npm run dev
   ```
   Brauzerda oching: [http://localhost:5173](http://localhost:5173)

3. **Production Build qilish**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Bazasini Ulash (3 Qadam)

1. [Supabase](https://supabase.com) saytida yangi bepul loyiha (project) oching.
2. Saytdagi `supabase_schema.sql` fayli ichidagi barcha SQL kodni nusxalang va Supabase-ning **SQL Editor** bo'limiga tashlab **Run** tugmasini bosing.
3. Loyihangizning **Project Settings > API** bo'limidagi **Project URL** va **anon/public** kalitini oling va:
   - Saytning **Admin Panel > Supabase & SQL** sahifasiga kirib kalitlarni kiriting va **"Kalitlarni Saqlash"** tugmasini bosing.
   - Yoki `.env` fayliga kiriting:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **"Kinolarni Supabase-ga sinxronlash"** tugmasini bosing va barcha namunaviy filmlar avtomatik bazangizga yuklanadi!

