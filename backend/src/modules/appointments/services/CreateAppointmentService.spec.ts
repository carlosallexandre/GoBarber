import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('Create appointment', () => {
  it('should be able to create appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id', '123456');
  });

  it('should not be able to create a new appointment at same date', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointmentDate = new Date();

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456',
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
