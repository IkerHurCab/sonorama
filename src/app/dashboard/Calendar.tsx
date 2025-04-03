"use client"

import type React from "react"
import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react" // Componente principal del calendario
import dayGridPlugin from "@fullcalendar/daygrid" // Plugin para vista mensual
import timeGridPlugin from "@fullcalendar/timegrid" // Plugin para vistas de semana y día
import interactionPlugin from "@fullcalendar/interaction" // Plugin para interactividad (clic, arrastrar)
import type { EventClickArg } from "@fullcalendar/core"

// Definimos la interfaz para nuestros eventos del calendario
interface Event {
  id: string
  title: string
  start: string
  end?: string // Campo opcional para fecha de fin (eventos de varios días)
  description?: string // Campo opcional para la descripción
}

// Componente principal del calendario
const Calendar: React.FC = () => {
  // Definimos los estados para manejar eventos, selección y modal
  const [events, setEvents] = useState<Event[]>([]) // Array de eventos del calendario
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null) // Evento actualmente seleccionado
  const [showModal, setShowModal] = useState(false) // Controla visibilidad del modal
  const [isNewEvent, setIsNewEvent] = useState(false) // Indica si estamos creando o editando

  // Al cargar el componente, recuperamos eventos guardados o usamos datos de ejemplo
  useEffect(() => {
    // Cargar eventos desde localStorage o usar datos de ejemplo
    const storedEvents = localStorage.getItem("calendar-events")
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents)) // Convertimos el string JSON a objeto
    } else {
      // Datos de ejemplo con fechas específicas
      const exampleEvents = [
        {
          id: "1",
          title: "Reunión de equipo",
          start: "2025-03-15", // YYYY-MM-DD
          description: "Discutir los objetivos del proyecto",
        },
        {
          id: "2",
          title: "Presentación del proyecto",
          start: "2025-03-20",
          end: "2025-03-21", // Evento hasta el final del día 21
          description: "Presentar avances al cliente",
        },
        {
          id: "3",
          title: "Conferencia anual",
          start: "2025-03-25",
          end: "2025-03-27",
          description: "Conferencia anual de tecnología",
        },
      ]
      setEvents(exampleEvents)
      localStorage.setItem("calendar-events", JSON.stringify(exampleEvents)) // Guardamos como string JSON
    }
  }, []) // El array vacío asegura que este efecto solo se ejecute una vez al montar el componente

  // Manejador para cuando el usuario hace clic en una fecha del calendario
  const handleDateClick = (info: { dateStr: string }) => {
    const newEvent: Event = {
      id: String(Date.now()), // Usar timestamp como ID único para evitar duplicados
      title: "Nuevo Evento",
      start: info.dateStr, // Fecha seleccionada en formato YYYY-MM-DD
      description: "",
    }

    setSelectedEvent(newEvent)
    setIsNewEvent(true) // Marcamos que es un evento nuevo
    setShowModal(true) // Mostramos el modal
  }

  // Manejador para cuando el usuario hace clic en un evento existente
  const handleEventClick = (info: EventClickArg) => {
    // Buscamos el evento completo en nuestro array usando el ID
    const event = events.find((e) => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setIsNewEvent(false) // Marcamos que es un evento existente
      setShowModal(true) // Mostramos el modal
    }
  }

  // Función para guardar un evento nuevo o actualizar uno existente
  const handleSaveEvent = () => {
    if (!selectedEvent) return

    let updatedEvents

    if (isNewEvent) {
      // Añadir nuevo evento - creamos un nuevo array con todos los eventos anteriores más el nuevo
      updatedEvents = [...events, selectedEvent]
    } else {
      // Actualizar evento existente - reemplazamos el evento con el mismo ID
      updatedEvents = events.map((e) => (e.id === selectedEvent.id ? selectedEvent : e))
    }

    setEvents(updatedEvents) // Actualizamos el estado
    saveEvents(updatedEvents) // Guardamos en localStorage
    setShowModal(false) // Cerramos el modal
  }

  // Función para eliminar un evento seleccionado
  const handleDeleteEvent = () => {
    if (!selectedEvent) return

    // Filtramos el array para excluir el evento que queremos eliminar
    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id)
    setEvents(updatedEvents) // Actualizamos el estado
    saveEvents(updatedEvents) // Guardamos en localStorage
    setShowModal(false) // Cerramos el modal
  }

  // Función para persistir los eventos en localStorage y simular guardado en servidor
  const saveEvents = (data: Event[]) => {
    // Guardar en localStorage - convertimos el array a string JSON
    localStorage.setItem("calendar-events", JSON.stringify(data))

    // Simulación de guardado en servidor - en una app real, aquí iría una llamada a API
    console.log("Eventos guardados:", data)
  }

  // Función para cerrar el modal y limpiar el evento seleccionado
  const closeModal = () => {
    setShowModal(false)
    setSelectedEvent(null) // Importante limpiar la selección para evitar efectos secundarios
  }

  // Renderizamos el calendario y el modal condicional
  return (
    <div className="p-2 max-w-3xl max-h-0 mx-auto mt-8">
      <div className="bg-white dark:bg-black dark:text-white  rounded-md shadow  p-2 mb-4">
        {/* Configuración del componente FullCalendar con plugins y opciones */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Plugins necesarios
          initialView="dayGridMonth" // Vista inicial del calendario (mensual)
          headerToolbar={{
            left: "prev,next today", // Botones de navegación a la izquierda
            center: "title", // Título del mes/semana en el centro
            right: "dayGridMonth,timeGridWeek,timeGridDay", // Selector de vistas a la derecha
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          locale="es"
          height={500}
          contentHeight={100}
          aspectRatio={1.5}
          dayMaxEventRows={2}
          views={{
            dayGrid: {
              dayMaxEventRows: 2
            }
          }}
          
        />
      </div>

      {/* Modal para editar/crear eventos - se muestra condicionalmente */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Cabecera del modal */}
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isNewEvent ? "Crear Nuevo Evento" : "Editar Evento"} {/* Texto condicional según acción */}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors text-xl">
                × {/* Símbolo de cierre mejorado con tamaño más grande */}
              </button>
            </div>

            {/* Cuerpo del modal */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} // Actualizamos solo el título
                  placeholder="Título del evento"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={selectedEvent.start}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })} // Actualizamos solo la fecha de inicio
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin (opcional)</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={selectedEvent.end || ""} // Usamos || "" para manejar undefined
                  onChange={(e) => {
                    const end = e.target.value || undefined // Si está vacío, usamos undefined para que no se guarde
                    setSelectedEvent({ ...selectedEvent, end }) // Actualizamos solo la fecha de fin
                  }}
                  min={selectedEvent.start} // Validación: No permitir fechas anteriores a la fecha de inicio
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                  value={selectedEvent.description || ""} // Usamos || "" para manejar undefined
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })} // Actualizamos solo la descripción
                  placeholder="Descripción del evento"
                />
              </div>
            </div>

            {/* Pie del modal con botones */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2 border-t">
              {!isNewEvent && (
                <button
                  onClick={handleDeleteEvent}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <span className="mr-1">🗑️</span> Eliminar {/* Botón con emoji de papelera */}
                </button>
              )}

              <button
                onClick={handleSaveEvent}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <span className="mr-1">💾</span> Guardar {/* Botón con emoji de guardar */}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para añadir evento - rediseñado con tamaño fijo y centrado */}
      <button
        onClick={() => {
          const today = new Date().toISOString().split("T")[0] // Obtiene la fecha actual en formato YYYY-MM-DD
          handleDateClick({ dateStr: today }) // Simula un clic en la fecha actual
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Añadir evento"
      >
        +
      </button>
    </div>
  )
}

export default Calendar

