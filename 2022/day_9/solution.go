package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"aoc2022/utils/position"
	"fmt"
	"strings"
)

type step rune

const (
	UP    step = 'U'
	DOWN  step = 'D'
	LEFT  step = 'L'
	RIGHT step = 'R'
)

func main() {
	lines := utils.ReadStdinLines()

	steps := make([]step, 0)
	for _, line := range lines {
		parts := strings.Split(line, " ")
		repeat := intMath.ParseInt(parts[1])

		for i := 0; i < repeat; i++ {
			steps = append(steps, step(parts[0][0]))
		}
	}

	knots := make([]position.Position, 10)
	knotOneVisited := make(map[position.Position]bool)
	knotOneVisited[knots[1]] = true
	lastKnotVisited := make(map[position.Position]bool)
	lastKnotVisited[knots[9]] = true

	for _, step := range steps {
		knots[0] = moveDir(knots[0], step)

		for i := 1; i < len(knots); i++ {
			knots[i] = followHead(knots[i], knots[i-1])

			if i == 1 {
				knotOneVisited[knots[i]] = true
			}
			if i == 9 {
				lastKnotVisited[knots[i]] = true
			}
		}
	}

	fmt.Printf("First knot visited %d positions.\n", len(knotOneVisited))
	fmt.Printf("Last knot visited %d positions.\n", len(lastKnotVisited))
}

func moveDir(pos position.Position, dir step) position.Position {
	if dir == UP {
		return position.Position{
			X: pos.X,
			Y: pos.Y + 1,
		}
	}
	if dir == DOWN {
		return position.Position{
			X: pos.X,
			Y: pos.Y - 1,
		}
	}
	if dir == LEFT {
		return position.Position{
			X: pos.X - 1,
			Y: pos.Y,
		}
	}
	if dir == RIGHT {
		return position.Position{
			X: pos.X + 1,
			Y: pos.Y,
		}
	}
	panic("Unknown direction.")
}

func followHead(tail, head position.Position) position.Position {
	if isAdjacent(tail, head) {
		return tail
	}

	tail.Y += intMath.ClampUnit(head.Y - tail.Y)
	tail.X += intMath.ClampUnit(head.X - tail.X)

	return tail
}

func isAdjacent(a, b position.Position) bool {
	return intMath.Diff(a.X, b.X) <= 1 && intMath.Diff(a.Y, b.Y) <= 1
}
