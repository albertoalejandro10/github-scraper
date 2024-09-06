import { getArrayTextContent } from '../utils/getTextContent.js'

export const getFollowers = async (page) => {
  console.log('Extracting followers...')

  let followers = []
  let lastPageReached = false

  // Scrape followers from the current page and spread the results into followers
  followers = await processScrapedData(await scrapeFollowers(page), followers)

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

      followers = await processScrapedData(await scrapeFollowers(page), followers)
    }
  }

  return followers
}

const scrapeFollowers = async (page) => {
  try {
    await page.waitForSelector('.Layout-main')

    const avatar = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-2.col-lg-1.v-align-top > a[data-hovercard-type] > img', elements => elements.map(el => el.src.replace('https://avatars.githubusercontent.com/u/', '')))
    const name = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--primary', elements => elements.map(el => el.textContent))
    const username = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > a > span.Link--secondary', elements => elements.map(el => el.textContent))

    // TODO: Improve this function to set 'Bio not found' if the element is empty
    // const bio = await getBioTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > .color-fg-muted.text-small.mb-2 div')

    // TODO: Improve this function to set 'Organization not found' if the element is empty
    // const organization = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > p > span.mr-3', elements => elements.length !== 0 ? elements.map(el => el.textContent.trim()) : 'Organization not found')

    // TODO: Improve this function to set 'Location not found' if the element is empty
    // const location = await getArrayTextContent(page, '.Layout-main .d-table-cell.col-9.v-align-top.pr-3 > p', elements => {
    //   return elements.map(el => {
    //     const textNodes = [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE)
    //     return textNodes.length >= 3 ? textNodes[2].textContent.trim() : 'Location not found'
    //   })
    // })

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