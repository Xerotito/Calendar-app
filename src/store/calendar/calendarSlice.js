import { createSlice } from "@reduxjs/toolkit";

/* 
import { addHours } from "date-fns";
** Evento temporal que se uso antes de construir el backend
const tempEvent = {
    _id    : new Date().getTime(),
    title  : 'Dia del padre',
    notes  : 'Espero mi prima compre regalo',
    start  : new Date(),
    end    : addHours( new Date(), 2 ),
    bgColor: '#fafafa',
    user   : {
        _id: 123,
        name: 'Victor'
    }
} 
*/

const initialState = {
    events         : [],
    activeEvent    : null,
    isLoadingEvents: true,
}

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        onSetActiveEvent: (state, action) => {
            state.activeEvent = action.payload
        },
        onAddNewEvent: (state,action) => {
            state.events.push(action.payload)
            state.activeEvent = null          
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {
                if (event.id === payload.id) return payload
                return event
            })
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events      = state.events.filter(event => event._id !== state.activeEvent._id)  //Devolvemos todos los eventos que son diferentes al id de la nota activa.
                state.activeEvent = null
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false
            //state.events = payload
            /* Con el fin de optimizar y hacer reutilizable este reducer, solo agregaremos un evento si este no existe aun  */
            payload.forEach(event => {
                const exists = state.events.some(dbEvent => dbEvent.id === event.id) /* Si el evento ya existe en el store retorna true */
                if (!exists) state.events.push(event) /* Si el evento no existe en el store lo agregamos al array de eventos */
            })
        },
        OnLogoutCalendar: (state) =>  {
            state.isLoadingEvents = true,
            state.events          = [],
            state.activeEvent     = null
        }

    }
})

export const {
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    OnLogoutCalendar,
    onSetActiveEvent,
    onUpdateEvent,
} = calendarSlice.actions

