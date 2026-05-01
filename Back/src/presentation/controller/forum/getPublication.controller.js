

class getPublicationController {
    // Constructor method for publication
    constructor (getPublicationUseCase) {
        this.getPublicationUseCase = getPublicationUseCase;
    }

    // Method to get a publication along with its interactions
    async getPublication (request, response) {
        try{
            const {idPublication} = request.params;
            const publication = await this.getPublicationUseCase.execute({idPublication});
            // Makes sure the dto returned was usefull
            if (publication.dto.success === true) {
                response.render('partials/PublicationContent',{
                activePage: 'foro',
                data: publication,
            }, (err, html) => {
                if (err) throw err;
                response.status(200).json({ success: true, html: html });
            }); 
            }
            else{
                response.status(404).json({ success: false, html: ''})
            }
            
        } catch (err) {
            response.status(500).json({success: false, error: err.message})
        }
    }
}

module.exports = getPublicationController;