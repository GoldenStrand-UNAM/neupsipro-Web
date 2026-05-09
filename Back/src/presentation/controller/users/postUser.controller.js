class PostUserController {
    constructor (PostUserUseCase) {
        this.PostUserUseCase = PostUserUseCase;
    }

    async postUser (req, res) {
        try {
            // Extract query params 
            const { id_role = "2", user_name, first_name, lastname_p, lastname_m = null, birthdate, password_hash, assigned, neuro_status, base_pathology, modality, profile_photo = null, reference_number, amputation_date, laterality, prothesist, neuro_entry_date, pairs } = req.body;
            
            //Successful response
            res.status(200).json(result);
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: error.message });
        }
    }

    async postUserPage (req, res) {
        try {
            res.locals.activePage = 'usuario';
            res.render("users/postUser");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports =  PostUserController;