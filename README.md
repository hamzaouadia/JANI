# Jani AI Platform 🚀

A modern microservices-based platform for AI-powered applications.  
Built with **Next.js**, **Node.js (TypeScript)**, **PostgreSQL**, **Redis**, **Docker**, and **Kubernetes-ready** architecture.

---

## 📖 Architecture

```text
                        +-----------------------+
                        |   Next.js frontend    |
         (SSR/Edge)     |   (Vercel/Edge/K8s)   |
                        +----------+------------+
                                   |
                                   | HTTPS (public)
                                   v
                           +---------------+
                           | API Gateway   |  (Traefik / Envoy / Kong)
                           +---------------+
        --------------------------------------------------------------
        |                  |                     |                  |
+---------------+  +----------------+   +----------------+  +----------------+
| Auth Service  |  | User Profile   |   | AI / Inference |  | Embeddings /  |
| (Node TS)     |  | Service        |   | Service (GPU)  |  | Vector DB svc |
| (JWT/OIDC)    |  | (Node TS)      |   | (Python/Node)  |  | (Qdrant/Pinecone) |
+---------------+  +----------------+   +----------------+  +----------------+
        |                 |                     |                  |
        v                 v                     v                  v
   PostgreSQL        PostgreSQL (owner)   Object storage         Vector DB
   (users, perms)    (domain data)        (S3/MinIO)             (qdrant/pinecone)
        \                 |                     |                  /
         \--------------> Event Bus (Kafka/RabbitMQ) <------------/
                                  |
                              Workers (BullMQ / Celery)
                                  |
                              Redis (cache / queues)
```

## 📂 Project Structure

```
.
├── .env
├── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml
├── apps/
│   └── web/
│       ├── .next/
│       ├── node_modules/
│       ├── public/
│       ├── src/
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── services/
│   └── auth/
│       ├── node_modules/
│       ├── prisma/
│       ├── src/
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       └── .env
├── docker-compose.yml
├── Makefile
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [pnpm](https://pnpm.io/) >= 8.x
- [Docker](https://www.docker.com/)
- [Python 3.10+](https://www.python.org/) (for AI service, if applicable)
- [make](https://www.gnu.org/software/make/) (usually pre-installed on Linux/macOS)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/jani.git
cd jani
pnpm install
```

---

## 🛠️ Service Management (Makefile)

All service management is handled via the `Makefile`:

- **Start all services:**  
  ```bash
  make up
  ```
- **Stop all services:**  
  ```bash
  make down
  ```
- **Build all services:**  
  ```bash
  make build
  ```
- **View logs:**  
  ```bash
  make logs
  ```
- **Clean Docker system:**  
  ```bash
  make clean
  ```
- **Exec into a service container:**  
  ```bash
  make exec
  ```
  *(You will be prompted for the service name, e.g. `auth` or `web`)*

- **Restart all services:**  
  ```bash
  make restart
  ```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

---

## 🧪 Testing

Run all tests:

```bash
pnpm test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.