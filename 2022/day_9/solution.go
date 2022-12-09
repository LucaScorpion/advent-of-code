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

	headPos := position{}
	tailPos := position{}
	tailVisited := make(map[position]bool)
	tailVisited[tailPos] = true

	for _, step := range steps {
		headPos = moveDir(headPos, step)
		tailPos = followHead(tailPos, headPos)
		tailVisited[tailPos] = true
	}

	fmt.Printf("Tail visited %d positions.\n", len(tailVisited))
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
