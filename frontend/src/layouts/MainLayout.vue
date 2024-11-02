<template>
  <div class="flex justify-end q-mx-lg q-mt-lg">  
    <div class="q-pa-md">
      <q-btn-dropdown
        class="glossy"
        color="purple"
        label="Account Settings"
      >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-item clickable v-close-popup @click="openChangePasswordModal">
              <q-item-section>
                <q-item-label>Change Password</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Change 2FA</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <q-separator vertical inset class="q-mx-lg" />
          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-subtitle1 q-mt-md q-mb-xs">{{ username }}</div>
            <q-btn
              color="primary"
              label="Logout"
              push
              @click="onLogout"
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-btn-dropdown>
      <!-- ChangePasswordModal component with 'show' prop -->
      <ChangePasswordModal
        :show="showChangePasswordModal"
        @close="showChangePasswordModal = false"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import ChangePasswordModal from '../components/ChangePasswordModal.vue';

export default {
  components: {
    ChangePasswordModal,
  },
  data() {
    return {
      username: '', // Assuming you'll load this data from your login response
      showChangePasswordModal: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    // Retrieve the username from localStorage on component load
    this.username = localStorage.getItem('username') || 'Guest';
  },
  methods: {
    onLogout() {
      localStorage.removeItem('username');
      this.router.push({ name: 'home-page' });
    },
    openChangePasswordModal() {
      this.showChangePasswordModal = true;
    },
  },
};
</script>
