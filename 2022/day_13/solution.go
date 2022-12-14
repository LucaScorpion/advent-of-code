package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"encoding/json"
	"fmt"
	"strings"
)

type result int

const (
	CORRECT result = iota
	WRONG
	UNKNOWN
)

func main() {
	blocks := utils.ReadStdinBlocks()

	pairs := make([][2]any, len(blocks))
	for i, block := range blocks {
		rawPair := strings.Split(block, "\n")
		var left any
		var right any
		json.NewDecoder(strings.NewReader(rawPair[0]))

		json.Unmarshal([]byte(rawPair[0]), &left)
		json.Unmarshal([]byte(rawPair[1]), &right)
		pairs[i] = [2]any{left, right}
	}

	sum := 0
	for i, pair := range pairs {
		if isCorrect(pair[0], pair[1]) {
			sum += i + 1
		}
	}

	fmt.Printf("Sum of indices: %d\n", sum)
}

func isCorrect(left, right any) bool {
	result := check(left, right)
	if result == UNKNOWN {
		panic("Unknown result.")
	}
	return result == CORRECT
}

func check(left, right any) result {
	if left == nil || right == nil {
		panic("Cannot check nil values.")
	}

	if isFloat(left) && isFloat(right) {
		return checkInts(int(left.(float64)), int(right.(float64)))
	}

	if !isFloat(left) && !isFloat(right) {
		return checkLists(left.([]any), right.([]any))
	}

	return check(asList(left), asList(right))
}

func checkInts(left, right int) result {
	if left < right {
		return CORRECT
	}
	if left > right {
		return WRONG
	}
	return UNKNOWN
}

func checkLists(left, right []any) result {
	minLen := intMath.Min(len(left), len(right))
	for i := 0; i < minLen; i++ {
		res := check(left[i], right[i])
		if res != UNKNOWN {
			return res
		}
	}

	return checkInts(len(left), len(right))
}

func isFloat(item any) bool {
	_, ok := item.(float64)
	return ok
}

func asList(item any) []any {
	if list, ok := item.([]any); ok {
		return list
	}
	return []any{item}
}
