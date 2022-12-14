package position

import (
	"aoc2022/utils/intMath"
	"strings"
)

type Position struct {
	X int
	Y int
}

func Parse(str string) Position {
	parts := strings.Split(str, ",")
	return Position{
		X: intMath.ParseInt(parts[0]),
		Y: intMath.ParseInt(parts[1]),
	}
}

func Add(left, right Position) Position {
	return Position{
		X: left.X + right.X,
		Y: left.Y + right.Y,
	}
}
