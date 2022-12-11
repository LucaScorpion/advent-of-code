package main

import (
	"fmt"
	"io"
	"os"
	"sort"
	"strconv"
	"strings"
)

type monkey struct {
	items        []int
	operator     rune
	rightOperand string
	testDivBy    int
	testTrue     int
	testFalse    int
	inspectCount int
}

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	monkeyParts := strings.Split(strings.TrimSpace(string(bytes)), "\n\n")

	monkeys := make([]*monkey, 0)
	monkeysAgain := make([]*monkey, 0)
	for _, part := range monkeyParts {
		lines := strings.Split(part, "\n")

		m := monkey{
			items:        parseInts(strings.Split(lines[1][18:], ", ")),
			operator:     rune(lines[2][23]),
			rightOperand: lines[2][25:],
			testDivBy:    parseInt(lines[3][21:]),
			testTrue:     parseInt(lines[4][29:]),
			testFalse:    parseInt(lines[5][30:]),
		}
		monkeys = append(monkeys, &m)

		m2 := m
		monkeysAgain = append(monkeysAgain, &m2)
	}

	allDivisors := 1
	for _, m := range monkeys {
		allDivisors *= m.testDivBy
	}

	for turn := 0; turn < 20; turn++ {
		for _, m := range monkeys {
			for range m.items {
				item, targetMonkey := m.inspectFirstItem(allDivisors, true)
				monkeys[targetMonkey].items = append(monkeys[targetMonkey].items, item)
			}
		}
	}
	sort.Slice(monkeys, func(i, j int) bool {
		return monkeys[i].inspectCount > monkeys[j].inspectCount
	})
	fmt.Printf("Monkey business part 1: %d\n", monkeys[0].inspectCount*monkeys[1].inspectCount)

	for turn := 0; turn < 10000; turn++ {
		for _, m := range monkeysAgain {
			for range m.items {
				item, targetMonkey := m.inspectFirstItem(allDivisors, false)
				monkeysAgain[targetMonkey].items = append(monkeysAgain[targetMonkey].items, item)
			}
		}
	}
	sort.Slice(monkeysAgain, func(i, j int) bool {
		return monkeysAgain[i].inspectCount > monkeysAgain[j].inspectCount
	})
	fmt.Printf("Monkey business part 2: %d\n", monkeysAgain[0].inspectCount*monkeysAgain[1].inspectCount)
}

func (m *monkey) inspectFirstItem(allDivisors int, reduceWorry bool) (int, int) {
	m.inspectCount++

	newWorry := applyOperation(m.items[0], m.operator, m.rightOperand)
	if reduceWorry {
		newWorry /= 3
	} else {
		newWorry %= allDivisors
	}
	m.items = m.items[1:]

	newMonkey := m.testFalse
	if newWorry%m.testDivBy == 0 {
		newMonkey = m.testTrue
	}

	return newWorry, newMonkey
}

func applyOperation(item int, operator rune, operand string) int {
	rightValue := item
	if operand != "old" {
		rightValue = parseInt(operand)
	}

	result := item
	switch operator {
	case '*':
		result *= rightValue
	case '+':
		result += rightValue
	default:
		panic("Unknown operator")
	}

	return result
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func parseInts(parts []string) []int {
	result := make([]int, len(parts))
	for i, part := range parts {
		result[i] = parseInt(part)
	}
	return result
}
