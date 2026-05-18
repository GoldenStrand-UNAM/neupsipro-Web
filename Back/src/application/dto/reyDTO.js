class ReyResultsDTO {
  constructor ({
    idResults,
    idTest,
    status,
    dateApplied,
    rc,
    mcp,
    mlp,
    notes,
  }) {
    this.idResults   = idResults;
    this.idTest      = idTest;
    this.status      = status;
    this.dateApplied = dateApplied;
    this.rc          = {
      score: rc.score   ?? null,
      pc: rc.pc      ?? null,
      time: rc.time    ?? null,
      pcTime: rc.pcTime  ?? null,
    };
    this.mcp         = {
      score: mcp.score  ?? null,
      pc: mcp.pc     ?? null,
      time: mcp.time   ?? null,
      pcTime: mcp.pcTime ?? null,
    };
    this.mlp         = {
      score: mlp.score  ?? null,
      pc: mlp.pc     ?? null,
      time: mlp.time   ?? null,
      pcTime: mlp.pcTime ?? null,
    };
    this.notes       = notes ?? null;
  }
}

module.exports = ReyResultsDTO;
