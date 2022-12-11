package utils

import (
	"io"
	"os"
	"strings"
)

func ReadStdin() string {
	bytes, _ := io.ReadAll(os.Stdin)
	return string(bytes)
}

func ReadStdinTrimmed() string {
	return strings.TrimSpace(ReadStdin())
}

func ReadStdinLines() []string {
	return strings.Split(ReadStdinTrimmed(), "\n")
}

func ReadStdinBlocks() []string {
	return strings.Split(ReadStdinTrimmed(), "\n\n")
}
