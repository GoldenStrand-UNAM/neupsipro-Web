const PostFinancialInterviewUseCase = require('../../../Back/src/application/usecase/initialInterview/postFinancialInterviewUseCase');

describe('PostFinancialInterviewUseCase', () => {
  let mockFinancialInterviewRepository;
  let useCase;

  beforeEach(() => {
    mockFinancialInterviewRepository = {
      fetchRelation: jest.fn(),
      saveFinancialSection: jest.fn(),
      fetchFinancialProgress: jest.fn(),
      updateFinancialProgress: jest.fn(),
      fetchInterviewProgress: jest.fn(),
      updateInterviewProgress: jest.fn(),
    };

    useCase = new PostFinancialInterviewUseCase(mockFinancialInterviewRepository);

    mockFinancialInterviewRepository.fetchRelation.mockResolvedValue([
      [{ id_user_relation: 'relation-1' }],
    ]);

    mockFinancialInterviewRepository.saveFinancialSection.mockResolvedValue({
      saved: true,
    });

    mockFinancialInterviewRepository.fetchFinancialProgress.mockResolvedValue([
      [
        {
          income_expenses_completed: 0,
          esc_completed: 0,
          amai_completed: 0,
          results_completed: 0,
        },
      ],
    ]);
  });

  const validFinancialSituationBody = {
    incomes: {
      incomeExtra: 500,
      financialType: 'Beca',
      salaryBefore: 10000,
      salaryAfter: 8000,
      totalIncomes: 9500,
    },
    expenses: {
      foodExpenses: 1000,
      rentExpenses: 2000,
      servicesExpenses: 500,
      gasExpenses: 400,
      educationExpenses: 800,
      wardrobeExpenses: 300,
      medicalExpenses: 700,
      transportExpenses: 600,
      creditcardExpenses: 200,
      phoneExpenses: 250,
      othersExpenses: 150,
      economicSituation: 'Estable',
      numEconomicDependents: 2,
      totalExpenses: 6900,
    },
    contributors: [
      {
        name: 'Juan Pérez',
        relation: 'Padre',
        income: 1000,
      },
    ],
  };

  const validEscBody = {
    minIncome: 5000,
    ocupation: 1,
    familyExpenses: 40,
    housing: {
      realRight: 1,
      housingType: 1,
      publicServices: 1,
      inhomeServices: 1,
      constructionMaterial: 1,
      numBedrooms: 2,
      personsPerBedroom: 2,
    },
    familyConditions: {
      treatmentTime: 1,
      otherProblems: 1,
      familyHealth: 1,
    },
    total: 80,
    level: 'Medio',
  };

  const validAmaiBody = {
    lastStudies: 4,
    numBathrooms: 2,
    numCar: 1,
    hasInternet: 1,
    hasWorked: 1,
    hasBedroom: 1,
    total: 120,
    level: 'C+',
  };

  const validResultsBody = {
    protesisBudget: 25000,
    notes: 'Usuario candidato a apoyo financiero.',
  };

  describe('Happy Path', () => {
    test('must save financial situation substep 1', async () => {
      const result = await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 1,
        body: validFinancialSituationBody,
      });

      expect(mockFinancialInterviewRepository.fetchRelation).toHaveBeenCalledWith({
        id_user: 'user-1',
      });

      expect(mockFinancialInterviewRepository.saveFinancialSection).toHaveBeenCalledWith({
        subStep: 1,
        id_user_relation: 'relation-1',
        completed: true,
        data: expect.objectContaining({
          incomes: expect.objectContaining({
            incomeExtra: 500,
            financialType: 'Beca',
            salaryBefore: 10000,
            salaryAfter: 8000,
            totalIncomes: 9500,
          }),
          expenses: expect.objectContaining({
            economicSituation: 'Estable',
            numEconomicDependents: 2,
          }),
          contributors: [
            {
              name: 'Juan Pérez',
              relation: 'Padre',
              income: 1000,
            },
          ],
        }),
      });

      expect(result).toEqual({
        current_section: 2,
        saved: true,
      });
    });

    test('must save ESC government substep 2', async () => {
      const result = await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 2,
        body: validEscBody,
      });

      expect(mockFinancialInterviewRepository.saveFinancialSection).toHaveBeenCalledWith({
        subStep: 2,
        id_user_relation: 'relation-1',
        completed: true,
        data: expect.objectContaining({
          minIncome: 5000,
          ocupation: 1,
          familyExpenses: 40,
          socioeconomicLevel: 'Medio',
          total: 80,
        }),
      });

      expect(result).toEqual({
        current_section: 3,
        saved: true,
      });
    });

    test('must save AMAI substep 3', async () => {
      const result = await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 3,
        body: validAmaiBody,
      });

      expect(mockFinancialInterviewRepository.saveFinancialSection).toHaveBeenCalledWith({
        subStep: 3,
        id_user_relation: 'relation-1',
        completed: true,
        data: expect.objectContaining({
          lastStudies: 4,
          numBathrooms: 2,
          numCar: 1,
          hasInternet: 1,
          hasWorked: 1,
          hasBedroom: 1,
          total: 120,
          socioeconomicLevel: 'C+',
        }),
      });

      expect(result).toEqual({
        current_section: 4,
        saved: true,
      });
    });

    test('must save results substep 4', async () => {
      const result = await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 4,
        body: validResultsBody,
      });

      expect(mockFinancialInterviewRepository.saveFinancialSection).toHaveBeenCalledWith({
        subStep: 4,
        id_user_relation: 'relation-1',
        completed: true,
        data: expect.objectContaining({
          protesisBudget: 25000,
          notes: 'Usuario candidato a apoyo financiero.',
        }),
      });

      expect(result).toEqual({
        current_section: 5,
        saved: true,
      });
    });

    test('must update financial and initial interview progress when financial section is complete', async () => {
      mockFinancialInterviewRepository.fetchFinancialProgress.mockResolvedValue([
        [
          {
            income_expenses_completed: 1,
            esc_completed: 1,
            amai_completed: 1,
            results_completed: 1,
          },
        ],
      ]);

      mockFinancialInterviewRepository.fetchInterviewProgress.mockResolvedValue([
        [
          {
            status: 'in_progress',
            identification_completed: 1,
            financial_completed: 1,
            symptoms_completed: 1,
          },
        ],
      ]);

      await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 4,
        body: validResultsBody,
      });

      expect(mockFinancialInterviewRepository.updateFinancialProgress).toHaveBeenCalledWith({
        id_user_relation: 'relation-1',
      });

      expect(mockFinancialInterviewRepository.updateInterviewProgress).toHaveBeenCalledWith({
        id_user_relation: 'relation-1',
        status: 'completed',
      });
    });
  });

  describe('Edge Cases', () => {
    test('must save financial situation as incomplete when required fields are missing', async () => {
      const incompleteBody = {
        ...validFinancialSituationBody,
        incomes: {
          ...validFinancialSituationBody.incomes,
          salaryBefore: null,
        },
      };

      const result = await useCase.executeUpdate({
        id_user: 'user-1',
        step: 'financial',
        subStep: 1,
        body: incompleteBody,
      });

      expect(mockFinancialInterviewRepository.saveFinancialSection).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: false,
        })
      );

      expect(result).toEqual({
        current_section: 2,
        saved: true,
      });
    });

    test('must throw error if step is not financial', async () => {
      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'identification',
          subStep: 1,
          body: validFinancialSituationBody,
        })
      ).rejects.toThrow('Section not found');

      expect(mockFinancialInterviewRepository.saveFinancialSection).not.toHaveBeenCalled();
    });

    test('must throw error if subStep is invalid', async () => {
      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'financial',
          subStep: 99,
          body: validFinancialSituationBody,
        })
      ).rejects.toThrow('Invalid section');

      expect(mockFinancialInterviewRepository.saveFinancialSection).not.toHaveBeenCalled();
    });

    test('must throw error if money value is negative', async () => {
      const body = {
        ...validFinancialSituationBody,
        incomes: {
          ...validFinancialSituationBody.incomes,
          salaryBefore: -1,
        },
      };

      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'financial',
          subStep: 1,
          body,
        })
      ).rejects.toThrow('no puede ser negativo');

      expect(mockFinancialInterviewRepository.saveFinancialSection).not.toHaveBeenCalled();
    });

    test('must throw error if money value is greater than max allowed', async () => {
      const body = {
        ...validFinancialSituationBody,
        incomes: {
          ...validFinancialSituationBody.incomes,
          salaryBefore: 1000001,
        },
      };

      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'financial',
          subStep: 1,
          body,
        })
      ).rejects.toThrow('no puede superar');

      expect(mockFinancialInterviewRepository.saveFinancialSection).not.toHaveBeenCalled();
    });

    test('must throw error if initial interview relation does not exist', async () => {
      mockFinancialInterviewRepository.fetchRelation.mockResolvedValue([[]]);

      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'financial',
          subStep: 1,
          body: validFinancialSituationBody,
        })
      ).rejects.toThrow('Initial interview relation not found');

      expect(mockFinancialInterviewRepository.saveFinancialSection).not.toHaveBeenCalled();
    });
  });

  describe('Error Case', () => {
    test('must spread error if repository fails while saving section', async () => {
      mockFinancialInterviewRepository.saveFinancialSection.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        useCase.executeUpdate({
          id_user: 'user-1',
          step: 'financial',
          subStep: 1,
          body: validFinancialSituationBody,
        })
      ).rejects.toThrow('Database error');
    });
  });
});