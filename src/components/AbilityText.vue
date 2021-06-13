<template>
  <span>
    <span v-for="(message, index) in messages" :key="index">
      <span v-if="message.type == '#text'">{{ message.data }}</span>
      <v-tooltip v-if="message.type != '#text'" top>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            style="text-decoration: underline #222"
            >{{ message.data.children[0].innerText }}</span
          >
        </template>
        <span v-bind="attrs" v-on="on">{{
          message.data.children[1].innerText
        }}</span>
      </v-tooltip>
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
  },
}
</script>
