class ChildInterviewRepository {
 
  // helpers
  async fetchRefNum ()            { throw new Error('Not implemented: fetchRefNum'); }
  async fetchRelation ()          { throw new Error('Not implemented: fetchRelation'); }
  async fetchInterviewProgress () { throw new Error('Not implemented: fetchInterviewProgress'); }
 
  // get
  async fetchIdentification ()    { throw new Error('Not implemented: fetchIdentification'); }
  async fetchSiblings ()          { throw new Error('Not implemented: fetchSiblings'); }
  async fetchHeredofamilial ()    { throw new Error('Not implemented: fetchHeredofamilial'); }
  async fetchPathological ()      { throw new Error('Not implemented: fetchPathological'); }
  async fetchPrenatal ()          { throw new Error('Not implemented: fetchPrenatal'); }
  async fetchDevelopment ()       { throw new Error('Not implemented: fetchDevelopment'); }
  async fetchBehavior ()          { throw new Error('Not implemented: fetchBehavior'); }
  async fetchSchoolHistory ()     { throw new Error('Not implemented: fetchSchoolHistory'); }
  async fetchPhysicalExam ()      { throw new Error('Not implemented: fetchPhysicalExam'); }
 
  // patch
  async saveChildSection ()       { throw new Error('Not implemented: saveChildSection'); }
 
  // progress
  async ensureRow ()              { throw new Error('Not implemented: ensureRow'); }
  async updateSymptomsProgress () { throw new Error('Not implemented: updateSymptomsProgress'); }
  async updateInterviewProgress (){ throw new Error('Not implemented: updateInterviewProgress'); }
}
 
module.exports = ChildInterviewRepository;