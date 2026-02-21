# Netlify Deployment Instructions

## Steps to Deploy:

1. **Build the project locally (optional test)**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository OR drag and drop the `frontend` folder
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `your-backend-api-url` (e.g., https://your-backend.herokuapp.com/api)

4. **Redeploy** after setting environment variables

## Files Created:
- `netlify.toml` - Netlify configuration
- `public/_redirects` - SPA routing support
- `.env.example` - Environment variable template
- Updated `api.js` - Uses environment variable for API URL
