const ModifyStatusUsecase = require('../../../Back/src/application/usecase/users/modifystateUseCase');

describe('modifyStatusUsecase', () => {

   beforeEach(() => {
      userRepository = { editUserState: jest.fn()};
      useCase = new ModifyStatusUsecase(userRepository);
   })

   test ('the status is changed correctly', async () => {
      userRepository.editUserState.mockResolvedValue({id:"u-001", state: "Stand by"});
      const result = await useCase.execute({id_user:"u-001", state:"Stand by"});
      expect(userRepository.editUserState).toHaveBeenCalledWith({id_user:"u-001", state:"Stand by"});
      expect(result).toEqual({id:"u-001", state: "Stand by"})
   });

   test('no status is sent', async() => {
      userRepository.editUserState.mockRejectedValue(new Error("No se pudo actualizar el estatus del usuario"));
      const result = await useCase.execute({id_user:"u-001", state:""});
      expect(userRepository.editUserState).not.toHaveBeenCalled();
      expect(result).not.toEqual({id:"u-001", state: ""});
   });

   test('sent with invalid user', async() =>{
      userRepository.editUserState.mockRejectedValue(new Error("No se pudo actualizar el estatus del usuario"));
      await expect(useCase.execute({id_user:"u-4441", state:"Stand By"})).rejects.toThrow('No se pudo actualizar el estatus del usuario');
   })
});