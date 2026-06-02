const { response } = require("../../../app");

class GetPhysicalConcernsController {
  constructor (getPhysicalConcernsUseCase) {
    this.getPhysicalConcernsUseCase = getPhysicalConcernsUseCase;
  }
  getPhysicalConcernsView (req, res) {
    res.status(400).json({ error: 'View not implemented' });
  }

  async getPhysicalConcerns (req, res) {
    try {
      const { idUserRelation} = req.params;
      const result = await this.getPhysicalConcernsUseCase.execute({ idUserRelation });
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetPhysicalConcernsController;
