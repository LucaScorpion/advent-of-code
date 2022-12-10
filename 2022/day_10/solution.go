package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

type instruction struct {
	cmd string
	arg int
}

type state struct {
	cycle       int
	regX        int
	sigStrength int
}

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	instructions := make([]instruction, 0)
	for _, line := range lines {
		parts := strings.Split(line, " ")

		arg := 0
		if len(parts) > 1 {
			arg = parseInt(parts[1])
		}

		instructions = append(instructions, instruction{
			cmd: parts[0],
			arg: arg,
		})
	}

	s := state{
		cycle: 1,
		regX:  1,
	}
	s.run(instructions)

	fmt.Printf("Sum of signal strengths: %d\n", s.sigStrength)
}

func (s *state) run(instructions []instruction) {
	for _, instr := range instructions {
		switch instr.cmd {
		case "noop":
			s.nextCycle()
		case "addx":
			s.nextCycle()
			s.nextCycle()
			s.regX += instr.arg
		default:
			panic("Unknown instruction!")
		}
	}
}

func (s *state) nextCycle() {
	if (s.cycle-20)%40 == 0 {
		s.sigStrength += s.cycle * s.regX
	}

	s.cycle++
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}
