# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Option 2: Manual Deployment

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

From the project root directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name: **private-organ-matching** (or your preferred name)
- Directory: **./PrivacyOrganMatching** (or current directory)
- Auto-detected settings? **Y**

#### Step 4: Production Deployment

```bash
vercel --prod
```

## Project Structure for Vercel

```
PrivacyOrganMatching/
├── index.html              # Main entry point
├── style.css               # Styles
├── script.js               # JavaScript logic
├── vercel.json             # Vercel configuration
├── public/
│   └── index.html          # Alternative entry point
└── contracts/
    └── PrivateOrganMatching.sol
```

## Configuration

The `vercel.json` file is already configured with:

- ✅ Static file serving
- ✅ SPA routing (all routes serve index.html)
- ✅ Security headers
- ✅ Cache optimization

## Environment Variables

After deployment, you may need to update the contract address in `script.js`:

```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

## Post-Deployment Steps

1. **Update Contract Address**
   - Deploy your smart contract to Sepolia testnet
   - Copy the contract address
   - Update `CONTRACT_ADDRESS` in `script.js` line 2
   - Redeploy: `vercel --prod`

2. **Test the Application**
   - Open your Vercel URL
   - Connect your MetaMask wallet
   - Switch to Sepolia testnet
   - Test donor/recipient registration

3. **Custom Domain (Optional)**
   - Go to Vercel dashboard → Your Project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Vercel Dashboard

Access your deployed application:
- **Preview URL**: `https://your-project-name.vercel.app`
- **Dashboard**: `https://vercel.com/dashboard`

## Troubleshooting

### Issue: UI not loading

**Solution**: Ensure all files (index.html, style.css, script.js) are in the root directory

### Issue: Contract connection fails

**Solution**:
1. Check CONTRACT_ADDRESS in script.js is correct
2. Ensure you're on Sepolia testnet
3. Verify MetaMask is installed

### Issue: Styles not applying

**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: 404 errors

**Solution**: The vercel.json rewrites configuration handles SPA routing automatically

## Local Development

Test the deployment locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev
```

This starts a local server that mimics Vercel's production environment.

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and pull requests

## Performance Optimization

The deployment is optimized with:
- Static file caching (1 year for immutable assets)
- Gzip/Brotli compression
- HTTP/2 and HTTP/3 support
- Edge network CDN
- Security headers

## Security

Implemented security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Support

For Vercel deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

For application issues:
- Check browser console for errors
- Verify MetaMask connection
- Ensure contract is deployed on Sepolia

---

**Built for Zama Bounty Track December 2025**
