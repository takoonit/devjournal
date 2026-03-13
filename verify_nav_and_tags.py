import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            print("Loading the editor dashboard...")
            await page.goto("http://localhost:3000/editor", wait_until="networkidle")

            print("Taking screenshot of the new navigation layout...")
            await page.screenshot(path="/home/jules/verification/new_nav.png")

            # Click the 'Create your first project' button
            print("Navigating to new project page...")
            await page.get_by_role("link", name="Create your first project").click()
            await page.wait_for_url("**/editor/projects/new")

            print("Testing the auto-committing tag input...")
            # Fill in required fields
            await page.get_by_placeholder("e.g., My Awesome App").fill("Test Project")
            await page.get_by_placeholder("Brief description of your project...").fill("Testing tags")

            # Test comma commit
            await page.get_by_placeholder("e.g., React, TypeScript (press Space or Enter)").fill("React")
            await page.get_by_placeholder("e.g., React, TypeScript (press Space or Enter)").press(",")

            # Test enter commit
            await page.get_by_placeholder("Add more...").fill("Next.js")
            await page.get_by_placeholder("Add more...").press("Enter")

            # Test space commit
            await page.get_by_placeholder("Add more...").fill("Tailwind")
            await page.get_by_placeholder("Add more...").press("Space")

            # Take screenshot of the created tags
            print("Taking screenshot of the filled tags...")
            await page.screenshot(path="/home/jules/verification/new_tags.png")

            # Verify the tags exist in the DOM
            tags_text = await page.locator(".flex.flex-wrap.items-center.gap-2.p-2").inner_text()
            print(f"Tags found in DOM: {tags_text}")
            assert "React" in tags_text
            assert "Next.js" in tags_text
            assert "Tailwind" in tags_text

            print("All verification steps passed successfully!")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="/home/jules/verification/error_nav2.png")
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
