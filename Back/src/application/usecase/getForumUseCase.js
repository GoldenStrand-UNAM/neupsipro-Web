



// application/GetPublicacionesUseCase.js
class GetPublicacionesUseCase {
  constructor(publicacionRepository) {
    // Recibe la interfaz, no la implementación concreta
    this.publicacionRepository = publicacionRepository;
  }

  async execute({ page, limit }) {
    // Aquí irían validaciones de negocio:
    // ¿El usuario tiene permiso? ¿El límite es razonable?
    if (limit > 100) throw new Error("Límite máximo es 100");

    const publicaciones = await this.publicacionRepository.fetchAll({ page, limit });

    // Aquí transformas a DTO (lo que necesita la capa de presentación)
    return publicaciones.map(p => ({
      id: p.id,
      titulo: p.titulo,
      autor: p.autor_nombre,
      fecha: p.created_at,
    }));
  }
}

module.exports = GetPublicacionesUseCase;