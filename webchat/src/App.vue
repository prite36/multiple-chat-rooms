<template>
  <div id="app">
    <router-view/>
    <button type="button" name="button" @click="start()">Start</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  sockets: {
    connect () {
      console.log('socket connected')
    },
    getName (name) {
      if (this.nameRival === '') {
        var delay = setInterval(() => {
          this.$socket.emit('setName', {name: 'aaaa'})
          clearInterval(delay)
        }, 1000)
      }
      this.nameRival = name.name
    }
  },
  methods: {
    start () {
      let vm = this
      vm.$socket.emit('start', {num: '555'})
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
