import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ListProvidersDayAvailabilityController {
  public static async index(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { providerId } = request.params;
    const { day, month, year } = request.body;

    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProvidersDayAvailability.execute({
      providerId,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}

export default ListProvidersDayAvailabilityController;
