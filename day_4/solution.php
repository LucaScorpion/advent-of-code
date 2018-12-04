#!/usr/bin/env php
<?php

require_once 'Action.php';
require_once 'SleepyGuardFinder.php';

// Parse all lines from stdin to an action and sort them.
$actions = [];
while ($line = fgets(STDIN)) {
    $actions[] = Action::parse($line);
}
usort($actions, 'Action::compare');

$sleepyGuardFinder = new SleepyGuardFinder();

// Set all guard ids, handle the actions.
$currentGuard = null;
foreach ($actions as $action) {
    if ($action->getGuardId()) {
        $currentGuard = $action->getGuardId();
    } else {
        $action->setGuardId($currentGuard);
    }

    $sleepyGuardFinder->analyze($action);
}

// Get the sleepiest guard.
$sleepiestGuard = $sleepyGuardFinder->getSleepiestGuardId();
$minutesAsleep = $sleepyGuardFinder->getSleepTimes()[$sleepiestGuard];
print "Sleepiest guard: #$sleepiestGuard, $minutesAsleep minutes.\n";

// Get the sleepiest guard's sleepiest minute.
$sleepiestMinute = $sleepyGuardFinder->getSleepiestMinute($sleepiestGuard);
$minuteNum = $sleepyGuardFinder->getSleepyMinutes()[$sleepiestGuard][$sleepiestMinute];
print "This guard slept $sleepiestMinute times on minute $minuteNum.\n";

$result = $sleepiestGuard * $sleepiestMinute;
print "Guard id * minute = $result\n";
