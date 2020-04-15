import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (reqeust, response) => {
  const appointments = appointmentsRepository.all()

  return response.json(appointments)
})

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(appointmentsRepository).execute({ provider: provider, date: parsedDate })

    return response.json(createAppointment);
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
});

export default appointmentsRouter;
