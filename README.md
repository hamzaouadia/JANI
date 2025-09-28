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


📂 Project Structure
.
├── apps/
│   └── web/            # Next.js frontend
│
├── services/
│   ├── auth/           # Authentication service (Node + TS)
│   ├── user/           # User profile service
│   ├── ai/             # AI inference service
│   └── embeddings/     # Vector embeddings service
│
├── docker-compose.yml  # Local development stack
├── .github/            # GitHub Actions workflows
├── .env.example        # Example environment variables
└── README.md
