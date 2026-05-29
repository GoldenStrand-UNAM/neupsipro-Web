const PostUserUseCase =
require('../../../Back/src/application/usecase/users/postUserUseCase');

describe('createUserUseCase',()=>{

    let userRepository;
    let hashingService;
    let useCase;

    beforeEach(()=>{

        userRepository = {
            postUser:jest.fn()
        };

        hashingService = {
            hash:jest.fn()
        };

        useCase = new PostUserUseCase(
            userRepository,
            hashingService
        );
    });

    const validPayload = () => ({
        userName:'juan123',
        firstName:'Juan',
        lastnameP:'Perez',
        lastnameM:'Lopez',
        birthdate:'01/01/2000',
        password:'123456',
        assigned:'clinic-001',
        phase:'Protésico',
        basePathology:'Diabetes',
        otherPathology:null,
        modality:'Presencial',
        profilePhoto:null,
        referenceNumber:'REF001',
        amputationDate:'01/01/2023',
        amputationLevel:'Rodilla',
        laterality:'Diestra',
        prosthetist:'CPO Juan David Orozco',
        neuroEntryDate:'01/01/2024',
        pairs:'Sí asiste',
        sex:'Masculino'
    });

    test('creates a new user successfully',async()=>{

        hashingService.hash.mockResolvedValue('hashedPassword');

        userRepository.postUser.mockResolvedValue({idUser:'u-001'});

        const result = await useCase.execute(validPayload());

        expect(hashingService.hash).toHaveBeenCalledWith('123456');

        expect(userRepository.postUser).toHaveBeenCalled();

        expect(result).toBeDefined();
    });

    test('throws error when required fields are missing',async()=>{

        const invalid = validPayload();

        invalid.basePathology ='';

        await expect(useCase.execute(invalid)
        ).rejects.toThrow('La etiología de amputación debe llenarse');
    });


    test('rejects SQL injection in userName', async()=>{

        const invalid = validPayload();

        invalid.userName = "' OR '1'='1; DROP TABLE users; --";

        await expect(useCase.execute(invalid)).rejects.toThrow();
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

    test('rejects 10,000-character userName', async()=>{

        const invalid = validPayload();

        invalid.userName ='a'.repeat(10000);

        await expect(useCase.execute(invalid)).rejects.toThrow();
    });

});