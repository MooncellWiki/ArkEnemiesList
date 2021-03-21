<template>
  <v-row align="center" justify="center" class="mb-2" no-gutters>
    <v-col cols="1">
      {{ groupName }}
    </v-col>
    <v-btn class="mx-1" @click="all()">全选</v-btn>
    <v-btn class="mx-1" @click="none()">清除</v-btn>
    <v-col class="mx-2">
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
