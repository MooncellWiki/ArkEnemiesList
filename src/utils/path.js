import MD5 from 'md5'

export default {
  getPath(filename) {
    let md5 = MD5(filename)
    let result = md5.slice(0, 1) + '/' + md5.slice(0, 2) + '/' + filename
    return result
  },
}
