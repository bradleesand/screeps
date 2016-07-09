var config = {
  workers: [
    {
      role: 'harvester',
      limit: 1
    }, {
      role: 'upgrader',
      limit: 3
    }, {
      role: 'builder',
      limit: 5
    }
  ],
  parts: {
    CARRY: 50,
    WORK: 100,
    MOVE: 50
  }
};

var buildWorker = function (spawn, role) {
  var extensions = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_EXTENSION;
    }}).length;
  var energy = 300 + extensions * 50;
  var body = [];
  var failed;

  while (energy > 0 && failed < _.size(config.parts)) {
    var part = _.keys(config.parts)[body.length % _.size(config.parts)];
    var cost = config.parts[part];
    if(energy - cost >= 0) {
      body.push(part);
    } else {
      failed++;
    }
  }

  return spawn.createCreep(body, undefined, {role: role});
};

var spawn = {
  spawn: function (spawn) {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var worker =
      _.sortBy(
          _.filter(
            _.map(config.workers, (worker) => {
              return {
                role: worker.role,
                limit: worker.limit,
                count: _.filter(Game.creeps, (creep) =>
                    creep.memory.role == worker.role).length
              };
            }),
            (worker) => worker.count < worker.limit),
          'count')[0];

    if (worker) {
      buildWorker(spawn, worker.role);
    }
  }
};

module.exports = spawn;
