require('structure');
var roleUpgrader = require('role.upgrader');

var validBuildTarget = function(buildTarget) {
    return ((buildTarget instanceof Structure && buildTarget.needsRepair())
            || (buildTarget instanceof ConstructionSite));
};

var findBuildTarget = function(creep) {
    var buildTarget = Game.getObjectById(creep.memory.buildTarget);
    
    if(!validBuildTarget(buildTarget)) {
        buildTarget = (creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.needsRepair();
            }}) ||
            creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES));
            
        if (buildTarget) {
            creep.memory.buildTarget = buildTarget.id;
            delete creep.memory.sentNotification;
        } else {
            if (!creep.memory.sentNotification) {
                Game.notify(creep.name + ' cannot build.');
                creep.memory.sentNotification = true;
            }
            delete creep.memory.buildTarget;
        }
    }
    
    return buildTarget;
};

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var buildTarget = findBuildTarget(creep);

        if (buildTarget) {
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
            }
        } else {
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleBuilder;