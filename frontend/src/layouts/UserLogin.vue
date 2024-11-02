<!-- frontend/src/layouts/UserLogin.vue -->

<template>
  <div class="background fullscreen flex justify-center items-center">
    <q-card flat bordered class="login-card">
      <div class="row justify-center">
        <h4 class="text-center text-bold">{{ registerMode ? 'Register' : 'Login' }}</h4>
      </div>
      <q-form class="q-pa-md">
        <q-input
          filled
          v-model="username"
          label="Username"
          class="q-mb-md"
          lazy-rules
          :rules="[val => !!val || 'Please type your username']"
        />
        <q-input
          v-if="registerMode"
          filled
          v-model="newPassword"
          label="New Password"
          class="q-mb-md"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[val => !!val || 'Please type your new password']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-if="registerMode"
          filled
          v-model="confirmPassword"
          label="Confirm Password"
          class="q-mb-md"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[val => !!val || 'Please confirm your password']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-if="!registerMode"
          filled
          v-model="password"
          label="Password"
          class="q-mb-md"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[val => !!val || 'Please type your password']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          v-if="is2FARequired"
          filled
          v-model="twoFactorCode"
          label="2FA Code"
          class="q-mb-md"
          lazy-rules
          :rules="[val => !!val || 'Please enter your 2FA code']"
  />
  <!-- Display QR Code if 2FA setup is required -->
  <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Scan QR Code to Setup 2FA" />

        <q-btn
          :label="registerMode ? 'Register' : 'Log in'"
          color="primary"
          class="full-width q-m-md"
          @click="registerMode ? onRegister() : onLogin()"
        />
        <div class="text-center q-mt-md">
          <span v-if="registerMode">Already have an account?</span>
          <span v-else>Don’t have an account?</span>
          <a href="#" class="text-primary" @click="toggleRegisterMode">
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
    },
    clearForm() {
      this.username = '';
      this.password = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    async onRegister() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match');
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
        alert('Registration failed');
      }
    },

    async onLogin() {
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
      alert('Failed to login');
    }
  }
}


  }
};
</script>

<style scoped>
.background {
  background: url('https://static.vecteezy.com/system/resources/previews/001/846/151/non_2x/cryptocurrency-stock-chart-light-futuristic-banner-background-free-vector.jpg') no-repeat center center;
  background-size: cover;
}

.login-card {
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2); /* Glass effect */
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 1);
  color: white;
}

.full-width {
  width: 100%;
}

.text-primary {
  color: #ffa726; /* Adjust to your preferred accent color */
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
