const PostUserUseCase =
require('../../../Back/src/application/usecase/users/postUserUseCase');

describe('createUserUseCase',()=>{

    let userRepository;
    let useCase;

    beforeEach(()=>{

        userRepository = {
            checkDuplicate: jest.fn(),
            postUser:jest.fn()
        };

        useCase = new PostUserUseCase(
            userRepository
        );
    });

    const validPayload = () => ({
        firstName:'Juan',
        lastnameP:'Perez',
        lastnameM:'Lopez',
        birthdate:'01/01/2000',
        assigned:'clinic-001',
        phase:'Protésico',
        basePathology:'Diabetes',
        otherPathology:null,
        modality:'Presencial',
        profilePhoto:null,
        referenceNumber:'123P-JPG',
        amputationDate:'01/01/2023',
        amputationLevel:'Rodilla',
        laterality:'Diestra',
        prosthetist:'CPO Juan David Orozco',
        neuroEntryDate:'01/01/2024',
        pairs:'Sí asiste',
        sex:'Masculino'
    });

    test('creates a new user successfully',async()=>{
        userRepository.checkDuplicate.mockResolvedValue(null);

        userRepository.postUser.mockResolvedValue({idUser:'u-001'});

        const result = await useCase.execute(validPayload());

        expect(userRepository.postUser).toHaveBeenCalled();

        expect(result).toBeDefined();
    });

    test('throws error when required fields are missing',async()=>{

        const invalid = validPayload();

        invalid.basePathology ='';

        await expect(useCase.execute(invalid)
        ).rejects.toThrow('La etiología de amputación debe llenarse');
    });

    test('rejects XSS payload in firstName', async()=>{

        const invalid = validPayload();

        invalid.firstName = '<script>alert(document.cookie)</script>';

        await expect(useCase.execute(invalid)).rejects.toThrow();
    });
    test('rejects emojis in userName', async()=>{

        const invalid = validPayload();

        invalid.userName ='juan😊';

        await expect(useCase.execute(invalid)).rejects.toThrow();
    });
});