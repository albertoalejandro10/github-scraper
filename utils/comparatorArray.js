export const comparatorArray = (followers, following) => {
  const whoDontFollowYouBack = following.filter(following => followers.every(follower => follower.username !== following.username))
  const whoYouDontFollowBack = followers.filter(follower => following.every(following => following.username !== follower.username))

  return {
    whoDontFollowYouBack,
    whoYouDontFollowBack
  }
}