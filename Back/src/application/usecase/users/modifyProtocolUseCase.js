
const enumProtocol = { CLINICAL: 'Clinical', RESEARCH: 'Research' };
 
class modifyProtocolUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }
 
  async execute ({ id_user, protocol }) {
     
    // Verify the user exists before updating
    const snapshot = await this.userRepository.fetchUserSnapshot({ id_user });
    if (!snapshot) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
 
    const updated = await this.userRepository.editUserProtocol({
      id_user,
      protocol: protocol,
    });
 
    return updated;
  }
}
 
module.exports = modifyProtocolUseCase;