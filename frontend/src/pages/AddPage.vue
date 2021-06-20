<template>
  <div class="add-main">
    <div class="title">Add Your City</div>
    <div class="input-section">
      <label>City</label>
      <input type="text" v-model="city">
    </div>
    <div class="input-section">
      <label>State</label>
      <input type="text" v-model="state">
    </div>
    <div class="input-section">
      <label>Country</label>
      <input type="text" v-model="country">
    </div>
    <div class="input-section">
      <label>Latitude</label>
      <input type="number" v-model.number="lat">
    </div>
    <div class="input-section">
      <label>Longitude</label>
      <input type="number" v-model.number="lng">
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="success" class="success-message">{{ success }}</div>
    <button @click="submitClicked">Submit</button>
    <button @click="$router.push('/')">Back to Home Page</button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {
  },
  data: function() {
    return {
      city: '',
      state: '',
      country: '',
      lat: '',
      lng: '',

      error: '',
      success: ''
    }
  },
  props: {
  },
  methods: {
    submitClicked: async function() {
      this.error = '';
      this.success = '';

      if (!this.city || !this.state || !this.country || !this.lat || !this.lng) {
        this.error = 'Please fill in all the fields above';
      } else {
        let add = await this.$axios.post('/cities/Add', {
          'city': this.city,
          'state': this.state,
          'country': this.country,
          'latlong': `${this.lat},${this.lng}`
        });

        if (add.data) {
          this.success = `Succesfully added your city! You'll be redirected in 5 seconds`;
          setTimeout(() => {
            this.$router.push('/');
          }, 5000);
        } else {
          this.error = 'There was an error saving your city. Please try again.';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-main {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  > .input-section {
    display: flex;
    flex-direction: column;
    padding: 5px;
    width: 90%;
    max-width: 500px;

    > input {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      outline: none;
      border: 1px solid gray;
    }
  }

  > .error-message {
    padding: 5px;
    color: red;
  }

  > .success-message {
    padding: 5px;
    color: green;
  }

  > button {
    background-color: rgba(137, 137, 255, 0.5);
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid gray;
    margin-top: 5px;
    cursor: pointer;
    transition: 0.3s;

    &:active {
      transform: scale(0.9);
    }
  }
}
</style>