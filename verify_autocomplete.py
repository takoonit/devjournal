import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            print("Loading the editor dashboard...")
            await page.goto("http://localhost:3000/editor", wait_until="networkidle")

            # Click the 'Create your first project' link
            print("Navigating to new project page...")
            await page.get_by_role("link", name="Create your first project").click()
            await page.wait_for_url("**/editor/projects/new")

            print("Testing autocomplete...")

            # Find the tech stack input
            tag_input = page.get_by_placeholder("e.g., React, TypeScript (press Space or Enter)")

            # Type 'Re' to trigger autocomplete
            await tag_input.click()
            await tag_input.type("Re", delay=100)

            # Wait for autocomplete dropdown to appear
            print("Taking screenshot of autocomplete suggestions...")
            # We want to wait for the item to be visible before taking the screenshot
            await page.wait_for_selector('div[cmdk-item]', timeout=5000)
            await page.screenshot(path="/home/jules/verification/autocomplete.png")

            # Select 'React' via enter
            await page.keyboard.press("ArrowDown") # Ensure one is highlighted if not already
            await page.keyboard.press("Enter")

            # Assert React is a tag
            tags_text = await page.locator(".flex.flex-wrap.items-center.gap-2.p-2").inner_text()
            assert "React" in tags_text
            print(f"Tags found in DOM after selection: {tags_text}")

            print("All verification steps passed successfully!")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="/home/jules/verification/error_autocomplete.png")
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())