import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe("List Month's Provider Availability", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it("should be able to list month's provider availability", async () => {
    await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 2, 20, 8, 0, 0),
    });

    const fullfillAppointmentsInDay = [];
    for (let hour = 8; hour <= 17; hour += 1) {
      fullfillAppointmentsInDay.push(
        fakeAppointmentRepository.create({
          userId: 'user01',
          provider_id: 'provider00',
          date: new Date(2020, 4, 20, hour, 0, 0),
        }),
      );
    }

    await Promise.all(fullfillAppointmentsInDay);

    await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      providerId: 'provider00',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
