export const getTextContent = async (page, selector, fn = el => el.textContent.trim()) => {
  try {
    return await page.$eval(selector, fn ?? '');
  } catch (error) {
    console.error(`Error extracting text from ${selector}:`, error);
    return null;
  }
};

export const getArrayTextContent = async (page, selector, fn) => {
  try {
    return await page.$$eval(selector, fn ?? ['Its empty']);
  } catch (error) {
    console.error(`Error extracting text from ${selector}:`, error);
    return null;
  }
};