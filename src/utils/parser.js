export default {
  /**
   * @param {String} HTML representing a single element
   * @return {Element}
   */
  htmlToElement(html) {
    var template = document.createElement('template')
    html = html.trim() // Never return a text node of whitespace as the result
    template.innerHTML = html
    return template.content.firstChild
  },

  /**
   * @param {String} HTML representing any number of sibling elements
   * @return {NodeList}
   */
  htmlToElements(html) {
    var template = document.createElement('template')
    template.innerHTML = html
    return template.content.childNodes
  },

  parseToSegment(text) {
    let children = this.parseToDOM(text).getElementsByTagName('body')[0]
      .childNodes
    return children
  },
}
