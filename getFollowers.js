import { getArrayTextContent } from './getTextContent.js'

import { ConsoleMessage } from 'puppeteer'

export const getFollowers = async (page) => {
  console.log('Extracting followers...')

  const followers = []
  let lastPageReached = false

  // Scrape followers from the current page and spread the results into followers
  const { name, username, bio, organization, location } = await scrapeFollowers(page)
  followers.push(...username)

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

      // Scrape followers from the new page and spread the results into followers
      const { name, username, bio, organization, location } = await scrapeFollowers(page)
      followers.push(...username)
    }
  }

  return followers
}

const scrapeFollowers = async (page) => {
  try {
    await page.waitForSelector('.Layout-main')

    const name = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 a span.Link--primary', elements => elements.map(el => el.textContent))
    const username = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 a span.Link--secondary', elements => elements.map(el => el.textContent))
    const bio = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > .color-fg-muted.text-small.mb-2 div', elements => elements.map(el => el.textContent.trim()))
    // TODO: Improve this function to set 'Organization not found' if the element is empty
    // const organization = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > p > span.mr-3', elements => elements.length !== 0 ? elements.map(el => el.textContent.trim()) : 'Organization not found')

    const location = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > p', elements => {
      return elements.map(el => {
        const textNodes = [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE)
        return textNodes.length >= 3 ? textNodes[2].textContent.trim() : 'Location not found'
      })
    })

    return {
      name,
      username,
      bio,
      // organization,
      location,
    }
  } catch (error) {
    console.error('Error extracting followers:', error)
    return null
  }
}