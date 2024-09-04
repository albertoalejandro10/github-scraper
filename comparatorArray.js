export const comparatorArray = (followers, following) => {
  return following.filter(username => !followers.includes(username))
}