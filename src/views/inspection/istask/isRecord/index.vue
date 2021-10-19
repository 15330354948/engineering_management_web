<template>
  <div class="isrecord-container">
    <subProInfo ref="subInfo"></subProInfo>
  </div>
</template>

<script>
  import subProInfo from '@/views/projects/project/subProInfo.vue'
  export default {
    name: 'isRecord',
    components: {
      subProInfo
    }
  }
</script>

<style lang="scss" scoped>
.isrecord-container {
  width: 100%;
  height: 100%;
}
</style>