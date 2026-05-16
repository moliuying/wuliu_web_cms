<template>
    <div class="login-wrap">
        <div class="ms-login" >
            <div  class="ms-title">艺术物流管理系统</div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80" label-position="left">
                <FormItem prop="user_name" label="用户名">
                    <Input type="text" v-model="formInline.user_name" placeholder="请输入用户名" >
                    </Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码"    @keyup.enter.native=" handleSubmit('formInline') ">
                    </Input>
                </FormItem>
                <div>
                    <Button type="primary" long @click="handleSubmit('formInline')">登录</Button>
                </div>
                <div class="bottom_box">
<!--                    <span @click=" $router.push(  {  name: 'forgot_pwd'} ) ">-->
<!--                        忘记密码?-->
<!--                    </span>-->
<!--                    <span @click=" $router.push(  {  name: 'register'} )"  >-->
<!--                        立即注册-->
<!--                    </span>-->
                </div>
            </Form>
        </div>

    </div>
</template>

<script>
    export default {
        name: "login",
        data () {
            return {
                formInline: {
                    user_name: localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')).user_name: '',
                    password: ''
                },
                ruleInline: {
                    user_name: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to);
                console.log(from);
                this.$router.go(0);
            }
        },
        mounted(){

        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.Ajax.post(API_URL.login,this.formInline).then( (ret)=> {
                            if(ret){
                                this.$Message.success('登录成功!');
                                localStorage.setItem('username',ret.DATA.user_name);
                                localStorage.setItem('userinfo', JSON.stringify(ret.DATA));
                                localStorage.setItem('uid',ret.DATA.id);
                                // localStorage.setItem('refuse_path',"list")
                                // this.$store.commit('get_refuse_path');
                                this.$router.push('/');
                            }
                        })
                    } else {
                        this.$Message.error('提交数据有误,请检查');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        color: #fff;
        font-size: 16px;
    }
    .ivu-btn{
        font-size: 16px;
    }


    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,1);
        background-size: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .ms-login{
        width: 420px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-content {
        padding: 30px 30px;
    }

    .bottom_box{
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: flex-end;
    }
    .bottom_box span{
        cursor: pointer;
    }
</style>