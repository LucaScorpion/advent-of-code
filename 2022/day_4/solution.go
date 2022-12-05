package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type section struct {
	low  int
	high int
}

func main() {
	stdin := bufio.NewScanner(os.Stdin)
	lines := make([]string, 0)
	for stdin.Scan() {
		lines = append(lines, stdin.Text())
	}

	pairs := make([][2]section, 0)
	for _, line := range lines {
		sectionStrings := strings.Split(line, ",")
		leftNums := strings.Split(sectionStrings[0], "-")
		rightNums := strings.Split(sectionStrings[1], "-")

		pairs = append(pairs, [2]section{
			{
				low:  parseInt(leftNums[0]),
				high: parseInt(leftNums[1]),
			},
			{
				low:  parseInt(rightNums[0]),
				high: parseInt(rightNums[1]),
			},
		})
	}

	fullOverlapCount := 0
	anyOverlapCount := 0
	for _, p := range pairs {
		if hasFullOverlap(p[0], p[1], true) {
			fullOverlapCount++
		}

		if hasAnyOverlap(p[0], p[1], true) {
			anyOverlapCount++
		}
	}

	fmt.Printf("Pairs with full overlap: %d\n", fullOverlapCount)
	fmt.Printf("Pairs with any overlap: %d\n", anyOverlapCount)
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func hasFullOverlap(left section, right section, trySwap bool) bool {
	if left.low >= right.low && left.low <= right.high && left.high >= right.low && left.high <= right.high {
		return true
	}

	if trySwap {
		return hasFullOverlap(right, left, false)
	}

	return false
}

func hasAnyOverlap(left section, right section, trySwap bool) bool {
	if (left.low >= right.low && left.low <= right.high) || (left.high >= right.low && left.high <= right.high) {
		return true
	}

	if trySwap {
		return hasAnyOverlap(right, left, false)
	}

	return false
}
