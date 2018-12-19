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
while (count(array_keys($options)) > 0) {
    foreach ($options as $code => $ops) {
        $vals = array_values($ops);

        // Check if there is a single option.
        if (count($vals) === 1) {
            $name = $vals[0];
            $opCodes[$code] = $name;

            // Remove the op from the options.
            unset($options[$code]);

            // Remove the op from all other options.
            foreach ($options as $c => $o) {
                if (($key = array_search($name, $o)) !== false) {
                    unset($options[$c][$key]);
                }
            }
        }
    }
}

print "Resolved operations:\n";
ksort($opCodes);
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
