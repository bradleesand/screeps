var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
require('creep');
var spawn = require('spawn');

module.exports.loop = function () {

    spawn.spawn(Game.spawns.Spawn1);

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
