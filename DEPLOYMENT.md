# Hướng dẫn triển khai Hoàng Dung Biomass App

Dự án này là một ứng dụng full-stack (React + Express) được thiết kế để quản lý giải pháp năng lượng sinh khối và khách hàng (CRM).

## 1. Chuẩn bị mã nguồn (GitHub)

1.  **Tạo Repository**: Tạo một repo mới trên GitHub (ví dụ: `hoang-dung-biomass`).
2.  **Đẩy mã nguồn**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/YOUR_USERNAME/hoang-dung-biomass.git
    git push -u origin main
    ```

## 2. Triển khai lên Cloudflare Pages (Frontend)

Cloudflare Pages rất phù hợp để triển khai phần giao diện (React).

1.  Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Chọn **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Chọn repository của bạn.
4.  **Cấu hình Build**:
    *   **Framework preset**: `Vite`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
5.  **Biến môi trường (Environment Variables)**:
    Thêm các biến sau trong phần Settings > Functions hoặc Environment Variables:
    *   `VITE_GA_MEASUREMENT_ID`: ID Google Analytics của bạn.
    *   `VITE_FIREBASE_API_KEY`: API Key Firebase.
    *   ... (các biến Firebase khác bắt đầu bằng `VITE_`)

## 3. Triển khai Backend (API)

Vì Cloudflare Pages (Static) không chạy được server Express trực tiếp, bạn có 2 lựa chọn:

### Lựa chọn A: Chuyển sang Cloudflare Functions (Khuyên dùng)
Chuyển các route trong `server.ts` sang thư mục `/functions` của Cloudflare Pages. Cloudflare sẽ tự động nhận diện và chạy chúng dưới dạng Serverless.

### Lựa chọn B: Triển khai lên Cloud Run / Render / Vercel
Nếu muốn giữ nguyên Express, bạn có thể triển khai lên các nền tảng hỗ trợ Docker hoặc Node.js server.

## 4. Cấu hình Firebase & Google Sheets

1.  **Firebase**: Tạo project trên Firebase Console, bật Authentication (Google) và Firestore. Copy cấu hình vào `src/services/firebase.ts`.
2.  **Google Sheets**: Tạo script Webhook để nhận dữ liệu từ lead form. Cập nhật `GOOGLE_SHEETS_WEBHOOK_URL` trong biến môi trường của backend.

## 5. Tên miền tùy chỉnh (Custom Domain)

Trong Cloudflare Pages, chọn tab **Custom domains** và thêm tên miền của bạn (ví dụ: `hoangdungbiomass.com`).

---
**Chuyên gia QA & DevOps**
*Đã kiểm tra và chuẩn hóa mã nguồn cho môi trường sản xuất.*
