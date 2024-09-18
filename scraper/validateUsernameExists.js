export const validateUsernameExists = async (page) => {
  try {
    // Check if the profile sidebar exists
    const sidebarExists = await page.$('.Layout-sidebar')
    
    if (!sidebarExists) {
      page.close()
      return {
        error: 'Username not found',
        profile: null,
        followers: [],
        following: []
      }
    }

    return null  // No error, proceed with scraping
  } catch (error) {
    console.error(`Error validating username ${username}:`, error)
    page.close()
    return {
      error: 'Failed to validate username',
      profile: null,
      followers: [],
      following: []
    }
  }
}