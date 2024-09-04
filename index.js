import puppeteer from 'puppeteer'

import { getProfile } from './getProfile.js'
import { getFollowers } from './getFollowers.js'
import { getFollowing } from './getFollowings.js'
import { comparatorArray } from './comparatorArray.js'

(async () => {
  const username = process.env.default_username
  console.log('Scraping GitHub profile for:', username)

  if (!username) {
    console.error('No default username found in .env file')
    process.exit(1)
  }

  const scrapePage = async (url, scraperFunction) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    try {
      await page.goto(url)
      await page.setViewport({ width: 1280, height: 720 })
      const data = await scraperFunction(page)
      return data
    } catch (error) {
      console.error(`Error scraping ${url}:`, error)
      process.exit(1)
    } finally {
      await page.close()
      await browser.close()
    }
  }

  const profile = await scrapePage(`https://github.com/${username}`, getProfile)
  const followers = await scrapePage(`https://github.com/${username}?tab=followers`, getFollowers)
  const following = await scrapePage(`https://github.com/${username}?tab=following`, getFollowing)

  // console.log('Profile:', profile)
  // console.log('Followers:', followers)
  // console.log('Following:', following)

  const followersDifference = comparatorArray(followers, following)
  console.log('Following who doesnt follow you: ', followersDifference)
})()
