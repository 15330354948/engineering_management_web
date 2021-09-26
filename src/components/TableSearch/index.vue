<template>
  <div class="tablesearch-container">
    <el-button @click="handleClick(item.type)" v-for="item in searchList" size="medium" :key="item.type" :type="item.isPrimary?'primary':''">{{item.label}}</el-button>
  </div>
</template>

<script>
  export default {
    name: 'TableSearch',
    props: {
      // 区分每个页面
      pageSign: String
    },
    data() {
      return {
        searchList: [
          {
            label: '搜索',
            type: 'Search',
            isPrimary: true
          },
          {
            label: '重置',
            type: 'Reset'
          },
          {
            label: '创建',
            type: 'Create',
            isPrimary: true
          },
          {
            label: '导出',
            type: 'Export',
            isPrimary: true
          },
          {
            label: '删除选中',
            type: 'Delete',
            isPrimary: true
          }
        ]
      }
    },
    methods: {
      handleClick(type) {
        this.$bus.$emit(this.pageSign+`${type}Click`)
      }
    }
  }
</script>

<style lang="scss" scoped>
.tablesearch-container {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>