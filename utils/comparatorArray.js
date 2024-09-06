export const comparatorArray = (followers, following) => {
  return following.filter(following => followers.every(follower => follower.username !== following.username))
}