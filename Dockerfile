# Dockerfile for Kotlin & Android Mastery Lab
# Full-Stack Deployment with Live kotlinc JVM Compiler

FROM node:20-bookworm-slim

# Install OpenJDK JRE, curl, and unzip for kotlinc
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jre-headless \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Kotlin Compiler (kotlinc 2.1.20)
ENV KOTLIN_VERSION=2.1.20
RUN curl -sSL "https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip" -o /tmp/kotlinc.zip \
    && unzip -q /tmp/kotlinc.zip -d /opt \
    && rm /tmp/kotlinc.zip

ENV PATH="/opt/kotlinc/bin:${PATH}"

# Verify kotlinc installation
RUN kotlinc -version

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY server.js ./
COPY public ./public

# Environment configuration
ENV PORT=3456
ENV NODE_ENV=production

EXPOSE 3456

CMD ["node", "server.js"]
