# 1. Sử dụng Nginx làm máy chủ Web (bản alpine siêu nhẹ)
FROM nginx:alpine

# 2. Xóa các file HTML mặc định của Nginx (để tránh rác)
RUN rm -rf /usr/share/nginx/html/*

# 3. Copy toàn bộ file HTML, CSS, JS, Images của bạn vào thư mục công khai của Nginx
COPY . /usr/share/nginx/html

# 4. Mở cổng 80 (Cổng mặc định của Nginx)
EXPOSE 80

# 5. Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]