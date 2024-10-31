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
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label> Change Password </q-item-label>
                </q-item-section>
              </q-item>
              
            
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label> Change 2FA </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>

            <!-- Put the username here -->
            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

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
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  setup () {
    const router = useRouter();
    return { router };
  },
    methods: {
      onLogout () {
        this.router.push({ name: "home-page" });
      }

    }
  }
</script>
