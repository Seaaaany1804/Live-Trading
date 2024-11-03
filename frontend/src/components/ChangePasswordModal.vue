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
        outlined
          v-model="newPassword"
          label="New Password"
          type="password"
          lazy-rules
          color="grey-10"
          :rules="[val => !!val || 'Please enter a new password']"
          class="q-mb-md"
        />
        <q-input
        outlined
          v-model="confirmPassword"
          label="Confirm New Password"
          type="password"
          lazy-rules
          :rules="[val => val === newPassword || 'Passwords must match']"
          class="q-mb-md poppins"
        />
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
    async onSubmit() {
  if (this.newPassword !== this.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const username = localStorage.getItem('username'); // Assuming username is stored in local storage
    const response = await axios.put('http://localhost:3000/user/change-password', {
      username, // Add the username to the request
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });

    alert('Password changed successfully');
    this.closeModal();
  } catch (error) {
    if (error.response) {
      console.error('Password change failed:', error.response.data);
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
