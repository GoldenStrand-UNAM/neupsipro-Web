const app = require('../Back/src/app.js');
const getPublicationUseCase = require('../Back/src/application/usecase/getPublicationUseCase.js')
const request = require('supertest')



describe('Routes GET /forum', () => {
    test('Must return status 200', async () => {
        const response = await request(app).get('/forum').send();
        expect(response.statusCode).toBe(200);
    })
})



describe('UseCase: getPublicationUseCase', () => {
    test('Returns the wanted post', async () => {
        const mockForumRepository = {
            getPublication: jest.fn().mockResolvedValue({ id: '1', title: 'Post de prueba' }),
        };

        const useCase = new  getPublicationUseCase(mockForumRepository);
        const result = await useCase.execute('1');

        expect(result.title).toBe('Post de prueba');
        expect(mockForumRepository.getPublication).toHaveBeenCalledWith('1');
});

    test('If no id was sent, returns error', async () => {
        const mockForumRepository = {
            getPublication: jest.fn(),
        };

        const useCase = new  getPublicationUseCase(mockForumRepository);
        await expect(useCase.execute('')).rejects.toThrow("Missing ID");
        expect(mockForumRepository.getPublication).not.toHaveBeenCalled();


});

});