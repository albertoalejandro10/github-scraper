import { getArrayTextContent, getTextContent } from '../utils/getTextContent.js'

export const getProfile = async (page) => {
  try {
    await page.waitForSelector('.Layout-sidebar')

    return {
      name: await getTextContent(page, '.vcard-fullname') || 'Name not available',
      username: await getTextContent(page, '.vcard-username') || 'Username not available',
      bio: await getTextContent(page, '.user-profile-bio') || 'Bio not available',
      avatar: await getAvatarUrl(page),

      followers: await getTextContent(page, '.js-profile-editable-area a:nth-child(1)', el => el.textContent.trim().replace(/[^0-9]/g, '')) || '0',
      following: await getTextContent(page, '.js-profile-editable-area a:nth-child(2)', el => el.textContent.trim().replace(/[^0-9]/g, '')) || '0',

      location: await getTextContent(page, '.vcard-details > li.vcard-detail[itemprop="homeLocation"] > span') || 'Location not available',
      website: await getTextContent(page, '.vcard-details > li.vcard-detail[itemprop="url"] > a') || 'Website not available',
      networks: await getArrayTextContent(page, '.vcard-details > li.vcard-detail[itemprop="social"] > a', elements => elements.map(el => el.href)) || ['No social networks'],
      badges: await getBadges(page),
    }
  } catch (error) {
    console.error('Error extracting user profile:', error)
    return null
  }
}

const getAvatarUrl = async (page) => {
  try {
    const src = await getTextContent(page, '.js-profile-editable-replace img', el => el.src)
    return src ? src.replace('https://avatars.githubusercontent.com/u/', '') : 'Avatar not found'
  } catch (error) {
    console.error('Error extracting avatar URL:', error)
    return 'Avatar not available'
  }
}

const getBadges = async (page) => {
  try {
    const badges = await getArrayTextContent(page, '.js-profile-editable-replace .border-top.color-border-muted.pt-3.mt-3.d-none.d-md-block .d-flex.flex-wrap > a > img', elements => elements.map(el => el.src.replace('https://github.githubassets.com/assets/', '')))
    return badges.length ? badges : ['No badges']
  } catch (error) {
    console.error('Error extracting badges:', error)
    return ['No badges']
  }
}