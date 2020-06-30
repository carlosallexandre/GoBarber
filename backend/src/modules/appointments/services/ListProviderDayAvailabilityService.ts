import { injectable, inject } from 'tsyringe';
import { getHours, isAfter, format } from 'date-fns';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment.model';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const cacheKey = `provider-day-availability:${providerId}:${format(
      new Date(year, month - 1, day),
      'yyyyMMdd',
    )}`;

    let appointmentsInDay = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointmentsInDay) {
      appointmentsInDay = await this.appointmentRepository.findAllInDayFromProvider(
        {
          providerId,
          day,
          month,
          year,
        },
      );

      await this.cacheProvider.save(cacheKey, appointmentsInDay);
    }

    const availability = [];
    for (let hour = 8; hour <= 17; hour += 1) {
      const hasAppointmentInHour = appointmentsInDay.find(
        appointment => getHours(new Date(appointment.date)) === hour,
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
