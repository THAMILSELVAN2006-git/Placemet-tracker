# Render Deployment Instructions

## Steps to Deploy Backend:

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**:
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   - **Name**: placement-tracker-backend
   - **Root Directory**: `duplicate-placement-tracker/backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**:
   Click "Advanced" and add:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your secret key (generate a strong random string)
   - `PORT` = 5000 (optional, Render sets this automatically)

5. **Create MongoDB Atlas Database** (if not done):
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string
   - Replace `<password>` with your database password
   - Use this as `MONGODB_URI`

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

7. **Get Backend URL**:
   - Copy your Render URL (e.g., https://your-app.onrender.com)
   - Update Netlify environment variable `VITE_API_URL` to: `https://your-app.onrender.com/api`

## Important Notes:
- Free tier sleeps after inactivity (first request may be slow)
- Make sure to whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
