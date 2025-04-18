import  { useState } from 'react';
import { Table, Button,} from 'react-bootstrap';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal";
import EditTaskForm from './EditTaskForm';
import { useDeleteTask } from './useDeleteTaskById';

const ScheduleView = ({ events,currentCalendar }) => {
 
  const deleteTask = useDeleteTask();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // State for filtering
  const [startDate,] = useState(moment(currentCalendar.start).format('YYYY-MM-DD'));
  const [endDate,] = useState(moment(currentCalendar.end).format('YYYY-MM-DD'));  

  // Handle date change for filters
 

  // Filter the events based on selected date range
  const filteredEvents = events.filter((event) => {
    const eventStart = moment(event.start).format('YYYY-MM-DD');
   
    const isWithinRange = 
      (!startDate || eventStart >= startDate) && 
      (!endDate || eventStart <= endDate);
    return isWithinRange;
  });

  


  const handleCloseEditDialog = () => {
    setIsViewOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleEditTask = (updatedTask) => {
    if (updatedTask) {
      setIsEditMode(false);
      setIsViewOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteEvent = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      deleteTask.mutate(id);
      setIsViewOpen(false);
      setIsEditMode(false);
      setSelectedTask(null);
    } else {
      console.log("Task deletion was cancelled.");
    }
  };

  return (
    <>
      <div>
        <h2>Scheduled Tasks</h2>

        {/* Date range filter form */}
        {/* <Form className="mb-3">
          <Form.Group controlId="startDate" className="mr-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
            />
          </Form.Group>
          <Form.Group controlId="endDate" className="mr-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Form> */}

        {/* Task table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.title}</td>
                  <td>{moment(event.start).format('YYYY-MM-DD HH:mm')}</td>
                  <td>{moment(event.end).format('YYYY-MM-DD HH:mm')}</td>
                  <td>
                    <Button variant="primary" onClick={() => (setSelectedTask(event), setIsViewOpen(true), setIsEditMode(true))}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No tasks found for the selected date range.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal for editing tasks */}
      {isViewOpen && (
        <Modal isOpen={isViewOpen} onClose={handleCloseEditDialog} title={isEditMode ? "Edit Task" : "View Task"}>
          {isEditMode && (
            <EditTaskForm taskId={selectedTask.id} onEditTask={handleEditTask} />
          )}
        </Modal>
      )}
    </>
  );
};

export default ScheduleView;
