
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.responses import JSONResponse
from groq import Groq
import os
import base64
import requests
import json
from io import BytesIO
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import asyncio

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8080", 
    "https://your-frontend-domain.com",  # Replace with your actual frontend domain
    "*"  # Remove this in production and add specific domains
]

# Initialize FastAPI app
app = FastAPI(
    title="Fruit and Vegetable Analysis API",
    description="API to analyze fruits and vegetables for quality, moisture, size, insights, and prices.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup - Use environment variable for connection string
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
try:
    client = MongoClient(MONGODB_URL)
    db = client['scraper_db']
    collection = db['fruits_veggies']
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    client = None
    db = None
    collection = None

# Pydantic models
class ImageUrlInput(BaseModel):
    image_url: str

# Function to encode image to base64
def encode_image(image_data):
    return base64.b64encode(image_data).decode('utf-8')

# Function to download image from URL
def download_image(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image: {str(e)}")

# Updated scraper function using Playwright
async def scrape_bigbasket_playwright(search_query):
    """Scrape BigBasket using Playwright for cloud deployment compatibility"""
    url = f"https://www.bigbasket.com/ps/?q={search_query}"
    print(f"[INFO] Fetching data from: {url}")
    
    try:
        async with async_playwright() as p:
            # Launch browser with cloud-friendly settings
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-extensions',
                    '--no-first-run',
                    '--disable-default-apps'
                ]
            )
            
            context = await browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
            )
            page = await context.new_page()
            
            # Navigate to the page
            await page.goto(url, wait_until='networkidle', timeout=30000)
            
            # Wait for product grid to load
            await page.wait_for_selector('.mt-5.grid.gap-6.grid-cols-9', timeout=10000)
            
            # Get page content
            content = await page.content()
            
            # Close browser
            await browser.close()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')
            ul_tag = soup.find('ul', class_='mt-5 grid gap-6 grid-cols-9')
            
            if ul_tag:
                print("[INFO] Found product grid")
                first_item = ul_tag.find('li')
                
                if first_item:
                    # Extract quantity
                    quantity = "N/A"
                    quantity_span = first_item.find('span', class_='Label-sc-15v1nk5-0 PackChanger___StyledLabel-sc-newjpv-1 gJxZPQ cWbtUx') or \
                                   first_item.find('span', class_='Label-sc-15v1nk5-0 gJxZPQ truncate')
                    if quantity_span:
                        quantity = quantity_span.get_text(strip=True)
                    
                    # Extract price
                    price = "N/A"
                    price_span = first_item.find('span', class_='Label-sc-15v1nk5-0 Pricing___StyledLabel-sc-pldi2d-1 gJxZPQ AypOi')
                    if price_span:
                        price = price_span.get_text(strip=True)
                    
                    # Store in MongoDB if available
                    if collection:
                        scraped_data = {
                            "name": search_query.capitalize(),
                            "quantity": quantity,
                            "price": price,
                            "scraped_at": datetime.utcnow(),
                            "source_url": url
                        }
                        collection.update_one(
                            {"name": search_query.capitalize()},
                            {"$set": scraped_data},
                            upsert=True
                        )
                        print(f"[INFO] Updated MongoDB: {scraped_data}")
                    
                    return {"price": price, "quantity": quantity}
                else:
                    print("[WARNING] No product found.")
                    return {"price": "N/A", "quantity": "N/A"}
            else:
                print("[WARNING] Product grid not found.")
                return {"price": "N/A", "quantity": "N/A"}
                
    except Exception as e:
        print(f"[ERROR] Playwright scraping failed: {str(e)}")
        return {"price": "N/A", "quantity": "N/A"}

# Updated price fetching function
async def get_product_price(product_name, force_refresh=False):
    """Get product price with caching"""
    product_name_normalized = product_name.lower()
    
    # Check cache if MongoDB is available
    if collection and not force_refresh:
        cache_cutoff = datetime.utcnow() - timedelta(hours=24)
        cached_product = collection.find_one({
            "name": product_name_normalized.capitalize(),
            "scraped_at": {"$gt": cache_cutoff}
        })
        
        if cached_product:
            return {
                "price": cached_product["price"],
                "quantity": cached_product["quantity"]
            }
    
    # Scrape new data
    return await scrape_bigbasket_playwright(product_name_normalized)

