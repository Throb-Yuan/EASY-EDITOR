<template>
  <div class="page page-login">
    <div class="login-page-inner">
      <div class="title" style="display: flex;align-items: center;justify-content: center;">
        <img src="../common/images/minilogo.png" style="width: 32px;" alt="">
        <p class="" style="margin-left: 12px;">信息发布系统</p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" name="userName" placeholder="请输入用户名" @keyup.enter.native="doLogin">
            <i slot="prefix" class="iconfont icon-zhanghao"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="email" v-if="type === 'register'">
          <el-input v-model="loginForm.email" autocomplete="off" placeholder="请输入邮箱" @keyup.enter.native="doLogin">
            <span slot="prefix" class="iconfont icon-mail-copy"></span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" name="password" placeholder="请输入密码" :type="inputType"
            @keyup.enter.native="doLogin" v-if="inputType === 'password'">
            <i slot="prefix" class="iconfont icon-mima"></i>
            <span slot="suffix" class="cursor-pointer" @mousedown="mousedownPassword">
              <i class="iconfont icon-yincangmima"></i>
            </span>
          </el-input>
          <el-input v-model="loginForm.password" name="password" placeholder="请输入密码" :type="inputType"
            @keyup.enter.native="doLogin" v-else>
            <i slot="prefix" class="iconfont icon-mima"></i>
            <span slot="suffix" class="cursor-pointer" @mousedown="mousedownText">
              <i class="iconfont icon-xianshimima"></i>
            </span>
          </el-input>
        </el-form-item>

        <el-form-item>
          <JcRange ref="jcRange" :success-fun="jcRangeSuccess" :error-fun="jcRangeErr"></JcRange>
        </el-form-item>
        <!-- <el-form-item>
          
          <div class="btn-hover" @click="doSubmit">{{type === 'login' ? '登录' : '注册'}}</div>
        </el-form-item> -->
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" :disabled="disabledStatus"
            @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="switch-do-type marginB20">
        <p class="">
          <i class="iconfont icon-iconfontzhizuobiaozhun47"></i>
          <span>{{ type === 'login' ? '立即注册' : '马上登录' }}</span>
        </p>
      </div> -->
      <p class="login-page-bottom">Copyright © 2022 <span class="primary">慧集互联版权所有</span></p>
    </div>
    <div class="login-background">
      <loginBackground />
    </div>
  </div>
</template>

<script>
import userModel from '@/libs/userModel'
import JcRange from '@/components/login-background/JcRange'
import RSA from '@/common/js/RSA'
import { encrypt, decrypt } from '@/common/js/jsencrypt'
import Cookies from "js-cookie";
import loginBackground from '@/components/login-background/index'
export default {
  name: "Login",
  data() {
    return {
      fromUrl:"",
      jcRangeOption: null,
      disabledStatus: true,
      codeUrl: "",
      inputType: 'password',
      type: 'login',
      title: process.env.VUE_APP_TITLE,
      loginForm: {
        username: "admin",
        password: "12345678",
        rememberMe: false,
        grant_type: 'password',
        scope: 'server',
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        uuid: ""
      },
      inputActive: '',
      passwordType: 'password',
      resetCode: true,
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ]
      },
      loading: false,
      redirect: undefined,
    };
  },
  components: {
    JcRange,
    loginBackground,
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
    // 进入登录页面先清空个人信息
    this.fromUrl = this.$route.query.from ? window.decodeURIComponent(this.$route.query.from) : ''
  },
  methods: {
    jcRangeSuccess() {
      this.disabledStatus = false
    },
    jcRangeErr() {
      this.disabledStatus = true
    },
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
          const {username, password, grant_type, scope, client_id, client_secret} = this.loginForm
          userModel.doLogin({
            username: username.trim(),
          password: RSA(password),
          grant_type,
          scope,
          client_id,
          client_secret: RSA(client_secret)
          }).then(() => {
            
            this.loading = false
            this.$modal.msgSuccess("登录成功");
            if (this.fromUrl) {
              this.$router.push(this.fromUrl)
            } else {
              userModel.goBeforeLoginUrl()
            }
          })

          // this.$API.newLogin({
          //   username: username.trim(),
          // password: RSA(password),
          // grant_type,
          // scope,
          // client_id,
          // client_secret: RSA(client_secret)
          // }).then(response => {
          //   if(response.code==200) this.$modal.msgSuccess("登录成功");
          //   this.loading = false
          //     // this.open = false;
          //     // this.getList();
          //   });

          // this.$store.dispatch("Login", this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || "/" }).catch(() => { });
          // }).catch(() => {
          //   this.loading = false;
          //   this.disabledStatus = true;
          //   Object.assign(this.$refs.jcRange.$data, this.$refs.jcRange.$options.data())
          // });
        }
      });
    },
    switchType() {
      if (this.type === 'login') {
        this.type = 'register'
      } else {
        this.type = 'login'
      }
    },
    mousedownPassword() {
      this.inputType = 'text'
    },
    mousedownText() {
      this.inputType = 'password'
    },
    mouseup() {
      this.inputType = 'password'
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
