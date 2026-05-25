class GetTutorialUseCase {
  constructor (tutorialRepository) {
    this.tutorialRepository = tutorialRepository;
  }
  async execute (page) {
    return await this.tutorialRepository.getByPage(page);
  }
}
module.exports = GetTutorialUseCase;
