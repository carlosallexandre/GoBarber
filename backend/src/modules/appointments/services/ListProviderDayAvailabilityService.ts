import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointmentsInDay = await this.appointmentRepository.findAllInDayFromProvider(
      {
        providerId,
        day,
        month,
        year,
      },
    );

    const availability = [];
    for (let hour = 8; hour <= 17; hour += 1) {
      const hasAppointmentInHour = appointmentsInDay.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = Date.now();
      const compareDate = new Date(year, month - 1, day, hour);

      availability.push({
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      });
    }

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
