<!-- frontend/src/layouts/UserLogin.vue -->

<template>
  <div class="background fullscreen flex justify-center items-center">
    <q-card flat bordered class="login-card">
      <div class="row justify-center">
        <h4 class="text-center text-bold input-style">{{ registerMode ? 'Register' : 'Login' }}</h4>
      </div>
      <q-form ref="registerForm" class="q-pa-md">
        <q-input
          v-model="username"
          label="Username"
          outlined
          :input-style="{ color: 'white', fontFamily: 'Verdana'}"
          color="purple-8"
          label-color="purple-1"
          class="q-mb-md input-style"
          
          lazy-rules
          :rules="[val => !!val || 'Please type your username']"
        />
        <q-input
          v-if="registerMode"
          outlined
          v-model="newPassword"
          label="New Password"
          class="q-mb-md input-style"
          label-color="white"
          color="purple-8"
          :input-style="{ color: 'white', fontFamily: 'Verdana'}"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[
            val => !!val || 'Please type your new password',
            val => val.length >= 8 || 'Password must be at least 8 characters long',
            val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
            val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
            val => /[0-9]/.test(val) || 'Password must contain at least one number'
          ]"
        >
  <template v-slot:append>
    <q-icon
      :name="isPwd ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      color="white"
      @click="isPwd = !isPwd"
    />
  </template>
</q-input>
        <q-input
          v-if="registerMode"
          outlined
          v-model="confirmPassword"
          label="Confirm Password"
          color="purple-8"
          label-color="white"
          :input-style="{ color: 'white', fontFamily: 'Verdana'}"
          class="q-mb-md input-style"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[
          val => !!val || 'Please confirm your password',
          val => val.length >= 8 || 'Password must be at least 8 characters long',
          val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
          val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
          val => /[0-9]/.test(val) || 'Password must contain at least one number'
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="white"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-if="!registerMode"
          outlined
          v-model="password"
          label="Password"
          :input-style="{ color: 'white', fontFamily: 'Verdana'}"
          color="purple-8"
          class="q-mb-md input-style"
          label-color="white"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[val => !!val || 'Please type your password']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="white"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          v-if="is2FARequired"
          outlined
          v-model="twoFactorCode"
          color="purple-8"
          :input-style="{ color: 'white', fontFamily: 'Verdana'}"
          label="2FA Code"
          label-color="white"
          class="q-mb-sm"  
          lazy-rules
          :rules="[val => !!val || 'Please enter your 2FA code']"
  />
        <p v-if="qrCodeUrl" class="text-center underlined"> Instructions </p>
        <div class="row col justify-center">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Scan QR Code to Setup 2FA" class="q-mb-md">
        </div>
        

        <q-btn
          :label="registerMode ? 'Register' : 'Log in'"
          class="full-width primary-bg input-style q-m-lg"
          @click="registerMode ? onRegister() : onLogin()"
        />
        <div class="text-center q-mt-md input-style">
          <span v-if="registerMode">Already have an account? </span>
          <span v-else>Don’t have an account? </span>
          <a href="#" class="text-purple-3" @click="toggleRegisterMode">
            {{ registerMode ? 'Login Here!' : 'Register Here!' }}
          </a>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      username: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      isPwd: true,
      registerMode: false,
      twoFactorCode: '',
      is2FARequired: false,
      qrCodeUrl: null, // Store QR code for initial setup
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  async mounted() {
    // Fetch user details to check 2FA status
    const response = await axios.get(`http://localhost:3000/user/${this.username}`);
    this.is2FARequired = response.data.status === 'enabled';
  },
  methods: {
    toggleRegisterMode() {
      this.registerMode = !this.registerMode;
      this.clearForm();
      this.is2FARequired = false; // Reset 2FA requirement when toggling modes
      this.qrCodeUrl = null;
    },
    clearForm() {
      this.username = '';
      this.password = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.twoFactorCode = ''; 
    },
    async onRegister() {
      if (!(await this.$refs.registerForm.validate())) {
    return;
  }

      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/user/register', {
          username: this.username,
          password: this.newPassword,
        });
        console.log(response.data); // Log the response
        this.toggleRegisterMode(); // Switch to login mode after successful registration
      } catch (error) {
        console.error('Registration failed:', error.response || error);
        alert('Username already exists.');
      }
    },

    async onLogin() {
      if (!this.username || !this.password) {
        alert('Please fill in both username and password.');
        return;
      }

  try {
    const response = await axios.post('http://localhost:3000/user/login', {
      username: this.username,
      password: this.password,
      token: this.is2FARequired ? this.twoFactorCode : undefined,
    });

    this.qrCodeUrl = null; // Reset QR code URL if login is successful

    if (response.data.qrCodeUrl) {
      this.qrCodeUrl = response.data.qrCodeUrl;
      this.is2FARequired = true;
    } else {
      // Save the username in localStorage
      localStorage.setItem('username', this.username);
      this.router.push({ name: "main-layout" });
    }
  } catch (error) {
    if (error.response && error.response.data.message === '2FA token required') {
      this.is2FARequired = true;
    } else {
      console.error('Login failed:', error.response || error);
      alert('The account does not exists.');
    }
  }
}



  }
};
</script>

<style scoped>
.background {
  background: url('../assets/mybackground.jpg') no-repeat center center;
  background-size: cover;
}

.login-card {
  width: 90%;
  max-width: 450px;
  padding: 2rem;
  border-radius: 10px;
  background: rgba(64, 64, 64, 0.15); /* Glass effect */
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 1);
  backdrop-filter: blur(5px);
  color: white;
}

.full-width {
  width: 100%;
}

.primary-bg {
  background-color: #6424bb;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
}

.input-style {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white !important; /* Input text color */
}

.underlined {
  text-decoration: underline;
  cursor: pointer;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
