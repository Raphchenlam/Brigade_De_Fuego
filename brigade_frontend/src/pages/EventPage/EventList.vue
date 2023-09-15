<template>
  <v-sheet class="pl-10 py-5">
    <v-card class="h-screen">
      <v-row class="mb-0">
        <v-text-field :autofocus="true" class="ma-2" @input="updateSearchedEvent" v-model='search' hide-details
          placeholder="Rechercher un événement..."></v-text-field>
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
      <v-row>
        <v-col>
          <v-select v-model="eventTypeShowed" label="Type d'événement" :items="eventTypeList"></v-select>
        </v-col>
        <v-col cols="auto" class="ma-2 pa-2">
          <v-field-label>Affichage:</v-field-label>
          <v-switch :label="`${activeEventFilter}`" v-model="activeEventFilter" true-value="Actif" false-value="Tous"
            inline></v-switch>
        </v-col>
      </v-row>
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
  inject: ['loadEvent', 'needUpdateEventList', 'toggleUpdateEventList'],
  data() {
    return {
      search: null,
      selection: [],
      eventList: [],
      allEventList: [],
      eventTypeList: [],
      eventTypeShowed: "Tous",
      dialogNewEvent: false,
      activeEventFilter: "Tous",
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
    updateSearchedEvent() {
      this.eventList = [];
      if (this.search == null) {
        this.search = "";
      }
      fetchAllEvents().then(allEventList => {
        allEventList.forEach(event => {
          if (event.name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
            if (this.activeEventFilter == "Actif") {
              if (event.isActive) {
                this.eventList.push(event);
              }
            } else {
              this.eventList.push(event);
            }
          }
        })
      }).catch(err => {
        console.error(err);
      });
    },

    updateEventList() {
      this.eventList = [];
      fetchAllEvents().then(allEventList => {
        allEventList.forEach((event) => {
          if (this.eventTypeShowed == "Tous" || this.eventTypeShowed == event.eventType) {
            const newEvent = {
              name: event.name,
              eventType: event.eventType,
              impact: event.impact,
              props: {
                color: 'red'
              }
            }
            if (this.activeEventFilter == "Actif") {
              if (event.isActive) {
                this.eventList.push(newEvent);
              }
            } else {
              this.eventList.push(newEvent);
            }
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
      if (!!this.search) {
        this.updateSearchedEvent()
      }else{
        this.updateEventList();
      }
      this.selection[0] = "";
    },
    selection() {
      console.log("Selection changer", this.selection[0]);
      this.loadEvent(this.selection[0]);
    },
    activeEventFilter() {
      if (!!this.search) {
        this.updateSearchedEvent()
      }else{
        this.updateEventList();
      }
    },
    needUpdateEventList() {
      this.updateEventList();
      //setTimeout(this.toggleUpdateEventList,500);
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