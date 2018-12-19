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

$program = new Program($ip, $instructions);
$result = $program->run();
print 'Registers: [ ' . join(', ', $result) . " ]\n";
