<template>
  <v-sheet>
    <div class="text-center ma-5">
      <p>Nombre d'evenements : {{ eventList.length }} {{ selection }}</p>
    </div>
    <v-sheet class="mx-16">
      <v-select class="mx-16" v-model="eventTypeShowed" label="Type devenement" :items="eventTypes"></v-select>
    </v-sheet>
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
      // liste temporaire de events - Faire un fetch a la BD a la place
      const allEvents = [
        {
          id: 1,
          name: "Game du canadien",
          eventType: "Sportif",
          impact: 1.6,
          iActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 2,
          name: "Fete des meres",
          eventType: "Ferie",
          impact: 2.6,
          isActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 3,
          name: "Tournois de miniput a RDS",
          eventType: "Sportif",
          impact: 1.1,
          isActive: true,
          props: {
            color: 'red',
          },
        },
        {
          id: 4,
          name: "Super Bowl 2023",
          eventType: "Sportif",
          impact: 3,
          isActive: false,
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
      this.$router.push("event/" + this.selection);
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
  overflow-y: auto
}
</style>