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
run(2, [1, 0, 0, 0, 0, 0], $ip, $instructions);

function run($id, $initReg, $ip, $instructions)
{
    print "Run $id:\n";
    $program = new Program($initReg, $ip, $instructions);
    $result = $program->run();
    print 'Registers: [ ' . join(', ', $result) . " ]\n";
}
