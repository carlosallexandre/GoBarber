import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment.model';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    userId,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointmentBooked = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (appointmentBooked) {
      throw new AppError('This appointment is already booked');
    }

    const currentDate = Date.now();

    if (isBefore(date, currentDate)) {
      throw new AppError("You can't book an appointment in past date");
    }

    if (userId === provider_id) {
      throw new AppError("You can't book an appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only book an appointment between 8am and 5pm',
      );
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      userId,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
