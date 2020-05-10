import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointementsRepository from '../repositories/fakes/FakeAppointementsRepository';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointementsRepository = new FakeAppointementsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointementsRepository
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12312312312',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12312312312');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointementsRepository = new FakeAppointementsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointementsRepository
    );

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
