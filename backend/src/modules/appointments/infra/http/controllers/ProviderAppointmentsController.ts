import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public static async index(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const providerId = request.user.id;
    const { day, month, year } = request.query;

    const listProvidersDayAvailability = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProvidersDayAvailability.execute({
      providerId,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}

export default ProviderAppointmentsController;
