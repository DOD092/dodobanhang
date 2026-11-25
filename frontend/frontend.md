@AGENTS.md

# dodobanhang - frontend

Tài liệu cho code web (Next.js) trong folder này. Tổng quan repo (frontend + backend) ở `../CLAUDE.md`; tài liệu backend ở `../backend/backend.md`.
Mọi lệnh npm chạy trong folder `frontend/`.

## Lĩnh vực kinh doanh (theo giấy phép, dùng để viết nội dung)

**⚠ Bảng dưới đây (theo giấy phép kinh doanh) không còn khớp với sản phẩm thật đang hiển thị.**
Chủ dự án đã cung cấp **9 sản phẩm thật** (xem mục "Dữ liệu"): vòng bi, vít, tay cầm cửa (cơ khí),
tấm nhôm hợp kim, máy bay nông nghiệp, tấm pin và đèn năng lượng mặt trời, đèn LED - đều **không**
thuộc "sắt thép, kim loại, vật liệu xây dựng" trong giấy phép ở bảng dưới, và cũng rộng hơn cả 2
dịch vụ hiện có. Có vẻ công ty thực tế kinh doanh thiết bị công nghiệp nói chung (khớp với mô tả
trong `content` của dịch vụ "Tư vấn thiết bị công nghiệp": "thiết bị điện, chiếu sáng, máy móc,
nông nghiệp, năng lượng..."), không chỉ sắt thép. Đã hỏi chủ dự án về việc sửa `siteConfig.tagline`/
`description` (Hero, footer, SEO, hiện vẫn ghi "Sắt thép, nhôm, inox & vật liệu xây dựng") cho khớp
9 sản phẩm mới - **chủ dự án trả lời chưa cần sửa slogan lúc này**, nên giữ nguyên. Bảng ngành nghề
bên dưới (và cột "Dùng ở" gắn với 6 nhóm sản phẩm thép/sơn cũ) coi như tư liệu lịch sử, không dùng
để đối chiếu sản phẩm hiện tại nữa; cập nhật lại khi chủ dự án chốt phạm vi kinh doanh thật.

Công ty **bán** sắt thép, kim loại, vật liệu xây dựng (không bán máy móc) và làm **dịch vụ** (giấy phép có lắp đặt PCCC, camera, máy móc công nghiệp; **trên web hiện có 2 dịch vụ theo nội dung chủ dự án cung cấp: "Tư vấn thiết bị công nghiệp" và "Hỗ trợ thi công – lắp đặt thiết bị"**, xem mục "Dữ liệu"). Viết slogan, mô tả, dịch vụ phải bám theo danh sách này; không tự thêm lĩnh vực hay cam kết không có trong đây. **(Xem cảnh báo ở trên - bảng này đang lệch với sản phẩm thật.)**

| Mã | Ngành | Dùng ở |
|---|---|---|
| **4662** (chính) | Bán buôn sắt, thép xây dựng và công nghiệp, thép tấm, thép hình, nhôm, inox | Nhóm sản phẩm 1-4 |
| 4663 | Bán buôn sơn các loại | Nhóm sản phẩm 5 |
| 4752 | Bán lẻ vật liệu xây dựng, vật liệu trang trí nội thất | Nhóm sản phẩm 6 |
| (3320) | Lắp đặt máy móc và thiết bị công nghiệp. Chi tiết: lắp đặt máy móc, thiết bị PCCC, camera; lắp đặt máy móc và thiết bị công nghiệp (trừ xi mạ, gia công cơ khí) | **Dịch vụ** (chủ dự án đã thay bằng 2 dịch vụ mới từ s1.pdf, s2.pdf; đã **thay** hướng PCCC + camera trước đó. Nội dung 2 dịch vụ này nhắc thiết bị điện, chiếu sáng, máy móc, nông nghiệp, năng lượng: rộng hơn giấy phép ở dòng này, chờ chủ dự án xác nhận) Mã lấy theo VSIC, ảnh giấy phép không chụp cột mã |
| 2592 | Gia công cắt thép | Không đưa lên web |
| 4933 | Vận tải hàng hóa đường bộ | Không đưa lên mục Dịch vụ (Highlights vẫn có "vận chuyển cả nước") |
| 5022 | Vận tải hàng hóa đường thủy nội địa | Không đưa lên web |
| 4610 | Đại lý ký gửi hàng hóa | Không đưa lên web |

## Tech stack (frontend)

| Thứ | Phiên bản | Ghi chú |
|---|---|---|
| Next.js | 16 (App Router, Turbopack) | Cần Node >= 20.9 (máy hiện dùng 24.20) |
| React | 19 | |
| TypeScript | 5 | `strict`, alias `@/*` -> `src/*` |
| Tailwind CSS | 4 | Cấu hình bằng CSS, không có `tailwind.config.js`. **Duy nhất, không dùng UI framework nào khác** (xem mục "Styling") |
| Font | Noto Sans (`next/font/google`, subset latin + vietnamese) | Gắn ở `<body>` trong `app/layout.tsx` |
| Prettier | 3 | Cấu hình copy từ dự án mẫu |
| React Hook Form | 7 | Form Liên hệ, kèm `@hookform/resolvers` 5 |
| Zod | 4 | Schema validate (`z.email()`, `.pipe()`; cú pháp v4) |

Chưa dùng: Redux/RTK Query, ESLint. Đăng ký / đăng nhập đã nối backend (xem mục "Đăng ký / đăng nhập"). Dữ liệu sản phẩm/nhóm/form liên hệ lấy từ **backend NestJS** (`../backend/`) qua `fetch`, xem mục "Nối backend".

**Đã bỏ Bootstrap** (chuyển hẳn sang Tailwind thuần để dễ bảo trì lâu dài, tránh việc phải nhớ 2 bộ quy tắc CSS cùng lúc và xung đột `!important`). Gỡ `bootstrap`, `@popperjs/core`, `@types/bootstrap` khỏi `package.json`; xóa `BootstrapClient.tsx`, `OffcanvasAutoClose.tsx`, `postcss-remove-charset.cjs`. Menu mobile, ô tìm kiếm, bộ lọc sản phẩm (trước dùng Bootstrap collapse/offcanvas, cần JS của Bootstrap) nay dùng `useState` + Tailwind thuần, đúng theo mục "Ưu tiên sử dụng" bên dưới.

## Lệnh

```bash
npm install
npm run dev      # dev server
npm run build    # build production + type check (dùng để kiểm tra sau khi sửa)
npm run start    # chạy bản build
npm run format   # prettier --write TOÀN BỘ project (xem lưu ý CRLF ở "Quy ước code")
```

Dev server chạy ở **http://localhost:3001** (`next dev -p 3001`; cùng mạng LAN: http://<IP máy>:3001). Cổng 3000 nhường cho backend (`GOOGLE_CALLBACK_URL` của backend đã đăng ký với Google ở cổng 3000). **Cần backend đang chạy** thì trang chủ và `/products` mới hiện dữ liệu; URL backend đặt trong `.env.local` (copy từ `.env.example`).

## Ưu tiên sử dụng (theo yêu cầu của chủ dự án)

Khi viết code mới, **ưu tiên các cách sau** thay vì tự chế hoặc cài thư viện khác:

1. **Quản lý state giao diện: `useState` / `useContext` của React.**
   Dùng cho dữ liệu động trên UI (bật/tắt menu, ẩn/hiện mật khẩu, thu gọn sidebar, tăng giảm số lượng...).
   Component dùng state/hook phải có `'use client'`. Chưa cần Redux; chỉ cân nhắc khi state dùng chung quá phức tạp.
2. **Chuyển trang: `<Link href="...">` của `next/link` + file-system routing trong `src/app/`.**
   Không cài `react-router-dom`. Đọc URL hiện tại bằng `usePathname()` (client). Xem mục Routing.
3. **Tải dữ liệu: Server Component + `async/await`, gọi hàm trong `features/<domain>/xxxAPI.ts`.**
   Không dùng `useEffect` + `fetch`/axios để lấy dữ liệu trang (kiểu Client-Side Rendering). Dữ liệu lấy ngay trên server nên trang hiện ra cùng dữ liệu.
   Chỉ lấy dữ liệu ở client khi thật sự cần tương tác realtime (vd: ô tìm kiếm lọc theo từng phím gõ).
4. **Form và validate: React Hook Form + Zod** (Formik + Yup chấp nhận được; chọn một bộ, không trộn).
   Kiểm tra định dạng email, độ dài tối thiểu, ô bắt buộc trước khi gửi. Form là Client Component.
   Đã dùng ở `ContactForm`: schema Zod ở `features/contact/contactSchema.ts` (bám theo `types/Contact.ts`), `useForm<Input, unknown, Output>` + `zodResolver`, `noValidate` trên `<form>`. Input/textarea dùng class `.form-input` (định nghĩa trong `globals.css`, thay cho `.form-control` của Bootstrap trước đây), lỗi thêm class `is-invalid` (viền đỏ) + `<p>` màu `text-red-600` bên dưới, kèm `aria-invalid`/`aria-describedby`. Form mới làm theo cùng mẫu này.
5. **Ảnh: component `<Image />` của `next/image`**, không dùng thẻ `<img>`.
   Next tự nén, đổi định dạng và chọn kích thước theo màn hình. Khi dùng `fill` phải có container `relative` (có kích thước/aspect) và thuộc tính `sizes`. Ảnh nội bộ đặt trong `public/images/`; ảnh từ domain ngoài phải khai báo `images.remotePatterns` trong `next.config.ts`. File `.svg` được phục vụ nguyên bản (không tối ưu).

Đã áp dụng: `NavLinks` (`Link` + `usePathname`), `app/page.tsx` (Server Component `async` gọi `getCategories()`/`getServices()`/`getReviews()`), `ContactForm` (React Hook Form + Zod, `useState` cho trạng thái gửi), trang `/products` (xem mục "Trang Sản phẩm").

## Cấu trúc `frontend/`

```
frontend/
├─ package.json, package-lock.json
├─ next.config.ts
├─ tsconfig.json                 alias @/* -> ./src/*
├─ postcss.config.mjs            chỉ bật plugin @tailwindcss/postcss
├─ .prettierrc, .prettierignore
├─ public/images/                ảnh tĩnh (dọn 19/11/2026): hero.png (Hero desktop 1440×520), hero-square.png (Hero mobile 640×640), banner-bg.png (= hero.png xoá nửa trái có chữ, nền banner /about /services /products /contact), cta-strip.png (dải "Mua ngay" 1440×180, trang chủ), brand/dodo-mark.png (con dodo nền trong suốt, header), brand/dodo-icon-yellow.png (icon app, footer), products/, services/, feedbacks/feedback-1..3.jpg, placeholder.svg. Ảnh gốc bộ nhận diện ở `design/logo-dodo-brand-sheet.png` (ngoài public, không deploy). Favicon: `src/app/icon.png` + `apple-icon.png` (cắt từ icon app nền xanh)
└─ src/
   ├─ app/                       routing (file-based) + layout + globals.css
   ├─ config/site.ts             thông tin công ty (tên, SĐT, email, giờ, địa chỉ, mạng xã hội) + mapUrl + danh sách menu
   ├─ config/home.ts             nội dung tĩnh trang chủ: highlights (3 điểm nổi bật), coreValues
   ├─ types/                     interface TypeScript, mỗi entity một file
   ├─ features/                  dữ liệu + hàm truy cập theo từng domain
   ├─ components/                UI tái sử dụng
   │  ├─ layouts/header/         Header, Logo, NavLinks (HeaderSearch.tsx còn file nhưng không dùng, 18/11/2026)
   │  ├─ auth/                   RegisterForm, VerifyEmailForm, ResendVerificationForm, ForgotPasswordForm, ChangePasswordForm, LoginForm, GoogleLoginButton, AuthDivider
   │  ├─ layouts/footer/         Footer
   │  ├─ home/                   HeroBanner, Highlights (+ HighlightsList), CoreValues, CustomerReviews, coreValueIcons.ts
   │  ├─ about/                  CoreValuePanels (giá trị cốt lõi dạng panel mở rộng ở /about), VisionMissionTabs (Tầm nhìn / Sứ mệnh dạng tab)
   │  ├─ product/                CategoryCard (nhóm, trang chủ), ProductCard, ProductGrid, ProductGridSkeleton,
   │  │                          ProductSearch, SortSelect, ProductFilters, FiltersDrawer (drawer mobile + sidebar desktop,
   │  │                          Context, thay Bootstrap offcanvas), ActiveFilters, Pagination
   │  ├─ service/                ServiceCard (trang chủ và mục "Dịch vụ khác"), ServicePanel (trang /services), ServiceBody (vẽ khối `content` ở trang chi tiết), ServiceToc (mục lục cột phụ ở trang chi tiết), headingIds.ts (slug id neo, dùng chung giữa ServiceBody/ServiceToc), serviceIcons.ts (icon theo id, dùng chung)
   │  ├─ common/                 Icons, PageHeader, ImageBanner (đầu trang ảnh nền), Breadcrumbs, ContactCta, BackToTop (nút về đầu trang, gắn ở root layout), Marquee (băng chuyền ngang)
   │  └─ contact/                ContactInfo, ContactForm
   ├─ utils/                     formatPrice.ts (tiền VND), normalizeText.ts (bỏ dấu để tìm kiếm), slug.ts + slugRoute.ts (URL trang chi tiết: `productPath()` cho sản phẩm, `<slug>-<id>` cho dịch vụ), imageUrl.ts (ảnh `/uploads/...` của backend)
   ├─ apis/                      client.ts (gọi backend, bóc envelope `data`, `ApiError`; dùng được cả ở client), server.ts (`serverGet()` cho Server Component)
   ├─ hooks/                     (trống) custom hook
   └─ assets/                    (trống) ảnh import trực tiếp trong code
```

Folder trống được giữ bằng file `.gitkeep`; xóa file này khi thêm nội dung thật vào folder.

### Đối chiếu với dự án mẫu (frontend-admin)

| frontend-admin | Ở đây | Lý do |
|---|---|---|
| `pages/` + `routes/` + `App.tsx` + `main.tsx` | `app/` | Next.js dùng file-based routing; folder = route |
| `services/store.ts` (Redux store) | không có | Chưa dùng Redux |
| `apis/apiSlice.ts` | `apis/` (trống) | Sẽ có khi nối backend |
| `features/<domain>API.ts` (RTK Query) | `features/<domain>/` (data + hàm async) | Dữ liệu hardcode, gọi qua hàm async |
| `components/layouts/{header,sideBar,layout}` | `components/layouts/{header,footer}` + `app/layout.tsx` | Layout gốc do `app/layout.tsx` đảm nhiệm |
| `types/`, `components/`, `hooks/`, `utils/`, `assets/` | giữ nguyên | |

**Không được tạo `src/pages/`**: Next.js coi đó là Pages Router cũ và xung đột với `app/`.

## Routing (`src/app/`)

| Folder | URL | Trạng thái |
|---|---|---|
| `app/page.tsx` | `/` | Hero (`HeroBanner`: ảnh `hero.png` / `hero-square.png` theo màn hình, nút trong ảnh bấm được → `/products`; xem "Layout đã dựng") -> Highlights (`overlap={false}` = `pt-10`, nằm ngay dưới ảnh chứ không đè, vì ảnh mới không có dải trống ở đáy; bản `compact`) -> **Sản phẩm kinh doanh** (5 nhóm sản phẩm = `Category` qua `getCategories()`, `CategoryCard`; 2 cột mobile, 3 cột >= lg; nút "Xem tất cả sản phẩm" -> `/products`. Trang chủ **không** liệt kê sản phẩm lẻ) -> Dịch vụ (câu dẫn `siteConfig.servicesIntro` qua prop `subtitle` của `SectionTitle`; tối đa `HOME_SERVICE_LIMIT` = 3 thẻ; số cột lưới (`grid-cols-1/2/3`) chọn **bằng đúng số thẻ đang hiện** nên không có ô trống lệch trái khi chưa đủ 3 dịch vụ; **ẩn cả mục khi không có dịch vụ nào**; nền `neutral-50`; nút "Xem chi tiết dịch vụ") -> `CtaStrip` (dải `cta-strip.png` "Mua ngay" → `/products`, chỉ từ md) -> Giá trị cốt lõi + Đánh giá khách hàng (2 khung). Nền section xen kẽ trắng / xám nhạt / trắng |
| `app/about/` | `/about` | Xong (vào từ menu "Giới thiệu"): **`ImageBanner`** (banner ảnh nền, xem mục "Layout đã dựng") với ảnh `bannerImage` đầu file, `overlapBottom` chừa đáy. Trước đây là `PageHeader` nền xám + khung ảnh bo góc riêng bên dưới; chủ dự án muốn ảnh làm nền nên bỏ khung (tránh 1 ảnh hiện 2 lần). Đã thử đổi luân phiên 2 ảnh (xe giao + kho hàng) 10 giây/ảnh rồi bỏ, chủ dự án chỉ giữ 1 ảnh tĩnh → `HighlightsList` (3 số liệu) **đè lên mép dưới banner** (`-mt-14 md:-mt-20`, rộng hết container) → "Về chúng tôi": **>= lg 2 cột (`lg:grid-cols-2`)**: trái là tiêu đề (`SectionHeading` "Về chúng tôi") rồi chữ giới thiệu (đoạn đầu to hơn làm đoạn dẫn, tên công ty viết "Công ty **Trung Quân Phát**" thay vì `siteConfig.name` in hoa) | phải là `VisionMissionTabs` ngang hàng với tiêu đề (dính `lg:sticky lg:top-24`). < lg xếp dọc. Đã thử 2 thẻ Tầm nhìn / Sứ mệnh xếp dọc bên phải: nặng, lệch đầu với cột chữ, chủ dự án chọn đổi sang tab → Giá trị cốt lõi (`SectionHeading` + câu dẫn đếm theo `coreValues.length`; `coreValues`, `CoreValuePanels`: **1 hàng panel ngang, rê chuột/Tab/bấm vào panel nào thì panel đó mở**, xem mục "Layout đã dựng"; câu dẫn đếm theo `coreValues.length`) → `ContactCta`. Đã thử băng chuyền chạy ngang (`Marquee`) cho mục này rồi bỏ: đoạn mô tả 4-6 dòng đang trôi rất khó đọc, và màn hình rộng hơn tổng 5 thẻ thì lộ thẻ lặp ở 2 mép. Ảnh nền hiện là **`banner-bg.png`** (19/11/2026: hero dodo đã xoá nửa trái có chữ, `object-right`; trước đó là `hero-banner.png`, chủ dự án đổi từ ảnh xe giao `about-van-chuyen.jpg`). Ảnh nền sáng + có sẵn chữ/logo nên dưới lớp phủ tối thành họa tiết mờ; dòng slogan trong ảnh bị cắt ở mép trên và 4 biểu tượng đáy bị `HighlightsList` che (chấp nhận được vì chỉ làm nền). Ở 1440×900 màn hình đầu thấy trọn banner + hàng số liệu |
| `app/services/` | `/services` | Xong: `ImageBanner` (ảnh nền `banner-bg.png`, `object-right`; câu dẫn `siteConfig.servicesIntro`) → các `ServicePanel` mở rộng khi hover (số lượng theo `serviceData.ts`, hiện 2) → `ContactCta`. Trang tĩnh (○) |
| `app/services/[slug]/` | `/services/ho-tro-thi-cong-lap-dat-thiet-bi-2` | Xong: `PageHeader` (breadcrumb, tiêu đề = `name`, mô tả, nút "Tư vấn ngay") → thân bài `ServiceBody` (khối `content`; `content` rỗng thì tạm dựng từ `details`, cả hai rỗng thì hiện dòng "đang cập nhật") → "Dịch vụ khác" (`ServiceCard` trỏ tới trang chi tiết, ẩn khi không còn dịch vụ khác) → `ContactCta`. `generateStaticParams` build sẵn từng dịch vụ (●) theo URL chuẩn `<slug>-<id>`; không có id hợp lệ, id không tồn tại hoặc dịch vụ `is_active = false` thì `notFound()` (404 thật, có `not-found.tsx` riêng); id đúng nhưng slug sai/cũ hoặc chỉ có id thì chuyển hướng 308 về URL chuẩn (xem mục "URL trang chi tiết") |
| `app/products/(list)/` | `/products` | Xong: tìm kiếm, lọc nhóm + khoảng giá, sắp xếp, phân trang (xem "Trang Sản phẩm"). `(list)` là route group, không có trong URL |
| `app/products/[slug]/` | `/products/vong-bi-nsk-684zz`... | Xong: chi tiết sản phẩm + sản phẩm cùng nhóm, `not-found.tsx` riêng. URL là **slug lưu trong DB** (không kèm id), render theo request (ƒ), không có `generateStaticParams`. Slug sai/cũ → 404 (không còn chuyển hướng 308 như kiểu `<slug>-<id>`) |
| `app/register/` | `/register` | Đăng ký (`RegisterForm`), xong thì chuyển `/verify-email?email=...` |
| `app/verify-email/` | `/verify-email?email=...` | Nhập mã 6 số + gửi lại mã (`VerifyEmailForm`). Server Component đọc `email` từ `searchParams`, thiếu thì `redirect('/register')` |
| `app/login/` | `/login` | Đăng nhập (`LoginForm`), xong chuyển `/account` |
| `app/account/` | `/account` | Client Component: thông tin tài khoản + Đăng xuất. Chưa đăng nhập thì `router.replace('/login')` |
| `app/contact/` | `/contact` | Xong: `ContactInfo` (SĐT, email, địa chỉ có link Google Maps, giờ làm việc; nền ảnh `banner-bg.png` + lớp phủ xanh `brand-primary`, chữ trắng, cùng kiểu `ImageBanner`) -> 2 cột: lời cảm ơn bên trái, `ContactForm` bên phải. Có `metadata.title` riêng |

- Thêm trang: tạo `app/<tên>/page.tsx`, không cần đăng ký ở đâu khác. Menu lấy từ `navItems` trong `config/site.ts`, nên thêm mục menu ở đó.
- Trang chi tiết: `app/products/[slug]/page.tsx` (thư mục `[slug]` nhưng giá trị là `<slug>-<id>`, xem mục "URL trang chi tiết").
- **`loading.tsx` bọc mọi route con cùng cấp.** Khi đó trang stream sớm, và `notFound()` ở route con chỉ trả được mã 200 (soft 404). Vì vậy `loading.tsx` của `/products` nằm trong route group `(list)` để không bọc `[id]`. Làm các trang chi tiết khác cũng theo cách này.
- 404: `app/not-found.tsx`. Loading: `app/loading.tsx`.
- `app/layout.tsx` là root layout (`lang="vi"`): mọi thứ bọc trong **`<AuthProvider>`** (bắt buộc, vì `Header` gọi `useAuth()`) gồm `Header` + `<main className="flex-1">{children}</main>` + `Footer` + `BackToTop`. **Trang con không tự bọc `<main>`**; dùng `<div className="container py-5">` (hoặc `<section>`).
- **`BackToTop`** (client, `components/common/`): nút tròn góc dưới phải (`fixed right-4 bottom-4 z-30`, `z-30` thấp hơn lớp phủ/khung của `FiltersDrawer` để không nổi đè lên khi mở bộ lọc mobile), hiện sau khi `window.scrollY > 400`, bấm cuộn mượt về đầu (`scrollTo({behavior:'smooth'})`). Có ở mọi trang vì gắn ở root layout, không phải thêm riêng từng trang dài.
- Tên folder/file dùng **tiếng Anh**; chữ hiển thị trên giao diện là tiếng Việt.

## URL trang chi tiết (slug + id)

> **Sản phẩm là ngoại lệ (từ 17/11/2026, khi nối backend):** khoá chính trong DB là uuid và bảng `products` có cột `slug` UNIQUE, nên URL chỉ là `/products/<slug>` và tìm bằng slug (`productPath()` trong `utils/slug.ts`, `getProductBySlug()`). Các quy tắc `<slug>-<id>` bên dưới giờ chỉ áp dụng cho dữ liệu hardcode có id số (dịch vụ). Khi chuyển dịch vụ lên backend thì làm như sản phẩm.

**Quy tắc bắt buộc cho MỌI trang chi tiết, hiện tại và sau này** (sản phẩm, dịch vụ, bài viết, dự án...): URL dạng `/<mục>/<slug>-<id>`, **id ở cuối**, ví dụ `/services/lap-dat-camera-2`, `/products/vong-bi-nsk-684zz-1`. Chọn theo kiểu Shopee/VnExpress/Tiki: chữ để đọc và cho SEO, số để tìm.

- **Slug tự sinh từ `name`** (`toSlug()` trong `utils/slug.ts`: bỏ dấu tiếng Việt, chữ thường, ký tự lạ thành `-`, tối đa 80 ký tự, cắt ở ranh giới từ). **Không có trường `slug` trong dữ liệu**, nên không phải viết tay hay giữ cho không trùng. Tên không tạo được slug thì URL chỉ còn id (`/services/2`).
- **Tìm bằng id**, lấy từ dãy số sau dấu `-` cuối cùng (`parseSlugId()`); phần chữ không ảnh hưởng việc tìm. Tên có số ở giữa (như "thép phi 16") vẫn đúng vì id luôn nằm cuối.
- **Mỗi trang chỉ có một URL chuẩn**: vào bằng URL không chuẩn thì `redirectToCanonical()` chuyển hướng vĩnh viễn (308) về URL chuẩn.

| URL | Kết quả |
|---|---|
| `/services/lap-dat-camera-2` (chuẩn) | 200 |
| `/services/2`, `/services/ten-cu-khac-2` (id đúng, slug thiếu/sai/cũ) | 308 về URL chuẩn |
| `/services/lap-dat-camera` (không có id), `/services/abc`, `/services/1.5`, `/services/99` (id không có) | 404 |

**Cách làm cho một loại trang chi tiết mới** (xem `app/services/[slug]/page.tsx` làm mẫu):
1. Entity có `id: number` và `name: string`. Tên field khác (vd `title`) thì map khi gọi: `slugPath('/posts', { id: post.id, name: post.title })`.
2. Có hàm `getXxxById(id: number)` trong `features/<domain>/xxxAPI.ts`.
3. Tạo `app/<mục>/[slug]/page.tsx` và `not-found.tsx` (thư mục tên `[slug]`, giá trị là `<slug>-<id>`).
4. `generateStaticParams`: `items.map((item) => ({ slug: slugParam(item) }))`.
5. `generateMetadata`: `findBySlugParam(slug, getXxxById)` (**không** gọi `redirectToCanonical` ở đây).
6. Page: `findBySlugParam` → `if (!item) notFound()` → `redirectToCanonical('/<mục>', slug, item)`.
7. **Mọi link tới trang chi tiết dùng `slugPath('/<mục>', item)`**, không tự ghép chuỗi `/<mục>/${id}`.

Lưu ý:
- Đổi `name` thì URL chuẩn đổi theo, URL cũ vẫn mở được và chuyển hướng (miễn `id` không đổi và không bị tái sử dụng cho mục khác).
- Trang lọc như `/products?category=1` là query của trang danh sách, không phải trang chi tiết nên không dùng slug.
- Next.js so khớp đường dẫn của trang dựng sẵn **không phân biệt hoa thường**: `/services/LAP-DAT-CAMERA-2` trả 200 chứ không chuyển hướng. Chấp nhận được.
- Khi có domain thật: thêm `alternates.canonical` trong metadata (cần `metadataBase`, xem ghi chú ở `generateMetadata`).
- Khi có database mà muốn tự đặt slug: thêm cột `slug` tùy chọn và sửa `slugParam()` dùng nó (có thì dùng, không có thì tự sinh); cách đọc id giữ nguyên.

## Layout đã dựng (theo mock Canva)

- **Header**: **1 hàng**, nền trắng, `sticky top-0 z-50` (dính trên cùng khi cuộn, chỉ CSS). `Header.tsx` là **Client Component** (`useState` cho `menuOpen`, tự đóng khi `usePathname()` đổi; `useAuth()` lấy `user`/`loading`), thứ tự DOM `Logo | cụm nút | menu`, không dùng thư viện nào cho việc thu gọn (trước dùng Bootstrap collapse):
  - Desktop (>= lg, 1024px): cụm nút có `lg:order-3` nên hiển thị `Logo | Menu | Tài khoản` (menu luôn hiện, bỏ qua `menuOpen`).
  - **19/11/2026**: logo = con dodo (`brand/dodo-mark.png`) + chữ "dodo" xanh "banhang" đỏ gạch; "Tài khoản" là nút vàng bo tròn. **HeroBanner** dùng `<picture>` + `getImageProps` (art direction): < 640px ảnh vuông, >= 640px ảnh ngang; nút vẽ sẵn trong ảnh được phủ link trong suốt theo tọa độ % (`HOTSPOTS`: "Mua ngay" và "Xem sản phẩm" → `/products`). Bộ ảnh hiện tại là bản **"Mua sắm cùng dodo. Đặt hàng ngay."** (cho người mua, thay bản "Mở gian hàng" cùng ngày). **Thay ảnh trùng tên thì xoá `.next/dev/cache/images` + Ctrl+F5**, nếu không Next/trình duyệt vẫn hiện ảnh cũ. `CtaStrip` (dải `cta-strip.png`, cả dải link `/products`) nằm trước Giá trị cốt lõi, chỉ hiện từ md.
- **18/11/2026: bỏ nút tìm kiếm (🔍 + `HeaderSearch`) và nút gọi điện (📞 SĐT) khỏi header** theo yêu cầu; thêm link **"Tài khoản"** (chữ cố định): chưa đăng nhập → `/login`, đã đăng nhập → `/account`. Chỉ hiện khi `loading` của `AuthProvider` đã xong để link không đổi đích giữa chừng. Tìm sản phẩm giờ chỉ ở ô tìm kiếm trang `/products`; SĐT vẫn ở footer và `/contact`.
  - **Giỏ hàng** (`CartMenu.tsx`, 25/11/2026): nút giỏ + số lượng; từ md rê chuột / Tab vào thì hiện khung xem nhanh kiểu Shopee (tối đa 5 sản phẩm mới thêm nhất: ảnh, tên, phân loại, giá, xN; "Xem giỏ hàng"; giỏ trống thì "Chưa có sản phẩm" + nút đăng nhập nếu chưa đăng nhập). Ảnh lấy từ `MyCart.items[].image` (backend: ảnh biến thể, không có thì ảnh chính sản phẩm). Mở/đóng bằng state (không `group-hover` thuần CSS) để đổi trang thì tự đóng.
  - Mobile/tablet (< lg): logo + "Tài khoản" + hamburger (`MenuIcon`/`XIcon` đổi theo `menuOpen`) cùng 1 hàng; menu (`w-full`) thả xuống dòng dưới do `flex-wrap`, mỗi mục một dòng có kẻ ngăn cách. **Trượt xuống có hiệu ứng** (không phải bật/tắt `hidden`/`flex` cứng): `#main-nav` là `grid` với `grid-rows-[0fr]` (đóng) ↔ `grid-rows-[1fr]` (mở, theo `menuOpen`) + `transition-all duration-300`, cùng kỹ thuật với chi tiết dịch vụ (`ServicePanel`, vì `height: auto` không animate được). Desktop (>= lg) ép `lg:grid-rows-[1fr]` cố định (giãn hết, bỏ qua `menuOpen`); div con bên trong đổi thành `lg:flex lg:justify-center` để canh giữa hàng ngang.
    - **`overflow-hidden` phải đặt ở CON (grid item, div bọc `NavLinks`), không phải khung ngoài (grid container).** Item trong grid mặc định có `min-height: auto`, khiến hàng không co về `0fr` được nếu chính item đó không có `overflow` khác `visible` - đặt nhầm ở container thì khung vẫn cao đủ nội dung (chỉ `opacity-0` làm trong suốt), để lại khoảng trắng chèn giữa header và nội dung bên dưới lúc đóng menu (lỗi thật đã gặp, xem cùng lỗi tương tự đã tránh đúng ở `ServicePanel`).
  - `Logo` (19/11/2026): con dodo nền trong suốt `public/images/brand/dodo-mark.png` (206×194, cắt từ bộ nhận diện `frontend/design/logo-dodo-brand-sheet.png`) qua `next/image` `width={42} height={40}`, `loading="eager"` + chữ **"dodo"** (`brand-primary`) **"banhang"** (đỏ gạch `#B3361A`), `font-extrabold`. Chữ ẩn khi màn hình < 440px để header không vỡ 2 hàng.
    - Logo cũ (`logo.png`, `logo-red.png` chữ "TQP" đỏ; `logo.svg` chữ "D" tạm) **đã xoá** 19/11/2026.
    - Favicon: `src/app/icon.png` (192px) + `src/app/apple-icon.png` (180px, vuông đặc để iOS tự bo góc), cắt từ icon app nền xanh trong bộ nhận diện (file convention của Next, không phải khai báo trong `metadata`).
  - (Cũ, đã bỏ 18/11/2026) Nút gọi là `<a href="tel:">` dạng `btn btn-primary rounded-full`. Nút kính lúp mở `HeaderSearch` (nhận `open`/`onClose` từ `Header`, không còn tự quản lý qua id/Bootstrap collapse; tự focus ô nhập khi `open` đổi thành true): gửi `next/form` tới `/products?q=...`.
  - Email, giờ làm việc, địa chỉ **không ở header** (có ở footer và trang `/contact`).
  - Menu: mục đang chọn chữ `brand-primary` đậm + gạch chân đỏ (chỉ ở >= lg); chữ `whitespace-nowrap`.
- **Footer**: (mô tả gốc: nền đen, viền đỏ - nay là nền xanh, viền vàng, xem dòng "Trái" bên dưới), 3 cột Tailwind grid (`grid-cols-12` + `col-span-5/3/4`, tương đương tỉ lệ 5/3/4 của Bootstrap trước đây):
  - **Nền xanh `brand-primary`, viền trên vàng `border-brand-accent`** (19/11/2026, trước là nền đen). Trái: icon app nền vàng `brand/dodo-icon-yellow.png` (56px) trên **1 hàng riêng**, tên xuống dưới, rồi `description`, nút mạng xã hội từ `siteConfig.socials` (link rỗng thì nút tự ẩn; hiện chỉ có Zalo). Chữ phụ `text-white/75`; icon liên hệ xanh trong vòng tròn vàng.
  - Giữa: liên kết menu; mobile nằm ngang tự xuống dòng, desktop danh sách dọc.
  - Phải: SĐT, email, địa chỉ (link Google Maps qua `mapUrl`), giờ làm việc; mỗi dòng có icon trắng trong vòng tròn đỏ (icon đỏ trơn trên nền đen quá tối).
  - Dòng bản quyền tiếng Việt "Bảo lưu mọi quyền.". **Không** hiện mã số thuế (chủ dự án không muốn).
- **HeroBanner** (19/11/2026, bộ ảnh "Mua sắm cùng dodo. Đặt hàng ngay."): `<picture>` + `getImageProps()` (art direction, xem docs Next `image.md`): **< 640px** `hero-square.png` (640×640), **>= 640px** `hero.png` (1440×520). Logo, slogan, nút đều vẽ sẵn trong ảnh nên hiện trọn ảnh; `<h1 className="sr-only">` giữ tiêu đề cho SEO/trình đọc màn hình. Nút trong ảnh không bấm được → phủ `<Link>` trong suốt theo tọa độ % (`HOTSPOTS`, đo trên ảnh gốc): "Mua ngay" và "Xem sản phẩm" → `/products` (ảnh vuông chỉ có "Mua ngay"). **Đổi ảnh khác phải đo lại tọa độ** và sửa width/height. Ảnh tải `eager` + `fetchPriority="high"` (ảnh LCP). Lịch sử: ảnh bìa `home-banner.png` của công ty cũ (đến 18/10/2026) → bản "Mở gian hàng" (sáng 19/11/2026) → bản hiện tại.
  - Trước đây Hero là nền gradient đen -> đỏ + h1 2 tầng (`companyType` / `shortName` rất to) + `tagline` + `description` + 2 nút "Giới thiệu" / "Liên hệ tư vấn"; đã bỏ hết khi gắn ảnh bìa (2 nút trùng với menu). Slogan trong ảnh ("Thiết bị công nghiệp") khác `siteConfig.tagline` ("Sắt thép, nhôm, inox..."), `tagline` hiện **không còn nơi nào dùng** (giữ trong `site.ts`, chờ chủ dự án chốt phạm vi kinh doanh, xem mục "Lĩnh vực kinh doanh").
- **Tiêu đề section** trang chủ (`SectionTitle` trong `app/page.tsx`): căn giữa, in hoa, gạch đỏ ngắn bên dưới. Nút "Xem thêm" (`MoreButton`) là `btn btn-outline-primary rounded-full`.
- **Highlights**: 3 ô (icon trong vòng tròn `brand-primary-light` + số to màu đỏ + nhãn), thẻ trắng viền trên đỏ, ở trang chủ **đè lên dải trống mép dưới ảnh bìa** (`-mt-[2vw]`: ảnh tràn ngang cao 39.7vw, phần trống dưới 4 biểu tượng của ảnh ~2.7vw; đè sâu hơn sẽ che 4 biểu tượng, đổi ảnh bìa thì tính lại) và dùng prop `compact` (>= lg icon nằm ngang cạnh số, thẻ thấp ~100px thay vì ~180px; md vẫn xếp dọc vì ngang thì nhãn bị xuống dòng) để ảnh + thẻ vừa 1 màn hình (đã kiểm tra 1440×800, 1920×950). Trang Giới thiệu dùng bản thường. Icon chọn theo key `icon` trong `config/home.ts`. Phần thẻ tách thành `HighlightsList` (named export trong `Highlights.tsx`, nhận `className` cho margin) để trang Giới thiệu dùng lại; default export `Highlights` chỉ bọc thêm `section` + `-mt-[2vw]` + `compact` cho trang chủ.
- **`CoreValuePanels`** (`components/about/`, Client Component): cùng kiểu `ServicePanel`. `useState<number | null>(null)`: **mặc định không panel nào mở** (5 panel bằng nhau, cùng viền trên đỏ, kèm dòng gợi ý "Rê chuột vào từng giá trị để xem chi tiết." chỉ hiện >= lg). `onMouseEnter`/`onFocus`/`onClick` trên `<li>` mở panel đó; `onMouseLeave` trên `<ol>` (không phải `<li>`, để rê từ panel này sang panel kia không bị đóng giữa chừng) và `onBlur` khi focus rời hẳn khỏi `<ol>` thì đóng hết. Màn hình cảm ứng: chạm để mở, giữ mở tới khi chạm panel khác. Trước đây mặc định mở sẵn panel đầu và giữ panel vừa xem, chủ dự án muốn trở lại bằng nhau khi không rê chuột nên đã đổi. >= lg: hàng ngang `lg:h-80`, panel mở `lg:flex-3` nền đen + mô tả trượt ra (`grid-rows-[0fr]` ↔ `[1fr]`), panel đóng `lg:flex-1` chỉ có icon + tên (số thứ tự mờ ở góc đã bỏ theo yêu cầu chủ dự án) (khi có panel đang mở thì bỏ viền đỏ để làm nổi panel đó). < lg: xếp dọc, hiện đủ mô tả. Mô tả có `min-w` để không nhảy dòng lúc giãn; **giá trị `min-w` phải <= bề rộng chữ của panel mở** (flex chia phần còn lại sau khi trừ padding + viền của cả 5 panel: ~284px ở 1024px, ~376px ở >= 1280px → đang dùng `lg:min-w-70 xl:min-w-92`), nếu lớn hơn thì mô tả bị cắt chữ ở mép phải (lỗi thật đã gặp). Đổi padding/gap/số panel/tỉ lệ `flex-3` thì tính lại. Icon lấy từ `components/home/coreValueIcons.ts` (file thường, dùng chung với `CoreValues` trang chủ).
- **`SectionHeading`** (hàm trong `app/about/page.tsx`, chỉ trang Giới thiệu dùng): **cùng kiểu đầu trang `PageHeader`** để cả trang 1 kiểu tiêu đề: gạch đỏ ngắn `h-1 w-16` phía trên, `<h2>` IN HOA đậm căn trái (`text-2xl md:text-3xl`, nhỏ hơn h1 đầu trang một cấp), câu dẫn xám tùy chọn. Đã thử kiểu "nhãn nhỏ đỏ + tiêu đề lớn chữ thường" rồi bỏ: lệch kiểu với đầu trang "GIỚI THIỆU". Trang chủ vẫn dùng `SectionTitle` riêng (căn giữa, gạch đỏ dưới).
- **`VisionMissionTabs`** (`components/about/`, Client Component, nội dung Tầm nhìn / Sứ mệnh viết trong file): 1 khung viền trên đỏ. >= lg có thanh 2 tab (`role="tablist"`, bấm hoặc phím mũi tên trái/phải); các panel **chồng cùng 1 ô grid** (`lg:col-start-1 lg:row-start-1`), panel không chọn chỉ `lg:invisible lg:opacity-0` nên khung luôn cao bằng panel dài nhất, đổi tab không làm khung co giãn. < lg ẩn thanh tab, hiện đủ cả 2 panel nối tiếp, ngăn bằng đường kẻ.
- **`Marquee`** (`components/common/Marquee.tsx`, Server Component, thuần CSS; **hiện chưa trang nào dùng**, giữ cho nội dung ngắn như logo đối tác, không hợp với đoạn văn dài): băng chuyền ngang vô tận, nhận `items: ReactNode[]`, `label`, `secondsPerItem` (mặc định 8s/thẻ, tốc độ không đổi khi thêm/bớt thẻ). Dải gồm 2 nửa giống nhau chạy `animate-marquee` (keyframes `translateX(0 → -50%)` khai báo trong `@theme` của `globals.css`; thời lượng đặt qua `style.animationDuration` vì biến lồng trong `--animate-*` được tính ở `:root`, không đổi theo từng phần tử được). Mỗi nửa có `pr-6` = `gap-6` để chỗ nối không lệch; ít phần tử thì lặp đủ `MIN_ITEMS_PER_HALF` = 6 để nửa dải luôn dài hơn màn hình. Dừng khi `hover`/`focus-within` (`[animation-play-state:paused]`); màn hình cảm ứng thì vẫn chạy. Bản lặp có `inert` (trình đọc màn hình chỉ đọc 1 lần, Tab không vào). `motion-reduce`: không chạy, ẩn bản lặp, thành dải cuộn ngang. Mép mờ bằng `mask-image`. Cách kiểm tra bằng Edge headless: ảnh chụp không thấy chuyển động (animation không chạy theo virtual time khi chụp), phải đọc `getComputedStyle(track).transform` ở 2 thời điểm qua `--dump-dom`.
- **`ImageBanner`** (`components/common/`, Server Component): đầu trang dạng banner ảnh nền, thay `PageHeader` ở trang nào muốn có ảnh (đang dùng ở `/about`, `/services`, `/products`). Props: `title`, `subtitle?`, `breadcrumbs`, `children?` (nội dung phụ dưới tiêu đề, vd ô tìm kiếm `/products`; `.form-input` có nền trắng + chữ đen riêng nên đặt trên nền tối vẫn rõ), `image: BannerImage` (`src`, `alt`, `position?` = class `object-[...]` viết nguyên chuỗi ở nơi khai báo để Tailwind quét thấy), `overlapBottom?` (chừa đáy `pb-24 md:pb-32` cho khối sau đè lên, như `HighlightsList` ở `/about`). Ảnh `fill` + `object-cover` + `preload` (ảnh LCP), lớp phủ `bg-linear-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/20` (đậm bên trái chỗ chữ, nhạt dần sang phải), chữ trắng; `Breadcrumbs` đổi màu bằng `[&_ol]:text-neutral-300 [&_[aria-current]]:text-white` vì component mặc định cho nền sáng. Cao tối thiểu `min-h-80 md:min-h-104 lg:min-h-120`, chữ căn giữa theo chiều dọc. Ảnh tĩnh, không chuyển ảnh.
- **`PageHeader`** (`components/common/`): prop `overlapBottom` chừa thêm khoảng trống ở đáy để khối ngay sau tự đặt `-mt-*` đè lên mép dưới dải xám; prop `centered` căn giữa breadcrumb + gạch đỏ + tiêu đề. **Hiện cả 2 prop chưa trang nào dùng** (`/about` đã chuyển sang banner ảnh nền riêng), giữ lại phòng khi cần.
- **CategoryCard** (nhóm sản phẩm, `components/product/`): nhận `category: Category`. Icon đỏ trong ô vuông bo góc nền `brand-primary-light` (hover đổi thành nền đỏ, icon trắng), tên, mô tả, link "Xem sản phẩm →" tới `/products?category=<slug>` phủ cả thẻ; hover nhấc lên, **viền dưới** chuyển đỏ. Padding `p-[1rem] sm:p-6`. Icon gán theo `category.slug` trong `categoryIcons` (id giờ là uuid, khác nhau giữa các DB); slug lạ dùng `GearIcon`. Khi có ảnh thật có thể đổi icon thành ảnh.
- **ServiceCard**: thẻ icon, **không dùng ảnh** (`image_url` vẫn giữ trong dữ liệu cho trang `/services` sau này). Khác `CategoryCard` ở icon trắng trong vòng tròn đỏ đặc, tên, mô tả, link "Tư vấn ngay →" tới `/contact` phủ cả thẻ (`after:absolute after:inset-0`). Hover: nhấc lên, viền dưới chuyển đỏ (như `CategoryCard`, xem "Kiểu khung chung"). Mobile thẻ ngang (icon trái), từ `sm` thẻ dọc. Icon lấy qua `getServiceIcon(id)` trong `components/service/serviceIcons.ts` (Service không có field icon); id lạ dùng `FactoryIcon`. Thêm/đổi dịch vụ thì cập nhật map này.
- **CoreValues** (khung đen, số thứ tự trong vòng tròn đỏ) và **CustomerReviews** (khung trắng) nằm 2 cột ở >= lg. Mỗi đánh giá theo **định dạng đánh giá sàn TMĐT** (chủ dự án đưa mẫu kiểu Shopee): ảnh đại diện mặc định (`UserIcon` trong vòng tròn xám) | tên khách đã che bớt (`maskName`: "nguyenanh" → "n*****h"; không có tên thì nhãn chung "Khách hàng") → sao đỏ (chỉ khi có `rating`) → ngày `dd/mm/yyyy` (chỉ khi có `created_at`) → nội dung → hàng ảnh vuông `size-20`, bấm mở ảnh gốc tab mới. Khung đánh giá cao hơn `CoreValues` một chút, khung đen tự giãn theo (`h-full` trong grid).
- **Trang Liên hệ**: `ContactInfo` (tiêu đề `<h1>` "Liên hệ chúng tôi", 4 dòng icon trong vòng tròn trắng; **nền ảnh `banner-bg.png` (trước là `hero-banner.png`) + lớp phủ tối `from-neutral-950/90 via-neutral-950/70 to-neutral-950/30`, chữ trắng**, cùng kiểu `ImageBanner` nhưng tự dựng vì không có breadcrumb và có danh sách liên hệ; link hover gạch chân thay vì chữ đỏ vì đỏ trên nền tối khó đọc. Trước đây nền xám + hoạ tiết tổ ong SVG, đã bỏ) + 2 cột (lời cảm ơn | khung form bo góc). Mobile xếp dọc.
  - Lời cảm ơn lấy theo mock, đã sửa "máy móc, thiết bị" thành "sắt thép, vật liệu xây dựng". Link "xem danh sách sản phẩm" đã bỏ theo yêu cầu; dòng cuối "Các sản phẩm được kinh doanh tại Trung Quân Phát." nay đọc như bỏ dở, **chờ chủ dự án chọn**: bỏ hẳn, viết lại cho đủ ý, hay liệt kê nhóm sản phẩm.
- **Trang Sản phẩm** (`/products`, Server Component động):
  - **Bộ lọc lưu trên URL**: `?q=&category=&price=&sort=&page=`. Link chia sẻ được, Back/Forward giữ bộ lọc, SEO đọc được. Đọc và tạo URL qua `features/product/productQuery.ts`: `parseProductQuery()` bỏ qua giá trị lạ, `buildProductsHref()` tự về trang 1 khi đổi bộ lọc và không ghi giá trị mặc định lên URL. File này thuần, dùng được cả ở server lẫn client. Khoảng giá (`priceRanges`) và kiểu sắp xếp (`sortOptions`) khai báo ở đây. Id nhóm không tồn tại thì coi như không lọc.
  - **Sản phẩm "Liên hệ" (`price: null`, hiện toàn bộ 13 sản phẩm)**: `hasPricedProducts()` (`productAPI.ts`) trả `false` khi không sản phẩm nào có giá cụ thể; `page.tsx` gọi 1 lần, truyền xuống `showPriceFilter` (ẩn `FilterGroup` "Khoảng giá" trong `ProductFilters`) và `showPriceSort` (ẩn 2 lựa chọn "Giá thấp/cao đến..." trong `SortSelect`) - lọc/sắp theo giá không có tác dụng gì thì không hiện ra. `searchProducts()` vẫn null-safe phòng khi có link cũ mang `?price=...`: sản phẩm `price: null` không khớp bất kỳ khoảng giá nào; so sánh `price-asc`/`price-desc` dùng `?? Infinity`/`?? -Infinity` nên sản phẩm "Liên hệ" luôn xếp cuối thay vì làm lỗi phép trừ (`null - number`). Có sản phẩm niêm yết giá thật trở lại thì 2 cờ này tự bật lại, không cần sửa gì thêm.
  - `ImageBanner` (ảnh nền `banner-bg.png`, `object-right`; breadcrumb, `<h1>` là tên nhóm đang lọc, mô tả nhóm, ô tìm kiếm qua `children`). `(list)/loading.tsx` dựng khung skeleton cùng nền tối + cùng chiều cao với `ImageBanner` để không nháy xám -> tối khi tải xong (đổi chiều cao `ImageBanner` thì sửa cả file này) → `FiltersDrawer.Root` bọc lưới `grid lg:grid-cols-[260px_1fr]`: `FiltersDrawer.Panel` chứa `ProductFilters` (cột trái, dính khi cuộn ở `lg:sticky lg:top-24`) | cột phải gồm thanh công cụ (`FiltersDrawer.Trigger` chỉ hiện < lg, kèm số bộ lọc đang bật; `SortSelect`) → `ActiveFilters` (chip, bấm để bỏ từng bộ lọc) → `ProductGrid` (dòng "Hiển thị x–y trong z", lưới `grid-cols-2 md:grid-cols-3`, `Pagination`; hết kết quả thì hiện trạng thái rỗng có nút Xóa bộ lọc và Liên hệ) → `ContactCta`.
  - **`ProductSearch`** (client): debounce 300ms rồi `router.replace` cập nhật `?q=`, server lọc lại (không fetch ở client). Bọc trong `next/form` nên Enter vẫn chạy khi chưa có JS. Có spinner tự vẽ (`div` viền tròn `animate-spin`, thay `spinner-border` của Bootstrap) khi `useTransition` đang chạy, nút xóa, phím Esc. Tìm không dấu (`normalizeText`), nhiều từ thì phải khớp đủ các từ; tìm trong tên, SKU, mô tả.
  - **`ProductFilters`** (server): chỉ trả về **nội dung** bộ lọc (2 `FilterGroup`, mỗi lựa chọn một `<Link scroll={false}>`), không tự vẽ khung ẩn/hiện. Bấm lại khoảng giá đang chọn thì bỏ chọn.
  - **`FiltersDrawer`** (`components/product/FiltersDrawer.tsx`, thay Bootstrap `offcanvas-lg`): compound component qua Context (`Root`/`Trigger`/`Panel`, mỗi cái là **named export** riêng) vì nút "Bộ lọc" và khung chứa bộ lọc nằm ở 2 chỗ khác nhau trong layout nhưng dùng chung trạng thái đóng/mở. `page.tsx` import bằng `import * as FiltersDrawer from '...'` (**không** gộp thành 1 object `export default`, xem mục "Lưu ý kỹ thuật" - lỗi thật đã gặp).
    - `Root` giữ `useState` cho `open`, nhận `watchKey` (= `buildProductsHref(query)`) và tự đóng khi giá trị này đổi (thay `OffcanvasAutoClose` trước đây).
    - `Trigger` là nút "Bộ lọc" (`lg:hidden`), `Panel` là khung chứa `children` (nội dung từ `ProductFilters`, một Server Component truyền qua làm `children` của Client Component - hợp lệ trong App Router).
    - Mobile (< lg): `Panel` là khung trượt cố định (`fixed inset-y-0 left-0`, `-translate-x-full` ↔ `translate-x-0`) có lớp phủ (`bg-neutral-950/50`) và nút đóng.
    - Desktop (>= lg): cùng khung đó chuyển thành sidebar tĩnh (`lg:sticky lg:translate-x-0`), bỏ qua `open`, ẩn hẳn header/nút đóng/lớp phủ (`lg:hidden`).
  - **Lazy loading / streaming**: `(list)/loading.tsx` hiện skeleton ngay khi chuyển trang. `<Suspense key={URL bộ lọc}>` quanh `ProductGrid` làm mỗi lần lọc hiện `ProductGridSkeleton`. Ảnh: 3 thẻ đầu `loading="eager"`, còn lại lazy (mặc định của `next/image`). **Next 16 bỏ `priority`**, thay bằng `preload` hoặc `loading="eager"`.
  - `Pagination`: nút tròn tự vẽ bằng Tailwind (thay `.pagination`/`.page-link` của Bootstrap), màu đỏ khi là trang hiện tại (`bg-brand-primary`), hover nền `brand-primary-light`. Trang đầu, trang cuối, ±1 quanh trang hiện tại, chỗ trống là "…". Link có `#product-list` để cuộn về đầu danh sách (`scroll-mt-24` chừa chỗ cho header dính).
  - `generateMetadata`: tiêu đề tab theo nhóm, vd "Vật liệu nhôm - dodobanhang".
- **Chi tiết sản phẩm** (`/products/[slug]`): tìm bằng slug qua `getProductBySlug()` (backend), render theo request; slug không có hoặc sản phẩm đang ẩn thì `notFound()`, trả mã 404 thật. Bố cục: thanh `Breadcrumbs` → `ProductGallery` | nhóm (link về danh sách đã lọc), `<h1>`, SKU (ẩn nếu `null`), giá (`price !== null` thì "Giá tham khảo" + số; `null` thì chỉ 1 dòng "Liên hệ để nhận báo giá"), mô tả, nút Gọi / Nhận báo giá / Zalo, ghi chú → "Sản phẩm cùng nhóm" (tối đa 4) → `ContactCta`. Chưa đặt ảnh OpenGraph vì cần `metadataBase` (domain thật).
- **`ProductGallery`** (`components/product/`, client component): nhận `images: string[]` + `alt`. Ảnh chính `aspect-4/3` + nút trái/phải (`ChevronLeftIcon`/`ChevronRightIcon`, chỉ hiện khi hover qua `opacity-0 group-hover:opacity-100`) + số thứ tự góc dưới phải + dải ảnh nhỏ (`size-16`) bên dưới để bấm chọn thẳng, viền đỏ cho ảnh đang xem - kiểu gallery Shopee. Chỉ 1 ảnh (`images.length === 1`, đa số sản phẩm hiện tại) thì ẩn hết nút/dải ảnh, chỉ còn ảnh tĩnh y như trước khi có gallery. `Product.images` luôn là mảng (tối thiểu 1 phần tử), không còn field `image_url` đơn.
- **`ProductCard`**: dùng `product.images[0]` làm ảnh đại diện (card danh sách luôn 1 ảnh, không có gallery). `price !== null` hiện số tiền (`formatPrice`); `price === null` hiện **nút** "Liên hệ" (`Link` tới `/contact`, không chỉ là chữ) ngay tại chỗ giá. Nút này và link "Chi tiết" (phủ cả thẻ qua `after:absolute after:inset-0`) đều cần bấm riêng được trong cùng 1 thẻ: nút "Liên hệ" có `relative z-10` để nổi lên trên lớp phủ, giống cách `ServicePanel` xử lý nút "Tư vấn ngay". `sizes` của ảnh chỉ còn 2 mốc (`768px:33vw, 50vw`) khớp đúng lưới `grid-cols-2 md:grid-cols-3` (không còn mốc `992px` cũ từ thời Bootstrap, lưới chưa từng lên 4 cột).
  - **Ảnh dùng `object-contain` (+ `p-1` đệm), không dùng `object-cover`**: ảnh sản phẩm do nhiều nguồn khác nhau (nhà cung cấp, ảnh chụp thật) nên tỉ lệ khung hình không cố định giống nhau; `object-cover` sẽ cắt mất phần ảnh không vừa khung `aspect-4/3` (từng bị cắt mất chữ chú thích kích thước trên ảnh đèn LED). `object-contain` luôn hiện đủ ảnh, không cắt. Đệm chỉ `p-1` (từng thử `p-3`/`p-6` nhưng ảnh bị thọt vào giữa khung trống quá nhiều - chủ dự án phản hồi muốn ảnh tràn khung nhất có thể); viền trống còn lại (ảnh không đúng tỉ lệ 4:3) lấp bằng `bg-neutral-100`. Áp dụng ở cả `ProductCard` và ảnh chính trong `ProductGallery`.
- `CategoryCard` trên trang chủ dẫn tới `/products?category=<slug>` (slug nhóm, vd `den-led-chieu-sang`; trước là id số).
- **Trang Dịch vụ** (`/services`): `ServicePanel` dùng hiệu ứng thuần CSS, vẫn là Server Component.
  - **Co giãn theo số lượng dịch vụ** (thêm/xóa trong `serviceData.ts` không làm vỡ giao diện): `splitIntoRows()` trong `app/services/page.tsx` chia **đều** vào các hàng tối đa `MAX_PANELS_PER_ROW` = 3 (1 → [1], 2 → [2], 4 → [2,2], 5 → [3,2], 7 → [3,2,2]) nên hàng cuối không bị lẻ 1 panel dãn hết khung. Hàng chỉ có 1 panel thì giới hạn `max-w-2xl` và căn giữa. 0 dịch vụ thì hiện khối "đang cập nhật" + vẫn có `ContactCta`. Dịch vụ có `details` rỗng thì `ServicePanel` không render khối chi tiết. Số thứ tự mờ "01, 02..." ở góc panel đã bỏ theo yêu cầu chủ dự án (`ServicePanel` không còn prop `index`). Viền panel làm nổi hơn theo yêu cầu: `border-2 border-neutral-300` + viền trên đỏ `border-t-4` ở mọi cỡ màn hình (trước >= lg viền trên trong suốt, chỉ đỏ khi hover) + `shadow-md`. Id chưa có trong `serviceIcons.ts` dùng icon mặc định. Câu dẫn đầu trang lấy từ `siteConfig.servicesIntro` (viết chung, không liệt kê dịch vụ cụ thể để khỏi sai khi đổi danh sách).
  - **>= lg**: mỗi hàng tối đa 3 panel (nhiều hơn thì panel thu gọn quá hẹp, không vừa nút), cao tối thiểu `lg:min-h-136` (chi tiết dài hơn thì hàng tự cao thêm, không bị cắt chữ), hiệu ứng giãn trong từng hàng. Hover hoặc focus-within (Tab tới nút; chạm trên tablet nhờ `tabIndex={-1}`) thì panel giãn `flex-1` → `flex-2`, nền trắng → `neutral-950`, danh sách `details` trượt ra (`grid-rows-[0fr]` → `[1fr]`, vì `height: auto` không animate được). Danh sách có `min-w-96` để chữ không nhảy dòng trong lúc giãn.
  - **< lg**: xếp dọc, luôn hiện chi tiết, vì Tailwind 4 chỉ áp dụng `hover:` trong `@media (hover: hover)`.
  - **Cả panel bấm được để vào trang chi tiết** `/services/<id>`: link "Xem chi tiết" dùng `after:absolute after:inset-0` phủ lên toàn bộ `<li>` (`li` có `relative`; wrapper của nút **không được** có `relative`, nếu không lớp phủ chỉ trùm wrapper). Nút "Tư vấn ngay" (`whitespace-nowrap`, `relative z-10` để nổi trên lớp phủ) vẫn dẫn tới `/contact`. Trên tablet >= lg (không có hover) chạm vào panel sẽ vào thẳng trang chi tiết, không qua bước mở rộng.
  - `ServiceCard` nhận thêm `href` và `linkLabel` (mặc định `/contact` và "Tư vấn ngay"); trang chi tiết truyền `href` tới trang chi tiết của dịch vụ khác. Thẻ ở trang chủ vẫn dẫn tới `/contact`.
- **Trang chi tiết dịch vụ và khối nội dung**: `ServiceBody` duyệt `content` và vẽ từng khối theo `type` (`heading` h2/h3, `paragraph`, `list` ul/ol, `image` bằng `next/image` kèm `figcaption`). Loại khối chưa biết bị **bỏ qua** (không làm vỡ trang). Đổi giao diện khối thì sửa `ServiceBody`, không phải sửa dữ liệu. Thêm loại khối: thêm interface vào `types/ContentBlock.ts` + thêm `case` trong `ServiceBody`. Ảnh trong khối phải có `width`/`height`; ảnh từ domain ngoài cần khai báo `images.remotePatterns` trong `next.config.ts`.
  - **Bố cục 2 cột** (`app/services/[slug]/page.tsx`): cột nội dung `max-w-[70ch]` (dòng chữ dài quá khó đọc) | cột phụ bên phải (`hidden lg:block`, `lg:sticky lg:top-24`) gồm `ServiceToc` (mục lục các heading cấp 2, tự ẩn nếu bài có dưới 2 mục - tránh mục lục 1 dòng vô nghĩa) + khung "Cần tư vấn nhanh?" (nút Gọi/Zalo). Cột phụ này **lấp khoảng trống** thay vì để trắng bên cạnh cột chữ hẹp - trước đó từng để trống, chủ dự án phản hồi và đã sửa.
  - **`headingIds.ts`** (`buildHeadingIds(blocks)`): trả mảng id **song song** với `blocks`, dùng chung giữa `ServiceBody` (gắn `id`/`scroll-mt-24` lên thẻ heading) và `ServiceToc` (tạo link `#id`) để 2 nơi luôn ra cùng id; heading trùng chữ thì tự thêm số ở cuối (`toSlug` từ `utils/slug.ts`, không phải viết thêm hàm bỏ dấu riêng).
  - Trước khi bỏ Bootstrap, `bg-white`/`m-0`/`p-0`... là class Bootstrap có `!important` nên chặn mất `hover:bg-*`/`lg:mx-auto` (panel 1 dịch vụ từng bị lệch trái vì lỗi này). **Từ khi chuyển hẳn sang Tailwind thuần, hết vấn đề này**: mọi class đều là Tailwind thường, không có `!important`, đè lên nhau theo đúng thứ tự lớp (layer) và tính cụ thể (specificity) chuẩn của CSS. Ghi lại đây để hiểu code cũ/lịch sử dự án; không cần né các class này nữa.
- **Icons** (`components/common/Icons.tsx`): SVG kế thừa màu chữ (`currentColor`), chỉnh cỡ bằng `className="size-*"`, chỉnh nét bằng `strokeWidth` khi icon nhỏ.
  - Outline: `SearchIcon`, `MailIcon`, `ClockIcon`, `PhoneIcon` (có vòng tròn bao), `PhoneCallIcon` (ống nghe trơn), `MapPinIcon`, `MenuIcon` (hamburger, dùng cùng `XIcon` để đổi qua lại khi mở/đóng menu mobile), `ArrowUpIcon` (nút về đầu trang), `UserIcon` (ảnh đại diện mặc định ở đánh giá khách hàng), `OrderIcon` (icon dịch vụ "Tư vấn thiết bị"), `WrenchIcon` (cờ lê, icon dịch vụ "Hỗ trợ thi công – lắp đặt"), `ThumbsUpIcon`, `TruckIcon`, `ArrowRightIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `XIcon`, `FilterIcon`, `PackageIcon` (trạng thái rỗng); `FactoryIcon` (icon mặc định cho dịch vụ chưa gán icon trong `serviceIcons.ts`); `FlameIcon` (PCCC), `CctvIcon` (camera) hiện **không dùng tới** (dịch vụ PCCC/camera cũ đã thay bằng 2 dịch vụ mới, xem mục "Dữ liệu"), giữ lại phòng khi thêm dịch vụ.
  - Icon nhóm sản phẩm (`categoryIcons` trong `CategoryCard.tsx`, khớp 5 nhóm hiện tại): `GearIcon` (bánh răng - Cơ khí & phụ kiện, path gốc Lucide "settings"), `LayersIcon` (Vật liệu nhôm, tấm phẳng xếp lớp), `DroneIcon` (máy bay không người lái - Thiết bị nông nghiệp, tự vẽ), `SunIcon` (Năng lượng mặt trời, path gốc Lucide "sun"), `LightbulbIcon` (bóng đèn - Đèn LED chiếu sáng, path gốc Lucide "lightbulb"). `RebarIcon` (bó thép, tự vẽ), `BeamIcon` (thép chữ I, tự vẽ), `CylinderIcon`, `PaintRollerIcon`, `BrickWallIcon` hiện **không dùng tới** (nhóm sản phẩm thép/sơn/xây dựng cũ đã thay bằng 5 nhóm mới, xem mục "Dữ liệu"), giữ lại phòng khi thêm nhóm.
  - Tô đặc: `StarIcon` (truyền `fill="currentColor"`), `FacebookIcon`.
  - Nguồn path: phần lớn từ Lucide (MIT). Icon mới thêm vào file này, không cài thư viện icon.
- **Màu thương hiệu** (19/11/2026, theo bộ nhận diện dodobanhang; trước đó xanh lá `#15803D`, gốc là đỏ `#8B0000`): xanh cổ vịt `#0F3D3E` là màu chính (`brand-primary`), vàng `#FFD66B` (`brand-accent`, hover `brand-accent-dark` `#F5C544`: nút trên nền xanh như "Tài khoản", viền nhấn, icon footer), cam san hô `#FF6B4A` (`brand-coral`), kem `#FFF8EC` (`brand-primary-light`, nền nhạt). Chữ "banhang" trong logo header màu đỏ gạch `#B3361A`. Các khối nền tối (footer, `ContactCta`, `CoreValues`, panel đang mở ở /services và /about, banner trang con) đổi từ `neutral-950` sang `brand-primary`; trên nền xanh dùng vàng cho viền/icon (xanh trên xanh không thấy). Các mô tả "đỏ"/"đen" ở mục Layout là lịch sử: hiểu là `brand-primary`.
  - Token trong `@theme` của `globals.css`: `brand-primary` (#0f3d3e), `brand-primary-dark` (#0a2b2c, hover), `brand-primary-light` (#fff8ec, nền nhạt), `brand-accent` (#ffd66b), `brand-accent-dark` (#f5c544, hover), `brand-coral` (#ff6b4a). Vòng focus `.form-input` dùng `rgb(15 61 62 / 25%)` (phải sửa tay nếu đổi màu). Banner trang con (`ImageBanner`, `ContactInfo`) phủ gradient `from-brand-primary/95` + gạch ngắn `bg-brand-accent`.
  - `.btn-primary`, `.btn-outline-primary`, `.btn-outline-secondary`, `.btn-outline-light`, `.btn-light`, `.form-input` là class dùng chung tự viết trong `@layer components` của `globals.css` (thay cho `.btn-*`/`.form-control`/`.form-select` của Bootstrap trước đây), đều lấy màu từ `--color-brand-primary`. Đổi màu thương hiệu chỉ cần sửa 3 biến `--color-brand-primary*` trong `@theme`, không phải sửa thêm biến nào khác.
  - Lỗi form dùng đỏ tươi `red-600`/`red-50` (class `is-invalid` trong `globals.css`) kèm chữ mô tả, như `ContactForm`.
  - Trên nền đen, icon/chữ nhỏ đặt trắng trong khối nền `brand-primary` (như footer).
- `config/site.ts`: `name` và `shortName` hiện đều là `dodobanhang` (`name` dùng ở footer, `<title>` trang chủ, trang Liên hệ; `shortName` cạnh logo header và hậu tố tiêu đề tab). `companyType` còn giá trị cũ, không nơi nào dùng. `tagline`, `description`, `phone`, `email`, `address`, `socials` **vẫn là thông tin công ty cũ**, cần chủ dự án cung cấp thông tin mới. `mapUrl` (export cùng file) là link Google Maps theo `address`.

## Nối backend (17/11/2026)

| | |
|---|---|
| Backend | NestJS ở `../backend/`, cổng **3000**, prefix `/api`. Tài liệu: `../backend/backend.md` mục 7 |
| Frontend | cổng **3001** (`npm run dev`) |
| Cấu hình | `.env.local` (copy `.env.example`): `NEXT_PUBLIC_API_URL=http://localhost:3000/api`. Nhúng lúc build, đổi thì chạy lại dev/build |
| Đã nối | sản phẩm, nhóm sản phẩm, form liên hệ, đăng ký / xác thực email / đăng nhập (18/11/2026), giỏ hàng (25/11/2026, mục "Giỏ hàng") |
| Vẫn hardcode | dịch vụ (`serviceData.ts`), đánh giá trang chủ (`reviewData.ts`; bảng `reviews` của backend gắn với đơn hàng nên không dùng được), `domainData.ts`, `config/home.ts` |

- **Response backend luôn bọc** `{ data, isSuccess, message, statusCode, timestamp }`; `apiRequest()` trong `apis/client.ts` bóc `data`, lỗi thì ném `ApiError(status, message)`.
- **Server Component gọi `serverGet()`** (`apis/server.ts`). Hàm này gọi `connection()` nên các trang dùng dữ liệu backend (`/`, `/products`, `/products/[slug]`) **render theo từng request** (ƒ) thay vì prerender lúc build: `npm run build` không cần backend chạy, sửa DB là hiện ngay. Muốn nhanh hơn thì chuyển sang cache có thời hạn.
- **Backend tắt thì các trang trên báo lỗi** (chưa có `error.tsx` riêng). Các trang tĩnh (`/about`, `/services`, `/contact`) vẫn mở được.
- **Ảnh sản phẩm giả lập Tiki** (23/11/2026): backend `SEED_TIKI` (backend.md 7.7) lưu URL tuyệt đối `https://salt.tikicdn.com/...` → `next.config.ts` khai báo thêm domain này trong `remotePatterns` (đã test `/_next/image`: tikicdn 200, domain lạ 400). Bỏ dòng này khi DB không còn sản phẩm Tiki.
- **Ảnh**: `/images/...` là ảnh tĩnh của frontend; `/uploads/...` là ảnh backend lưu → `resolveImageUrl()` ghép origin backend. `next.config.ts` khai báo `remotePatterns` theo `NEXT_PUBLIC_API_URL` và bật `dangerouslyAllowLocalIP` **chỉ khi dev** (Next 16 mặc định chặn tối ưu ảnh từ IP nội bộ).
- Backend chỉ trả sản phẩm/nhóm có `status = 'ACTIVE'`. Muốn ẩn sản phẩm khỏi web thì đổi status trong DB.
- Đã kiểm tra (17/11/2026) với backend + Postgres tạm: trang chủ, `/products` (lọc nhóm, khoảng giá, tìm không dấu, sắp xếp, trang vượt quá, slug nhóm lạ), chi tiết sản phẩm (gallery 3 ảnh, giá/"Liên hệ", cùng nhóm), slug sai → 404, `/services/*` vẫn chạy, `next/image` tối ưu ảnh, CORS form liên hệ từ `:3001`.

## Trang sản phẩm kiểu sàn TMĐT (23/11/2026)

Bố cục theo mẫu sàn TMĐT (chủ dự án gửi ảnh), màu vẫn theo thương hiệu dodo. Dữ liệu mẫu từ crawl Tiki (backend `SEED_TIKI`, backend.md 7.7-7.8). Thay cho giao diện cũ (banner ảnh + thẻ có mô tả + nút "Liên hệ"); các mô tả `/products` ở mục Routing/Layout phía trên là lịch sử.

| Trang | Bố cục |
|---|---|
| `/products` | Nền xám `neutral-100`, các khung trắng bo `rounded-xl`. Trái (>= lg; mobile = drawer "Bộ lọc"): `CategorySidebar` (cây danh mục, `<details>` không cần JS, nhánh đang xem mở sẵn) + `ProductFilters` (Đánh giá "từ 4 sao", Khoảng giá). Phải: tiêu đề nhóm → `CategoryTiles` (ô ảnh nhóm con; nhóm lá thì hiện nhóm cùng cấp; chưa chọn nhóm thì nhóm gốc) → khung "Tất cả sản phẩm" (sắp xếp, tìm kiếm, chip bộ lọc, lưới 2/3/4 cột, 24 sp/trang) |
| `/products/[slug]` | >= lg 3 cột `[400px][1fr][300px]`: ảnh vuông + dải ảnh nhỏ (dính) / tác giả hoặc thương hiệu, tên, sao (số đánh giá) \| đã bán, giá đỏ + -% + giá gốc gạch ngang, nút chọn "Phân loại" (biến thể) / khung mua dính: số lượng (1-99), tạm tính, "Mua ngay", "Thêm vào giỏ". Dưới: "Thông tin chi tiết" (bảng thông số; ngày `YYYY-MM-DD 00:00:00` → `DD/MM/YYYY`), "Mô tả sản phẩm" (`ExpandableText`, thu gọn + "Xem thêm", giữ xuống dòng), "Sản phẩm tương tự" (cùng nhóm, ít quá thì lấy nhóm cha). Breadcrumb theo `categoryPath` |

- **Thẻ sản phẩm** (`ProductCard`): ảnh vuông, nhãn -%, giá đỏ (`red-600`) + giá gốc, tác giả/thương hiệu chữ hoa xám ("Chưa phân loại" thì ẩn), tên 2 dòng, `StarRating` + "Đã bán 29,2k" (`formatSold`). Cả thẻ là 1 link. Giá null = "Liên hệ".
- **Biến thể + số lượng**: `components/product/purchase/` - `PurchaseProvider` (context, mặc định biến thể rẻ nhất), `PriceAndVariants` (cột giữa), `BuyBox` (cột phải). 2 khối ở 2 cột grid nên dùng chung context.
- **"Thêm vào giỏ" / "Mua ngay"** (25/11/2026): cả hai thêm vào giỏ qua `POST /api/cart/me/items`; chưa đăng nhập thì BuyBox hiện khung "Đăng nhập / Đăng ký" thay cho nút. Chưa có API đặt hàng nên "Mua ngay" chưa thanh toán được. Chi tiết: mục "Giỏ hàng".
- **Danh mục**: `types/Category.ts` thêm `parentId`, `imageUrl`, `CategoryNode`; `utils/categoryTree.ts` (`buildCategoryTree`, `findCategoryPath`). `productCount` từ backend đã gộp nhóm con. Trang chủ chỉ hiện nhóm gốc có sản phẩm.
- **Query**: thêm `rating` (`?rating=4` → `minRating`), sort `popular` ("Bán chạy", **mặc định**), `PRODUCTS_PAGE_SIZE` = 24. Tìm kiếm khớp cả tác giả.
- Đã xem thật (backend + DB tạm có 131 sản phẩm): `/products?category=sach-tieng-viet` desktop 1440 và mobile 500, trang chi tiết sách.

## Giỏ hàng (25/11/2026)

Nối `GET /api/cart/me`, `POST /api/cart/me/items`, `PATCH|DELETE /api/cart/me/items/:itemId` (`../backend/backend.md` mục 7.9). Chỉ tài khoản `CUSTOMER` có giỏ.

| File | Vai trò |
|---|---|
| `features/cart/cartAPI.ts` | `getMyCart`, `addToCart`, `updateCartItem`, `removeCartItem` (Bearer token), type `MyCart` |
| `features/cart/CartProvider.tsx` | `useCart()` → `{ cart, count, setCart, refreshCart }`; nằm **trong** `AuthProvider` (root layout). Tải lại khi đăng nhập / đăng xuất / đổi tài khoản; không phải `CUSTOMER` hoặc lỗi → `cart = null` |
| `components/layouts/header/Header.tsx` | Nút giỏ (`CartIcon`) cạnh "Tài khoản", badge `bg-brand-coral` = `count` (> 99 → "99+") |
| `components/product/purchase/BuyBox.tsx` | Chưa đăng nhập → link `/login?next=<trang hiện tại>&reason=cart`. Thêm xong `setCart(response)` → badge cập nhật ngay. 401 → `logout()`, 403 → báo tài khoản không phải khách hàng |
| `app/cart/page.tsx` | Chưa đăng nhập → yêu cầu đăng nhập (`reason=cart-view`, quay lại `/cart`). Giỏ trống → "Tiếp tục mua sắm". Có hàng → danh sách + khung tạm tính, nút "Thanh toán" tắt (chưa có API đặt hàng) |
| `components/cart/CartItemRow.tsx` | 1 dòng: − / ô số / + (1-99, ô số lưu khi rời ô hoặc Enter), "Xóa" (có `confirm`). Gọi API rồi `setCart(response)`; đang lưu thì khoá dòng; lỗi → hiện câu báo + trả số cũ |

- **Ngoại lệ quy tắc "dữ liệu trang = Server Component"**: giỏ hàng tải ở client (`CartProvider` + `useEffect`) vì JWT nằm trong `localStorage`, server không đọc được. Khi chuyển token sang cookie httpOnly thì có thể đổi `/cart` sang Server Component.
- Tổng tiền, số lượng luôn lấy từ response backend (không tự cộng ở client); giá do backend lấy từ DB.
- `?next=` sau đăng nhập / đăng ký Google đi qua `utils/safeRedirect.ts` (chặn `//`, `/\`, URL ngoài → mặc định `/account`). `login/page.tsx` đọc `reason` để hiện lời nhắc ("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng."...).
- Đã test API trên DB local; giao diện khi đã đăng nhập chưa chụp màn hình.

## Đăng ký / đăng nhập (18/11/2026)

Nối với `POST /api/auth/register`, `/verify-email`, `/resend-verification-code`, `/login` và `GET /api/auth/me` của backend (`../backend/backend.md` mục 7.6).

```
Trang (app/register, verify-email, login, account)
  └─ Form (components/auth/*)          zod validate, bắt ApiError, router.push
       └─ AuthProvider (features/auth)  giữ user + token cho toàn site: login(), logout()
            └─ authAPI.ts                mỗi hàm = 1 endpoint
                 └─ apis/client.ts        fetch, bóc { data }, lỗi -> ApiError(status, message)
```

| Bước | Luồng |
|---|---|
| Đăng ký | `RegisterForm` → `register()` (bỏ `confirmPassword`, `phone` rỗng thì không gửi, vì backend chặn field lạ → 400) → `/verify-email?email=...`. Email trùng → 409 "Email đã tồn tại" |
| Xác thực | `VerifyEmailForm` → `verifyEmail(email, code)` → user `ACTIVE` → sang `/login?verified=1&email=...` (điền sẵn email, focus ô mật khẩu, hiện "Xác thực email thành công"). Đếm ngược mã 5:00; "Gửi lại mã" (`resendVerificationCode`) khoá 60 giây sau mỗi lần gửi (chỉ chặn ở client). Ô mã `autoComplete="one-time-code"`. Vào từ `/login` khi tài khoản chưa xác thực thì URL có `&from=login`: không đếm ngược, cho gửi lại ngay. Báo "đã được xác thực" thì hiện link đăng nhập. Backend trả 429 (gửi lại < 60 giây) thì lấy N giây trong câu báo để khoá nút |
| Quên mật khẩu (20/11/2026) | Link "Quên mật khẩu?" cạnh ô mật khẩu ở `/login` (mang theo email đã gõ) → `/forgot-password` (`ForgotPasswordForm`, 2 bước cùng trang): nhập email → `forgotPassword()` (`POST /api/auth/forgot-password`, backend luôn trả cùng 1 câu nên luôn sang bước 2) → nhập mã 6 số + mật khẩu mới 2 lần (`resetPasswordSchema`) → `resetPassword()` (`POST /api/auth/reset-password`) → `/login?reset=1&email=...`. `LoginForm` nhận `notice` (thay prop `verified` cũ) để hiện thông báo từ bước trước |
| Đổi mật khẩu (20/11/2026) | `/account` có khung "Đổi mật khẩu" (`ChangePasswordForm`): mật khẩu hiện tại + mới 2 lần (`changePasswordSchema`, mới phải khác cũ) → `changePassword(token, ...)` (`POST /api/auth/change-password`, Bearer). 401 → `logout()` + `/login`. Tài khoản chỉ có Google → 400 kèm link "Tạo mật khẩu" sang `/forgot-password`. `AuthProvider` nay cung cấp thêm **`token`** (dùng cho mọi API cần đăng nhập). JWT cũ vẫn hợp lệ tới khi hết hạn (backend chưa thu hồi token) |
| Hồ sơ + ảnh đại diện (20/11/2026) | `/account` (chỉ role `CUSTOMER`) có khung "Hồ sơ cá nhân" (`components/account/ProfileSection.tsx`): `getMyProfile` (`GET /api/customers/me/profile`) điền form → sửa họ tên, SĐT, ngày sinh, giới tính (`profileSchema`; ngày sinh rỗng thì không gửi) → `updateMyProfile` (`PATCH`) → `refreshUser()` của `AuthProvider` để lời chào cập nhật. Ảnh: chọn file → kiểm tra jpg/png/webp ≤ 2MB ở client → `updateMyAvatar` (`PATCH /api/customers/me/avatar`, `FormData` field `avatar`, không tự đặt Content-Type). Ảnh hiện bằng `<img>` (ảnh Google là domain ngoài) + `resolveImageUrl`. Hàm ở `features/customer/customerAPI.ts`, type `types/Customer.ts` |
| Gửi lại mã khi không còn trang nhập mã | `/verify-email` **không có `?email`** → `ResendVerificationForm` (nhập email → `resendVerificationCode` → `/verify-email?email=...&sent=1`; bị 429 thì mã trước còn hạn → sang thẳng trang nhập mã). Lối vào: link "Chưa nhận được email xác thực? Gửi lại mã" ở `/login`. Trước đây thiếu email thì `redirect('/register')` |
| Đăng nhập | `LoginForm` gọi `useAuth().login()` (không gọi `authAPI` trực tiếp): `login()` → lưu `accessToken` vào `localStorage` → `getMe(token)` → `setUser` → `/account`. 401 sai email/mật khẩu; 403 "chưa xác thực" → chuyển `/verify-email` |
| Mở lại / F5 | `AuthProvider` đọc token trong `localStorage`, gọi `getMe`; lỗi (hết hạn 1 ngày, sai) thì `logout()`. Trong lúc chờ `loading = true` (Header ẩn link "Tài khoản", `/account` hiện "Đang tải...") |
| Đăng xuất | `logout()`: xoá token + `setUser(null)` |
| Google (19/11/2026) | `GoogleLoginButton` (ở `/login` và `/register`, dưới gạch "hoặc" `AuthDivider`) nạp `https://accounts.google.com/gsi/client` bằng `next/script`, vẽ nút chính thức của Google (popup). Chọn tài khoản → Google trả `credential` (ID token) → `useAuth().loginWithGoogle(credential)` → `POST /api/auth/google` → `{ accessToken, isNewUser, user }` → lưu token + `getMe` (chung hàm `applyToken` với đăng nhập thường) → `/account`. Chưa có tài khoản thì backend tự tạo customer, **không cần mã xác thực email**; email đã có thì gắn Google vào tài khoản đó |

- **Cấu hình Google**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` trong `.env.local` phải **giống `GOOGLE_CLIENT_ID` của backend** (backend kiểm tra audience). Google Cloud Console → Credentials → OAuth client đó → **Authorized JavaScript origins** phải có `http://localhost:3001` (và domain thật khi deploy), thiếu thì popup báo `origin_mismatch`. Client ID là thông tin công khai, không phải secret. Thiếu biến thì nút tự ẩn (cảnh báo ở console khi dev).
- API cần đăng nhập: gửi header `Authorization: Bearer <token>` (xem `getMe`).
- **Token ở `localStorage`** là cách đơn giản để demo; JS bất kỳ trên trang đọc được (rủi ro XSS). Lên production nên để backend đặt cookie `httpOnly`.
- `/account` chặn ở client (redirect sau khi `loading` xong), không phải lớp bảo vệ thật: dữ liệu được bảo vệ ở backend bằng JWT.
- Thử: đăng ký → lấy mã trong email (hoặc cột `users.verification_code` trên DB) → xác thực → đăng nhập → Header "Tài khoản" trỏ `/account`.

## Dữ liệu

Mô hình: `types/` (hình dạng) -> `features/<domain>/xxxAPI.ts` (hàm async) -> trang/component. Hàm trong `xxxAPI.ts` hoặc gọi **backend** (sản phẩm, nhóm, liên hệ - qua `apis/server.ts`/`apis/client.ts`) hoặc đọc `xxxData.ts` hardcode (dịch vụ, đánh giá, domain - chủ dự án chọn giữ hardcode).

**Trang và component chỉ gọi hàm trong `xxxAPI.ts`, không import thẳng `xxxData.ts` hay tự `fetch`.** Đổi nguồn dữ liệu chỉ cần sửa thân hàm trong `xxxAPI.ts`.

### Entity (`src/types/`)

Tên field giữ đúng snake_case theo schema:

| Type | Field |
|---|---|
| `Product` | **Khớp response backend, camelCase** (`types/Product.ts`): `id: string` (uuid), `slug`, `name`, `shortDescription`, `description` (cả hai có thể `null`), `category: { id, name, slug }`, `sku: string \| null` (biến thể đầu tiên), `price: number \| null` (giá thấp nhất trong các biến thể; `null` = "Liên hệ"), `images: string[]` (có thể rỗng → `productImages()` trong `utils/imageUrl.ts` thay bằng `placeholder.svg`). `ProductDetail` thêm `variants`. Trước khi nối backend type này là snake_case (`sku_id`, `category_id`, `id: number`) |
| `Category` | `id: string` (uuid), `slug`, `name`, `description: string \| null`, `productCount` (số sản phẩm đang hiện, dùng ở bộ lọc). Icon ở `CategoryCard` gán theo `slug` |
| `Service` | `id: number`, `name`, `description`, `image_url`, `details: string[]` (hạng mục chi tiết cho `/services`), `content: ContentBlock[]` (thân bài trang chi tiết dạng khối JSON, `[]` nếu chưa có), `sort_order: number` (số nhỏ hiện trước), `is_active: boolean` (false thì ẩn khỏi web nhưng giữ dữ liệu). `details`, `content`, `sort_order`, `is_active` là **tự thêm**, chưa có trong schema gốc, cần thống nhất với backend. `getServices()` / `getServiceById()` chỉ trả dịch vụ `is_active` và sắp theo `sort_order` (bằng nhau thì theo `id`). `content` hiện `[]` cho cả 2 dịch vụ (TODO chờ chữ và ảnh thật từ chủ dự án) |
| `ContentBlock` (`types/ContentBlock.ts`) | Union các khối nội dung: `heading` (`level` 2 hoặc 3, `text`), `paragraph` (`text`), `list` (`style` unordered/ordered, `items`), `image` (`src`, `alt`, `width`, `height`, `caption?`). Chỉ lưu ý nghĩa, không lưu style; h1 là `name` của dịch vụ nên không có trong khối. Thêm loại khối thì thêm vào union và xử lý trong component hiển thị |
| `Domain` | `id: number`, `name`, `description`. Trước dùng làm nhóm sản phẩm, nay **không còn trang nào dùng** (đã chuyển sang `Category`); dữ liệu vẫn là 6 nhóm cũ. Dự kiến là "lĩnh vực cần tư vấn" cho `Contact.domain_id` |
| `Contact` | `name`, `email`, `phone`, `address?`, `domain_id?: number`, `content` (không có `id`). `address`, `domain_id` đang **optional** vì form theo mock chỉ có tên, SĐT, email, nội dung |
| `RegisterPayload`, `LoginPayload`, `CurrentUser` (`types/Auth.ts`) | Khớp DTO backend, camelCase. `CurrentUser` = response `GET /api/auth/me`: `id`, `email`, `fullName`, `phone?`, `role` (`CUSTOMER` / `WAREHOUSE_OPERATOR` / `ADMIN`), `status`, `customerInfo?` (`customerCode`, `loyaltyPoints`) |
| `Review` | `id: number`, `content`, `images: string[]` (ảnh thực tế kèm đánh giá, `[]` nếu không có), `customer_name?`, `rating?: number` (1-5), `created_at?` (ISO 8601). Tự thêm, không có trong schema gốc. 3 field cuối **optional**: đánh giá thật chủ dự án gửi chỉ có nội dung + ảnh, không tự điền tên, sao hay ngày; `CustomerReviews` tự ẩn phần thiếu |

### Feature (`src/features/`)

| Folder | File | Hàm export |
|---|---|---|
| `product/` | `productAPI.ts`, `productQuery.ts` | `searchProducts(query)` (→ `GET /api/products/search`; lọc, tìm không dấu, sắp xếp, phân trang đều làm ở backend, trả `ProductPage`: `items`, `total`, `page`, `pageSize`, `totalPages`), `getProductBySlug(slug)`, `getProductsByCategory(categorySlug, limit)`, `hasPricedProducts()`. `productQuery.ts`: `ProductQuery` (`category` là **slug**), `parseProductQuery`, `buildProductsHref`, `PRODUCTS_PAGE_SIZE` (9) |
| `category/` | `categoryAPI.ts` | `getCategories()` (→ `GET /api/categories/public`, kèm `productCount`), `getCategoryBySlug(slug)` |
| `service/` | `serviceData.ts`, `serviceAPI.ts` | `getServices()`, `getServiceById(id)` |
| `domain/` | `domainData.ts`, `domainAPI.ts` | `getDomains()` |
| `contact/` | `contactAPI.ts`, `contactSchema.ts` | `createContact(payload)` → `POST /api/contacts` (gọi từ trình duyệt; backend gửi email tới `CONTACT_EMAIL`, không lưu DB; 429 khi gửi quá 5 lần/10 phút, `ContactForm` hiện đúng thông báo của backend). `contactSchema` (Zod, khớp DTO backend): tên 2-100 ký tự, SĐT VN `0`/`+84` + 9 số (bỏ khoảng trắng, dấu chấm, gạch), email hợp lệ (≤ 150), nội dung 10-2000 ký tự |
| `review/` | `reviewData.ts`, `reviewAPI.ts` | `getReviews()` |
| `auth/` | `authAPI.ts`, `authSchema.ts`, `AuthProvider.tsx` | `register`, `verifyEmail`, `resendVerificationCode`, `forgotPassword`, `resetPassword`, `changePassword(token, ...)`, `login`, `loginWithGoogle(credential)`, `getMe(token)`; `registerSchema` / `loginSchema` (Zod); `AuthProvider` + `useAuth()`. Xem mục "Đăng ký / đăng nhập" |

Dữ liệu thật:
- **2 dịch vụ** (`serviceData.ts`, theo giấy phép - xem mục "Lĩnh vực kinh doanh"): id 1 "Tư vấn thiết bị công nghiệp" (icon `OrderIcon`), id 2 "Hỗ trợ thi công – lắp đặt thiết bị" (icon `WrenchIcon`). `content` (thân bài đầy đủ) chuyển nguyên văn từ s1.pdf/s2.pdf thành khối heading/paragraph/list/image; tiêu đề chính là `name`, đoạn kêu gọi cuối bài bỏ vì đã có `ContactCta`. **Chữ in đậm giữa câu của PDF không giữ** (khối `paragraph` chỉ có `text` thuần). `details` (gạch đầu dòng khi rê chuột ở /services) tóm tắt lại từ chính nội dung PDF. Ảnh (đã nén JPG) ở `public/images/services/`: `kho-hang`, `van-chuyen-noi-thanh` (nguồn Trung Quân Phát), `tho-dien-lap-dat`, `khao-sat-thi-cong` (chú thích "Nguồn: Internet", **cần kiểm tra bản quyền** trước khi dùng thật). Không thêm cam kết bảo hành, thời gian hay giá khi chưa có thông tin thật.
- **5 nhóm sản phẩm** và **13 sản phẩm**: nay nằm trong **DB của backend**, nạp bằng seed `backend/src/database/catalog-seed/catalog.seed-data.ts` (chuyển nguyên văn từ `categoryData.ts`/`productData.ts` cũ của frontend, 2 file này đã xóa). Nhóm tự đặt theo sản phẩm thật, **không theo ngành nghề trong giấy phép** (xem "Lĩnh vực kinh doanh"): Cơ khí & phụ kiện, Vật liệu nhôm, Thiết bị nông nghiệp, Năng lượng mặt trời, Đèn LED chiếu sáng. Toàn bộ sản phẩm `price: null` ("Liên hệ"). Ảnh vẫn là file tĩnh ở `public/images/products/` (DB lưu đường dẫn `/images/products/...`).
- 13 sản phẩm (chữ + ảnh do chủ dự án cung cấp, mô tả giữ nguyên văn): Vòng bi NSK 684ZZ, Tay cầm thanh tròn, Vít pake đầu dù JIS B1111T, Con chạy dầm KITO 1 tấn (3 ảnh), Thanh ray đục lỗ (2 ảnh), Tấm nhôm hợp kim A6061, Máy bay nông nghiệp DJI Agras T100, Tấm pin AE Solar 550Wp, Đèn năng lượng mặt trời 300W BC300, Đèn LED thanh SLLTU-9, Đèn thả máng LED 1m2, Đèn bàn LiOA, Đèn LED âm trần Duhal KDMT0091. Sản phẩm nhiều ảnh đặt tên file `<ten>-1.jpg`, `-2.jpg`... theo thứ tự ảnh.

- **3 đánh giá thật** (`reviewData.ts`, chủ dự án gửi): nội dung nguyên văn + ảnh hàng đã giao `public/images/feedbacks/feedback-1..3.jpg` (đã nén về cạnh dài 1200px; ảnh gốc "Feedbacks 1.jpg", "feedbacks 2.jpg", "feedbacks 3.jpg" vẫn để cùng thư mục, chưa xóa). Chưa có tên khách hàng và số sao. Không tự viết đánh giá.

Dữ liệu còn là mẫu: `coreValues` trong `config/home.ts`.

### Giả định về schema (cần xác nhận với chủ dự án)

- **Đã quyết: nhóm sản phẩm là bảng `Category` riêng**, `products.category_id` trỏ tới nó trong DB, frontend nhận `Product.category` (chủ dự án yêu cầu). Cần thống nhất tên bảng/field với backend. `Domain` chưa rõ còn cần không (bỏ hay dùng làm dropdown lĩnh vực trong form liên hệ).
- Khóa chính của `Domain` là `id` (schema gốc ghi nhầm `doamin_id`).
- `sku` (cột `product_variants.sku` ở backend, trước là `sku_id`) là mã SKU dạng chuỗi, giữ nguyên format nhà sản xuất (vd `"NSK 684ZZ"`, `"SLLTU-9"`), không ép về 1 khuôn thống nhất.

## Styling: Tailwind thuần

**Chỉ dùng Tailwind, không dùng Bootstrap hay UI framework nào khác** (đã gỡ Bootstrap, xem mục "Tech stack" để biết lý do và những gì đã đổi). `src/app/globals.css`:

```css
@import 'tailwindcss';

@utility container {
  margin-inline: auto;
  width: 100%;
  max-width: 80rem;
  padding-inline: 1rem;
}
@media (min-width: 40rem) {
  .container {
    padding-inline: 1.5rem;
  }
}

@theme {
  --color-brand-primary: #0f3d3e;
  --color-brand-primary-dark: #0a2b2c;
  --color-brand-primary-light: #fff8ec;
  --color-brand-accent: #ffd66b;
  --color-brand-accent-dark: #f5c544;
  --color-brand-coral: #ff6b4a;
}

@layer components {
  /* .btn, .btn-primary, .btn-outline-*, .form-input, .is-invalid */
}
```

- **`container`**: Tailwind v4 có sẵn utility này nhưng mặc định **không** tự canh giữa/thêm đệm hai bên. Định nghĩa lại bằng `@utility container { ... }` — cách chính thức của Tailwind v4 để tùy biến utility có sẵn — để `className="container"` dùng được luôn như một cụm "canh giữa + giới hạn 80rem (1280px) + đệm 1rem (1.5rem từ `sm`)". Đây là **cách duy nhất đúng** để đổi container; viết `@layer utilities { .container {...} }` riêng có nguy cơ đụng độ với utility có sẵn của Tailwind.
- **`.btn`/`.btn-primary`/`.btn-outline-*`/`.form-input`/`.is-invalid`**: class dùng chung tự viết trong `@layer components`, thay cho component của Bootstrap trước đây (`.btn-*`, `.form-control`, `.form-select`). Đặt trong `@layer components` để utility Tailwind (`hover:*`, `after:*`, kích thước, khoảng cách...) viết cạnh đó vẫn ghi đè được bình thường theo đúng thứ tự layer chuẩn của Tailwind (`theme, base, components, utilities`). Không viết thêm biến thể mới ở đây trừ khi dùng lặp lại từ 3 nơi trở lên; ưu tiên utility Tailwind viết trực tiếp ở nơi dùng.
- **Kiểu khung chung** (chủ dự án yêu cầu mọi khung/thẻ nền trắng có cùng viền, 18/10/2026): `border-2 border-b-4 border-neutral-300` + `shadow-md` (thẻ bấm được: hover `-translate-y-1`, `hover:border-b-brand-primary`, `hover:shadow-xl`). Khung có viền trên đỏ thì thêm `border-t-4 border-t-brand-primary` (Highlights, `VisionMissionTabs`, `CoreValuePanels`, `ServicePanel`). Đang dùng ở `CategoryCard`, `ProductCard` (+ `ProductGridSkeleton`), `ServiceCard`, `ServicePanel`, `CustomerReviews`, khung form `/contact`, `VisionMissionTabs`, `CoreValuePanels`, Highlights, `ServiceToc` + khung "Cần tư vấn nhanh?" ở chi tiết dịch vụ, khung bộ lọc `/products` (>= lg), ảnh chính `ProductGallery`. Không áp dụng: khối nền đen (`CoreValues`, `ContactCta`), ô trạng thái rỗng (viền nét đứt), ảnh trong `ServiceBody`, ô thông báo trong form. Khung mới làm theo cùng kiểu này.
- **Không** thêm rule theo thẻ trần (`a {…}`, `h2 {…}`) vào `@layer components`/`utilities`: nó sẽ thắng utility Tailwind viết trực tiếp trên thẻ đó (cùng layer, cùng specificity thì rule đứng sau trong stylesheet thắng). Cần style mặc định cho thẻ thì đặt trong `@layer base`.
- Không cần chặn class nào (`@source not inline(...)`) hay chỉnh `--breakpoint-*`: dùng nguyên breakpoint mặc định của Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). Header/FiltersDrawer/ServicePanel đều viết theo các mốc này (Bootstrap trước đây dùng `lg` 992, đã đổi hết).
- Tailwind 4 tự quét class trong source, không cần khai báo `content`.
- Class Tailwind v4 dùng tên mới, vd `bg-linear-to-b` (không phải `bg-gradient-to-b`), `md:h-112`, `aspect-4/3`.
- Menu mobile, ô tìm kiếm, bộ lọc sản phẩm không dùng thư viện JS nào cho việc ẩn/hiện: chỉ `useState` (Header, FiltersDrawer) kết hợp cặp class `hidden`/`flex` (+ `lg:flex` để luôn hiện ở desktop bất kể state) hoặc `-translate-x-full`/`translate-x-0` (khung trượt của FiltersDrawer). Xem "Ưu tiên sử dụng" mục 1.

## Lưu ý kỹ thuật

- `postcss.config.mjs` giờ chỉ có 1 dòng bật `@tailwindcss/postcss`. `npm run build` sạch, không còn cảnh báo nào (trước đây có 1 cảnh báo `Unknown at rule: @charset` do CSS của Bootstrap, đã hết khi gỡ Bootstrap).
- `next/font/google` tải font lúc build nên **cần mạng** khi `npm run build`.
- **Compound component (`Foo.Root`, `Foo.Panel`...) qua ranh giới Server/Client PHẢI dùng named export + `import * as Foo`, không được gộp `export default { Root, Panel } `.** Next.js chỉ tạo được "client reference" cho từng export nó thấy được lúc build (named export, hoặc default export dùng thẳng làm component); gộp nhiều component client vào 1 object rồi truy cập `.Root`/`.Panel` từ Server Component sẽ ra `undefined` lúc render (lỗi "Element type is invalid... but got: undefined", kèm `digest` và stack bị giấu vì nằm trong nội bộ Next). Đã gặp thật ở `FiltersDrawer` (đã sửa: `export function Root/Trigger/Panel`, `app/products/(list)/page.tsx` dùng `import * as FiltersDrawer from '@/components/product/FiltersDrawer'`). Thấy lỗi này thì tìm compound component nào mới thêm và đổi sang named export.
- Kiểm tra giao diện mobile bằng Edge headless: cửa sổ headless không nhỏ hơn ~500px nên nội dung bị cắt; nhúng trang vào `<iframe width="390">` để đo đúng viewport mobile.
- Muốn thử tương tác (bấm hamburger, điền và gửi form) bằng Edge headless: tạo file HTML tạm trong `public/` (cùng origin nên script truy cập được `iframe.contentDocument`), gán giá trị input bằng setter gốc của `HTMLInputElement.prototype.value` + `dispatchEvent(new Event('input', {bubbles: true}))` để React Hook Form nhận. **Xóa file tạm ngay sau khi chụp.**
- Nút tròn chữ "N" ở góc dưới trái ảnh chụp là chỉ báo của `next dev`, không thuộc giao diện.
- **Dev server tạm để chụp màn hình phải tắt sau khi xong** (dừng tiến trình `node` có `next` trong command line, xóa `dev.log`), nếu không nó chiếm cổng 3000 và chặn `npm run dev` của chủ dự án.
- Terminal VS Code của chủ dự án đang bật **Auto Attach** (`debug.javascript.autoAttachFilter: "smart"`): khi chạy lệnh sẽ in "Debugger attached." và `npm run build` có thể chậm hoặc trông như treo. Không phải lỗi project; hướng dẫn tắt: `Ctrl+Shift+P` -> "Debug: Toggle Auto Attach" -> Only With Flag/Disabled, rồi mở terminal mới. Không tự đổi cài đặt VS Code của chủ dự án.
- Chạy `npm` ở thư mục gốc repo sẽ lỗi `ENOENT ... package.json`; phải `cd frontend`.
- **`AGENTS.md` do `next dev` quản lý** (khối `<!-- BEGIN/END:nextjs-agent-rules -->`, nhắc đọc tài liệu Next.js 16 trong `node_modules/next/dist/docs/`). **Không sửa, không xóa** file này.
  - File này (`frontend.md`) trước tên là `frontend/CLAUDE.md` (ban đầu do `next dev` tạo, chỉ có dòng `@AGENTS.md`), đã đổi tên thành `frontend.md` và là tài liệu frontend viết tay. **Giữ dòng `@AGENTS.md` ở đầu file** để quy tắc Next.js vẫn được nạp. Vì không còn tên `CLAUDE.md` nên Claude Code không tự nạp file này nữa; `../CLAUDE.md` (gốc repo) trỏ tới đây.
  - Theo `node_modules/next/dist/server/lib/generate-agent-files.js`: khi `AGENTS.md` tồn tại, `next dev` chỉ cập nhật `AGENTS.md` và **không** tạo/ghi `CLAUDE.md`. Chỉ khi **cả** `AGENTS.md` lẫn `CLAUDE.md` đều không có, nó mới tạo lại cả hai (`CLAUDE.md` chỉ chứa `@AGENTS.md`). Vì vậy **không xóa `AGENTS.md`**; nếu lỡ thấy `frontend/CLAUDE.md` mới mọc ra thì xóa đi, tài liệu thật nằm ở file này.
  - Muốn tắt hẳn cơ chế tự sinh: đặt `agentRules: false` trong `next.config.ts`.

## Quy ước code

- Prettier: không `;`, nháy đơn, `printWidth` 100, `trailingComma: es5`, `arrowParens: always`.
- **Prettier đổi CRLF -> LF**, trong khi file trong repo đang là CRLF. Chỉ format file mình sửa (`npx prettier --write <file>`), **không** chạy `npm run format` hay format cả `src`, để khỏi tạo diff toàn thay đổi xuống dòng. Lỡ chạy thì `git diff --quiet -- <file>` để xác nhận không đổi nội dung rồi `git checkout -- <file>`.
- Import: package ngoài trước, `@/...` và import tương đối sau, cách nhau một dòng trống.
- Dùng alias `@/` cho import từ `src/`.
- **URL trang chi tiết luôn qua `slugPath()` / `slugParam()`** (`utils/slug.ts`), không tự ghép `/<mục>/${id}`; xem mục "URL trang chi tiết".
- **Danh sách hiển thị phải chịu được số lượng thay đổi** (chủ dự án thêm/xóa dịch vụ, sản phẩm, đánh giá... không được làm vỡ giao diện). Khi viết component danh sách phải nghĩ tới: 0 phần tử (ẩn mục hoặc hiện trạng thái rỗng), 1 phần tử (không dãn hết khung), số lẻ (hàng cuối không lẻ loi), nội dung rất ngắn/rất dài, mảng con rỗng (như `details`). Không viết cứng số lượng ("3 thẻ") hay liệt kê cứng tên mục trong câu chữ; câu giới thiệu chung đặt trong `siteConfig`.
- Đặt tên folder/file bằng tiếng Anh: component `PascalCase.tsx`, dữ liệu/API `camelCase.ts` (`productData.ts`, `productAPI.ts`), type `PascalCase.ts`.
- Component dùng `window`, `document`, hook state/effect hoặc thư viện chỉ chạy ở browser phải có `'use client'`; giữ Server Component làm mặc định.
- **File `'use client'` chỉ nên export component.** Server Component import hằng số hay hàm từ file client sẽ nhận "client reference" chứ không phải giá trị thật. Ví dụ đã gặp: id bị render thành chuỗi `function() { throw ... }`, và Bootstrap báo lỗi `querySelectorAll ... is not a valid selector`. Hằng dùng chung thì đặt ở file thường (như `features/product/productQuery.ts`) hoặc truyền qua props (như `HeaderSearch id={...}`).

## Việc tiếp theo (theo thứ tự đề xuất)

1. **Nội dung thật từ chủ dự án** (đang chờ): `coreValues`, tên khách hàng + số sao + ngày cho 3 đánh giá (nếu có), link Facebook, logo dodo dạng vector (SVG) để thay các file PNG cắt từ ảnh. Sản phẩm/dịch vụ đã có dữ liệu thật (xem mục "Dữ liệu"), còn thiếu: giá (đang "Liên hệ" cho cả 9 sản phẩm), xác nhận lại phạm vi kinh doanh (xem cảnh báo ở mục "Lĩnh vực kinh doanh").
2. Sản phẩm: giao diện + dữ liệu thật đã xong, **đã nối backend** (17/11/2026). Có thể thêm sau: giá thật cho sản phẩm nào niêm yết được (bộ lọc/sắp xếp theo giá tự hiện lại, xem `hasPricedProducts()`), ô nhập giá tự do.
3. Trang `/services`: đã xong. Có thể thêm: truyền dịch vụ sang form (`/contact?service=<id>` điền sẵn nội dung), ảnh thật cho từng dịch vụ.
4. Trang `/about`: đã xong (ảnh đầu trang là ảnh vận chuyển thật; bản rộng hơn sẽ nét hơn).
5. Tìm kiếm: chỉ còn ở `/products` (lọc trên server); ô tìm kiếm ở Header đã bỏ 18/11/2026. Có thể mở rộng tìm cả dịch vụ.
6. `/contact`: giao diện + validate + **gửi qua backend** đã xong (cần đặt `CONTACT_EMAIL` + `MAIL_USER`/`MAIL_PASSWORD` ở `backend/.env` thì mail mới gửi thật). Có thể thêm dropdown "Sản phẩm quan tâm".
7. Hero: dùng bộ ảnh dodo (`hero.png` 1440px, `hero-square.png`). Xin bản rộng >= 2880px để nét ở màn hình lớn; nếu đổi ảnh thì đo lại `HOTSPOTS`.
8. **Chờ chủ dự án quyết định** (đã hỏi, chưa trả lời):
   - Phạm vi kinh doanh thật là gì (xem mục "Lĩnh vực kinh doanh") - ảnh hưởng tới `siteConfig.tagline`/`description`, Hero, và cả bảng ngành nghề trong file này. **Đã hỏi, chủ dự án trả lời chưa cần sửa slogan lúc này** - giữ nguyên "Sắt thép, nhôm, inox & vật liệu xây dựng", không tự đổi thêm.
   - Highlights ô "Toàn quốc – vận chuyển cả nước": giữ (nội dung từ mock) hay bỏ, vì dịch vụ vận chuyển không đưa lên mục Dịch vụ.
   - Dòng cuối lời cảm ơn trang Liên hệ (xem mục "Trang Liên hệ").
   - Giữ hay tắt `AGENTS.md` tự sinh (`agentRules: false`).

## Chưa làm / để sau

Auth còn thiếu: thu hồi token khi đổi mật khẩu / đăng xuất, chuyển token sang cookie `httpOnly`. Redux/RTK Query, ESLint, i18n, SEO chi tiết, test. Dịch vụ + đánh giá trang chủ vẫn hardcode (chủ dự án chọn).
