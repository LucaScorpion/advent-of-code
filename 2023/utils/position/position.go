package position

import (
	"aoc2023/utils/intMath"
	"math"
	"strings"
)

type Position struct {
	X int
	Y int
}

func Parse(str string) Position {
	if str[0] == '(' {
		str = str[1:]
	}
	if str[len(str)-1] == ')' {
		str = str[:len(str)-1]
	}

	parts := strings.Split(str, ",")
	return Position{
		X: intMath.ParseInt(strings.TrimSpace(parts[0])),
		Y: intMath.ParseInt(strings.TrimSpace(parts[1])),
	}
}

func Add(left, right Position) Position {
	return Position{
		X: left.X + right.X,
		Y: left.Y + right.Y,
	}
}

func Sub(left, right Position) Position {
	return Position{
		X: left.X - right.X,
		Y: left.Y - right.Y,
	}
}

func ManhattanDist(left, right Position) int {
	return intMath.Diff(left.X, right.X) + intMath.Diff(left.Y, right.Y)
}

func DistCeil(left, right Position) int {
	pos := Sub(right, left)
	return int(math.Ceil(math.Sqrt(math.Pow(float64(pos.X), 2) + math.Pow(float64(pos.Y), 2))))
}
