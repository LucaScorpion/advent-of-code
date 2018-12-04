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

    echo $action->toString();

    $sleepyGuardFinder->handleAction($action);
}

// Get the sleepiest guard.
$sleepiestGuard = $sleepyGuardFinder->getSleepiestGuardId();
$minutes = $sleepyGuardFinder->getSleepTimes()[$sleepiestGuard];
print "Sleepiest guard: #$sleepiestGuard, $minutes minutes.\n";
