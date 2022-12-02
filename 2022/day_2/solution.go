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

var decryptionTwo = map[string]gameResult{
	"X": lose,
	"Y": draw,
	"Z": win,
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

	guideOne := make([]strategy, 0)
	guideTwo := make([]strategy, 0)

	for _, line := range lines {
		parts := strings.Split(line, " ")
		opponent := decryption[parts[0]]

		guideOne = append(guideOne, strategy{
			opponent: opponent,
			you:      decryption[parts[1]],
		})

		wantedOutcome := decryptionTwo[parts[1]]
		var you shape
		for s := 0; s < 3; s++ {
			you = shape(s)
			if getOutcome(you, opponent) == wantedOutcome {
				break
			}
		}

		guideTwo = append(guideTwo, strategy{
			opponent: opponent,
			you:      you,
		})
	}

	fmt.Printf("Total score part one: %d\n", getScore(guideOne))
	fmt.Printf("Total score part two: %d\n", getScore(guideTwo))
}

func getScore(guide []strategy) int {
	score := 0
	for _, g := range guide {
		score += shapeScores[g.you]
		score += gameResultScores[getOutcome(g.you, g.opponent)]
	}
	return score
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
