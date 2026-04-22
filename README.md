# EduCore - Enterprise EdTech & CRM System

EduCore là một hệ thống quản lý giáo dục toàn diện, kết hợp sức mạnh của hệ thống quản trị nội dung (CMS) và quản trị quan hệ khách hàng (CRM). Hệ thống được thiết kế dành riêng cho các trung tâm đào tạo, bán khóa học trực tuyến với giao diện "Enterprise Modern" (Glassmorphism, Dark mode chuẩn mực).

## 🚀 Tính năng nổi bật

### 1. Hệ thống quản trị nội dung (CMS Admin)
- **Quản lý Khóa học & Bài giảng:** Tạo và tổ chức lộ trình học chuyên nghiệp.
- **Hệ thống Bài Test (Quiz):** Tạo câu hỏi, bài kiểm tra đánh giá năng lực AI.
- **Media & Blog:** Quản lý hình ảnh và bài viết chuẩn SEO.
- **Quản trị Người dùng (Users):** Quản lý Admin, phân quyền chặt chẽ.

### 2. Hệ thống quản trị quan hệ khách hàng (CRM)
- **Khách hàng tiềm năng (Leads):** Quản lý khách hàng theo dạng Phễu (Pipeline) với các trạng thái: Mới, Đang tư vấn, Học thử, Đã đăng ký.
- **Đơn hàng (Orders):** Theo dõi thanh toán, chuyển khoản, xử lý chốt sale.
- **Học viên (Students):** Hệ thống tự động đẩy dữ liệu sang danh sách Học viên khi khách hàng thanh toán thành công. Tự động cấp tài khoản đăng nhập cho học viên.
- **Quản lý Nhân sự (Staff):** Giao việc (Assign) khách hàng cho từng nhân viên Sale/Giảng viên cụ thể.

### 3. Tự động hóa & Real-time
- **Tự động cấp tài khoản:** Khi đơn hàng chuyển trạng thái Đã thanh toán (PAID), hệ thống tự sinh tài khoản User (Role: STUDENT) cho học viên.
- **Real-time Notifications:** Thông báo đẩy ngay lập tức qua Socket.io khi có khách hàng mới đăng ký hoặc đơn hàng vừa được thanh toán.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion (Hiệu ứng), Socket.io-client.
- **Backend:** Node.js, Fastify, Socket.io.
- **Cơ sở dữ liệu:** MongoDB (Native driver).
- **Authentication:** JWT (JSON Web Tokens), Bcryptjs.

---

## ⚙️ Hướng dẫn cài đặt và chạy dự án (Local)

Dự án được chia làm 2 thư mục độc lập: `Frontend` (thư mục gốc) và `Backend` (nằm trong thư mục `/backend`). Bạn cần chạy cả 2 để hệ thống hoạt động.

### 1. Khởi động Backend (Fastify API)

```bash
cd backend
# Cài đặt thư viện
npm install

# Tạo file .env và cấu hình (Xem mẫu cấu hình bên dưới)
# Chạy server ở chế độ phát triển
npm run dev
```

**Mẫu file `backend/.env`:**
```env
PORT=8080
DATABASE_URL=mongodb://127.0.0.1:27017/educore_db
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Khởi động Frontend (Next.js)

Mở một Terminal mới (giữ Terminal Backend vẫn đang chạy).

```bash
# Ở thư mục gốc của dự án
npm install

# Tạo file .env.local và cấu hình
# Chạy Next.js server
npm run dev
```

**Mẫu file `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

### 3. Truy cập hệ thống

- **Website / Giao diện người dùng:** `http://localhost:3000`
- **CMS Admin:** `http://localhost:3000/admin`
- **Hệ thống CRM:** `http://localhost:3000/admin/crm`

*(Đăng nhập bằng tài khoản có role ADMIN để thấy toàn bộ tính năng)*

---

## 📂 Cấu trúc thư mục cốt lõi

```text
├── backend/
│   ├── src/
│   │   ├── modules/          # Các module API độc lập (auth, cms, crm)
│   │   ├── server.ts         # Khởi tạo Fastify & Socket.io
│   │   └── index.ts          # Entry point
├── src/
│   ├── app/
│   │   ├── admin/            # CMS Dashboard (Giao diện sáng)
│   │   ├── admin/crm/        # CRM System (Giao diện tối)
│   │   └── page.tsx          # Landing page
│   ├── components/           # UI Components (Modals, Sidebar...)
│   └── lib/                  # Tiện ích (Axios, Socket Provider...)
```

## 🔐 Luồng phân quyền cơ bản
- **ADMIN:** Toàn quyền truy cập CMS và CRM.
- **STAFF / CONSULTANT:** Chỉ truy cập CRM để tư vấn khách hàng, quản lý học viên.
- **STUDENT:** Tài khoản tự động được sinh ra để học viên đăng nhập xem khóa học.

---
*Phát triển bởi đội ngũ EduCore.*
