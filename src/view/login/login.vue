<template>
  <div id="userLayout">
    <div class="login_panle">
      <div class="login_panle_right" />
      <div class="login_panle_form">
        <div class="login_panle_form_title">
          <img
            class="login_panle_form_title_logo"
            src="../../assets/images/logo-2.png"
            alt
          >
          <p class="login_panle_form_title_p">C社区管理</p>
        </div>
        <Form
          ref="loginForm"
          :model="loginFormData"
          :rules="rules"
        >
          <FormItem prop="userName">
            <Input
              v-model="loginFormData.userName"
              size="large"
              placeholder="请输入用户名"
            >
              <Icon slot="prepend" type="ios-person-outline" />
            </Input>
          </FormItem>
          <FormItem prop="passWord">
            <Input
              v-model="loginFormData.passWord"
              size="large"
              type="password"
              placeholder="请输入密码"
            >
              <Icon slot="prepend" type="ios-lock-outline" />
            </Input>
          </FormItem>
          <FormItem prop="captcha">
            <div class="vPicBox">
              <Input
                v-model="loginFormData.captcha"
                placeholder="请输入验证码"
                size="large"
                style="width: 60%"
              >
                <Icon slot="prepend" type="ios-apps-outline" />
              </Input>
              <div class="vPic" @click="refreshHandler" v-html="captchaHtml" />
            </div>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              size="large"
              style="width: 100%"
              @click="handleSubmit"
              @keyup.enter="handleSubmit"
            >登 录</Button
            >
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { getCaptcha } from '@/api/data'
export default {
  name: 'Login',
  data () {
    return {
      // 登录表单
      loginFormData: {
        userName: '',
        passWord: '',
        captcha: ''
      },
      captchaHtml: '',
      // 校验规则
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { type: 'email', message: '用户名格式不对，必须是邮箱', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度必须最少6位', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('app', ['uuid'])
  },
  mounted() {
    this.getCaptchRequest()
  },
  methods: {
    ...mapMutations('app', ['SET_UID']),
    // 获取验证码
    ...mapActions('user', ['handleLogin']),
    getCaptchRequest () {
      const uid = this.uuid || localStorage.getItem('uuid') || uuidv4()
      getCaptcha({
        uid
      }).then(res => {
        this.captchaHtml = res.data
        if (!localStorage.getItem('uuid')) {
          localStorage.setItem('uuid', uid)
          this.SET_UID(uid)
        }
      })
    },
    // 刷新验证码
    refreshHandler() {
      this.getCaptchRequest()
    },
    // 登录按钮事件
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.handleLogin({
            ...this.loginFormData,
            uid: this.uuid
          }).then((res) => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        } else {
          this.notifiyWarning('请输入好账号密码和验证码再进行登录！')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#userLayout {
  margin: 0;
  padding: 0;
  background-image: url("../../assets/images/login_background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  .input-icon {
    padding-right: 6px;
    padding-top: 4px;
  }
  .login_panle {
    position: absolute;
    top: 3vh;
    left: 2vw;
    width: 96vw;
    height: 94vh;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .login_panle_right {
      background-image: url("../../assets/images/login_left.svg");
      background-size: cover;
      width: 40%;
      height: 60%;
      float: right !important;
    }
    .login_panle_form {
      width: 420px;
      background-color: #fff;
      padding: 40px 40px 40px 40px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.2);
      .login_panle_form_title {
        display: flex;
        align-items: center;
        margin: 30px 0;
        .login_panle_form_title_logo {
          width: 90px;
          height: 72px;
        }
        .login_panle_form_title_p {
          font-size: 40px;
          padding-left: 20px;
        }
      }
      .vPicBox {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .vPic {
          width: 33%;
          height: 32px;
          ::v-deep {
            svg{
              width: 130px;
              position: relative;
              left: -15px;
              top: -12px;
            }
          }
        }
      }
    }
    .login_panle_foot {
      position: absolute;
      bottom: 20px;
      .links {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .link-icon {
          width: 30px;
          height: 30px;
        }
      }
      .copyright {
        color: #777777;
        margin-top: 5px;
      }
    }
  }
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 750px) {
  .login_panle_right {
    display: none;
  }
  .login_panle {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
  .login_panle_form {
    width: 100%;
  }
}
</style>
