import { useEffect, useState } from "react";
import { useMemo } from "react";

import Modal from "react-modal";
import { addHours, differenceInSeconds } from "date-fns";
import Swal from 'sweetalert2'

//Componente datepicker y estilos
import DatePicker,{ registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import  es  from "date-fns/locale/es";

import { useCalendarStore, useUIStore } from "../../hooks";

registerLocale('es',es)

const customStyles = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)',
    }
}

Modal.setAppElement('#root') //Esto es para que el modal tenga el index mas alto, se coloca el lugar mas alto, en este caso la entrada a la app de react.

export const CalendarModal = () => {

    //CustomsHooks que manejan todo lo correspondiente a los slices desde el store.
    const { isDateModalOpen, closeDateModal } = useUIStore()
    const { activeEvent, startSavingEvent }   = useCalendarStore()

    
    useEffect(() => {
        if (activeEvent !== null) setFormValues({ ...activeEvent })
    }, [ activeEvent ])

    const [ formSubmitted, setFormSubmitted ] = useState(false)     //Maneja cambios de formulario.

    const [formValues, setFormValues] = useState({                 //Maneja los campos del formulario.
        title: '',
        notes: 'Soy la nota en si',
        start: new Date(),
        end  : addHours( new Date(), 2 ),
    })
        
    const titleClass = useMemo(() => {
        if (!formSubmitted) return ''
        return (formValues.title.length <= 0)
            ? 'is-invalid'
            : 'is-valid'
    }, [ formValues.title, formSubmitted ])



    const onInputChange = ({ target }) => setFormValues( {...formValues, [ target.name ]: target.value} )

    const onDateChange = (event, changing) => setFormValues({ ...formValues, [ changing ]: event })

    const onCloseModal = () =>  closeDateModal() //Cierra el modal al realizar un click fuera del mismo.

    /* Una vez creado el evento lo enviamos a startSavingEvent */
    const onSubmit = async (event) => {
        event.preventDefault()
        setFormSubmitted(true)

        const difference = differenceInSeconds(formValues.end, formValues.start)

        if (isNaN(difference) || difference <= 0) {
            Swal.fire({icon:'error', title:'Revisar fechas ingresadas'})
            return
        }
        if (formValues.title.length <= 0) return

        console.log(formValues)

        startSavingEvent( formValues )
        closeDateModal()
        setFormSubmitted(false)

        //TODO: 
        //Cerrar modal
        //Remover errores en pantalla
    } 

    return (
        <Modal
            isOpen           = { isDateModalOpen }
            onRequestClose   = { onCloseModal }
            style            = { customStyles }
            className        = "modal"
            overlayClassName = "modal-fondo"
            closeTimeoutMS   = { 200 }
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker
                        className   = "form-control"
                        selected    = { formValues.start }
                        onChange    = { (event) => onDateChange(event, 'start') }
                        dateFormat  = "Pp"
                        locale      = "es"
                        timeCaption = "Hora"
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        className   = "form-control"
                        minDate     = { formValues.start }
                        selected    = { formValues.end }
                        onChange    = { (event) => onDateChange(event, 'end') }
                        dateFormat  = "Pp"
                        locale      = "es"
                        timeCaption = "Hora"
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type         = "text"
                        className    = { `form-control ${titleClass}` } 
                        placeholder  = "Título del evento"
                        name         = "title"
                        autoComplete = "off"
                        value        = { formValues.title }
                        onChange     = { onInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type        = "text"
                        className   = "form-control"
                        placeholder = "Notas"
                        rows        = "5"
                        name        = "notes"
                        value       = { formValues.notes }
                        onChange    = { onInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
