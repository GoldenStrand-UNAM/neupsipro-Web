const getPublicationUseCase = require('../../application/usecase/getPublicationUseCase');
const getInteractionUseCase = require('../../application/usecase/getInteractionUseCase');
const forumRepository = require('../../domain/repository/forumRepository');

exports.consultPublication = async (req, res) => {
    try{
        const {idPublication} = req.params;
        const repository = new forumRepository();
        const usecasePubli = new getPublicationUseCase(repository)
        const usecaseInter = new getInteractionUseCase(repository)
        const publication = await usecasePubli.execute(idPublication);
        const interactions = await usecaseInter.execute(idPublication);
        const combinedResponse = {publication: publication[0], interactions: interactions[0]}
        res.status(200).json(combinedResponse);
    }   catch (err) {
        return res.status(500).json({message: "Failed to fetch publication", error:err.message})
    }
}

exports.consultPublications = (req, res) => {
    res.send("Funcionalidad Pendiente")
}