<?php

class Cell
{
    private $rackId;
    private $power;

    public function __construct(int $serial, int $x, int $y)
    {
        $this->rackId = $x + 10;
        $power = ($this->rackId * $y + $serial) * $this->rackId;

        // Get the 100 digit.
        $strPower = (string)$power;
        $strPowerLen = strlen($strPower);
        $hDigit = $strPowerLen > 2 ? (int)substr($strPower, $strPowerLen - 3, 1) : 0;

        $this->power = $hDigit - 5;
    }

    public function getPower(): int
    {
        return $this->power;
    }
}
