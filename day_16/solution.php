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

$options = [];

// Test all cases.
foreach ($cases as $case) {
    $validOps = [];

    foreach (OPS as $op) {
        // Execute the operation.
        $resultReg = $operations->$op($case->regBefore, $case->a, $case->b, $case->c);

        // Check if the register after matches.
        if ($resultReg === $case->regAfter) {
            $validOps[] = $op;
        }
    }

    if (count($validOps) >= 3) {
        $ambiguousOpCount++;
    }

    if (array_key_exists($case->code, $options)) {
        $options[$case->code] = array_intersect($options[$case->code], $validOps);
    } else {
        $options[$case->code] = $validOps;
    }
}

print "Found $ambiguousOpCount ambiguous (>2) operations.\n";

// Resolve all opcodes.
$opCodes = [];
foreach ($options as $code => $ops) {
    $vals = array_values($ops);
    if (count($vals) === 1) {
        $opCodes[$code] = $vals[0];
    }
}

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
