/* 
    CustomHook que maneja guardado, eliminado, y update de los eventos en el store.    
 */
import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from "../store"
import { calendarApi } from "../api"
import { convertsDateInEvents } from "../helpers"
import Swal from "sweetalert2"

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector(state => state.calendar)   //Accede calendarStore
    const { user } = useSelector(state => state.auth)                      //Accede al authStore


    //° fun que se activa al hacer click sobre un evento, este pasa a ser activo
    const setActiveEvent = (calendarEvent) => dispatch( onSetActiveEvent(calendarEvent) )

    //° Envía el evento al backEnd este lo retorna para guardarlos en el store --------------------------------------------------------
    const startSavingEvent = async (calendarEvent) => {
        /* 
            Si la nota viene con el id estamos modificando una nota, de lo contrario es una nota nueva. 
        */
        try {
            if (calendarEvent.id) {
                //Update event
                /* Petición axios método put a la ruta URL_BASE + /events/:id y body (calendarEvent) */
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)
                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                return
            }
            //New Event
            /* Petición axios método post a la ruta URL_BASE + /events y body (calendarEvent) */
            const { data } = await calendarApi.post('/events', calendarEvent)
            /* Esto nos retorna data.evento, que es la nota con todas sus propiedades */
            /* console.log({ data }) */
            /* Con la data retornada del backend + los datos de auth del usuario logueado, agregamos la nueva nota al store */
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
        } 
        catch (error) {
            console.log(error)
            Swal.fire('Se produjo un error al guardar', error.response.data.msg, 'error')
        }
    }

    //° Borra un evento de la bd y del store ------------------------------------------------------------------------------------------
    const startDeleteEvent = async () => {
        try {
            /* Petición axios método delete a la ruta URL_BASE + /events/:id */
            await calendarApi.delete(`/events/${activeEvent.id}`)     
            Swal.fire('','Evento eliminado', 'success')
            dispatch( onDeleteEvent() )
        }
        catch(error){
            console.log(error)
            Swal.fire('Se produjo un error al eliminar la nota', error.response.data.msg, 'error')
        } 
    }

    //° Carga los eventos al loguear o carga la pagina con un token activo ------------------------------------------------------------
    const startLoadingEvents = async () => {
        try {
            /* Petición axios método get a la ruta URL_BASE + /events para recibir los eventos de la BD */
            const { data } = await calendarApi.get('/events')
            const events = convertsDateInEvents(data.eventos) /* fn que recorre los eventos y modifica las fechas para que sean legibles */
            dispatch( onLoadEvents(events) ) /* Una vez cargados los eventos los enviamos al store donde se agregaran si no existen */
        } catch (error) {
            console.log('Hubo una falla al cargar los eventos')
            console.log(error)
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //*Métodos
        setActiveEvent,
        startDeleteEvent,
        startLoadingEvents,
        startSavingEvent,
    }
}
