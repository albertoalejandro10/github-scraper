# GitHub Scraper API

![GitHub Scraper](https://img.shields.io/badge/Web_Scraper-Puppeteer-green?style=for-the-badge) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge) ![Express](https://img.shields.io/badge/Express.js-4.x-blue?style=for-the-badge) ![pnpm](https://img.shields.io/badge/pnpm-fast-red?style=for-the-badge)

A powerful GitHub profile scraper API built with **JavaScript**, **Express**, and **Puppeteer**. This API analyzes profiles, followers, and following to identify mutual connections, providing valuable insights into your GitHub network.

## Features

- **Profile Analysis**: Retrieves detailed information from GitHub profiles.
- **Followers & Following**: Fetches the list of followers and following for deeper connection analysis.
- **Mutual Connections**: Identifies mutual followers to help you understand the relationships in your network.

## Installation

Make sure you have [pnpm](https://pnpm.io/) installed.

1. Clone the repository:
   ```bash
    git clone https://github.com/albertoalejandro10/github-scraper.git
    cd github-scraper
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```makefile
   NODE_ENV=development
   PORT=2998
   PUPPETEER_HEADLESS=false
   ```
4. Start the API server:
   ```bash
   pnpm start
   ```

## API Usage

This project exposes a single POST endpoint to scrape GitHub profiles.

#### Endpoint

`POST /scrape`

- **URL**: `http://localhost:2998/scrape`
- **Body**:
  ```json
  {
    "username": "albertoalejandro10"
  }
  ```

## Tech Stack

- JavaScript: Core language
- Express: Web framework
- Puppeteer: Headless browser for scraping GitHub profiles
- pnpm: Efficient package manager

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

It would be great if you starred the project and share it with your github friends. Thank you.

## License

This project is licensed under the MIT License.
