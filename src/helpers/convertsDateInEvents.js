/* 
    Recibe las fechas en formato string de la BD y las transforma en fechas legibles para la humanidad
*/

import { parseISO } from "date-fns"
/* 
**    La fn itera sobre los eventos, agarra el la fecha en string end y start y las modifica en fechas legibles
**    luego retorna el evento con los datos anteriores y las fechas ya legibles, y retornamos todos los eventos iterados y modificados
*/
export const convertsDateInEvents = (events = []) => {
    return events.map(event => {
        event.end   = parseISO(event.end)
        event.start = parseISO(event.start)
        return event
    })

}
