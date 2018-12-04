#!/usr/bin/env php
<?php

require_once 'Action.php';

// Parse all lines from stdin to an action.
$actions = [];
while ($line = fgets(STDIN)) {
    $actions[] = Action::parse($line);
}

// Sort the actions and set all guard ids.
usort($actions, 'Action::compare');
$lastId = null;
foreach ($actions as $action) {
    if ($action->getGuardId()) {
        $lastId = $action->getGuardId();
    } else {
        $action->setGuardId($lastId);
    }

    echo $action->toString();
}
