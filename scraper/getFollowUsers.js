import { processData } from '../utils/processData.js'
import { scrape } from '../utils/scrape.js'

const maxPageProduction = 10
const nextButtonText = 'Next'
const paginationSelector = '.Layout-main .paginate-container .pagination a'

// Generalized function for both followers and following
export const getFollowUsers = async (page) => {
  let users = []
  let lastPageReached = false
  let currentPage = 1

  // Set max pages based on environment
  const maxPages = process.env.NODE_ENV === 'production' ? maxPageProduction : Infinity

  // Scrape users from the current page and spread the results into the users array
  users = await processData(await scrape(page), users)

  while (!lastPageReached && currentPage < maxPages) {
    // Select all pagination buttons
    const paginationButtons = await page.$$(paginationSelector)

    // If no pagination buttons exist, break out of the loop
    if (paginationButtons.length === 0) {
      lastPageReached = true
      break
    }

    // Get the last button (potentially "Next")
    const nextPageButton = paginationButtons[paginationButtons.length - 1]
    const nextPageText = await page.evaluate(el => el.textContent.trim(), nextPageButton)

    // Check if the last button's text is "Next"
    if (nextPageText !== nextButtonText) {
      lastPageReached = true
    } else {
      // Click the "Next" button and wait for the navigation
      await nextPageButton.click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      // Scrape users from the new page and add them to the array
      users = await processData(await scrape(page), users)

      currentPage++
    }
  }

  return users
}
