<template>
  <div id="app" v-loading="wholePageLoading">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    wholePageLoading() {
      return this.$store.state.app.wholePageLoading
    }
  }
}
</script>
