<template>
  <v-row align="center" no-gutters>
    <v-col cols="2">
      {{ groupName }}
    </v-col>
    <div
      :class="{
        'd-flex align-center flex-column': isMobile,
      }"
    >
      <v-btn class="mx-1 my-1" @click="all()">全选</v-btn>
      <v-btn class="mx-1 my-1" @click="none()">清除</v-btn>
    </div>
    <v-col class="mx-2" md="auto">
      <v-chip-group
        active-class="primary--text"
        v-model="selectedTags"
        v-on:change="notifyFilterChange()"
        column
        multiple
      >
        <v-chip
          v-for="(selection, index) in selections"
          :key="index"
          :value="selection"
          label
          >{{ selection }}</v-chip
        >
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FilterGroup',

  model: {
    prop: 'selectedTags',
    event: 'change',
  },

  props: {
    selections: {
      type: Array,
      required: true,
    },
    groupName: String,
  },

  data() {
    return {
      isMobile: document.body.className.indexOf('skin-minerva') > -1,
      selectedTags: [],
    }
  },

  methods: {
    notifyFilterChange() {
      this.$emit('change', this.selectedTags)
    },
    all() {
      this.selectedTags = [...this.selections]
      this.$emit('change', this.selectedTags)
    },
    none() {
      this.selectedTags = []
      this.$emit('change', this.selectedTags)
    },
  },
}
</script>
