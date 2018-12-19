<?php

require_once 'Instruction.php';

class TestCase
{
    public $regBefore;
    public $op;
    public $regAfter;

    public function __construct($regBefore, $op, $regAfter)
    {
        $this->regBefore = $this->parseReg($regBefore);
        $this->op = new Instruction($op);
        $this->regAfter = $this->parseReg($regAfter);
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
