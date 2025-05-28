
# Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Groq API Key**: Get your API key from [Groq Console](https://console.groq.com/)

## Environment Variables

Set these environment variables in your deployment platform:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/scraper_db?retryWrites=true&w=majority
PORT=8000
```

## Deployment Options

### Option 1: Railway (Recommended)

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard
5. Deploy automatically

### Option 2: Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set build command: `pip install -r requirements.txt && playwright install chromium`
6. Set start command: `python app.py`
7. Add environment variables

### Option 3: Heroku

1. Install Heroku CLI
2. Create a new Heroku app
3. Add buildpacks:
   ```bash
   heroku buildpacks:add heroku/python
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-playwright
   ```
4. Set environment variables:
   ```bash
   heroku config:set GROQ_API_KEY=your_key
   heroku config:set MONGODB_URL=your_mongodb_url
   ```
5. Deploy: `git push heroku main`

### Option 4: Google Cloud Run

1. Build and push Docker image:
   ```bash
   docker build -t gcr.io/your-project/fruit-veggie-api .
   docker push gcr.io/your-project/fruit-veggie-api
   ```
2. Deploy to Cloud Run with environment variables

## Frontend Deployment

Update the API URL in your frontend code to point to your deployed backend URL.

## Post-Deployment

1. Test the `/health` endpoint to ensure everything is working
2. Update CORS origins in `app.py` to include your frontend domain
3. Test image analysis and price scraping functionality

## Troubleshooting

- Check logs for Playwright browser installation issues
- Ensure MongoDB connection string is correct
- Verify all environment variables are set
- Check if the deployment platform supports Playwright browsers
