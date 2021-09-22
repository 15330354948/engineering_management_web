<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="app-title">
      <logo :collapse="isCollapse"></logo>
      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <i class="el-icon-user" />{{name}}
            <i class="el-icon-arrow-down" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click.native="setting = true">
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="el-icon-menu" @click="changePlatform" title="切换平台"></i>
      </div>
    </div>
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'
import Logo from './components/Sidebar/Logo.vue'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Logo
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'name',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      })
    },
    changePlatform(){

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    .app-title{
      position: absolute;
      top: 0;
      width: 100%;
      height: 60px;
      background: #507ee5;
      display: flex;
      justify-content: space-between;

      .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        >i{
          display: block;
          color: #fff;
          margin-right: 20px;
          cursor: pointer;
        }
        &:focus {
          outline: none;
        }

        .right-menu-item {
          display: inline-block;
          padding: 0 8px;
          height: 100%;
          font-size: 18px;
          color: #5a5e66;
          vertical-align: text-bottom;

          &.hover-effect {
            cursor: pointer;
            transition: background .3s;

            &:hover {
              background: rgba(0, 0, 0, .025)
            }
          }
        }
        .avatar-container {
          margin-right: 10px;

          .avatar-wrapper {
            margin-top: 5px;
            color: #fff;
            position: relative;
            i{
              margin-right: 5px;
            }

            .user-avatar {
              cursor: pointer;
              width: 40px;
              height: 40px;
              border-radius: 10px;
            }

            .el-icon-caret-bottom {
              cursor: pointer;
              position: absolute;
              right: -20px;
              top: 25px;
              font-size: 12px;
            }
          }
        }
      }
    }

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
