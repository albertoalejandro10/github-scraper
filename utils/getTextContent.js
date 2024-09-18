export const getTextContent = async (page, selector, fn = el => el.textContent.trim()) => {
  try {
    const element = await page.$(selector)
    if (element) {
      return await page.$eval(selector, fn)
    }
    return null // Element not found, return null to trigger default value
  } catch (error) {
    console.error(`Error extracting text from ${selector}:`, error)
    return null
  }
}

export const getArrayTextContent = async (page, selector, fn) => {
  try {
    const elements = await page.$$(selector)
    if (elements.length > 0) {
      return await page.$$eval(selector, fn)
    }
    return []
  } catch (error) {
    return null
  }
}
