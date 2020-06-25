import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let appointmentDate: Date;
let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('Create appointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    appointmentDate = new Date(2020, 5, 25, 13);
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 5, 25, 12).getTime());
  });

  it('should be able to create appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: 'providerId',
      userId: 'userId',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id', 'providerId');
  });

  it('should not be able to create a new appointment at same date', async () => {
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: 'providerId',
      userId: 'userId',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: 'providerId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with userId and providerId equal', async () => {
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: 'userId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on past date', async () => {
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 25, 8),
        provider_id: 'providerId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside 8am and 5pm', async () => {
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 25, 7),
        provider_id: 'providerId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 25, 18),
        provider_id: 'providerId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
