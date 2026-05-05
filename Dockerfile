FROM node:18-alpine AS base

# Bước 1: Cài đặt dependencies
FROM base AS deps
# Thêm các thư viện cần thiết cho alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các file quản lý package
COPY package.json package-lock.json* ./
RUN npm ci

# Bước 2: Build project
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt telemetry của Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Chạy lệnh build
RUN npm run build

# Bước 3: Chạy ứng dụng (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Tạo user không có quyền root để bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy thư mục public (hình ảnh, fonts,...)
COPY --from=builder /app/public ./public

# Set quyền cho thư mục cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy các file chạy standalone (đã được tối ưu dung lượng)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Sử dụng user mới tạo
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
