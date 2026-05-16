<template>
    <div class="login-wrap">
        <div class="ms-login" >
            <div  class="ms-title">玉兔后台管理系统</div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" label-position="left">
                <FormItem prop="text" label="手机号">
                    <Input type="text" v-model="formInline.text" placeholder="请输入手机号" >
                    </Input>
                </FormItem>

                <FormItem prop="code" label="验证码">
                    <Input type="number" v-model="formInline.code" search :enter-button=" code_text " placeholder="请输入验证码" @on-search=" formInline.text?search():$Message.error('手机号不能为空') "/>
                </FormItem>

                <FormItem prop="password" label="新密码">
                    <Input type="password" v-model="formInline.password" placeholder="新密码"    >
                    </Input>
                </FormItem>
                <FormItem prop="password2" label="确认新密码">
                    <Input type="password" v-model="formInline.password2" placeholder="确认新密码"    @keyup.enter.native=" handleSubmit('formInline') ">
                    </Input>
                </FormItem>
                <div>
                    <Button type="primary" long @click="handleSubmit('formInline')">确定</Button>
                </div>
                <div class="bottom_box">
                    <span>

                    </span>
                    <span @click=" $router.push( {path: '/login',params: {userId: 123}}) ">
                        返回登陆页
                    </span>
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
                code_text:'发送',
                formInline: {
                    text: '',
                    code:'',
                    password: ''
                },
                ruleInline: {
                    text: [
                        { required: true, message: '手机号或用户名不能为空', trigger: 'blur' }
                    ],
                    cellphone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' },
                        { type: 'string', min: 4, message: '验证码不能少于4位', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
                    ],
                    password2: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            search(){
                console.log(123);
            },

            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('登录成功!');
                        localStorage.setItem('username',this.formInline.username);
                        this.$router.push('/');
                    } else {
                        this.$Message.error('表单校验失败,请检查');
                    }
                })
            },
            register(){
                this.$router.push(
                    {
                        path:"/register",
                        params: { userId: 123 }
                    }
                )
            }
        }
    }
</script>

<style scoped>

    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        color: #fff;
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
        justify-content: space-between;
    }
    .bottom_box span{
        cursor: pointer;
    }
</style>