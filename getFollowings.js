import { getArrayTextContent } from './getTextContent.js'

export const getFollowing = async (page) => {
  console.log('Extracting following...')

  const following = []
  let lastPageReached = false

  // Scrape followings from the current page and spread the results into followings
  const { name, username } = await scrapeFollowing(page)
  following.push(...username)

  while (!lastPageReached) {
    // Select all pagination buttons
    const paginationButtons = await page.$$('.Layout-main .paginate-container .pagination a')
    // The last button in the list is always the "Next" button
    const nextPageButton = paginationButtons[paginationButtons.length - 1]
    const nextPageText = await page.evaluate(el => el.textContent.trim(), nextPageButton)

    // Check if the last button's text is "Next"
    if (nextPageText !== 'Next') {
      console.log('No more pages, exiting...')
      lastPageReached = true
    } else {
      // Get the URL and click the "Next" button
      await nextPageButton.click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      // Scrape followings from the new page and spread the results into followings
      const { name, username } = await scrapeFollowing(page)
      following.push(...username)
    }
  }

  return following
}

const scrapeFollowing = async (page) => {
  try {
    await page.waitForSelector('.Layout-main')

    const name = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 a span.Link--primary', elements => elements.map(el => el.textContent))
    const username = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 a span.Link--secondary', elements => elements.map(el => el.textContent))

    return {
      name,
      username,
    }
  } catch (error) {
    console.error('Error extracting followers:', error)
    return null
  }
}