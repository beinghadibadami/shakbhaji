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
from dotenv import load_dotenv


load_dotenv()

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8080", 
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
MONGODB_URL = os.getenv("MONGODB_URL")
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
async def scrape_bigbasket(search_query):
    try:
        # Launch Playwright properly for Windows
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--start-maximized"]
        )
        context = await browser.new_context(
            viewport={"width": 1366, "height": 768},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        page = await context.new_page()
        
        # 1. Navigate with robust waiting
        search_url = f"https://www.bigbasket.com/ps/?q={search_query.replace(' ', '+')}"
        await page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        
        # 2. Wait for container hierarchy
        # await page.wait_for_selector("body #__next", state="attached", timeout=15000)
        
        # 3. Drill down through containers
        container_selector = """
            body #__next 
            div.container.min-h-96 
            div.col-span-12.mt-3.mb-8 
            div.grid.grid-flow-col.gap-x-6.relative.mt-5.pb-5.border-t.border-dashed.border-silverSurfer-400 
            section 
            section.z-10
        """
        await page.wait_for_selector(container_selector, timeout=20000)
        
        # 4. Wait for product grid
        ul_selector = f"{container_selector} ul.mt-5.grid.gap-6.grid-cols-9"
        await page.wait_for_selector(ul_selector, state="visible", timeout=15000)
        
        # 5. Get first item
        first_item = await page.query_selector(f"{ul_selector} li.PaginateItems___StyledLi-sc-1yrbjdr-0.dDBqny")
        if not first_item:
            return {"error": "Product grid not found"}
        
        await first_item.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        
        # 6. Extract price
        price = "N/A"
        for selector in [
            ".Label-sc-15v1nk5-0.Pricing___StyledLabel-sc-pldi2d-1.gJxZPQ.AypOi",
            "span:has-text('₹')"
        ]:
            element = await first_item.query_selector(selector)
            if element:
                price = (await element.inner_text()).strip()
                if "₹" in price:
                    break
        
        # 7. Extract quantity
        quantity = "N/A"
        for selector in [
            ".Label-sc-15v1nk5-0.PackChanger___StyledLabel-sc-newjpv-1.gJxZPQ.cWbtUx",
            ".Label-sc-15v1nk5-0.gJxZPQ.truncate"
        ]:
            element = await first_item.query_selector(selector)
            if element:
                quantity = (await element.inner_text()).strip()
                break

        # Update MongoDB
        if collection:
            scraped_data = {
                "name": search_query.capitalize(),
                "quantity": quantity,
                "price": price,
                "scraped_at": datetime.utcnow(),
                "source_url": search_url
            }
            try:
                await collection.update_one(
                    {"name": search_query.capitalize()},
                    {"$set": scraped_data},
                    upsert=True
                )
            except Exception as db_error:
                print(f"Database error: {db_error}")

        return {
            "quantity": quantity,
            "price": price,
            "success": True
        }

    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }
    finally:
        if 'page' in locals():
            await page.close()
        if 'context' in locals():
            await context.close()
        if 'browser' in locals():
            await browser.close()
        if 'playwright' in locals():
            await playwright.stop()
# Updated price fetching function
async def get_product_price(product_name, force_refresh=False):
    """Get product price with caching"""
    product_name_normalized = product_name.lower()
    
    # Check cache if MongoDB is available
    if collection is not None and not force_refresh:
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
    return await scrape_bigbasket(product_name_normalized)

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
                            "text": "You are a fruit and vegetable expert. Your task is to analyze the provided image based on the following factors:\n\n1. **Name**  \n   Identify the name of the fruit or vegetable in the image.\n\n2. **Appearance**  \n   Consider shape, size, and any visible defects (like wrinkles, blemishes, or discoloration).\n\n3. **Texture**  \n   Evaluate the surface texture — smooth, rough, grainy, etc.\n\n4. **Color**  \n   Analyze the color, hue, and saturation, considering ripeness or spoilage.\n\n5. **Quality Score (%)**  \n   Assign a quality score in percentage (0–100%) based on appearance, texture, and color. Higher percentages mean better quality.\n\n6. **Moisture Content (%)**  \n   Estimate the moisture content in percentage (0–100%) using color and texture clues.\n\n7. **Size**  \n   Categorize the size as one of the following: `small`, `medium`, or `big`.\n\n---\n\n### Important Instructions:\n\n- Always provide the output in **strict JSON format**.\n- Ensure that `quality` and `moisture` are always given in **percentages (0–100%)**.\n- The `quality` and `moisture` score must be determined **only after analyzing the insight** provided. That means if the insight indicates spoilage or damage, scores must reflect that negatively.\n- If the image **does not contain a fruit or vegetable**, respond with the following JSON format:\n```json\n{\n  \"error\": \"The image does not contain a fruit or vegetable.\"\n}\n```\n\n---\n\n"
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
            temperature=0.2,
            max_completion_tokens=1024,
            top_p=0.8,
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
        "mongodb": "connected" if collection is not None else "disconnected",
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

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
