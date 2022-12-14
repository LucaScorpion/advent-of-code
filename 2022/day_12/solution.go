package main

import (
	"aoc2022/utils"
	"container/list"
	"fmt"
)

func main() {
	lines := utils.ReadStdinLines()
	grid := make([][]int, len(lines))
	var startPos utils.Position
	var goalPos utils.Position

	for y, line := range lines {
		grid[y] = make([]int, len(line))

		for x, char := range line {
			if char == 'S' {
				char = 'a'
				startPos = utils.Position{
					X: x,
					Y: y,
				}
			}
			if char == 'E' {
				char = 'z'
				goalPos = utils.Position{
					X: x,
					Y: y,
				}
			}

			grid[y][x] = int(char - 'a')
		}
	}

	partOne(grid, startPos, goalPos)
	partTwo(grid, goalPos)
}

func partOne(grid [][]int, startPos, goalPos utils.Position) {
	seen := make(map[utils.Position]bool)
	seen[startPos] = true
	queue := list.New()
	queue.PushBack(startPos)
	dist := make(map[utils.Position]int)
	dist[startPos] = 0

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(utils.Position)

		if cur == goalPos {
			break
		}

		curHeight := grid[cur.Y][cur.X]

		for _, next := range nextSteps(cur) {
			if !seen[next] && inBounds(next, grid) && grid[next.Y][next.X] <= curHeight+1 {
				seen[next] = true
				queue.PushBack(next)
				dist[next] = dist[cur] + 1
			}
		}
	}

	fmt.Printf("Shortest path to top: %d\n", dist[goalPos])
}

func partTwo(grid [][]int, goalPos utils.Position) {
	seen := make(map[utils.Position]bool)
	seen[goalPos] = true
	queue := list.New()
	queue.PushBack(goalPos)
	dist := make(map[utils.Position]int)
	dist[goalPos] = 0
	var foundPos utils.Position

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(utils.Position)

		curHeight := grid[cur.Y][cur.X]

		if curHeight == 0 {
			foundPos = cur
			break
		}

		for _, next := range nextSteps(cur) {
			if !seen[next] && inBounds(next, grid) && grid[next.Y][next.X] >= curHeight-1 {
				seen[next] = true
				queue.PushBack(next)
				dist[next] = dist[cur] + 1
			}
		}
	}

	fmt.Printf("Shortest possible hike: %d\n", dist[foundPos])
}

func nextSteps(cur utils.Position) []utils.Position {
	return []utils.Position{
		{
			X: cur.X + 1,
			Y: cur.Y,
		},
		{
			X: cur.X - 1,
			Y: cur.Y,
		},
		{
			X: cur.X,
			Y: cur.Y + 1,
		},
		{
			X: cur.X,
			Y: cur.Y - 1,
		},
	}
}

func inBounds(pos utils.Position, grid [][]int) bool {
	return pos.X >= 0 && pos.Y >= 0 && pos.Y < len(grid) && pos.X < len(grid[pos.Y])
}
