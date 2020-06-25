import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe("List Day's Provider Availability", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it("should be able to list day's provider availability", async () => {
    await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 20, 10).getTime());

    const availability = await listProviderDayAvailability.execute({
      providerId: 'provider00',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: true },
        { hour: 15, available: true },
        { hour: 16, available: true },
        { hour: 17, available: false },
      ]),
    );
  });
});
