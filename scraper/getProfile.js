import { getArrayTextContent, getTextContent } from '../utils/getTextContent.js'

export const getProfile = async (page) => {
  try {
    await page.waitForSelector('.Layout-sidebar')

    return {
      name: await getTextContent(page, '.vcard-fullname'),
      username: await getTextContent(page, '.vcard-username'),
      bio: await getTextContent(page, '.user-profile-bio'),
      avatarUrl: await getAvatarUrl(page),

      followers: await getTextContent(page, '.js-profile-editable-area a:nth-child(1)', el => el.textContent.trim().replace(/[^0-9]/g, '')),
      following: await getTextContent(page, '.js-profile-editable-area a:nth-child(2)', el => el.textContent.trim().replace(/[^0-9]/g, '')),

      location: await getTextContent(page, '.vcard-details > li.vcard-detail[itemprop="homeLocation"] > span'),
      website: await getTextContent(page, '.vcard-details > li.vcard-detail[itemprop="url"] > a'),
      socialNetworks: await getArrayTextContent(page, '.vcard-details > li.vcard-detail[itemprop="social"] > a', elements => elements.map(el => el.href)),
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
    return src.replace('https://avatars.githubusercontent.com/u/', '')
  } catch (error) {
    console.error('Error extracting avatar URL:', error)
    return null
  }
}

const getBadges = async (page) => {
  try {
    const badges = await getArrayTextContent(page, '.js-profile-editable-replace .border-top.color-border-muted.pt-3.mt-3.d-none.d-md-block .d-flex.flex-wrap > a > img', elements => elements.map(el => el.src.replace('https://github.githubassets.com/assets/', '')))
    return badges
  } catch (error) {
    console.error('Error extracting badges:', error)
    return null
  }
}