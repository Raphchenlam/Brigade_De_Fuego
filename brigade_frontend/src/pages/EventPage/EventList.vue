<template>
  <v-sheet>
    <div class="text-center ma-5">
      <p>Nombre d'evenements : {{ eventList.length }} <p v-if="selection">{{ selection }}</p> </p>
    </div>
    <v-sheet class="mx-16">
      <v-select class="mx-16" v-model="eventTypeShowed" label="Type d'événement" :items="eventTypeList"></v-select>
    </v-sheet>
    <v-card class="mx-auto" max-height="400" max-width="800">
      <v-list v-model:selected='selection' :items="eventList" item-title="name" item-value="name"></v-list>
    </v-card>
    <v-dialog v-model="dialogNewEvent" width="70%">
      <template v-slot:activator="{ props }">
        <div class="ma-2 text-center">
          <v-btn width="70%" color="black" v-bind="props">
            Ajouter un nouvel evenement
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          Creer un nouvel evenement
        </v-card-title>
        <NewEventForm></NewEventForm>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>



<script>
import NewEventForm from "../EventPage/NewEventForm.vue";
import { fetchAllEvents, fetchAllEventType } from '../../services/EventService';

export default {
  components: {
    NewEventForm
  },
  data() {
    return {
      selection: [],
      eventList: [],
      allEventList: [],
      eventTypeList: [],
      eventTypeShowed: "all",
      dialogNewEvent: false,
    };
  },


  provide() {
    return {
      closeNewEventDialog: this.closeNewEventDialog,
      updateEventTypeShowed: this.updateEventTypeShowed,
      updateEventList: this.updateEventList
    };
  },
  methods: {
    
    updateEventList() {
      fetchAllEventType().then(allEventType => {
        this.eventTypeList = allEventType
      });
      fetchAllEvents().then(allEventList => 
        allEventList.forEach((event) => {
          if (this.eventTypeShowed == "all" || this.eventTypeShowed == event.eventType) {
            this.eventList.push(event);
          }
        })
      )
    },
    updateEventTypeShowed(newEventType) {
      this.eventTypeShowed = newEventType;
      this.updateEventList();
    },
    closeNewEventDialog() {
      this.dialogNewEvent = false;
    },
  },
  watch: {
    eventTypeShowed() {
      this.updateEventList();
      this.selection = "";
    },
    selection() {
      console.log("Selection changer");
      this.$router.push("event/" + this.selection);
    }
  },

  mounted() {
    this.eventTypeShowed = "all"
    this.updateEventList();
  }
}
</script>


<style scoped>
.v-list {
  height: 400px;
  overflow-y: auto
}
</style>