import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public static async index(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const providerId = request.user.id;
    const { day, month, year } = request.body;

    const listProvidersDayAvailability = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProvidersDayAvailability.execute({
      providerId,
      day,
      month,
      year,
    });

    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
