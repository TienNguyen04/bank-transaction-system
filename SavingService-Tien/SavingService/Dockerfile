FROM ubuntu:latest
LABEL authors="Admin"

ENTRYPOINT ["top", "-b"]
# 1. Chọn môi trường nền (Base Image)
# Sử dụng bản Java 17 siêu nhẹ (Alpine) để file build ra có dung lượng nhỏ nhất
FROM eclipse-temurin:17-jre-alpine

# 2. Tạo thư mục làm việc bên trong Container
WORKDIR /app

# 3. Copy file chạy vào Container
# Nó sẽ tìm file .jar trong thư mục target/ và đổi tên thành app.jar cho dễ gọi
COPY target/*.jar app.jar

# 4. Lệnh khởi động ứng dụng khi Container chạy
ENTRYPOINT ["java", "-jar", "app.jar"]