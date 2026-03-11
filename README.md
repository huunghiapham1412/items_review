# Hệ Thống Quản Lý Đơn Hàng

Ứng dụng web giúp quản lý đơn hàng, theo dõi trạng thái refund và review một cách hiệu quả.

## 📋 Tính Năng

- **Đăng nhập bằng ID**: Mỗi người dùng có không gian dữ liệu riêng biệt
- **Thêm đơn hàng mới** với các thông tin:
  - Mã đơn hàng (Order #)
  - Email PayPal
  - Tên người bán (Seller)
  - Giá sản phẩm ($)
  - Thông tin ngân hàng
  - Hình ảnh sản phẩm
  - Trạng thái Refund (Chưa Refund / Đã Refund)
  - Trạng thái Review (Chưa Review / Đã Viết / Đã Chấp Nhận)
- **Nhóm đơn hàng theo Seller**: Dễ dàng tìm kiếm và quản lý theo từng người bán
- **Cập nhật trạng thái nhanh**: Click để chuyển đổi trạng thái Refund và Review
- **Xóa đơn hàng**: Với xác nhận trước khi xóa vĩnh viễn
- **Lưu trữ cục bộ**: Dữ liệu được lưu trong localStorage của trình duyệt
- **Theo dõi bộ nhớ**: Hiển thị mức sử dụng bộ nhớ

## 🚀 Cách Sử Dụng

1. Mở file `index.html` trong trình duyệt web
2. Nhập ID người dùng và nhấn "Truy cập" để bắt đầu
3. Điền thông tin vào form "Thêm Đơn Hàng Mới"
4. Nhấn "Lưu Đơn Hàng" để lưu đơn hàng
5. Các đơn hàng sẽ được hiển thị, nhóm theo từng Seller

## ⌨️ Chuyển Đổi Trạng Thái

- **Refund**: Click vào nút "Refund" để chuyển giữa "Chưa Refund" và "Đã Refund"
- **Review**: Click vào nút "Review" để chuyển theo chu trình: "Chưa Review" → "Đã Review" → "Review đã được chấp nhận" → "Chưa Review"

## 🛠️ Công Nghệ Sử Dụng

- HTML5
- CSS3 (với TailwindCSS qua CDN)
- JavaScript (Vanilla)
- LocalStorage để lưu trữ dữ liệu

## 📁 Cấu Trúc File

```
.
├── index.html      # File HTML chính
├── main.js         # Logic JavaScript
├── style.css       # Stylesheet tùy chỉnh
├── README.md       # File hướng dẫn này
└── items_review/   # Thư mục dự phòng
    ├── index.html
    ├── main.js
    ├── style.css
    └── README.md
```

## ⚠️ Lưu Ý

- Dữ liệu được lưu trong localStorage của trình duyệt - xóa dữ liệu trình duyệt sẽ mất tất cả đơn hàng
- Kích thước ảnh sản phẩm không nên vượt quá 500KB
- Mỗi ID người dùng có dữ liệu riêng biệt, không ảnh hưởng đến nhau

## 📝 Giấy Phép

Dự án này được tạo cho mục đích quản lý đơn hàng cá nhân.

