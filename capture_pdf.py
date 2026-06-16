import asyncio
from playwright.async_api import async_playwright

async def capture_webpages():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Capture majlis.html
        print("Navigating to http://localhost:3001/majlis.html ...")
        await page.goto('http://localhost:3001/majlis.html', wait_until='networkidle')
        print("Generating Majlis PDF...")
        await page.pdf(path="Majlis_Preview.pdf", format="A4", print_background=True)
        
        # Capture select.html
        print("Navigating to http://localhost:3001/select.html ...")
        await page.goto('http://localhost:3001/select.html', wait_until='networkidle')
        print("Generating Select PDF...")
        await page.pdf(path="Select_Preview.pdf", format="A4", print_background=True)
        
        await browser.close()
        print("PDFs Generated Successfully!")

asyncio.run(capture_webpages())
