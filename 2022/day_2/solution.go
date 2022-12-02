package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type shape int

const (
	rock shape = iota
	paper
	scissors
)

var decryption = map[string]shape{
	"A": rock,
	"B": paper,
	"C": scissors,
	"X": rock,
	"Y": paper,
	"Z": scissors,
}

var shapeScores = map[shape]int{
	rock:     1,
	paper:    2,
	scissors: 3,
}

type gameResult int

const (
	win gameResult = iota
	draw
	lose
)

type strategy struct {
	opponent shape
	you      shape
}

var gameResultScores = map[gameResult]int{
	win:  6,
	draw: 3,
	lose: 0,
}

func main() {
	stdin := bufio.NewScanner(os.Stdin)
	lines := make([]string, 0)
	for stdin.Scan() {
		lines = append(lines, stdin.Text())
	}

	guide := make([]strategy, 0)
	for _, line := range lines {
		parts := strings.Split(line, " ")
		guide = append(guide, strategy{
			opponent: decryption[parts[0]],
			you:      decryption[parts[1]],
		})
	}

	totalScore := 0
	for _, g := range guide {
		totalScore += shapeScores[g.you]
		totalScore += gameResultScores[getOutcome(g.you, g.opponent)]
	}

	fmt.Printf("Total score: %d\n", totalScore)
}

func getOutcome(you shape, opponent shape) gameResult {
	if you == opponent {
		return draw
	}

	betterShape := (you + 1) % 3
	if opponent == betterShape {
		return lose
	}

	return win
}
