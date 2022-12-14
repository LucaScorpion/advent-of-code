package main

import (
	"aoc2022/utils"
	"container/list"
	"fmt"
)

type position struct {
	x int
	y int
}

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

	partOne(grid, startPos, goalPos)
	partTwo(grid, goalPos)
}

func partOne(grid [][]int, startPos, goalPos position) {
	seen := make(map[position]bool)
	seen[startPos] = true
	queue := list.New()
	queue.PushBack(startPos)
	dist := make(map[position]int)
	dist[startPos] = 0

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(position)

		if cur == goalPos {
			break
		}

		curHeight := grid[cur.y][cur.x]

		for _, next := range nextSteps(cur) {
			if !seen[next] && inBounds(next, grid) && grid[next.y][next.x] <= curHeight+1 {
				seen[next] = true
				queue.PushBack(next)
				dist[next] = dist[cur] + 1
			}
		}
	}

	fmt.Printf("Shortest path to top: %d\n", dist[goalPos])
}

func partTwo(grid [][]int, goalPos position) {
	seen := make(map[position]bool)
	seen[goalPos] = true
	queue := list.New()
	queue.PushBack(goalPos)
	dist := make(map[position]int)
	dist[goalPos] = 0
	var foundPos position

	for {
		front := queue.Front()
		queue.Remove(front)
		cur := front.Value.(position)

		curHeight := grid[cur.y][cur.x]

		if curHeight == 0 {
			foundPos = cur
			break
		}

		for _, next := range nextSteps(cur) {
			if !seen[next] && inBounds(next, grid) && grid[next.y][next.x] >= curHeight-1 {
				seen[next] = true
				queue.PushBack(next)
				dist[next] = dist[cur] + 1
			}
		}
	}

	fmt.Printf("Shortest possible hike: %d\n", dist[foundPos])
}

func nextSteps(cur position) []position {
	return []position{
		{
			x: cur.x + 1,
			y: cur.y,
		},
		{
			x: cur.x - 1,
			y: cur.y,
		},
		{
			x: cur.x,
			y: cur.y + 1,
		},
		{
			x: cur.x,
			y: cur.y - 1,
		},
	}
}

func inBounds(pos position, grid [][]int) bool {
	return pos.x >= 0 && pos.y >= 0 && pos.y < len(grid) && pos.x < len(grid[pos.y])
}
