package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

type columns [][]rune

type move struct {
	amount int
	from   int
	to     int
}

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	input := string(bytes)
	inputParts := strings.Split(input, "\n\n")

	startPosLines := strings.Split(inputParts[0], "\n")
	lastStartPosLine := strings.TrimSpace(startPosLines[len(startPosLines)-1])
	colCount := parseInt(lastStartPosLine[len(lastStartPosLine)-1:])

	cols := make(columns, colCount)
	colsTwo := make(columns, colCount)
	for i := len(startPosLines) - 2; i >= 0; i-- {
		line := startPosLines[i]

		for col := 0; col < len(line); col += 4 {
			letter := rune(line[col+1 : col+2][0])
			if letter == ' ' {
				continue
			}

			cols[col/4] = append(cols[col/4], letter)
			colsTwo[col/4] = append(colsTwo[col/4], letter)
		}
	}

	moves := make([]move, 0)
	for _, line := range strings.Split(strings.TrimSpace(inputParts[1]), "\n") {
		parts := strings.Split(line, " ")
		moves = append(moves, move{
			amount: parseInt(parts[1]),
			from:   parseInt(parts[3]),
			to:     parseInt(parts[5]),
		})
	}

	for _, move := range moves {
		cols = moveBlockOneByOne(cols, move.amount, move.from-1, move.to-1)
		colsTwo = moveBlockAllAtOnce(colsTwo, move.amount, move.from-1, move.to-1)
	}

	fmt.Print("Letters on top part one: ")
	for _, col := range cols {
		fmt.Print(string(col[len(col)-1]))
	}
	fmt.Println()

	fmt.Print("Letters on top part two: ")
	for _, col := range colsTwo {
		fmt.Print(string(col[len(col)-1]))
	}
	fmt.Println()
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func moveBlockOneByOne(cols columns, amount, from, to int) columns {
	for i := 0; i < amount; i++ {
		cols = moveBlockAllAtOnce(cols, 1, from, to)
	}
	return cols
}

func moveBlockAllAtOnce(cols columns, amount, from, to int) columns {
	fromLen := len(cols[from])
	letters := cols[from][fromLen-amount:]
	cols[from] = cols[from][0 : fromLen-amount]
	cols[to] = append(cols[to], letters...)
	return cols
}
