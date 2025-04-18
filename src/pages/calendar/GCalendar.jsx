import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './GCalendar.module.css';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { useMutation } from '@tanstack/react-query';
import { addCalendarEvent } from '../../services/apiCalendar';
import toast from 'react-hot-toast';
import useStaff from '../../features/admin/staff/useStaff';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

const EVENT_COLORS = {
  meeting: '#4285f4',
  reminder: '#fbbc04',
  task: '#34a853',
  call: '#ea4335'
};

const RECURRING_OPTIONS = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

const GCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewType, setViewType] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const {data:agentData} = useStaff();
  const [recurringEvents, setRecurringEvents] = useState([]);

  const filteredAgents = agentData.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      event_type: 'meeting',
      schedule_date: '',
      location: '',
      agent_ids: [],
      recurring: 'none',
      color: '',
      reminder: '15' // minutes before
    },
  });
  const mutation = useMutation({
    mutationFn: addCalendarEvent,
    onSuccess: () => {
        toast.success("Task added successfully");
    },
    onError: (error) => {
        toast.error("Error adding task", {
            duration: 5000,
        });
        console.log(error);

    },
});

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= days; i++) {
      daysArray.push(new Date(year, month, i));
    }

    return daysArray;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    let formattedDateTime;
    if (viewType === 'month') {
      // For month view, set time to 9:00 AM
      const defaultDate = new Date(date);
      defaultDate.setHours(9, 0, 0);
      formattedDateTime = defaultDate.toISOString().slice(0, 16);
    } else {
      // For week/day view, preserve the exact clicked hour and minute
      const clickedHour = Math.floor(date.getHours());
      const clickedMinute = Math.floor((date.getMinutes() / 15)) * 15; // Round to nearest 15 minutes
      
      const exactDate = new Date(date);
      exactDate.setHours(clickedHour, clickedMinute, 0);
      formattedDateTime = exactDate.toISOString().slice(0, 16);
    }
    
    // Set the datetime value
    setValue('schedule_date', formattedDateTime);
    
    // Get and set location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toFixed(6);
          const longitude = position.coords.longitude.toFixed(6);
          const locationString = `${latitude}, ${longitude}`;
          setValue('location', locationString);
          
          // Optional: Reverse geocoding to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              const address = data.display_name;
              setValue('location', `${address} (${locationString})`);
            })
            .catch(err => console.log('Geocoding error:', err));
        },
        (error) => console.log('Geolocation error:', error)
      );
    }
    
    setShowEventForm(true);
  };
  
  const onSubmit = (data) => {
    const event = {
      ...data,
      agent_ids:data?.agent_ids.join(","),
      schedule_date: new Date(data.schedule_date),
    };

  mutation.mutate(event)
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e));
      setEditingEvent(null);
    } else {
      setEvents([...events, event]);
    }

    setShowEventForm(false);
    reset();
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };


  const startEditingEvent = (event) => {
    setEditingEvent(event);
    setValue('title', event.title);
    setValue('description', event.description);
    setValue('event_type', event.event_type);
    setValue('schedule_date', event.schedule_date.toISOString());
    setValue('location', event.location);
    setValue('agent_ids', event.agent_ids);
    setShowEventForm(true);
  };

  const calculateNewDate = (droppableId) => {
    const [year, month, day] = droppableId.split('-').map(Number);
    return new Date(year, month, day);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    const newDate = calculateNewDate(result.destination.droppableId);
    reorderedItem.schedule_date = newDate;
    
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          <div className={styles.days}>
            {days.map((date, index) => (
              <div
                key={index}
                className={`${styles.day} ${
                  date && date.toDateString() === new Date().toDateString()
                    ? styles.today
                    : ''
                }`}
                onClick={() => date && handleDateClick(date)}
              >
                {date && (
                  <>
                    <span className={styles.dayNumber}>{date.getDate()}</span>
                    <div className={styles.eventDots}>
                      {events
                        .filter(event => event.schedule_date.toDateString() === date.toDateString())
                        .map(event => (
                          <div
                            key={event.id}
                            className={styles.eventDot}
                            title={event.title}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    );
  };


  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  
    return (
      <div className={styles.weekView}>
        <div className={styles.weekHeader}>
          <div className={styles.timeGutter}></div>
          {days.map((date, index) => (
            <div key={index} className={styles.dayColumn}>
              <div className={styles.dayLabel}>
                <div className={styles.dayName}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`${styles.dayNumber} ${
                  date.toDateString() === new Date().toDateString() ? styles.today : ''
                }`}>
                  {date.getDate()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.weekGrid}>
          <div className={styles.timeGutter}>
            {timeSlots.map((hour) => (
              <div key={hour} className={styles.timeSlot}>
                {`${hour}:00`}
              </div>
            ))}
          </div>
          
          {days.map((date, dayIndex) => (
            <div key={dayIndex} className={styles.dayColumn}>
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className={styles.timeCell}
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setHours(hour);
                    handleDateClick(newDate);
                  }}
                />
              ))}
              {events
                .filter(event => event.schedule_date.toDateString() === date.toDateString())
                .map(event => (
                  <div
                    key={event.id}
                    className={styles.weekEvent}
                    style={{
                      top: `${event.schedule_date.getHours() * 60 + event.schedule_date.getMinutes()}px`,
                      height: '60px'
                    }}
                  >
                    <div className={styles.eventContent}>
                      <div className={styles.eventTime}>
                        {event.schedule_date.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className={styles.eventTitle}>{event.title}</div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderDayView = () => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
    return (
      <div className={styles.dayView}>
        <div className={styles.dayViewHeader}>
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div className={styles.dayGrid}>
          <div className={styles.timeGutter}>
            {timeSlots.map((hour) => (
              <div key={hour} className={styles.timeSlot}>
                {`${hour}:00`}
              </div>
            ))}
          </div>
          
          <div className={styles.dayContent}>
            {timeSlots.map((hour) => (
              <div 
                key={hour} 
                className={styles.timeCell}
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setHours(hour);
                  handleDateClick(newDate);
                }}
              />
            ))}
            
            {events
              .filter(event => event.schedule_date.toDateString() === currentDate.toDateString())
              .map(event => (
                <div
                  key={event.id}
                  className={styles.dayEvent}
                  style={{
                    top: `${event.schedule_date.getHours() * 60 + event.schedule_date.getMinutes()}px`,
                    height: '60px'
                  }}
                >
                  <div className={styles.eventContent}>
                    <div className={styles.eventTime}>
                      {event.schedule_date.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className={styles.eventTitle}>{event.title}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };
  
  const generateRecurringEvents = (event) => {
    const recurring = watch('recurring');
    if (recurring === 'none') return [event];

    const recurrences = [];
    const baseDate = new Date(event.schedule_date);
    
    for (let i = 0; i < 10; i++) { // Generate next 10 occurrences
      const newDate = new Date(baseDate);
      
      switch(recurring) {
        case 'daily':
          newDate.setDate(baseDate.getDate() + i);
          break;
        case 'weekly':
          newDate.setDate(baseDate.getDate() + (i * 7));
          break;
        case 'monthly':
          newDate.setMonth(baseDate.getMonth() + i);
          break;
        case 'yearly':
          newDate.setFullYear(baseDate.getFullYear() + i);
          break;
      }
      
      recurrences.push({
        ...event,
        schedule_date: newDate,
        isRecurring: true
      });
    }
    
    return recurrences;
  };

  const renderEvent = (event) => {
    const eventStyle = {
      backgroundColor: EVENT_COLORS[event.event_type] || '#4285f4',
      borderLeft: event.isRecurring ? '3px solid #000' : 'none'
    };

    return (
      <Draggable
        key={event.id}
        draggableId={event.id.toString()}
        index={events.indexOf(event)}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.eventItem}
            style={{...eventStyle, ...provided.draggableProps.style}}
          >
            <div className={styles.eventContent}>
              <div className={styles.eventTime}>
                {event.schedule_date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.eventTitle}>{event.title}</div>
              {event.isRecurring && (
                <div className={styles.recurringIndicator}>↻</div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const renderEventForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Event Title"
            required
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Description"
          />
        )}
      />
      <Controller
        name="event_type"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
            <option value="task">Task</option>
            <option value="call">Call</option>
          </select>
        )}
      />
      <Controller
        name="schedule_date"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="datetime-local"
            required
          />
        )}
      />
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className={styles.locationField}>
            <input
              {...field}
              type="text"
              placeholder="Location (lat, long)"
            />
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                      field.onChange(coords);
                    },
                    (error) => {
                      console.log('Geolocation error:', error);
                    }
                  );
                }
              }}
            >
              Get Current Location
            </button>
          </div>
        )}
      />
      <Controller
        name="recurring"
        control={control}
        render={({ field }) => (
          <select {...field}>
            {RECURRING_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name="reminder"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="0">No reminder</option>
            <option value="5">5 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
          </select>
        )}
      />
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <input
            type="color"
            {...field}
            className={styles.colorPicker}
          />
        )}
      />
      <Controller
        name="agent_ids"
        control={control}
        render={({ field }) => (
          <div className={styles.agentSelectorWrapper}>
            <button 
              type="button"
              className={styles.agentSelectorButton}
              onClick={() => setShowAgentSelector(true)}
            >
              <span className={styles.buttonIcon}>👥</span>
              Select Agents ({field.value.length} selected)
            </button>

            {showAgentSelector && (
              <div className={styles.agentSelectorModal}>
                <div className={styles.agentSelectorContent}>
                  <div className={styles.modalHeader}>
                    <h3>Select Agents</h3>
                    <input
                      type="text"
                      placeholder="🔍 Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.agentList}>
                    {filteredAgents.map(agent => (
                      <div 
                        key={agent.id}
                        className={`${styles.agentCard} ${
                          field.value.includes(agent.id.toString()) ? styles.selected : ''
                        }`}
                        onClick={() => {
                          const newValue = field.value.includes(agent.id.toString())
                            ? field.value.filter(id => id !== agent.id.toString())
                            : [...field.value, agent.id.toString()];
                          field.onChange(newValue);
                        }}
                      >
                        <div className={styles.agentAvatar}>
                        {agent?.avatar!== "" ? (<img src={agent?.avatar}/>):agent.name.charAt(0).toUpperCase()}  
                        </div>
                        <div className={styles.agentInfo}>
                          <span className={styles.agentName}>{agent.name}</span>
                        </div>
                        {field.value.includes(agent.id.toString()) && (
                          <span className={styles.checkmark}>✓</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.modalFooter}>
                    <button 
                      type="button" 
                      className={styles.doneButton}
                      onClick={() => setShowAgentSelector(false)}
                    >
                      Done ({field.value.length} selected)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <div className={styles.modalButtons}>
        <button type="submit">
          {editingEvent ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            reset();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="sectionContainer">
      <SectionTop heading="Calendar">
        <TabBar
          tabs={[
            {
              id: "CALENDAR",
              label: "Calendar",
              bgColor: "#f0f7ff",
              fontColor: "#4d94ff",
              path: "/calendar",
            },
          ]}
          activeTab={"CALENDAR"}
          navigateTo={() => `/calendar`}
        />
      </SectionTop>
      
      <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
  <div className={styles.calendarControls}>
    <button onClick={goToPreviousMonth}>&lt;</button>
    <h2>
      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
    </h2>
    <button onClick={goToNextMonth}>&gt;</button>
  </div>
  <div className={styles.viewControls}>
    <select 
      value={viewType} 
      onChange={(e) => setViewType(e.target.value)}
      className={styles.viewSelect}
    >
      <option value="month">Month</option>
      <option value="week">Week</option>
      <option value="day">Day</option>
    </select>
    <button onClick={goToToday} className={styles.todayButton}>
      Today
    </button>
  </div>
</div>

{viewType === 'month' && renderCalendar()}
  {viewType === 'week' && renderWeekView()}
  {viewType === 'day' && renderDayView()}

        {showEventForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>{editingEvent ? 'Edit Event' : 'New Event'}</h3>
              {renderEventForm()}
            </div>
          </div>
        )}

        <div className={styles.eventList}>
          <h3>Upcoming Events</h3>
          {events
            .sort((a, b) => a.schedule_date - b.schedule_date)
            .map(event => (
                <div key={event.id} className={styles.eventItem}>
                <div className={styles.eventInfo}>
                  <h4>{event.title}</h4>
                  <p>{event.schedule_date.toLocaleString()}</p>
                  {event.location && <p>Location: {event.location}</p>}
                  {/* <p>Assigned Agents: {
                    event.agent_ids
                      .map(id => agents.find(agent => agent.id === parseInt(id))?.name)
                      .filter(Boolean)
                      .join(", ")
                  }</p> */}
                </div>
                <div className={styles.eventActions}>
                  <button onClick={() => startEditingEvent(event)}>Edit</button>
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              </div>
              
            ))}
        </div>
      </div>
    </div>
  );
};

export default GCalendar;
