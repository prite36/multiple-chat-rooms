<template>
  <div id="app">
    Your Name  <input type="text" name="" v-model="userName">
    <button type="button" name="button" @click="start('room1')">Room1</button>
    <button type="button" name="button" @click="start('room2')">Room2</button>
    <button type="button" name="button" @click="start('room3')">Room3</button>

    <input type="text" name="" v-model="myMessage">
    <button type="button" name="button" @click="sendMessage()">send</button>
    <br>
    <div v-for="(chat, index) in allChat" :key="index">
        {{chat}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      userCount: 0,
      userName: '',
      selectRoom: null,
      allChat: [],
      myMessage: ''
    }
  },
  sockets: {
    connect () {

    },
    updatechat (data) {
      console.log(userName)
      console.log(data)
      this.allChat.push(`${userName} : ${data}`)
    }
  },
  methods: {
    start (room) {
      if (!this.selectRoom) {
        this.selectRoom = room
        let data = {
          userName: this.userName,
          room: room
        }
        this.$socket.emit('connectFirstTime', data)
      } else if (this.selectRoom && this.selectRoom !== room) {
        this.selectRoom = room
        this.$socket.emit('switchRoom', room)
        this.allChat = []
      }
    },
    sendMessage () {
      this.$socket.emit('sendchat', this.myMessage)
      this.myMessage = ''
    }
  },
  mounted () {
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
