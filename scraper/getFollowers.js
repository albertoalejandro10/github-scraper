import { getArrayTextContent } from '../utils/getTextContent.js'

export const getFollowers = async (page) => {
  // console.log('Extracting followers...')
  
  let followers = []
  let lastPageReached = false
  let currentPage = 1
  const maxPages = 10

  // Scrape followers from the current page and spread the results into followers
  followers = await processScrapedData(await scrapeFollowers(page), followers)

  while (!lastPageReached && currentPage < maxPages) {
    // Select all pagination buttons
    const paginationButtons = await page.$$('.Layout-main .paginate-container .pagination a')
    // The last button in the list is always the "Next" button
    const nextPageButton = paginationButtons[paginationButtons.length - 1]
    const nextPageText = await page.evaluate(el => el.textContent.trim(), nextPageButton)

    // Check if the last button's text is "Next"
    if (nextPageText !== 'Next') {
      // console.log('No more pages, exiting...')
      lastPageReached = true
    } else {
      // Get the URL and click the "Next" button
      await nextPageButton.click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      followers = await processScrapedData(await scrapeFollowers(page), followers)

      currentPage++
    }
  }

  return followers
}

const scrapeFollowers = async (page) => {
  try {
    await page.waitForSelector('.Layout-main')

    const avatar = await getArrayTextContent(
      page, 
      '.Layout-main .d-table-cell.col-2.col-lg-1.v-align-top > a[data-hovercard-type] > img', 
      elements => elements.map(el => el.src.replace('https://avatars.githubusercontent.com/u/', '')), 
      'Avatar not found'
    )

    const name = await getArrayTextContent(
      page, 
      '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--primary', 
      elements => elements.map(el => el.textContent.trim()), 
      'Name not found'
    )

    const username = await getArrayTextContent(
      page, 
      '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--secondary', 
      elements => elements.map(el => el.textContent.trim()), 
      'Username not found'
    )

    return {
      avatar,
      name,
      username,
    }
  } catch (error) {
    console.error('Error extracting followers:', error)
    return null
  }
}

const processScrapedData = async (data, type) => {
  const { avatar, name, username } = data
  const size = username.length
  for (let i = 0; i < size; i++) {
    type.push({
      avatar: avatar[i],
      name: name[i],
      username: username[i],
    })
  }
  return type
}