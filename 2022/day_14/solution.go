package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"aoc2022/utils/position"
	"fmt"
	"strings"
)

var sandSpawn = position.Position{
	X: 500,
	Y: 0,
}

type tile rune

const (
	ROCK tile = '#'
	SAND tile = 'o'
)

type grid map[position.Position]tile

func main() {
	lines := utils.ReadStdinLines()
	rockPaths := make([][]position.Position, len(lines))

	for i, line := range lines {
		parts := strings.Split(line, " -> ")
		path := make([]position.Position, len(parts))

		for j, part := range parts {
			path[j] = position.Parse(part)
		}

		rockPaths[i] = path
	}

	cells := make(grid)
	abyssY := 0

	for _, path := range rockPaths {
		for i, point := range path {
			if i == len(path)-1 {
				break
			}
			nextPoint := path[i+1]

			dPos := position.Position{
				X: intMath.ClampUnit(nextPoint.X - point.X),
				Y: intMath.ClampUnit(nextPoint.Y - point.Y),
			}

			drawPoint := point
			for drawPoint != nextPoint {
				cells[drawPoint] = ROCK
				drawPoint = position.Add(drawPoint, dPos)
				abyssY = intMath.Max(abyssY, drawPoint.Y)
			}
			cells[drawPoint] = ROCK
			abyssY = intMath.Max(abyssY, drawPoint.Y)
		}
	}

	sandUnits := 0
	for ; !dropSand(cells, abyssY); sandUnits++ {
	}

	fmt.Printf("Units of sand: %d\n", sandUnits)
}

func dropSand(cells grid, abyssY int) bool {
	sandPos := sandSpawn

	for {
		nextPos := step(cells, sandPos)

		if nextPos == sandPos {
			cells[nextPos] = SAND
			break
		}

		if nextPos.Y >= abyssY {
			return true
		}

		sandPos = nextPos
	}

	return false
}

func step(cells grid, sandPos position.Position) position.Position {
	deltas := []position.Position{
		{X: 0, Y: 1},
		{X: -1, Y: 1},
		{X: 1, Y: 1},
	}

	for _, delta := range deltas {
		nextPos := position.Position{
			X: sandPos.X + delta.X,
			Y: sandPos.Y + delta.Y,
		}

		if isFree(cells, nextPos) {
			return nextPos
		}
	}

	return sandPos
}

func isFree(cells grid, pos position.Position) bool {
	_, ok := cells[pos]
	return !ok
}
