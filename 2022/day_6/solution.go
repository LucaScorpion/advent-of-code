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

	for i := 4; i < len(input); i++ {
		if allUnique(input[i-4 : i]) {
			fmt.Printf("Marker position: %d\n", i)
			break
		}
	}
}

func allUnique(str string) bool {
	for i := 0; i < len(str); i++ {
		if strings.IndexRune(str, rune(str[i])) != i {
			return false
		}
	}
	return true
}
