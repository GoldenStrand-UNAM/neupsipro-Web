const EditClinicalUserUseCase = require('../../../Back/src/application/usecase/clinical/editClinicalUserUseCase');

const mockRepository = {
  update: jest.fn(),
  findById: jest.fn(),
};

const useCase = new EditClinicalUserUseCase(mockRepository);

describe('UNIT — EditClinicalUserUseCase — Validación de entrada', () => {
  beforeEach(() => jest.clearAllMocks());

  // ─── userId inválido o vacío ───────────────────────────────────────────────

  test('1.1 lanza error cuando userId es undefined', async () => {
    await expect(useCase.execute(undefined, { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('1.2 lanza error cuando userId es string vacío', async () => {
    await expect(useCase.execute('', { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('1.3 lanza error cuando userId es solo espacios en blanco', async () => {
    await expect(useCase.execute('   ', { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  // ─── SQL Injection ─────────────────────────────────────────────────────────

  test('1.1,1 rechaza SQL injection clásico en userId sin llamar al repositorio', async () => {
    await expect(useCase.execute("' OR '1'='1", { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('1.2,2 rechaza DROP TABLE en userId', async () => {
    await expect(useCase.execute('1; DROP TABLE users--', { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('1.3,3 rechaza SQL injection en campos del body sin llamar al repositorio', async () => {
    mockRepository.findById.mockResolvedValue({ id: 'u-1' });

    await expect(useCase.execute('u-1', { affiliation: "' OR '1'='1" }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  // ─── XSS ──────────────────────────────────────────────────────────────────

  test('3.2.1 rechaza script tag en userId', async () => {
    await expect(useCase.execute('<script>alert(1)</script>', { affiliation: 'Tigres' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('3.2.2 rechaza payload XSS en campo affiliation', async () => {
    mockRepository.findById.mockResolvedValue({ id: 'u-1' });

    await expect(useCase.execute('u-1', { affiliation: '<img src=x onerror=alert(1)>' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('3.2.3 rechaza javascript: protocol en cualquier campo de texto', async () => {
    mockRepository.findById.mockResolvedValue({ id: 'u-1' });

    await expect(useCase.execute('u-1', { affiliation: 'javascript:alert(1)' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  // ─── Body vacío o sin campos permitidos ───────────────────────────────────

  test('4.1 lanza error cuando el body es un objeto vacío', async () => {
    await expect(useCase.execute('u-1', {}))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('4.2 lanza error cuando el body es null', async () => {
    await expect(useCase.execute('u-1', null))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('4.3 lanza error cuando el body contiene solo campos no permitidos', async () => {
    await expect(useCase.execute('u-1', { role: 'admin', password: '1234' }))
      .rejects.toThrow();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  test('3.3.1 rechaza emoji en userId', async () => {
  await expect(useCase.execute('u-1😀', { affiliation: 'Tigres' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.3.2 rechaza emoji en affiliation', async () => {
  await expect(useCase.execute('u-1', { affiliation: 'Tigres🔥' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.3.3 rechaza emoji en emergency_contact_name', async () => {
  await expect(useCase.execute('u-1', { emergency_contact_name: '😈John' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.3.4 rechaza emoji en emergency_contact_phone', async () => {
  await expect(useCase.execute('u-1', { emergency_contact_phone: '📞5551234' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.1.1 rechaza tag img como intento de inyectar imagen en affiliation', async () => {
  await expect(useCase.execute('u-1', { affiliation: '<img src="http://evil.com/x.png">' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.1.2 rechaza tag img con onerror en emergency_contact_name', async () => {
  await expect(useCase.execute('u-1', { emergency_contact_name: '<img src=x onerror=alert(1)>' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.1.3 rechaza base64 de imagen embebida en affiliation', async () => {
  await expect(useCase.execute('u-1', { affiliation: 'data:image/png;base64,abc123==' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});

test('3.1.4 rechaza URL de imagen externa en emergency_contact_relation', async () => {
  await expect(useCase.execute('u-1', { emergency_contact_relation: 'http://evil.com/img.jpg' }))
    .rejects.toThrow();
  expect(mockRepository.update).not.toHaveBeenCalled();
});




});