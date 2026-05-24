const deletePublicationUseCase = require('../../../Back/src/application/usecase/forum/deletePublicationUseCase');
const { deleteFromS3 } = require('../../../Back/src/infrastructure/external/s3.config.js');

// mock s3 service
jest.mock('../../../Back/src/infrastructure/external/s3.config.js', () => ({
  deleteFromS3: jest.fn()
}), { virtual: true });

describe('deletePublicationUseCase', () => {
  let forumRepository, interactionRepository, useCase;

  beforeEach(() => {
    forumRepository = { 
      findById: jest.fn(),
      deletePublication: jest.fn()
    };
    interactionRepository = { 
      deleteAllFromPublication: jest.fn() 
    };
    
    useCase = new deletePublicationUseCase(forumRepository, interactionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  // Check for idPublication, necessary for delete
  test('throw an error if idPublication is missing', async () => {
    await expect(useCase.execute({}))
      .rejects.toThrow('idPublication es requerido');
  });
  
  //Flow 2.1, publication deleted already
  test('throw an error if the post was already deleted / not found (Flow 2.1)', async () => {
    forumRepository.findById.mockResolvedValue(null); 
    
    await expect(useCase.execute({ idPublication: 999 }))
      .rejects.toThrow('Publicación no encontrada'); 
  });

  //Flow 3.1, fails to delete interactions, fails to delete publication
  test('throw an error if it fails to delete the post in DB (Flow 3.1)', async () => {
    forumRepository.findById.mockResolvedValue({ idPublication: 1 });
    
    interactionRepository.deleteAllFromPublication.mockResolvedValue(true);
    
    forumRepository.deletePublication.mockResolvedValue(false);
    
    await expect(useCase.execute({ idPublication: 1 }))
      .rejects.toThrow('No se pudo eliminar la publicación');
  });

  //Happy path
  test('Happy path', async () => {
    const mockPublication = { 
      idPublication: 1, 
      image: 'ruta/de/imagen.jpg' 
    };
    
    forumRepository.findById.mockResolvedValue(mockPublication);
    interactionRepository.deleteAllFromPublication.mockResolvedValue(true);
    forumRepository.deletePublication.mockResolvedValue(true);

    const result = await useCase.execute({ idPublication: 1 });

    expect(result).toEqual({ 
      success: true, 
      message: 'Publicación eliminada' 
    });

    expect(forumRepository.findById).toHaveBeenCalledWith({ idPublication: 1 });
    expect(interactionRepository.deleteAllFromPublication).toHaveBeenCalledWith({ idPublication: 1 });
    expect(forumRepository.deletePublication).toHaveBeenCalledWith({ idPublication: 1 });

    expect(deleteFromS3).toHaveBeenCalledWith('ruta/de/imagen.jpg');
    expect(deleteFromS3).toHaveBeenCalledTimes(1); 
  });
});
