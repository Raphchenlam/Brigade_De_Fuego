<template>
  <v-sheet class="pl-10 py-5">
    <v-card class="h-screen">
      <v-row class="mb-0">
        <v-text-field :autofocus="true" class="ma-2" @input="updateSearchedEvent" v-model='search' hide-details
          placeholder="Rechercher un événement..." clearable @click:clear="clearSearchInput"></v-text-field>
        <v-dialog persistent v-model="dialogNewEvent" width="70%">
          <template v-slot:activator="{ props }">
            <div v-if="$route.fullPath == '/espace/event'" class="ma-2 text-center">
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
        <v-col v-if="$route.fullPath == '/espace/event'" cols="auto" class="ma-2 pa-2">
          <v-field-label>Affichage:</v-field-label>
          <v-switch :label="`${activeEventFilter}`" v-model="activeEventFilter" true-value="Actif" false-value="Tous"
            inline></v-switch>
        </v-col>
      </v-row>
      <div class="text-center ma-5">
        <p>Nombre d'evenements : {{ eventList.length }}</p>
      </div>
      <v-card class="ma-2">
        <v-list v-model:selected='selection' :items="!!search?filteredEventList:eventList" item-title="information" item-value="name">
        
        </v-list>
      </v-card>
    </v-card>
  </v-sheet>
</template>


<script>
import NewEventForm from "../EventPage/NewEventForm.vue";
import { fetchAllEvents, fetchAllEventType } from '../../services/EventService';
import BlackButton from "../../components/Reusable/BlackButton.vue";

export default {
  props: {
    activeEvent: Boolean
  },
  components: {
    NewEventForm,
    BlackButton
  },
  inject: ['loadEvent', 'needUpdateEventList', 'toggleUpdateEventList', 'eventToDisplay'],
  data() {
    return {
      search: null,
      selection: [],
      eventList: [],
      filteredEventList: [],
      allEventList: [],
      eventTypeList: [],
      eventTypeShowed: "Tous",
      dialogNewEvent: false,
      activeEventFilter: "Tous",

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
  methods: {
    clearSearchInput() {
      this.search = "";
    },
    updateEventTypeList() {
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
    filterSearchedEvent() {
      this.filteredEventList = [],

      this.eventList.forEach(event => {
        if (event.name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
            if (this.activeEventFilter == "Actif") {
              if (event.isActive) {
                this.filteredEventList.push(event);
              }
            } else {
              this.filteredEventList.push(event);
            }
          }
      })
    },
    updateEventList()
    {
      this.eventList = [];
      fetchAllEvents().then(allEventList =>
      {
        this.eventList = [];  
        allEventList.forEach((event) =>
        {
          if (this.eventTypeShowed == "Tous" || this.eventTypeShowed == event.eventType)
          {
            const newEvent = {
              information: event.name + "  -- (" + event.impact + " %)", 
              name: event.name,
              eventType: event.eventType,
              impact: event.impact,
              props: {
                color: 'red'
              }
            }
            if (this.activeEventFilter == "Actif")
            {
              if (event.isActive)
              {
                this.eventList.push(newEvent);
              }
            } else
            {
              this.eventList.push(newEvent);
            }
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
      if (!!this.search)
      {
        this.updateSearchedEvent()
      } else {
        this.updateEventList();
      }
      this.selection[0] = "";
    },
    selection()
    {
      this.loadEvent(this.selection[0]);
    },
    activeEventFilter()
    {
      if (!!this.search)
      {
        this.updateSearchedEvent()
      } else {
        this.updateEventList();
      }
    },
    needUpdateEventList()
    {
      this.updateEventList();
      //setTimeout(this.toggleUpdateEventList,500);
    },
    eventToDisplay() {
      this.selection[0] = this.eventToDisplay;
    },
    search(){
      this.filterSearchedEvent();
    }

  },

  mounted()
  {
   
    this.eventTypeShowed = "Tous"
    this.updateEventTypeList();
    this.updateEventList();
    if (this.activeEvent)
    {
      this.activeEventFilter = "Actif";
    }
  }
}
</script>


<style scoped>.v-list {
  height: 400px;
  overflow-y: auto
}</style>