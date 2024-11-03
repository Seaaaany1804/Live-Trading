<template>
    <q-dialog v-model="showModal" persistent>
      <q-card class="container">
        <q-toolbar>
          <q-avatar>
            <img src="https://it.lbl.gov/wp-content/uploads/sites/18/2024/07/google-authenticator-logo.png">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold"> Google 2FA Authentication Guide </span> </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <subtitle1 class="text-bold text-md"> Step 1: Install Google Authenticator Application in your phone. Available in App Store ( Android / Apple ) </subtitle1>
          <img src="../assets/step1.jpeg" style="width: 100%; padding: 3%;">
        </q-card-section>

        <div class="row"> 
          <div class="col">
            <q-card-section>
          <subtitle1 class="text-bold text-md"> Step 2: Just follow the steps and once you got in here. Pick add a code -> Scan a QR code </subtitle1>
          <img src="../assets/step2.jpeg" style="width: 100%; padding: 3%;">
          </q-card-section>
          </div>
          
          <div class="col">
            <q-card-section>
          <subtitle1 class="text-bold text-md"> Step 3: Scan the QR Code in the login form to get the 2FA Code. To fill-up 2FA Code in login form, there should be no space (ex. 543632). </subtitle1>
          <img src="../assets/step3.jpeg" style="width: 100%; padding: 3%;">
          </q-card-section>
          </div>
        </div>
        
      </q-card>
    </q-dialog>
  </template>
  
  <script>  
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
    },
  };
  </script>
  
  <style scoped>
.container {
  max-height: 100%; 
  overflow-y: auto; 
}

  .full-width {
    width: 100%;
  }
  </style>
  