Structure.prototype.needsRepair = function(name) {
    return this.hits < this.hitsMax / 2;
};

StructureWall.prototype.needsRepair = function(name) {
    return ((this.hits < 50) && (this.hits < this.hitsMax));
};