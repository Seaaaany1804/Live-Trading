<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="background q-pa-xl">
      <div class="text-h5 poppins text-bold text-center">Change Password</div>
      <q-form @submit.prevent="onSubmit" class="q-mt-md">
        <q-input
          outlined
          v-model="currentPassword"
          label="Current Password"
          type="password"
          lazy-rules
          color="grey-10"
          :input-style="{fontFamily: 'Verdana'}"
          :rules="[val => !!val || 'Please enter your current password']"
          class="q-mb-md poppins"
        />
        <q-input 
          v-model="newPassword" 
          label="New Password" 
          lazy-rules 
          color="grey-10"  
          outlined 
          :type="isPwd ? 'password' : 'text'"
          :rules="[val => !!val || 'Please enter a new password',
            val => val.length >= 8 || 'Password must be at least 8 characters long',
            val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
            val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
            val => /[0-9]/.test(val) || 'Password must contain at least one number'
          ]"
          class="q-mb-md poppins"
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
          v-model="confirmPassword" 
          label="Confirm New Password" 
          lazy-rules 
          color="grey-10"  
          outlined 
          :type="isPwd ? 'password' : 'text'"
          :rules="[val => !!val || 'Please confirm your password']"
          class="q-mb-md poppins"
          >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
        <q-btn
          label="Change Password"
          color="grey-10"
          type="submit"
          class="full-width q-mt-md poppins"
        />
      </q-form>
      <q-btn
        flat
        label="Cancel"
        color="negative"
        @click="closeModal"
        class="full-width poppins q-mt-md"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      isPwd: true,
      showModal: this.show,
    };
  },
  watch: {
    show(val) {
      this.showModal = val;
    },
    showModal(val) {
      if (!val) this.$emit('close');
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    clearForm () {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';

    },
    async onSubmit() {
  if (this.newPassword !== this.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const username = localStorage.getItem('username'); 
    const response = await axios.put('http://localhost:3000/user/change-password', {
      username, 
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });

    alert('Password changed successfully');
    this.clearForm();
    this.closeModal();
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || 'Failed to change password');
    }
  }
},

  },
};
</script>

<style>
.background {
  background-color: white;
  width: 430px;
}

.full-width {
  width: 100%;
}

.poppins {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
