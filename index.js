import puppeteer from 'puppeteer'
import express from 'express'
import cors from 'cors'

import { getProfile, getFollowers, getFollowing } from './scraper/pivot.js'
import { comparatorArray } from './utils/comparatorArray.js'

// TODO: Add a check to see if the user exists on GitHub
// TODO: Improve post request validation
const app = express()
app.use(express.json())
app.use(cors())

app.post('/scrape', async (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ success: false, message: 'No username provided' })
  }

  try {
    const data = await scrape(username)
    res.status(200).json({success: true, data})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
})

const port = process.env.PORT || 2998
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

const scrape = async (username) => {
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

  const followback = comparatorArray(followers, following)

  return {
    profile,
    followback
  }
}