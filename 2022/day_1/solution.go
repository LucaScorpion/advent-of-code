package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

type bag struct {
	calories []int
	total    int
}

func main() {
	stdin := bufio.NewScanner(os.Stdin)
	lines := make([]string, 0)
	for stdin.Scan() {
		lines = append(lines, stdin.Text())
	}

	bags := []bag{{
		calories: make([]int, 0),
		total:    0,
	}}
	for _, line := range lines {
		if line == "" {
			bags = append(bags, bag{
				calories: make([]int, 0),
				total:    0,
			})
			continue
		}

		lastBag := &bags[len(bags)-1]
		num, _ := strconv.ParseInt(line, 10, strconv.IntSize)
		lastBag.calories = append(lastBag.calories, int(num))
		lastBag.total += int(num)
	}

	sort.Slice(bags, func(i, j int) bool {
		return bags[i].total > bags[j].total
	})

	fmt.Printf("Elf with most calories: %d\n", bags[0].total)
	fmt.Printf("Total of top three elves calories: %d\n", bags[0].total+bags[1].total+bags[2].total)
}
