<template>
  <div class="q-pa-md bg-color container fullscreen">
    <!-- Account Settings Dropdown -->
    <div class="flex justify-between">
      <div>
        <q-avatar>
          <img src="https://play-lh.googleusercontent.com/fJnNqhY7mJjLnh4KVD62X-tUUA_tmC2h2GKPcS-Jn-qL1i_p0o2RlCNh4CcCvVXg23s">
        </q-avatar>

        <span class="title"> Poloniex Websocket </span>
      </div>
        <div>
        <q-btn-dropdown
          class="glossy account-settings"
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
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <div class="poppins text-subtitle1 q-mt-md q-mb-xs">{{ username }}</div>
              <q-btn
                  v-for="filter in backdropFilterList"
                  :key="filter.label"
                  color="grey-10"
                  label="LOGOUT"
                  push
                  size="sm"
                  no-caps
                  @click="filter.onClick"
                />

                <q-dialog v-model="dialog" :backdrop-filter="backdropFilter">
                  <q-card>
                    <q-card-section class="poppins text-h6 q-pa-lg">
                      Are you sure you want to logout?
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat label="No" class="poppins" color="negative" v-close-popup />
                      <q-btn flat label="Yes" class="poppins" color="grey-10" @click="onLogout" />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
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
    </div>

    <div class="q-pa-lg">
      <h2 class="text-white titleTrades">Live Trades (BTC/USDT)</h2>
      <q-table
        virtual-scroll
        flat
        card-class="bg text-white"
        style="height: 700px;"
        bordered
        :rows="rows"
        :columns="columns"
        v-model:pagination="pagination"
        row-key="id"
        class="q-mt-md spacious-table" 
      >
      <template v-slot:body-cell-takerSide="props">
    <q-td :props="props" :class="props.rowIndex % 2 === 0 ? 'row-even' : 'row-odd'">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChangePasswordModal from '../components/ChangePasswordModal.vue';
import Update2FAModal from '../components/Update2FAModal.vue';

const seed = []

const columns = [
  { name: 'id', label: 'Trade ID', align: 'center', field: 'id' },
  { name: 'amount', label: 'Amount', align: 'center', field: 'amount' },
  { name: 'takerSide', label: 'Side', align: 'center', field: 'takerSide' },
  { name: 'quantity', label: 'Quantity (BTC)', align: 'center', field: 'quantity' },
  { name: 'price', label: 'Price (USDT)', align: 'center', field: 'price' },
  { name: 'createTime', label: 'Time', align: 'center', field: 'createTime', 
    format: val => new Date(val).toLocaleString() 
  },
];

export default {
  components: {
    ChangePasswordModal,
    Update2FAModal,
  },
  data() {
    return {
      columns,
      rows: seed, 
      username: '',
      showChangePasswordModal: false,
      showUpdate2FAModal: false,

      pagination: ref({
        rowsPerPage: 0
      })
    };
  },
  setup() {

    const list = ['blur(4px)']

    const dialog = ref(false)
    const backdropFilter = ref(null)
    
    const router = useRouter();
    return { router, dialog,
      backdropFilter,
      backdropFilterList: list.map(filter => ({
        label: filter,
        onClick: () => {
          backdropFilter.value = filter
          dialog.value = true
        }
      }))
     };
  },
  mounted() {
    this.username = localStorage.getItem('username') || 'Guest';
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      const socket = new WebSocket('wss://ws.poloniex.com/ws/public'); // Replace with your WebSocket URL
      socket.onopen = () => {
        socket.send(JSON.stringify({
          event: "subscribe",
          channel: ["trades"],
          symbols: ["BTC_USDT"]
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel === 'trades' && data.data) {
          this.rows.unshift(data.data[0]); 
          if (this.rows.length > 20) {
            this.rows.pop(); 
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

<style>
.container {
  max-height: 100%;
  overflow-y: auto;  
}
.bg-color {
  background-color: #181424;
}
.text-white {
  color: white;
}

.title {
  color: white;
  font-size: large;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
}

.titleTrades {
  color: white;
  font-size: x-large;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
}

.account-settings{
  font-weight: 300;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: #202434;
  color: white
}

.bg{
  background-color: #202434;
}

.spacious-table .q-tr {
  height: 60px; 
}
.spacious-table .q-td {
  padding: 25px; 
  font-size: medium;
}

.spacious-table  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #181c24;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

.spacious-table  .q-table__top, thead tr:first-child th {
  padding: 30px;
  font-size: large;
}

@media (max-width: 600px) {
  .title {
    display: none;
  }

  .titleTrades {
    text-align: center;
  }
}

</style>

