<template>
  <el-row class="tac fix">
    <el-col>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#fff"
        text-color="#666"
        active-text-color="#409eff">
        <el-menu-item index="1" @click="bindClick({href: 'index'})">
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu v-for="(ele, i) in menu" :key="i" :index="i+3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{ele.name}}</span>
          </template>
          <el-menu-item-group v-for="(ite, ind) in ele.list" :key="ind">
            <el-menu-item :index="(i+3)+'-'+(ind+1)" @click="bindClick(ite)">{{ite.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";

  @Component
  export default class Menu extends Vue {

    @Prop({ default: "default value" }) menu!: any;

    private handleOpen(key: any, keyPath: any) {
      // console.log(key, keyPath);
    }

    private handleClose(key: any, keyPath: any) {
      // console.log(key, keyPath);
    }

    private bindClick(e: any) {
      this.$emit('setUrl', e)
    }
  }
</script>

<style lang="scss" scoped>
  .fix {
    height: 100%;
    position: fixed;
    top: 62px;
    bottom: 0;
    left: 0;
    z-index: 998;
    width: 200px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  /deep/.el-menu-item-group__title {
    padding: 0;
  }
  /deep/.el-menu {
    border: 0;
  }
</style>
