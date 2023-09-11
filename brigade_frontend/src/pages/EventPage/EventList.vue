<template>
  <v-sheet>

    <v-sheet class="mx-16">
      <v-text-field class="ma-2" @input="searchEvent" v-model="search" hide-details placeholder="Rechercher un événement..."></v-text-field>
      <v-select class="ma-2" v-model="eventTypeShowed" label="Type d'événement" :items="eventTypeList"></v-select>
      <div class="text-center ma-5">
        <p>Nombre d'evenements : {{ eventList.length }}</p>
      </div>
    </v-sheet>
    <v-sheet class="mx-16">
      <v-card class="ma-2">
        <v-list v-model:selected='selection' :items="eventList" item-title="name" item-value="name"></v-list>
      </v-card>
    </v-sheet>
    <v-dialog persistent v-model="dialogNewEvent" width="70%">
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
      search: "",
      selection: [],
      eventList: [],
      allEventList: [],
      eventTypeList: [],
      eventTypeShowed: "Tous",
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
  // computed: {
  //   searchEvent() {
  //     this.eventList.forEach((event) => {
  //       // if (this.search == "") {
  //       //   this.updateEventList();
  //       // }
  //       if (event.name.toUpperCase().indexOf(this.search.toUpperCase() && this.search != "") >= 0) {
  //         // this.updateEventList();
  //         this.eventList = [];
  //         this.eventList.push(event);
  //       }
  //     })
  //   },
  // },
  methods: {
    updateEventTypeList() {
      this.eventTypeList = [];
      fetchAllEventType().then(allEventType => {
        this.eventTypeList.push("Tous");
        allEventType.forEach((eventType) => {
          this.eventTypeList.push(eventType);
        })
      })
        .catch(err => {
          console.error(err);
        });
    },

    updateEventList() {
      this.eventList = [];
      fetchAllEvents().then(allEventList => {
        allEventList.forEach((event) => {
          if (this.eventTypeShowed == "Tous" || this.eventTypeShowed == event.eventType) {
            this.eventList.push(event);
          }

        })
      })
        .catch(err => {
          console.error(err);
        })
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
    this.eventTypeShowed = "Tous"
    this.updateEventTypeList();
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