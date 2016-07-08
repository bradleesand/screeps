var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
require('creep');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if(harvesters.length === 1 && harvesters[0].carryCapacity === 50) {
        Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
    } else
    if(harvesters.length < 1) {
        if(ERR_NOT_ENOUGH_ENERGY === Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'})) {
            Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        }
    } else
    if(upgraders.length < 1) {
        Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
    } else
    if(builders.length < 3) {
        Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.carry.energy === 0) {
            creep.memory.refill = true;
        }
        
        if(creep.memory.refill) {
            creep.refill();
        }
        
        if(!creep.memory.refill) {
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
}