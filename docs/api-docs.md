# 🚀 API Documentation

Tài liệu này cung cấp hướng dẫn chi tiết cách tích hợp với API của Flashcard Backend. Tài liệu được thiết kế đặc biệt thân thiện cho các bạn Frontend Developers (FE DEV).

> [!TIP]
> **Swagger UI** song song với tài liệu này luôn có sẵn tại: `http://localhost:3000/api`

---

## 🔒 1. Cơ Chế Xác Thực (Authentication) & Phân Quyền (RBAC)

Hệ thống sử dụng **Cookies (HTTPOnly)** để bảo mật, tức là Token sẽ tự động lưu ở trình duyệt người dùng mà không thể dùng Javascript để lấy nó trực tiếp (Chống XSS hoàn hảo).

<details>
<summary>👉 Nhấn để xem luồng tương tác (Cookie-based Auth)</summary>

1. **Đăng nhập:** FE chuyển hướng người dùng gọi đến `/auth/google` (Google OAuth).
2. **Tokens:** Trình duyệt nhận kết quả. Backend tự động cấp 2 cookie ẩn: `access_token` và `refresh_token`.
3. **Gọi API:** Trình duyệt / Axios **tự động** gắn Cookie vào mỗi request được bảo vệ (với Axios cần bật `withCredentials: true`). Người làm Frontend **không cần** quản lý header `Authorization`.
4. **Token hết hạn (Lỗi 401):** FE bắt HTTP Code 401, gọi `/auth/refresh` để cập nhật lại bộ Token tự động mà không bắt người dùng đăng nhập lại, Cookie sẽ tự được ghi đè!
</details>

