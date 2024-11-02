<template>
  <div class="q-pa-md">
    <!-- Account Settings Dropdown -->
    <div class="flex justify-end">
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
            <q-item clickable v-close-popup @click="openUpdate2FAModal">
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
      <ChangePasswordModal
        :show="showChangePasswordModal"
        @close="showChangePasswordModal = false"
      />
      <Update2FAModal
        :show="showUpdate2FAModal"
        @close="showUpdate2FAModal = false"
      />
    </div>

    <!-- Live Trades Display -->
    <div class="q-mt-lg">
      <h2>Live Trades (BTC/USDT)</h2>
      <q-table
        :rows="trades"
        :columns="columns"
        row-key="id"
        class="q-mt-md"
      >
        <template v-slot:body-cell-takerSide="props">
          <q-td :props="props">
            <span :class="props.row.takerSide === 'buy' ? 'text-positive' : 'text-negative'">
              {{ props.row.takerSide }}
            </span>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import ChangePasswordModal from '../components/ChangePasswordModal.vue';
import Update2FAModal from '../components/Update2FAModal.vue';

export default {
  components: {
    ChangePasswordModal,
    Update2FAModal,
  },
  data() {
    return {
      username: '', // Assuming you'll load this data from your login response
      showChangePasswordModal: false,
      showUpdate2FAModal: false,
      trades: [], // Array to hold trade data
      columns: [
        { name: 'id', label: 'Trade ID', align: 'left', field: 'id' },
        { name: 'amount', label: 'Amount', align: 'right', field: 'amount' },
        { name: 'takerSide', label: 'Side', align: 'center', field: 'takerSide' },
        { name: 'quantity', label: 'Quantity (BTC', align: 'right', field: 'quantity' },
        { name: 'price', label: 'Price (USDT)', align: 'right', field: 'price' },
        { name: 'createTime', label: 'Time', align: 'right', field: 'createTime', 
          format: val => new Date(val).toLocaleString() // More specific time format
        },
      ],
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    // Retrieve the username from localStorage on component load
    this.username = localStorage.getItem('username') || 'Guest';

    // Initialize WebSocket connection
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      const socket = new WebSocket('wss://ws.poloniex.com/ws/public'); // Replace with your WebSocket URL
      socket.onopen = () => {
        // Subscribe to the trades channel for BTC/USDT
        socket.send(JSON.stringify({
          event: "subscribe",
          channel: ["trades"],
          symbols: ["BTC_USDT"]
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel === 'trades' && data.data) {
          // Add new trade to the trades array
          this.trades.unshift(data.data[0]); // Assuming data.data is an array of trades
          if (this.trades.length > 20) {
            this.trades.pop(); // Keep only the last 20 trades
          }
        }
      };
    },
    onLogout() {
      localStorage.removeItem('username');
      this.router.push({ name: 'home-page' });
    },
    openChangePasswordModal() {
      this.showChangePasswordModal = true;
    },
    openUpdate2FAModal() {
      this.showUpdate2FAModal = true;
    },
  },
};
</script>
