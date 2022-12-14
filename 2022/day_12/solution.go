package main

import (
	"aoc2022/utils"
	"aoc2022/utils/position"
	"container/list"
	"fmt"
)

func main() {
	lines := utils.ReadStdinLines()
	grid := make([][]int, len(lines))
	var startPos position.Position
	var goalPos position.Position

	for y, line := range lines {
		grid[y] = make([]int, len(line))

		for x, char := range line {
			if char == 'S' {
				char = 'a'
				startPos = position.Position{
					X: x,
					Y: y,
				}
			}
			if char == 'E' {
				char = 'z'
				goalPos = position.Position{
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

func partOne(grid [][]int, startPos, goalPos position.Position) {
	seen := make(map[position.Position]bool)
	seen[startPos] = true
	queue := list.New()
	queue.PushBack(startPos)
	dist := make(map[position.Position]int)
	dist[startPos] = 0

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(position.Position)

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

func partTwo(grid [][]int, goalPos position.Position) {
	seen := make(map[position.Position]bool)
	seen[goalPos] = true
	queue := list.New()
	queue.PushBack(goalPos)
	dist := make(map[position.Position]int)
	dist[goalPos] = 0
	var foundPos position.Position

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(position.Position)

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

func nextSteps(cur position.Position) []position.Position {
	return []position.Position{
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

func inBounds(pos position.Position, grid [][]int) bool {
	return pos.X >= 0 && pos.Y >= 0 && pos.Y < len(grid) && pos.X < len(grid[pos.Y])
}
