package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"fmt"
)

type tree struct {
	height  int
	visible bool
}

func main() {
	lines := utils.ReadStdinLines()

	grid := make([][]*tree, len(lines))

	for y, line := range lines {
		grid[y] = make([]*tree, len(line))

		for x, char := range line {
			grid[y][x] = &tree{
				height:  intMath.ParseInt(string(char)),
				visible: false,
			}
		}
	}

	for _, row := range grid {
		maxHeight := -1
		for _, tree := range row {
			if tree.height > maxHeight {
				tree.visible = true
				maxHeight = tree.height
			}
		}

		maxHeight = -1
		for i := len(row) - 1; i >= 0; i-- {
			tree := row[i]
			if tree.height > maxHeight {
				tree.visible = true
				maxHeight = tree.height
			}
		}
	}

	for col := range grid[0] {
		maxHeight := -1
		for _, row := range grid {
			tree := row[col]
			if tree.height > maxHeight {
				tree.visible = true
				maxHeight = tree.height
			}
		}

		maxHeight = -1
		for i := len(grid) - 1; i >= 0; i-- {
			tree := grid[i][col]
			if tree.height > maxHeight {
				tree.visible = true
				maxHeight = tree.height
			}
		}
	}

	totalVisible := 0
	for _, row := range grid {
		for _, tree := range row {
			if tree.visible {
				totalVisible++
			}
		}
	}
	fmt.Printf("Total visible trees: %d\n", totalVisible)

	bestScenicScore := 0
	for y, row := range grid {
		for x := range row {
			bestScenicScore = intMath.Max(bestScenicScore, scenicScore(grid, x, y))
		}
	}
	fmt.Printf("Best scenic score: %d\n", bestScenicScore)
}

func scenicScore(grid [][]*tree, startX, startY int) int {
	viewDists := [4]int{}
	curHeight := grid[startY][startX].height

	for x := startX + 1; x < len(grid[0]); x++ {
		viewDists[0]++
		check := grid[startY][x]
		if check.height >= curHeight {
			break
		}
	}

	for x := startX - 1; x >= 0; x-- {
		viewDists[1]++
		check := grid[startY][x]
		if check.height >= curHeight {
			break
		}
	}

	for y := startY + 1; y < len(grid); y++ {
		viewDists[2]++
		check := grid[y][startX]
		if check.height >= curHeight {
			break
		}
	}

	for y := startY - 1; y >= 0; y-- {
		viewDists[3]++
		check := grid[y][startX]
		if check.height >= curHeight {
			break
		}
	}

	return viewDists[0] * viewDists[1] * viewDists[2] * viewDists[3]
}
