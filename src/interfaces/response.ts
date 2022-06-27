export class ResponseRoute {
    routeId: number;
    steps: Point[];
    maximun_distance?: number;
    private cant_steps?: number;

    constructor() {
        this.routeId = Date.now();
        this.maximun_distance = 0;
        this.cant_steps = 0;
        this.steps = [];
    }

    addSteep(point: number[], distance: number, id: number) {
        this.cant_steps++
        this.steps.push({
            point: point,
            id: id
        })
        this.maximun_distance += distance
    }
}

export interface Point {
    point: number[];
    id: number;
}
