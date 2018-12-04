<?php

class SleepyGuardFinder
{
    // Guard id to total minutes asleep.
    private $guardSleepTimes = [];

    // Guard id to an array of clock minutes to amount of times asleep on that minute.
    private $guardSleepyMinutes = [];

    private $guardAsleepStartDate;

    public function analyze(Action $action)
    {
        if ($action->beginsShift()) {
            // Noop.
        } else if ($action->fallsAsleep()) {
            $this->handleFallsAsleep($action);
        } else if ($action->wakesUp()) {
            $this->handleWakesUp($action);
        } else {
            // Sanity check.
            throw new Error("Unknown action type: {$action->getAction()}");
        }
    }

    protected function handleFallsAsleep(Action $action)
    {
        $this->guardAsleepStartDate = $action->getDate();
    }

    protected function handleWakesUp(Action $action)
    {
        $id = $action->getGuardId();

        // Ensure the array keys exist.
        if (!array_key_exists($id, $this->guardSleepTimes)) {
            $this->guardSleepTimes[$id] = 0;
        }
        if (!array_key_exists($id, $this->guardSleepyMinutes)) {
            $this->guardSleepyMinutes[$id] = [];
        }

        // Calculate the minutes since the asleep start time.
        $sleepMinutes = $this->guardAsleepStartDate->diff($action->getDate())->i;
        $this->guardSleepTimes[$id] += $sleepMinutes;

        // Increment all sleepy minutes counters.
        $startMinute = $this->guardAsleepStartDate->format('i');
        for ($min = $startMinute; $min < $startMinute + $sleepMinutes; $min++) {
            // Initialize the count to 0.
            if (!array_key_exists($min, $this->guardSleepyMinutes[$id])) {
                $this->guardSleepyMinutes[$id][$min] = 0;
            }

            $this->guardSleepyMinutes[$id][$min] += 1;
        }

        $this->guardAsleepStartDate = null;
    }

    public function getSleepTimes(): array
    {
        return $this->guardSleepTimes;
    }

    public function getSleepyMinutes(): array
    {
        return $this->guardSleepyMinutes;
    }

    public function getSleepiestGuardId(): string
    {
        arsort($this->guardSleepTimes);
        return array_keys($this->guardSleepTimes)[0];
    }

    public function getSleepiestMinute(string $guardId): int
    {
        arsort($this->guardSleepyMinutes[$guardId]);
        return array_keys($this->guardSleepyMinutes[$guardId])[0];
    }
}
