import { startOfHour } from 'date-fns';
import AppError from '../errors/AppError';
import Appointment from '../models/Appointment.model';
import Appointments from '../repositories/Appointments.repository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: Appointments;

  constructor(appointments: Appointments) {
    this.appointmentsRepository = appointments;
  }

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointmentBooked = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (appointmentBooked) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
