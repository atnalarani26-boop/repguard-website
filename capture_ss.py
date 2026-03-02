import asyncio
from playwright.async_api import async_playwright
import os

async def capture_screenshot():
    # Provide the absolute path to your HTML file
    file_path = "file:///C:/Users/Rani/OneDrive/Desktop/R/cyber_journey.html"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Set viewport to standard desktop resolution
        await page.set_viewport_size({"width": 1920, "height": 1080})
        # Navigate to the file
        await page.goto(file_path)
        
        # Scroll to the audience section
        await page.evaluate("() => { document.getElementById('scene-audience').scrollIntoView({behavior: 'smooth', block: 'center'}); }")
        
        # Wait a moment for animations
        await page.wait_for_timeout(2000)
        
        # Capture screenshot
        screenshot_path = "C:/Users/Rani/OneDrive/Desktop/R/screenshot_audience.png"
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(capture_screenshot())
