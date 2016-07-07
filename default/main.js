var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

Structure.prototype.needsRepair = function(name) {
    return this.hits < this.hitsMax / 2;
};

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if(harvesters.length < 1) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
    } else
    if(upgraders.length < 1) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
    } else
    if(builders.length < 1) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}