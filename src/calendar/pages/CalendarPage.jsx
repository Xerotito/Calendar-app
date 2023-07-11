import { useEffect, useState } from 'react'

import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../components"
import { localizer,getMessagesES } from '../../helpers'
import { useUIStore, useCalendarStore, useAuthStore } from '../../hooks'

export const CalendarPage = () => {

    const { user } = useAuthStore()  //Traemos el usuario logueado actualmente                                                 
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'agenda') //Usaremos para almacenar la última vista en localStorage.

    //CustomHooks globales que manejan los slices correspondientes del store.
    const { openDateModal } = useUIStore()
    const { events, setActiveEvent, startLoadingEvents }        = useCalendarStore()

    const eventsStyleGetter = (event, start, end, isSelected) => {
        /* 
        ** Si el usuario logueado es igual al usuario que se encuentra en el evento es por que dicho evento le pertenece 
        ** Usamos _id o uid por una cuestión de desprolijidad de Fernando Herrera arrastrado de cuando se trabajaba en el front sin back.
        */
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid) 

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius   : '.4rem',
            opacity        : 0.8,
            color          : 'white'
        }
        return { style }
    }

    const onDoubleClick = (event) => openDateModal()  

    const onSelect = (event) => setActiveEvent(event)

    const onViewChanged = (event) =>localStorage.setItem('lastView', event) /* Almacenamos la vista para ser cargada por el estado (lastView) */

    /* Cargamos los eventos de la BD y modificamos las fechas para er legibles */
    useEffect( () => { startLoadingEvents() }, [] ) 
    

    return (
        <>
            <Navbar />

            <Calendar
                culture         = 'es'
                localizer       = { localizer }
                events          = { events }
                defaultView     = { lastView }
                startAccessor   = "start"
                endAccessor     = "end"
                style           = { { height: 'calc(100vh - 80px)' } }
                messages        = { getMessagesES() }
                eventPropGetter = { eventsStyleGetter }
                components      = {{
                    event: CalendarEvent
                }}
                onDoubleClickEvent = { onDoubleClick }
                onSelectEvent      = { onSelect }
                onView             = { onViewChanged }
            />
            
            <CalendarModal/>
            <FabAddNew />
            <FabDelete />
        </>
    )
}

