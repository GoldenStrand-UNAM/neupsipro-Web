/**
 * ACL exceptions dto
 */
class ExceptionsDTO {
  constructor ({ module_name, consultation, writing, edit, eliminate }) {
    this.moduleName = module_name,
    this.consultation = consultation,
    this.writing = writing,
    this.edit = edit,
    this.eliminate = eliminate;

  }

  static fromEntity (entity) {
    return new ExceptionsDTO ({
      module_name: entity.module_name,
      consultation: entity.consultation,
      writing: entity.writing,
      edit: entity.edit,
      eliminate: entity.eliminate,
    });
  }
}

module.exports = ExceptionsDTO;
