const DeletePeerSessionUseCase = require('../../../Back/src/application/usecase/peers/deletePeerSessionUseCase');

describe('DeletePeerSessionUseCase — Unit Tests', () => {
    let mockPeerSessionRepository;
    let useCase;

    beforeEach(() => {
      mockPeerSessionRepository = {
            deleteSession: jest.fn(),
        };
        useCase = new DeletePeerSessionUseCase(mockPeerSessionRepository);
    });

    test('Happy Path, the session is deleted without errors', async() => {
      mockPeerSessionRepository.deleteSession.mockResolvedValue({id_peer_session: "s-111"});
      const result = await useCase.execute({idPeerSession: "s-111"});
      expect(result).toEqual({success: true});
    })

    test('The system sends no id for the session to delete', async() => {
      await expect(useCase.execute({})).rejects.toThrow("El identificador de la sesión es obligatorio");
    });

    test('The database founds no id matching the session sent to delete it', async() => {
      mockPeerSessionRepository.deleteSession.mockResolvedValue(null);
      await expect(useCase.execute({ idPeerSession: "s-11" }))
      .rejects.toThrow('La sesión no existe'); 
    }) 

})