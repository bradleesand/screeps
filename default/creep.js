Creep.prototype.refill = function() {
    var source = this.pos.findClosestByRange(FIND_SOURCES);
    var harvest = this.harvest(source);
    if(harvest == ERR_NOT_IN_RANGE) {
        this.moveTo(source);
    } else
    if(harvest == ERR_NOT_ENOUGH_RESOURCES ||
        this.carry.energy === this.carryCapacity) {
        this.memory.refill = false;
    }
};