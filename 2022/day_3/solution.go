package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type rucksack struct {
	compartmentOne string
	compartmentTwo string
}

func main() {
	stdin := bufio.NewScanner(os.Stdin)
	lines := make([]string, 0)
	for stdin.Scan() {
		lines = append(lines, stdin.Text())
	}

	rucksacks := make([]rucksack, 0)
	for _, line := range lines {
		halfLen := len(line) / 2
		rucksacks = append(rucksacks, rucksack{
			compartmentOne: line[:halfLen],
			compartmentTwo: line[halfLen:],
		})
	}

	commonItems := make([]rune, 0)
	for _, r := range rucksacks {
		for _, item := range r.compartmentOne {
			if strings.ContainsRune(r.compartmentTwo, item) {
				commonItems = append(commonItems, item)
				break
			}
		}
	}

	totalPrio := 0
	for _, item := range commonItems {
		totalPrio += priority(item)
	}

	fmt.Printf("Total priority of common items: %d\n", totalPrio)
}

func priority(item rune) int {
	// 97 == a
	if item >= 97 {
		return int(item) - 96
	}

	// 65 == A
	return int(item) - 38
}
