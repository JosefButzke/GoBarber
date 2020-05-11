import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointementsRepository from '../repositories/fakes/FakeAppointementsRepository';

let fakeAppointementsRepository: FakeAppointementsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointementsRepository = new FakeAppointementsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointementsRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12312312312',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12312312312');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12312312312',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12312312312',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
