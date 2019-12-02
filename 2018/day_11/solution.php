#!/usr/bin/env php
<?php

require_once 'Cell.php';

$gridSerial = (int)fgets(STDIN);
$grid = [];
$squareSize = 3;

$maxPower = 0;
$maxX = -1;
$maxY = -1;

for ($x = 0; $x < 300; $x++) {
    $grid[$x] = [];
    for ($y = 0; $y < 300; $y++) {
        $grid[$x][$y] = new Cell($gridSerial, $x + 1, $y + 1);

        // Check if we can check a square.
        if ($x >= $squareSize - 1 && $y >= $squareSize - 1) {
            $power = 0;

            for ($dX = -($squareSize - 1); $dX <= 0; $dX++) {
                for ($dY = -($squareSize - 1); $dY <= 0; $dY++) {
                    $cell = $grid[$x + $dX][$y + $dY];
                    $power += $cell->getPower();
                }
            }

            if ($power > $maxPower) {
                $maxPower = $power;
                $maxX = $x - ($squareSize - 2);
                $maxY = $y - ($squareSize - 2);
            }
        }
    }
}

print "Found square with power $maxPower at ($maxX,$maxY).\n";
