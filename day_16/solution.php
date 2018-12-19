#!/usr/bin/env php
<?php

require_once 'Operations.php';
require_once 'TestCase.php';

$ambiguousOpCount = 0;
$cases = [];

$operations = new Operations();

// Load all cases.
while ($before = fgets(STDIN)) {
    $op = substr(fgets(STDIN), 0, -1); // Op.
    $after = fgets(STDIN); // After.
    fgets(STDIN); // Blank line.

    $cases[] = new TestCase($before, $op, $after);
}
print 'Loaded ' . count($cases) . " cases.\n";

// Test all cases.
foreach ($cases as $case) {
    $validOps = 0;

    foreach (OPS as $op) {
        // Execute the operation.
        $resultReg = $operations->$op($case->regBefore, $case->a, $case->b, $case->c);

        // Check if the register after matches.
        if ($resultReg === $case->regAfter) {
            $validOps++;
        }
    }

    if ($validOps >= 3) {
        $ambiguousOpCount++;
    }
}

print "Found {$ambiguousOpCount} ambiguous operations.\n";

/* Helper operations. */

function store($regs, $target, $val)
{
    if ($target >= count($regs) || $val === null) {
        return false;
    }

    $regs[$target] = $val;
    return $regs;
}
