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
