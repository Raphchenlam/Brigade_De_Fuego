<template>
  <v-sheet class="pl-10 py-5">
    <v-card class="h-screen">
      <v-row class="mb-0">
        <v-text-field class="ma-2" v-model="search" hide-details placeholder="Rechercher un événement..."></v-text-field>
        <v-dialog persistent v-model="dialogNewEvent" width="70%">
          <template v-slot:activator="{ props }">
            <div class="ma-2 text-center">
              <BlackButton class="h-100 w-100" v-bind="props" textbutton="+"> </BlackButton>
            </div>
          </template>
          <v-card>
            <v-card-title>
              Creer un nouvel evenement
            </v-card-title>
            <NewEventForm></NewEventForm>
          </v-card>
        </v-dialog>
      </v-row>
      <v-select class="w-50" v-model="eventTypeShowed" label="Type d'événement" :items="eventTypeList"></v-select>
      <div class="text-center ma-5">
        <p>Nombre d'evenements : {{ eventList.length }}</p>
      </div>
      <v-card class="ma-2">
        <v-list v-model:selected='selection' :items="eventList" item-title="name" item-value="name"></v-list>
      </v-card>
    </v-card>
  </v-sheet>
</template>


<script>
import NewEventForm from "../EventPage/NewEventForm.vue";
import { fetchAllEvents, fetchAllEventType } from '../../services/EventService';
import BlackButton from "../../components/Reusable/BlackButton.vue";

export default {
  components: {
    NewEventForm,
    BlackButton
  },
  data()
  {
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


  provide()
  {
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
    updateEventTypeList()
    {
      this.eventTypeList = [];
      fetchAllEventType().then(allEventType =>
      {
        this.eventTypeList.push("Tous");
        allEventType.forEach((eventType) =>
        {
          this.eventTypeList.push(eventType);
        })
      })
        .catch(err =>
        {
          console.error(err);
        });
    },

    updateEventList()
    {
      this.eventList = [];
      fetchAllEvents().then(allEventList =>
      {
        allEventList.forEach((event) =>
        {
          if (this.eventTypeShowed == "Tous" || this.eventTypeShowed == event.eventType)
          {
            this.eventList.push(event);
          }

        })
      })
        .catch(err =>
        {
          console.error(err);
        })
    },

    updateEventTypeShowed(newEventType)
    {
      this.eventTypeShowed = newEventType;
      this.updateEventList();
    },
    closeNewEventDialog()
    {
      this.dialogNewEvent = false;
    },
  },
  watch: {
    eventTypeShowed()
    {
      this.updateEventList();
      this.selection = "";
    },
    selection()
    {
      console.log("Selection changer");
      this.$router.push("event/" + this.selection);
    }
  },

  mounted()
  {
    this.eventTypeShowed = "Tous"
    this.updateEventTypeList();
    this.updateEventList();
  }
}
</script>


<style scoped>.v-list {
  height: 400px;
  overflow-y: auto
}</style>