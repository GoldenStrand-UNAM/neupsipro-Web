const GetForumUseCase = require("../../../application/usecase/getForumUseCase");


// Controller function that handles HTTP request to get forum posts
async function GetForum(request, response) {

  try {
    const { page = 1, limit = 10 } = request.query;

    // Execute the use case to retrieve posts
    const posts = await GetForumUseCase.execute({ page, limit });

    response.status(200).json(posts);

  } catch (error) 
  {

    response.status(500).json({ error: error.message });
  }

}