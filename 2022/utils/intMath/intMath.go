package intMath

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

func Min(left, right int) int {
	if left < right {
		return left
	}
	return right
}

func Max(left, right int) int {
	if left > right {
		return left
	}
	return right
}

func Abs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func Diff(a, b int) int {
	return Abs(a - b)
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
