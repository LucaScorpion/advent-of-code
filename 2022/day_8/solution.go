package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

type tree struct {
	height  int
	visible bool
}

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	grid := make([][]*tree, len(lines))

	for y, line := range lines {
		grid[y] = make([]*tree, len(line))

		for x, char := range line {
			grid[y][x] = &tree{
				height:  parseInt(string(char)),
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
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func max(left, right int) int {
	if left > right {
		return left
	}
	return right
}
