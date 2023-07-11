import React from 'react'
import ReactDOM from 'react-dom/client'

import { CalendarApp } from './CalendarApp'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode> //Por motivos de react-big-calendar debemos deshabilitar el strict mode.
        <CalendarApp />
)
