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

print "Strategy 1:\n";
strategy1($sleepyGuardFinder);
print "\n";
print "Strategy 2:\n";
strategy2($sleepyGuardFinder);

function strategy1(SleepyGuardFinder $sleepyGuardFinder)
{
    // Get the sleepiest guard's sleepiest minute.
    $sleepiestGuard = $sleepyGuardFinder->getMostAsleepGuard();
    $sleepiestMinute = $sleepyGuardFinder->getMostAsleepMinute($sleepiestGuard);

    $minutesAsleep = $sleepyGuardFinder->getSleepTimes()[$sleepiestGuard];
    print "Sleepiest guard: #$sleepiestGuard, slept $minutesAsleep minutes.\n";

    $result = $sleepiestGuard * $sleepiestMinute;
    print "Guard id * minute = $result\n";
}

function strategy2(SleepyGuardFinder $sleepyGuardFinder)
{
    // Get all most sleepiest guard's most asleep minute.
    $sleepiestGuard = $sleepyGuardFinder->getMostSleepiestGuardId();
    $sleepiestMinute = $sleepyGuardFinder->getMostAsleepMinute($sleepiestGuard);

    $sleepCount = $sleepyGuardFinder->getSleepyMinutes()[$sleepiestGuard][$sleepiestMinute];
    print "Sleepiest guard: #$sleepiestGuard, slept $sleepCount times on minute $sleepiestMinute.\n";
    $result = $sleepiestGuard * $sleepiestMinute;
    print "Guard id * minute = $result\n";
}
