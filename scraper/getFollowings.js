import { processData } from '../utils/processData.js'
import { scrape } from '../utils/scrape.js'

const maxPageProduction = 10
const nextButtonText = 'Next'
const paginationSelector = '.Layout-main .paginate-container .pagination a'

export const getFollowing = async (page) => {
  // console.log('Extracting following...')

  let following = []
  let lastPageReached = false
  let currentPage = 1
  
  // Set max pages based on environment
  const maxPages = process.env.NODE_ENV === 'production' ? maxPageProduction : Infinity

  // Scrape followings from the current page and spread the results into followings
  following = await processData(await scrape(page), following)

  while (!lastPageReached && currentPage < maxPages) {
    // Select all pagination buttons
    const paginationButtons = await page.$$(paginationSelector)
    // The last button in the list is always the "Next" button
    const nextPageButton = paginationButtons[paginationButtons.length - 1]
    const nextPageText = await page.evaluate(el => el.textContent.trim(), nextPageButton)

    // Check if the last button's text is "Next"
    if (nextPageText !== nextButtonText) {
      // console.log('No more pages, exiting...')
      lastPageReached = true
    } else {
      // Get the URL and click the "Next" button
      await nextPageButton.click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      // Scrape followings from the new page and spread the results into following
      following = await processData(await scrape(page), following)
      
      currentPage++
    }
  }

  return following
}