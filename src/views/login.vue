<template>
  <div class="login">
    <div class="title">自动化监测项目工程管理系统</div>
    <div class="main" >
      <img src="@/assets/image/leftBackground.png" alt="" class="img2">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <img v-if="isShow" @click="handleCode" class="appCode" src="@/assets/image/appCode.png" />
        <h2 class="title">欢迎登录</h2>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off"   @focus="isUsername=true"
                    @blur="isUsername=false" placeholder="用户名">
            <svg-icon slot="prefix" icon-class="user" v-bind:class="{'color-class':isUsername}" class=" input-icon " />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @focus="isPassword=true"
            @blur="isPassword=false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" v-bind:class="{'color-class':isPassword}" class="el-input__icon input-icon " />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            @focus="isValidCode=true"
            @blur="isValidCode=false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" v-bind:class="{'color-class':isValidCode}" class="el-input__icon input-icon "  />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;background:#09AAE9;border-color:#09AAE9;height:44px"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="codeBox" v-if="!isShow">
        <img class="closeBtn" @click="handleClose" src="@/assets/image/close.png" />
        <img class="codeImg" src="@/assets/image/download.png" />
      </div>
    </div>
  </div>
</template>

<script>
  import { getCodeImg } from "@/api/login";
  import Cookies from "js-cookie";
  import { encrypt, decrypt } from '@/utils/jsencrypt'

  export default {
    name: "Login",
    data() {
      return {
        isUsername:false,
        isPassword:false,
        isValidCode:false,
        codeUrl: "",
        cookiePassword: "",
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: ""
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "用户名不能为空" }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" }
          ],
          code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
        },
        loading: false,
        redirect: undefined,
        isShow: true,
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    created() {
      this.getCode();
      this.getCookie();
    },
    methods: {
      // 二维码
      handleCode(){
        this.isShow=false;
      },
      // 关闭
      handleClose(){
        this.isShow=true;
      },
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        });
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set("username", this.loginForm.username, { expires: 30 });
              Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
              Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
            } else {
              Cookies.remove("username");
              Cookies.remove("password");
              Cookies.remove('rememberMe');
            }
            this.$store
              .dispatch("Login", this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || "/" });
              })
              .catch(() => {
                this.loading = false;
                this.getCode();
              });
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: url('../assets/image/background.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    >.title{
      width: 100%;
      position: absolute;
      left: 0;
      top: 18vh;
      font-size: 40px;
      color: #09AAE9;
      text-align: center;
    }
  }

  .main{
    position: relative;
    width: 1000px;
    height: 452px;
    color:rgba(255,255,255,1);
    .img1{
      position:absolute;
      top: 46px;
      left: 53px;
      width: 110px;
    }
    .img2{
      position:absolute;
      top: 0;
      left: 0;
      width: 600px;
      height: 452px;
    }
    h3{
      margin-left: 52px;
      margin-top: 383px;
      margin-bottom: 0;
      font-size:32px;

    }
    h4{
      margin-left: 52px;
      font-size:24px;
      margin-top: 16px;
    }
    .login-form {
      position:absolute;
      right: 0;
      top: 0;
      background: #ffffff;
      width: 400px;
      height: 452px;
      padding: 58px 33px 33px 33px;
      .appCode{
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
      .title {
        font-size:32px;
        margin: 0px auto 62px auto;
        text-align: center;
        color: #09AAE9;
      }
      .el-input {
        height: 32px;
        input:focus  {
          color:rgba(6,104,185,1);
        }

        input {
          outline:none;
          height: 38px;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-radius:0;
        }

      }
      .color-class{
        color:rgba(6,104,185,1);
      }
      .input-icon {
        height: 39px;
        width: 19px;
        margin-left: 2px;
      }
    }
  }




  .login-code {
    position:absolute;
    width: 88px;
    height: 32px;
    right: 0;
    bottom: 8px;
    img {
      width: 88px;
      height: 32px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .codeBox{
    position: absolute;
    right: 0;
    top: 0;
    width: 400px;
    height: 452px;
    background: rgba(255,255,255,.8);
    display: flex;
    justify-content: center;
    align-items: center;
    .closeBtn{
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  }

</style>
