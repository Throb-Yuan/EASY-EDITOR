<template>
  <div class="page page-login">
    <div class="login-page-inner">
      <div class="title" style="display: flex;align-items: center;justify-content: center;padding-bottom: 16px;">
        <img src="../common/images/logg.svg" style="width: 140px;" alt="">
        <!-- <p class="" style="margin-left: 12px;">数智云屏</p> -->
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" name="userName" type="test" placeholder="请输入用户名" @keyup.enter.native="doLogin">
            <i slot="prefix" class="iconfont icon-zhanghao"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" name="password" placeholder="请输入密码" type="password">
            <i slot="prefix" class="iconfont icon-mima"></i>
            <span slot="suffix" class="cursor-pointer">
              <i class="iconfont icon-yincangmima"></i>
            </span>
          </el-input>
        </el-form-item>

        <el-form-item>
          <JcRange ref="jcRange" :success-fun="jcRangeSuccess" :error-fun="jcRangeErr"></JcRange>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" :disabled="disabledStatus"
            @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <p class="login-page-bottom">Copyright © 2023 <span class="primary">数智云屏版权所有</span></p>
    </div>
    <div class="login-background">
      <loginBackground />
    </div>
  </div>
</template>

<script>
import userModel from '@/libs/userModel'
import JcRange from '@/components/login-background/JcRange'//人机验证
import RSA from '@/common/js/RSA'
import { encrypt, decrypt } from '@/common/js/jsencrypt'
import Cookies from "js-cookie";
import loginBackground from '@/components/login-background/index'//背景离子效果
export default {
  name: "Login",
  data() {
    return {
      disabledStatus: true,
      type: 'login',
      title: process.env.VUE_APP_TITLE,
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        grant_type: 'password',
        scope: 'server',
        client_id: window.ipConfig.clientId,
        client_secret: window.ipConfig.clientSecret,
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ]
      },
      loading: false,
    };
  },
  components: {
    JcRange,
    loginBackground,
  },
  created() {
    this.getCookie();
  },
  methods: {
    /**
     *人机验证函数
     */
    jcRangeSuccess() {
      this.disabledStatus = false
    },
    jcRangeErr() {
      this.disabledStatus = true
    },
    /**
     *获取上一次登录表单数据 赋值
     */
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      if (username !== undefined) {
        this.loginForm.username = username
      }
      if (password !== undefined) {
        this.loginForm.password = decrypt(password)
      }
      if (rememberMe !== undefined) {
        this.loginForm.rememberMe = Boolean(rememberMe)
      }
    },
    /**
     * 登录账号，验证表单，设置cookies
     */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const {username, password, grant_type, scope, client_id, client_secret} = this.loginForm
          userModel.doLogin({
            username: username.trim(),
          password: RSA(password),
          grant_type,
          scope,
          client_id,
          client_secret: RSA(client_secret)
          }).then(() => {
            if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
            this.loading = false
            this.$modal.msgSuccess("登录成功");
            userModel.goBeforeLoginUrl()
          }).catch(err=>{
            this.loading = false;
            this.disabledStatus = true;
            Object.assign(this.$refs.jcRange.$data,this.$refs.jcRange.$options.data())
          })
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.page-login {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fbfbfb;

}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}

.page-login {
  height: 100%;
  width: 100%;
  padding: 1px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.login-page-inner {
  position: relative;
  z-index: 10;
  width: 420px;
  padding: 20px 40px;
  margin-top: -120px;
  background: white;
  box-shadow: 0px 0px 0px rgba(58, 127, 158, 0.35);
  border-radius: 4px;
  background: white;
  box-shadow: 1px 1px 10px 10px #dedede;

  .title {
    padding: 10px 0 30px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: $primary;
  }

  /**
    鼠标悬浮渐变
    */
  .btn-hover {
    margin-top: 20px;
    text-align: center;
    color: white;
    background: $color-gradient;
    transition: all 3s;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-page-bottom {
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  .forgot-password {
    text-align: right;
    font-size: 12px;
    margin-bottom: 20px;
    cursor: pointer;
    color: #333;
  }
}

.switch-do-type {
  font-size: 14px;
  text-underline: #000;
  text-align: right;
  color: #333;
  cursor: pointer;

  p {
    display: inline-block;
  }

  i {
    font-size: 16px;
    font-weight: 600;
  }

  &:hover {
    color: #000;
  }
}
</style>
