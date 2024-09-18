import puppeteer from 'puppeteer'

let browser = null

export const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_HEADLESS === 'true',
      args: process.env.NODE_ENV === 'production' ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    })
  }
  return browser
}

export const closeBrowser = async () => {
  if (browser) {
    await browser.close()
    browser = null
  }
}
