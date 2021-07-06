enum Direction {
    NORTH = 'NORTH',
    EAST = 'EAST',
    SOUTH = 'SOUTH',
    WEST = 'WEST',
}

interface Emplacement {
    line: number,
    column: number
}

enum Cell {
    WHITE,
    BLACK,
}

interface Ant {
    direction: Direction;
    position: Emplacement;
}

const nextDirection = (cell: Cell, direction: Direction) => {
    if (Cell.WHITE === cell) {
        return turnRight(direction);
    }
    return turnLeft(direction);


};

const nextPosition = (direction: Direction, position: Emplacement): Emplacement => {
    let line = position.line
    let column = position.column
    if (direction === Direction.EAST) {
        column += 1
    }
    if (direction === Direction.NORTH) {
        line += 1
    }
    if (direction === Direction.WEST) {
        column -= 1
    }
    if (direction === Direction.SOUTH) {
        line -= 1
    }
    return {line, column}

};

const move = (ant: Ant, cell: Cell): Ant => {
    const direction = nextDirection(cell, ant.direction);
    const position = nextPosition(direction, ant.position)
    return ({direction, position})
};
const RIGTH_DIRECTION: Record<Direction, Direction> = {
    [Direction.NORTH]: Direction.EAST,
    [Direction.EAST]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.WEST,
    [Direction.WEST]: Direction.NORTH,
}
const LEFT_DIRECTION: Record<Direction, Direction> = {
    [Direction.NORTH]: Direction.WEST,
    [Direction.WEST]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.EAST,
    [Direction.EAST]: Direction.NORTH,
}

const turnRight = (direction: Direction): Direction => RIGTH_DIRECTION[direction];
const turnLeft = (direction: Direction): Direction => LEFT_DIRECTION[direction];

interface Generation {
    ant: Ant;
    blackCells: Emplacement[]

}
const cellColor=(blackCells:Emplacement[],position:Emplacement):Cell=>{
if (blackCells.some(black=> isSamePosition(black, position))){
    return Cell.BLACK
}
return Cell.WHITE
}

const isSamePosition = (black: Emplacement, position: Emplacement):boolean => black.column === position.column && black.line === position.line;

const nextBlackCells=(blackCells:Emplacement[],position:Emplacement,cell:Cell):Emplacement[]=>{
    if (cell===Cell.WHITE){
        return[...blackCells,position]
    }
    return blackCells.filter(black=>!isSamePosition(black, position))
}
const nextGeneration = (generation: Generation) => {
    const antPosition=generation.ant.position
    const cell=cellColor(generation.blackCells,generation.ant.position)
    const ant=move(generation.ant,cell)
    return{
        ant,
        blackCells:nextBlackCells(generation.blackCells,antPosition,cell)
    }
};

describe('test langtonAnt', () => {
    describe('Direction', () => {
        describe('Move Right', () => {
            it('should move from North to EAST', () => {
                expect(turnRight(Direction.NORTH)).toBe(Direction.EAST)
            });
            it('should move from North to EAST', () => {
                expect(turnRight(Direction.EAST)).toBe(Direction.SOUTH)
            });
            it('should move from North to EAST', () => {
                expect(turnRight(Direction.SOUTH)).toBe(Direction.WEST)
            });
            it('should move from North to EAST', () => {
                expect(turnRight(Direction.WEST)).toBe(Direction.NORTH)
            });

        });
        describe('Move Left', () => {
            it('should move from North to EAST', () => {
                expect(turnLeft(Direction.NORTH)).toBe(Direction.WEST)
            });
            it('should move from North to EAST', () => {
                expect(turnLeft(Direction.WEST)).toBe(Direction.SOUTH)
            });
            it('should move from North to EAST', () => {
                expect(turnLeft(Direction.SOUTH)).toBe(Direction.EAST)
            });
            it('should move from North to EAST', () => {
                expect(turnLeft(Direction.EAST)).toBe(Direction.NORTH)
            });

        });
    });
    describe('Position', () => {
        const START_POSITION = {line: 4, column: 3};
        it('should move to east', () => {

            expect(nextPosition(Direction.EAST, START_POSITION)).toEqual({line: 4, column: 4})
        });
        it('should move to NORTH', () => {

            expect(nextPosition(Direction.NORTH, START_POSITION)).toEqual({line: 5, column: 3})
        });
        it('should move to SOUTH', () => {

            expect(nextPosition(Direction.SOUTH, START_POSITION)).toEqual({line: 3, column: 3})
        });
        it('should move to WEST', () => {

            expect(nextPosition(Direction.WEST, START_POSITION)).toEqual({line: 4, column: 2})
        });
    });
    describe('Ant', () => {
        it('Should turn right on white cell', () => {
            const ant: Ant = {
                direction: Direction.NORTH,
                position: {
                    line: 4,
                    column: 2
                },
            }

            const movedAnt = move(ant, Cell.WHITE);
            expect(movedAnt.direction).toBe(Direction.EAST)
            expect(movedAnt.position).toEqual<Emplacement>(
                {column: 3, line: 4}
            )
        });
        it('Should turn left on black cell', () => {
            const ant: Ant = {
                direction: Direction.WEST,
                position: {
                    line: 6,
                    column: 7
                }
            }

            const movedAnt = move(ant, Cell.BLACK);
            expect(movedAnt.direction).toBe(Direction.SOUTH)
            expect(movedAnt.position).toEqual<Emplacement>({
                column: 7, line: 5
            })
        });
    });
    describe('Generation', () => {
        const START_GENERATION:Generation = {
            blackCells: [],
            ant: {
                position: {
                    line: 0,
                    column: 0
                },
                direction: Direction.NORTH
            }
        };
        it('should move once ', () => {

            expect(nextGeneration(START_GENERATION)).toEqual<Generation>({
                ant: {
                    position: {
                        line: 0,
                        column: 1
                    },
                    direction: Direction.EAST
                },
                blackCells: [{line: 0, column: 0}]
            })
        });

        it('should move ant twice', () => {

            expect(nextGeneration(nextGeneration(START_GENERATION))).toEqual<Generation>({
                ant: {
                    position: {
                        line: -1,
                        column: 1
                    },
                    direction: Direction.SOUTH
                },
                blackCells: [{line: 0, column: 0},{line: 0, column: 1}]
            })
        });
        it('should move ant twice', () => {

            expect(nextGeneration(nextGeneration(nextGeneration(nextGeneration(nextGeneration(START_GENERATION)))))).toEqual<Generation>({
                ant: {
                    position: {
                        line: 0,
                        column: -1
                    },
                    direction: Direction.WEST
                },
                blackCells: [{line: 0, column: 1},{line: -1, column: 1},{line: -1, column: 0}]
            })
        });
    });
});
