import { getTextContent } from '../utils/getTextContent.js'

export const checkUsername = async (page) => {
  try {
    await page.waitForSelector('.application-main')

    const results = await getTextContent(page, 'main > react-app > div > div > div.Box-sc-g0xbh4-0.emundt > div > div > div.Box-sc-g0xbh4-0.kKUpQe > div.Box-sc-g0xbh4-0.hlUAHL > div > div.Box-sc-g0xbh4-0.gytyqX > div:nth-child(1) > div > span > span > div')
    const existsUsername = Number(results.split(' ')[0]) > 0
    return existsUsername
  } catch (error) {
    console.error('Error extracting followers:', error)
    return null
  }
}