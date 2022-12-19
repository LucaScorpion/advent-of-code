package main

import (
	"aoc2022/utils"
	"aoc2022/utils/intMath"
	"aoc2022/utils/position"
	"fmt"
	"strings"
)

type sensor struct {
	pos    position.Position
	beacon position.Position
}

const checkRow = 2000000

func main() {
	lines := utils.ReadStdinLines()

	beacons := make([]position.Position, 0)
	sensors := make([]sensor, len(lines))

	checkedCells := make(map[position.Position]bool)

	for i, line := range lines {
		lineParts := strings.Split(line, ": ")
		sensorCoordParts := strings.Split(lineParts[0][12:], ", y=")
		beaconCoordParts := strings.Split(lineParts[1][23:], ", y=")

		b := position.Position{
			X: intMath.ParseInt(beaconCoordParts[0]),
			Y: intMath.ParseInt(beaconCoordParts[1]),
		}

		checkedCells[b] = true

		beacons = append(beacons, b)
		sensors[i] = sensor{
			pos: position.Position{
				X: intMath.ParseInt(sensorCoordParts[0]),
				Y: intMath.ParseInt(sensorCoordParts[1]),
			},
			beacon: b,
		}
	}

	noBeaconCount := 0
	for _, s := range sensors {
		closestDist := position.ManhattanDist(s.pos, s.beacon)

		noBeaconCount += checkDirection(s, checkedCells, s.pos.X, closestDist, -1)
		noBeaconCount += checkDirection(s, checkedCells, s.pos.X+1, closestDist, 1)
	}

	fmt.Printf("Positions where a beacon cannot be present: %d\n", noBeaconCount)
}

func checkDirection(s sensor, checkedCells map[position.Position]bool, startX, closestDist, dir int) int {
	total := 0
	for dX := 0; ; dX += dir {
		checkPos := position.Position{
			X: startX + dX,
			Y: checkRow,
		}
		checkDist := position.ManhattanDist(s.pos, checkPos)

		if checkDist > closestDist {
			break
		}

		if _, ok := checkedCells[checkPos]; ok {
			continue
		}

		total++
		checkedCells[checkPos] = true
	}

	return total
}
