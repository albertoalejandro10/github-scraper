// index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { validateUsernameExists, getProfile, getFollowers, getFollowing } from './scraper/pivot.js'
import { comparatorArray } from './utils/comparatorArray.js'
import { scrapePage } from './scraper/scrapePage.js'
import { closeBrowser } from './scraper/browser.js'

dotenv.config()

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

  const validationError = await scrapePage(`https://github.com/${username}`, validateUsernameExists)
  if (validationError) {
    return validationError
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
