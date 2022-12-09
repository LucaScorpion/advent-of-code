package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

type step rune

const (
	UP    step = 'U'
	DOWN  step = 'D'
	LEFT  step = 'L'
	RIGHT step = 'R'
)

type position struct {
	x int
	y int
}

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	steps := make([]step, 0)
	for _, line := range lines {
		parts := strings.Split(line, " ")
		repeat := parseInt(parts[1])

		for i := 0; i < repeat; i++ {
			steps = append(steps, step(parts[0][0]))
		}
	}

	knots := make([]position, 10)
	knotOneVisited := make(map[position]bool)
	knotOneVisited[knots[1]] = true
	lastKnotVisited := make(map[position]bool)
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

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func moveDir(pos position, dir step) position {
	if dir == UP {
		return position{
			x: pos.x,
			y: pos.y + 1,
		}
	}
	if dir == DOWN {
		return position{
			x: pos.x,
			y: pos.y - 1,
		}
	}
	if dir == LEFT {
		return position{
			x: pos.x - 1,
			y: pos.y,
		}
	}
	if dir == RIGHT {
		return position{
			x: pos.x + 1,
			y: pos.y,
		}
	}
	panic("Unknown direction.")
}

func followHead(tail, head position) position {
	if isAdjacent(tail, head) {
		return tail
	}

	tail.y += clampUnit(head.y - tail.y)
	tail.x += clampUnit(head.x - tail.x)

	return tail
}

func isAdjacent(a, b position) bool {
	return diff(a.x, b.x) <= 1 && diff(a.y, b.y) <= 1
}

func diff(a, b int) int {
	return abs(a - b)
}

func abs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func clampUnit(v int) int {
	if v > 1 {
		return 1
	}
	if v < -1 {
		return -1
	}
	return v
}
