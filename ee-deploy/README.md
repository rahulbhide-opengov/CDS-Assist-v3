# Ephemeral Environment Deployment

Kubernetes manifests and DevSpace config for deploying the CDS-Assist React app to ephemeral environments.

## Prerequisites

- Kubernetes cluster (e.g., GKE, EKS, AKS)
- `kubectl` configured
- [DevSpace](https://devspace.sh/) (optional, for dev mode)
- nginx Ingress Controller
- cert-manager (for TLS)

## Quick Deploy

```bash
# Build and push image first (see .github/workflows/docker-build.yml)
docker build -t ghcr.io/opengov/cds-assist:latest .
docker push ghcr.io/opengov/cds-assist:latest

# Deploy
kubectl apply -f ee-deploy/
```

## DevSpace

```bash
# Install DevSpace
npm install -g devspace

# Deploy with sync + hot reload
devspace deploy

# Dev mode (port-forward, file sync)
devspace dev
```

## Variables

| Variable    | Default              | Description                    |
|------------|----------------------|--------------------------------|
| `NAMESPACE`| `cds-assist-ee`      | Kubernetes namespace           |
| `IMAGE_TAG`| `latest`             | Docker image tag               |

## Ingress

Update `ee-deploy/ingress.yaml` with your host:

```yaml
spec:
  tls:
    - hosts:
        - your-app.your-domain.com
  rules:
    - host: your-app.your-domain.com
```

## Probes

- **Readiness**: `GET /` on port 8080
- **Liveness**: `GET /` on port 8080
