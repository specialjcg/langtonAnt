import '../style.css';

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
        column += 10
    }
    if (direction === Direction.NORTH) {
        line += 10
    }
    if (direction === Direction.WEST) {
        column -= 10
    }
    if (direction === Direction.SOUTH) {
        line -= 10
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

const cellColor = (blackCells: Emplacement[], position: Emplacement): Cell => {
    if (blackCells.some(black => isSamePosition(black, position))) {
        return Cell.BLACK
    }
    return Cell.WHITE
}

const isSamePosition = (black: Emplacement, position: Emplacement): boolean => black.column === position.column && black.line === position.line;

const nextBlackCells = (blackCells: Emplacement[], position: Emplacement, cell: Cell): Emplacement[] => {
    if (cell === Cell.WHITE) {
        return [...blackCells, position]
    }
    return blackCells.filter(black => !isSamePosition(black, position))
}
const nextGeneration = (generation: Generation) => {
    const antPosition = generation.ant.position
    const cell = cellColor(generation.blackCells, generation.ant.position)
    const ant = move(generation.ant, cell)
    return {
        ant,
        blackCells: nextBlackCells(generation.blackCells, antPosition, cell)
    }
};
const START_GENERATION: Generation = {
    blackCells: [],
    ant: {
        position: {
            line: 500,
            column: 500
        },
        direction: Direction.NORTH
    }
};
const canvas = <HTMLCanvasElement>document.getElementById('clock');
const ctx = canvas.getContext('2d');
let generation = START_GENERATION
for (let i = 0; i < 11000; i++) {



    generation = nextGeneration(generation)
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
}
generation.blackCells.map(pos => {
    ctx.fillStyle = 'green'
    ctx.fillRect(pos.line, pos.column, 10, 10);
});
