class ExceptionsDTO {

  static fromEntity (entity) {

    const groupedExceptions = {};

    entity.exceptions.forEach(exception => {

      if (!groupedExceptions[exception.permissions]) {
        groupedExceptions[exception.permissions] = [];
      }

      groupedExceptions[exception.permissions].push(exception.permited_action);
    });

    return groupedExceptions;
  }
}

module.exports = ExceptionsDTO;
