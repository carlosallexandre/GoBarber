import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public static async create(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;
    const { provider_id, date } = request.body;

    // const parsedDate = parseISO(date);

    const appointmentService = container.resolve(CreateAppointmentService);

    const appointment = await appointmentService.execute({
      userId,
      provider_id,
      date,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
