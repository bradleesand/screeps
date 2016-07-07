require('structure');
var roleUpgrader = require('role.upgrader');

var findBuildTarget = function(creep) {
    var buildTarget = (creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.needsRepair();
        }}) ||
        creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES));
        
    if (buildTarget) {
        creep.memory.buildTarget = buildTarget.id;
    } else {
        if (!creep.memory.sentNotification) {
            Game.notify(creep.name + ' cannot build.');
            creep.memory.sentNotification = true;
        }
        delete creep.memory.buildTarget;
        roleUpgrader.run(creep);
    }
    return buildTarget;
};

var validBuildTarget = function(buildTarget) {
    if (buildTarget instanceof String) {
        buildTarget = Game.getObjectById(creep.memory.buildTarget);
    }
    return ((buildTarget instanceof Structure && buildTarget.needsRepair())
            || (buildTarget instanceof ConstructionSite));
};

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.upgrading) {
            roleUpgrader.run(creep);
        } else {
            if(creep.memory.buildTarget && creep.carry.energy == 0) {
                delete creep.memory.buildTarget;
            }
            if(!creep.memory.buildTarget && creep.carry.energy == creep.carryCapacity) {
                findBuildTarget(creep);
            }
            if (creep.memory.buildTarget) {
                var buildTarget = Game.getObjectById(creep.memory.buildTarget);
                if (buildTarget instanceof Structure) {
                    if(creep.repair(buildTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(buildTarget);
                    }
                    if (!buildTarget.needsRepair()) {
                        delete creep.memory.buildTarget;
                    }
                } else if (buildTarget instanceof ConstructionSite) {
                    if(creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(buildTarget);
                    }
                } else {
                    delete creep.memory.buildTarget;
                }
                if (!validBuildTarget(buildTarget)) {
                    findBuildTarget(creep);
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
    	    }
        }
	}
};

module.exports = roleBuilder;