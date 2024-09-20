export const processData = async (data, type) => {
  const { avatar, name, username } = data
  const size = username.length
  for (let i = 0; i < size; i++) {
    type.push({
      avatar: avatar[i],
      name: name[i],
      username: username[i],
    })
  }
  return type
}