package main

import (
	"aoc2022/utils"
	"fmt"
)

type position struct {
	x int
	y int
}

type direction rune

const (
	UP    direction = '^'
	DOWN  direction = 'v'
	LEFT  direction = '<'
	RIGHT direction = '>'
)

type path []direction

func main() {
	lines := utils.ReadStdinLines()
	grid := make([][]int, len(lines))
	var startPos position
	var goalPos position

	for y, line := range lines {
		grid[y] = make([]int, len(line))

		for x, char := range line {
			if char == 'S' {
				char = 'a'
				startPos = position{
					x: x,
					y: y,
				}
			}
			if char == 'E' {
				char = 'z'
				goalPos = position{
					x: x,
					y: y,
				}
			}

			grid[y][x] = int(char - 'a')
		}
	}

	paths := make(map[position]path)
	findPath(grid, goalPos, startPos, startPos, make(path, 0), paths)
	fmt.Printf("Shortest path: %d\n", len(paths[goalPos]))
	//for _, s := range paths[goalPos] {
	//	fmt.Print(string(s))
	//}
	//fmt.Println()
}

func findPath(grid [][]int, goalPos, prev, cur position, curPath path, paths map[position]path) {
	// Check if we are out of bounds.
	if cur.y < 0 || cur.y >= len(grid) || cur.x < 0 || cur.x >= len(grid[cur.y]) {
		return
	}

	// Check if we climbed too high.
	prevHeight := grid[prev.y][prev.x]
	curHeight := grid[cur.y][cur.x]
	if curHeight > prevHeight+1 {
		return
	}

	checkPath, pathExists := paths[cur]

	// Check if there is already a shorter path here.
	if pathExists && len(checkPath) < len(curPath) {
		return
	}

	// Save the current path.
	paths[cur] = curPath

	// Check if we are at the goal.
	if cur.x == goalPos.x && cur.y == goalPos.y {
		return
	}

	next := cur

	next.x++
	findPath(grid, goalPos, cur, next, append(curPath, RIGHT), paths)

	next.x -= 2
	findPath(grid, goalPos, cur, next, append(curPath, LEFT), paths)

	next.x++
	next.y++
	findPath(grid, goalPos, cur, next, append(curPath, DOWN), paths)

	next.y -= 2
	findPath(grid, goalPos, cur, next, append(curPath, UP), paths)
}
