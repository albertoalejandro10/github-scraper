import { getArrayTextContent } from './getTextContent.js'

export const scrape = async (page) => {
  try {
    await page.waitForSelector('turbo-frame[id="user-profile-frame"]')

    const avatar = await getArrayTextContent(
      page,
      '.Layout-main .d-table-cell.col-2.col-lg-1.v-align-top > a[data-hovercard-type] > img',
      elements => elements.map(el => el.src.replace('https://avatars.githubusercontent.com/u/', '')),
    )

    const name = await getArrayTextContent(
      page,
      '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--primary',
      elements => elements.map(el => el.textContent.trim()),
    )
 
    const username = await getArrayTextContent(
      page, 
      '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--secondary', 
      elements => elements.map(el => el.textContent.trim()), 
    )

    return {
      avatar,
      name,
      username,
    }
  } catch (error) {
    console.error('Error extracting:', error)
    return null
  }
}