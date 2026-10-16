# Final Project — E2E Automation Testing YouTube Gaming

**Nama: Fachri Alviansyah**

## 1. Deskripsi Project

Automation testing End-to-End untuk [YouTube](https://www.youtube.com/): buka menu **Gaming** dari sidebar, klik **View all** pada bagian **Trending videos**, buka video trending nomor 3, lalu cocokkan judul dan nama channel di halaman watch dengan yang tampil di daftar trending. Project dibangun dengan Cypress + JavaScript dan menerapkan Page Object Model (POM).

## 2. Skenario E2E

| Step | Aksi | Validasi |
|---|---|---|
| 1 | Buka YouTube dari `YOUTUBE_BASE_URL`, tangani consent jika muncul | Masthead tampil, router SPA siap, title `YouTube` |
| 2 | Sidebar: buka guide jika tertutup, klik **Show more** jika Gaming tersembunyi, klik **Gaming** | Path `/gaming`, title `Gaming - YouTube` |
| 3 | Di section dengan header **Trending videos**, klik tombol **View all** milik section itu | Path `/gaming/trending`, header list `Trending videos`, minimal 3 video |
| 4 | Ambil video urutan ke-3 dari grid trending, simpan title + channel, klik | Path `/watch`, query `v=` sama dengan video id dari link |
| 5 | Baca title di halaman watch | Sama dengan title dari trending |
| 6 | Baca nama channel di halaman watch | Sama dengan channel dari trending |

**Aturan pemilihan:**
- Section Trending dicari dari teks header-nya sendiri (`ytd-rich-list-header-renderer #title`), lalu `View all` dicari di `#header-button` section tersebut. Header section punya 2 link ke `/gaming/trending` (judul dan tombol); hanya tombol `aria-label="View all"` yang diklik.
- Video dihitung hanya dari `ytd-grid-renderer #items > ytd-grid-video-renderer` di section yang terlihat. Iklan/shelf lain memakai elemen berbeda sehingga tidak ikut terhitung.
- Title dan channel diambil saat test berjalan, tidak di-hardcode.
- Normalisasi hanya: hapus karakter kontrol bidi tak terlihat (U+200E/F, U+202A–E, U+2066–9) yang YouTube sisipkan di sekitar `@mention` pada halaman watch, dan rapikan whitespace. Huruf besar/kecil, tanda baca, dan emoji tetap dibandingkan.

## 3. Teknologi

| Tool | Versi |
|---|---|
| Node.js | 24.x |
| Cypress | 16.2.0 |
| Browser | Firefox (lihat Known Issues) |
| dotenv | 18.0.8 |
| cypress-mochawesome-reporter | 5.0.0 |

## 4. Struktur Folder

```text
3. Youtube/
├── cypress/
│   ├── e2e/
│   │   └── youtube-gaming.cy.js        # alur bisnis + assertion
│   ├── pages/                          # Page Object Model
│   │   ├── YouTubeHomePage.js
│   │   ├── YouTubeGamingPage.js
│   │   ├── YouTubeTrendingPage.js
│   │   └── YouTubeWatchPage.js
│   ├── support/
│   │   ├── e2e.js
│   │   └── utils/
│   │       ├── text.js                 # normalisasi teks
│   │       └── text.check.js           # self-check normalisasi (node)
│   ├── reports/                        # HTML report (hasil run)
│   └── videos/                         # video Cypress (hasil run)
├── docs/run-output.log                 # log terminal run terakhir
├── .env / .env.example
├── cypress.config.js
├── package.json
└── README.md
```

## 5. Page Object Model

| Page Object | Tanggung jawab |
|---|---|
| `YouTubeHomePage` | Buka YouTube, consent, kondisi sidebar, pilih Gaming |
| `YouTubeGamingPage` | Section Trending videos dan tombol View all-nya |
| `YouTubeTrendingPage` | List trending yang terlihat, ambil video ke-n (title, channel, link), buka video |
| `YouTubeWatchPage` | Title dan nama channel di halaman watch |

## 6. Environment Variables

Sama seperti project sebelumnya: `cypress.config.js` memuat `.env` lewat `dotenv`, gagal jika `YOUTUBE_BASE_URL` kosong, dan meneruskannya lewat `expose` (dibaca dengan `Cypress.expose('YOUTUBE_BASE_URL')`).

```dotenv
YOUTUBE_BASE_URL=https://www.youtube.com/
```

## 7. Instalasi & Menjalankan

```bash
npm install
cp .env.example .env
npm run cy:run      # headless Firefox: video + HTML report (sama dengan npm test)
npm run cy:open     # mode interaktif
npm run test:text   # self-check normalisasi teks
```

Hasil: `cypress/reports/index.html` (Mochawesome, berisi konteks **Trending video #3**: posisi, title, channel, link) dan `cypress/videos/youtube-gaming.cy.js.mp4`.

## 8. Hasil Eksekusi Aktual

Run 16 Oct 2026, Cypress 16.2.0, Firefox 158 headless, Node 24.18.0, Windows 11. Setelah perbaikan terakhir test dijalankan 6× berturut-turut dan lulus semua, lalu satu run final:

| Item | Hasil |
|---|---|
| Status | **1 test, 1 passed, 0 failed** (15 detik) |
| Video #3 | "1000 Players Simulate End Prison in Minecraft" — channel **Parrot** (`/watch?v=9-j9GWjyWpY`) |
| Log terminal | [docs/run-output.log](docs/run-output.log) |

Video trending berubah setiap saat, jadi video #3 bisa berbeda di run berikutnya.

## 9. Known Issues & Troubleshooting

- **Chrome/Electron/Edge crash.** Dengan Cypress 16.2.0 + Chromium 155, renderer crash (`We detected that the Chrome Renderer process just crashed`) setiap kali halaman watch atau Gaming (via SPA) dimuat — juga saat stream video diblokir, script player diblokir, `chromeWebSecurity` diubah, atau memory management diaktifkan. Firefox tidak mengalaminya, jadi script memakai `--browser firefox`.
- **Bahasa & region.** IP Indonesia membuat UI berbahasa Indonesia. Cookie `PREF=hl=en&gl=US` dipasang supaya label `Gaming` / `Trending videos` / `View all` konsisten. Region US dipilih karena dengan `hl=en` + region Indonesia, halaman watch menampilkan judul **terjemahan otomatis** (mis. "Rakit Kereta Sendiri!" menjadi "Build Your Own Train!") sedangkan daftar trending menampilkan judul asli; test akan gagal dengan benar dalam kondisi itu. Hasil uji 8 video teratas: `hl=en&gl=US` cocok 8/8.
- **themeRefresh.** Jika tema OS gelap, YouTube me-reload dirinya (`?themeRefresh=1`) di tengah test. Firefox dipaksa `prefers-color-scheme: light` di `cypress.config.js`.
- **Router SPA.** Klik sidebar sebelum navigasi awal YouTube selesai tidak berpindah halaman. Test menunggu event `yt-navigate-finish` sebelum klik.
- **Halaman tersembunyi.** YouTube menyimpan halaman sebelumnya sebagai `ytd-browse` tersembunyi; list trending diambil hanya dari section yang terlihat.
- `uncaught:exception` dari script YouTube diabaikan di `cypress/support/e2e.js`. Assertion test tetap berlaku.
- Test tidak login dan tidak melakukan aksi yang mengubah akun.
