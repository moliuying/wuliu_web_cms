<template>
  <div class="detail-prev-container">
    <div class="header">
      <h2>MBE Fine Art Shipping Services</h2>
    </div>

    <div class="content">
      <p class="description">
        Please provide the information below to reveal your shipping quote.
      </p>

      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="200" class="form-container">
        <FormItem label="Your Auction Reference" prop="auction_ref">
          <Input
            v-model="formData.auction_ref"
            placeholder="Enter your auction reference"
            class="input-field"
          />
        </FormItem>

        <FormItem label="Your email address" prop="email">
          <Input
            v-model="formData.email"
            placeholder="Enter your email address"
            class="input-field"
          />
        </FormItem>
      </Form>

      <div class="button-container">
        <Button
          type="primary"
          size="large"
          class="next-button"
          @click="handleNext"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailPrev',
  data() {
    return {
      formData: {
        auction_ref: '',
        email: ''
      },
      ruleValidate: {
        auction_ref: [
          { required: true, message: 'Please enter your auction reference', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter your email address', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleNext() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 可以添加跳转逻辑
          this.$router.push({ name: 'quotationDetail', query: { auction_ref: this.formData.auction_ref, email: this.formData.email } });
        } else {
          this.$Message.error('Please fill in the required fields correctly!');
        }
      });
    }
  }
}
</script>

<style scoped>
.detail-prev-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.header h2 {
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin: 0;
}

.content {
  max-width: 600px;
  margin: 0 auto;
}

.description {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.5;
}

.form-container {
  margin-bottom: 40px;
}

.input-field {
  width: 100%;
  height: 40px;
}

.button-container {
  text-align: center;
  margin-top: 40px;
}

.next-button {
  width: 200px;
  height: 50px;
  font-size: 18px;
  font-weight: 500;
}

::v-deep .ivu-form-item {
  margin-bottom: 30px;
}

::v-deep .ivu-form-item-label {
  font-size: 16px;
  color: #333;
  font-weight: 400;
}

::v-deep .ivu-input {
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

::v-deep .ivu-input:focus {
  border-color: #2d8cf0;
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}

::v-deep .ivu-btn-primary {
  background-color: #2d8cf0;
  border-color: #2d8cf0;
}

::v-deep .ivu-btn-primary:hover {
  background-color: #57a3f3;
  border-color: #57a3f3;
}
</style>
