package main

import (
	"fmt"
	"io"
	"math"
	"os"
	"strconv"
	"strings"
)

type entry struct {
	name      string
	size      int
	isDir     bool
	children  []*entry
	totalSize int
}

const smallDirSize = 100000
const totalDiskSize = 70000000
const requiredFreeSpace = 30000000

func main() {
	bytes, _ := io.ReadAll(os.Stdin)
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	root := &entry{
		isDir:    true,
		children: make([]*entry, 0),
	}
	current := root

	pwd := "/"
	for i := 0; i < len(lines); i++ {
		line := lines[i]
		cmd := line[2:4]

		if cmd == "ls" {
			next := i + 1
			for ; next < len(lines) && lines[next][0] != '$'; next++ {
				current.children = append(current.children, newEntry(lines[next]))
			}
			i = next - 1
		} else if cmd == "cd" {
			arg := line[5:]
			pwd = resolveCd(pwd, arg)
			current = getEntry(root, pwd)
		} else {
			panic("Unknown command!")
		}
	}

	calcTotalSize(root)

	fmt.Printf("Sum of small directories: %d\n", sumOfSmallDirs(root))

	toRemove := requiredFreeSpace - (totalDiskSize - root.totalSize)
	fmt.Printf("Smallest directory to be removed: %d\n", smallestRemovableDir(root, toRemove))
}

func smallestRemovableDir(root *entry, minRemoveSize int) int {
	smallest := math.MaxInt32

	if root.totalSize >= minRemoveSize && root.totalSize < smallest {
		smallest = root.totalSize
	}

	for _, child := range root.children {
		if child.isDir {
			smallest = min(smallest, smallestRemovableDir(child, minRemoveSize))
		}
	}

	return smallest
}

func sumOfSmallDirs(root *entry) int {
	sum := 0

	if root.isDir && root.totalSize <= smallDirSize {
		sum += root.totalSize
	}

	for _, child := range root.children {
		sum += sumOfSmallDirs(child)
	}

	return sum
}

func calcTotalSize(root *entry) {
	totalSize := 0

	for _, child := range root.children {
		if child.isDir {
			calcTotalSize(child)
		}

		totalSize += child.totalSize
	}

	root.totalSize = totalSize
}

func resolveCd(pwd, cd string) string {
	if cd[0] == '/' {
		return "/"
	}

	if cd == ".." {
		newPwd := pwd[:strings.LastIndex(pwd, "/")]
		if newPwd == "" {
			newPwd = "/"
		}
		return newPwd
	}

	sep := "/"
	if pwd[len(pwd)-1] == '/' {
		sep = ""
	}
	return fmt.Sprintf("%s%s%s", pwd, sep, cd)
}

func getEntry(root *entry, pwd string) *entry {
	current := root
	pwdParts := strings.Split(pwd, "/")

	for _, part := range pwdParts {
		for _, child := range current.children {
			if child.name == part {
				current = child
				break
			}
		}
	}

	return current
}

func newEntry(line string) *entry {
	parts := strings.Split(line, " ")
	isDir := parts[0] == "dir"
	size := 0
	totalSize := 0

	if !isDir {
		size = parseInt(parts[0])
		totalSize = size
	}

	return &entry{
		name:      parts[1],
		size:      size,
		isDir:     isDir,
		children:  make([]*entry, 0),
		totalSize: totalSize,
	}
}

func parseInt(str string) int {
	i, _ := strconv.ParseInt(str, 10, strconv.IntSize)
	return int(i)
}

func min(left, right int) int {
	if left < right {
		return left
	}
	return right
}
