import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointementsRepository from '../repositories/fakes/FakeAppointementsRepository';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointementsRepository: FakeAppointementsRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointementsRepository = new FakeAppointementsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointementsRepository
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointementsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointementsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
