export const comparatorArray = (followers, following) => {
  const dontFollowYou = following.filter(following => followers.every(follower => follower.username !== following.username))
  const youDontFollow = followers.filter(follower => following.every(following => following.username !== follower.username))

  return {
    dontFollowYou,
    youDontFollow
  }
}