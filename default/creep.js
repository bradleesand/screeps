Creep.prototype.findSource = function() {
    if (this.memory.role === 'upgrader') {
        return this.room.controller.pos.findClosestByRange(FIND_SOURCES);
    }
    else {
        return this.room.find(FIND_SOURCES)[0];
    }
};

Creep.prototype.refill = function() {
    var source = this.findSource();
    var harvest = this.harvest(source);
    if(harvest == ERR_NOT_IN_RANGE) {
        this.moveTo(source);
    } else
    if(this.carry.energy === this.carryCapacity ||
        (harvest == ERR_NOT_ENOUGH_RESOURCES &&
         this.carry.energy != 0)) {
        this.memory.refill = false;
    }
};