🔥 **Cấu hình cho Axios / Fetch (Frontend)**
Để Cookie có thể được gửi đi tự động cho mỗi request:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  // ⚠️ BẮT BUỘC ĐỂ GỬI COOKIE:
  withCredentials: true 
});
```

Hệ thống phần quyền dựa trên **Permissions**, User sẽ sở hữu Role, và Role sở hữu Permissions.

---

## 🗂 2. Tập hợp các Endpoint theo Nhóm

### 🔑 2.1 Auth API (`/auth`)
Liên quan tới thông tin user hiện tại và đăng nhập.

| Method | Endpoint | Yêu cầu | Mô tả |
| ------ | -------- | --------| ----- |
| `GET`  | `/auth/google` | Public | **Chuyển hướng** người dùng sang trang Google để đăng nhập. |
| `GET`  | `/auth/google/callback` | Public | Google gọi về API này kèm code, hệ thống xử lý và set cookies. |
| `POST` | `/auth/refresh` | Cookie `refresh_token` | Cấp phát lại Access Token khi bị hết hạn, lấy từ Cookie. Trả về Headers `Set-Cookie`. |
| `GET`  | `/auth/me` | Cookie `access_token` | Lấy profile và thông tin User hiện tại. |

<details>
<summary>📦 Response Model <code>/auth/me</code></summary>

```json
{
  "_id": "664abc...",
  "googleId": "123123123",
  "email": "user@gmail.com",
  "displayName": "Nguyen Van A",
  "avatar": "https://...",
  "roles": ["<role_id>"]
}
```
</details>

---

### ⚙️ 2.2 Settings API (`/settings`)
Lưu trữ và lấy cấu hình ứng dụng cho từng User (Theme, Ngôn ngữ, Notification...).

| Method | Endpoint | Yêu cầu quyền | Mô tả |
| ------ | -------- | --------------| ----- |
| `GET`  | `/settings` | Đã đăng nhập | Lấy cài đặt của tài khoản hiện tại. |
| `PUT`  | `/settings` | Đã đăng nhập | Cập nhật cài đặt của tài khoản hiện tại. |
| `GET`  | `/settings/:userId` | `modify:settings` | (Dành cho Admin) Lấy thông tin cài đặt của người dùng khác. |
| `PUT`  | `/settings/:userId` | `modify:settings` | (Dành cho Admin) Can thiệp quyền cài đặt của người dùng khác. |

<details>
<summary>📝 Payload Body Cập nhật (<code>PUT /settings</code>)</summary>

```json
{
  "theme": "dark",
  "language": "vi",
  "dailyGoal": 30,
  "notificationsEnabled": true
}
```
</details>

---

### 🛡️ 2.3 Quản Lý Cơ Chế Quyền (Roles & Permissions)
Tính năng Admin để tạo Roles và Permissions truy cập.

#### 👉 Permissions API (`/permissions`)
- **Yêu cầu Quyền:** `read:roles` (cho thao tác GET), `modify:roles` (cho chức năng POST, PUT, DELETE)

| Method | Endpoint | Mô tả |
| ------ | -------- | ----- |
| `GET` | `/permissions` | Liệt kê tất cả Permission hiện có trên hệ thống. |
| `GET` | `/permissions/:id` | Lấy thông tin một Permission cụ thể. |
| `POST` | `/permissions` | Tạo Permission mới. |
| `PUT` | `/permissions/:id` | Sửa nội dung Permission. |
| `DELETE` | `/permissions/:id` | Xoá một Permission. |

<details>
<summary>📝 Payload ví dụ Tạo/Sửa (<code>POST /permissions</code>)</summary>

```json
{
  "name": "modify:settings",
  "description": "Có quyền được chỉnh sửa setting của mọi người dùng"
}
```
</details>

#### 👉 Roles API (`/roles`)
Role chứa nhiều Permission. Và User chứa nhiều Roles.
- **Yêu cầu Quyền:** `read:roles` (GET), `modify:roles` (POST, PUT, DELETE)

| Method | Endpoint | Mô tả |
| ------ | -------- | ----- |
| `GET` | `/roles` | Danh sách các Role. Giao diện FE thường lấy mảng này. |
| `GET` | `/roles/:id` | Lấy chi tiết một role. |
| `POST` | `/roles` | Tạo Role mới, gán kèm danh sách ID của Permission. |
| `PUT` | `/roles/:id` | Thay đổi tên role và danh sách permissions. |
| `DELETE`| `/roles/:id` | Xóa role. |

<details>
<summary>📝 Payload ví dụ Tạo Role (<code>POST /roles</code>)</summary>

```json
{
  "name": "Admin Level 1",
  "description": "Quản trị viên cấp thấp",
  "permissions": ["<permission_id_1>", "<permission_id_2>"]
}
```
</details>

#### 👉 Gán Role cho một User (`/users/:id/roles`)
Để người dùng có quyền trong hệ thống.
- **Yêu cầu Quyền:** Hệ thống quy định riêng, mặc định cho Admin hoặc Super Admin.

| Method | Endpoint | Mô tả |
| ------ | -------- | ----- |
| `POST` | `/users/:id/roles` | Ghi đè hoặc thêm tập danh sách Roles cho User có id là `:id` |

<details>
<summary>📝 Payload Body (<code>POST /users/:id/roles</code>)</summary>

```json
{
  "roles": ["<role_id_abcxyz>"]
}
```
</details>

---

### 📊 2.4 Dataset API (`/dataset`)
Module này chuyên xử lý các nội dung file ngoài hệ thống (Sheet).

| Method | Endpoint | Yêu cầu | Mô tả |
| ------ | -------- | ------- | ----- |
| `GET` | `/dataset/get-from-sheet` | Đã đăng nhập | Lấy mảng dữ liệu đa chiều từ file Google Sheets của người dùng. |

<details>
<summary>📦 Tham số & Request Mẫu <code>/dataset/get-from-sheet</code></summary>

**Query Parameters:**
- `spreadsheetId` *(Bắt buộc)*: Nằm trên đường dẫn của trang tính. Ví dụ: `1BxiMVs0XRA5...`
- `range` *(Không bắt buộc)*: Filter phạm vi lấy dữ liệu (VD: `Sheet1!A1:D10`).

**Ví dụ Request Của FE:**
`GET /dataset/get-from-sheet?spreadsheetId=1BxiMVs&range=Sheet1!A1:B`

**Response Thành Cấp (Mảng 2 Chiều):**
```json
{
  "success": true,
  "data": [
    ["Tiêu đề Cột 1", "Tiêu đề Cột 2"],
    ["Dữ liệu dòng 1A", "Dữ liệu dòng 1B"]
  ]
}
```
</details>

---
> [!WARNING]
> Nếu bạn thay đổi logic Controller / DTO, **phải** quay lại file `docs/api-docs.md` để bổ sung ngay endpoint đó và viết các Swagger Annotations (`@ApiProperty`, v.v... ) để frontend không bị miss Data!
