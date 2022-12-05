package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type rucksack struct {
	items          string
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
			items:          line,
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

	badgePrio := 0
	for i := 0; i < len(rucksacks); i += 3 {
		rucksack := rucksacks[i]
		for _, item := range rucksack.items {
			if i2 := strings.IndexRune(rucksacks[i+1].items, item); i2 > -1 {
				if i3 := strings.IndexRune(rucksacks[i+2].items, item); i3 > -1 {
					badgePrio += priority(item)
					break
				}
			}
		}
	}
	fmt.Printf("Total priority of badge items: %d\n", badgePrio)
}

func priority(item rune) int {
	// 97 == a
	if item >= 97 {
		return int(item) - 96
	}

	// 65 == A
	return int(item) - 38
}
