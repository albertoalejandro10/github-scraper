import puppeteer from 'puppeteer'
import express from 'express'
import cors from 'cors'
import dotevn from 'dotenv'

import { checkUsername, getProfile, getFollowers, getFollowing } from './scraper/pivot.js'
import { comparatorArray } from './utils/comparatorArray.js'

dotevn.config()

// Global broswer variable
let browser = null

// App setup
const app = express()
app.use(express.json())
app.use(cors())

// POST request handler
app.post('/scrape', async (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ success: false, message: 'No username provided' })
  }

  try {
    const data = await scrape(username)
    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error(`Error in /scrape route for ${username}:`, error)
    res.status(500).json({ success: false, message: error.message })
  }
})

const port = process.env.PORT || 2998
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// Scraper function
const scrape = async (username) => {
  console.log('Scraping GitHub profile for:', username)

  // usernameExists its a Boolean value that indicates if the username exists on GitHub
  const usernameExists = await scrapePage(`https://github.com/search?q=${username}&type=users`, checkUsername)
  
  if (!usernameExists) {
    console.log('Username not found')
    return {
      error: 'Username not found',
      profile: null,
      followers: [],
      following: []
    }
  }

  const profile = await scrapePage(`https://github.com/${username}`, getProfile)
  const followers = await scrapePage(`https://github.com/${username}?tab=followers`, getFollowers)
  const following = await scrapePage(`https://github.com/${username}?tab=following`, getFollowing)

  await closeBrowser()

  const followback = comparatorArray(followers, following)

  return {
    profile,
    followback
  }
}

const scrapePage = async (url, scraperFunction) => {
  await initBrowser()
  const page = await browser.newPage()

  try {
    await page.goto(url)
    await page.setViewport({ width: 1280, height: 720 })
    const data = await scraperFunction(page)
    return data

  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return { error: `Failed to scrape ${url}` }
    
  } finally {
    await page.close()
  }
}

const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_HEADLESS === 'true',
      args: process.env.NODE_ENV === 'production' ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    })
  }
}

const closeBrowser = async () => {
  if (browser) {
    await browser.close()
    browser = null
  }
}