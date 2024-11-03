<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="q-pa-md">
      <q-card-title class="title">
        <div class="text-black">Update Google 2-step Authentication</div>
      </q-card-title>
      <q-card-section class="q-pt-none">
        <div class="q-gutter-md options">
          <q-radio
            v-model="twoFaStatus"
            val="enabled"
            label="Enable Google 2FA"
            color="green"
            icon="lock"
            class="poppins"
          />
          <q-radio
            v-model="twoFaStatus"
            val="disabled"
            label="Disable Google 2FA"
            color="red"
            icon="lock_open"
            class="poppins"
          />
        </div>
      </q-card-section>

      <q-card> 
        <q-btn color="grey-10" class="poppins" style="width: 100%;" label="Reset" @click="reset2FA" />
        <p v-if="qrCodeUrl" class="text-center q-mt-lg underlined" @click="openShowInstructions"> Scan the QR Code </p>
        <div class="row col backg justify-center">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Scan QR Code to Setup 2FA" class="q-mb-sm">
        </div>
      </q-card>
      
      <q-card-actions align="right" class="actions poppins">
        <q-btn color="grey-10" label="Save" @click="updateStatus" />
        <q-btn flat label="Close" color="grey-8" @click="closeModal" />
      </q-card-actions>
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
      showModal: this.show,
      twoFaStatus: 'disabled',
      qrCodeUrl: null,
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
    async updateStatus() {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.put('http://localhost:3000/user/update-2fa', {
          username,
          status: this.twoFaStatus,
        });
        console.log('Response:', response.data);
        this.$emit('update:status', this.twoFaStatus);
        
        // Clear QR code after saving
        this.qrCodeUrl = null;
        
        this.closeModal();
      } catch (error) {
        console.error('Failed to update 2FA status:', error.response ? error.response.data : error.message);
        alert('Failed to update 2FA status');
      }
    },
    async reset2FA() {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.put('http://localhost:3000/user/reset-2fa', {
          username,
        });
        this.qrCodeUrl = response.data.qrCodeUrl;
      } catch (error) {
        console.error('Failed to reset 2FA:', error.response ? error.response.data : error.message);
        alert('Failed to reset 2FA');
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 1.25rem;
  text-align: center;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.actions {
  padding: 2rem;
}

.q-card {
  max-width: 400px;
  width: 100%;
}

.q-mt-md {
  margin-top: 1rem;
}

.poppins {
  font-family: Verdana, Geneva, Tahoma, sans-serif
}

.underlined {
  text-decoration: underline;
  cursor: pointer;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
