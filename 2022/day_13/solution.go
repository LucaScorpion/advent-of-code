package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"encoding/json"
	"fmt"
	"sort"
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

	packets := make([]any, 0)
	for _, block := range blocks {
		rawPair := strings.Split(block, "\n")

		var left any
		json.Unmarshal([]byte(rawPair[0]), &left)
		packets = append(packets, left)

		var right any
		json.Unmarshal([]byte(rawPair[1]), &right)
		packets = append(packets, right)
	}

	sum := 0
	for i := 0; i < len(packets); i += 2 {
		if isCorrect(packets[i], packets[i+1]) {
			sum += i/2 + 1
		}
	}
	fmt.Printf("Sum of indices of ordered pairs: %d\n", sum)

	packets = append(packets, divPacket(2))
	packets = append(packets, divPacket(6))

	sort.Slice(packets, func(i, j int) bool {
		return isCorrect(packets[i], packets[j])
	})

	divTwo := 0
	divSix := 0
	for i, packet := range packets {
		if isDivPacket(packet, 2) {
			divTwo = i + 1
		}
		if isDivPacket(packet, 6) {
			divSix = i + 1
		}
	}
	fmt.Printf("Decoder key: %d\n", divTwo*divSix)
}

func divPacket(num float64) any {
	return []any{[]any{num}}
}

func isDivPacket(packet any, num float64) bool {
	if outer, ok := packet.([]any); ok && len(outer) == 1 {
		if inner, ok := outer[0].([]any); ok && len(inner) == 1 {
			if val, ok := inner[0].(float64); ok {
				return val == num
			}
		}
	}
	return false
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
