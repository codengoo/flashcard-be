# API Documentation

Tài liệu này cung cấp hướng dẫn cách sử dụng các API trong hệ thống.
Thông thường, đối với môi trường dev, bạn có thể truy cập **Swagger UI** tại route:
`http://localhost:3000/api`

## 1. Settings API (`/settings`)

Module Settings cho phép quản lý cấu hình mặc định hoặc tuỳ chọn riêng của từng user.

| HTTP Method | Endpoint          | Quyền | Mô tả |
| ----------- | ----------------- | ----- | ----- |
| `GET`       | `/settings`       | User, Admin | Lấy cài đặt của người dùng hiện tại (dựa trên JWT). |
| `PUT`       | `/settings`       | User, Admin | Cập nhật cài đặt của người dùng hiện tại (dựa trên JWT). |
| `GET`       | `/settings/:userId` | Admin | Lấy chi tiết cài đặt của một người dùng theo ID. |
| `PUT`       | `/settings/:userId` | Admin | Cập nhật cài đặt của một người dùng theo ID. |

### Ví dụ Payload Cập nhật:
```json
{
  "theme": "dark",
  "language": "vi",
  "dailyGoal": 30,
  "notificationsEnabled": true
}
```

## 2. Google Sheet API (`/google-sheet`)

Module dùng chung để đọc dữ liệu từ Google Sheets công khai (hoặc cá nhân nếu đã thiết lập Service Account thông qua file `.env`).

| HTTP Method | Endpoint          | Mô tả |
| ----------- | ----------------- | ----- |
| `GET`       | `/google-sheet/:spreadsheetId/data` | Đọc dữ liệu từ Google Sheet dưới dạng mảng 2 chiều. Có thể cấu hình thêm `?range=` (vd: `Sheet1!A1:D10`). |

### Ví dụ Response thành công:
```json
{
  "success": true,
  "data": [
    ["Tiêu đề 1", "Tiêu đề 2"],
    ["Hàng 1 Cột 1", "Hàng 1 Cột 2"]
  ]
}
```

## 3. Auth API (`/auth`)

Module xác thực người dùng qua Google OAuth 2.0 và phát hành JWT để bảo vệ các route.

| HTTP Method | Endpoint                | Mô tả |
| ----------- | ----------------------- | ----- |
| `GET`       | `/auth/google`          | Chuyển hướng trình duyệt đến trang đăng nhập Google. |
| `GET`       | `/auth/google/callback` | Google gọi lại sau khi người dùng đồng ý. Thiết lập `access_token` và `refresh_token` dạng HTTPOnly Cookie. |
| `POST`      | `/auth/refresh`         | Dùng `refresh_token` từ Cookie để cấp lại `access_token` mới và set lại chúng vào Cookie mởi. Gọi khi gặp lỗi 401. |
| `GET`       | `/auth/me`              | Lấy thông tin người dùng đang đăng nhập (nhận dạng qua `access_token` cookie). |

### Luồng đăng nhập bằng Cookie & Refresh Token

1. Client (trình duyệt) gửi request tới `/auth/google` hoặc gọi SDK.
2. Server xác thực và phản hồi set 2 cookies:
   - `access_token` (HTTPOnly, 15 phút)
   - `refresh_token` (HTTPOnly, 7 ngày)
3. Các request sau từ máy khách tự động đính kèm cookies đi qua các route bảo vệ như `/auth/me`. Server ưu tiên đọc `access_token` từ cookie (hoặc dự phòng Header `Authorization: Bearer <token>`).
4. **Khi access token hết hạn** (Server trả về `401 Unauthorized`), Client gọi API `POST /auth/refresh`. Server đọc `refresh_token`, cấp phát bộ tokens mới vào cookies và Client tự động thử lại request ban đầu.

### Response `/auth/google/callback` hoặc `/auth/refresh`

```json
{
  "message": "Logged in successfully" // Hoặc "Tokens refreshed"
}
```
*Lưu ý: Không trả về token qua body mà gắn trực tiếp vào header `Set-Cookie`.*

### Payload cho `POST /auth/login`
Khi gọi POST `/auth/login`, Client truyền đầy đủ thông tin:
```json
{
  "googleId": "1234567890",
  "email": "user@gmail.com",
  "displayName": "Full Name",
  "firstName": "Full",
  "lastName": "Name",
  "avatar": "https://url..."
}
```

### Response `/auth/me`

```json
{
  "_id": "664abc...",
  "googleId": "1234567890",
  "email": "user@gmail.com",
  "displayName": "Nguyen Van A",
  "firstName": "A",
  "lastName": "Nguyen",
  "avatar": "https://lh3.googleusercontent.com/...",
  "createdAt": "2026-04-04T00:00:00.000Z",
  "updatedAt": "2026-04-04T00:00:00.000Z"
}
```

### Biến môi trường cần thiết (`.env`)

| Biến                  | Mô tả |
| --------------------- | ----- |
| `GOOGLE_CLIENT_ID`    | Client ID từ Google Cloud Console |
| `GOOGLE_CLIENT_SECRET`| Client Secret từ Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | URL callback đăng ký trên Google, ví dụ: `http://localhost:3000/auth/google/callback` |
| `JWT_SECRET`          | Chuỗi bí mật để ký JWT |
| `JWT_EXPIRES_IN`      | Thời hạn JWT (mặc định: `7d`) |

### Bảo vệ route bằng JWT

Thêm `@UseGuards(JwtAuthGuard)` và `@ApiBearerAuth()` vào controller / route cần bảo vệ:

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('protected-route')
getSecret(@Req() req: any) {
  return req.user; // UserDocument
}
```

---

## 4. Dataset API (`/dataset`)

Module Dataset dùng để xử lý và quản lý các luồng dữ liệu (dataset) tập trung, ví dụ như đọc dữ liệu trực tiếp từ Google Sheet.

| HTTP Method | Endpoint          | Mô tả |
| ----------- | ----------------- | ----- |
| `GET`       | `/dataset/get-from-sheet` | Lấy dữ liệu từ Google Sheet dưới dạng mảng 2 chiều. Bắt buộc truyền `spreadsheetId` trong query. Có thể cấu hình thêm `range=` (vd: `Sheet1!A1:D10`). |

### Ví dụ Request:
`GET /dataset/get-from-sheet?spreadsheetId=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms&range=Class Data!A2:E`

### Ví dụ Response thành công:
```json
{
  "success": true,
  "data": [
    ["Alexandra", "Female"],
    ["Andrew", "Male"]
  ]
}
```

---
> [!WARNING]
> Nếu bạn thay đổi logic hệ thống (thêm endpoint mới, thay đổi DTO hay cấu trúc phản hồi), **phải** quay trở lại cập nhật tệp này (`api-docs.md`) và kiểm tra Swagger Annotations.
