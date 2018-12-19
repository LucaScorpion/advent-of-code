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

$opCodes = [];

// Test all cases.
foreach ($cases as $case) {
    $validOps = 0;
    $opName = null;

    foreach (OPS as $op) {
        // Execute the operation.
        $resultReg = $operations->$op($case->regBefore, $case->a, $case->b, $case->c);

        // Check if the register after matches.
        if ($resultReg === $case->regAfter) {
            $validOps++;
            $opName = $op;
        }
    }

    if ($validOps >= 3) {
        $ambiguousOpCount++;
    }

    if ($validOps === 1) {
        $opCodes[$case->code] = $opName;
    }
}

print "Found $ambiguousOpCount ambiguous (>2) operations.\n";

print "Resolved operations:\n";
foreach ($opCodes as $code => $name) {
    print "$code: $name\n";
}

/* Helper operations. */

function store($regs, $target, $val)
{
    if ($target >= count($regs) || $val === null) {
        return false;
    }

    $regs[$target] = $val;
    return $regs;
}
