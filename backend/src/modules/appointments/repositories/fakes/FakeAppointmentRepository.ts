import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

import Appointment from '../../infra/typeorm/entities/Appointment.model';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFound = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return appointmentFound;
  }

  public async findAllInMonthFromProvider({
    month,
    year,
    providerId,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === providerId &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    day,
    month,
    year,
    providerId,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === providerId &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month &&
        getDate(appointment.date) === day
      );
    });

    return appointments;
  }

  public async create({
    provider_id,
    userId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, userId });

    this.appointments.push(appointment);

    return appointment;
  }
}
export default AppointmentsRepository;
