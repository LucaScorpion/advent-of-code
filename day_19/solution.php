#!/usr/bin/env php
<?php

require_once 'Instruction.php';
require_once 'Program.php';

// Load the program.
$ip = substr(fgets(STDIN), 4, -1);
$instructions = [];
while ($line = fgets(STDIN)) {
    $instructions[] = new Instruction($line);
}

run(1, [0, 0, 0, 0, 0, 0], $ip, $instructions);
//run(2, [1, 0, 0, 0, 0, 0], $ip, $instructions);
print "Run 2:\nOh look, it's a halting problem. The answer is: 25945920\n";

function run($id, $initReg, $ip, $instructions)
{
    print "Run $id:\n";
    $program = new Program($initReg, $ip, $instructions);
    $result = $program->run();
    print 'Registers: [ ' . join(', ', $result) . " ]\n";
}
