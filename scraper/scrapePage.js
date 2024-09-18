// /scraper/scrapePage.js
import { initBrowser } from './browser.js'

export const scrapePage = async (url, scraperFunction) => {
  const browser = await initBrowser()
  const page = await browser.newPage()

  try {
    await page.goto(url)
    await page.setViewport({ width: 1280, height: 720 })
    const data = await scraperFunction(page)
    return data
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return { error: `Failed to scrape ${url}` }
  } finally {
    await page.close()
  }
}
