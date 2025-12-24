# Этап сборки
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Этап production
FROM nginx:alpine

# Копирование собранных файлов из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx (опционально)
# Если нужно настроить nginx, можно создать nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]

