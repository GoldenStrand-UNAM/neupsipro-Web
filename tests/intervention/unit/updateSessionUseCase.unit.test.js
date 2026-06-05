// ===================== MOCKS =============================================

const mockInterventionRepository = {
  findByUser: jest.fn(),
  findSessionById: jest.fn(),
  updateSession: jest.fn(),
};

// ===================== SUBJECT UNDER TEST ================================

const updateSessionUseCase = require('../../../Back/src/application/usecase/interventions/updateSessionUseCase');

// ===================== HELPERS ===========================================

const validData = () => ({
  id_user: 'user-123',
  id_session: 'session-456',
  session_date: '2024-06-01',
  session_number: '1',
  objectives: 'Test objectives',
  development: 'Test development',
  dqp_task: 'Test task',
});

const mockIntervention = {
  idIntervention: 'intervention-789',
  userId: 'user-123',
};

const mockSession = {
  idSession: 'session-456',
  idIntervention: 'intervention-789',
  sessionNumber: 1,
};

// ===================== TESTS =============================================

afterAll(() => jest.clearAllMocks());

describe('UNIT — updateSessionUseCase', () => {
  let useCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new updateSessionUseCase(mockInterventionRepository);
  });

  // ---------------------------------------------------------------
  // Casos de éxito
  // ---------------------------------------------------------------

  describe('success cases', () => {
    test('should successfully update a session with all valid data', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = validData();
      const result = await useCase.execute(data);

      expect(result).toEqual({
        success: true,
        message: 'Sesión actualizada',
      });
      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith({
        id_session: 'session-456',
        session_number: '1',
        session_date: '2024-06-01',
        objectives: 'Test objectives',
        development: 'Test development',
        dqp_task: 'Test task',
      });
    });

    test('should successfully update a session with only required fields', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        id_user: 'user-123',
        id_session: 'session-456',
        session_date: '2024-06-01',
      };

      const result = await useCase.execute(data);

      expect(result).toEqual({
        success: true,
        message: 'Sesión actualizada',
      });
      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith({
        id_session: 'session-456',
        session_number: null,
        session_date: '2024-06-01',
        objectives: null,
        development: null,
        dqp_task: null,
      });
    });

    test('should trim whitespace from string fields', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        session_number: '  5  ',
        objectives: '  trimmed objectives  ',
      };

      await useCase.execute(data);

      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith(
        expect.objectContaining({
          session_number: '5',
          objectives: 'trimmed objectives',
        })
      );
    });

    test('should convert null or empty strings to null', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        session_number: '',
        objectives: null,
        development: '',
      };

      await useCase.execute(data);

      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith(
        expect.objectContaining({
          session_number: null,
          objectives: null,
          development: null,
        })
      );
    });
  });

  // ---------------------------------------------------------------
  // Validaciones de campos requeridos
  // ---------------------------------------------------------------

  describe('required fields validation', () => {
    test('should throw error when id_user is missing', async () => {
      const data = {
        ...validData(),
        id_user: null,
      };

      await expect(useCase.execute(data)).rejects.toThrow('id_user es requerido');
    });

    test('should throw error when id_user is empty string', async () => {
      const data = {
        ...validData(),
        id_user: '',
      };

      await expect(useCase.execute(data)).rejects.toThrow('id_user es requerido');
    });

    test('should throw error when id_session is missing', async () => {
      const data = {
        ...validData(),
        id_session: null,
      };

      await expect(useCase.execute(data)).rejects.toThrow('id_session es requerido');
    });

    test('should throw error when id_session is empty string', async () => {
      const data = {
        ...validData(),
        id_session: '',
      };

      await expect(useCase.execute(data)).rejects.toThrow('id_session es requerido');
    });

    test('should throw error when session_date is missing', async () => {
      const data = {
        ...validData(),
        session_date: null,
      };

      await expect(useCase.execute(data)).rejects.toThrow('La fecha de la sesión es requerida');
    });

    test('should throw error when session_date is empty string', async () => {
      const data = {
        ...validData(),
        session_date: '',
      };

      await expect(useCase.execute(data)).rejects.toThrow('La fecha de la sesión es requerida');
    });
  });

  // ---------------------------------------------------------------
  // Validaciones de session_number
  // ---------------------------------------------------------------

  describe('session_number validation', () => {
    test('should throw error when session_number contains non-digit characters', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        session_number: '12abc',
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'El número de sesión solo puede contener dígitos'
      );
    });

    test('should throw error when session_number exceeds 20 characters', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        session_number: '123456789012345678901', // 21 digits
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'El número de sesión no puede superar los 20 caracteres'
      );
    });

    test('should allow exactly 20 character session_number', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        session_number: '12345678901234567890', // exactly 20 digits
      };

      const result = await useCase.execute(data);

      expect(result.success).toBe(true);
      expect(mockInterventionRepository.updateSession).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Validaciones de longitud de campos
  // ---------------------------------------------------------------

  describe('text fields length validation', () => {
    test('should throw error when objectives exceeds 2000 characters', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        objectives: 'a'.repeat(2001),
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'Los objetivos no pueden superar los 2000 caracteres'
      );
    });

    test('should throw error when development exceeds 2000 characters', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        development: 'b'.repeat(2001),
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'El desarrollo no puede superar los 2000 caracteres'
      );
    });

    test('should throw error when dqp_task exceeds 2000 characters', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        dqp_task: 'c'.repeat(2001),
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'El DQP / tarea terapéutica no puede superar los 2000 caracteres'
      );
    });

    test('should allow exactly 2000 characters in objectives', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        objectives: 'a'.repeat(2000),
      };

      const result = await useCase.execute(data);

      expect(result.success).toBe(true);
    });

    test('should allow exactly 2000 characters in development', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        development: 'b'.repeat(2000),
      };

      const result = await useCase.execute(data);

      expect(result.success).toBe(true);
    });

    test('should allow exactly 2000 characters in dqp_task', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        dqp_task: 'c'.repeat(2000),
      };

      const result = await useCase.execute(data);

      expect(result.success).toBe(true);
    });
  });

  // ---------------------------------------------------------------
  // Validaciones de fechas
  // ---------------------------------------------------------------

  describe('date validation', () => {
    test('should throw error when session_date is after year 2100', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);

      const data = {
        ...validData(),
        session_date: '2101-01-01',
      };

      await expect(useCase.execute(data)).rejects.toThrow(
        'La fecha de la sesión no puede ser posterior al año 2100'
      );
    });

    test('should allow session_date on 2100-12-31', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        session_date: '2100-12-31',
      };

      const result = await useCase.execute(data);

      expect(result.success).toBe(true);
    });
  });

  // ---------------------------------------------------------------
  // Validaciones de repositorio
  // ---------------------------------------------------------------

  describe('repository validation', () => {
    test('should throw error when intervention is not found', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(null);

      const data = validData();

      await expect(useCase.execute(data)).rejects.toThrow(
        'No existe intervención activa'
      );
    });

    test('should throw error when session is not found', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(null);

      const data = validData();

      await expect(useCase.execute(data)).rejects.toThrow(
        'La sesión no existe o no pertenece a este usuario'
      );
    });

    test('should throw error when session does not belong to the intervention', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue({
        ...mockSession,
        idIntervention: 'different-intervention',
      });

      const data = validData();

      await expect(useCase.execute(data)).rejects.toThrow(
        'La sesión no existe o no pertenece a este usuario'
      );
    });

    test('should throw error when update fails in repository', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(false);

      const data = validData();

      await expect(useCase.execute(data)).rejects.toThrow(
        'No se pudo actualizar la sesión'
      );
    });
  });

  // ---------------------------------------------------------------
  // Comportamiento de normalizacion
  // ---------------------------------------------------------------

  describe('normalization behavior', () => {
    test('should normalize all text fields to null if not provided', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        id_user: 'user-123',
        id_session: 'session-456',
        session_date: '2024-06-01',
      };

      await useCase.execute(data);

      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith({
        id_session: 'session-456',
        session_number: null,
        session_date: '2024-06-01',
        objectives: null,
        development: null,
        dqp_task: null,
      });
    });

    test('should not normalize required fields', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);

      const data = {
        id_user: '',
        id_session: 'session-456',
        session_date: '2024-06-01',
      };

      await expect(useCase.execute(data)).rejects.toThrow('id_user es requerido');
    });

    test('should preserve numeric strings as strings in session_number', async () => {
      mockInterventionRepository.findByUser.mockResolvedValue(mockIntervention);
      mockInterventionRepository.findSessionById.mockResolvedValue(mockSession);
      mockInterventionRepository.updateSession.mockResolvedValue(true);

      const data = {
        ...validData(),
        session_number: '007', // leading zeros
      };

      await useCase.execute(data);

      expect(mockInterventionRepository.updateSession).toHaveBeenCalledWith(
        expect.objectContaining({
          session_number: '007',
        })
      );
    });
  });
});
