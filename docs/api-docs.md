# API Documentation

Tài liệu này cung cấp hướng dẫn cách sử dụng các API trong hệ thống.
Thông thường, đối với môi trường dev, bạn có thể truy cập **Swagger UI** tại route:
`http://localhost:3000/api`

## 1. Settings API (`/settings`)

Module Settings cho phép quản lý cấu hình mặc định hoặc tuỳ chọn riêng của từng user.

| HTTP Method | Endpoint          | Mô tả |
| ----------- | ----------------- | ----- |
| `GET`       | `/settings/:userId` | Lấy chi tiết cài đặt của một người dùng theo ID. Nếu người dùng chưa có cấu hình trước đó, ứng dụng sẽ tự tạo một cấu hình mặc định. |
| `PUT`       | `/settings/:userId` | Cập nhật một số thay đổi trong tuỳ chọn của người dùng hoặc tạo mới. |

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
| `GET`       | `/auth/google/callback` | Google gọi lại sau khi người dùng đồng ý. Trả về `accessToken` (JWT). |
| `GET`       | `/auth/me`              | Lấy thông tin người dùng đang đăng nhập (yêu cầu Bearer token). |

### Luồng đăng nhập

1. Client điều hướng người dùng tới `GET /auth/google`.
2. Sau khi người dùng xác nhận trên Google, server nhận callback tại `/auth/google/callback`.
3. Server tạo hoặc tìm user theo `googleId`, phát hành JWT.
4. Client lưu `accessToken` và đính kèm vào header `Authorization: Bearer <token>` cho các request tiếp theo.

### Response `/auth/google/callback`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

> [!WARNING]
> Nếu bạn thay đổi logic hệ thống (thêm endpoint mới, thay đổi DTO hay cấu trúc phản hồi), **phải** quay trở lại cập nhật tệp này (`api-docs.md`) và kiểm tra Swagger Annotations.
