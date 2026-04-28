const getPublicationUseCase = require("../../../application/usecase/forum/getPublicationUseCase");

class getPublicationController {
    constructor (getPublicationUseCase) {
        this.getPublicationUseCase = getPublicationUseCase;
    }

    async getPublication (request, response) {
        try{
            const {idPublication} = request.params;
            const publication = await this.getPublicationUseCase.execute({idPublication});
            if (publication.dto.success === true) {
                response.render('partials/PublicationContent',{
                activePage: 'foro',
                data: publication,
            }, (err, html) => {
                if (err) throw err;
                response.status(200).json({ success: true, html: html });
            }); 
            }
            
        } catch (err) {
            response.status(500).json({success: false, error: err.message})
        }
    }
}

module.exports = getPublicationController;