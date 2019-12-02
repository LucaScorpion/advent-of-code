<?php

class Action
{
    const LINE_REGEX = '/^\[(\d+-\d+-\d+ \d+:\d+)\] (.*)$/';
    const ACTION_REGEX = '/^Guard #(\d+) (.*)$/';
    const DATE_FORMAT = 'Y-m-d H:i';

    private $date;
    private $guardId;
    private $action;

    private function __construct(DateTime $date, string $action, string $guardId = null)
    {
        $this->date = $date;
        $this->action = $action;
        $this->guardId = $guardId;
    }

    public static function parse(string $line): Action
    {
        $matches = [];
        preg_match(self::LINE_REGEX, $line, $matches);
        $dateStr = $matches[1];
        $action = $matches[2];

        $date = DateTime::createFromFormat(self::DATE_FORMAT, $dateStr);

        // Check for a guard id.
        $guardId = null;
        $actionMatches = [];
        if (preg_match(self::ACTION_REGEX, $action, $actionMatches)) {
            $guardId = $actionMatches[1];
            $action = $actionMatches[2];
        }

        return new Action($date, $action, $guardId);
    }

    public static function compare(Action $left, Action $right): int
    {
        return ($left->getDate() < $right->getDate()) ? -1 : 1;
    }

    public function getDate(): DateTime
    {
        return $this->date;
    }

    public function getGuardId()
    {
        return $this->guardId;
    }

    public function setGuardId(string $guardId)
    {
        $this->guardId = $guardId;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function fallsAsleep(): bool
    {
        return $this->action === 'falls asleep';
    }

    public function wakesUp(): bool
    {
        return $this->action === 'wakes up';
    }

    public function beginsShift(): bool
    {
        return $this->action === 'begins shift';
    }

    public function toString(): string
    {
        return "{$this->date->format(self::DATE_FORMAT)} #{$this->guardId} {$this->action}\n";
    }
}
