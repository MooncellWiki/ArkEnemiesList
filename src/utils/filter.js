export default {
  isEmptyOrAll(selected, all) {
    return selected.length == 0 || selected.length == all.length
  },

  contains(prop, str) {
    if (prop === null || prop === undefined) {
      return false
    } else {
      return prop.indexOf(str) > -1
    }
  },

  shouldFilter(selected, all, property) {
    if (this.isEmptyOrAll(selected, all)) {
      return true
    }

    if (!this.contains(all, property)) {
      return this.contains(selected, '其他')
    }

    return this.contains(selected, property)
  },
}
