<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">艺术物流管理系统</div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80" label-position="left">
                <FormItem prop="user_name" label="用户名">
                    <Input type="text" v-model="formInline.user_name" placeholder="请输入用户名" ></Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码" ></Input>
                </FormItem>
                <FormItem prop="password2" label="确认密码">
                    <Input type="password" v-model="formInline.password2" placeholder="请确认密码" >
                    </Input>
                </FormItem>
                <FormItem prop="cellphone" label="手机号">
                    <Input type="number" v-model="formInline.cellphone" placeholder="请输入手机号" >
                    </Input>
                </FormItem>
                <FormItem prop="address" label="地址">
                    <Input type="text" v-model="formInline.address" placeholder="请输入地址" >
                    </Input>
                </FormItem>
                <div>
                    <Button type="primary" size="large" long @click="handleSubmit('formInline')">注册</Button>
                </div>
                <div class="bottom_box">
                    <span @click="login">
                        已有账号,去登陆
                    </span>
                </div>
            </Form>
        </div>

    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                formInline: {
                    user_name: '',
                    cellphone: '',
                    password: '',
                    password2: '',
                    address: ''
                },
                ruleInline: {
                    user_name: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '确认密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    cellphone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '地址不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted(){

        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.formInline.password !== this.formInline.password2){
                            this.$Message.error('两次密码请输入一致');
                            return;
                        }
                        this.Ajax.post(API_URL.register, this.formInline).then( (res)=> {
                            if(res){
                                this.$Message.success('注册成功,请去登录吧!');
                            }
                        })

                    } else {
                        this.$Message.error('表单数据有误,请检查');
                    }
                })
            },
            login() {
                this.$router.push(
                    {
                        path: "/login",
                        params: {userId: 123}
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        color: #fff;
        font-size: 14px !important;
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

    .bottom_box {
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: flex-end;
    }

    .bottom_box span {
        cursor: pointer;
    }


</style>