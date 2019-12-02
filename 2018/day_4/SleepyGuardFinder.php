<?php

class SleepyGuardFinder
{
    // Guard id to total minutes asleep.
    private $guardMinutesAsleep = [];

    // Guard id to an array of clock minutes to amount of times asleep on that minute.
    private $guardMinuteSleepCount = [];

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
        if (!array_key_exists($id, $this->guardMinutesAsleep)) {
            $this->guardMinutesAsleep[$id] = 0;
        }
        if (!array_key_exists($id, $this->guardMinuteSleepCount)) {
            $this->guardMinuteSleepCount[$id] = [];
        }

        // Calculate the minutes since the asleep start time.
        $sleepMinutes = $this->guardAsleepStartDate->diff($action->getDate())->i;
        $this->guardMinutesAsleep[$id] += $sleepMinutes;

        // Increment all sleepy minutes counters.
        $startMinute = $this->guardAsleepStartDate->format('i');
        for ($min = $startMinute; $min < $startMinute + $sleepMinutes; $min++) {
            // Initialize the count to 0.
            if (!array_key_exists($min, $this->guardMinuteSleepCount[$id])) {
                $this->guardMinuteSleepCount[$id][$min] = 0;
            }

            $this->guardMinuteSleepCount[$id][$min] += 1;
        }

        $this->guardAsleepStartDate = null;
    }

    public function getSleepTimes(): array
    {
        return $this->guardMinutesAsleep;
    }

    public function getSleepyMinutes(): array
    {
        return $this->guardMinuteSleepCount;
    }

    public function getMostAsleepGuard(): string
    {
        arsort($this->guardMinutesAsleep);
        return array_keys($this->guardMinutesAsleep)[0];
    }

    public function getMostAsleepMinute(string $guardId): int
    {
        arsort($this->guardMinuteSleepCount[$guardId]);
        return array_keys($this->guardMinuteSleepCount[$guardId])[0];
    }

    public function getMostSleepiestGuardId(): string
    {
        $guard = null;
        $count = 0;

        foreach ($this->guardMinuteSleepCount as $id => $minutes) {
            $min = $this->getMostAsleepMinute($id);
            $newCount = $minutes[$min];
            if ($newCount > $count) {
                $guard = $id;
                $count = $newCount;
            }
        }

        return $guard;
    }
}
