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

> [!WARNING]
> Nếu bạn thay đổi logic hệ thống (thêm endpoint mới, thay đổi DTO hay cấu trúc phản hồi), **phải** quay trở lại cập nhật tệp này (`api-docs.md`) và kiểm tra Swagger Annotations.
