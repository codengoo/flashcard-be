---
name: sync-api-docs
description: Bắt buộc cập nhật tài liệu API (api-docs.md) mỗi khi có sự thay đổi về mặt logic, controller, DTO, hoặc các thành phần liên quan.
---

# Sync API Docs Rule

Bạn **PHẢI** đọc và tuân thủ các quy định dưới đây mỗi khi làm việc với API của dự án:

1. **Cập nhật Swagger Decorator**: Khi chỉnh sửa DTO hoặc Controller (thay đổi/xoá/bổ sung thuộc tính và API endpoint), luôn phải bổ sung các decorator của Swagger như `@ApiProperty`, `@ApiOperation`, `@ApiResponse` tương ứng.
2. **Cập nhật Markdown Docs**: Bất kì khi nào có một logic mới hoặc endpoint được thêm vào hệ thống làm thay đổi cách client giao tiếp với server, bạn **PHẢI** cập nhật file `docs/api-docs.md` để giải thích tường minh API đó (URL, Method, Payload, Cách sử dụng).

**Lưu ý**: Đừng bỏ qua bước này vì tài liệu sạch sẽ giúp frontend hoạt động ổn định và chính xác hơn.
