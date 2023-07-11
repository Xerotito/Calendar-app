/* 
**
Custom hook que trata los formularios, recibe por props dos objetos el initialForm con los nombres de los inputs, y el formValidations con un array en cuya primera posición tenemos la validación que requerimos para ese campo
y en segunda aun mensaje de error si este no se cumple ej:

 ** Campos que tendrá el stateForm deben agregarse en cada field con la propiedad name
 ** También debe agregarse en cada field un onInputChange (o renombrada) para almacenar cada carácter introducido por el usuario 
    const initialForm = {
        name    : null, || ''
        email   : null, || ''
        password: null || ''
    }

 **Validación
    const formValidations = {
        name    : [ (value) => value.length >= 1, 'El nombre es obligatorio' ],
        email   : [ (value) => value.includes('@'), 'NO se encuentra @, debe ingresar un email valido.' ],
        password: [ (value) => value.length >= 6, 'El password debe tener mas de 6 letras' ]
    }
**
*/

import { useEffect, useState } from "react"

export const useForm = (initialForm = {}, formValidations = {}) => {

    /* formState almacena los inputs sus nombres y valores. */
    const [ formState, setFormState ] = useState(initialForm)

    /* validateForm guarda los nombres de los campos y si estos cumplen la validación serán true, caso contrario tendrán el mensaje de error. */
    const [ validatedForm, setValidatedForm ] = useState(initialForm)

    /* Formatea el useForm con los campos iniciales  */
    useEffect(() => { setFormState(initialForm) }, [ initialForm ])

    /* Valida los inputs en tiempo real mientras se escribe en ellos. */
    useEffect(() => { validandoForm() }, [ formState ])

    /* Guarda lo ingresado por el usuario en cada Field */
    function onInputChange({ target }) {
        //Desestructuramos el evento.
        const { name, value } = target //Extraemos type para el nombre y el value de target.
        setFormState({
            ...formState,
            [ name ]: value,
        })
    }
    /**  formState log
    console.log(formState) */

    function validandoForm() {
        for (const field of Object.keys(formValidations)) {
            const [ fnValidate, message ] = formValidations[ field ]
            /*
            El formulario inicial viene por defecto null, esto ayuda a que no se muestren los estilos visuales de errores en el formulario al cargar la page por primera vez. 
             */
            if (formState[ field ] !== null) {
                /* 
                Si no es null significa que ya se escribió en un campo, entonces realizamos la validación del validateForm en su primera posición del array 
                */
                fnValidate(formState[ field ])
                    ? setValidatedForm((validateForm) => ({
                        ...validateForm,
                        [ field ]: true,
                    }))
                    : setValidatedForm((validateForm) => ({
                        ...validateForm,
                        [ field ]: message,
                    }))
            }
        }
    }

    /* Realizamos una validación final al hacer submit del formulario. */
    function validateOnSubmit() {
        for (const field of Object.keys(formValidations)) {
            if (formState[ field ] === null || '') setFormState(formState => ({
                ...formState,
                [ field ]: ''
            }))
        }
        //Si todos los campos del formulario pasaron la validación, nuestro objeto validateForm contendrá true en sus propiedades!
        if (!Object.values(validatedForm).every((field) => field)) return { ok: false }
        return { ok: true }
    }

    const onResetForm = () => setFormState(initialForm) //Fn para reiniciar los campos del formulario.

    return {
        ...formState, //Con esto cargamos nuevos valores que podamos añadir en un futuro como body y title de las notas.
        formState,
        onInputChange,
        validatedForm,
        validateOnSubmit
    }
}

/* Retornamos el estado y la fn para poder usar donde queramos de la siguiente manera const { onInputChange,formState } = useForm() */