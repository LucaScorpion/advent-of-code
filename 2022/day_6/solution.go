package main

import (
	"fmt"
	"io"
	"os"
	"strings"
)

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	input := strings.TrimSpace(string(bytes))

	fmt.Printf("Packet marker position: %d\n", findMarker(input, 4))
	fmt.Printf("Message marker position: %d\n", findMarker(input, 14))
}

func findMarker(input string, unique int) int {
	for i := unique; i < len(input); i++ {
		if allUnique(input[i-unique : i]) {
			return i
		}
	}
	panic("No marker found!")
}

func allUnique(str string) bool {
	for i := 0; i < len(str); i++ {
		if strings.IndexRune(str, rune(str[i])) != i {
			return false
		}
	}
	return true
}
