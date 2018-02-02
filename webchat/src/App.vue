<template>
  <div id="app">
      <div v-if="!statusmodal" height="100vh">
        <div class="btn">
          <center>
            <a class="button is-primary" v-if="countPeople.room1 < 10" @click="start('room1')">room1 {{countPeople.room1}}/10</a>
            <a class="button is-primary" v-else disable>room1 {{countPeople.room1}}/10 (Full)</a>
            <a class="button is-primary" v-if="countPeople.room2 < 10" @click="start('room2')">room2 {{countPeople.room2}}/10</a>
            <a class="button is-primary" v-else disable>room2 {{countPeople.room2}}/10 (Full)</a>
            <a class="button is-primary" v-if="countPeople.room3 < 10" @click="start('room3')">room3 {{countPeople.room3}}/10</a>
            <a class="button is-primary" v-else disable>room3 {{countPeople.room3}}/10 (Full)</a>
          </center>
        </div>
      </div>
    <b-modal v-else :canCancel="false" :active.sync="statusmodal">
      <div class="modal-card animation-content">
        <section class="modal-card-body is-titleless">
          <div class="media">
            <div class="media-content">
              <p>What's your name?</p>
              <br>
              <div class="field">
                <div class="control">
                  <input required="required" placeholder="Your name" maxlength="10" v-model="userName" class="input">
                </div>
                <p class="help is-danger"></p>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="statusmodal = false">
            Submit
          </button>
        </footer>
      </div>
    </b-modal>
    <div class="content">
      <p v-for="(chat, index) in allChat" :key="index">
        {{chat}}
        <!-- <p  v-if="key === userName" align="right">{{chat}}</p> -->
      </p>
    </div>
    <div class="footfix" v-show="selectRoom">
      <footer>
        <table class="chatbox" width="100%">
          <tr>
            <td><input class="input is-rounded" required="required" placeholder="Your message" maxlength="256" v-model="myMessage"></td>
            <td>&nbsp;&nbsp;<button class="button is-primary" @click="sendMessage()" icon="send" size="is-medium">send</button></td>
          </tr>
        </table>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      statusmodal: true,
      userName: '',
      userCount: 0,
      selectRoom: null,
      allChat: [],
      countPeople: null,
      myMessage: ''
    }
  },
  sockets: {
    connect () {
    },
    updatechat (data) {
      this.allChat.push(`${data.userName} : ${data.data}`)
    },
    updateusers (data) {
      this.countPeople = data
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
      if (this.myMessage) {
        this.$socket.emit('sendchat', this.myMessage)
        this.myMessage = ''
      }
    }
  }
}
</script>

<style>
#app {
  height: 93vh;
}
.chatbox {

}
.footfix {
  padding-left: 5%;
  padding-right: 1%;
  width: 100%;
  display:scroll;
  position:fixed;
  bottom:2%;
}
.content {
  padding-left: 2%;
  padding-right: 2%;
  overflow: scroll;
  max-height: 70vh;
  display: block;
}
.btn {
  padding-top: 2%;
}
</style>
