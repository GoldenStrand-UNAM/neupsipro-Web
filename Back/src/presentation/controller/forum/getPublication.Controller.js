const getPublicationUseCase = require("../../../application/usecase/forum/getPublicationUseCase");

class getPublicationController {
    constructor (getPublicationUseCase) {
        this.getPublicationUseCase = getPublicationUseCase;
    }

    async getPublication (request, response) {
        try{
            const {idPublication} = request.params;
            const publication = await this.getPublicationUseCase.execute({idPublication});
            console.log("Aqui va lo que busco")
            console.log(publication);
            response.render('forum/detailPublication',{
                activePage: 'foro',
                data: publication,
            })
        } catch (err) {
            response.status(500).json({error: err.message})
        }
    }
}

module.exports = getPublicationController;