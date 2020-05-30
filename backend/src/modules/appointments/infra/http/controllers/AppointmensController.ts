import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public static async create(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { provider_id, date } = request.body;
    const parsedDate = parseISO(date);

    const appointmentService = container.resolve(CreateAppointmentService);

    const appointment = await appointmentService.execute({
      provider_id,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
