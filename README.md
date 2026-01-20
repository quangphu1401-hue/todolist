# Todo List App

Ứng dụng Todo List đơn giản được xây dựng với NextJS (Frontend), NestJS (Backend) và PostgreSQL (Database).

## Cấu trúc dự án

```
todo-app/
├── backend/          # NestJS API
├── frontend/         # NextJS App
└── README.md
```

## Yêu cầu

- Node.js (v18 trở lên)
- PostgreSQL (v12 trở lên)
- npm hoặc yarn

## Cài đặt và chạy

### 1. Cài đặt PostgreSQL

**Cách 1: Sử dụng Docker Compose (Khuyến nghị)**

```bash
docker-compose up -d
```

PostgreSQL sẽ chạy trong container với:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: todo_db

**Cách 2: Cài đặt PostgreSQL trực tiếp**

Đảm bảo PostgreSQL đã được cài đặt và đang chạy. Tạo database:

```bash
createdb todo_db
```

Hoặc sử dụng psql:

```bash
psql -U postgres
CREATE DATABASE todo_db;
```

### 2. Cài đặt Backend (NestJS)

```bash
cd backend
npm install
```

### 3. Cấu hình Backend

Tạo file `.env` trong thư mục `backend/` (tùy chọn, có thể dùng giá trị mặc định):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db
```

### 4. Chạy Backend

```bash
cd backend
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:3001

### 5. Cài đặt Frontend (NextJS)

Mở terminal mới:

```bash
cd frontend
npm install
```

### 6. Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Sử dụng

1. Mở trình duyệt và truy cập: http://localhost:3000
2. Thêm công việc mới bằng cách nhập vào ô input và nhấn "Thêm"
3. Đánh dấu hoàn thành bằng cách click vào checkbox
4. Xóa công việc bằng cách nhấn nút "Xóa"

## API Endpoints

Backend cung cấp các API sau:

- `GET /todos` - Lấy danh sách tất cả todos
- `POST /todos` - Tạo todo mới
- `GET /todos/:id` - Lấy todo theo ID
- `PATCH /todos/:id` - Cập nhật todo
- `DELETE /todos/:id` - Xóa todo

## Lưu ý

- Đảm bảo PostgreSQL đang chạy trước khi start backend
- Backend phải chạy trước frontend
- Database sẽ tự động tạo bảng `todos` khi backend khởi động (synchronize: true)

