import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe("List Day's Provider Appointments", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to list day's appointments", async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      userId: 'user01',
      provider_id: 'provider00',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    const appointmetns = await listProviderAppointments.execute({
      providerId: 'provider00',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointmetns).toEqual([appointment1, appointment2]);
  });
});
