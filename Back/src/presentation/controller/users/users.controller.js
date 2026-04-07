class usersController {
    constructor (consultLogbookUseCase) {
        this.consultLogbookUseCase = consultLogbookUseCase;
    }

    getLogbook (req, res) {
        try {
            const user_id = 1 // req.params.user_id;

            this.consultLogbookUseCase.execute(user_id);

            return res.status(200).json({
                message: "Bitácora consultada correctamente",
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = usersController;