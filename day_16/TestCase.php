<?php

class TestCase
{
    public $regBefore;
    public $regAfter;

    public $code;
    public $a;
    public $b;
    public $c;

    public function __construct($regBefore, $op, $regAfter)
    {
        $this->regBefore = $this->parseReg($regBefore);
        $this->regAfter = $this->parseReg($regAfter);

        // Parse the operation.
        $opParts = explode(' ', $op);
        $this->code = $opParts[0];
        $this->a = (int)$opParts[1];
        $this->b = (int)$opParts[2];
        $this->c = (int)$opParts[3];
    }

    private function parseReg($regStr)
    {
        $startI = strpos($regStr, '[');
        $regStr = substr($regStr, $startI + 1, -2);

        $parts = explode(',', $regStr);
        $reg = [];

        foreach ($parts as $part) {
            $reg[] = (int)$part;
        }

        return $reg;
    }
}
