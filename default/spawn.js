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
  parts: [
    {
        val: CARRY,
        cost: 50
    }, {
        val: WORK,
        cost: 100
    }, {
        val: MOVE,
        cost: 50
    }
  ]
};

var buildWorker = function (spawn, role) {
  var extensions = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_EXTENSION;
    }}).length;
  var energy = 300 + extensions * 50;
  var body = [];
  var skip = 0;
  
  while (energy > 0 && skip < config.parts.length) {
    var part = config.parts[body.length % config.parts.length];
    if(energy - part.cost >= 0) {
      body.push(part.val);
      energy -= part.cost;
    } else {
      skip++;
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