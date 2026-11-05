# Auksion

Avtomobil davlat raqamlari uchun onlayn auksion ilovasi. Next.js 16, React 19, Tailwind CSS 4 va SQLite (`better-sqlite3`) asosida qurilgan.

## Talablar

- [Node.js](https://nodejs.org) 20 yoki undan yangi versiyasi
- npm (Node.js bilan birga keladi)
- [Git](https://git-scm.com)

## Yuklab olish va ishga tushirish

1. Repositoriyani klon qiling:

   ```bash
   git clone https://github.com/Abduboriyxon/Auksion.git
   cd Auksion
   ```

2. Kutubxonalarni o'rnating (`node_modules` repositoriyada yo'q, shu buyruq uni yaratadi):

   ```bash
   npm install
   ```

3. Dasturni development rejimida ishga tushiring:

   ```bash
   npm run dev
   ```

4. Brauzerda oching: [http://localhost:3000](http://localhost:3000)

## Production rejimi

```bash
npm run build
npm start
```

## Ma'lumotlar bazasi

SQLite bazasi (`auction_final.db`) birinchi ishga tushirishda loyiha papkasida avtomatik yaratiladi. Jadvallar, `admin` foydalanuvchisi va bir nechta namunaviy raqamlar ham avtomatik qo'shiladi.

## Kirish

- **Admin:** login `admin`, parol `1234`
- **Oddiy foydalanuvchi:** istalgan ism bilan kirish mumkin

## Skriptlar

| Buyruq          | Vazifasi                          |
| --------------- | --------------------------------- |
| `npm run dev`   | Development serverni ishga tushirish |
| `npm run build` | Production uchun build qilish     |
| `npm start`     | Production serverni ishga tushirish |
| `npm run lint`  | ESLint tekshiruvi                 |

## Muammolar

`better-sqlite3` native modul. Agar `npm install` paytida xato chiqsa:

- macOS: `xcode-select --install`
- Windows: Visual Studio Build Tools ("Desktop development with C++") o'rnating
- Keyin `node_modules` va `package-lock.json` ni o'chirib, `npm install` ni qayta ishga tushiring
