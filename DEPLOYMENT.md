# FreshMart Azure Deployment Guide

## Overview
This guide covers deploying FreshMart on Azure with Cloudflare CDN integration.

## Architecture
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Container Apps
- **Database**: Azure Cosmos DB (MongoDB API)
- **CDN**: Cloudflare
- **DNS**: Cloudflare DNS

## Prerequisites
- Azure CLI installed
- Docker installed
- Cloudflare account
- Domain name

## Deployment Steps

### 1. Backend Deployment (Azure Container Apps)

#### 1.1 Create Azure Resources
```bash
# Login to Azure
az login

# Create resource group
az group create --name freshmart-rg --location eastus

# Create Container Apps environment
az containerapp env create \
  --name freshmart-env \
  --resource-group freshmart-rg \
  --location eastus
```

#### 1.2 Create Cosmos DB
```bash
# Create Cosmos DB account with MongoDB API
az cosmosdb create \
  --name freshmart-cosmos \
  --resource-group freshmart-rg \
  --kind MongoDB \
  --locations regionName=eastus \
  --default-consistency-level Session

# Get connection string
az cosmosdb keys list \
  --name freshmart-cosmos \
  --resource-group freshmart-rg \
  --type connection-strings
```

#### 1.3 Deploy Backend Container
```bash
# Build and push to Azure Container Registry
az acr create --resource-group freshmart-rg --name freshmartacr --sku Basic
az acr login --name freshmartacr

# Build and push backend image
cd backend
docker build -t freshmartacr.azurecr.io/freshmart-backend:latest .
docker push freshmartacr.azurecr.io/freshmart-backend:latest

# Deploy container app
az containerapp create \
  --name freshmart-backend \
  --resource-group freshmart-rg \
  --environment freshmart-env \
  --image freshmartacr.azurecr.io/freshmart-backend:latest \
  --target-port 8000 \
  --ingress external \
  --env-vars MONGODB_URL="<your-cosmos-connection-string>" \
  --cpu 0.5 \
  --memory 1Gi
```

### 2. Frontend Deployment (Azure Static Web Apps)

#### 2.1 Build Frontend
```bash
cd frontend
npm run build
```

#### 2.2 Deploy to Static Web Apps
```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
az staticwebapp create \
  --name freshmart-frontend \
  --resource-group freshmart-rg \
  --source https://github.com/yourusername/freshmart_q \
  --location eastus2 \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist"
```

### 3. Cloudflare Integration

#### 3.1 DNS Setup
1. Add your domain to Cloudflare
2. Update nameservers at your domain registrar
3. Create DNS records:
   - `A` record: `@` → Azure Static Web App IP
   - `CNAME` record: `api` → Azure Container App URL

#### 3.2 SSL/TLS Configuration
1. In Cloudflare dashboard → SSL/TLS
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

#### 3.3 CDN Configuration
1. Go to Speed → Optimization
2. Enable Auto Minify (HTML, CSS, JS)
3. Enable Brotli compression
4. Set Browser Cache TTL to 4 hours

#### 3.4 Page Rules (Optional)
Create page rules for better caching:
- `yourdomain.com/api/*` → Cache Level: Bypass
- `yourdomain.com/*` → Cache Level: Standard

## Environment Variables

### Backend (.env)
```
MONGODB_URL=<cosmos-db-connection-string>
JWT_SECRET_KEY=<generate-secure-key>
CORS_ORIGINS=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
```

## Monitoring & Scaling

### Azure Monitor
```bash
# Enable Application Insights
az monitor app-insights component create \
  --app freshmart-insights \
  --location eastus \
  --resource-group freshmart-rg
```

### Auto Scaling
```bash
# Configure container app scaling
az containerapp update \
  --name freshmart-backend \
  --resource-group freshmart-rg \
  --min-replicas 1 \
  --max-replicas 10
```

## Cost Optimization

### Azure Resources
- **Container Apps**: ~$30-50/month
- **Cosmos DB**: ~$25-40/month (400 RU/s)
- **Static Web Apps**: Free tier available
- **Container Registry**: ~$5/month

### Cloudflare
- **Free Plan**: Includes CDN, SSL, basic DDoS protection
- **Pro Plan**: $20/month for advanced features

## Security Best Practices

1. **Enable Azure Key Vault** for secrets
2. **Configure CORS** properly
3. **Use Cloudflare WAF** rules
4. **Enable rate limiting**
5. **Regular security updates**

## Backup Strategy

### Database Backup
```bash
# Enable automatic backup for Cosmos DB
az cosmosdb sql database throughput update \
  --account-name freshmart-cosmos \
  --resource-group freshmart-rg \
  --name freshmart \
  --throughput 400
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Check backend CORS configuration
2. **SSL issues**: Verify Cloudflare SSL settings
3. **Database connection**: Check Cosmos DB firewall rules
4. **Container startup**: Check logs in Azure portal

### Useful Commands
```bash
# Check container logs
az containerapp logs show \
  --name freshmart-backend \
  --resource-group freshmart-rg

# Update container app
az containerapp update \
  --name freshmart-backend \
  --resource-group freshmart-rg \
  --image freshmartacr.azurecr.io/freshmart-backend:v2
```