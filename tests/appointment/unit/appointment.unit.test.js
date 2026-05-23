const CreateUseCase = require('../../../Back/src/application/usecase/appointments/createAppointmentUseCase');
const DeleteUseCase = require('../../../Back/src/application/usecase/appointments/deleteAppointmentUseCase');

describe('UNIT - Appointment Use Cases', () => {
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            findUpcomingByUser: jest.fn(),
            findOrCreateUserRelation: jest.fn(),
            createAppointment: jest.fn(),
            deleteUpcomingByUser: jest.fn(),
        };
    });

    describe('Create Appointment', () => {
        test('should throw error if fields are missing', async () => {
            const useCase = new CreateUseCase(mockRepo);
            await expect(useCase.execute({ id_user: '1' }))
                .rejects.toThrow('Todos los campos son requeridos');
        });

        test('should throw error if user already has a future appointment', async () => {
            mockRepo.findUpcomingByUser.mockResolvedValue({ id: 'existing' });
            const useCase = new CreateUseCase(mockRepo);
            const data = { id_user: '1', id_clinic_user: '2', issue: 'Checkup', date_time: '2026-10-10' };
            await expect(useCase.execute(data))
                .rejects.toThrow('Este usuario ya tiene una cita programada para el futuro');
        });
    });

    describe('Delete Appointment', () => {
        test('should throw error if no appointment exists to delete', async () => {
            mockRepo.findUpcomingByUser.mockResolvedValue(null);
            const useCase = new DeleteUseCase(mockRepo);
            await expect(useCase.execute({ id_user: '1' }))
                .rejects.toThrow('No hay una cita próxima para eliminar');
        });
    });
});
