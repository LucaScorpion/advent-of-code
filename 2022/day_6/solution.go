package main

import (
	"aoc2022/utils"
	"fmt"
	"strings"
)

func main() {
	input := utils.ReadStdinTrimmed()

	fmt.Printf("Packet marker position: %d\n", findMarker(input, 4))
	fmt.Printf("Message marker position: %d\n", findMarker(input, 14))
}

func findMarker(input string, unique int) int {
	for i := unique; i < len(input); i++ {
		if allUnique(input[i-unique : i]) {
			return i
		}
	}
	panic("No marker found!")
}

func allUnique(str string) bool {
	for i := 0; i < len(str); i++ {
		if strings.IndexRune(str, rune(str[i])) != i {
			return false
		}
	}
	return true
}
