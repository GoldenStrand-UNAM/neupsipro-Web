const tutorialController = require('../../../Back/src/presentation/controller/tutorial/getTutorial.controller');

describe('tutorialController', () => {
  let mockUseCase;
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(), 
    };

    controller = new tutorialController(mockUseCase);

    mockReq = {
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()
    };
  });

  describe('Happy Path', () => {
    test('must return 200 & tutorial steps if page is valid', async () => {
      mockReq.query.page = 'forum';
      const steps = [
        { step_order: 1, title: 'Bienvenido', content: 'Hola' }
      ];
      mockUseCase.execute.mockResolvedValue(steps);

      await controller.getTutorial(mockReq, mockRes);

      expect(mockUseCase.execute).toHaveBeenCalledWith('forum');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(steps);
    });
  });

  describe('Edge Case', () => {
    test('must return 400 if page parameter is not send', async () => {
      mockReq.query = {};

      await controller.getTutorial(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page requerida' });
      expect(mockUseCase.execute).not.toHaveBeenCalled();
    });
  });
});