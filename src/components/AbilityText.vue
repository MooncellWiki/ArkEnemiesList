<template>
  <span>
    <span v-for="(message, index) in messages" :key="index">
      <span v-if="message.type === '#text'">{{ message.data }}</span>
      <span
        v-if="
          message.type === 'SPAN' &&
          message.data.classList.indexOf('mc-tooltips') === -1
        "
        >{{ message.data }}</span
      >
      <div
        v-if="
          message.type === 'SPAN' &&
          message.data.classList.indexOf('mc-tooltips') !== -1
        "
        class="tooltip"
      >
        {{ message.data.children[0].innerText }}
        <span class="tooltiptext">{{
          message.data.children[1].innerText
        }}</span>
      </div>
    </span>
  </span>
</template>

<script>
import parser from '../utils/parser'

export default {
  name: 'AbilityText',

  props: ['text'],

  data: () => ({
    segments: null,
    messages: [],
  }),

  beforeMount() {
    this.segments = parser.htmlToElements(this.text)
    this.segments.forEach((item) => {
      this.messages.push({
        type: item.nodeName,
        data: item.nodeName == '#text' ? item.data : item,
      })
    })
    console.log(this.messages)
  },
}
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 240px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -120px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
