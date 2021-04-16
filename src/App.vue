<template>
  <v-app>
    <v-expansion-panels
      v-model="panel"
      class="mx-auto"
      style="max-width: 1000px"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <center>筛选</center>
        </v-expansion-panel-header>
        <v-expansion-panel-content eager>
          <v-divider></v-divider>
          <FilterGroup
            :selections="levels"
            group-name="地位"
            v-model="selectedLevels"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="races"
            group-name="种类"
            v-model="selectedRaces"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="attackTypes"
            group-name="攻击方式"
            v-model="selectedAttackTypes"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="damageTypes"
            group-name="伤害类型"
            v-model="selectedDamageTypes"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <center>四维筛选</center>
        </v-expansion-panel-header>
        <v-expansion-panel-content eager>
          <v-divider></v-divider>
          <FilterGroup
            :selections="dimensionRates"
            group-name="耐久"
            v-model="selectedEndure"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="dimensionRates"
            group-name="攻击力"
            v-model="selectedAttack"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="dimensionRates"
            group-name="防御力"
            v-model="selectedDefence"
          />
          <v-divider></v-divider>
          <FilterGroup
            :selections="dimensionRates"
            group-name="法术抗性"
            v-model="selectedResistance"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="d-flex flex-column">
      <v-text-field
        v-model="searchText"
        class="mt-4"
        :hide-details="true"
        placeholder="搜索敌人名称/描述/能力"
        outlined
      >
      </v-text-field>
      <v-row dense>
        <v-col class="col-10 col-md-11">
          <v-chip-group
            mandatory
            active-class="primary--text"
            v-model="selectedSortMethod"
            column
          >
            <v-chip
              v-for="(method, index) in sortMethods"
              :key="index"
              :value="method.method"
              label
            >
              {{ method.text }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col>
          <v-chip-group
            active-class="primary--text"
            v-model="simplifiedChipStatus"
            column
          >
            <v-chip class="ml-auto" key="0" label @click="changeSimplified">
              简
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <div v-if="!isSimplified">
        <div class="text-center">
          <v-chip-group
            mandatory
            active-class="primary--text"
            v-model="itemsPerPage"
            column
          >
            <v-chip
              v-for="(option, index) in itemsPerPageOption"
              :key="index"
              :value="option"
              label
            >
              {{ option == -1 ? '全部' : option }}
            </v-chip>
          </v-chip-group>
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
        <v-data-table
          mobile-breakpoint="0"
          :loading="isLoading"
          :headers="headers"
          :items="filteredData"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          class="elevation-1 my-2"
        >
          <template v-slot:item.icon="{ item }">
            <a :href="`/w/${item.enemyLink}`">
              <v-img
                max-height="100"
                max-width="100"
                :src="getImagePath(item.name)"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </a>
          </template>
          <template v-slot:item.name="{ item }">
            <a :href="`/w/${item.enemyLink}`" style="text-decoration: none">
              {{ item.name }}
            </a>
          </template>
          <template v-slot:item.ability="{ item }">
            <span v-html="item.ability"></span>
          </template>
        </v-data-table>
        <div class="text-center">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
          <v-chip-group
            mandatory
            active-class="primary--text"
            v-model="itemsPerPage"
            column
          >
            <v-chip
              v-for="(option, index) in itemsPerPageOption"
              :key="index"
              :value="option"
              label
            >
              {{ option == -1 ? '全部' : option }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
      <div v-if="isSimplified">
        <div class="text-center">
          <v-pagination
            v-model="currPage"
            :length="filteredDataSplited.length"
          ></v-pagination>
        </div>
        <v-card class="d-flex flex-wrap" flat tile>
          <a
            v-for="(item, index) in currPageData"
            :key="index"
            :href="`/w/${item.enemyLink}`"
          >
            <v-img
              max-height="65"
              max-width="65"
              :src="getImagePath(item.name)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </a>
        </v-card>
        <div class="text-center">
          <v-pagination
            v-model="currPage"
            :length="filteredDataSplited.length"
          ></v-pagination>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'

import FilterGroup from './components/FilterGroup'

import path from './utils/path'
import filter from './utils/filter'
import pagination from './utils/pagination'

export default {
  name: 'App',

  components: {
    FilterGroup,
  },

  methods: {
    changeSimplified() {
      this.isSimplified = !this.isSimplified
    },

    sortData(array, property, isDesc) {
      let temp = [...array]

      if (property == 'sortId') {
        temp.sort((a, b) => a[property] - b[property])
      } else {
        let order = ['?', ...this.dimensionRates].reverse()
        temp.sort((a, b) => a['sortId'] - b['sortId'])
        temp.sort((a, b) => {
          return order.indexOf(a[property]) - order.indexOf(b[property])
        })
      }
      return isDesc ? temp.reverse() : temp
    },

    getImagePath(filename) {
      return `${process.env.VUE_APP_ICON_BASE_URL}/${path.getPath(
        `头像_敌人_${filename}.png`
      )}`
    },

    searchFilter(item) {
      if (!this.searchText) {
        return true
      }

      return (
        filter.contains(item.name, this.searchText) ||
        filter.contains(item.ability, this.searchText)
      )
    },

    dataTableFilter(item) {
      return (
        filter.shouldFilter(
          this.selectedLevels,
          this.levels,
          item.enemyLevel
        ) &&
        filter.shouldFilter(this.selectedRaces, this.races, item.enemyRace) &&
        filter.shouldFilter(
          this.selectedAttackTypes,
          this.attackTypes,
          item.attackType
        ) &&
        filter.shouldFilter(
          this.selectedDamageTypes,
          this.damageTypes,
          item.damageType
        ) &&
        filter.shouldFilter(
          this.selectedAttack,
          this.dimensionRates,
          item.attack
        ) &&
        filter.shouldFilter(
          this.selectedEndure,
          this.dimensionRates,
          item.endure
        ) &&
        filter.shouldFilter(
          this.selectedDefence,
          this.dimensionRates,
          item.defence
        ) &&
        filter.shouldFilter(
          this.selectedResistance,
          this.dimensionRates,
          item.resistance
        )
      )
    },
  },

  created: function () {
    axios
      .get(process.env.VUE_APP_DATA_URL)
      .then((res) => {
        this.enemyData = res.data
        this.isLoading = false
        console.log(this.enemyData)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  mounted: function () {
    this.isSimplified = document.body.className.indexOf('skin-minerva') > -1
  },

  watch: {
    isSimplified() {
      this.simplifiedChipStatus = this.isSimplified ? 0 : null
    },

    filteredData() {
      this.currPage = 1
    },
  },

  computed: {
    currPageData() {
      return this.filteredDataSplited[this.currPage - 1]
    },

    filteredDataSplited() {
      return pagination.chunk(this.filteredData, 50)
    },

    filteredData() {
      let filtered = this.enemyData.filter(
        (enemy) => this.searchFilter(enemy) && this.dataTableFilter(enemy)
      )
      let isDesc = this.selectedSortMethod.indexOf('Desc') > -1
      let sortProperty = this.selectedSortMethod.replace('Desc', '')

      return this.selectedSortMethod
        ? this.sortData(filtered, sortProperty, isDesc)
        : filtered
    },

    headers() {
      return [
        {
          text: '头像',
          align: 'center',
          sortable: false,
          value: 'icon',
        },
        {
          text: '名称',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        {
          text: '地位',
          align: 'center',
          sortable: false,
          value: 'enemyLevel',
        },
        {
          text: '种类',
          align: 'center',
          sortable: false,
          value: 'enemyRace',
        },
        {
          text: '能力',
          align: 'center',
          sortable: false,
          value: 'ability',
        },
        {
          text: '攻击力',
          align: 'center',
          sortable: false,
          value: 'attack',
        },
        {
          text: '耐久',
          align: 'center',
          sortable: false,
          value: 'endure',
        },
        {
          text: '防御力',
          align: 'center',
          sortable: false,
          value: 'defence',
        },
        {
          text: '法术抗性',
          align: 'center',
          sortable: false,
          value: 'resistance',
        },
      ]
    },
  },

  data: () => ({
    simplifiedChipStatus: null,
    isSimplified: null,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    selectedSortMethod: 'sortId',
    currPage: 1,
    sortMethods: [
      {
        method: 'sortId',
        text: '游戏内顺序',
      },
      {
        method: 'sortIdDesc',
        text: '游戏内倒序',
      },
      {
        method: 'attack',
        text: '攻击力升序',
      },
      {
        method: 'attackDesc',
        text: '攻击力降序',
      },
      {
        method: 'endure',
        text: '耐久升序',
      },
      {
        method: 'endureDesc',
        text: '耐久降序',
      },
      {
        method: 'defence',
        text: '防御力升序',
      },
      {
        method: 'defenceDesc',
        text: '防御力降序',
      },
      {
        method: 'resistance',
        text: '法术抗性升序',
      },
      {
        method: 'resistanceDesc',
        text: '法术抗性降序',
      },
    ],
    itemsPerPageOption: [50, 100, 200, 500, -1],
    isLoading: true,
    searchText: '',
    enemyData: [],
    panel: [0],
    selectedLevels: [],
    selectedRaces: [],
    selectedAttackTypes: [],
    selectedDamageTypes: [],
    selectedEndure: [],
    selectedAttack: [],
    selectedDefence: [],
    selectedResistance: [],
    dimensionRates: [
      'S+',
      'S',
      'A+',
      'A',
      'B+',
      'B',
      'C+',
      'C',
      'D+',
      'D',
      '其他',
    ],
    levels: ['普通', '精英', '领袖'],
    races: ['感染生物', '无人机', '萨卡兹', '宿主', '其他'],
    attackTypes: ['近战', '远程', '不攻击'],
    damageTypes: ['物理', '法术', '治疗', '其他'],
  }),
}
</script>
