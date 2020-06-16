<!--

  @Description: 主入口
  @Author: Owen
  @Date: 2019-06-11 17:53
-->

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'

  @Component

  export default class App extends Vue {
    beforeDestroy() {
      (window.$request as any) = null;
      (window.$filterData as any) = null;
      (window.$checkRequired as any) = null;
      (window.$imageStabilization as any) = null
      window.token = null
      window.$message = null
      window.$loading = null
      window.$confirm = null
    }
  }
</script>

<style lang="scss">
  @import './assets/css/main';

  #app {
    min-width: 1280px;
  }
</style>
