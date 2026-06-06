const PostFinancialInterviewController = require('../../../Back/src/presentation/controller/initialInterview/postFinancialInterview.controller');

describe('PostFinancialInterviewController', () => {
  let mockUseCase;
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockUseCase = {
      executeUpdate: jest.fn(),
    };

    controller = new PostFinancialInterviewController(mockUseCase);

    mockReq = {
      params: {
        id_user: 'user-1',
        step: 'financial',
        subStep: '1',
      },
      body: {
        incomes: {
          salaryBefore: 10000,
          salaryAfter: 8000,
        },
        expenses: {
          economicSituation: 'Estable',
          numEconomicDependents: 2,
        },
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    test('must return 200 when financial interview is saved', async () => {
      const useCaseResult = {
        current_section: 2,
        saved: true,
      };

      mockUseCase.executeUpdate.mockResolvedValue(useCaseResult);

      await controller.saveFinancialInterview(mockReq, mockRes);

      expect(mockUseCase.executeUpdate).toHaveBeenCalledWith({
        id_user: 'user-1',
        step: 'financial',
        subStep: 1,
        body: mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Financial interview saved',
        data: useCaseResult,
      });
    });
  });

  describe('Edge Cases', () => {
    test('must return 400 if use case throws validation error', async () => {
      const validationError = new Error('Los valores monetarios no pueden ser negativos');
      validationError.status = 400;

      mockUseCase.executeUpdate.mockRejectedValue(validationError);

      await controller.saveFinancialInterview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Los valores monetarios no pueden ser negativos',
      });
    });

    test('must return 404 if initial interview relation does not exist', async () => {
      const notFoundError = new Error('Initial interview relation not found');
      notFoundError.status = 404;

      mockUseCase.executeUpdate.mockRejectedValue(notFoundError);

      await controller.saveFinancialInterview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Initial interview relation not found',
      });
    });
  });

  describe('Error Case', () => {
    test('must return 500 if unexpected error occurs', async () => {
      mockUseCase.executeUpdate.mockRejectedValue(new Error('Database error'));

      await controller.saveFinancialInterview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
      });
    });
  });
});