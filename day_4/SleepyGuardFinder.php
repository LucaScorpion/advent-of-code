<?php

class SleepyGuardFinder
{
    // Guard id to minutes asleep.
    private $guardSleepTimes = [];

    private $guardAsleepStartDate = null;

    public function handleAction(Action $action)
    {
        if (!array_key_exists($action->getGuardId(), $this->guardSleepTimes)) {
            $this->guardSleepTimes[$action->getGuardId()] = 0;
        }

        if ($action->fallsAsleep()) {
            $this->guardAsleepStartDate = $action->getDate();
        } else if ($action->wakesUp()) {
            // Calculate the minutes since the asleep start time.
            $sleepMinutes = $this->guardAsleepStartDate->diff($action->getDate())->i;
            $this->guardSleepTimes[$action->getGuardId()] += $sleepMinutes;

            $this->guardAsleepStartDate = null;
        } else if (!$action->beginsShift()) {
            // Sanity check.
            throw new Error("Unknown action type: {$action->getAction()}");
        }
    }

    public function getSleepiestGuardId(): string
    {
        arsort($this->guardSleepTimes);
        var_dump($this->guardSleepTimes);
        return array_keys($this->guardSleepTimes)[0];
    }

    public function getSleepTimes(): array
    {
        return $this->guardSleepTimes;
    }
}
