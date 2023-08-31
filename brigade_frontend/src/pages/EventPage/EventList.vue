<template>
  <v-sheet>
    <div class="text-center ma-5">
      <p>Nombre d'evenements : {{ eventList.length }} {{ selection }}</p>
    </div>
    <v-select class="mx-12" v-model="eventTypeShowed" label="Type devenement" :items="eventTypes"></v-select>
    <v-card class="mx-auto" max-height="400" max-width="800">
      <v-list v-model:selected='selection' :items="eventList" item-title="name" item-value="id"></v-list>
    </v-card>

    <v-dialog v-model="dialogNewEvent" width="50%">
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
import NewEventForm from "../EventPage/NewEventForm.vue"

export default {
  components: {
    NewEventForm
  },
  data()
  {
    return {
      selection: [],
      eventList: [],
      eventTypes: [],
      eventTypeShowed: "Tous",
      dialogNewEvent: false,
    };
  },
  provide()
  {
    return {
      closeNewEventDialog: this.closeNewEventDialog,
    };
  },
  methods: {
    loadEvents()
    {
      // liste temporaire de events
      const allEvents = [
        {
          id: 1,
          name: "Game du canadien",
          eventType: "Sportif",
          impact: 1.6,
          asActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 2,
          name: "Fete des meres",
          eventType: "Ferie",
          impact: 2.6,
          asActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 3,
          name: "Tournois de miniput a RDS",
          eventType: "Sportif",
          impact: 1.1,
          asActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 4,
          name: "Super Bowl 2023",
          eventType: "Sportif",
          impact: 3,
          asActive: false,
          props: {
            color: 'red',
          },
        }
      ];
      this.eventList = [];
      allEvents.forEach(event =>
      {
        if (this.eventTypeShowed == "Tous")
        {
          this.eventList.push(event);
        } else
        {

          //faire une fonction qui permet de seulement ajouter les event que son attribut eventType == this.eventTypeShowed au eventList
        }
      });
    },
    closeNewEventDialog()
    {
      this.dialogNewEvent = false;
    },
  },
  watch: {
    eventTypeShowed()
    {
      this.loadEvents();
      this.selection = "";
    },
    selection()
    {
      console.log("Selection changer");
      this.$router.push("events/" + this.selection);
    }
  },
  mounted()
  {
    this.eventTypes = ["Tous", "Sportif", "Ferie"];
    this.loadEvents();
  },
}
</script>


<style scoped>
.v-list {
  height: 400px;
  /* or any height you want */
  overflow-y: auto
}
</style>