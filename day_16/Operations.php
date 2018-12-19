<?php

define('OPS', [
    'addr', 'addi',
    'mulr', 'muli',
    'banr', 'bani',
    'borr', 'bori',
    'setr', 'seti',
    'gtir', 'gtri', 'gtrr',
    'eqir', 'eqri', 'eqrr',
]);

class Operations
{
    private $binOps = ['add', 'mul', 'ban', 'bor'];
    private $testOps = ['gt', 'eq'];

    public function __call($name, $arguments)
    {
        // Current register.
        $reg = $arguments[0];
        // Input 1.
        $a = $arguments[1];
        // Input 2.
        $b = $arguments[2];
        // Output register.
        $c = $arguments[3];

        $opName = substr($name, 0, 3);
        // i or r.
        $opType = substr($name, 3, 1);

        if (in_array($opName, $this->binOps)) {
            // a is a register.
            $aVal = $reg[$a];

            // b is a register or value.
            $bVal = $b;
            if ($opType === 'r') {
                $bVal = $reg[$b];
            }

            $result = $this->$opName($aVal, $bVal);
            $reg[$c] = $result;
        } else if (in_array(substr($name, 0, 2), $this->testOps)) {
            // a and b are both registers or values.

            $aVal = $a;
            if (substr($name, 2, 1) === 'r') {
                $aVal = $reg[$a];
            }

            $bVal = $b;
            if ($opType === 'r') {
                $bVal = $reg[$b];
            }

            $opName = substr($name, 0, 2);
            $reg[$c] = $this->$opName($aVal, $bVal) ? 1 : 0;
        } else if ($opName === 'set') {
            // Ignore b.

            // a is a register or value.
            $aVal = $a;
            if ($opType === 'r') {
                $aVal = $reg[$a];
            }

            $reg[$c] = $aVal;
        } else {
            throw new Error("Invalid operation: $name");
        }

        return $reg;
    }

    private function add($a, $b)
    {
        return $a + $b;
    }

    private function mul($a, $b)
    {
        return $a * $b;
    }

    private function ban($a, $b)
    {
        return $a & $b;
    }

    private function bor($a, $b)
    {
        return $a | $b;
    }

    private function eq($a, $b)
    {
        return $a === $b;
    }

    private function gt($a, $b)
    {
        return $a > $b;
    }
}
