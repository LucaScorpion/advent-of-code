package main

import (
	"aoc2023/utils"
	"aoc2023/utils/position"
	"fmt"
	"strings"
)

type pack []position.Position

func main() {
	lines := utils.ReadStdinLines()

	packs := make([]pack, len(lines))
	for i, line := range lines {
		packs[i] = parsePack(line)
	}

	total := 0
	for _, pack := range packs {
		radius := 0

		for _, corner := range pack {
			check := position.DistCeil(position.Position{}, corner)
			if check > radius {
				radius = check
			}
		}

		total += radius
	}

	fmt.Printf("Sum of radii: %v\n", total)
}

func parsePack(line string) pack {
	parts := strings.Split(line, "), ")
	corners := make(pack, len(parts))
	for i, part := range parts {
		corners[i] = position.Parse(part)
	}
	return corners
}
