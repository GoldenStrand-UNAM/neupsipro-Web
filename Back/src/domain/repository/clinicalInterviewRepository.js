
class ClinicalInterviewRepository {

  //helpers
  async fetchRefNum ()            { throw new Error('Not implemented: fetchRefNum'); }
  async fetchRelation ()          { throw new Error('Not implemented: fetchRelation'); }
  async fetchInterviewProgress () { throw new Error('Not implemented: fetchInterviewProgress'); }

  // gets
  async fetchPhysicalConcerns ()  { throw new Error('Not implemented: fetchPhysicalConcerns'); }
  async fetchMotor ()             { throw new Error('Not implemented: fetchMotor'); }
  async fetchSensory ()           { throw new Error('Not implemented: fetchSensory'); }
  async fetchMentalFunctions ()   { throw new Error('Not implemented: fetchMentalFunctions'); }
  async fetchPersonality ()       { throw new Error('Not implemented: fetchPersonality'); }
  async fetchSubstanceUse ()      { throw new Error('Not implemented: fetchSubstanceUse'); }

  // patch
  async saveClinicalSection ()    { throw new Error('Not implemented: saveClinicalSection'); }

  // progress
  async ensureRow ()              { throw new Error('Not implemented: ensureRow'); }
  async updateSymptomsProgress () { throw new Error('Not implemented: updateSymptomsProgress'); }
  async updateInterviewProgress (){ throw new Error('Not implemented: updateInterviewProgress'); }
}

module.exports = ClinicalInterviewRepository;