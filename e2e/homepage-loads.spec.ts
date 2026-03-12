import { expect, test } from "@playwright/test";

test.describe("Utvecklingsblog Frontpage Test", () => {
	test("homepage loads with valid article structure", async ({ page }) => {
		// Navigate to homepage
		await page.goto("http://localhost:3000/");

		// Verify at least one <article> exists
		const articles = page.locator("article");
		await expect(articles.first()).toBeVisible();

		const articleCount = await articles.count();
		expect(articleCount).toBeGreaterThan(0);

		// Verify each article has a <header> with an <a> link
		for (let i = 0; i < articleCount; i++) {

			const article = articles.nth(i);
			const header = article.locator("header");
			const link = header.locator("a").first();

			// Header should be visible
			await expect(header).toBeVisible();

			// Link should be visible and have valid href
			await expect(link).toBeVisible();

			const href = await link.getAttribute("href");
			expect(href).toBeTruthy();
			expect(href?.startsWith("/")).toBe(true);
		}
	});
});
