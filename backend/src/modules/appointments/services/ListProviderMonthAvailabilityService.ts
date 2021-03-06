import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProvidersMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllInMonthFromProvider(
      {
        providerId,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(month - 1);

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          !!(appointmentsInDay.length < 10) &&
          isAfter(new Date(year, month - 1, day, 23, 59, 59), new Date()),
      };
    });

    return availability;
  }
}

export default ListProvidersMonthAvailabilityService;
