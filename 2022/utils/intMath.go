package utils

import "strconv"

func ParseInt(str string) int {
	i, err := strconv.ParseInt(str, 10, strconv.IntSize)
	if err != nil {
		panic(err)
	}
	return int(i)
}

func ParseInts(parts []string) []int {
	result := make([]int, len(parts))
	for i, part := range parts {
		result[i] = ParseInt(part)
	}
	return result
}

func MinInt(left, right int) int {
	if left < right {
		return left
	}
	return right
}

func MaxInt(left, right int) int {
	if left > right {
		return left
	}
	return right
}

func AbsInt(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func DiffInt(a, b int) int {
	return AbsInt(a - b)
}

func ClampUnit(v int) int {
	if v > 1 {
		return 1
	}
	if v < -1 {
		return -1
	}
	return v
}
