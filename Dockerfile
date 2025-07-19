# 1. Aşama: Frontend build
FROM node:18 AS frontend-build

WORKDIR /frontend

COPY Frontend-Kutuphane/package.json Frontend-Kutuphane/package-lock.json* ./
COPY Frontend-Kutuphane/ .

RUN npm install
RUN npm run build

# 2. Aşama: Backend build
FROM maven:3.9.3-eclipse-temurin-17 AS backend-build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -Dmaven.test.skip=true

# 3. Aşama: Final imaj
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=frontend-build /frontend/dist ./src/main/resources/static
COPY --from=backend-build /app/target/*.jar ./app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
