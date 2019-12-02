#!/usr/bin/env php
<?php

require_once 'Operations.php';
require_once 'TestCase.php';
require_once 'Instruction.php';

$ambiguousOpCount = 0;
$cases = [];
$program = [];

$operations = new Operations();

// Load all cases.
while ($before = fgets(STDIN)) {
    $op = substr(fgets(STDIN), 0, -1); // Op.
    // Check if we are at the example program.
    if ($op === '') {
        break;
    }
    $after = fgets(STDIN); // After.

    fgets(STDIN); // Blank line.

    $cases[] = new TestCase($before, $op, $after);
}
print 'Loaded ' . count($cases) . " cases.\n";

// Load the test program.
while ($line = fgets(STDIN)) {
    $program[] = new Instruction($line);
}

$options = [];

// Test all cases.
foreach ($cases as $case) {
    $validOps = [];

    foreach (OPS as $op) {
        // Execute the operation.
        $resultReg = $operations->execute($op, $case->regBefore, $case->op->a, $case->op->b, $case->op->c);

        // Check if the register after matches.
        if ($resultReg === $case->regAfter) {
            $validOps[] = $op;
        }
    }

    if (count($validOps) >= 3) {
        $ambiguousOpCount++;
    }

    if (array_key_exists($case->op->code, $options)) {
        $options[$case->op->code] = array_intersect($options[$case->op->code], $validOps);
    } else {
        $options[$case->op->code] = $validOps;
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

// Run the test program.
$testRegister = [0, 0, 0, 0];
foreach ($program as $instruction) {
    $testRegister = $operations->execute(
        $opCodes[$instruction->code],
        $testRegister,
        $instruction->a,
        $instruction->b,
        $instruction->c
    );
}
print 'Test program registers: [ ' . join(', ', $testRegister) . " ]\n";
