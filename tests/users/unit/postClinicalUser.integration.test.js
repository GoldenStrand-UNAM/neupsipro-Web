const PostClinicalUserUseCase =
  require('../../../Back/src/application/usecase/clinical/postClinicalUserUseCase');

describe('PostClinicalUserUseCase', () => {

  let clinicalUserRepository;
  let hashingService;
  let useCase;

  beforeEach(() => {
    clinicalUserRepository = {
      checkDuplicate: jest.fn(),
      postUser: jest.fn()
    };

    hashingService = {
      hash: jest.fn()
    };

    useCase = new PostClinicalUserUseCase(clinicalUserRepository, hashingService);
  });

  const validPayload = () => ({
    idRole: 3,
    firstName: 'Maria',
    lastnameP: 'Gomez',
    lastnameM: 'Lopez',
    birthdate: '01/01/1990',
    email: 'maria@example.com',
    affiliation: 'UNAM',
    activity: 'Fisioterapia',
    startDate: '01/01/2024',
    finishDate: '01/01/2027',
    hours: 40,
    username: 'mgomez',
    password: '123456',
    emergencyContactName: 'Pedro Gomez',
    emergencyContactPhone: '5551234567',
    emergencyContactRelation: 'Padre'
  });

  test('creates a new clinical user successfully', async () => {
    hashingService.hash.mockResolvedValue('hashedPassword');
    clinicalUserRepository.checkDuplicate.mockResolvedValue(null);
    clinicalUserRepository.postUser.mockResolvedValue({ idUser: 'c-001' });

    const result = await useCase.execute(validPayload());

    expect(hashingService.hash).toHaveBeenCalledWith('123456');
    expect(clinicalUserRepository.checkDuplicate).toHaveBeenCalled();
    expect(clinicalUserRepository.postUser).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  test('throws error when user is already registered (duplicate)', async () => {
    hashingService.hash.mockResolvedValue('hashedPassword');
    clinicalUserRepository.checkDuplicate.mockResolvedValue({ id_user: 'existing-001' });

    await expect(useCase.execute(validPayload()))
      .rejects.toThrow('El usuario ya se encuentra registrado.');

    expect(clinicalUserRepository.postUser).not.toHaveBeenCalled();
  });

  test('throws error when firstName is missing', async () => {
    const invalid = validPayload();
    invalid.firstName = '';

    await expect(useCase.execute(invalid)).rejects.toThrow(/nombre/i);
  });

  test('throws error when lastnameP is missing', async () => {
    const invalid = validPayload();
    invalid.lastnameP = '';

    await expect(useCase.execute(invalid)).rejects.toThrow(/apellido paterno/i);
  });

  test('throws error when birthdate has invalid format', async () => {
    const invalid = validPayload();
    invalid.birthdate = 'kjfsleoadkjn';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('throws error when start date has invalid format', async () => {
    const invalid = validPayload();
    invalid.startDate = '32/13/2024';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('throws error when finish date is invalid (not future / wrong format)', async () => {
    const invalid = validPayload();
    invalid.finishDate = 'fecha-invalida';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('throws error when hours exceed maximum allowed', async () => {
    const invalid = validPayload();
    invalid.hours = 100000;

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('throws error when emergency phone has invalid format', async () => {
    const invalid = validPayload();
    invalid.emergencyContactPhone = 'no-es-telefono';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('throws error when affiliation is missing', async () => {
    const invalid = validPayload();
    invalid.affiliation = '';

    await expect(useCase.execute(invalid)).rejects.toThrow(/afiliaci/i);
  });

  test('rejects SQL injection in username', async () => {
    const invalid = validPayload();
    invalid.username = "' OR '1'='1; DROP TABLE users; --";

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('rejects XSS payload in firstName', async () => {
    const invalid = validPayload();
    invalid.firstName = '<script>alert(document.cookie)</script>';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('rejects emojis in username', async () => {
    const invalid = validPayload();
    invalid.username = 'maria😊';

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('rejects 10,000-character username', async () => {
    const invalid = validPayload();
    invalid.username = 'EnalgunLugarDeLaMancha'.repeat(10000);

    await expect(useCase.execute(invalid)).rejects.toThrow();
  });

  test('does not call postUser if validation fails', async () => {
    const invalid = validPayload();
    invalid.firstName = '';

    await expect(useCase.execute(invalid)).rejects.toThrow();
    expect(clinicalUserRepository.postUser).not.toHaveBeenCalled();
    expect(clinicalUserRepository.checkDuplicate).not.toHaveBeenCalled();
  });
});