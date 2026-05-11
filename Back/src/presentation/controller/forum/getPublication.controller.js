
class getPublicationController {
  // Constructor method for publication
  constructor (getPublicationUseCase) {
    this.getPublicationUseCase = getPublicationUseCase;
  }

  // Method to get a publication along with its interactions
  async getPublication (request, response) {
    try {
      const { idPublication } = request.params;
      const publication = await this.getPublicationUseCase.execute({ idPublication });
      // Makes sure the dto returned was usefull
      if (publication.dto.success === true) {
        response.status(200).json({ success: true, dto: publication.dto });
      }
      else {
        response.status(404).json({ success: false, dto: publication.dto });
      }

    } catch (err) {
      response.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = getPublicationController;