package main

import (
	"aoc2022/utils"
	"fmt"
	"strings"
)

type section struct {
	low  int
	high int
}

func main() {
	lines := utils.ReadStdinLines()

	pairs := make([][2]section, 0)
	for _, line := range lines {
		sectionStrings := strings.Split(line, ",")
		leftNums := strings.Split(sectionStrings[0], "-")
		rightNums := strings.Split(sectionStrings[1], "-")

		pairs = append(pairs, [2]section{
			{
				low:  utils.ParseInt(leftNums[0]),
				high: utils.ParseInt(leftNums[1]),
			},
			{
				low:  utils.ParseInt(rightNums[0]),
				high: utils.ParseInt(rightNums[1]),
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
