<template>
  <v-sheet>
    <div class="text-center ma-5">
      <p>Nombre d'evenements : {{ eventList.length }} {{ selection }}</p>
    </div>
    <v-sheet class="mx-16">
      <v-select class="mx-16" v-model="eventTypeShowed" label="Type d'événement" :items="eventTypeList"></v-select>
    </v-sheet>
    <v-card class="mx-auto" max-height="400" max-width="800">
      <v-list v-model:selected='selection' :items="eventList" item-title="name" item-value="id"></v-list>
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
    // async loadEvents() {
    //   this.eventTypeList = await fetchAllEventType();
    //   this.allEventList = await fetchAllEvents();
    // },
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
      console.log("eventList" , this.eventList);

      // allEvents.forEach(event => {
      //   if (this.eventTypeShowed == "Tous") {
      //     this.eventList.push(event);
      //   } else {
      //     //faire une fonction qui permet de seulement ajouter les event que son attribut eventType == this.eventTypeShowed au eventList
      //   }
      // });
    },
    updateEventTypeShowed(newEventType) {
      this.eventTypeShowed = newEventType;
      this.loadEvents();
    },
    closeNewEventDialog() {
      this.dialogNewEvent = false;
    },
  },
  watch: {
    eventTypeShowed() {
      this.loadEvents();
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