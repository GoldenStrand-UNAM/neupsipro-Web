class usersController {
    constructor (consultLogbookUseCase) {
        this.consultLogbookUseCase = consultLogbookUseCase;
    }

    // Consult one logbook
    async getLogbook (req, res) {
        try {
            const {id_user} = req.params;

            const logbook = await this.consultLogbookUseCase.execute({id_user});

            return res.status(200).json({
                message: "Bitácora consultada correctamente",
                data: logbook,
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = usersController;