# Main analysis function
async def analyze_image(image_data, force_refresh=False):
    """Analyze image using Groq API and fetch price data"""
    base64_img = encode_image(image_data)
    
    # Get API key from environment
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable not set")
    
    client = Groq(api_key=api_key)
    
    try:
        # Create the completion request
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "You are a fruit and vegetable expert. Your task is to analyze the provided image based on the following factors: 1. Name Identify the name of the fruit or vegetable in the image. 2. Appearance Consider shape, size, and any visible defects (like wrinkles, blemishes, or discoloration). 3. Texture Evaluate the surface texture — smooth, rough, grainy, etc. 4. Color Analyze the color, hue, and saturation, considering ripeness or spoilage. 5. Quality Score (%) Assign a quality score in percentage (0-100%) based on appearance, texture, and color. Higher percentages mean better quality. 6. Moisture Content (%) Estimate the moisture content in percentage (0-100%) using color and texture clues. 7. Size Categorize the size as one of the following: small medium big Important Instructions Always provide the output in strict JSON format. Ensure that quality and moisture are always given in percentages (0-100%). The quality and moisture score should be given only after analyzing the insight that u provide, meaning if the insight contains bad reviews or good reviews the scores must be as good or as bad as that insight. example output : { name: ,  quality: ,  (in percentage)  moisture: , (in percentage)  size: ,  (small, medium, or big)  insight:  } Only provide the decision after analyzing these parameters. If the image is not a fruit or vegetable, respond with a json indicating this is not a fruit or vegetable."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_img}"
                            }
                        }
                    ]
                }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"},
            stop=None,
        )
        
        # Parse the analysis result
        analysis_result = json.loads(completion.choices[0].message.content)
        
        # Fetch price information if it's a fruit or vegetable
        if "name" in analysis_result and analysis_result["name"] not in ["not a fruit or vegetable", "unknown"]:
            price_info = await get_product_price(analysis_result["name"], force_refresh)
            analysis_result["price"] = price_info["price"]
            analysis_result["quantity"] = price_info["quantity"]
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# API Endpoints
@app.post("/analyze/upload", response_class=JSONResponse)
async def analyze_upload(
    file: UploadFile = File(...),
    force_refresh: bool = Query(False, description="Force a new price scrape instead of using cached data")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")
    
    image_data = await file.read()
    result = await analyze_image(image_data, force_refresh)
    return JSONResponse(content=result)

@app.post("/analyze/url", response_class=JSONResponse)
async def analyze_url(
    input_data: ImageUrlInput,
    force_refresh: bool = Query(False, description="Force a new price scrape instead of using cached data")
):
    image_data = download_image(input_data.image_url)
    result = await analyze_image(image_data, force_refresh)
    return JSONResponse(content=result)

@app.get("/price/{product_name}", response_class=JSONResponse)
async def get_price_endpoint(
    product_name: str,
    force_refresh: bool = Query(False, description="Force a new scrape instead of using cached data")
):
    price_info = await get_product_price(product_name, force_refresh)
    return JSONResponse(content={"name": product_name.capitalize(), **price_info})

@app.get("/health")
async def health_check():
    """Health check endpoint for deployment"""
    return {
        "status": "healthy",
        "mongodb": "connected" if collection else "disconnected",
        "groq_api": "configured" if os.getenv("GROQ_API_KEY") else "not configured"
    }

@app.get("/")
async def root():
    return {
        "message": "Fruit and Vegetable Analysis API",
        "status": "running",
        "endpoints": {
            "analyze_upload": "/analyze/upload - Upload an image for complete analysis including price",
            "analyze_url": "/analyze/url - Provide an image URL for complete analysis including price",
            "get_price": "/price/{product_name} - Get only price information for a product",
            "health": "/health - Health check endpoint"
        }
    }

# Startup event to install Playwright browsers
@app.on_event("startup")
async def startup_event():
    """Install Playwright browsers on startup (for cloud deployment)"""
    try:
        import subprocess
        subprocess.run(["playwright", "install", "chromium"], check=True)
        print("✅ Playwright browsers installed successfully")
    except Exception as e:
        print(f"⚠️ Failed to install Playwright browsers: {e}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
