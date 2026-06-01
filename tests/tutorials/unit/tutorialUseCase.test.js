const tutorialUseCase = require('../../../Back/src/application/usecase/tutorial/getTutorialUseCase');

describe('tutorialUseCase', () => {
  let mockTutorialRepository;
  let useCase;

  beforeEach(() => {
    mockTutorialRepository = {
      getByPage: jest.fn(),
    };

    useCase = new tutorialUseCase(mockTutorialRepository);
  });

  describe('Happy Path', () => {
    test('must call repository w/right page and return steps', async () => {
      const pageToSearch = 'forum';
      const steps = [
        { step_order: 1, title: 'Bienvenido', content: 'Foro' },
        { step_order: 2, title: 'Nueva publicación', content: 'Da click aquí' }
      ];
      
      mockTutorialRepository.getByPage.mockResolvedValue(steps);

      const result = await useCase.execute(pageToSearch);

      expect(mockTutorialRepository.getByPage).toHaveBeenCalledTimes(1);
      expect(mockTutorialRepository.getByPage).toHaveBeenCalledWith(pageToSearch);
      expect(result).toEqual(steps);
    });
  });

  describe('Edge Case', () => {
    test('spread error if repository fails', async () => {
      const pageToSearch = 'forum';
      const databaseError = new Error('Conexión perdida con la BD');
      
      mockTutorialRepository.getByPage.mockRejectedValue(databaseError);

      await expect(useCase.execute(pageToSearch)).rejects.toThrow('Conexión perdida con la BD');
      
      expect(mockTutorialRepository.getByPage).toHaveBeenCalledWith(pageToSearch);
    });
  });
});