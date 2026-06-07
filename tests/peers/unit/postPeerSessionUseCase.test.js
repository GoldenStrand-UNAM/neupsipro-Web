const PostPeerSessionUseCase = require('../../../Back/src/application/usecase/peers/postPeerSessionUseCase');

describe('PostPeerSessionUseCase — Unit Tests', () => {
    let mockPeerSessionRepository;
    let useCase;

    const validSession = {
        responsable: 'Juan Pérez',
        title: 'Sesión de apoyo',
        note: 'Nota de prueba',
        session_date: '01/01/2024',
        men_count: 3,
        women_count: 2,
    };

    const savedRow = {
        id_peer_session: 's-1',
        responsable: 'Juan Pérez',
        title: 'Sesión de apoyo',
        note: 'Nota de prueba',
        session_date: '01/01/2024',
        men_count: 3,
        women_count: 2,
    };

    beforeEach(() => {
        mockPeerSessionRepository = {
            postSession: jest.fn(),
        };
        useCase = new PostPeerSessionUseCase(mockPeerSessionRepository);
    });

    // --- sanitization ---

    test('trims whitespace from string fields', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue(savedRow);

        await useCase.execute({
            ...validSession,
            responsable: '  Juan Pérez  ',
            title: '  Sesión de apoyo  ',
        });

        const called = mockPeerSessionRepository.postSession.mock.calls[0][0];
        expect(called.responsable).toBe('Juan Pérez');
        expect(called.title).toBe('Sesión de apoyo');
    });

    test('converts blank strings to null after trim', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue(savedRow);

        await useCase.execute({ ...validSession, note: '   ' });

        const called = mockPeerSessionRepository.postSession.mock.calls[0][0];
        expect(called.note).toBeNull();
    });

    test('does not modify non-string values', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue(savedRow);

        await useCase.execute(validSession);

        const called = mockPeerSessionRepository.postSession.mock.calls[0][0];
        expect(called.men_count).toBe(3);
        expect(called.women_count).toBe(2);
    });

    // --- validation ---

    test('throws an error if responsable is missing', async () => {
        const { responsable, ...rest } = validSession;

        await expect(useCase.execute(rest))
            .rejects.toThrow('El responsable es obligatorio');
    });

    test('throws an error if responsable exceeds 80 characters', async () => {
        await expect(useCase.execute({ ...validSession, responsable: 'a'.repeat(81) }))
            .rejects.toThrow('El responsable no puede exceder 80 caracteres');
    });

    test('throws an error if title is missing', async () => {
        const { title, ...rest } = validSession;

        await expect(useCase.execute(rest))
            .rejects.toThrow('El título es obligatorio');
    });

    test('throws an error if title exceeds 100 characters', async () => {
        await expect(useCase.execute({ ...validSession, title: 'a'.repeat(101) }))
            .rejects.toThrow('El título no puede exceder 100 caracteres');
    });

    test('throws an error if note exceeds 500 characters', async () => {
        await expect(useCase.execute({ ...validSession, note: 'a'.repeat(501) }))
            .rejects.toThrow('La nota no puede exceder 500 caracteres');
    });

    test('accepts a session without a note', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue({ ...savedRow, note: null });
        const { note, ...rest } = validSession;

        const result = await useCase.execute(rest);

        expect(result.note).toBeNull();
    });

    test('throws an error if session_date is missing', async () => {
        const { session_date, ...rest } = validSession;

        await expect(useCase.execute(rest))
            .rejects.toThrow('La fecha es obligatoria');
    });

    test('throws an error if session_date has an invalid format', async () => {
        await expect(useCase.execute({ ...validSession, session_date: 'no-es-fecha' }))
            .rejects.toThrow('La fecha no es válida');
    });

    test('throws an error if session_date is in the future', async () => {
        await expect(useCase.execute({ ...validSession, session_date: '01/01/2099' }))
            .rejects.toThrow('La fecha debe ser válida, anterior o igual a hoy y posterior a 1900');
    });

    test('throws an error if session_date is before 1900', async () => {
        await expect(useCase.execute({ ...validSession, session_date: '01/01/1899' }))
            .rejects.toThrow('La fecha debe ser válida, anterior o igual a hoy y posterior a 1900');
    });

    test('throws an error if men_count is negative', async () => {
        await expect(useCase.execute({ ...validSession, men_count: -1 }))
            .rejects.toThrow('El conteo de hombres debe ser un entero entre 0 y 999');
    });

    test('throws an error if women_count exceeds 999', async () => {
        await expect(useCase.execute({ ...validSession, women_count: 1000 }))
            .rejects.toThrow('El conteo de mujeres debe ser un entero entre 0 y 999');
    });

    test('throws an error if there are no attendees', async () => {
        await expect(useCase.execute({ ...validSession, men_count: 0, women_count: 0 }))
            .rejects.toThrow('La sesión debe tener al menos un asistente');
    });

    test('accumulates multiple validation errors into a single message', async () => {
        await expect(useCase.execute({ session_date: '01/01/2024', men_count: 1, women_count: 1 }))
            .rejects.toThrow('El responsable es obligatorio. El título es obligatorio');
    });

    test('does not call the repository if validation fails', async () => {
        await expect(useCase.execute({})).rejects.toThrow();

        expect(mockPeerSessionRepository.postSession).not.toHaveBeenCalled();
    });

    // --- happy path ---

    test('calls the repository once with the validated data', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue(savedRow);

        await useCase.execute(validSession);

        expect(mockPeerSessionRepository.postSession).toHaveBeenCalledTimes(1);
    });

    test('returns a DTO with the correct text fields', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue(savedRow);

        const result = await useCase.execute(validSession);

        expect(result.title).toBe('Sesión de apoyo');
        expect(result.responsable).toBe('Juan Pérez');
        expect(result.note).toBe('Nota de prueba');
    });

    test('returns null for note when the session has no note', async () => {
        mockPeerSessionRepository.postSession.mockResolvedValue({ ...savedRow, note: null });
        const { note, ...rest } = validSession;

        const result = await useCase.execute(rest);

        expect(result.note).toBeNull();
    });

    // --- error handling ---

    test('propagates repository errors to the caller', async () => {
        mockPeerSessionRepository.postSession.mockRejectedValue(new Error('DB error'));

        await expect(useCase.execute(validSession)).rejects.toThrow('DB error');
    });
});