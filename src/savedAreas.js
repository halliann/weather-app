
class SelectedAreas {
    constructor() {
        this.list = [];
    }

    addArea(save) {
        const newLocation = new Location();

        this.list.push(newLocation);
    }

    removeArea(unsave) {
        this.list.pop
    }
};